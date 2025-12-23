-- =====================================================================
-- MÓDULO: EDUCAÇÃO FINANCEIRA E COFRINHO
-- =====================================================================

-- Múltiplos cofrinhos por criança
CREATE TABLE IF NOT EXISTS piggy_banks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    goal_type TEXT NOT NULL CHECK (goal_type IN ('short', 'medium', 'dream', 'planet')),
    target_fp INTEGER,
    current_fp INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Decisões de FP (guardar vs gastar)
CREATE TABLE IF NOT EXISTS fp_decisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    fp_amount INTEGER NOT NULL,
    decision TEXT NOT NULL CHECK (decision IN ('save', 'spend', 'decide_later')),
    context TEXT NOT NULL,
    source TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Extrato mensal
CREATE TABLE IF NOT EXISTS monthly_statements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    fp_earned INTEGER DEFAULT 0,
    fp_saved INTEGER DEFAULT 0,
    fp_spent INTEGER DEFAULT 0,
    final_balance INTEGER DEFAULT 0,
    savings_percentage REAL DEFAULT 0,
    statement_data TEXT,
    audio_url TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(child_id, month, year),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Badges financeiros
CREATE TABLE IF NOT EXISTS financial_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    badge_type TEXT NOT NULL,
    icon TEXT,
    criteria TEXT,
    reward_fp INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Badges financeiros conquistados
CREATE TABLE IF NOT EXISTS child_financial_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    badge_id INTEGER NOT NULL,
    earned_at TEXT DEFAULT (datetime('now')),
    UNIQUE(child_id, badge_id),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES financial_badges(id)
);

-- Missões financeiras
CREATE TABLE IF NOT EXISTS financial_missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mission_type TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    duration_days INTEGER,
    target_value INTEGER,
    reward_fp INTEGER NOT NULL,
    reward_badge_id INTEGER,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (reward_badge_id) REFERENCES financial_badges(id)
);

-- Progresso das missões financeiras
CREATE TABLE IF NOT EXISTS child_financial_missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    mission_id INTEGER NOT NULL,
    current_progress INTEGER DEFAULT 0,
    target_progress INTEGER NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
    started_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (mission_id) REFERENCES financial_missions(id)
);

-- Bônus por poupança (invisível)
CREATE TABLE IF NOT EXISTS savings_bonuses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    bonus_type TEXT NOT NULL,
    bonus_value INTEGER,
    reason TEXT,
    applied_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_piggy_banks_child ON piggy_banks(child_id);
CREATE INDEX IF NOT EXISTS idx_fp_decisions_child ON fp_decisions(child_id);
CREATE INDEX IF NOT EXISTS idx_monthly_statements_child ON monthly_statements(child_id);
CREATE INDEX IF NOT EXISTS idx_child_financial_missions_child ON child_financial_missions(child_id);

-- Seed data - Badges financeiros
INSERT OR IGNORE INTO financial_badges (id, name, description, badge_type, icon, criteria, reward_fp) VALUES
(1, 'Poupador Iniciante', 'Guardou FP pela primeira vez', 'beginner_saver', 'piggy_beginner.svg', '{"first_save": true}', 10),
(2, 'Planejador Esperto', 'Completou primeira meta de poupança', 'smart_planner', 'planner.svg', '{"goals_completed": 1}', 25),
(3, 'Mestre do Cofrinho', 'Poupou mais de 100 FP no total', 'piggy_master', 'piggy_master.svg', '{"total_saved": 100}', 50),
(4, 'Guardião do Futuro', 'Poupou por 7 dias seguidos', 'consistency', 'guardian.svg', '{"consecutive_saves": 7}', 30),
(5, 'Investidor Junior', 'Poupou mais do que gastou em um mês', 'monthly_saver', 'investor.svg', '{"monthly_savings_rate": 50}', 40);

-- Seed data - Missões financeiras
INSERT OR IGNORE INTO financial_missions (id, mission_type, name, description, duration_days, target_value, reward_fp) VALUES
(1, 'save_fp_days', 'Guardião de 3 Dias', 'Guarde FP no cofrinho por 3 dias seguidos', 3, 3, 15),
(2, 'no_spend_today', 'Dia sem Gastar', 'Não gaste FP hoje', 1, 1, 10),
(3, 'reach_goal', 'Primeira Meta', 'Complete sua primeira meta do cofrinho', NULL, 1, 20),
(4, 'save_fp_days', 'Guardião Semanal', 'Guarde FP por 7 dias seguidos', 7, 7, 50),
(5, 'save_percentage', 'Poupador Esperto', 'Poupe pelo menos 50% dos FP que ganhar hoje', 1, 50, 25);
