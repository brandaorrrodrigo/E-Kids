-- E-KIDS PRO - FASE 8
-- USO REAL & RETENÇÃO

-- ============================================
-- SISTEMA DE DIAS ATIVOS (NÃO PUNITIVO)
-- ============================================

-- Registro de dias ativos (apenas quando a criança entra)
CREATE TABLE IF NOT EXISTS child_active_days (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  date DATE NOT NULL,
  activities_count INTEGER DEFAULT 0,
  checkin_done INTEGER DEFAULT 0,
  mission_completed INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(child_id, date),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Estatísticas de constância por criança
CREATE TABLE IF NOT EXISTS child_consistency_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL UNIQUE,
  total_active_days INTEGER DEFAULT 0,
  current_month_days INTEGER DEFAULT 0,
  last_active_date DATE,
  longest_gentle_streak INTEGER DEFAULT 0, -- maior sequência suave (não punitiva)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- ============================================
-- ROTINA DO DIA
-- ============================================

-- Rotina diária sugerida (gerada automaticamente)
CREATE TABLE IF NOT EXISTS daily_routines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  date DATE NOT NULL,
  checkin_suggested INTEGER DEFAULT 1,
  checkin_completed INTEGER DEFAULT 0,
  mission_suggested TEXT, -- JSON com missão do dia
  mission_completed INTEGER DEFAULT 0,
  mascot_message TEXT,
  message_shown INTEGER DEFAULT 0,
  routine_completed_at DATETIME,
  UNIQUE(child_id, date),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- ============================================
-- EVENTOS ATIVOS (SEMANAIS/MENSAIS)
-- ============================================

-- Eventos ativos no momento (usando tabela time_events da fase 6-7)
CREATE TABLE IF NOT EXISTS active_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_key TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  theme TEXT,
  description TEXT,
  fp_bonus INTEGER DEFAULT 0,
  visual_style TEXT, -- JSON com cores/ícones
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_key) REFERENCES time_events(event_key)
);

-- Progresso em eventos ativos
CREATE TABLE IF NOT EXISTS child_event_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  event_key TEXT NOT NULL,
  activities_completed INTEGER DEFAULT 0,
  bonus_claimed INTEGER DEFAULT 0,
  last_activity DATETIME,
  UNIQUE(child_id, event_key),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- ============================================
-- RESUMO SEMANAL PARA PAIS
-- ============================================

-- Dados agregados semanais para relatório dos pais
CREATE TABLE IF NOT EXISTS weekly_summaries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  active_days_count INTEGER DEFAULT 0,
  activities_completed INTEGER DEFAULT 0,
  modules_explored TEXT, -- JSON array de módulos
  areas_worked TEXT, -- JSON array de áreas (emoções, corpo, etc)
  growth_highlights TEXT, -- JSON array de destaques
  suggested_conversation TEXT, -- Sugestão de conversa
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(child_id, week_start_date),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- ============================================
-- EVOLUÇÃO VISUAL DO MUNDO (já existe child_world_state na fase 6-7)
-- ============================================

-- Adicionar elementos visuais desbloqueados
CREATE TABLE IF NOT EXISTS unlocked_visual_elements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  element_key TEXT NOT NULL,
  element_type TEXT, -- 'background', 'decoration', 'mascot_outfit', 'theme'
  unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(child_id, element_key),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Elementos visuais disponíveis
CREATE TABLE IF NOT EXISTS visual_elements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  element_key TEXT UNIQUE NOT NULL,
  element_name TEXT NOT NULL,
  element_type TEXT NOT NULL,
  description TEXT,
  unlock_criteria TEXT, -- 'days_active', 'activities_completed', 'fp_earned'
  unlock_value INTEGER DEFAULT 0,
  preview_url TEXT,
  css_classes TEXT, -- classes CSS para aplicar
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MENSAGENS INSTITUCIONAIS
-- ============================================

-- Mensagens de segurança e confiança para mostrar aos pais
CREATE TABLE IF NOT EXISTS trust_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  icon TEXT,
  priority INTEGER DEFAULT 0, -- maior = mais importante
  show_frequency TEXT DEFAULT 'once', -- 'once', 'weekly', 'always'
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Rastreamento de mensagens mostradas
CREATE TABLE IF NOT EXISTS shown_trust_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  family_id INTEGER NOT NULL,
  message_key TEXT NOT NULL,
  shown_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_active_days_child_date ON child_active_days(child_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_routines_child_date ON daily_routines(child_id, date);
CREATE INDEX IF NOT EXISTS idx_weekly_summaries_child ON weekly_summaries(child_id);
CREATE INDEX IF NOT EXISTS idx_active_events_dates ON active_events(start_date, end_date);

-- ============================================
-- SEED: ELEMENTOS VISUAIS PADRÃO
-- ============================================

INSERT OR IGNORE INTO visual_elements (element_key, element_name, element_type, description, unlock_criteria, unlock_value, css_classes) VALUES
  ('theme_default', 'Tema Inicial', 'theme', 'Seu primeiro visual', 'always_unlocked', 0, 'theme-default'),
  ('theme_sunset', 'Pôr do Sol', 'theme', 'Céu laranja e rosa', 'days_active', 7, 'theme-sunset'),
  ('theme_ocean', 'Oceano Calmo', 'theme', 'Azul profundo e relaxante', 'days_active', 14, 'theme-ocean'),
  ('theme_forest', 'Floresta Verde', 'theme', 'Verde vivo e natural', 'activities_completed', 20, 'theme-forest'),
  ('theme_stars', 'Noite Estrelada', 'theme', 'Céu noturno brilhante', 'days_active', 30, 'theme-stars'),
  ('deco_flowers', 'Flores Coloridas', 'decoration', 'Flores alegres no cenário', 'activities_completed', 10, 'deco-flowers'),
  ('deco_butterflies', 'Borboletas', 'decoration', 'Borboletas voando', 'days_active', 5, 'deco-butterflies'),
  ('deco_rainbow', 'Arco-íris', 'decoration', 'Um lindo arco-íris', 'fp_earned', 500, 'deco-rainbow');

-- ============================================
-- SEED: MENSAGENS DE CONFIANÇA
-- ============================================

INSERT OR IGNORE INTO trust_messages (message_key, title, message, icon, priority, show_frequency) VALUES
  ('no_surveillance', 'Sem Vigilância', 'Aqui a criança aprende, não é analisada. Nenhum dado é vendido ou compartilhado.', '🛡️', 10, 'weekly'),
  ('safe_space', 'Espaço Seguro', 'Tudo acontece de forma visível e respeitosa. Sem surpresas, sem exposição.', '💙', 9, 'weekly'),
  ('no_tracking', 'Privacidade Total', 'Não gravamos conversas, não rastreamos navegação fora do app.', '🔒', 8, 'once'),
  ('positive_only', 'Sempre Positivo', 'Nunca usamos medo, culpa ou comparação. Apenas crescimento leve.', '🌟', 7, 'always');

-- ============================================
-- SEED: EVENTO SEMANAL INICIAL
-- ============================================

-- Primeiro criar na tabela time_events, depois em active_events
INSERT OR IGNORE INTO time_events (event_key, event_name, description, icon, event_type, theme, start_date, end_date, fp_bonus, is_active) VALUES
  ('welcome_week', 'Semana de Boas-Vindas', 'Sua primeira semana aqui! Explore e descubra.', '🌟', 'weekly', 'bem-vindo', date('now'), date('now', '+7 days'), 50, 1);

-- Criar evento ativo
INSERT OR IGNORE INTO active_events (event_key, start_date, end_date, theme, description, fp_bonus, visual_style, is_active)
VALUES ('welcome_week', date('now'), date('now', '+7 days'), 'Bem-vindo!', 'Sua primeira semana aqui! Explore e descubra.', 50, '{"primary": "#667eea", "secondary": "#764ba2"}', 1);
