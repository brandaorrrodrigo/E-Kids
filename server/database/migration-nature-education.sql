-- =====================================================================
-- MÓDULO: NATUREZA, PLANTAS E ANIMAIS
-- =====================================================================

-- Categorias do módulo natureza
CREATE TABLE IF NOT EXISTS nature_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_type TEXT NOT NULL CHECK (category_type IN ('plants', 'animals', 'environment', 'responsibility')),
    icon TEXT,
    description TEXT,
    display_order INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Lições de natureza
CREATE TABLE IF NOT EXISTS nature_lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    lesson_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content_text TEXT,
    age_group INTEGER CHECK (age_group BETWEEN 1 AND 4),
    reward_fp INTEGER DEFAULT 10,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES nature_categories(id)
);

-- Escolhas em situações
CREATE TABLE IF NOT EXISTS nature_choices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER NOT NULL,
    situation TEXT NOT NULL,
    choice_text TEXT NOT NULL,
    is_correct INTEGER NOT NULL,
    explanation TEXT,
    display_order INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (lesson_id) REFERENCES nature_lessons(id)
);

-- Progresso das lições de natureza
CREATE TABLE IF NOT EXISTS child_nature_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress')),
    choices_made TEXT,
    completed_at TEXT DEFAULT (datetime('now')),
    UNIQUE(child_id, lesson_id),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES nature_lessons(id)
);

-- Missões de natureza
CREATE TABLE IF NOT EXISTS nature_missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    mission_type TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    duration_days INTEGER,
    target_value INTEGER,
    reward_fp INTEGER NOT NULL,
    reward_badge_id INTEGER,
    age_group_min INTEGER DEFAULT 1,
    age_group_max INTEGER DEFAULT 4,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES nature_categories(id)
);

-- Progresso das missões de natureza
CREATE TABLE IF NOT EXISTS child_nature_missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    mission_id INTEGER NOT NULL,
    current_progress INTEGER DEFAULT 0,
    target_progress INTEGER NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
    started_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    notes TEXT,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (mission_id) REFERENCES nature_missions(id)
);

-- Badges de natureza
CREATE TABLE IF NOT EXISTS nature_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    badge_type TEXT NOT NULL,
    icon TEXT,
    criteria TEXT,
    reward_fp INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Badges de natureza conquistados
CREATE TABLE IF NOT EXISTS child_nature_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    badge_id INTEGER NOT NULL,
    earned_at TEXT DEFAULT (datetime('now')),
    UNIQUE(child_id, badge_id),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES nature_badges(id)
);

-- Mascotes e temas verdes
CREATE TABLE IF NOT EXISTS nature_themes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    theme_type TEXT NOT NULL,
    description TEXT,
    visual_description TEXT,
    unlock_fp_cost INTEGER,
    unlock_criteria TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Temas de natureza desbloqueados
CREATE TABLE IF NOT EXISTS child_nature_themes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    theme_id INTEGER NOT NULL,
    unlocked_at TEXT DEFAULT (datetime('now')),
    is_active INTEGER DEFAULT 0,
    UNIQUE(child_id, theme_id),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (theme_id) REFERENCES nature_themes(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_nature_lessons_category ON nature_lessons(category_id);
CREATE INDEX IF NOT EXISTS idx_child_nature_progress_child ON child_nature_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_child_nature_missions_child ON child_nature_missions(child_id);
CREATE INDEX IF NOT EXISTS idx_nature_missions_category ON nature_missions(category_id);

-- Seed data - Categorias
INSERT OR IGNORE INTO nature_categories (id, name, category_type, icon, description, display_order) VALUES
(1, 'Plantas', 'plants', 'plant.svg', 'Aprenda a cuidar de plantas', 1),
(2, 'Animais', 'animals', 'paw.svg', 'Respeite e cuide dos animais', 2),
(3, 'Ambiente', 'environment', 'earth.svg', 'Cuide do nosso planeta', 3),
(4, 'Responsabilidade', 'responsibility', 'heart.svg', 'Seja responsável com a natureza', 4);

-- Seed data - Badges
INSERT OR IGNORE INTO nature_badges (id, name, description, badge_type, icon, criteria, reward_fp) VALUES
(1, 'Amigo das Plantas', 'Cuidou de uma planta por 3 dias', 'plant_friend', 'plant_badge.svg', '{"care_days": 3}', 15),
(2, 'Protetor dos Animais', 'Completou 5 lições sobre animais', 'animal_protector', 'animal_badge.svg', '{"animal_lessons": 5}', 20),
(3, 'Guardião da Natureza', 'Completou 10 missões de natureza', 'nature_guardian', 'nature_badge.svg', '{"nature_missions": 10}', 50),
(4, 'Planeta Limpo', 'Completou 5 missões de reciclagem', 'clean_planet', 'recycle_badge.svg', '{"recycle_missions": 5}', 25),
(5, 'Coração Verde', 'Desbloqueou todos os temas de natureza', 'green_heart', 'green_heart.svg', '{"all_themes": true}', 100);

-- Seed data - Missões de natureza
INSERT OR IGNORE INTO nature_missions (id, category_id, mission_type, name, description, instructions, duration_days, target_value, reward_fp, age_group_min, age_group_max) VALUES
(1, 1, 'water_plant', 'Regar uma Planta', 'Ajude a regar uma planta', 'Peça ajuda a um adulto para regar uma planta hoje', 1, 1, 10, 1, 4),
(2, 2, 'observe_animal', 'Observar com Respeito', 'Observe um animal sem assustá-lo', 'Olhe para um animal de longe, sem fazer barulho', 1, 1, 10, 1, 4),
(3, 3, 'recycle', 'Jogar Lixo Fora', 'Jogue o lixo no lugar certo', 'Jogue seu lixo na lixeira hoje', 1, 1, 10, 1, 4),
(4, 4, 'care_days', 'Cuidador por 7 Dias', 'Cuide de algo vivo por 7 dias', 'Escolha uma planta ou animal de estimação e cuide por uma semana', 7, 7, 50, 2, 4);

-- Seed data - Lições de natureza com escolhas
INSERT OR IGNORE INTO nature_lessons (id, category_id, lesson_type, title, description, content_text, age_group, reward_fp) VALUES
(1, 2, 'choice', 'Animal Assustado', 'O que fazer quando um animal está assustado?', 'Você vê um gatinho que parece assustado. O que você faz?', 2, 15),
(2, 1, 'story', 'Plantas São Vivas', 'Aprenda sobre plantas', 'Plantas são seres vivos. Elas precisam de água, luz do sol e cuidado para crescer.', 1, 10),
(3, 2, 'choice', 'Animal Dormindo', 'Respeite o sono dos animais', 'Você vê seu cachorro dormindo. O que fazer?', 1, 10);

-- Seed data - Escolhas para lições
INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
-- Lição 1: Animal Assustado
(1, 'Você vê um gatinho que parece assustado', 'Deixar em paz', 1, 'Muito bem! Animais assustados precisam de espaço.', 1),
(1, 'Você vê um gatinho que parece assustado', 'Pedir ajuda a um adulto', 1, 'Ótimo! Um adulto sabe como ajudar.', 2),
(1, 'Você vê um gatinho que parece assustado', 'Tentar pegar', 0, 'Não é uma boa ideia. Animais assustados podem se machucar ou machucar você.', 3),

-- Lição 3: Animal Dormindo
(3, 'Você vê seu cachorro dormindo', 'Deixar dormir', 1, 'Perfeito! Animais precisam descansar.', 1),
(3, 'Você vê seu cachorro dormindo', 'Acordar para brincar', 0, 'Não é legal acordar quem está dormindo.', 2),
(3, 'Você vê seu cachorro dormindo', 'Fazer carinho bem devagar', 1, 'Pode ser, mas é melhor esperar ele acordar.', 3);
