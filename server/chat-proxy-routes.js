// CHAT PROXY ROUTES - E-KIDS PRO
// Rotas que fazem proxy para o servidor de chat isolado

const ChatProxy = require('./chat-proxy');

function setupChatProxyRoutes(app, db, authenticate) {
  // Inicializar proxy
  const CHAT_SERVER_URL = process.env.CHAT_SERVER_URL || 'http://localhost:3001';
  const CHAT_API_KEY = process.env.CHAT_API_KEY || 'ekids-chat-secret-key-2025-ultra-secure';

  const chatProxy = new ChatProxy(CHAT_SERVER_URL, CHAT_API_KEY);

  console.log(`🔗 Chat Proxy configurado: ${CHAT_SERVER_URL}`);

  // ============================================
  // CONVERSAÇÃO
  // ============================================

  // POST /api/chat - Enviar mensagem
  app.post('/api/chat', authenticate, async (req, res) => {
    try {
      const { childId, message, contextType } = req.body;

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

      // Enviar para chat server via proxy
      const response = await chatProxy.chat(
        child.name,
        message,
        contextType || 'general'
      );

      res.json({
        success: true,
        ...response
      });

    } catch (error) {
      console.error('Erro no chat proxy:', error);
      res.status(500).json({
        success: true,
        message: chatProxy.getFallbackResponse(req.body.message).message,
        source: 'fallback-error',
        error: 'Erro ao processar mensagem'
      });
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

      const suggestions = chatProxy.getSuggestions(contextType);

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

      const welcome = chatProxy.getWelcomeMessage(child.name, contextType);

      res.json({
        success: true,
        welcome
      });

    } catch (error) {
      console.error('Erro ao obter mensagem de boas-vindas:', error);
      res.status(500).json({ error: 'Erro ao obter mensagem' });
    }
  });

  // ============================================
  // SISTEMA
  // ============================================

  // GET /api/chat/health - Verificar saúde do chat server
  app.get('/api/chat/health', authenticate, async (req, res) => {
    try {
      const online = await chatProxy.checkHealth();

      res.json({
        success: true,
        online,
        server: CHAT_SERVER_URL,
        mode: online ? 'ollama' : 'fallback'
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

module.exports = setupChatProxyRoutes;
