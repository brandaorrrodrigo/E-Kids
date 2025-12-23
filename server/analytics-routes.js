// ANALYTICS ROUTES - E-KIDS PRO
// Rotas da API de analytics para dashboard dos pais

const AnalyticsManager = require('./analytics-manager');

function setupAnalyticsRoutes(app, db, authenticate) {
  const analytics = new AnalyticsManager(db);

  // ============================================
  // OVERVIEW DA CRIANÇA
  // ============================================

  // GET /api/analytics/child/:childId - Overview completo da criança
  app.get('/api/analytics/child/:childId', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);
      const days = parseInt(req.query.days) || 30;

      // Verificar se criança pertence à família
      const child = db.prepare(`
        SELECT * FROM children WHERE id = ? AND family_id = ?
      `).get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const overview = analytics.getChildOverview(childId, days);

      res.json({
        success: true,
        overview
      });

    } catch (error) {
      console.error('Erro ao obter overview:', error);
      res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
  });

  // GET /api/analytics/child/:childId/comparison - Comparação temporal
  app.get('/api/analytics/child/:childId/comparison', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);
      const currentDays = parseInt(req.query.currentDays) || 30;
      const previousDays = parseInt(req.query.previousDays) || 30;

      // Verificar se criança pertence à família
      const child = db.prepare(`
        SELECT * FROM children WHERE id = ? AND family_id = ?
      `).get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const comparison = analytics.getComparisonStats(childId, currentDays, previousDays);

      res.json({
        success: true,
        comparison
      });

    } catch (error) {
      console.error('Erro ao comparar:', error);
      res.status(500).json({ error: 'Erro ao comparar estatísticas' });
    }
  });

  // ============================================
  // ESTATÍSTICAS ESPECÍFICAS
  // ============================================

  // GET /api/analytics/child/:childId/fp - Estatísticas de FP
  app.get('/api/analytics/child/:childId/fp', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);
      const days = parseInt(req.query.days) || 30;

      const child = db.prepare(`
        SELECT * FROM children WHERE id = ? AND family_id = ?
      `).get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const fpStats = analytics.getFpStats(childId, days);

      res.json({
        success: true,
        stats: fpStats
      });

    } catch (error) {
      console.error('Erro ao obter stats de FP:', error);
      res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
  });

  // GET /api/analytics/child/:childId/activities - Estatísticas de atividades
  app.get('/api/analytics/child/:childId/activities', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);
      const days = parseInt(req.query.days) || 30;

      const child = db.prepare(`
        SELECT * FROM children WHERE id = ? AND family_id = ?
      `).get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const activitiesStats = analytics.getActivitiesStats(childId, days);

      res.json({
        success: true,
        stats: activitiesStats
      });

    } catch (error) {
      console.error('Erro ao obter stats de atividades:', error);
      res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
  });

  // ============================================
  // OVERVIEW DA FAMÍLIA
  // ============================================

  // GET /api/analytics/family - Overview de toda a família
  app.get('/api/analytics/family', authenticate, (req, res) => {
    try {
      const days = parseInt(req.query.days) || 30;

      const familyOverview = analytics.getFamilyOverview(req.user.familyId, days);

      res.json({
        success: true,
        family: familyOverview
      });

    } catch (error) {
      console.error('Erro ao obter overview da família:', error);
      res.status(500).json({ error: 'Erro ao obter estatísticas da família' });
    }
  });

  // ============================================
  // RELATÓRIOS ESPECÍFICOS POR MÓDULO
  // ============================================

  // GET /api/analytics/child/:childId/financial - Estatísticas financeiras
  app.get('/api/analytics/child/:childId/financial', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);
      const days = parseInt(req.query.days) || 30;

      const child = db.prepare(`
        SELECT * FROM children WHERE id = ? AND family_id = ?
      `).get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const financialStats = analytics.getFinancialStats(childId, days);

      res.json({
        success: true,
        stats: financialStats
      });

    } catch (error) {
      console.error('Erro ao obter stats financeiras:', error);
      res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
  });

  // GET /api/analytics/child/:childId/nature - Estatísticas de natureza
  app.get('/api/analytics/child/:childId/nature', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);
      const days = parseInt(req.query.days) || 30;

      const child = db.prepare(`
        SELECT * FROM children WHERE id = ? AND family_id = ?
      `).get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const natureStats = analytics.getNatureStats(childId, days);

      res.json({
        success: true,
        stats: natureStats
      });

    } catch (error) {
      console.error('Erro ao obter stats de natureza:', error);
      res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
  });

  // GET /api/analytics/child/:childId/hygiene - Estatísticas de higiene
  app.get('/api/analytics/child/:childId/hygiene', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);
      const days = parseInt(req.query.days) || 30;

      const child = db.prepare(`
        SELECT * FROM children WHERE id = ? AND family_id = ?
      `).get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const hygieneStats = analytics.getHygieneStats(childId, days);

      res.json({
        success: true,
        stats: hygieneStats
      });

    } catch (error) {
      console.error('Erro ao obter stats de higiene:', error);
      res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
  });

  // GET /api/analytics/child/:childId/chat - Estatísticas do chat
  app.get('/api/analytics/child/:childId/chat', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);
      const days = parseInt(req.query.days) || 30;

      const child = db.prepare(`
        SELECT * FROM children WHERE id = ? AND family_id = ?
      `).get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const chatStats = analytics.getChatStats(childId, days);

      res.json({
        success: true,
        stats: chatStats
      });

    } catch (error) {
      console.error('Erro ao obter stats de chat:', error);
      res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
  });

  // ============================================
  // BADGES E CONQUISTAS
  // ============================================

  // GET /api/analytics/child/:childId/badges - Todos os badges da criança
  app.get('/api/analytics/child/:childId/badges', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);

      const child = db.prepare(`
        SELECT * FROM children WHERE id = ? AND family_id = ?
      `).get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const badges = analytics.getTotalBadges(childId);

      res.json({
        success: true,
        badges
      });

    } catch (error) {
      console.error('Erro ao obter badges:', error);
      res.status(500).json({ error: 'Erro ao obter badges' });
    }
  });
}

module.exports = setupAnalyticsRoutes;
