-- =====================================================================
-- MÓDULO: HIGIENE E AUTOCUIDADO
-- =====================================================================

-- Categorias de higiene
CREATE TABLE IF NOT EXISTS hygiene_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_type TEXT NOT NULL CHECK (category_type IN ('hands', 'teeth', 'body', 'clothes', 'food')),
    icon TEXT,
    description TEXT,
    display_order INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Hábitos de higiene
CREATE TABLE IF NOT EXISTS hygiene_habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    habit_name TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    frequency TEXT NOT NULL,
    recommended_time TEXT,
    reward_fp INTEGER DEFAULT 5,
    age_group_min INTEGER DEFAULT 1,
    age_group_max INTEGER DEFAULT 4,
    visual_guide TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES hygiene_categories(id)
);

-- Registro de hábitos da criança
CREATE TABLE IF NOT EXISTS child_hygiene_tracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    habit_id INTEGER NOT NULL,
    tracked_date TEXT NOT NULL,
    times_completed INTEGER DEFAULT 1,
    fp_earned INTEGER DEFAULT 0,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(child_id, habit_id, tracked_date),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (habit_id) REFERENCES hygiene_habits(id)
);

-- Missões de higiene
CREATE TABLE IF NOT EXISTS hygiene_missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    mission_type TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    duration_days INTEGER,
    target_completions INTEGER,
    reward_fp INTEGER NOT NULL,
    reward_badge_id INTEGER,
    age_group_min INTEGER DEFAULT 1,
    age_group_max INTEGER DEFAULT 4,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES hygiene_categories(id)
);

-- Progresso das missões de higiene
CREATE TABLE IF NOT EXISTS child_hygiene_missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    mission_id INTEGER NOT NULL,
    current_progress INTEGER DEFAULT 0,
    target_progress INTEGER NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
    started_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (mission_id) REFERENCES hygiene_missions(id)
);

-- Badges de higiene
CREATE TABLE IF NOT EXISTS hygiene_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    badge_type TEXT NOT NULL,
    icon TEXT,
    criteria TEXT,
    reward_fp INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Badges de higiene conquistados
CREATE TABLE IF NOT EXISTS child_hygiene_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    badge_id INTEGER NOT NULL,
    earned_at TEXT DEFAULT (datetime('now')),
    UNIQUE(child_id, badge_id),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES hygiene_badges(id)
);

-- Estatísticas de higiene
CREATE TABLE IF NOT EXISTS child_hygiene_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER UNIQUE NOT NULL,
    total_habits_completed INTEGER DEFAULT 0,
    current_streak_days INTEGER DEFAULT 0,
    longest_streak_days INTEGER DEFAULT 0,
    last_tracked_date TEXT,
    frequency_score REAL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Lembretes de higiene
CREATE TABLE IF NOT EXISTS hygiene_reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    habit_id INTEGER NOT NULL,
    reminder_time TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    days_of_week TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (habit_id) REFERENCES hygiene_habits(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_hygiene_habits_category ON hygiene_habits(category_id);
CREATE INDEX IF NOT EXISTS idx_child_hygiene_tracking_child ON child_hygiene_tracking(child_id);
CREATE INDEX IF NOT EXISTS idx_child_hygiene_tracking_date ON child_hygiene_tracking(tracked_date DESC);
CREATE INDEX IF NOT EXISTS idx_child_hygiene_missions_child ON child_hygiene_missions(child_id);

-- Seed data - Categorias
INSERT OR IGNORE INTO hygiene_categories (id, name, category_type, icon, description, display_order) VALUES
(1, 'Mãos', 'hands', 'hands.svg', 'Mãos limpas protegem você', 1),
(2, 'Boca e Dentes', 'teeth', 'tooth.svg', 'Dentes saudáveis, sorriso feliz', 2),
(3, 'Corpo e Banho', 'body', 'shower.svg', 'Corpo limpo, você saudável', 3),
(4, 'Roupas', 'clothes', 'tshirt.svg', 'Roupas limpas são importantes', 4),
(5, 'Alimentos', 'food', 'apple.svg', 'Comer com cuidado', 5);

-- Seed data - Badges
INSERT OR IGNORE INTO hygiene_badges (id, name, description, badge_type, icon, criteria, reward_fp) VALUES
(1, 'Mãos Limpas', 'Lavou as mãos 7 dias seguidos', 'clean_hands', 'hands_badge.svg', '{"hand_wash_streak": 7}', 20),
(2, 'Sorriso Forte', 'Escovou os dentes 14 dias seguidos', 'strong_smile', 'smile_badge.svg', '{"teeth_brush_streak": 14}', 30),
(3, 'Corpo Saudável', 'Completou rotina de higiene por 7 dias', 'healthy_body', 'body_badge.svg', '{"full_routine_streak": 7}', 50),
(4, 'Guardião da Saúde', 'Completou 30 hábitos de higiene', 'health_guardian', 'shield_badge.svg', '{"total_habits": 30}', 40),
(5, 'Mestre do Autocuidado', 'Manteve sequência de 30 dias', 'self_care_master', 'master_badge.svg', '{"longest_streak": 30}', 100);

-- Seed data - Hábitos
INSERT OR IGNORE INTO hygiene_habits (id, category_id, habit_name, description, instructions, frequency, recommended_time, reward_fp, age_group_min, age_group_max, visual_guide) VALUES
(1, 1, 'Lavar as Mãos Antes de Comer', 'Lave suas mãos antes das refeições', 'Use água e sabão, esfregue bem e enxágue', 'multiple_daily', 'before_meals', 5, 1, 4, 'Molhe as mãos → Sabão → Esfregue → Enxágue → Seque'),
(2, 1, 'Lavar as Mãos Após o Banheiro', 'Sempre lave as mãos depois de usar o banheiro', 'Use água e sabão, esfregue bem e enxágue', 'after_activity', 'after_bathroom', 5, 1, 4, 'Molhe as mãos → Sabão → Esfregue → Enxágue → Seque'),
(3, 2, 'Escovar os Dentes Após Almoço', 'Escove seus dentes depois do almoço', 'Use escova e pasta, escove por 2 minutos', 'daily', 'after_meals', 10, 1, 4, 'Pasta na escova → Movimentos circulares → Enxágue'),
(4, 2, 'Escovar os Dentes Antes de Dormir', 'Escove seus dentes antes de ir para a cama', 'Use escova e pasta, escove por 2 minutos', 'daily', 'before_sleep', 10, 1, 4, 'Pasta na escova → Movimentos circulares → Enxágue'),
(5, 3, 'Tomar Banho', 'Tome banho para ficar limpo', 'Lave todo o corpo com água e sabonete', 'daily', 'after_activity', 15, 1, 4, 'Molhar → Ensaboar → Enxaguar → Secar'),
(6, 4, 'Trocar de Roupa ao Chegar em Casa', 'Troque de roupa quando chegar da rua', 'Vista roupas limpas e confortáveis', 'after_activity', 'after_activity', 5, 2, 4, 'Tirar roupa da rua → Vestir roupa limpa'),
(7, 4, 'Trocar de Meia', 'Use meias limpas todos os dias', 'Não use a mesma meia dois dias seguidos', 'daily', 'daily', 5, 2, 4, 'Tirar meia usada → Colocar meia limpa'),
(8, 5, 'Lavar Frutas Antes de Comer', 'Lave bem as frutas antes de comer', 'Lave com água corrente', 'after_activity', 'before_meals', 5, 1, 4, 'Água corrente → Esfregar suavemente → Pronto para comer');

-- Seed data - Missões
INSERT OR IGNORE INTO hygiene_missions (id, category_id, mission_type, name, description, instructions, duration_days, target_completions, reward_fp, age_group_min, age_group_max) VALUES
(1, 1, 'streak', 'Sequência de Mãos Limpas', 'Lave as mãos por 3 dias seguidos', 'Lembre de lavar as mãos antes das refeições', 3, 3, 20, 1, 4),
(2, 2, 'streak', 'Sorriso Brilhante', 'Escove os dentes por 7 dias seguidos', 'Escove após o almoço e antes de dormir', 7, 14, 50, 1, 4),
(3, 3, 'daily_routine', 'Rotina Completa', 'Complete todos os hábitos do dia', 'Mãos, dentes e banho em um dia', 1, 3, 30, 2, 4);
