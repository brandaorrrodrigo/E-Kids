-- =====================================================================
-- MÓDULO: HIGIENE E AUTOCUIDADO
-- =====================================================================

-- Categorias de higiene
CREATE TABLE IF NOT EXISTS hygiene_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category_type VARCHAR(50) NOT NULL CHECK (category_type IN ('hands', 'teeth', 'body', 'clothes', 'food')),
    icon VARCHAR(100),
    description TEXT,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hábitos de higiene
CREATE TABLE IF NOT EXISTS hygiene_habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES hygiene_categories(id),
    habit_name VARCHAR(200) NOT NULL,
    description TEXT,
    instructions TEXT,
    frequency VARCHAR(50) NOT NULL, -- 'daily', 'multiple_daily', 'after_activity'
    recommended_time VARCHAR(100), -- 'before_meals', 'after_bathroom', 'before_sleep'
    reward_fp INTEGER DEFAULT 5,
    age_group_min INTEGER DEFAULT 1,
    age_group_max INTEGER DEFAULT 4,
    visual_guide TEXT, -- descrição visual de como fazer
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registro de hábitos da criança
CREATE TABLE IF NOT EXISTS child_hygiene_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    habit_id UUID REFERENCES hygiene_habits(id),
    tracked_date DATE NOT NULL,
    times_completed INTEGER DEFAULT 1,
    fp_earned INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(child_id, habit_id, tracked_date)
);

-- Missões de higiene
CREATE TABLE IF NOT EXISTS hygiene_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES hygiene_categories(id),
    mission_type VARCHAR(50) NOT NULL, -- 'streak', 'daily_routine', 'consistency'
    name VARCHAR(200) NOT NULL,
    description TEXT,
    instructions TEXT,
    duration_days INTEGER,
    target_completions INTEGER,
    reward_fp INTEGER NOT NULL,
    reward_badge_id UUID,
    age_group_min INTEGER DEFAULT 1,
    age_group_max INTEGER DEFAULT 4,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progresso das missões de higiene
CREATE TABLE IF NOT EXISTS child_hygiene_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES hygiene_missions(id),
    current_progress INTEGER DEFAULT 0,
    target_progress INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Badges de higiene
CREATE TABLE IF NOT EXISTS hygiene_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    badge_type VARCHAR(50) NOT NULL, -- 'healthy_body', 'clean_hands', 'strong_smile'
    icon VARCHAR(100),
    criteria JSONB,
    reward_fp INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges de higiene conquistados
CREATE TABLE IF NOT EXISTS child_hygiene_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES hygiene_badges(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(child_id, badge_id)
);

-- Estatísticas de higiene (para dashboard dos pais)
CREATE TABLE IF NOT EXISTS child_hygiene_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID UNIQUE REFERENCES children(id) ON DELETE CASCADE,
    total_habits_completed INTEGER DEFAULT 0,
    current_streak_days INTEGER DEFAULT 0,
    longest_streak_days INTEGER DEFAULT 0,
    last_tracked_date DATE,
    frequency_score DECIMAL(5,2) DEFAULT 0, -- 0-100
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lembretes de higiene (opcionais, configurados pelos pais)
CREATE TABLE IF NOT EXISTS hygiene_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    habit_id UUID REFERENCES hygiene_habits(id),
    reminder_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    days_of_week JSONB, -- [1,2,3,4,5,6,7] para cada dia da semana
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_hygiene_habits_category ON hygiene_habits(category_id);
CREATE INDEX IF NOT EXISTS idx_child_hygiene_tracking_child ON child_hygiene_tracking(child_id);
CREATE INDEX IF NOT EXISTS idx_child_hygiene_tracking_date ON child_hygiene_tracking(tracked_date DESC);
CREATE INDEX IF NOT EXISTS idx_child_hygiene_missions_child ON child_hygiene_missions(child_id);

-- Trigger para atualizar estatísticas
CREATE OR REPLACE FUNCTION update_hygiene_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO child_hygiene_stats (child_id, total_habits_completed, last_tracked_date)
    VALUES (NEW.child_id, 1, NEW.tracked_date)
    ON CONFLICT (child_id) DO UPDATE SET
        total_habits_completed = child_hygiene_stats.total_habits_completed + 1,
        last_tracked_date = NEW.tracked_date,
        updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_hygiene_stats
    AFTER INSERT ON child_hygiene_tracking
    FOR EACH ROW EXECUTE FUNCTION update_hygiene_stats();

-- Seed data - Categorias
INSERT INTO hygiene_categories (name, category_type, icon, description, display_order) VALUES
('Mãos', 'hands', 'hands.svg', 'Mãos limpas protegem você', 1),
('Boca e Dentes', 'teeth', 'tooth.svg', 'Dentes saudáveis, sorriso feliz', 2),
('Corpo e Banho', 'body', 'shower.svg', 'Corpo limpo, você saudável', 3),
('Roupas', 'clothes', 'tshirt.svg', 'Roupas limpas são importantes', 4),
('Alimentos', 'food', 'apple.svg', 'Comer com cuidado', 5);

-- Seed data - Badges
INSERT INTO hygiene_badges (name, description, badge_type, icon, criteria, reward_fp) VALUES
('Mãos Limpas', 'Lavou as mãos 7 dias seguidos', 'clean_hands', 'hands_badge.svg', '{"hand_wash_streak": 7}', 20),
('Sorriso Forte', 'Escovou os dentes 14 dias seguidos', 'strong_smile', 'smile_badge.svg', '{"teeth_brush_streak": 14}', 30),
('Corpo Saudável', 'Completou rotina de higiene por 7 dias', 'healthy_body', 'body_badge.svg', '{"full_routine_streak": 7}', 50),
('Guardião da Saúde', 'Completou 30 hábitos de higiene', 'health_guardian', 'shield_badge.svg', '{"total_habits": 30}', 40),
('Mestre do Autocuidado', 'Manteve sequência de 30 dias', 'self_care_master', 'master_badge.svg', '{"longest_streak": 30}', 100);

-- Seed data - Hábitos
INSERT INTO hygiene_habits (category_id, habit_name, description, instructions, frequency, recommended_time, reward_fp, age_group_min, age_group_max, visual_guide)
SELECT
    id,
    'Lavar as Mãos Antes de Comer',
    'Lave suas mãos antes das refeições',
    'Use água e sabão, esfregue bem e enxágue',
    'multiple_daily',
    'before_meals',
    5,
    1,
    4,
    'Molhe as mãos → Sabão → Esfregue → Enxágue → Seque'
FROM hygiene_categories WHERE category_type = 'hands' LIMIT 1;

INSERT INTO hygiene_habits (category_id, habit_name, description, instructions, frequency, recommended_time, reward_fp, age_group_min, age_group_max, visual_guide)
SELECT
    id,
    'Lavar as Mãos Após o Banheiro',
    'Sempre lave as mãos depois de usar o banheiro',
    'Use água e sabão, esfregue bem e enxágue',
    'after_activity',
    'after_bathroom',
    5,
    1,
    4,
    'Molhe as mãos → Sabão → Esfregue → Enxágue → Seque'
FROM hygiene_categories WHERE category_type = 'hands' LIMIT 1;

INSERT INTO hygiene_habits (category_id, habit_name, description, instructions, frequency, recommended_time, reward_fp, age_group_min, age_group_max, visual_guide)
SELECT
    id,
    'Escovar os Dentes Após Almoço',
    'Escove seus dentes depois do almoço',
    'Use escova e pasta, escove por 2 minutos',
    'daily',
    'after_meals',
    10,
    1,
    4,
    'Pasta na escova → Movimentos circulares → Enxágue'
FROM hygiene_categories WHERE category_type = 'teeth' LIMIT 1;

INSERT INTO hygiene_habits (category_id, habit_name, description, instructions, frequency, recommended_time, reward_fp, age_group_min, age_group_max, visual_guide)
SELECT
    id,
    'Escovar os Dentes Antes de Dormir',
    'Escove seus dentes antes de ir para a cama',
    'Use escova e pasta, escove por 2 minutos',
    'daily',
    'before_sleep',
    10,
    1,
    4,
    'Pasta na escova → Movimentos circulares → Enxágue'
FROM hygiene_categories WHERE category_type = 'teeth' LIMIT 1;

INSERT INTO hygiene_habits (category_id, habit_name, description, instructions, frequency, recommended_time, reward_fp, age_group_min, age_group_max, visual_guide)
SELECT
    id,
    'Tomar Banho',
    'Tome banho para ficar limpo',
    'Lave todo o corpo com água e sabonete',
    'daily',
    'after_activity',
    15,
    1,
    4,
    'Molhar → Ensaboar → Enxaguar → Secar'
FROM hygiene_categories WHERE category_type = 'body' LIMIT 1;

INSERT INTO hygiene_habits (category_id, habit_name, description, instructions, frequency, recommended_time, reward_fp, age_group_min, age_group_max, visual_guide)
SELECT
    id,
    'Trocar de Roupa ao Chegar em Casa',
    'Troque de roupa quando chegar da rua',
    'Vista roupas limpas e confortáveis',
    'after_activity',
    'after_activity',
    5,
    2,
    4,
    'Tirar roupa da rua → Vestir roupa limpa'
FROM hygiene_categories WHERE category_type = 'clothes' LIMIT 1;

INSERT INTO hygiene_habits (category_id, habit_name, description, instructions, frequency, recommended_time, reward_fp, age_group_min, age_group_max, visual_guide)
SELECT
    id,
    'Trocar de Meia',
    'Use meias limpas todos os dias',
    'Não use a mesma meia dois dias seguidos',
    'daily',
    'daily',
    5,
    2,
    4,
    'Tirar meia usada → Colocar meia limpa'
FROM hygiene_categories WHERE category_type = 'clothes' LIMIT 1;

INSERT INTO hygiene_habits (category_id, habit_name, description, instructions, frequency, recommended_time, reward_fp, age_group_min, age_group_max, visual_guide)
SELECT
    id,
    'Lavar Frutas Antes de Comer',
    'Lave bem as frutas antes de comer',
    'Lave com água corrente',
    'after_activity',
    'before_meals',
    5,
    1,
    4,
    'Água corrente → Esfregar suavemente → Pronto para comer'
FROM hygiene_categories WHERE category_type = 'food' LIMIT 1;

-- Seed data - Missões
INSERT INTO hygiene_missions (category_id, mission_type, name, description, instructions, duration_days, target_completions, reward_fp, age_group_min, age_group_max)
SELECT
    id,
    'streak',
    'Sequência de Mãos Limpas',
    'Lave as mãos por 3 dias seguidos',
    'Lembre de lavar as mãos antes das refeições',
    3,
    3,
    20,
    1,
    4
FROM hygiene_categories WHERE category_type = 'hands' LIMIT 1;

INSERT INTO hygiene_missions (category_id, mission_type, name, description, instructions, duration_days, target_completions, reward_fp, age_group_min, age_group_max)
SELECT
    id,
    'streak',
    'Sorriso Brilhante',
    'Escove os dentes por 7 dias seguidos',
    'Escove após o almoço e antes de dormir',
    7,
    14,
    50,
    1,
    4
FROM hygiene_categories WHERE category_type = 'teeth' LIMIT 1;

INSERT INTO hygiene_missions (category_id, mission_type, name, description, instructions, duration_days, target_completions, reward_fp, age_group_min, age_group_max)
SELECT
    id,
    'daily_routine',
    'Rotina Completa',
    'Complete todos os hábitos do dia',
    'Mãos, dentes e banho em um dia',
    1,
    3,
    30,
    2,
    4
FROM hygiene_categories WHERE category_type = 'body' LIMIT 1;
