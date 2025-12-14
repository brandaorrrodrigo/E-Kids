-- ================================================
-- DIA 6: MINI-GAMES E INTERATIVIDADE
-- ================================================
-- 4 mini-games educativos:
-- 1. Jogo da Memória (exercita memória visual)
-- 2. Quiz Rápido (conhecimentos gerais)
-- 3. Caça ao Tesouro (exploração do app)
-- 4. Diário Diário (reflexão e escrita)
-- ================================================

-- TABELA: minigames_catalog
-- Catálogo dos mini-games disponíveis
CREATE TABLE IF NOT EXISTS minigames_catalog (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_key TEXT UNIQUE NOT NULL,
  game_name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🎮',

  -- Recompensas
  fp_reward_min INTEGER DEFAULT 5,
  fp_reward_max INTEGER DEFAULT 20,

  -- Configurações
  difficulty_levels TEXT DEFAULT 'facil,medio,dificil', -- CSV
  plays_per_day INTEGER DEFAULT NULL, -- NULL = ilimitado

  -- Metadados
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABELA: minigame_plays
-- Histórico de todas as jogadas
CREATE TABLE IF NOT EXISTS minigame_plays (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  game_key TEXT NOT NULL,

  -- Dados da jogada
  difficulty TEXT DEFAULT 'facil',
  score INTEGER DEFAULT 0,
  time_seconds INTEGER DEFAULT 0, -- tempo levado
  completed INTEGER DEFAULT 0, -- 0 = não completou, 1 = completou

  -- Recompensa
  fp_earned INTEGER DEFAULT 0,

  -- Dados específicos do jogo (JSON)
  game_data TEXT DEFAULT NULL, -- JSON com dados específicos

  -- Metadados
  played_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (game_key) REFERENCES minigames_catalog(game_key) ON DELETE CASCADE
);

-- TABELA: minigame_achievements
-- Conquistas especiais de mini-games
CREATE TABLE IF NOT EXISTS minigame_achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  achievement_key TEXT UNIQUE NOT NULL,
  game_key TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🏆',

  -- Condição de desbloqueio
  unlock_condition TEXT NOT NULL, -- Ex: "10_plays", "perfect_score", "speed_demon"
  fp_reward INTEGER DEFAULT 50,

  -- Metadados
  is_secret INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (game_key) REFERENCES minigames_catalog(game_key) ON DELETE CASCADE
);

-- TABELA: child_minigame_achievements
-- Conquistas desbloqueadas por criança
CREATE TABLE IF NOT EXISTS child_minigame_achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  achievement_key TEXT NOT NULL,
  unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(child_id, achievement_key),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_key) REFERENCES minigame_achievements(achievement_key) ON DELETE CASCADE
);

-- ================================================
-- ÍNDICES PARA PERFORMANCE
-- ================================================

CREATE INDEX IF NOT EXISTS idx_minigame_plays_child
ON minigame_plays(child_id, game_key, played_at DESC);

CREATE INDEX IF NOT EXISTS idx_minigame_plays_game
ON minigame_plays(game_key, completed, score DESC);

CREATE INDEX IF NOT EXISTS idx_child_minigame_achievements
ON child_minigame_achievements(child_id, achievement_key);

-- ================================================
-- SEEDS: 4 MINI-GAMES
-- ================================================

INSERT OR IGNORE INTO minigames_catalog
(id, game_key, game_name, description, icon, fp_reward_min, fp_reward_max, difficulty_levels, plays_per_day)
VALUES
  (1, 'memoria', 'Jogo da Memória', 'Encontre os pares de cartas! Exercita memória visual e concentração.', '🧠', 5, 15, 'facil,medio,dificil', NULL),
  (2, 'quiz', 'Quiz Rápido', 'Responda perguntas de conhecimentos gerais! Aprenda brincando.', '❓', 10, 25, 'facil,medio,dificil', 5),
  (3, 'cacaotesouro', 'Caça ao Tesouro', 'Explore o app e encontre tesouros escondidos!', '🗺️', 15, 30, 'facil,medio,dificil', 3),
  (4, 'diario', 'Diário Diário', 'Escreva sobre seu dia! Reflexão, escrita e autoconhecimento.', '📔', 20, 20, 'livre', 1);

-- ================================================
-- SEEDS: CONQUISTAS DOS MINI-GAMES
-- ================================================

-- Conquistas do Jogo da Memória
INSERT OR IGNORE INTO minigame_achievements
(achievement_key, game_key, achievement_name, description, icon, unlock_condition, fp_reward, is_secret)
VALUES
  ('memoria_primeiro', 'memoria', 'Primeira Memória', 'Complete seu primeiro jogo da memória', '🧠', 'first_play', 30, 0),
  ('memoria_10jogos', 'memoria', 'Memória de Elefante', 'Jogue 10 vezes', '🐘', '10_plays', 50, 0),
  ('memoria_perfeito', 'memoria', 'Memória Perfeita', 'Complete sem errar nenhuma vez', '💎', 'perfect_score', 100, 0),
  ('memoria_rapido', 'memoria', 'Relâmpago', 'Complete em menos de 30 segundos (difícil)', '⚡', 'speed_30s', 150, 1);

-- Conquistas do Quiz
INSERT OR IGNORE INTO minigame_achievements
(achievement_key, game_key, achievement_name, description, icon, unlock_condition, fp_reward, is_secret)
VALUES
  ('quiz_primeiro', 'quiz', 'Primeira Pergunta', 'Responda seu primeiro quiz', '❓', 'first_play', 30, 0),
  ('quiz_sabio', 'quiz', 'Pequeno Sábio', 'Acerte 10 quizzes seguidos', '🧙', '10_perfect', 100, 0),
  ('quiz_genio', 'quiz', 'Gênio Mirim', 'Acerte 50 perguntas no total', '🎓', '50_correct', 200, 0),
  ('quiz_velocidade', 'quiz', 'Resposta Instantânea', 'Responda em menos de 5 segundos', '🚀', 'speed_5s', 80, 1);

-- Conquistas do Caça ao Tesouro
INSERT OR IGNORE INTO minigame_achievements
(achievement_key, game_key, achievement_name, description, icon, unlock_condition, fp_reward, is_secret)
VALUES
  ('tesouro_primeiro', 'cacaotesouro', 'Primeiro Tesouro', 'Encontre seu primeiro tesouro', '🗺️', 'first_play', 30, 0),
  ('tesouro_explorador', 'cacaotesouro', 'Explorador', 'Complete 5 caças ao tesouro', '🧭', '5_plays', 80, 0),
  ('tesouro_mestre', 'cacaotesouro', 'Mestre Explorador', 'Encontre todos os tesouros em uma caçada', '👑', 'all_treasures', 150, 0),
  ('tesouro_secreto', 'cacaotesouro', 'Tesouro Secreto', 'Encontre o tesouro escondido especial', '💰', 'secret_treasure', 300, 1);

-- Conquistas do Diário
INSERT OR IGNORE INTO minigame_achievements
(achievement_key, game_key, achievement_name, description, icon, unlock_condition, fp_reward, is_secret)
VALUES
  ('diario_primeiro', 'diario', 'Primeiro Dia', 'Escreva seu primeiro diário', '📔', 'first_play', 30, 0),
  ('diario_7dias', 'diario', 'Semana Completa', 'Escreva por 7 dias seguidos', '📅', '7_streak', 100, 0),
  ('diario_30dias', 'diario', 'Mestre do Diário', 'Escreva por 30 dias seguidos', '✍️', '30_streak', 500, 0),
  ('diario_reflexivo', 'diario', 'Reflexivo', 'Escreva uma entrada com mais de 100 palavras', '💭', 'long_entry', 80, 0);

-- ================================================
-- VIEWS ÚTEIS
-- ================================================

-- View: Estatísticas de mini-games por criança
CREATE VIEW IF NOT EXISTS v_child_minigame_stats AS
SELECT
  c.id as child_id,
  c.name as child_name,
  mp.game_key,
  mg.game_name,
  mg.icon,
  COUNT(*) as total_plays,
  SUM(mp.completed) as completed_plays,
  MAX(mp.score) as high_score,
  MIN(mp.time_seconds) as best_time,
  SUM(mp.fp_earned) as total_fp_earned,
  ROUND(AVG(mp.score), 2) as avg_score,
  (SELECT COUNT(*)
   FROM child_minigame_achievements cma
   JOIN minigame_achievements ma ON cma.achievement_key = ma.achievement_key
   WHERE cma.child_id = c.id AND ma.game_key = mp.game_key) as achievements_unlocked
FROM children c
JOIN minigame_plays mp ON c.id = mp.child_id
JOIN minigames_catalog mg ON mp.game_key = mg.game_key
GROUP BY c.id, mp.game_key;

-- View: Ranking global por mini-game
CREATE VIEW IF NOT EXISTS v_minigame_leaderboard AS
SELECT
  mp.game_key,
  mg.game_name,
  c.id as child_id,
  c.name as child_name,
  c.avatar,
  MAX(mp.score) as high_score,
  MIN(mp.time_seconds) as best_time,
  COUNT(*) as total_plays,
  ROW_NUMBER() OVER (PARTITION BY mp.game_key ORDER BY MAX(mp.score) DESC, MIN(mp.time_seconds) ASC) as rank
FROM minigame_plays mp
JOIN children c ON mp.child_id = c.id
JOIN minigames_catalog mg ON mp.game_key = mg.game_key
WHERE mp.completed = 1
GROUP BY mp.game_key, c.id;

-- View: Jogadas de hoje
CREATE VIEW IF NOT EXISTS v_today_minigame_plays AS
SELECT
  c.id as child_id,
  c.name as child_name,
  mp.game_key,
  mg.game_name,
  COUNT(*) as plays_today
FROM children c
JOIN minigame_plays mp ON c.id = mp.child_id
JOIN minigames_catalog mg ON mp.game_key = mg.game_key
WHERE DATE(mp.played_at) = DATE('now')
GROUP BY c.id, mp.game_key;

-- ================================================
-- TRIGGERS AUTOMÁTICOS
-- ================================================

-- Trigger: Atualizar FP da criança ao jogar
CREATE TRIGGER IF NOT EXISTS update_child_fp_on_minigame
AFTER INSERT ON minigame_plays
FOR EACH ROW
WHEN NEW.fp_earned > 0
BEGIN
  UPDATE children
  SET fp_balance = fp_balance + NEW.fp_earned
  WHERE id = NEW.child_id;
END;

-- Trigger: Atualizar FP ao desbloquear conquista
CREATE TRIGGER IF NOT EXISTS update_child_fp_on_achievement
AFTER INSERT ON child_minigame_achievements
FOR EACH ROW
BEGIN
  UPDATE children
  SET fp_balance = fp_balance + (
    SELECT fp_reward
    FROM minigame_achievements
    WHERE achievement_key = NEW.achievement_key
  )
  WHERE id = NEW.child_id;
END;

-- ================================================
-- FUNÇÕES AUXILIARES (Stored as Comments)
-- ================================================

-- Calcular FP ganho baseado em performance:
-- Score alto + Tempo baixo = Mais FP
-- Formula: fp_reward_min + ((score/100) * (fp_reward_max - fp_reward_min))

-- Dificuldades:
-- facil: 8 pares de cartas, 10 perguntas fáceis
-- medio: 12 pares de cartas, 15 perguntas médias
-- dificil: 16 pares de cartas, 20 perguntas difíceis

-- Limites por dia:
-- memoria: ilimitado (quanto mais praticar, melhor)
-- quiz: 5 jogos/dia (não cansar)
-- cacaotesouro: 3 jogos/dia (manter especial)
-- diario: 1 entrada/dia (reflexão diária)

-- ================================================
-- DADOS EXEMPLO: TEMAS PARA OS JOGOS
-- ================================================

-- Para implementação no frontend:

-- JOGO DA MEMÓRIA - Temas:
-- 1. Animais (🐶🐱🐭🐹🐰🦊🐻🐼)
-- 2. Frutas (🍎🍊🍋🍌🍉🍇🍓🫐)
-- 3. Emoções (😀😢😠😱🤔😴🥳😎)
-- 4. Números (1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣)

-- QUIZ - Categorias:
-- 1. Matemática básica (2+2=?, 5x3=?)
-- 2. Ciências (O que as plantas precisam? Sol, água, ar)
-- 3. Português (Qual palavra está certa?)
-- 4. Conhecimentos gerais (Qual a cor do céu?)

-- CAÇA AO TESOURO - Locais:
-- 1. Dashboard (encontre o mascote feliz)
-- 2. Missões (encontre a missão de criatividade)
-- 3. Badges (encontre o badge de ouro)
-- 4. Recompensas (encontre a recompensa mais cara)

-- DIÁRIO - Prompts diários:
-- 1. O que te deixou feliz hoje?
-- 2. Algo novo que você aprendeu?
-- 3. Por que você é grato hoje?
-- 4. Qual foi seu maior desafio?
-- 5. O que você quer fazer amanhã?

-- ================================================
-- MIGRATION COMPLETA DIA 6! ✅
-- ================================================
-- Tabelas: 4 (catalog, plays, achievements, child_achievements)
-- Views: 3 (stats, leaderboard, today_plays)
-- Triggers: 2 (FP on play, FP on achievement)
-- Seeds: 4 mini-games + 16 conquistas
-- ================================================
