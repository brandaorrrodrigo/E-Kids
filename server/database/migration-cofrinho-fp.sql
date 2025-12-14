-- E-KIDS PRO - SISTEMA COFRINHO FP
-- Economia Infantil: Ensina planejamento e espera

-- Cofrinho de cada criança
CREATE TABLE IF NOT EXISTS child_savings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL UNIQUE,
  fp_saved INTEGER DEFAULT 0,
  last_yield_date DATE,
  total_yield_earned INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Histórico de transações do cofrinho
CREATE TABLE IF NOT EXISTS savings_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- 'deposit', 'withdraw', 'yield'
  amount INTEGER NOT NULL,
  fp_saved_before INTEGER,
  fp_saved_after INTEGER,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Níveis de progressão da criança
CREATE TABLE IF NOT EXISTS child_levels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL UNIQUE,
  current_level TEXT DEFAULT 'iniciante', -- iniciante, explorador, confiante
  total_xp INTEGER DEFAULT 0,
  level_unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Temas visuais desbloqueados
CREATE TABLE IF NOT EXISTS child_themes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  theme_key TEXT NOT NULL,
  unlocked_with_fp INTEGER DEFAULT 0,
  unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active INTEGER DEFAULT 0,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Temas disponíveis
CREATE TABLE IF NOT EXISTS visual_themes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theme_key TEXT UNIQUE NOT NULL,
  theme_name TEXT NOT NULL,
  fp_cost INTEGER DEFAULT 0,
  colors_json TEXT, -- JSON com cores do tema
  is_premium INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inserir temas padrão
INSERT OR IGNORE INTO visual_themes (theme_key, theme_name, fp_cost, colors_json, is_premium) VALUES
  ('default', 'Padrão', 0, '{"primary": "#667eea", "secondary": "#764ba2"}', 0),
  ('floresta', 'Floresta Mágica', 200, '{"primary": "#34a853", "secondary": "#0f9d58"}', 0),
  ('oceano', 'Oceano Profundo', 300, '{"primary": "#4285f4", "secondary": "#1967d2"}', 0),
  ('espacial', 'Espaço Sideral', 400, '{"primary": "#5f6368", "secondary": "#202124"}', 0),
  ('arco-iris', 'Arco-Íris', 500, '{"primary": "#ea4335", "secondary": "#fbbc04"}', 0);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_savings_child ON child_savings(child_id);
CREATE INDEX IF NOT EXISTS idx_savings_transactions_child ON savings_transactions(child_id);
CREATE INDEX IF NOT EXISTS idx_child_levels_child ON child_levels(child_id);
CREATE INDEX IF NOT EXISTS idx_child_themes_child ON child_themes(child_id);
