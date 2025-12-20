// CHATBOT ROUTES - E-KIDS PRO
// Rotas da API do chatbot local

const ChatbotManager = require('./chatbot-manager');

function setupChatbotRoutes(app, db, authenticate) {
  const chatbot = new ChatbotManager(db);

  // ============================================
  // CONVERSAÇÃO
  // ============================================

  // POST /api/chat - Enviar mensagem
  app.post('/api/chat', authenticate, async (req, res) => {
    try {
      const { childId, message, contextType, conversationId } = req.body;

      // Validação
      if (!childId || !message) {
        return res.status(400).json({ error: 'childId e message são obrigatórios' });
      }

      // Verificar se criança pertence à família
      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      // Processar mensagem
      const response = await chatbot.chat(
        childId,
        message,
        contextType || 'general',
        conversationId
      );

      res.json({
        success: true,
        ...response
      });

    } catch (error) {
      console.error('Erro no chat:', error);
      res.status(500).json({
        error: 'Erro ao processar mensagem',
        message: chatbot.getFallbackResponse('general')
      });
    }
  });

  // GET /api/chat/conversations/:childId - Listar conversas
  app.get('/api/chat/conversations/:childId', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);
      const limit = parseInt(req.query.limit) || 10;

      // Verificar se criança pertence à família
      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const conversations = chatbot.getChildConversations(childId, limit);

      res.json({
        success: true,
        conversations
      });

    } catch (error) {
      console.error('Erro ao listar conversas:', error);
      res.status(500).json({ error: 'Erro ao listar conversas' });
    }
  });

  // GET /api/chat/history/:conversationId - Obter histórico de conversa
  app.get('/api/chat/history/:conversationId', authenticate, (req, res) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const limit = parseInt(req.query.limit) || 50;

      // Verificar se a conversa pertence a uma criança da família
      const conversation = db.prepare(`
        SELECT cc.*, c.family_id
        FROM chat_conversations cc
        JOIN children c ON cc.child_id = c.id
        WHERE cc.id = ?
      `).get(conversationId);

      if (!conversation) {
        return res.status(404).json({ error: 'Conversa não encontrada' });
      }

      if (conversation.family_id !== req.user.familyId) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const history = chatbot.getConversationHistory(conversationId, limit);

      res.json({
        success: true,
        conversation,
        history
      });

    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      res.status(500).json({ error: 'Erro ao obter histórico' });
    }
  });

  // DELETE /api/chat/conversation/:conversationId - Deletar conversa
  app.delete('/api/chat/conversation/:conversationId', authenticate, (req, res) => {
    try {
      const conversationId = parseInt(req.params.conversationId);

      // Verificar se a conversa pertence a uma criança da família
      const conversation = db.prepare(`
        SELECT cc.*, c.family_id
        FROM chat_conversations cc
        JOIN children c ON cc.child_id = c.id
        WHERE cc.id = ?
      `).get(conversationId);

      if (!conversation) {
        return res.status(404).json({ error: 'Conversa não encontrada' });
      }

      if (conversation.family_id !== req.user.familyId) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      chatbot.deleteConversation(conversationId);

      res.json({
        success: true,
        message: 'Conversa deletada'
      });

    } catch (error) {
      console.error('Erro ao deletar conversa:', error);
      res.status(500).json({ error: 'Erro ao deletar conversa' });
    }
  });

  // ============================================
  // SUGESTÕES E MENSAGENS
  // ============================================

  // GET /api/chat/suggestions - Obter sugestões de mensagens
  app.get('/api/chat/suggestions', authenticate, (req, res) => {
    try {
      const contextType = req.query.contextType || 'general';
      const childId = parseInt(req.query.childId);

      if (!childId) {
        return res.status(400).json({ error: 'childId é obrigatório' });
      }

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const suggestions = chatbot.getSuggestions(contextType, child);

      res.json({
        success: true,
        suggestions
      });

    } catch (error) {
      console.error('Erro ao obter sugestões:', error);
      res.status(500).json({ error: 'Erro ao obter sugestões' });
    }
  });

  // GET /api/chat/welcome - Mensagem de boas-vindas
  app.get('/api/chat/welcome', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.query.childId);
      const contextType = req.query.contextType || 'general';

      if (!childId) {
        return res.status(400).json({ error: 'childId é obrigatório' });
      }

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const welcome = chatbot.getWelcomeMessage(child.name, contextType);
      const motivational = chatbot.getMotivationalMessage(child.name);

      res.json({
        success: true,
        welcome,
        motivational
      });

    } catch (error) {
      console.error('Erro ao obter mensagem de boas-vindas:', error);
      res.status(500).json({ error: 'Erro ao obter mensagem' });
    }
  });

  // ============================================
  // ESTATÍSTICAS
  // ============================================

  // GET /api/chat/stats/:childId - Estatísticas de chat
  app.get('/api/chat/stats/:childId', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const stats = chatbot.getChatStats(childId);

      res.json({
        success: true,
        stats
      });

    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
  });

  // ============================================
  // SISTEMA
  // ============================================

  // GET /api/chat/health - Verificar saúde do Ollama
  app.get('/api/chat/health', authenticate, async (req, res) => {
    try {
      const health = await chatbot.checkOllamaHealth();

      res.json({
        success: true,
        ...health
      });

    } catch (error) {
      console.error('Erro ao verificar saúde:', error);
      res.status(500).json({
        success: false,
        online: false,
        error: error.message
      });
    }
  });
}

module.exports = setupChatbotRoutes;
