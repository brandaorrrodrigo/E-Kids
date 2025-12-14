-- ========================================
-- MIGRATION: Sistema de Progressão e Níveis
-- Data: 2025-12-14
-- Descrição: Adiciona sistema de dificuldade progressiva adaptativa
-- ========================================

-- Tabela de progressão por jogo e criança
CREATE TABLE IF NOT EXISTS game_progression (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  game_key TEXT NOT NULL,
  nivel_atual INTEGER DEFAULT 1 CHECK(nivel_atual >= 1 AND nivel_atual <= 10),
  xp_total INTEGER DEFAULT 0 CHECK(xp_total >= 0),
  partidas_jogadas INTEGER DEFAULT 0 CHECK(partidas_jogadas >= 0),
  vitorias INTEGER DEFAULT 0 CHECK(vitorias >= 0),
  melhor_score INTEGER DEFAULT 0 CHECK(melhor_score >= 0),
  melhor_tempo INTEGER DEFAULT NULL,
  ultima_jogada DATETIME,
  nivel_up_count INTEGER DEFAULT 0 CHECK(nivel_up_count >= 0),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  UNIQUE(child_id, game_key)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_game_progression_child
ON game_progression(child_id);

CREATE INDEX IF NOT EXISTS idx_game_progression_game
ON game_progression(game_key);

CREATE INDEX IF NOT EXISTS idx_game_progression_nivel
ON game_progression(nivel_atual);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER IF NOT EXISTS update_game_progression_timestamp
AFTER UPDATE ON game_progression
FOR EACH ROW
BEGIN
  UPDATE game_progression
  SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;

-- Tabela de histórico de level ups (analytics e dashboard dos pais)
CREATE TABLE IF NOT EXISTS level_up_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  game_key TEXT NOT NULL,
  nivel_anterior INTEGER NOT NULL,
  nivel_novo INTEGER NOT NULL,
  xp_no_levelup INTEGER NOT NULL,
  fp_bonus INTEGER DEFAULT 0,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Índice para histórico
CREATE INDEX IF NOT EXISTS idx_level_up_history_child
ON level_up_history(child_id);

CREATE INDEX IF NOT EXISTS idx_level_up_history_date
ON level_up_history(DATE(timestamp));

-- Badges de progressão
INSERT OR IGNORE INTO badge_catalog (badge_key, name, description, icon, reward_fp, category, rarity)
VALUES
  ('primeira_evolucao', 'Primeira Evolução', 'Subiu de nível pela primeira vez!', '🌱', 20, 'progressao', 'comum'),
  ('nivel_5_qualquer', 'Evoluindo', 'Chegou ao nível 5 em qualquer jogo', '📈', 50, 'progressao', 'raro'),
  ('nivel_10_qualquer', 'Mestre', 'Alcançou nível 10 (MÁXIMO) em um jogo!', '🏆', 100, 'progressao', 'epico'),
  ('nivel_5_todos', 'Multi-talento', 'Nível 5+ em todos os mini-games', '⭐', 150, 'progressao', 'lendario'),
  ('rapida_evolucao', 'Evolução Rápida', 'Subiu 3 níveis em um único dia', '⚡', 75, 'progressao', 'epico'),
  ('nivel_7_primeiro', 'Avançado', 'Primeiro jogo no nível 7 (Avançado)', '🎯', 60, 'progressao', 'raro'),
  ('nivelamento_completo', 'Completista', 'Chegou ao nível máximo em todos os jogos', '👑', 500, 'progressao', 'lendario');

-- View para estatísticas de progressão
CREATE VIEW IF NOT EXISTS v_child_progression_stats AS
SELECT
  c.id as child_id,
  c.name as child_name,
  COUNT(DISTINCT gp.game_key) as jogos_jogados,
  AVG(gp.nivel_atual) as nivel_medio,
  MAX(gp.nivel_atual) as nivel_maximo,
  SUM(gp.xp_total) as xp_total_geral,
  SUM(gp.partidas_jogadas) as partidas_total,
  SUM(gp.vitorias) as vitorias_total,
  SUM(gp.nivel_up_count) as total_level_ups,
  MAX(gp.ultima_jogada) as ultima_atividade
FROM children c
LEFT JOIN game_progression gp ON c.id = gp.child_id
GROUP BY c.id, c.name;

-- View para ranking de jogadores (gamificação)
CREATE VIEW IF NOT EXISTS v_progression_leaderboard AS
SELECT
  c.id,
  c.name,
  SUM(gp.xp_total) as xp_total,
  AVG(gp.nivel_atual) as nivel_medio,
  COUNT(CASE WHEN gp.nivel_atual >= 10 THEN 1 END) as jogos_mestres,
  RANK() OVER (ORDER BY SUM(gp.xp_total) DESC) as ranking
FROM children c
INNER JOIN game_progression gp ON c.id = gp.child_id
GROUP BY c.id, c.name;

-- Comentários para documentação
-- Esta migration adiciona:
-- 1. Tabela game_progression: Rastreia nível, XP e estatísticas por jogo
-- 2. Tabela level_up_history: Histórico de todas as evoluções de nível
-- 3. Badges de progressão: Conquistas relacionadas a níveis
-- 4. Views de analytics: Estatísticas e rankings
-- 5. Triggers: Atualização automática de timestamps
