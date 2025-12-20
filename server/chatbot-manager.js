// CHATBOT MANAGER - E-KIDS PRO
// Sistema de chatbot local usando Ollama
// Mascote interativo, tutor educacional e mentor

const axios = require('axios');

class ChatbotManager {
  constructor(db, ollamaUrl = 'http://localhost:11434') {
    this.db = db;
    this.ollamaUrl = ollamaUrl;
    this.model = 'llama3.2:3b'; // Modelo padrão

    // Inicializar tabelas
    this.initializeTables();
  }

  // ============================================
  // INICIALIZAÇÃO
  // ============================================

  initializeTables() {
    // Tabela de conversas
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS chat_conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        child_id INTEGER NOT NULL,
        context_type TEXT NOT NULL,
        context_data TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        last_message_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
        content TEXT NOT NULL,
        tokens_used INTEGER DEFAULT 0,
        response_time_ms INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_chat_conversations_child ON chat_conversations(child_id);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id);
    `);
  }

  // ============================================
  // SISTEMA DE PROMPTS
  // ============================================

  getSystemPrompt(contextType, childData) {
    const basePrompt = `Você é a Lu 👧, uma assistente virtual amigável e divertida do E-Kids PRO, um aplicativo educacional para crianças de 5 a 12 anos.

IDENTIDADE:
- Seu nome é Lu
- Você é alegre, carinhosa e sempre pronta para ajudar
- Você adora aprender junto com as crianças

REGRAS ABSOLUTAS:
- Use linguagem SIMPLES e INFANTIL
- Seja SEMPRE positiva e encorajadora
- NUNCA use termos técnicos ou complexos
- Respostas CURTAS (máximo 3 frases)
- Use emojis moderadamente 💜✨
- NUNCA fale sobre violência, política ou temas adultos
- SEMPRE incentive aprendizado e crescimento
- Seja amigável como uma amiga da mesma idade

DADOS DA CRIANÇA:
- Nome: ${childData.name}
- Idade aproximada: ${this.getAgeGroupLabel(childData.age_group)}
- FP atual: ${childData.total_fp || 0}
`;

    const contextPrompts = {
      general: `
Você está conversando livremente com ${childData.name}.
Seja divertido, educativo e motivador!
Pergunte sobre o dia, interesses, ou sugira atividades.`,

      financial: `
CONTEXTO: Educação Financeira
Você está ajudando ${childData.name} a entender sobre guardar FP (pontos de esforço).
- FP não é dinheiro real, é valor por esforço
- Incentive poupar sem pressionar
- Explique benefícios de forma lúdica
- Ajude a criar metas alcançáveis`,

      nature: `
CONTEXTO: Natureza e Meio Ambiente
Você está ensinando ${childData.name} sobre cuidar de plantas e animais.
- Use exemplos simples da natureza
- Incentive empatia com seres vivos
- Fale sobre responsabilidade ambiental de forma leve
- Sem culpa, apenas educação positiva`,

      hygiene: `
CONTEXTO: Higiene e Autocuidado
Você está ajudando ${childData.name} a criar hábitos saudáveis.
- Explique POR QUE higiene é importante
- Seja gentil e não assustador
- Use comparações lúdicas
- Celebre pequenos progressos`,

      tutor: `
CONTEXTO: Tutor Educacional
Você está ajudando ${childData.name} com dúvidas sobre lições.
- Explique de forma MUITO simples
- Use exemplos práticos do dia a dia
- Incentive a curiosidade
- Nunca dê respostas diretas, guie o raciocínio`
    };

    return basePrompt + (contextPrompts[contextType] || contextPrompts.general);
  }

  getAgeGroupLabel(ageGroup) {
    const labels = {
      1: '5-6 anos',
      2: '7-8 anos',
      3: '9-10 anos',
      4: '11-12 anos'
    };
    return labels[ageGroup] || '5-12 anos';
  }

  // ============================================
  // CONVERSAÇÃO
  // ============================================

  /**
   * Envia mensagem e recebe resposta do chatbot
   */
  async chat(childId, message, contextType = 'general', conversationId = null) {
    const startTime = Date.now();

    try {
      // Buscar dados da criança
      const child = this.db.prepare('SELECT * FROM children WHERE id = ?').get(childId);
      if (!child) {
        throw new Error('Criança não encontrada');
      }

      // Obter ou criar conversação
      if (!conversationId) {
        conversationId = this.createConversation(childId, contextType);
      }

      // Buscar histórico recente (últimas 10 mensagens)
      const history = this.getConversationHistory(conversationId, 10);

      // Montar prompt do sistema
      const systemPrompt = this.getSystemPrompt(contextType, child);

      // Montar mensagens para o modelo
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message }
      ];

      // Chamar Ollama
      const response = await this.callOllama(messages);

      // Salvar mensagem do usuário
      this.saveMessage(conversationId, 'user', message);

      // Salvar resposta do assistente
      const responseTime = Date.now() - startTime;
      this.saveMessage(conversationId, 'assistant', response.content, response.tokens || 0, responseTime);

      // Atualizar timestamp da conversação
      this.db.prepare('UPDATE chat_conversations SET last_message_at = datetime("now") WHERE id = ?')
        .run(conversationId);

      return {
        conversationId,
        message: response.content,
        tokens: response.tokens || 0,
        responseTime
      };

    } catch (error) {
      console.error('Erro no chat:', error);

      // Fallback para resposta padrão
      return {
        conversationId: conversationId || 0,
        message: this.getFallbackResponse(contextType),
        tokens: 0,
        responseTime: Date.now() - startTime,
        error: true
      };
    }
  }

  /**
   * Chama a API do Ollama
   */
  async callOllama(messages) {
    try {
      const response = await axios.post(`${this.ollamaUrl}/api/chat`, {
        model: this.model,
        messages: messages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 150 // Respostas curtas
        }
      }, {
        timeout: 30000 // 30 segundos timeout
      });

      return {
        content: response.data.message.content.trim(),
        tokens: response.data.eval_count || 0
      };
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Ollama não está rodando. Execute: ollama serve');
      }
      throw error;
    }
  }

  /**
   * Respostas fallback caso Ollama não esteja disponível
   */
  getFallbackResponse(contextType) {
    const responses = {
      general: [
        "Oi! Eu sou a Lu e estou aqui para te ajudar! 😊💜",
        "Que legal! Me conta mais sobre isso!",
        "Você está indo muito bem! Continue assim! 🌟"
      ],
      financial: [
        "Guardar FP é como plantar sementes! 🌱 Um dia vira uma árvore grande!",
        "Que legal que você quer poupar! Isso mostra que você é inteligente! 💡",
        "Vamos criar uma meta juntos? O que você quer conseguir?"
      ],
      nature: [
        "As plantas e animais precisam de cuidado, assim como você! 🌱",
        "Cuidar da natureza é um superpoder! 🦸‍♂️",
        "Você sabia que as plantas sentem quando cuidamos delas?"
      ],
      hygiene: [
        "Cuidar do corpo é cuidar de você mesmo! 🧼",
        "Seus dentes vão agradecer! Continue assim! 😁",
        "Que legal! Você está criando hábitos de campeão! 💪"
      ]
    };

    const contextResponses = responses[contextType] || responses.general;
    return contextResponses[Math.floor(Math.random() * contextResponses.length)];
  }

  // ============================================
  // CONVERSAÇÕES E HISTÓRICO
  // ============================================

  createConversation(childId, contextType, contextData = null) {
    const result = this.db.prepare(`
      INSERT INTO chat_conversations (child_id, context_type, context_data)
      VALUES (?, ?, ?)
    `).run(childId, contextType, contextData ? JSON.stringify(contextData) : null);

    return result.lastInsertRowid;
  }

  getConversationHistory(conversationId, limit = 10) {
    const messages = this.db.prepare(`
      SELECT role, content FROM chat_messages
      WHERE conversation_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `).all(conversationId, limit);

    return messages.reverse(); // Ordem cronológica
  }

  saveMessage(conversationId, role, content, tokens = 0, responseTime = 0) {
    this.db.prepare(`
      INSERT INTO chat_messages (conversation_id, role, content, tokens_used, response_time_ms)
      VALUES (?, ?, ?, ?, ?)
    `).run(conversationId, role, content, tokens, responseTime);
  }

  getChildConversations(childId, limit = 10) {
    return this.db.prepare(`
      SELECT
        cc.*,
        COUNT(cm.id) as message_count,
        (SELECT content FROM chat_messages
         WHERE conversation_id = cc.id
         ORDER BY created_at DESC LIMIT 1) as last_message
      FROM chat_conversations cc
      LEFT JOIN chat_messages cm ON cc.id = cm.conversation_id
      WHERE cc.child_id = ?
      GROUP BY cc.id
      ORDER BY cc.last_message_at DESC
      LIMIT ?
    `).all(childId, limit);
  }

  deleteConversation(conversationId) {
    // Messages são deletadas em cascata
    this.db.prepare('DELETE FROM chat_conversations WHERE id = ?').run(conversationId);
  }

  // ============================================
  // SUGESTÕES CONTEXTUAIS
  // ============================================

  /**
   * Gera sugestões de mensagens com base no contexto
   */
  getSuggestions(contextType, childData) {
    const suggestions = {
      general: [
        "Como foi seu dia?",
        "O que você aprendeu hoje?",
        "Quer uma dica legal?",
        "Me conta uma coisa legal!"
      ],
      financial: [
        "Por que guardar FP?",
        "Como criar uma meta?",
        "Quanto devo poupar?",
        "O que posso comprar com FP?"
      ],
      nature: [
        "Como cuidar de plantas?",
        "Por que respeitar animais?",
        "Como ajudar o planeta?",
        "O que fazer com lixo?"
      ],
      hygiene: [
        "Por que lavar as mãos?",
        "Como escovar os dentes?",
        "Por que tomar banho?",
        "Quando trocar de roupa?"
      ]
    };

    return suggestions[contextType] || suggestions.general;
  }

  // ============================================
  // PERSONALIDADE DO MASCOTE
  // ============================================

  /**
   * Mensagem de boas-vindas personalizada
   */
  getWelcomeMessage(childName, contextType) {
    const welcomes = {
      general: `Oi ${childName}! 👋 Eu sou a Lu, sua assistente! Como posso te ajudar hoje? 💜`,
      financial: `E aí ${childName}! 💰 Sou a Lu! Vamos falar sobre como guardar seus FP?`,
      nature: `Olá ${childName}! 🌱 Eu sou a Lu! Preparado para aprender sobre a natureza?`,
      hygiene: `Oi ${childName}! 🧼 Sou a Lu! Vamos criar hábitos incríveis juntos?`,
      tutor: `Olá ${childName}! 📚 Eu sou a Lu e estou aqui para te ajudar a aprender!`
    };

    return welcomes[contextType] || welcomes.general;
  }

  /**
   * Mensagem motivacional aleatória
   */
  getMotivationalMessage(childName) {
    const messages = [
      `${childName}, você está arrasando! 🌟`,
      `Cada pequeno passo conta, ${childName}! 👣`,
      `Você é incrível, ${childName}! Continue assim! 💪`,
      `${childName}, você está crescendo e aprendendo tanto! 🚀`,
      `Que orgulho de você, ${childName}! 🎉`
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  // ============================================
  // ESTATÍSTICAS
  // ============================================

  getChatStats(childId) {
    const stats = this.db.prepare(`
      SELECT
        COUNT(DISTINCT cc.id) as total_conversations,
        COUNT(cm.id) as total_messages,
        AVG(cm.response_time_ms) as avg_response_time,
        SUM(cm.tokens_used) as total_tokens
      FROM chat_conversations cc
      LEFT JOIN chat_messages cm ON cc.id = cm.conversation_id
      WHERE cc.child_id = ?
    `).get(childId);

    const contextBreakdown = this.db.prepare(`
      SELECT
        context_type,
        COUNT(*) as count
      FROM chat_conversations
      WHERE child_id = ?
      GROUP BY context_type
    `).all(childId);

    return {
      ...stats,
      contextBreakdown
    };
  }

  // ============================================
  // VERIFICAÇÃO DE SAÚDE
  // ============================================

  async checkOllamaHealth() {
    try {
      const response = await axios.get(`${this.ollamaUrl}/api/tags`, {
        timeout: 5000
      });

      const hasModel = response.data.models?.some(m => m.name.includes(this.model.split(':')[0]));

      return {
        online: true,
        model: this.model,
        modelAvailable: hasModel,
        models: response.data.models?.map(m => m.name) || []
      };
    } catch (error) {
      return {
        online: false,
        error: error.message
      };
    }
  }
}

module.exports = ChatbotManager;
