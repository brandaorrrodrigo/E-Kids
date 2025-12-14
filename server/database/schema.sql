-- E-KIDS PRO MVP - DATABASE SCHEMA
-- SQLite Database

-- Famílias (Pais/Responsáveis)
CREATE TABLE IF NOT EXISTS families (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Crianças
CREATE TABLE IF NOT EXISTS children (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  family_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  avatar TEXT DEFAULT 'default',
  total_fp INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
);

-- Mascote
CREATE TABLE IF NOT EXISTS mascot (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  name TEXT DEFAULT 'Buddy',
  level INTEGER DEFAULT 1,
  energy INTEGER DEFAULT 100,
  happiness INTEGER DEFAULT 100,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Módulos do MVP
CREATE TABLE IF NOT EXISTS modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  module_key TEXT UNIQUE NOT NULL,
  module_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_position INTEGER
);

-- Progresso da criança nos módulos
CREATE TABLE IF NOT EXISTS child_module_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  module_key TEXT NOT NULL,
  activities_completed INTEGER DEFAULT 0,
  understanding_level INTEGER DEFAULT 0,
  last_accessed DATETIME,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (module_key) REFERENCES modules(module_key)
);

-- Atividades completadas
CREATE TABLE IF NOT EXISTS activities_completed (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  module_key TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  fp_earned INTEGER DEFAULT 0,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Check-ins emocionais
CREATE TABLE IF NOT EXISTS emotional_checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  emotion TEXT,
  comfort_level TEXT,
  wants_to_talk INTEGER DEFAULT 0,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Círculo de confiança
CREATE TABLE IF NOT EXISTS trust_circle (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  adult_name TEXT NOT NULL,
  relationship TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Inserir módulos do MVP
INSERT OR IGNORE INTO modules (module_key, module_name, description, icon, order_position) VALUES
  ('dizer_nao', 'Meu Jeito, Meus Limites', 'Aprender a dizer não com respeito', '🛡️', 1),
  ('pedir_ajuda', 'Posso Pedir Ajuda', 'Confiança para buscar apoio', '🤝', 2),
  ('protecao_corpo', 'Cuidando de Mim', 'Proteção do corpo e limites pessoais', '💙', 3),
  ('emocoes', 'Minhas Emoções', 'Reconhecer, nomear e expressar emoções', '😊', 4),
  ('desafios', 'Desafios Positivos', 'Atividades que fortalecem', '⭐', 5);
