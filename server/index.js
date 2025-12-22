// E-KIDS PRO MVP - Backend Server
const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'ekids-mvp-secret-2025';

// Garantir pasta do banco de dados
const DB_DIR = path.join(__dirname, 'database');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}
const DB_PATH = path.join(DB_DIR, 'ekids.db');

// Database
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Inicializar schema (MVP) — cria tabelas e seeds mínimos se não existirem
db.exec(`
CREATE TABLE IF NOT EXISTS families (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS children (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  family_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  avatar TEXT DEFAULT 'default',
  total_fp INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mascot (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  energy INTEGER DEFAULT 100,
  happiness INTEGER DEFAULT 100,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  module_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  order_position INTEGER NOT NULL,
  is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS child_module_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  module_key TEXT NOT NULL,
  activities_completed INTEGER DEFAULT 0,
  understanding_level INTEGER DEFAULT 0,
  last_accessed TEXT,
  UNIQUE(child_id, module_key),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (module_key) REFERENCES modules(module_key) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activities_completed (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  module_key TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  fp_earned INTEGER DEFAULT 0,
  completed_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (module_key) REFERENCES modules(module_key) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS emotional_checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  emotion TEXT NOT NULL,
  comfort_level INTEGER,
  wants_to_talk INTEGER DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trust_circle (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  adult_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);
`);

// Seed dos 5 módulos do MVP (idempotente)
const moduleCount = db.prepare('SELECT COUNT(1) as c FROM modules').get().c;
if (moduleCount === 0) {
  const seed = db.prepare(`
    INSERT INTO modules (module_key, name, description, order_position, is_active)
    VALUES (@module_key, @name, @description, @order_position, 1)
  `);
  const seeds = [
    { module_key: 'meu-jeito-meus-limites', name: 'Meu Jeito, Meus Limites', description: 'Autonomia, consentimento e limites pessoais.', order_position: 1 },
    { module_key: 'posso-pedir-ajuda', name: 'Posso Pedir Ajuda', description: 'Pedir ajuda a adultos de confiança e reconhecer situações inseguras.', order_position: 2 },
    { module_key: 'cuidando-de-mim', name: 'Cuidando de Mim', description: 'Autocuidado, privacidade e proteção do corpo.', order_position: 3 },
    { module_key: 'minhas-emocoes', name: 'Minhas Emoções', description: 'Check-ins emocionais e identificação de sentimentos.', order_position: 4 },
    { module_key: 'desafios-positivos', name: 'Desafios Positivos', description: 'Hábitos e desafios leves com recompensas.', order_position: 5 },
  ];
  const tx = db.transaction((rows) => {
    for (const r of rows) seed.run(r);
  });
  tx(seeds);
}

// Executar migration do Cofrinho FP e recursos adicionais
const cofrinhoMigrationPath = path.join(__dirname, 'database', 'migration-cofrinho-fp.sql');
if (fs.existsSync(cofrinhoMigrationPath)) {
  try {
    const migrationSQL = fs.readFileSync(cofrinhoMigrationPath, 'utf8');
    db.exec(migrationSQL);
    console.log('✅ Migration do Cofrinho FP executada');
  } catch (error) {
    console.error('⚠️  Erro na migration do Cofrinho FP:', error.message);
  }
}

// Executar migration Fase 6-7 (Badges, World Areas, Mascot Memory, etc.)
const fase67MigrationPath = path.join(__dirname, 'database', 'migration-fase6-7.sql');
if (fs.existsSync(fase67MigrationPath)) {
  try {
    const migrationSQL = fs.readFileSync(fase67MigrationPath, 'utf8');
    db.exec(migrationSQL);
    console.log('✅ Migration Fase 6-7 executada');
  } catch (error) {
    console.error('⚠️  Erro na migration Fase 6-7:', error.message);
  }
}

// Executar migration Fase 8 (Uso Real & Retenção)
const fase8MigrationPath = path.join(__dirname, 'database', 'migration-fase8.sql');
if (fs.existsSync(fase8MigrationPath)) {
  try {
    const migrationSQL = fs.readFileSync(fase8MigrationPath, 'utf8');
    db.exec(migrationSQL);
    console.log('✅ Migration Fase 8 executada');
  } catch (error) {
    console.error('⚠️  Erro na migration Fase 8:', error.message);
  }
}

// Executar migration Fase 2/3 + Mapa + Loja
const fase23MigrationPath = path.join(__dirname, 'database', 'migration-fase2-3-world-store.sql');
if (fs.existsSync(fase23MigrationPath)) {
  try {
    const migrationSQL = fs.readFileSync(fase23MigrationPath, 'utf8');
    db.exec(migrationSQL);
    console.log('✅ Migration Fase 2/3 + Mapa + Loja executada');
  } catch (error) {
    console.error('⚠️  Erro na migration Fase 2/3:', error.message);
  }
}

// Executar migration Educação Financeira
const financialMigrationPath = path.join(__dirname, 'database', 'migration-financial-education.sql');
if (fs.existsSync(financialMigrationPath)) {
  try {
    const migrationSQL = fs.readFileSync(financialMigrationPath, 'utf8');
    db.exec(migrationSQL);
    console.log('✅ Migration Educação Financeira executada');
  } catch (error) {
    console.error('⚠️  Erro na migration Educação Financeira:', error.message);
  }
}

// Executar migration Natureza e Meio Ambiente
const natureMigrationPath = path.join(__dirname, 'database', 'migration-nature-education.sql');
if (fs.existsSync(natureMigrationPath)) {
  try {
    const migrationSQL = fs.readFileSync(natureMigrationPath, 'utf8');
    db.exec(migrationSQL);
    console.log('✅ Migration Natureza e Meio Ambiente executada');
  } catch (error) {
    console.error('⚠️  Erro na migration Natureza:', error.message);
  }
}

// Executar migration Higiene e Autocuidado
const hygieneMigrationPath = path.join(__dirname, 'database', 'migration-hygiene-education.sql');
if (fs.existsSync(hygieneMigrationPath)) {
  try {
    const migrationSQL = fs.readFileSync(hygieneMigrationPath, 'utf8');
    db.exec(migrationSQL);
    console.log('✅ Migration Higiene e Autocuidado executada');
  } catch (error) {
    console.error('⚠️  Erro na migration Higiene:', error.message);
  }
}

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// ============================================
// AUTENTICAÇÃO
// ============================================

// Registrar família
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, parentName } = req.body;

    // Validar
    if (!email || !password || !parentName) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Verificar se já existe
    const existing = db.prepare('SELECT id FROM families WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Inserir
    const result = db.prepare(`
      INSERT INTO families (email, password_hash, parent_name)
      VALUES (?, ?, ?)
    `).run(email, passwordHash, parentName);

    // Gerar token
    const token = jwt.sign({ familyId: result.lastInsertRowid }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      family: { id: result.lastInsertRowid, email, parentName }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro ao registrar' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar família
    const family = db.prepare('SELECT * FROM families WHERE email = ?').get(email);
    if (!family) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verificar senha
    const valid = await bcrypt.compare(password, family.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Gerar token
    const token = jwt.sign({ familyId: family.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      family: { id: family.id, email: family.email, parentName: family.parent_name }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Recuperar senha
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    // Verificar se o email existe
    const family = db.prepare('SELECT id, email FROM families WHERE email = ?').get(email);

    // Por segurança, sempre retornar sucesso mesmo que o email não exista
    // Isso evita que atacantes descubram quais emails estão cadastrados
    if (!family) {
      return res.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link de recuperação.'
      });
    }

    // Gerar token de recuperação (válido por 1 hora)
    const resetToken = jwt.sign(
      { familyId: family.id, type: 'password-reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // TODO: Enviar email com link de recuperação
    // const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
    // await sendEmail(family.email, 'Recuperação de senha', resetLink);

    // Por enquanto, apenas registrar no console (desenvolvimento)
    console.log(`Token de recuperação para ${email}: ${resetToken}`);
    console.log(`Link de recuperação: /reset-password?token=${resetToken}`);

    res.json({
      success: true,
      message: 'Se o email estiver cadastrado, você receberá um link de recuperação.',
      // Apenas para desenvolvimento - remover em produção
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });

  } catch (error) {
    console.error('Erro ao processar recuperação de senha:', error);
    res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
});

// Redefinir senha
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
    }

    // Verificar token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.type !== 'password-reset') {
        return res.status(400).json({ error: 'Token inválido' });
      }
    } catch (error) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    // Hash da nova senha
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Atualizar senha
    db.prepare('UPDATE families SET password_hash = ? WHERE id = ?')
      .run(passwordHash, decoded.familyId);

    res.json({
      success: true,
      message: 'Senha redefinida com sucesso! Você já pode fazer login.'
    });

  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ error: 'Erro ao redefinir senha' });
  }
});

// Middleware de autenticação
function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.familyId = decoded.familyId; // Manter compatibilidade com código existente
    req.user = { familyId: decoded.familyId }; // Novo formato para módulos educacionais
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// ============================================
// MÓDULOS EDUCACIONAIS (Financeiro, Natureza, Higiene)
// ============================================

// Importar e configurar rotas dos módulos educacionais
const setupEducationRoutes = require('./education-modules-routes');
setupEducationRoutes(app, db, authenticate);

// ============================================
// CHATBOT LOCAL (Ollama)
// ============================================

// Importar e configurar rotas do chatbot
const setupChatbotRoutes = require('./chatbot-routes');
setupChatbotRoutes(app, db, authenticate);

// ============================================
// STRIPE PAYMENT INTEGRATION
// ============================================

// Importar e configurar rotas do Stripe
const setupStripeRoutes = require('./stripe-routes');
setupStripeRoutes(app, db, authenticate);

// ============================================
// TEXT-TO-SPEECH (Piper TTS)
// ============================================

const ttsRoutes = require('./tts-routes');
app.use('/api/tts', ttsRoutes);

// ============================================
// CRIANÇAS
// ============================================

// Listar crianças da família
app.get('/api/children', authenticate, (req, res) => {
  const children = db.prepare(`
    SELECT c.*, m.name as mascot_name, m.level as mascot_level
    FROM children c
    LEFT JOIN mascot m ON m.child_id = c.id
    WHERE c.family_id = ?
  `).all(req.familyId);

  res.json({ success: true, children });
});

// Criar criança
app.post('/api/children', authenticate, (req, res) => {
  try {
    const { name, age, avatar } = req.body;

    // Inserir criança
    const result = db.prepare(`
      INSERT INTO children (family_id, name, age, avatar)
      VALUES (?, ?, ?, ?)
    `).run(req.familyId, name, age || null, avatar || 'default');

    const childId = result.lastInsertRowid;

    // Criar mascote
    db.prepare(`
      INSERT INTO mascot (child_id, name, level, energy, happiness)
      VALUES (?, ?, 1, 100, 100)
    `).run(childId, 'Buddy');

    // Inicializar progresso nos módulos
    const modules = db.prepare('SELECT module_key FROM modules').all();
    const initProgress = db.prepare(`
      INSERT INTO child_module_progress (child_id, module_key)
      VALUES (?, ?)
    `);

    for (const module of modules) {
      initProgress.run(childId, module.module_key);
    }

    // Inicializar fases (Fase 1 desbloqueada)
    initializePhasesForChild(childId);

    res.json({ success: true, childId });
  } catch (error) {
    console.error('Erro ao criar criança:', error);
    res.status(500).json({ error: 'Erro ao criar perfil' });
  }
});

// Obter criança específica
app.get('/api/children/:id', authenticate, (req, res) => {
  const child = db.prepare(`
    SELECT c.*, m.name as mascot_name, m.level as mascot_level, m.energy, m.happiness
    FROM children c
    LEFT JOIN mascot m ON m.child_id = c.id
    WHERE c.id = ? AND c.family_id = ?
  `).get(req.params.id, req.familyId);

  if (!child) {
    return res.status(404).json({ error: 'Criança não encontrada' });
  }

  res.json({ success: true, child });
});

// ============================================
// MÓDULOS
// ============================================

// Listar todos os módulos
app.get('/api/modules', (req, res) => {
  const modules = db.prepare(`
    SELECT * FROM modules ORDER BY order_position
  `).all();

  res.json({ success: true, modules });
});

// Obter progresso de uma criança em todos os módulos
app.get('/api/children/:childId/progress', authenticate, (req, res) => {
  const progress = db.prepare(`
    SELECT m.*, p.activities_completed, p.understanding_level, p.last_accessed
    FROM modules m
    LEFT JOIN child_module_progress p ON p.module_key = m.module_key AND p.child_id = ?
    ORDER BY m.order_position
  `).all(req.params.childId);

  res.json({ success: true, progress });
});

// ============================================
// ATIVIDADES
// ============================================

// Completar atividade
app.post('/api/activities/complete', authenticate, (req, res) => {
  try {
    const { childId, moduleKey, activityName, fpEarned } = req.body;

    // Verificar se criança pertence à família
    const child = db.prepare('SELECT id FROM children WHERE id = ? AND family_id = ?')
      .get(childId, req.familyId);

    if (!child) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Registrar atividade
    db.prepare(`
      INSERT INTO activities_completed (child_id, module_key, activity_name, fp_earned)
      VALUES (?, ?, ?, ?)
    `).run(childId, moduleKey, activityName, fpEarned || 0);

    // Buscar FP atual antes de atualizar
    const childBefore = db.prepare('SELECT total_fp FROM children WHERE id = ?').get(childId);
    const fpBefore = childBefore.total_fp;

    // Atualizar FP total
    db.prepare(`
      UPDATE children SET total_fp = total_fp + ? WHERE id = ?
    `).run(fpEarned || 0, childId);

    // Criar memória ao atingir marcos de FP (100, 500, 1000, 2000)
    const fpAfter = fpBefore + (fpEarned || 0);
    const fpMilestones = [100, 500, 1000, 2000, 5000];
    for (const milestone of fpMilestones) {
      if (fpBefore < milestone && fpAfter >= milestone) {
        createMascotMemory(
          childId,
          'growth_moment',
          `você alcançou ${milestone} FP! Que jornada incrível! 🎉`,
          { fpMilestone: milestone }
        );
      }
    }

    // Atualizar progresso do módulo
    db.prepare(`
      UPDATE child_module_progress
      SET activities_completed = activities_completed + 1,
          last_accessed = CURRENT_TIMESTAMP
      WHERE child_id = ? AND module_key = ?
    `).run(childId, moduleKey);

    // Atualizar mascote (energia +5, happiness +10)
    db.prepare(`
      UPDATE mascot
      SET energy = MIN(energy + 5, 100),
          happiness = MIN(happiness + 10, 100)
      WHERE child_id = ?
    `).run(childId);

    // Criar memória de marco importante (milestone) a cada 5 atividades
    const totalActivities = db.prepare('SELECT COUNT(*) as count FROM activities_completed WHERE child_id = ?').get(childId);
    if (totalActivities && totalActivities.count % 5 === 0) {
      createMascotMemory(
        childId,
        'milestone',
        `você completou ${totalActivities.count} atividades! Você está crescendo tanto! 🌟`,
        { totalActivities: totalActivities.count }
      );
    }

    // Verificar e conceder badges automaticamente
    checkAndAwardBadges(childId);

    res.json({ success: true, fpEarned });
  } catch (error) {
    console.error('Erro ao completar atividade:', error);
    res.status(500).json({ error: 'Erro ao registrar atividade' });
  }
});

// Obter atividades recentes
app.get('/api/children/:childId/activities', authenticate, (req, res) => {
  const activities = db.prepare(`
    SELECT * FROM activities_completed
    WHERE child_id = ?
    ORDER BY completed_at DESC
    LIMIT 20
  `).all(req.params.childId);

  res.json({ success: true, activities });
});

// ============================================
// CHECK-INS EMOCIONAIS
// ============================================

// Criar check-in
app.post('/api/emotional/checkin', authenticate, (req, res) => {
  try {
    const { childId, emotion, comfortLevel, wantsToTalk, notes } = req.body;

    db.prepare(`
      INSERT INTO emotional_checkins (child_id, emotion, comfort_level, wants_to_talk, notes)
      VALUES (?, ?, ?, ?, ?)
    `).run(childId, emotion, comfortLevel, wantsToTalk ? 1 : 0, notes || null);

    // Verificar e conceder badges automaticamente (streak badges)
    checkAndAwardBadges(childId);

    res.json({ success: true });
  } catch (error) {
    console.error('Erro no check-in:', error);
    res.status(500).json({ error: 'Erro ao registrar check-in' });
  }
});

// Obter check-ins recentes
app.get('/api/children/:childId/checkins', authenticate, (req, res) => {
  const checkins = db.prepare(`
    SELECT * FROM emotional_checkins
    WHERE child_id = ?
    ORDER BY created_at DESC
    LIMIT 10
  `).all(req.params.childId);

  res.json({ success: true, checkins });
});

// ============================================
// CÍRCULO DE CONFIANÇA
// ============================================

// Adicionar adulto de confiança
app.post('/api/trust-circle', authenticate, (req, res) => {
  try {
    const { childId, adultName, relationship } = req.body;

    db.prepare(`
      INSERT INTO trust_circle (child_id, adult_name, relationship)
      VALUES (?, ?, ?)
    `).run(childId, adultName, relationship);

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao adicionar adulto:', error);
    res.status(500).json({ error: 'Erro ao adicionar' });
  }
});

// Listar círculo de confiança
app.get('/api/children/:childId/trust-circle', authenticate, (req, res) => {
  const adults = db.prepare(`
    SELECT * FROM trust_circle WHERE child_id = ?
  `).all(req.params.childId);

  res.json({ success: true, adults });
});

// ============================================
// ÁREA DOS PAIS - RELATÓRIOS
// ============================================

// Dashboard dos pais
app.get('/api/parents/dashboard', authenticate, (req, res) => {
  try {
    // Crianças
    const children = db.prepare(`
      SELECT c.*, COUNT(a.id) as total_activities
      FROM children c
      LEFT JOIN activities_completed a ON a.child_id = c.id
      WHERE c.family_id = ?
      GROUP BY c.id
    `).all(req.familyId);

    // Estatísticas gerais
    const stats = db.prepare(`
      SELECT
        COUNT(DISTINCT c.id) as total_children,
        COALESCE(SUM(c.total_fp), 0) as total_fp,
        COUNT(a.id) as total_activities
      FROM children c
      LEFT JOIN activities_completed a ON a.child_id = c.id
      WHERE c.family_id = ?
    `).get(req.familyId);

    res.json({ success: true, children, stats });
  } catch (error) {
    console.error('Erro no dashboard:', error);
    res.status(500).json({ error: 'Erro ao carregar dashboard' });
  }
});

// ============================================
// COFRINHO FP (ECONOMIA INFANTIL)
// ============================================

// Obter dados do cofrinho
app.get('/api/children/:id/savings', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.id);

    // Verificar se criança pertence à família
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Buscar ou criar cofrinho
    let savings = db.prepare('SELECT * FROM child_savings WHERE child_id = ?').get(childId);
    if (!savings) {
      db.prepare(`
        INSERT INTO child_savings (child_id, fp_saved, last_yield_date)
        VALUES (?, 0, date('now'))
      `).run(childId);
      savings = db.prepare('SELECT * FROM child_savings WHERE child_id = ?').get(childId);
    }

    // Calcular rendimento pendente
    const today = new Date();
    const lastYield = savings.last_yield_date ? new Date(savings.last_yield_date) : null;
    let pendingYield = 0;

    if (lastYield) {
      const monthsDiff = (today.getFullYear() - lastYield.getFullYear()) * 12 +
                        (today.getMonth() - lastYield.getMonth());
      if (monthsDiff > 0 && savings.fp_saved > 0) {
        pendingYield = Math.floor(savings.fp_saved * 0.1); // 10% ao mês
      }
    }

    res.json({
      success: true,
      savings: {
        fpSaved: savings.fp_saved,
        totalYieldEarned: savings.total_yield_earned,
        pendingYield,
        lastYieldDate: savings.last_yield_date,
        childFP: child.total_fp
      }
    });
  } catch (error) {
    console.error('Erro ao buscar cofrinho:', error);
    res.status(500).json({ error: 'Erro ao buscar cofrinho' });
  }
});

// Depositar FP no cofrinho
app.post('/api/children/:id/savings/deposit', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.id);
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor inválido' });
    }

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Verificar se tem FP suficiente
    if (child.total_fp < amount) {
      return res.status(400).json({ error: 'FP insuficiente' });
    }

    // Buscar cofrinho
    let savings = db.prepare('SELECT * FROM child_savings WHERE child_id = ?').get(childId);
    if (!savings) {
      db.prepare(`
        INSERT INTO child_savings (child_id, fp_saved, last_yield_date)
        VALUES (?, 0, date('now'))
      `).run(childId);
      savings = db.prepare('SELECT * FROM child_savings WHERE child_id = ?').get(childId);
    }

    // Transação: retirar FP da criança e adicionar ao cofrinho
    const tx = db.transaction(() => {
      // Retirar FP da criança
      db.prepare('UPDATE children SET total_fp = total_fp - ? WHERE id = ?').run(amount, childId);

      // Adicionar ao cofrinho
      db.prepare('UPDATE child_savings SET fp_saved = fp_saved + ?, updated_at = datetime("now") WHERE child_id = ?')
        .run(amount, childId);

      // Registrar transação
      db.prepare(`
        INSERT INTO savings_transactions (child_id, transaction_type, amount, fp_saved_before, fp_saved_after, notes)
        VALUES (?, 'deposit', ?, ?, ?, ?)
      `).run(childId, amount, savings.fp_saved, savings.fp_saved + amount, 'Depósito no cofrinho');
    });

    tx();

    // Buscar dados atualizados
    const updatedChild = db.prepare('SELECT total_fp FROM children WHERE id = ?').get(childId);
    const updatedSavings = db.prepare('SELECT fp_saved FROM child_savings WHERE child_id = ?').get(childId);

    // Verificar e conceder badges automaticamente (saver_starter)
    checkAndAwardBadges(childId);

    res.json({
      success: true,
      childFP: updatedChild.total_fp,
      fpSaved: updatedSavings.fp_saved
    });
  } catch (error) {
    console.error('Erro ao depositar:', error);
    res.status(500).json({ error: 'Erro ao depositar' });
  }
});

// Retirar FP do cofrinho
app.post('/api/children/:id/savings/withdraw', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.id);
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor inválido' });
    }

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Buscar cofrinho
    const savings = db.prepare('SELECT * FROM child_savings WHERE child_id = ?').get(childId);
    if (!savings || savings.fp_saved < amount) {
      return res.status(400).json({ error: 'FP insuficiente no cofrinho' });
    }

    // Transação: retirar do cofrinho e adicionar à criança
    const tx = db.transaction(() => {
      // Retirar do cofrinho
      db.prepare('UPDATE child_savings SET fp_saved = fp_saved - ?, updated_at = datetime("now") WHERE child_id = ?')
        .run(amount, childId);

      // Adicionar à criança
      db.prepare('UPDATE children SET total_fp = total_fp + ? WHERE id = ?').run(amount, childId);

      // Registrar transação
      db.prepare(`
        INSERT INTO savings_transactions (child_id, transaction_type, amount, fp_saved_before, fp_saved_after, notes)
        VALUES (?, 'withdraw', ?, ?, ?, ?)
      `).run(childId, amount, savings.fp_saved, savings.fp_saved - amount, 'Retirada do cofrinho');
    });

    tx();

    // Buscar dados atualizados
    const updatedChild = db.prepare('SELECT total_fp FROM children WHERE id = ?').get(childId);
    const updatedSavings = db.prepare('SELECT fp_saved FROM child_savings WHERE child_id = ?').get(childId);

    res.json({
      success: true,
      childFP: updatedChild.total_fp,
      fpSaved: updatedSavings.fp_saved
    });
  } catch (error) {
    console.error('Erro ao retirar:', error);
    res.status(500).json({ error: 'Erro ao retirar' });
  }
});

// Aplicar rendimento mensal
app.post('/api/children/:id/savings/apply-yield', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.id);

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Buscar cofrinho
    const savings = db.prepare('SELECT * FROM child_savings WHERE child_id = ?').get(childId);
    if (!savings || savings.fp_saved === 0) {
      return res.status(400).json({ error: 'Sem FP no cofrinho' });
    }

    // Verificar se pode aplicar rendimento (1 mês desde último)
    const today = new Date();
    const lastYield = savings.last_yield_date ? new Date(savings.last_yield_date) : null;

    if (lastYield) {
      const monthsDiff = (today.getFullYear() - lastYield.getFullYear()) * 12 +
                        (today.getMonth() - lastYield.getMonth());
      if (monthsDiff < 1) {
        return res.status(400).json({ error: 'Rendimento só pode ser aplicado mensalmente' });
      }
    }

    // Calcular rendimento (10%)
    const yieldAmount = Math.floor(savings.fp_saved * 0.1);

    if (yieldAmount === 0) {
      return res.status(400).json({ error: 'Rendimento muito baixo' });
    }

    // Transação: adicionar rendimento
    const tx = db.transaction(() => {
      // Adicionar rendimento ao cofrinho
      db.prepare(`
        UPDATE child_savings
        SET fp_saved = fp_saved + ?,
            total_yield_earned = total_yield_earned + ?,
            last_yield_date = date('now'),
            updated_at = datetime('now')
        WHERE child_id = ?
      `).run(yieldAmount, yieldAmount, childId);

      // Registrar transação
      db.prepare(`
        INSERT INTO savings_transactions (child_id, transaction_type, amount, fp_saved_before, fp_saved_after, notes)
        VALUES (?, 'yield', ?, ?, ?, ?)
      `).run(childId, yieldAmount, savings.fp_saved, savings.fp_saved + yieldAmount, 'Rendimento mensal (10%)');
    });

    tx();

    // Buscar dados atualizados
    const updatedSavings = db.prepare('SELECT * FROM child_savings WHERE child_id = ?').get(childId);

    res.json({
      success: true,
      yieldAmount,
      fpSaved: updatedSavings.fp_saved,
      totalYieldEarned: updatedSavings.total_yield_earned
    });
  } catch (error) {
    console.error('Erro ao aplicar rendimento:', error);
    res.status(500).json({ error: 'Erro ao aplicar rendimento' });
  }
});

// ============================================
// FASE 8: DIAS ATIVOS E ROTINA
// ============================================

// Registrar dia ativo (chamado automaticamente ao entrar)
function registerActiveDay(childId) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Verificar se já registrou hoje
    const existing = db.prepare('SELECT * FROM child_active_days WHERE child_id = ? AND date = ?').get(childId, today);

    if (!existing) {
      // Criar registro do dia
      db.prepare(`
        INSERT INTO child_active_days (child_id, date, activities_count, time_spent_minutes)
        VALUES (?, ?, 0, 0)
      `).run(childId, today);

      // Atualizar estatísticas de constância
      let stats = db.prepare('SELECT * FROM child_consistency_stats WHERE child_id = ?').get(childId);

      if (!stats) {
        // Criar estatísticas se não existir
        db.prepare(`
          INSERT INTO child_consistency_stats (child_id, total_active_days, current_month_days, last_active_date)
          VALUES (?, 1, 1, ?)
        `).run(childId, today);
      } else {
        // Atualizar estatísticas
        const lastDate = new Date(stats.last_active_date);
        const todayDate = new Date(today);
        const isNewMonth = lastDate.getMonth() !== todayDate.getMonth() || lastDate.getFullYear() !== todayDate.getFullYear();

        db.prepare(`
          UPDATE child_consistency_stats
          SET total_active_days = total_active_days + 1,
              current_month_days = ${isNewMonth ? 1 : 'current_month_days + 1'},
              last_active_date = ?,
              updated_at = datetime('now')
          WHERE child_id = ?
        `).run(today, childId);
      }

      console.log(`📅 Dia ativo registrado para criança ${childId}`);
    }
  } catch (error) {
    console.error('Erro ao registrar dia ativo:', error);
  }
}

// Buscar estatísticas de constância
app.get('/api/children/:id/consistency', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.id);

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Buscar estatísticas
    let stats = db.prepare('SELECT * FROM child_consistency_stats WHERE child_id = ?').get(childId);

    if (!stats) {
      // Criar estatísticas padrão
      stats = {
        total_active_days: 0,
        current_month_days: 0,
        last_active_date: null,
        longest_gentle_streak: 0
      };
    }

    // Buscar dias ativos recentes (últimos 30 dias)
    const recentDays = db.prepare(`
      SELECT date, activities_count
      FROM child_active_days
      WHERE child_id = ?
      AND date >= date('now', '-30 days')
      ORDER BY date DESC
    `).all(childId);

    res.json({
      stats: {
        totalActiveDays: stats.total_active_days,
        currentMonthDays: stats.current_month_days,
        lastActiveDate: stats.last_active_date,
        longestGentleStreak: stats.longest_gentle_streak
      },
      recentDays
    });
  } catch (error) {
    console.error('Erro ao buscar constância:', error);
    res.status(500).json({ error: 'Erro ao buscar constância' });
  }
});

// Buscar ou criar rotina do dia
app.get('/api/children/:id/daily-routine', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.id);
    const today = new Date().toISOString().split('T')[0];

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Buscar rotina do dia
    let routine = db.prepare('SELECT * FROM daily_routines WHERE child_id = ? AND date = ?').get(childId, today);

    if (!routine) {
      // Criar rotina do dia
      const mascotMessages = [
        'Que bom te ver hoje! 💙',
        'Pronto para uma aventura leve? 🌟',
        'Vamos crescer um pouquinho hoje? 🌱',
        'Oi! O que você quer explorar? 🚀',
        'Estou feliz que você voltou! 🤗'
      ];

      const randomMessage = mascotMessages[Math.floor(Math.random() * mascotMessages.length)];

      // Sugerir missão simples baseada nos módulos
      const modules = db.prepare('SELECT module_key, name FROM modules WHERE is_active = 1 ORDER BY RANDOM() LIMIT 1').get();

      const missionSuggestion = modules ? {
        moduleKey: modules.module_key,
        moduleName: modules.name,
        suggestion: `Que tal explorar "${modules.name}" hoje?`
      } : null;

      db.prepare(`
        INSERT INTO daily_routines (child_id, date, mascot_message, mission_suggested)
        VALUES (?, ?, ?, ?)
      `).run(childId, today, randomMessage, missionSuggestion ? JSON.stringify(missionSuggestion) : null);

      routine = db.prepare('SELECT * FROM daily_routines WHERE child_id = ? AND date = ?').get(childId, today);
    }

    res.json({
      routine: {
        date: routine.date,
        checkinSuggested: routine.checkin_suggested === 1,
        checkinCompleted: routine.checkin_completed === 1,
        missionSuggested: routine.mission_suggested ? JSON.parse(routine.mission_suggested) : null,
        missionCompleted: routine.mission_completed === 1,
        mascotMessage: routine.mascot_message,
        messageShown: routine.message_shown === 1
      }
    });
  } catch (error) {
    console.error('Erro ao buscar rotina do dia:', error);
    res.status(500).json({ error: 'Erro ao buscar rotina do dia' });
  }
});

// Marcar check-in da rotina como completo
app.post('/api/children/:id/daily-routine/checkin', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.id);
    const today = new Date().toISOString().split('T')[0];

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Atualizar rotina
    db.prepare(`
      UPDATE daily_routines
      SET checkin_completed = 1
      WHERE child_id = ? AND date = ?
    `).run(childId, today);

    // Atualizar dia ativo
    db.prepare(`
      UPDATE child_active_days
      SET checkin_done = 1
      WHERE child_id = ? AND date = ?
    `).run(childId, today);

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao marcar check-in:', error);
    res.status(500).json({ error: 'Erro ao marcar check-in' });
  }
});

// Buscar eventos ativos
app.get('/api/events/active', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const events = db.prepare(`
      SELECT * FROM active_events
      WHERE is_active = 1
      AND start_date <= ?
      AND end_date >= ?
      ORDER BY start_date DESC
    `).all(today, today);

    res.json({ events });
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
});

// ============================================
// BADGES/CONQUISTAS
// ============================================

// Buscar badges da criança
app.get('/api/children/:id/badges', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.id);

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Buscar badges conquistados
    const earnedBadges = db.prepare(`
      SELECT cb.*, b.badge_name, b.description, b.icon, b.category
      FROM child_badges cb
      JOIN badges b ON cb.badge_key = b.badge_key
      WHERE cb.child_id = ?
      ORDER BY cb.earned_at DESC
    `).all(childId);

    // Contar novos badges
    const newBadgesCount = earnedBadges.filter(b => b.is_new === 1).length;

    res.json({
      badges: earnedBadges,
      totalBadges: earnedBadges.length,
      newBadges: newBadgesCount
    });
  } catch (error) {
    console.error('Erro ao buscar badges:', error);
    res.status(500).json({ error: 'Erro ao buscar badges' });
  }
});

// Marcar badges como vistos
app.post('/api/children/:id/badges/mark-seen', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.id);

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Marcar todos badges como vistos
    db.prepare('UPDATE child_badges SET is_new = 0 WHERE child_id = ?').run(childId);

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao marcar badges como vistos:', error);
    res.status(500).json({ error: 'Erro ao marcar badges como vistos' });
  }
});

// Verificar e conceder badges automaticamente
function checkAndAwardBadges(childId) {
  try {
    const child = db.prepare('SELECT * FROM children WHERE id = ?').get(childId);
    if (!child) return;

    // Contar missões totais (novo sistema)
    const totalMissions = db.prepare('SELECT COUNT(*) as count FROM child_mission_progress WHERE child_id = ?').get(childId);
    const missionCount = totalMissions.count;

    // BADGES DE PROGRESSÃO (infinitos)
    const progressBadges = [
      { key: 'first_steps', threshold: 1, name: 'Primeiros Passos' },
      { key: 'explorer', threshold: 5, name: 'Explorador' },
      { key: 'adventurer', threshold: 10, name: 'Aventureiro' },
      { key: 'hero', threshold: 25, name: 'Herói' },
      { key: 'champion', threshold: 50, name: 'Campeão' },
      { key: 'legend', threshold: 100, name: 'Lenda' },
      { key: 'master', threshold: 250, name: 'Mestre' },
      { key: 'grandmaster', threshold: 500, name: 'Grão-Mestre' }
    ];

    progressBadges.forEach(badge => {
      if (missionCount >= badge.threshold) {
        awardBadgeIfNotEarned(childId, badge.key);
      }
    });

    // BADGES POR ÁREA
    const areas = ['emotions', 'body', 'safety', 'creativity', 'languages'];
    areas.forEach(area => {
      const areaCount = db.prepare(`
        SELECT COUNT(*) as count FROM child_mission_progress cmp
        JOIN missions m ON m.id = cmp.mission_id
        WHERE cmp.child_id = ? AND m.area = ?
      `).get(childId, area);

      if (areaCount.count >= 5) awardBadgeIfNotEarned(childId, `${area}_beginner`);
      if (areaCount.count >= 10) awardBadgeIfNotEarned(childId, `${area}_expert`);
      if (areaCount.count >= 20) awardBadgeIfNotEarned(childId, `${area}_master`);
    });

    // BADGES DE FP (economia)
    const fpMilestones = [
      { key: 'fp_100', threshold: 100 },
      { key: 'fp_500', threshold: 500 },
      { key: 'fp_1000', threshold: 1000 },
      { key: 'fp_5000', threshold: 5000 }
    ];

    fpMilestones.forEach(milestone => {
      if (child.total_fp >= milestone.threshold) {
        awardBadgeIfNotEarned(childId, milestone.key);
      }
    });

    // BADGES DE COFRINHO
    const savings = db.prepare('SELECT * FROM child_savings WHERE child_id = ?').get(childId);
    if (savings) {
      if (savings.fp_saved > 0) awardBadgeIfNotEarned(childId, 'saver_starter');
      if (savings.fp_saved >= 100) awardBadgeIfNotEarned(childId, 'saver_bronze');
      if (savings.fp_saved >= 500) awardBadgeIfNotEarned(childId, 'saver_silver');
      if (savings.fp_saved >= 1000) awardBadgeIfNotEarned(childId, 'saver_gold');
      if (savings.total_yield_earned >= 100) awardBadgeIfNotEarned(childId, 'investor');
    }

    // BADGES DE MASCOTE (níveis)
    const mascot = db.prepare('SELECT * FROM mascot WHERE child_id = ?').get(childId);
    if (mascot) {
      if (mascot.level >= 5) awardBadgeIfNotEarned(childId, 'partner_5');
      if (mascot.level >= 10) awardBadgeIfNotEarned(childId, 'partner_10');
      if (mascot.level >= 25) awardBadgeIfNotEarned(childId, 'partner_25');
      if (mascot.level >= 50) awardBadgeIfNotEarned(childId, 'partner_50');
    }

    // BADGES DE LOJA
    const itemsOwned = db.prepare('SELECT COUNT(*) as count FROM child_inventory WHERE child_id = ?').get(childId);
    if (itemsOwned.count >= 1) awardBadgeIfNotEarned(childId, 'shopper');
    if (itemsOwned.count >= 5) awardBadgeIfNotEarned(childId, 'collector');
    if (itemsOwned.count >= 10) awardBadgeIfNotEarned(childId, 'fashionista');

    // BADGES DE FASES
    const phase1Complete = db.prepare(`
      SELECT COUNT(*) as count FROM child_mission_progress cmp
      JOIN missions m ON m.id = cmp.mission_id
      WHERE cmp.child_id = ? AND m.phase = 1
    `).get(childId);
    const phase1Total = db.prepare('SELECT COUNT(*) as count FROM missions WHERE phase = 1 AND is_active = 1').get();

    if (phase1Complete.count >= phase1Total.count && phase1Total.count > 0) {
      awardBadgeIfNotEarned(childId, 'phase_1_complete');
    }

    const phase2Complete = db.prepare(`
      SELECT COUNT(*) as count FROM child_mission_progress cmp
      JOIN missions m ON m.id = cmp.mission_id
      WHERE cmp.child_id = ? AND m.phase = 2
    `).get(childId);
    const phase2Total = db.prepare('SELECT COUNT(*) as count FROM missions WHERE phase = 2 AND is_active = 1').get();

    if (phase2Complete.count >= phase2Total.count && phase2Total.count > 0) {
      awardBadgeIfNotEarned(childId, 'phase_2_complete');
    }

    const phase3Complete = db.prepare(`
      SELECT COUNT(*) as count FROM child_mission_progress cmp
      JOIN missions m ON m.id = cmp.mission_id
      WHERE cmp.child_id = ? AND m.phase = 3
    `).get(childId);
    const phase3Total = db.prepare('SELECT COUNT(*) as count FROM missions WHERE phase = 3 AND is_active = 1').get();

    if (phase3Complete.count >= phase3Total.count && phase3Total.count > 0) {
      awardBadgeIfNotEarned(childId, 'phase_3_complete');
    }

  } catch (error) {
    console.error('Erro ao verificar badges:', error);
  }
}

// Conceder badge se ainda não foi conquistado
function awardBadgeIfNotEarned(childId, badgeKey) {
  try {
    const existing = db.prepare('SELECT * FROM child_badges WHERE child_id = ? AND badge_key = ?').get(childId, badgeKey);

    if (!existing) {
      db.prepare(`
        INSERT INTO child_badges (child_id, badge_key, is_new)
        VALUES (?, ?, 1)
      `).run(childId, badgeKey);

      // Buscar informações do badge
      const badge = db.prepare('SELECT * FROM badges WHERE badge_key = ?').get(badgeKey);

      // Criar memória positiva para o mascote
      if (badge) {
        createMascotMemory(childId, 'achievement', `Você conquistou: ${badge.badge_name}! ${badge.description}`, {
          badgeKey: badgeKey,
          badgeName: badge.badge_name,
          badgeIcon: badge.icon
        });
      }

      console.log(`🏆 Badge "${badgeKey}" concedido para criança ${childId}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao conceder badge:', error);
    return false;
  }
}

// ============================================
// MEMÓRIA DO MASCOTE
// ============================================

// Criar memória positiva
function createMascotMemory(childId, memoryType, memoryText, contextData = null) {
  try {
    db.prepare(`
      INSERT INTO mascot_memories (child_id, memory_type, memory_text, context_data)
      VALUES (?, ?, ?, ?)
    `).run(childId, memoryType, memoryText, contextData ? JSON.stringify(contextData) : null);

    console.log(`💭 Memória criada para criança ${childId}: ${memoryText}`);
  } catch (error) {
    console.error('Erro ao criar memória:', error);
  }
}

// Buscar memórias do mascote
app.get('/api/children/:id/mascot-memories', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.id);

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Buscar memórias (priorizando as menos mostradas)
    const memories = db.prepare(`
      SELECT * FROM mascot_memories
      WHERE child_id = ?
      ORDER BY times_shown ASC, created_at DESC
      LIMIT 10
    `).all(childId);

    res.json({ memories });
  } catch (error) {
    console.error('Erro ao buscar memórias:', error);
    res.status(500).json({ error: 'Erro ao buscar memórias' });
  }
});

// Marcar memória como mostrada
app.post('/api/children/:id/mascot-memories/:memoryId/shown', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.id);
    const memoryId = parseInt(req.params.memoryId);

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Atualizar memória
    db.prepare(`
      UPDATE mascot_memories
      SET times_shown = times_shown + 1,
          last_shown = datetime('now')
      WHERE id = ? AND child_id = ?
    `).run(memoryId, childId);

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao marcar memória:', error);
    res.status(500).json({ error: 'Erro ao marcar memória' });
  }
});

// ============================================
// SISTEMA DE FASES E PROGRESSÃO
// ============================================

// Inicializar fases para uma criança (Fase 1 desbloqueada por padrão)
function initializePhasesForChild(childId) {
  try {
    for (let phase = 1; phase <= 3; phase++) {
      const exists = db.prepare('SELECT id FROM phases_unlock WHERE child_id = ? AND phase = ?').get(childId, phase);
      if (!exists) {
        db.prepare(`
          INSERT INTO phases_unlock (child_id, phase, unlocked, unlocked_at)
          VALUES (?, ?, ?, ?)
        `).run(childId, phase, phase === 1 ? 1 : 0, phase === 1 ? new Date().toISOString() : null);
      }
    }
  } catch (error) {
    console.error('Erro ao inicializar fases:', error);
  }
}

// Verificar e desbloquear próxima fase automaticamente
function checkAndUnlockNextPhase(childId) {
  try {
    // Buscar fase atual
    const currentPhases = db.prepare(`
      SELECT phase, unlocked FROM phases_unlock
      WHERE child_id = ?
      ORDER BY phase
    `).all(childId);

    for (let i = 0; i < currentPhases.length; i++) {
      const phaseData = currentPhases[i];
      const nextPhaseData = currentPhases[i + 1];

      if (phaseData.unlocked === 1 && nextPhaseData && nextPhaseData.unlocked === 0) {
        // Contar missões da fase atual
        const totalMissions = db.prepare('SELECT COUNT(*) as count FROM missions WHERE phase = ? AND is_active = 1').get(phaseData.phase);
        const completedMissions = db.prepare(`
          SELECT COUNT(*) as count FROM child_mission_progress cmp
          JOIN missions m ON m.id = cmp.mission_id
          WHERE cmp.child_id = ? AND m.phase = ? AND m.is_active = 1
        `).get(childId, phaseData.phase);

        // Se completou todas, desbloquear próxima
        if (completedMissions.count >= totalMissions.count && totalMissions.count > 0) {
          db.prepare(`
            UPDATE phases_unlock
            SET unlocked = 1, unlocked_at = datetime('now')
            WHERE child_id = ? AND phase = ?
          `).run(childId, nextPhaseData.phase);

          console.log(`🎉 Fase ${nextPhaseData.phase} desbloqueada para criança ${childId}!`);

          // Criar memória do mascote
          createMascotMemory(
            childId,
            'phase_unlock',
            `Parabéns! Você desbloqueou a Fase ${nextPhaseData.phase}! Que jornada incrível! 🎉`,
            { phase: nextPhaseData.phase }
          );
          return true;
        }
      }
    }
    return false;
  } catch (error) {
    console.error('Erro ao verificar desbloqueio de fase:', error);
    return false;
  }
}

// GET /api/children/:id/phases - Status de desbloqueio das fases
app.get('/api/children/:id/phases', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.id);

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Inicializar fases se não existirem
    initializePhasesForChild(childId);

    // Buscar status das fases
    const phases = db.prepare(`
      SELECT phase, unlocked, unlocked_at FROM phases_unlock
      WHERE child_id = ?
      ORDER BY phase
    `).all(childId);

    // Para cada fase, contar progresso
    const phasesWithProgress = phases.map(p => {
      const totalMissions = db.prepare('SELECT COUNT(*) as count FROM missions WHERE phase = ? AND is_active = 1').get(p.phase);
      const completedMissions = db.prepare(`
        SELECT COUNT(*) as count FROM child_mission_progress cmp
        JOIN missions m ON m.id = cmp.mission_id
        WHERE cmp.child_id = ? AND m.phase = ? AND m.is_active = 1
      `).get(childId, p.phase);

      return {
        phase: p.phase,
        unlocked: p.unlocked === 1,
        unlockedAt: p.unlocked_at,
        totalMissions: totalMissions.count,
        completedMissions: completedMissions.count,
        progress: totalMissions.count > 0 ? Math.round((completedMissions.count / totalMissions.count) * 100) : 0
      };
    });

    res.json({ success: true, phases: phasesWithProgress });
  } catch (error) {
    console.error('Erro ao buscar fases:', error);
    res.status(500).json({ error: 'Erro ao buscar fases' });
  }
});

// ============================================
// MISSÕES (NOVO SISTEMA)
// ============================================

// GET /api/children/:childId/missions - Listar missões por fase/área
app.get('/api/children/:childId/missions', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const phase = req.query.phase ? parseInt(req.query.phase) : null;
    const area = req.query.area;

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Inicializar fases
    initializePhasesForChild(childId);

    // Construir query
    let query = 'SELECT m.* FROM missions m WHERE m.is_active = 1';
    const params = [];

    if (phase) {
      query += ' AND m.phase = ?';
      params.push(phase);
    }

    if (area) {
      query += ' AND m.area = ?';
      params.push(area);
    }

    query += ' ORDER BY m.phase, m.id';

    const missions = db.prepare(query).all(...params);

    // Para cada missão, verificar se foi completada
    const missionsWithProgress = missions.map(m => {
      const progress = db.prepare('SELECT * FROM child_mission_progress WHERE child_id = ? AND mission_id = ?').get(childId, m.id);

      // Verificar se é missão nova (gerada nos últimos 7 dias)
      const isNew = m.is_generated === 1 && m.generated_at &&
        new Date(m.generated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      return {
        ...m,
        completed: !!progress,
        completedAt: progress?.completed_at,
        choice: progress?.choice,
        fpEarned: progress?.fp_earned,
        isNew: isNew,
        isGenerated: m.is_generated === 1
      };
    });

    res.json({ success: true, missions: missionsWithProgress });
  } catch (error) {
    console.error('Erro ao buscar missões:', error);
    res.status(500).json({ error: 'Erro ao buscar missões' });
  }
});

// POST /api/children/:childId/missions/:missionId/complete - Completar missão
app.post('/api/children/:childId/missions/:missionId/complete', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const missionId = parseInt(req.params.missionId);
    const { choice } = req.body; // 'A', 'B', ou 'C'

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Buscar missão
    const mission = db.prepare('SELECT * FROM missions WHERE id = ? AND is_active = 1').get(missionId);
    if (!mission) {
      return res.status(404).json({ error: 'Missão não encontrada' });
    }

    // Verificar se a fase está desbloqueada
    const phaseUnlock = db.prepare('SELECT unlocked FROM phases_unlock WHERE child_id = ? AND phase = ?').get(childId, mission.phase);
    if (!phaseUnlock || phaseUnlock.unlocked === 0) {
      return res.status(403).json({ error: 'Fase não desbloqueada' });
    }

    // Verificar se já completou
    const existing = db.prepare('SELECT * FROM child_mission_progress WHERE child_id = ? AND mission_id = ?').get(childId, missionId);
    if (existing) {
      return res.status(400).json({ error: 'Missão já completada' });
    }

    const fpReward = mission.fp_reward || 10;

    // Transação: registrar progresso e dar FP
    const tx = db.transaction(() => {
      // Registrar progresso
      db.prepare(`
        INSERT INTO child_mission_progress (child_id, mission_id, choice, fp_earned)
        VALUES (?, ?, ?, ?)
      `).run(childId, missionId, choice, fpReward);

      // Dar FP
      db.prepare('UPDATE children SET total_fp = total_fp + ? WHERE id = ?').run(fpReward, childId);
    });

    tx();

    // Atualizar mascote e calcular nível (após transação)
    const mascot = db.prepare('SELECT * FROM mascot WHERE child_id = ?').get(childId);
    const totalMissions = db.prepare('SELECT COUNT(*) as count FROM child_mission_progress WHERE child_id = ?').get(childId);

    // Sistema de níveis: a cada 5 missões, sobe 1 nível
    const newLevel = Math.floor(totalMissions.count / 5) + 1;

    db.prepare(`
      UPDATE mascot
      SET energy = MIN(energy + 5, 100),
          happiness = MIN(happiness + 10, 100),
          level = ?
      WHERE child_id = ?
    `).run(newLevel, childId);

    // Se subiu de nível, criar memória
    if (mascot && newLevel > mascot.level) {
      createMascotMemory(
        childId,
        'level_up',
        `Parabéns! Eu subi para o nível ${newLevel}! Estamos crescendo juntos! 🌟`,
        { level: newLevel }
      );
    }

    // Verificar badges
    checkAndAwardBadges(childId);

    // Verificar desbloqueio de próxima fase
    const unlockedNewPhase = checkAndUnlockNextPhase(childId);

    res.json({
      success: true,
      fpEarned: fpReward,
      unlockedNewPhase
    });
  } catch (error) {
    console.error('Erro ao completar missão:', error);
    res.status(500).json({ error: 'Erro ao completar missão' });
  }
});

// ============================================
// MAPA DO MUNDO (ÁREAS)
// ============================================

// GET /api/children/:childId/map - Resumo por área
app.get('/api/children/:childId/map', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    const areas = ['emotions', 'body', 'safety', 'creativity', 'languages'];
    const mapData = areas.map(area => {
      // Total de missões na área (todas as fases desbloqueadas)
      const unlockedPhases = db.prepare('SELECT phase FROM phases_unlock WHERE child_id = ? AND unlocked = 1').all(childId);
      const phaseNumbers = unlockedPhases.map(p => p.phase);

      let totalMissions = 0;
      let completedMissions = 0;

      if (phaseNumbers.length > 0) {
        const placeholders = phaseNumbers.map(() => '?').join(',');
        totalMissions = db.prepare(`SELECT COUNT(*) as count FROM missions WHERE area = ? AND phase IN (${placeholders}) AND is_active = 1`)
          .get(area, ...phaseNumbers).count;

        completedMissions = db.prepare(`
          SELECT COUNT(*) as count FROM child_mission_progress cmp
          JOIN missions m ON m.id = cmp.mission_id
          WHERE cmp.child_id = ? AND m.area = ? AND m.phase IN (${placeholders}) AND m.is_active = 1
        `).get(childId, area, ...phaseNumbers).count;
      }

      return {
        area,
        totalMissions,
        completedMissions,
        progress: totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0
      };
    });

    res.json({ success: true, map: mapData });
  } catch (error) {
    console.error('Erro ao buscar mapa:', error);
    res.status(500).json({ error: 'Erro ao buscar mapa' });
  }
});

// ============================================
// LOJA FP
// ============================================

// GET /api/store/items - Listar itens da loja
app.get('/api/store/items', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM store_items WHERE is_active = 1 ORDER BY cost_fp').all();
    res.json({ success: true, items });
  } catch (error) {
    console.error('Erro ao buscar loja:', error);
    res.status(500).json({ error: 'Erro ao buscar loja' });
  }
});

// POST /api/store/buy - Comprar item
app.post('/api/store/buy', authenticate, (req, res) => {
  try {
    const { childId, itemId } = req.body;

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Buscar item
    const item = db.prepare('SELECT * FROM store_items WHERE id = ? AND is_active = 1').get(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    // Verificar se já comprou
    const existing = db.prepare('SELECT * FROM child_inventory WHERE child_id = ? AND item_id = ?').get(childId, itemId);
    if (existing) {
      return res.status(400).json({ error: 'Item já comprado' });
    }

    // Verificar FP
    if (child.total_fp < item.cost_fp) {
      return res.status(400).json({ error: 'FP insuficiente' });
    }

    // Transação: deduzir FP e adicionar ao inventário
    const tx = db.transaction(() => {
      db.prepare('UPDATE children SET total_fp = total_fp - ? WHERE id = ?').run(item.cost_fp, childId);
      db.prepare('INSERT INTO child_inventory (child_id, item_id) VALUES (?, ?)').run(childId, itemId);
    });

    tx();

    res.json({ success: true, newFP: child.total_fp - item.cost_fp });
  } catch (error) {
    console.error('Erro ao comprar item:', error);
    res.status(500).json({ error: 'Erro ao comprar item' });
  }
});

// POST /api/store/equip - Equipar item
app.post('/api/store/equip', authenticate, (req, res) => {
  try {
    const { childId, itemId } = req.body;

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Verificar se possui o item
    const inventoryItem = db.prepare('SELECT * FROM child_inventory WHERE child_id = ? AND item_id = ?').get(childId, itemId);
    if (!inventoryItem) {
      return res.status(404).json({ error: 'Item não encontrado no inventário' });
    }

    // Buscar tipo do item
    const item = db.prepare('SELECT type FROM store_items WHERE id = ?').get(itemId);

    // Desequipar outros itens do mesmo tipo
    db.prepare(`
      UPDATE child_inventory
      SET equipped = 0
      WHERE child_id = ? AND item_id IN (SELECT id FROM store_items WHERE type = ?)
    `).run(childId, item.type);

    // Equipar este item
    db.prepare('UPDATE child_inventory SET equipped = 1 WHERE child_id = ? AND item_id = ?').run(childId, itemId);

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao equipar item:', error);
    res.status(500).json({ error: 'Erro ao equipar item' });
  }
});

// GET /api/children/:childId/inventory - Inventário da criança
app.get('/api/children/:childId/inventory', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    const inventory = db.prepare(`
      SELECT ci.*, si.name, si.type, si.cost_fp, si.asset_key, si.description
      FROM child_inventory ci
      JOIN store_items si ON si.id = ci.item_id
      WHERE ci.child_id = ?
      ORDER BY ci.purchased_at DESC
    `).all(childId);

    res.json({ success: true, inventory });
  } catch (error) {
    console.error('Erro ao buscar inventário:', error);
    res.status(500).json({ error: 'Erro ao buscar inventário' });
  }
});

// ============================================
// COFRINHO FP - RENDIMENTO MENSAL (CORRIGIDO)
// ============================================

// Atualizar endpoint de rendimento com regra de 3% ao mês e teto de 100 FP
app.post('/api/children/:id/savings/apply-interest', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.id);

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Buscar cofrinho
    const savings = db.prepare('SELECT * FROM child_savings WHERE child_id = ?').get(childId);
    if (!savings || savings.fp_saved === 0) {
      return res.status(400).json({ error: 'Sem FP no cofrinho' });
    }

    // Verificar se pode aplicar rendimento (1 mês desde último)
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Verificar se já aplicou este mês
    const existingInterest = db.prepare('SELECT * FROM savings_interest_log WHERE child_id = ? AND year_month = ?').get(childId, yearMonth);
    if (existingInterest) {
      return res.status(400).json({ error: 'Rendimento já aplicado este mês' });
    }

    // Calcular rendimento: 3% ao mês com teto de 100 FP
    const interestRate = 0.03;
    const interestAmount = Math.min(Math.floor(savings.fp_saved * interestRate), 100);

    if (interestAmount === 0) {
      return res.status(400).json({ error: 'Rendimento muito baixo' });
    }

    // Transação: adicionar rendimento
    const tx = db.transaction(() => {
      // Adicionar rendimento ao cofrinho
      db.prepare(`
        UPDATE child_savings
        SET fp_saved = fp_saved + ?,
            total_yield_earned = total_yield_earned + ?,
            last_yield_date = date('now'),
            updated_at = datetime('now')
        WHERE child_id = ?
      `).run(interestAmount, interestAmount, childId);

      // Registrar no log de interesse
      db.prepare(`
        INSERT INTO savings_interest_log (child_id, year_month, interest_fp)
        VALUES (?, ?, ?)
      `).run(childId, yearMonth, interestAmount);

      // Registrar transação
      db.prepare(`
        INSERT INTO savings_transactions (child_id, transaction_type, amount, fp_saved_before, fp_saved_after, notes)
        VALUES (?, 'yield', ?, ?, ?, ?)
      `).run(childId, interestAmount, savings.fp_saved, savings.fp_saved + interestAmount, `Rendimento mensal (3%, máx 100 FP)`);
    });

    tx();

    // Buscar dados atualizados
    const updatedSavings = db.prepare('SELECT * FROM child_savings WHERE child_id = ?').get(childId);

    // Criar memória do mascote
    createMascotMemory(
      childId,
      'savings_interest',
      `Seu cofrinho rendeu ${interestAmount} FP este mês! Que legal guardar dinheiro! 💰`,
      { interestAmount, yearMonth }
    );

    res.json({
      success: true,
      interestAmount,
      fpSaved: updatedSavings.fp_saved,
      totalYieldEarned: updatedSavings.total_yield_earned
    });
  } catch (error) {
    console.error('Erro ao aplicar rendimento:', error);
    res.status(500).json({ error: 'Erro ao aplicar rendimento' });
  }
});

// GET /api/children/:id/savings/interest-status - Status do rendimento mensal
app.get('/api/children/:id/savings/interest-status', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.id);

    // Verificar criança
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?').get(childId, req.familyId);
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Verificar se já aplicou este mês
    const existingInterest = db.prepare('SELECT * FROM savings_interest_log WHERE child_id = ? AND year_month = ?').get(childId, yearMonth);

    // Buscar cofrinho
    const savings = db.prepare('SELECT * FROM child_savings WHERE child_id = ?').get(childId);
    const fpSaved = savings?.fp_saved || 0;

    // Calcular rendimento disponível
    const interestRate = 0.03;
    const pendingInterest = existingInterest ? 0 : Math.min(Math.floor(fpSaved * interestRate), 100);

    res.json({
      success: true,
      canApply: !existingInterest && fpSaved > 0,
      alreadyAppliedThisMonth: !!existingInterest,
      pendingInterest,
      yearMonth,
      appliedAt: existingInterest?.applied_at
    });
  } catch (error) {
    console.error('Erro ao verificar status de rendimento:', error);
    res.status(500).json({ error: 'Erro ao verificar status' });
  }
});

// ============================================
// DIA 1 - GERADOR DE MISSÕES INFINITAS
// ============================================

const missionGenerator = require('./mission-generator');
const carouselGenerator = require('./carousel-generator');
const eventsManager = require('./events-manager');

// POST /api/admin/generate-missions - Gerar missões automaticamente
app.post('/api/admin/generate-missions', authenticate, (req, res) => {
  try {
    const {
      area,
      difficulty,
      count = 10,
      phase = 4,
      balanced = false
    } = req.body;

    let missions;

    if (balanced) {
      // Gera missões balanceadas entre todas as áreas
      missions = missionGenerator.generateBalancedMissions(db, count, phase);
    } else {
      // Gera missões com parâmetros específicos
      missions = missionGenerator.generateMissions(db, {
        area,
        difficulty,
        count,
        phase
      });
    }

    res.json({
      success: true,
      count: missions.length,
      missions,
      message: `${missions.length} missões geradas com sucesso!`
    });
  } catch (error) {
    console.error('Erro ao gerar missões:', error);
    res.status(500).json({ error: 'Erro ao gerar missões' });
  }
});

// GET /api/admin/templates - Listar templates disponíveis
app.get('/api/admin/templates', authenticate, (req, res) => {
  try {
    const { area, difficulty } = req.query;

    let query = 'SELECT * FROM mission_templates WHERE is_active = 1';
    const params = [];

    if (area) {
      query += ' AND area = ?';
      params.push(area);
    }

    if (difficulty) {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }

    query += ' ORDER BY area, difficulty';

    const templates = db.prepare(query).all(...params);

    // Estatísticas
    const stats = {
      total: templates.length,
      byArea: {},
      byDifficulty: {}
    };

    templates.forEach(t => {
      stats.byArea[t.area] = (stats.byArea[t.area] || 0) + 1;
      stats.byDifficulty[t.difficulty] = (stats.byDifficulty[t.difficulty] || 0) + 1;
    });

    res.json({
      success: true,
      templates,
      stats
    });
  } catch (error) {
    console.error('Erro ao listar templates:', error);
    res.status(500).json({ error: 'Erro ao listar templates' });
  }
});

// DELETE /api/admin/generated-missions/clean - Limpar missões geradas antigas
app.delete('/api/admin/generated-missions/clean', authenticate, (req, res) => {
  try {
    const { daysOld = 30 } = req.query;

    const deletedCount = missionGenerator.cleanOldGeneratedMissions(db, parseInt(daysOld));

    res.json({
      success: true,
      deletedCount,
      message: `${deletedCount} missões antigas removidas`
    });
  } catch (error) {
    console.error('Erro ao limpar missões:', error);
    res.status(500).json({ error: 'Erro ao limpar missões' });
  }
});

// GET /api/admin/missions/stats - Estatísticas de missões
app.get('/api/admin/missions/stats', authenticate, (req, res) => {
  try {
    const totalMissions = db.prepare('SELECT COUNT(*) as count FROM missions WHERE is_active = 1').get();
    const generatedMissions = db.prepare('SELECT COUNT(*) as count FROM missions WHERE is_active = 1 AND is_generated = 1').get();
    const staticMissions = db.prepare('SELECT COUNT(*) as count FROM missions WHERE is_active = 1 AND (is_generated = 0 OR is_generated IS NULL)').get();

    const byArea = db.prepare(`
      SELECT area, COUNT(*) as count
      FROM missions
      WHERE is_active = 1
      GROUP BY area
    `).all();

    const byPhase = db.prepare(`
      SELECT phase, COUNT(*) as count
      FROM missions
      WHERE is_active = 1
      GROUP BY phase
    `).all();

    const recentGenerated = db.prepare(`
      SELECT COUNT(*) as count
      FROM missions
      WHERE is_active = 1
      AND is_generated = 1
      AND generated_at > datetime('now', '-7 days')
    `).get();

    res.json({
      success: true,
      stats: {
        total: totalMissions.count,
        generated: generatedMissions.count,
        static: staticMissions.count,
        recentGenerated: recentGenerated.count,
        byArea: byArea.reduce((acc, item) => {
          acc[item.area] = item.count;
          return acc;
        }, {}),
        byPhase: byPhase.reduce((acc, item) => {
          acc[item.phase] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// ============================================
// GERADOR DE CARROSSÉIS EDUCATIVOS
// ============================================

// GET /api/marketing/carousels/themes - Listar temas disponíveis
app.get('/api/marketing/carousels/themes', (req, res) => {
  try {
    const themes = Object.keys(carouselGenerator.carouselContent);
    const stats = {};

    themes.forEach(theme => {
      stats[theme] = {
        name: theme,
        count: carouselGenerator.carouselContent[theme].length,
        description: getThemeDescription(theme)
      };
    });

    res.json({
      success: true,
      themes: themes,
      stats: stats,
      total: themes.length
    });
  } catch (error) {
    console.error('Erro ao listar temas:', error);
    res.status(500).json({ error: 'Erro ao listar temas' });
  }
});

function getThemeDescription(theme) {
  const descriptions = {
    problemasEducacao: 'Problemas atuais na educação infantil',
    escolaNaoEnsina: 'O que a escola não ensina',
    ensinarBrincando: 'Como ensinar brincando',
    beneficiosLongoPrazo: 'Benefícios a longo prazo',
    transformacao: 'Como o E-Kids transforma'
  };
  return descriptions[theme] || theme;
}

// GET /api/marketing/carousels/generate - Gerar carrossel
app.get('/api/marketing/carousels/generate', (req, res) => {
  try {
    const {
      theme = 'problemasEducacao',
      format = 'instagram',
      index = 0
    } = req.query;

    let carousel;

    if (format === 'instagram') {
      carousel = carouselGenerator.gerarCarrosselInstagram(theme, parseInt(index));
    } else if (format === 'tiktok') {
      carousel = carouselGenerator.gerarCarrosselTikTok(theme, parseInt(index));
    } else {
      return res.status(400).json({ error: 'Formato inválido. Use: instagram ou tiktok' });
    }

    res.json({
      success: true,
      carousel: carousel
    });
  } catch (error) {
    console.error('Erro ao gerar carrossel:', error);
    res.status(500).json({ error: 'Erro ao gerar carrossel' });
  }
});

// GET /api/marketing/carousels/all/:theme - Gerar todos carrosséis de um tema
app.get('/api/marketing/carousels/all/:theme', (req, res) => {
  try {
    const { theme } = req.params;

    if (!carouselGenerator.carouselContent[theme]) {
      return res.status(404).json({ error: 'Tema não encontrado' });
    }

    const carousels = carouselGenerator.gerarTodosCarrosselsTema(theme);

    res.json({
      success: true,
      carousels: carousels
    });
  } catch (error) {
    console.error('Erro ao gerar carrosséis:', error);
    res.status(500).json({ error: 'Erro ao gerar carrosséis' });
  }
});

// POST /api/marketing/carousels/custom - Criar carrossel customizado
app.post('/api/marketing/carousels/custom', (req, res) => {
  try {
    const carousel = carouselGenerator.gerarCarrosselCustomizado(req.body);

    res.json({
      success: true,
      carousel: carousel
    });
  } catch (error) {
    console.error('Erro ao gerar carrossel customizado:', error);
    res.status(500).json({ error: 'Erro ao gerar carrossel' });
  }
});

// GET /api/marketing/carousels/stats - Estatísticas do gerador V2
app.get('/api/marketing/carousels/stats', (req, res) => {
  try {
    const carouselGeneratorV2 = require('./carousel-generator-v2');
    const stats = carouselGeneratorV2.estatisticas();
    const temas = carouselGeneratorV2.listarTemas();

    res.json({
      success: true,
      estatisticas: stats,
      temas: temas,
      mensagem: `${stats.carrosseisUnicos} carrosséis únicos disponíveis!`
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// GET /api/marketing/carousels/v2/generate - Gerar usando V2
app.get('/api/marketing/carousels/v2/generate', (req, res) => {
  try {
    const { tema, formato = 'instagram', index = 0 } = req.query;

    if (!tema) {
      return res.status(400).json({ error: 'Tema é obrigatório' });
    }

    const carouselGeneratorV2 = require('./carousel-generator-v2');

    const carousel = formato === 'tiktok'
      ? carouselGeneratorV2.gerarCarrosselTikTok(tema, parseInt(index))
      : carouselGeneratorV2.gerarCarrosselInstagram(tema, parseInt(index));

    res.json({
      success: true,
      carousel: carousel,
      gerador: 'v2',
      total_disponiveis: carouselGeneratorV2.carouselContent[tema].length
    });
  } catch (error) {
    console.error('Erro ao gerar carrossel V2:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// DIA 2 - SISTEMA DE EVENTOS E DESAFIOS
// ============================================

// GET /api/events/active - Listar eventos ativos
app.get('/api/events/active', (req, res) => {
  try {
    const events = eventsManager.getActiveEvents(db);

    res.json({
      success: true,
      events: events,
      count: events.length
    });
  } catch (error) {
    console.error('Erro ao buscar eventos ativos:', error);
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
});

// GET /api/events/upcoming - Listar próximos eventos
app.get('/api/events/upcoming', (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const events = eventsManager.getUpcomingEvents(db, parseInt(limit));

    res.json({
      success: true,
      events: events,
      count: events.length
    });
  } catch (error) {
    console.error('Erro ao buscar próximos eventos:', error);
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
});

// GET /api/children/:childId/events - Progresso da criança em eventos
app.get('/api/children/:childId/events', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);

    const progress = eventsManager.getChildEventProgress(db, childId);

    res.json({
      success: true,
      progress: progress
    });
  } catch (error) {
    console.error('Erro ao buscar progresso em eventos:', error);
    res.status(500).json({ error: 'Erro ao buscar progresso' });
  }
});

// POST /api/events/challenge/update - Atualizar progresso em desafio
app.post('/api/events/challenge/update', authenticate, (req, res) => {
  try {
    const { childId, eventId, challengeId, increment = 1 } = req.body;

    const progress = eventsManager.updateChallengeProgress(
      db, childId, eventId, challengeId, increment
    );

    res.json({
      success: true,
      progress: progress
    });
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/events/create - Criar evento customizado
app.post('/api/admin/events/create', authenticate, (req, res) => {
  try {
    const event = eventsManager.createEvent(db, req.body);

    res.json({
      success: true,
      event: event
    });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
});

// POST /api/admin/events/auto-activate - Ativar/desativar eventos automaticamente
app.post('/api/admin/events/auto-activate', authenticate, (req, res) => {
  try {
    const result = eventsManager.autoActivateEvents(db);

    res.json({
      success: true,
      activated: result.activated,
      deactivated: result.deactivated,
      message: `${result.activated} eventos ativados, ${result.deactivated} desativados`
    });
  } catch (error) {
    console.error('Erro ao ativar eventos:', error);
    res.status(500).json({ error: 'Erro ao ativar eventos' });
  }
});

// ============================================
// DIA 4 - DASHBOARD DOS PAIS COMPLETO
// ============================================

const dashboardManager = require('./dashboard-manager');

// GET /api/dashboard/:childId/weekly - Relatório semanal
app.get('/api/dashboard/:childId/weekly', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const report = dashboardManager.getWeeklyReport(db, childId);

    res.json({
      success: true,
      report: report
    });
  } catch (error) {
    console.error('Erro ao gerar relatório semanal:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});

// GET /api/dashboard/:childId/monthly - Relatório mensal
app.get('/api/dashboard/:childId/monthly', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const report = dashboardManager.getMonthlyReport(db, childId);

    res.json({
      success: true,
      report: report
    });
  } catch (error) {
    console.error('Erro ao gerar relatório mensal:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});

// GET /api/dashboard/:childId/insights - Insights automáticos
app.get('/api/dashboard/:childId/insights', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const insights = dashboardManager.generateInsights(db, childId);

    res.json({
      success: true,
      insights: insights,
      count: insights.length
    });
  } catch (error) {
    console.error('Erro ao gerar insights:', error);
    res.status(500).json({ error: 'Erro ao gerar insights' });
  }
});

// GET /api/dashboard/:childId/alerts - Alertas para pais
app.get('/api/dashboard/:childId/alerts', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const alerts = dashboardManager.generateAlerts(db, childId);

    res.json({
      success: true,
      alerts: alerts,
      count: alerts.length,
      hasAlerts: alerts.length > 0
    });
  } catch (error) {
    console.error('Erro ao gerar alertas:', error);
    res.status(500).json({ error: 'Erro ao gerar alertas' });
  }
});

// GET /api/dashboard/:childId/charts - Dados para gráficos
app.get('/api/dashboard/:childId/charts', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const { period = 'week' } = req.query;

    const chartData = dashboardManager.getChartData(db, childId, period);

    res.json({
      success: true,
      data: chartData
    });
  } catch (error) {
    console.error('Erro ao gerar dados de gráficos:', error);
    res.status(500).json({ error: 'Erro ao gerar gráficos' });
  }
});

// GET /api/dashboard/:childId/summary - Resumo executivo
app.get('/api/dashboard/:childId/summary', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const summary = dashboardManager.getExecutiveSummary(db, childId);

    res.json({
      success: true,
      summary: summary
    });
  } catch (error) {
    console.error('Erro ao gerar resumo:', error);
    res.status(500).json({ error: 'Erro ao gerar resumo' });
  }
});

// ============================================
// DIA 3 - SISTEMA DE CONQUISTAS (100+ BADGES)
// ============================================

const badgesManager = require('./badges-manager');

// GET /api/badges/catalog - Listar todos os badges do catálogo
app.get('/api/badges/catalog', (req, res) => {
  try {
    const { category, rarity, includeSecret } = req.query;

    const badges = badgesManager.listAllBadges(db, {
      category,
      rarity,
      includeSecret: includeSecret === 'true'
    });

    res.json({
      success: true,
      badges: badges,
      total: badges.length
    });
  } catch (error) {
    console.error('Erro ao buscar catálogo de badges:', error);
    res.status(500).json({ error: 'Erro ao buscar badges' });
  }
});

// GET /api/children/:childId/badges - Badges da criança
app.get('/api/children/:childId/badges', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);

    const badges = badgesManager.getChildBadges(db, childId);
    const stats = badgesManager.getChildBadgeStats(db, childId);

    res.json({
      success: true,
      badges: badges,
      stats: stats
    });
  } catch (error) {
    console.error('Erro ao buscar badges da criança:', error);
    res.status(500).json({ error: 'Erro ao buscar badges' });
  }
});

// GET /api/children/:childId/badges/next - Próximos badges sugeridos
app.get('/api/children/:childId/badges/next', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const { limit = 5 } = req.query;

    const nextBadges = badgesManager.getNextBadges(db, childId, parseInt(limit));

    res.json({
      success: true,
      suggestions: nextBadges,
      count: nextBadges.length
    });
  } catch (error) {
    console.error('Erro ao buscar próximos badges:', error);
    res.status(500).json({ error: 'Erro ao buscar badges' });
  }
});

// POST /api/children/:childId/badges/check - Verificar e desbloquear badges
app.post('/api/children/:childId/badges/check', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const { action, value } = req.body;

    const unlockedBadges = badgesManager.checkAndUnlockBadges(db, childId, action, value);

    res.json({
      success: true,
      unlockedBadges: unlockedBadges,
      count: unlockedBadges.length,
      hasNewBadges: unlockedBadges.length > 0
    });
  } catch (error) {
    console.error('Erro ao verificar badges:', error);
    res.status(500).json({ error: 'Erro ao verificar badges' });
  }
});

// POST /api/admin/badges/unlock - Desbloquear badge manualmente (admin)
app.post('/api/admin/badges/unlock', authenticate, (req, res) => {
  try {
    const { childId, badgeKey } = req.body;

    const result = badgesManager.unlockBadge(db, childId, badgeKey);

    if (result) {
      res.json({
        success: true,
        badge: result.badge,
        message: `Badge ${result.badge.name} desbloqueado! +${result.rewardFP} FP`
      });
    } else {
      res.status(400).json({ error: 'Badge já desbloqueado ou não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao desbloquear badge:', error);
    res.status(500).json({ error: 'Erro ao desbloquear badge' });
  }
});

// GET /api/badges/stats - Estatísticas gerais do sistema de badges
app.get('/api/badges/stats', (req, res) => {
  try {
    const totalBadges = db.prepare('SELECT COUNT(*) as count FROM badge_catalog').get()?.count || 0;
    const byCategory = db.prepare(`
      SELECT category, COUNT(*) as count
      FROM badge_catalog
      GROUP BY category
    `).all();
    const byRarity = db.prepare(`
      SELECT rarity, COUNT(*) as count
      FROM badge_catalog
      GROUP BY rarity
    `).all();
    const totalUnlocked = db.prepare('SELECT COUNT(*) as count FROM child_badges').get()?.count || 0;

    res.json({
      success: true,
      system: {
        totalBadges,
        byCategory,
        byRarity,
        totalUnlocked
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// ============================================
// DIA 5 - SISTEMA DE RECOMPENSAS REAIS
// ============================================

const rewardsManager = require('./rewards-manager');

// POST /api/rewards/create - Criar nova recompensa (PAIS)
app.post('/api/rewards/create', authenticate, (req, res) => {
  try {
    const {
      rewardName,
      description,
      fpCost,
      icon = '🎁',
      stock = null,
      ageRestriction = null
    } = req.body;

    const result = rewardsManager.createReward(db, {
      familyId: req.user.family_id,
      parentId: req.user.id,
      rewardName,
      description,
      fpCost,
      icon,
      stock,
      ageRestriction
    });

    res.json(result);
  } catch (error) {
    console.error('Erro ao criar recompensa:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rewards/available/:childId - Listar recompensas disponíveis (CRIANÇA)
app.get('/api/rewards/available/:childId', authenticate, (req, res) => {
  try {
    const { childId } = req.params;

    const result = rewardsManager.listAvailableRewards(db, parseInt(childId));

    res.json(result);
  } catch (error) {
    console.error('Erro ao listar recompensas:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rewards/redeem - Resgatar recompensa (CRIANÇA)
app.post('/api/rewards/redeem', authenticate, (req, res) => {
  try {
    const { childId, rewardId, childNote } = req.body;

    const result = rewardsManager.redeemReward(db, {
      childId,
      rewardId,
      childNote
    });

    res.json(result);
  } catch (error) {
    console.error('Erro ao resgatar recompensa:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rewards/:redemptionId/review - Aprovar/Rejeitar resgate (PAIS)
app.post('/api/rewards/:redemptionId/review', authenticate, (req, res) => {
  try {
    const { redemptionId } = req.params;
    const { action, rejectionReason, parentNote } = req.body;

    const result = rewardsManager.reviewRedemption(db, {
      redemptionId: parseInt(redemptionId),
      parentId: req.user.id,
      action,
      rejectionReason,
      parentNote
    });

    res.json(result);
  } catch (error) {
    console.error('Erro ao revisar resgate:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rewards/:redemptionId/complete - Marcar como completado (PAIS)
app.post('/api/rewards/:redemptionId/complete', authenticate, (req, res) => {
  try {
    const { redemptionId } = req.params;

    const result = rewardsManager.completeRedemption(
      db,
      parseInt(redemptionId),
      req.user.id
    );

    res.json(result);
  } catch (error) {
    console.error('Erro ao completar resgate:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rewards/pending/:familyId - Resgates pendentes (PAIS)
app.get('/api/rewards/pending/:familyId', authenticate, (req, res) => {
  try {
    const { familyId } = req.params;

    const result = rewardsManager.getPendingRedemptions(db, parseInt(familyId));

    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar resgates pendentes:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rewards/history - Histórico de resgates
app.get('/api/rewards/history', authenticate, (req, res) => {
  try {
    const { childId, familyId, status, limit = 50, offset = 0 } = req.query;

    const result = rewardsManager.getRedemptionHistory(db, {
      childId: childId ? parseInt(childId) : null,
      familyId: familyId ? parseInt(familyId) : null,
      status,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rewards/stats/:familyId - Estatísticas de recompensas (PAIS)
app.get('/api/rewards/stats/:familyId', authenticate, (req, res) => {
  try {
    const { familyId } = req.params;

    const result = rewardsManager.getRewardStats(db, parseInt(familyId));

    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/rewards/:rewardId - Editar recompensa (PAIS)
app.put('/api/rewards/:rewardId', authenticate, (req, res) => {
  try {
    const { rewardId } = req.params;
    const updates = req.body;

    const result = rewardsManager.updateReward(db, parseInt(rewardId), updates);

    res.json(result);
  } catch (error) {
    console.error('Erro ao editar recompensa:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/rewards/:rewardId - Deletar recompensa (PAIS)
app.delete('/api/rewards/:rewardId', authenticate, (req, res) => {
  try {
    const { rewardId } = req.params;

    const result = rewardsManager.deleteReward(db, parseInt(rewardId));

    res.json(result);
  } catch (error) {
    console.error('Erro ao deletar recompensa:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// DIA 6 - MINI-GAMES E INTERATIVIDADE
// ============================================

const minigamesManager = require('./minigames-manager');

// GET /api/minigames/list - Listar todos os mini-games
app.get('/api/minigames/list', (req, res) => {
  try {
    const result = minigamesManager.listAvailableGames(db);
    res.json(result);
  } catch (error) {
    console.error('Erro ao listar mini-games:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/minigames/start - Começar novo jogo
app.post('/api/minigames/start', authenticate, (req, res) => {
  try {
    const { childId, gameKey, difficulty = 'facil' } = req.body;

    const result = minigamesManager.startGame(db, childId, gameKey, difficulty);

    res.json(result);
  } catch (error) {
    console.error('Erro ao iniciar mini-game:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/minigames/record - Registrar jogada completada
app.post('/api/minigames/record', authenticate, (req, res) => {
  try {
    const {
      childId,
      gameKey,
      difficulty = 'facil',
      score = 0,
      timeSeconds = 0,
      completed = 1,
      gameData = null
    } = req.body;

    const result = minigamesManager.recordPlay(db, {
      childId,
      gameKey,
      difficulty,
      score,
      timeSeconds,
      completed,
      gameData
    });

    res.json(result);
  } catch (error) {
    console.error('Erro ao registrar jogada:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/minigames/stats/:childId - Estatísticas da criança
app.get('/api/minigames/stats/:childId', authenticate, (req, res) => {
  try {
    const { childId } = req.params;

    const result = minigamesManager.getChildMinigameStats(db, parseInt(childId));

    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/minigames/leaderboard/:gameKey - Ranking de um jogo
app.get('/api/minigames/leaderboard/:gameKey', (req, res) => {
  try {
    const { gameKey } = req.params;
    const { limit = 10 } = req.query;

    const result = minigamesManager.getGameLeaderboard(db, gameKey, parseInt(limit));

    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/minigames/achievements/:childId - Conquistas da criança
app.get('/api/minigames/achievements/:childId', authenticate, (req, res) => {
  try {
    const { childId } = req.params;

    const achievements = db.prepare(`
      SELECT
        cma.achievement_key,
        ma.achievement_name,
        ma.description,
        ma.icon,
        ma.game_key,
        ma.fp_reward,
        ma.is_secret,
        cma.unlocked_at,
        mg.game_name
      FROM child_minigame_achievements cma
      JOIN minigame_achievements ma ON cma.achievement_key = ma.achievement_key
      JOIN minigames_catalog mg ON ma.game_key = mg.game_key
      WHERE cma.child_id = ?
      ORDER BY cma.unlocked_at DESC
    `).all(parseInt(childId));

    res.json({
      success: true,
      total: achievements.length,
      achievements
    });
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/minigames/daily-progress/:childId - Progresso de hoje
app.get('/api/minigames/daily-progress/:childId', authenticate, (req, res) => {
  try {
    const { childId } = req.params;

    const progress = db.prepare(`
      SELECT
        mp.game_key,
        mg.game_name,
        mg.icon,
        mg.plays_per_day,
        COUNT(*) as plays_today,
        SUM(mp.fp_earned) as fp_earned_today,
        CASE
          WHEN mg.plays_per_day IS NULL THEN NULL
          ELSE mg.plays_per_day - COUNT(*)
        END as plays_remaining
      FROM minigame_plays mp
      JOIN minigames_catalog mg ON mp.game_key = mg.game_key
      WHERE mp.child_id = ?
        AND DATE(mp.played_at) = DATE('now')
      GROUP BY mp.game_key
    `).all(parseInt(childId));

    res.json({
      success: true,
      progress,
      message: progress.length > 0
        ? `Você jogou ${progress.length} mini-game(s) hoje!`
        : 'Nenhum mini-game jogado hoje ainda.'
    });
  } catch (error) {
    console.error('Erro ao buscar progresso diário:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// APIS - SISTEMA DE PROGRESSÃO
// ============================================

const progressionManager = require('./progression-manager');

// GET /api/progression/:childId - Obter todas as progressões de uma criança
app.get('/api/progression/:childId', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);

    // Verificar se criança pertence à família
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
      .get(childId, req.user.familyId);

    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    const stats = progressionManager.getChildProgressionStats(childId);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Erro ao obter progressão:', error);
    res.status(500).json({ error: 'Erro ao obter progressão' });
  }
});

// GET /api/progression/:childId/:gameKey - Obter progressão específica de um jogo
app.get('/api/progression/:childId/:gameKey', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const gameKey = req.params.gameKey;

    // Verificar se criança pertence à família
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
      .get(childId, req.user.familyId);

    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    const progression = progressionManager.getProgression(childId, gameKey);
    const nextLevel = progressionManager.getNextLevelInfo(progression.nivel_atual, progression.xp_total);
    const difficulty = progressionManager.getDifficultyForLevel(gameKey, progression.nivel_atual);

    res.json({
      success: true,
      progression,
      nextLevel,
      difficulty
    });
  } catch (error) {
    console.error('Erro ao obter progressão do jogo:', error);
    res.status(500).json({ error: 'Erro ao obter progressão do jogo' });
  }
});

// POST /api/progression/record - Registrar resultado de partida e atualizar progressão
app.post('/api/progression/record', authenticate, (req, res) => {
  try {
    const { childId, gameKey, performance } = req.body;

    // Validação
    if (!childId || !gameKey || !performance) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Verificar se criança pertence à família
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
      .get(childId, req.user.familyId);

    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Registrar partida
    const result = progressionManager.recordGame(childId, gameKey, performance);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Erro ao registrar partida:', error);
    res.status(500).json({ error: 'Erro ao registrar partida' });
  }
});

// GET /api/progression/:childId/history - Obter histórico de level ups
app.get('/api/progression/:childId/history', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const limit = parseInt(req.query.limit) || 10;

    // Verificar se criança pertence à família
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
      .get(childId, req.user.familyId);

    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    const history = progressionManager.getLevelUpHistory(childId, limit);

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Erro ao obter histórico:', error);
    res.status(500).json({ error: 'Erro ao obter histórico' });
  }
});

// GET /api/progression/:childId/difficulty/:gameKey - Obter configuração de dificuldade
app.get('/api/progression/:childId/difficulty/:gameKey', authenticate, (req, res) => {
  try {
    const childId = parseInt(req.params.childId);
    const gameKey = req.params.gameKey;

    // Verificar se criança pertence à família
    const child = db.prepare('SELECT * FROM children WHERE id = ? AND family_id = ?')
      .get(childId, req.user.familyId);

    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    const progression = progressionManager.getProgression(childId, gameKey);
    const difficulty = progressionManager.getDifficultyForLevel(gameKey, progression.nivel_atual);

    res.json({
      success: true,
      nivel: progression.nivel_atual,
      difficulty
    });
  } catch (error) {
    console.error('Erro ao obter dificuldade:', error);
    res.status(500).json({ error: 'Erro ao obter dificuldade' });
  }
});

// ============================================
// SERVIDOR
// ============================================

// Servir frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║     E-KIDS PRO MVP - SERVIDOR ATIVO         ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
  console.log('');
  console.log(`📱 Interface Infantil: http://localhost:${PORT}/crianca`);
  console.log(`👨‍👩‍👧 Área dos Pais: http://localhost:${PORT}/pais`);
  console.log('');
  console.log('💾 Banco de dados: server/database/ekids.db');
  console.log('');
  console.log('✅ 5 módulos ativos:');
  console.log('   1. Meu Jeito, Meus Limites');
  console.log('   2. Posso Pedir Ajuda');
  console.log('   3. Cuidando de Mim');
  console.log('   4. Minhas Emoções');
  console.log('   5. Desafios Positivos');
  console.log('');
  console.log('🛡️ Proteção infantil ativa');
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor...');
  db.close();
  process.exit(0);
});
