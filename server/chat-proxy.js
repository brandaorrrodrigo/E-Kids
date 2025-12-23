// CHAT PROXY - E-KIDS PRO
// Faz proxy para o servidor de chat isolado com fallback inteligente

const axios = require('axios');

class ChatProxy {
  constructor(chatServerUrl, apiKey) {
    this.chatServerUrl = chatServerUrl || 'http://localhost:3001';
    this.apiKey = apiKey || 'ekids-chat-secret-key-2025';
    this.isOnline = true; // Assume online inicialmente
    this.lastCheck = Date.now();
    this.checkInterval = 30000; // Verificar a cada 30 segundos
  }

  /**
   * Verifica se o servidor de chat está online
   */
  async checkHealth() {
    // Só verificar se passou o intervalo
    if (Date.now() - this.lastCheck < this.checkInterval && this.isOnline) {
      return this.isOnline;
    }

    try {
      const response = await axios.get(`${this.chatServerUrl}/health`, {
        timeout: 3000
      });
      this.isOnline = response.data.status === 'online';
      this.lastCheck = Date.now();
      return this.isOnline;
    } catch (error) {
      this.isOnline = false;
      this.lastCheck = Date.now();
      return false;
    }
  }

  /**
   * Envia mensagem para o servidor de chat
   */
  async chat(childName, message, contextType = 'general') {
    try {
      // Verificar saúde primeiro
      const online = await this.checkHealth();

      if (!online) {
        console.log('⚠️ Chat server offline, usando fallback');
        return this.getFallbackResponse(message);
      }

      // Fazer requisição para o servidor de chat
      const response = await axios.post(
        `${this.chatServerUrl}/api/chat`,
        {
          childName,
          message,
          contextType
        },
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          },
          timeout: 35000 // 35 segundos
        }
      );

      // Se retornou fallback do servidor, marcar offline
      if (response.data.fallback) {
        this.isOnline = false;
      }

      return {
        success: true,
        message: response.data.message,
        tokens: response.data.tokens || 0,
        source: response.data.fallback ? 'fallback-remote' : 'ollama',
        model: response.data.model
      };

    } catch (error) {
      console.error('❌ Erro ao conectar com chat server:', error.message);
      this.isOnline = false;

      // Usar fallback local
      return this.getFallbackResponse(message);
    }
  }

  /**
   * Respostas fallback inteligentes baseadas em palavras-chave
   */
  getFallbackResponse(message = '') {
    const messageLower = message.toLowerCase();

    // Respostas contextuais baseadas em palavras-chave
    const keywordResponses = {
      'oi|olá|ola|hey|opa': [
        "Oi! Como você está hoje? 😊",
        "Olá! Que bom te ver! 💜",
        "Oi! Tudo bem? Estou aqui para te ajudar! ✨"
      ],
      'obrigad|valeu|thanks': [
        "Por nada! Estou aqui sempre que precisar! 💜",
        "Fico feliz em ajudar! 😊",
        "De nada! Conte comigo sempre! ✨"
      ],
      'tchau|adeus|até': [
        "Até logo! Foi ótimo conversar com você! 👋",
        "Tchau! Volte sempre! 💜",
        "Até breve! Estarei aqui quando precisar! 😊"
      ],
      'ajuda|help|socorro': [
        "Claro! Estou aqui para ajudar! O que você precisa? 💜",
        "Pode contar comigo! Me diz o que precisa! 😊",
        "Vamos resolver isso juntos! Me conta! ✨"
      ],
      'jog|brinc|divert': [
        "Adoro jogos! Que tal explorar os jogos no menu? 🎮",
        "Brincar é super legal! Vamos se divertir? 🌟",
        "Temos vários jogos legais aqui! Dá uma olhada! 🎯"
      ],
      'aprend|estud|esc': [
        "Aprender coisas novas é incrível! 📚",
        "Você está indo muito bem nos estudos! Continue assim! ✨",
        "Adoro quando você quer aprender! O que te interessa? 🌟"
      ],
      'fp|ponto|ganhar': [
        "FP são pontos de esforço! Você ganha fazendo atividades! ⭐",
        "Continue se dedicando para ganhar mais FP! 💪",
        "Seus FP mostram o quanto você está crescendo! 🌟"
      ]
    };

    // Procurar por palavra-chave
    for (const [pattern, responses] of Object.entries(keywordResponses)) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(messageLower)) {
        return {
          success: true,
          message: responses[Math.floor(Math.random() * responses.length)],
          tokens: 0,
          source: 'fallback-local',
          model: 'keywords'
        };
      }
    }

    // Resposta genérica
    const genericResponses = [
      "Que interessante! Me conta mais sobre isso! 😊",
      "Uau! Você é muito inteligente! ✨",
      "Adoro conversar com você! Continue! 💜",
      "Isso é super legal! O que mais você quer saber? 🌟",
      "Você está indo muito bem! Estou orgulhosa! 💪",
      "Que legal! Quer me contar mais? 😊"
    ];

    return {
      success: true,
      message: genericResponses[Math.floor(Math.random() * genericResponses.length)],
      tokens: 0,
      source: 'fallback-local',
      model: 'generic'
    };
  }

  /**
   * Sugestões de mensagens
   */
  getSuggestions(contextType = 'general') {
    const suggestions = {
      general: [
        "Como foi seu dia?",
        "O que você aprendeu hoje?",
        "Quer jogar algo?",
        "Me conta uma curiosidade!"
      ],
      financial: [
        "Como posso guardar FP?",
        "Para que serve o FP?",
        "Quero economizar!"
      ],
      nature: [
        "Como cuidar de plantas?",
        "Me fala sobre animais!",
        "O que é meio ambiente?"
      ],
      hygiene: [
        "Por que lavar as mãos?",
        "Como escovar os dentes?",
        "O que é higiene?"
      ]
    };

    return suggestions[contextType] || suggestions.general;
  }

  /**
   * Mensagem de boas-vindas
   */
  getWelcomeMessage(childName, contextType = 'general') {
    const welcomes = {
      general: `Oi ${childName}! Eu sou a Lu! 👧💜\n\nEstou super feliz de te ver aqui! Como posso te ajudar hoje?`,
      financial: `Olá ${childName}! Vamos aprender sobre guardar FP? 💰\n\nÉ super legal e vai te ajudar muito!`,
      nature: `Oi ${childName}! Vamos descobrir coisas incríveis sobre a natureza? 🌱\n\nPlantas e animais são demais!`,
      hygiene: `Olá ${childName}! Vamos aprender a cuidar de você? 🧼\n\nSer saudável é muito importante!`
    };

    return welcomes[contextType] || welcomes.general;
  }
}

module.exports = ChatProxy;
