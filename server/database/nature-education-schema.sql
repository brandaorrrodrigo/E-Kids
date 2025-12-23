-- =====================================================================
-- MÓDULO: NATUREZA, PLANTAS E ANIMAIS
-- =====================================================================

-- Categorias do módulo natureza
CREATE TABLE IF NOT EXISTS nature_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category_type VARCHAR(50) NOT NULL CHECK (category_type IN ('plants', 'animals', 'environment', 'responsibility')),
    icon VARCHAR(100),
    description TEXT,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lições de natureza
CREATE TABLE IF NOT EXISTS nature_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES nature_categories(id),
    lesson_type VARCHAR(50) NOT NULL, -- 'story', 'choice', 'mission'
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content_text TEXT,
    age_group INTEGER CHECK (age_group BETWEEN 1 AND 4),
    reward_fp INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Escolhas em situações
CREATE TABLE IF NOT EXISTS nature_choices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES nature_lessons(id),
    situation TEXT NOT NULL,
    choice_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    explanation TEXT,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progresso das lições de natureza
CREATE TABLE IF NOT EXISTS child_nature_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES nature_lessons(id),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress')),
    choices_made JSONB, -- array de escolhas
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(child_id, lesson_id)
);

-- Missões de natureza
CREATE TABLE IF NOT EXISTS nature_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES nature_categories(id),
    mission_type VARCHAR(50) NOT NULL, -- 'water_plant', 'observe_animal', 'recycle', 'care_days'
    name VARCHAR(200) NOT NULL,
    description TEXT,
    instructions TEXT,
    duration_days INTEGER,
    target_value INTEGER,
    reward_fp INTEGER NOT NULL,
    reward_badge_id UUID,
    age_group_min INTEGER DEFAULT 1,
    age_group_max INTEGER DEFAULT 4,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progresso das missões de natureza
CREATE TABLE IF NOT EXISTS child_nature_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES nature_missions(id),
    current_progress INTEGER DEFAULT 0,
    target_progress INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    notes TEXT
);

-- Badges de natureza
CREATE TABLE IF NOT EXISTS nature_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    badge_type VARCHAR(50) NOT NULL, -- 'plant_friend', 'animal_protector', 'nature_guardian'
    icon VARCHAR(100),
    criteria JSONB,
    reward_fp INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges de natureza conquistados
CREATE TABLE IF NOT EXISTS child_nature_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES nature_badges(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(child_id, badge_id)
);

-- Mascotes e temas verdes (integração com cofrinho verde)
CREATE TABLE IF NOT EXISTS nature_themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    theme_type VARCHAR(50) NOT NULL, -- 'mascot', 'background', 'decoration'
    description TEXT,
    visual_description TEXT,
    unlock_fp_cost INTEGER,
    unlock_criteria JSONB, -- {"nature_missions_completed": 5}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Temas de natureza desbloqueados
CREATE TABLE IF NOT EXISTS child_nature_themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    theme_id UUID REFERENCES nature_themes(id),
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT false,
    UNIQUE(child_id, theme_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_nature_lessons_category ON nature_lessons(category_id);
CREATE INDEX IF NOT EXISTS idx_child_nature_progress_child ON child_nature_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_child_nature_missions_child ON child_nature_missions(child_id);
CREATE INDEX IF NOT EXISTS idx_nature_missions_category ON nature_missions(category_id);

-- Seed data - Categorias
INSERT INTO nature_categories (name, category_type, icon, description, display_order) VALUES
('Plantas', 'plants', 'plant.svg', 'Aprenda a cuidar de plantas', 1),
('Animais', 'animals', 'paw.svg', 'Respeite e cuide dos animais', 2),
('Ambiente', 'environment', 'earth.svg', 'Cuide do nosso planeta', 3),
('Responsabilidade', 'responsibility', 'heart.svg', 'Seja responsável com a natureza', 4);

-- Seed data - Badges
INSERT INTO nature_badges (name, description, badge_type, icon, criteria, reward_fp) VALUES
('Amigo das Plantas', 'Cuidou de uma planta por 3 dias', 'plant_friend', 'plant_badge.svg', '{"care_days": 3}', 15),
('Protetor dos Animais', 'Completou 5 lições sobre animais', 'animal_protector', 'animal_badge.svg', '{"animal_lessons": 5}', 20),
('Guardião da Natureza', 'Completou 10 missões de natureza', 'nature_guardian', 'nature_badge.svg', '{"nature_missions": 10}', 50),
('Planeta Limpo', 'Completou 5 missões de reciclagem', 'clean_planet', 'recycle_badge.svg', '{"recycle_missions": 5}', 25),
('Coração Verde', 'Desbloqueou todos os temas de natureza', 'green_heart', 'green_heart.svg', '{"all_themes": true}', 100);

-- Seed data - Missões de natureza
INSERT INTO nature_missions (category_id, mission_type, name, description, instructions, duration_days, target_value, reward_fp, age_group_min, age_group_max)
SELECT
    id,
    'water_plant',
    'Regar uma Planta',
    'Ajude a regar uma planta',
    'Peça ajuda a um adulto para regar uma planta hoje',
    1,
    1,
    10,
    1,
    4
FROM nature_categories WHERE category_type = 'plants' LIMIT 1;

INSERT INTO nature_missions (category_id, mission_type, name, description, instructions, duration_days, target_value, reward_fp, age_group_min, age_group_max)
SELECT
    id,
    'observe_animal',
    'Observar com Respeito',
    'Observe um animal sem assustá-lo',
    'Olhe para um animal de longe, sem fazer barulho',
    1,
    1,
    10,
    1,
    4
FROM nature_categories WHERE category_type = 'animals' LIMIT 1;

INSERT INTO nature_missions (category_id, mission_type, name, description, instructions, duration_days, target_value, reward_fp, age_group_min, age_group_max)
SELECT
    id,
    'recycle',
    'Jogar Lixo Fora',
    'Jogue o lixo no lugar certo',
    'Jogue seu lixo na lixeira hoje',
    1,
    1,
    10,
    1,
    4
FROM nature_categories WHERE category_type = 'environment' LIMIT 1;

INSERT INTO nature_missions (category_id, mission_type, name, description, instructions, duration_days, target_value, reward_fp, age_group_min, age_group_max)
SELECT
    id,
    'care_days',
    'Cuidador por 7 Dias',
    'Cuide de algo vivo por 7 dias',
    'Escolha uma planta ou animal de estimação e cuide por uma semana',
    7,
    7,
    50,
    2,
    4
FROM nature_categories WHERE category_type = 'responsibility' LIMIT 1;
