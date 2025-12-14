-- E-KIDS PRO - FASE 6 E 7
-- Sistema Vivo + Expansão Inteligente

-- ============================================
-- BADGES/CONQUISTAS (SILENCIOSAS E PRIVADAS)
-- ============================================

-- Tipos de badges disponíveis
CREATE TABLE IF NOT EXISTS badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  badge_key TEXT UNIQUE NOT NULL,
  badge_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT, -- 'emotion', 'body', 'safety', 'learning', 'consistency'
  criteria_type TEXT, -- 'days_streak', 'missions_completed', 'fp_saved', 'modules_finished'
  criteria_value INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Badges conquistados por criança
CREATE TABLE IF NOT EXISTS child_badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  badge_key TEXT NOT NULL,
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_new INTEGER DEFAULT 1, -- 1 se ainda não foi visto pela criança
  UNIQUE(child_id, badge_key),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_key) REFERENCES badges(badge_key)
);

-- ============================================
-- ÁREAS DO MUNDO (EXPANSÍVEIS)
-- ============================================

-- Áreas disponíveis do mundo E-Kids
CREATE TABLE IF NOT EXISTS world_areas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  area_key TEXT UNIQUE NOT NULL,
  area_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  unlock_criteria TEXT, -- 'always_unlocked', 'fp_cost', 'days_active', 'badges_earned'
  unlock_value INTEGER DEFAULT 0,
  visual_theme TEXT, -- JSON com cores e elementos visuais
  order_position INTEGER,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Áreas desbloqueadas por criança
CREATE TABLE IF NOT EXISTS child_unlocked_areas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  area_key TEXT NOT NULL,
  unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_visited DATETIME,
  UNIQUE(child_id, area_key),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (area_key) REFERENCES world_areas(area_key)
);

-- ============================================
-- MEMÓRIA DO MASCOTE
-- ============================================

-- Memórias positivas guardadas pelo mascote
CREATE TABLE IF NOT EXISTS mascot_memories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  memory_type TEXT NOT NULL, -- 'achievement', 'milestone', 'growth_moment'
  memory_text TEXT NOT NULL,
  context_data TEXT, -- JSON com dados relevantes
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_shown DATETIME,
  times_shown INTEGER DEFAULT 0,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- ============================================
-- EVENTOS DE TEMPO (SEM PRESSÃO)
-- ============================================

-- Eventos temáticos semanais/mensais
CREATE TABLE IF NOT EXISTS time_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_key TEXT UNIQUE NOT NULL,
  event_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  event_type TEXT, -- 'weekly', 'monthly', 'seasonal'
  theme TEXT, -- 'emotions', 'body', 'safety', 'creativity'
  start_date DATE,
  end_date DATE,
  fp_bonus INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Participação em eventos
CREATE TABLE IF NOT EXISTS child_event_participation (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  event_key TEXT NOT NULL,
  participated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  fp_earned INTEGER DEFAULT 0,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (event_key) REFERENCES time_events(event_key)
);

-- ============================================
-- EVOLUÇÃO VISUAL DO MUNDO
-- ============================================

-- Estados visuais do mundo da criança
CREATE TABLE IF NOT EXISTS child_world_state (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL UNIQUE,
  visual_level INTEGER DEFAULT 1, -- 1 a 10
  days_active INTEGER DEFAULT 0,
  current_theme TEXT DEFAULT 'default',
  unlocked_visuals TEXT, -- JSON array de elementos visuais desbloqueados
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- ============================================
-- METAS LEVES (OPCIONAIS)
-- ============================================

-- Tipos de metas disponíveis
CREATE TABLE IF NOT EXISTS goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  goal_key TEXT UNIQUE NOT NULL,
  goal_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  goal_type TEXT, -- 'daily', 'weekly', 'monthly'
  target_value INTEGER,
  fp_reward INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Metas ativas das crianças
CREATE TABLE IF NOT EXISTS child_active_goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  goal_key TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  target INTEGER,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'expired'
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (goal_key) REFERENCES goals(goal_key)
);

-- ============================================
-- MÓDULOS DE CONSCIÊNCIA (MUNDO REAL)
-- ============================================

-- Módulos de segurança e consciência
CREATE TABLE IF NOT EXISTS awareness_modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  module_key TEXT UNIQUE NOT NULL,
  module_name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'home_safety', 'internet_safety', 'traffic', 'play_safety'
  icon TEXT,
  content_json TEXT, -- JSON com o conteúdo lúdico
  age_min INTEGER DEFAULT 6,
  age_max INTEGER DEFAULT 12,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Progresso em módulos de consciência
CREATE TABLE IF NOT EXISTS child_awareness_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  module_key TEXT NOT NULL,
  times_completed INTEGER DEFAULT 0,
  last_completed DATETIME,
  UNIQUE(child_id, module_key),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (module_key) REFERENCES awareness_modules(module_key)
);

-- ============================================
-- IDIOMAS (INGLÊS/ESPANHOL)
-- ============================================

-- Palavras e expressões em outros idiomas
CREATE TABLE IF NOT EXISTS language_words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word_key TEXT UNIQUE NOT NULL,
  portuguese TEXT NOT NULL,
  english TEXT,
  spanish TEXT,
  category TEXT, -- 'emotions', 'body', 'actions', 'objects'
  difficulty INTEGER DEFAULT 1, -- 1 a 3
  audio_url_en TEXT,
  audio_url_es TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Progresso de idiomas da criança
CREATE TABLE IF NOT EXISTS child_language_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  language TEXT NOT NULL, -- 'english', 'spanish'
  level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  words_learned TEXT, -- JSON array de word_keys
  last_practice DATETIME,
  UNIQUE(child_id, language),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- ============================================
-- SEED: BADGES PADRÃO
-- ============================================

INSERT OR IGNORE INTO badges (badge_key, badge_name, description, icon, category, criteria_type, criteria_value) VALUES
  ('first_steps', 'Primeiros Passos', 'Completou primeira missão', '👣', 'learning', 'missions_completed', 1),
  ('week_warrior', 'Guerreiro da Semana', 'Voltou 7 dias seguidos', '🌟', 'consistency', 'days_streak', 7),
  ('emotion_master', 'Mestre das Emoções', 'Completou todos os módulos de emoções', '😊', 'emotion', 'modules_finished', 1),
  ('saver_starter', 'Poupador Iniciante', 'Guardou FP no cofrinho pela primeira vez', '🏦', 'learning', 'fp_saved', 1),
  ('brave_learner', 'Aprendiz Corajoso', 'Completou módulo de segurança', '🛡️', 'safety', 'modules_finished', 1),
  ('month_champion', 'Campeão do Mês', 'Voltou 30 dias seguidos', '🏆', 'consistency', 'days_streak', 30);

-- ============================================
-- SEED: ÁREAS DO MUNDO
-- ============================================

INSERT OR IGNORE INTO world_areas (area_key, area_name, description, icon, unlock_criteria, unlock_value, visual_theme, order_position) VALUES
  ('emotions', 'Mundo das Emoções', 'Explore seus sentimentos', '💙', 'always_unlocked', 0, '{"primary": "#667eea", "secondary": "#764ba2"}', 1),
  ('body', 'Mundo do Corpo', 'Cuide de você', '🏃', 'days_active', 3, '{"primary": "#f093fb", "secondary": "#f5576c"}', 2),
  ('safety', 'Mundo da Segurança', 'Aprenda a se proteger', '🛡️', 'badges_earned', 2, '{"primary": "#4facfe", "secondary": "#00f2fe"}', 3),
  ('creativity', 'Mundo da Criatividade', 'Crie e imagine', '🎨', 'fp_cost', 500, '{"primary": "#43e97b", "secondary": "#38f9d7"}', 4),
  ('languages', 'Mundo dos Idiomas', 'Fale outras línguas', '🌍', 'days_active', 7, '{"primary": "#fa709a", "secondary": "#fee140"}', 5);

-- ============================================
-- SEED: MÓDULOS DE CONSCIÊNCIA
-- ============================================

INSERT OR IGNORE INTO awareness_modules (module_key, module_name, description, category, icon, age_min, age_max) VALUES
  ('home_fire', 'Cuidado com Fogo', 'Aprenda sobre fogo e fogão', 'home_safety', '🔥', 6, 12),
  ('home_electricity', 'Cuidado com Eletricidade', 'Tomadas e fios', 'home_safety', '⚡', 6, 12),
  ('home_water', 'Cuidado com Água', 'Piscina e banheira', 'home_safety', '💧', 6, 12),
  ('internet_safe', 'Internet Segura', 'Como usar internet com segurança', 'internet_safety', '💻', 8, 12),
  ('traffic_street', 'Atravessar a Rua', 'Como atravessar com segurança', 'traffic', '🚦', 6, 12),
  ('play_safe', 'Brincar com Segurança', 'Brincadeiras seguras', 'play_safety', '🎈', 6, 12);

-- ============================================
-- SEED: PALAVRAS DE IDIOMAS (BÁSICAS)
-- ============================================

INSERT OR IGNORE INTO language_words (word_key, portuguese, english, spanish, category, difficulty) VALUES
  ('emotion_happy', 'Feliz', 'Happy', 'Feliz', 'emotions', 1),
  ('emotion_sad', 'Triste', 'Sad', 'Triste', 'emotions', 1),
  ('body_hand', 'Mão', 'Hand', 'Mano', 'body', 1),
  ('body_foot', 'Pé', 'Foot', 'Pie', 'body', 1),
  ('action_jump', 'Pular', 'Jump', 'Saltar', 'actions', 1),
  ('action_run', 'Correr', 'Run', 'Correr', 'actions', 1);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_child_badges_child ON child_badges(child_id);
CREATE INDEX IF NOT EXISTS idx_child_unlocked_areas_child ON child_unlocked_areas(child_id);
CREATE INDEX IF NOT EXISTS idx_mascot_memories_child ON mascot_memories(child_id);
CREATE INDEX IF NOT EXISTS idx_child_event_participation_child ON child_event_participation(child_id);
CREATE INDEX IF NOT EXISTS idx_child_awareness_progress_child ON child_awareness_progress(child_id);
