// ============================================
// ROTAS DOS MÓDULOS DE EDUCAÇÃO
// ============================================
// Este arquivo contém as rotas para os três módulos educacionais:
// - Educação Financeira
// - Natureza e Meio Ambiente
// - Higiene e Autocuidado

// Importar managers
const FinancialEducationManager = require('./financial-education-manager');
const NatureEducationManager = require('./nature-education-manager');
const HygieneEducationManager = require('./hygiene-education-manager');

function setupEducationRoutes(app, db, authenticate) {
  // Instanciar managers
  const financialManager = new FinancialEducationManager(db);
  const natureManager = new NatureEducationManager(db);
  const hygieneManager = new HygieneEducationManager(db);

  // ============================================
  // MÓDULO: EDUCAÇÃO FINANCEIRA
  // ============================================

  // POST /api/financial/decision - Registrar decisão de FP
  app.post('/api/financial/decision', authenticate, (req, res) => {
    try {
      const { childId, fpAmount, decision, context, source } = req.body;

      // Validação
      if (!childId || !fpAmount || !decision || !context) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      // Verificar se criança pertence à família
      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      // Registrar decisão
      financialManager.recordFpDecision(childId, fpAmount, decision, context, source);

      // Se decidiu guardar, depositar no cofrinho ativo
      if (decision === 'save') {
        const activeBanks = financialManager.getActivePiggyBanks(childId);
        if (activeBanks.length > 0) {
          financialManager.depositToPiggyBank(activeBanks[0].id, fpAmount);
        }

        // Verificar e conceder badges
        const badges = financialManager.checkAndAwardBadges(childId);
        if (badges.length > 0) {
          return res.json({ success: true, badges, message: 'Decisão registrada e badges conquistados!' });
        }
      }

      res.json({ success: true, message: 'Decisão registrada' });
    } catch (error) {
      console.error('Erro ao registrar decisão:', error);
      res.status(500).json({ error: 'Erro ao registrar decisão' });
    }
  });

  // GET /api/financial/piggy-banks/:childId - Listar cofrinhos
  app.get('/api/financial/piggy-banks/:childId', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const banks = financialManager.getActivePiggyBanks(childId);
      const totalSaved = financialManager.getTotalSaved(childId);

      res.json({ success: true, banks, totalSaved });
    } catch (error) {
      console.error('Erro ao listar cofrinhos:', error);
      res.status(500).json({ error: 'Erro ao listar cofrinhos' });
    }
  });

  // POST /api/financial/piggy-bank - Criar cofrinho
  app.post('/api/financial/piggy-bank', authenticate, (req, res) => {
    try {
      const { childId, name, goalType, targetFp } = req.body;

      if (!childId || !name || !goalType) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const result = financialManager.createPiggyBank(childId, name, goalType, targetFp);

      res.json({ success: true, bankId: result.lastInsertRowid });
    } catch (error) {
      console.error('Erro ao criar cofrinho:', error);
      res.status(500).json({ error: 'Erro ao criar cofrinho' });
    }
  });

  // GET /api/financial/statement/:childId/:month/:year - Obter extrato mensal
  app.get('/api/financial/statement/:childId/:month/:year', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);
      const month = parseInt(req.params.month);
      const year = parseInt(req.params.year);

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const statement = financialManager.generateMonthlyStatement(childId, month, year);
      const narration = financialManager.generateStatementNarration(statement);

      res.json({ success: true, statement, narration });
    } catch (error) {
      console.error('Erro ao gerar extrato:', error);
      res.status(500).json({ error: 'Erro ao gerar extrato' });
    }
  });

  // GET /api/financial/missions/:childId - Listar missões financeiras ativas
  app.get('/api/financial/missions/:childId', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const missions = financialManager.getActiveFinancialMissions(childId);

      res.json({ success: true, missions });
    } catch (error) {
      console.error('Erro ao listar missões:', error);
      res.status(500).json({ error: 'Erro ao listar missões' });
    }
  });

  // POST /api/financial/mission/assign - Atribuir missão
  app.post('/api/financial/mission/assign', authenticate, (req, res) => {
    try {
      const { childId, missionId } = req.body;

      if (!childId || !missionId) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      financialManager.assignFinancialMission(childId, missionId);

      res.json({ success: true, message: 'Missão atribuída' });
    } catch (error) {
      console.error('Erro ao atribuir missão:', error);
      res.status(500).json({ error: 'Erro ao atribuir missão' });
    }
  });

  // GET /api/financial/badges/:childId - Listar badges financeiros
  app.get('/api/financial/badges/:childId', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const badges = financialManager.getChildFinancialBadges(childId);

      res.json({ success: true, badges });
    } catch (error) {
      console.error('Erro ao listar badges:', error);
      res.status(500).json({ error: 'Erro ao listar badges' });
    }
  });

  // ============================================
  // MÓDULO: NATUREZA E MEIO AMBIENTE
  // ============================================

  // GET /api/nature/categories - Listar categorias
  app.get('/api/nature/categories', authenticate, (req, res) => {
    try {
      const categories = natureManager.getAllCategories();
      res.json({ success: true, categories });
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      res.status(500).json({ error: 'Erro ao listar categorias' });
    }
  });

  // GET /api/nature/lessons/:categoryId - Listar lições por categoria
  app.get('/api/nature/lessons/:categoryId', authenticate, (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const ageGroup = req.query.ageGroup ? parseInt(req.query.ageGroup) : null;

      const lessons = natureManager.getLessonsByCategory(categoryId, ageGroup);

      res.json({ success: true, lessons });
    } catch (error) {
      console.error('Erro ao listar lições:', error);
      res.status(500).json({ error: 'Erro ao listar lições' });
    }
  });

  // GET /api/nature/lesson/:lessonId - Obter lição com escolhas
  app.get('/api/nature/lesson/:lessonId', authenticate, (req, res) => {
    try {
      const lessonId = parseInt(req.params.lessonId);

      const lesson = natureManager.getLessonWithChoices(lessonId);

      if (!lesson) {
        return res.status(404).json({ error: 'Lição não encontrada' });
      }

      res.json({ success: true, lesson });
    } catch (error) {
      console.error('Erro ao obter lição:', error);
      res.status(500).json({ error: 'Erro ao obter lição' });
    }
  });

  // POST /api/nature/lesson/complete - Completar lição
  app.post('/api/nature/lesson/complete', authenticate, (req, res) => {
    try {
      const { childId, lessonId, choicesMade } = req.body;

      if (!childId || !lessonId) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const result = natureManager.completeLesson(childId, lessonId, choicesMade);

      // Verificar e conceder badges
      const badges = natureManager.checkAndAwardBadges(childId);

      res.json({ success: true, ...result, badges });
    } catch (error) {
      console.error('Erro ao completar lição:', error);
      res.status(500).json({ error: 'Erro ao completar lição' });
    }
  });

  // GET /api/nature/missions - Listar missões disponíveis
  app.get('/api/nature/missions', authenticate, (req, res) => {
    try {
      const ageGroup = req.query.ageGroup ? parseInt(req.query.ageGroup) : null;

      const missions = natureManager.getAvailableMissions(ageGroup);

      res.json({ success: true, missions });
    } catch (error) {
      console.error('Erro ao listar missões:', error);
      res.status(500).json({ error: 'Erro ao listar missões' });
    }
  });

  // POST /api/nature/mission/assign - Atribuir missão
  app.post('/api/nature/mission/assign', authenticate, (req, res) => {
    try {
      const { childId, missionId } = req.body;

      if (!childId || !missionId) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      natureManager.assignMission(childId, missionId);

      res.json({ success: true, message: 'Missão atribuída' });
    } catch (error) {
      console.error('Erro ao atribuir missão:', error);
      res.status(500).json({ error: 'Erro ao atribuir missão' });
    }
  });

  // POST /api/nature/mission/progress - Atualizar progresso
  app.post('/api/nature/mission/progress', authenticate, (req, res) => {
    try {
      const { childId, missionId, increment, notes } = req.body;

      if (!childId || !missionId) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const result = natureManager.updateMissionProgress(childId, missionId, increment || 1, notes);

      // Verificar badges se completou
      if (result.completed) {
        const badges = natureManager.checkAndAwardBadges(childId);
        result.badges = badges;
      }

      res.json({ success: true, ...result });
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      res.status(500).json({ error: 'Erro ao atualizar progresso' });
    }
  });

  // GET /api/nature/missions/:childId - Listar missões ativas da criança
  app.get('/api/nature/missions/:childId', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const missions = natureManager.getActiveMissions(childId);

      res.json({ success: true, missions });
    } catch (error) {
      console.error('Erro ao listar missões:', error);
      res.status(500).json({ error: 'Erro ao listar missões' });
    }
  });

  // GET /api/nature/badges/:childId - Listar badges de natureza
  app.get('/api/nature/badges/:childId', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const badges = natureManager.getChildBadges(childId);

      res.json({ success: true, badges });
    } catch (error) {
      console.error('Erro ao listar badges:', error);
      res.status(500).json({ error: 'Erro ao listar badges' });
    }
  });

  // ============================================
  // MÓDULO: HIGIENE E AUTOCUIDADO
  // ============================================

  // GET /api/hygiene/categories - Listar categorias
  app.get('/api/hygiene/categories', authenticate, (req, res) => {
    try {
      const categories = hygieneManager.getAllCategories();
      res.json({ success: true, categories });
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      res.status(500).json({ error: 'Erro ao listar categorias' });
    }
  });

  // GET /api/hygiene/habits - Listar todos os hábitos
  app.get('/api/hygiene/habits', authenticate, (req, res) => {
    try {
      const ageGroup = req.query.ageGroup ? parseInt(req.query.ageGroup) : null;

      const habits = hygieneManager.getAllHabits(ageGroup);

      res.json({ success: true, habits });
    } catch (error) {
      console.error('Erro ao listar hábitos:', error);
      res.status(500).json({ error: 'Erro ao listar hábitos' });
    }
  });

  // POST /api/hygiene/track - Registrar conclusão de hábito
  app.post('/api/hygiene/track', authenticate, (req, res) => {
    try {
      const { childId, habitId, date, notes } = req.body;

      if (!childId || !habitId) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const result = hygieneManager.trackHabit(childId, habitId, date, notes);

      // Verificar e conceder badges
      const badges = hygieneManager.checkAndAwardBadges(childId);

      res.json({ success: true, ...result, badges });
    } catch (error) {
      console.error('Erro ao registrar hábito:', error);
      res.status(500).json({ error: 'Erro ao registrar hábito' });
    }
  });

  // GET /api/hygiene/tracking/:childId - Obter hábitos de hoje
  app.get('/api/hygiene/tracking/:childId', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);
      const date = req.query.date || new Date().toISOString().split('T')[0];

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const habits = hygieneManager.getHabitsForDate(childId, date);

      res.json({ success: true, habits });
    } catch (error) {
      console.error('Erro ao obter hábitos:', error);
      res.status(500).json({ error: 'Erro ao obter hábitos' });
    }
  });

  // GET /api/hygiene/stats/:childId - Obter estatísticas
  app.get('/api/hygiene/stats/:childId', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const stats = hygieneManager.getStats(childId);

      res.json({ success: true, stats });
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
  });

  // GET /api/hygiene/history/:childId - Obter histórico
  app.get('/api/hygiene/history/:childId', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);
      const days = req.query.days ? parseInt(req.query.days) : 30;

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const history = hygieneManager.getHabitHistory(childId, days);

      res.json({ success: true, history });
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      res.status(500).json({ error: 'Erro ao obter histórico' });
    }
  });

  // GET /api/hygiene/missions - Listar missões disponíveis
  app.get('/api/hygiene/missions', authenticate, (req, res) => {
    try {
      const ageGroup = req.query.ageGroup ? parseInt(req.query.ageGroup) : null;

      const missions = hygieneManager.getAvailableMissions(ageGroup);

      res.json({ success: true, missions });
    } catch (error) {
      console.error('Erro ao listar missões:', error);
      res.status(500).json({ error: 'Erro ao listar missões' });
    }
  });

  // POST /api/hygiene/mission/assign - Atribuir missão
  app.post('/api/hygiene/mission/assign', authenticate, (req, res) => {
    try {
      const { childId, missionId } = req.body;

      if (!childId || !missionId) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      hygieneManager.assignMission(childId, missionId);

      res.json({ success: true, message: 'Missão atribuída' });
    } catch (error) {
      console.error('Erro ao atribuir missão:', error);
      res.status(500).json({ error: 'Erro ao atribuir missão' });
    }
  });

  // GET /api/hygiene/missions/:childId - Listar missões ativas
  app.get('/api/hygiene/missions/:childId', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const missions = hygieneManager.getActiveMissions(childId);

      res.json({ success: true, missions });
    } catch (error) {
      console.error('Erro ao listar missões:', error);
      res.status(500).json({ error: 'Erro ao listar missões' });
    }
  });

  // GET /api/hygiene/badges/:childId - Listar badges de higiene
  app.get('/api/hygiene/badges/:childId', authenticate, (req, res) => {
    try {
      const childId = parseInt(req.params.childId);

      const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
        .get(childId, req.user.familyId);

      if (!child) {
        return res.status(404).json({ error: 'Criança não encontrada' });
      }

      const badges = hygieneManager.getChildBadges(childId);

      res.json({ success: true, badges });
    } catch (error) {
      console.error('Erro ao listar badges:', error);
      res.status(500).json({ error: 'Erro ao listar badges' });
    }
  });
}

module.exports = setupEducationRoutes;
