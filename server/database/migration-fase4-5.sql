-- E-KIDS PRO - MIGRATION FASE 4 E 5
-- Sistema de Planos + Modo Escola
-- SQLite Database

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- FASE 4: MONETIZAÇÃO INTELIGENTE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Planos disponíveis
CREATE TABLE IF NOT EXISTS subscription_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_key TEXT UNIQUE NOT NULL,
  plan_name TEXT NOT NULL,
  description TEXT,
  price_monthly REAL DEFAULT 0,
  price_yearly REAL DEFAULT 0,
  max_children INTEGER DEFAULT 1,
  features TEXT, -- JSON string com features
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Assinaturas das famílias
CREATE TABLE IF NOT EXISTS family_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  family_id INTEGER NOT NULL,
  plan_key TEXT NOT NULL,
  status TEXT DEFAULT 'active', -- active, canceled, expired, trial
  trial_ends_at DATETIME,
  subscription_starts_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  subscription_ends_at DATETIME,
  payment_method TEXT, -- pix, credit_card, boleto
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_key) REFERENCES subscription_plans(plan_key)
);

-- Histórico de pagamentos
CREATE TABLE IF NOT EXISTS payment_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  family_id INTEGER NOT NULL,
  subscription_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'pending', -- pending, paid, failed, refunded
  transaction_id TEXT,
  paid_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES family_subscriptions(id)
);

-- Limites de uso por plano (para plano gratuito)
CREATE TABLE IF NOT EXISTS usage_limits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  week_start DATE NOT NULL,
  missions_completed INTEGER DEFAULT 0,
  fp_earned_this_week INTEGER DEFAULT 0,
  modules_accessed TEXT, -- JSON array de module_keys
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- FASE 5: MODO ESCOLA
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Escolas cadastradas
CREATE TABLE IF NOT EXISTS schools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  contact_person TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Licenças escolares
CREATE TABLE IF NOT EXISTS school_licenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER NOT NULL,
  license_key TEXT UNIQUE NOT NULL,
  plan_type TEXT DEFAULT 'school_basic', -- school_basic, school_premium
  max_students INTEGER DEFAULT 30,
  max_teachers INTEGER DEFAULT 5,
  status TEXT DEFAULT 'active', -- active, suspended, expired
  license_starts_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  license_ends_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- Professores/Coordenadores
CREATE TABLE IF NOT EXISTS school_teachers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  role TEXT DEFAULT 'teacher', -- teacher, coordinator, admin
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- Turmas
CREATE TABLE IF NOT EXISTS school_classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER NOT NULL,
  class_name TEXT NOT NULL,
  grade TEXT, -- ex: "3º ano", "4ª série"
  teacher_id INTEGER,
  year INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES school_teachers(id)
);

-- Alunos (modo escola - dados mínimos)
CREATE TABLE IF NOT EXISTS school_students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id INTEGER NOT NULL,
  student_code TEXT NOT NULL, -- código anônimo (não nome real)
  age INTEGER,
  avatar TEXT DEFAULT 'default',
  total_fp INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES school_classes(id) ON DELETE CASCADE
);

-- Progresso escolar (agregado, não individual)
CREATE TABLE IF NOT EXISTS school_class_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id INTEGER NOT NULL,
  module_key TEXT NOT NULL,
  students_completed INTEGER DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  average_fp INTEGER DEFAULT 0,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES school_classes(id) ON DELETE CASCADE,
  FOREIGN KEY (module_key) REFERENCES modules(module_key)
);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- INSERIR PLANOS PADRÃO
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSERT OR IGNORE INTO subscription_plans (plan_key, plan_name, description, price_monthly, price_yearly, max_children, features) VALUES
  (
    'free',
    'Gratuito',
    'Entrada e experimentação',
    0.00,
    0.00,
    1,
    '{"missions_per_week": 3, "modules_access": ["emocoes"], "fp_limit": 200, "mascot_basic": true}'
  ),
  (
    'pro',
    'E-Kids PRO',
    'Acesso completo individual',
    19.90,
    199.00,
    1,
    '{"missions_unlimited": true, "all_modules": true, "fp_unlimited": true, "mascot_premium": true, "parent_diary": true, "languages": ["pt", "en"]}'
  ),
  (
    'family',
    'Família',
    'Até 3 crianças com desconto',
    34.90,
    349.00,
    3,
    '{"missions_unlimited": true, "all_modules": true, "fp_unlimited": true, "mascot_premium": true, "parent_diary": true, "unified_panel": true, "languages": ["pt", "en"]}'
  );

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ÍNDICES PARA PERFORMANCE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE INDEX IF NOT EXISTS idx_family_subscriptions_family ON family_subscriptions(family_id);
CREATE INDEX IF NOT EXISTS idx_family_subscriptions_status ON family_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_school_licenses_school ON school_licenses(school_id);
CREATE INDEX IF NOT EXISTS idx_school_students_class ON school_students(class_id);
CREATE INDEX IF NOT EXISTS idx_usage_limits_child_week ON usage_limits(child_id, week_start);
