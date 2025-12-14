-- ============================================
-- E-KIDS PRO - MIGRATION DIA 2: EVENTOS E DESAFIOS TEMPORÁRIOS
-- ============================================

-- Tabela de Eventos
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  reward_multiplier REAL DEFAULT 1.5,
  badge_reward TEXT,
  is_active INTEGER DEFAULT 1,
  event_type TEXT DEFAULT 'general',
  area TEXT,
  min_age INTEGER,
  max_age INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de Desafios de Eventos
CREATE TABLE IF NOT EXISTS event_challenges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  challenge_type TEXT NOT NULL,
  challenge_goal INTEGER NOT NULL,
  challenge_description TEXT,
  reward_fp INTEGER DEFAULT 50,
  reward_badge TEXT,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Tabela de Progresso em Eventos
CREATE TABLE IF NOT EXISTS child_event_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  challenge_id INTEGER,
  progress INTEGER DEFAULT 0,
  completed INTEGER DEFAULT 0,
  completed_at TEXT,
  fp_earned INTEGER DEFAULT 0,
  badges_earned TEXT,
  UNIQUE(child_id, event_id, challenge_id),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (challenge_id) REFERENCES event_challenges(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_date, end_date, is_active);
CREATE INDEX IF NOT EXISTS idx_event_challenges_event ON event_challenges(event_id);
CREATE INDEX IF NOT EXISTS idx_child_event_progress_child ON child_event_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_child_event_progress_event ON child_event_progress(event_id);

-- ============================================
-- SEED: EVENTOS TEMÁTICOS
-- ============================================

-- Evento 1: Mês da Bondade
INSERT INTO events (id, name, description, start_date, end_date, reward_multiplier, badge_reward, event_type, area, is_active)
VALUES (
  1,
  'Mês da Bondade',
  'Durante todo este mês, espalhe bondade e ganhe recompensas especiais!',
  date('now'),
  date('now', '+30 days'),
  2.0,
  'bondade_2025',
  'monthly',
  'emotions',
  1
);

-- Desafios do Mês da Bondade
INSERT INTO event_challenges (event_id, challenge_type, challenge_goal, challenge_description, reward_fp, reward_badge)
VALUES
(1, 'missions_completed', 10, 'Complete 10 missões de emoções', 100, 'bondade_explorador'),
(1, 'consecutive_days', 7, 'Faça check-in por 7 dias seguidos', 150, 'bondade_dedicado'),
(1, 'help_others', 5, 'Ajude outra pessoa 5 vezes', 200, 'bondade_heroi');

-- Evento 2: Desafio Movimento
INSERT INTO events (id, name, description, start_date, end_date, reward_multiplier, badge_reward, event_type, area, is_active)
VALUES (
  2,
  'Desafio Movimento',
  'Duas semanas de atividade física e diversão!',
  date('now', '+2 days'),
  date('now', '+16 days'),
  1.75,
  'movimento_2025',
  'challenge',
  'body',
  1
);

-- Desafios do Movimento
INSERT INTO event_challenges (event_id, challenge_type, challenge_goal, challenge_description, reward_fp, reward_badge)
VALUES
(2, 'missions_completed', 10, 'Complete 10 missões de corpo', 75, 'corpo_ativo'),
(2, 'daily_activity', 14, 'Registre atividade física por 14 dias', 120, 'movimento_campeao');

-- Evento 3: Semana da Segurança
INSERT INTO events (id, name, description, start_date, end_date, reward_multiplier, badge_reward, event_type, area, is_active)
VALUES (
  3,
  'Semana da Segurança',
  'Aprenda a se proteger brincando!',
  date('now', '+7 days'),
  date('now', '+14 days'),
  2.5,
  'seguranca_2025',
  'weekly',
  'safety',
  1
);

-- Desafios da Segurança
INSERT INTO event_challenges (event_id, challenge_type, challenge_goal, challenge_description, reward_fp, reward_badge)
VALUES
(3, 'missions_completed', 7, 'Complete 7 missões de segurança', 100, 'protetor_junior'),
(3, 'perfect_score', 5, 'Acerte todas as opções em 5 missões', 150, 'expert_seguranca');

-- Evento 4: Festival da Criatividade
INSERT INTO events (id, name, description, start_date, end_date, reward_multiplier, badge_reward, event_type, area, is_active)
VALUES (
  4,
  'Festival da Criatividade',
  'Solte sua imaginação e crie coisas incríveis!',
  date('now', '+14 days'),
  date('now', '+28 days'),
  2.0,
  'criativo_2025',
  'festival',
  'creativity',
  1
);

-- Desafios da Criatividade
INSERT INTO event_challenges (event_id, challenge_type, challenge_goal, challenge_description, reward_fp, reward_badge)
VALUES
(4, 'missions_completed', 8, 'Complete 8 missões de criatividade', 90, 'artista_iniciante'),
(4, 'diverse_activities', 5, 'Faça 5 tipos diferentes de atividades', 120, 'criador_versatil');

-- Evento 5: Halloween Seguro
INSERT INTO events (id, name, description, start_date, end_date, reward_multiplier, badge_reward, event_type, area, is_active)
VALUES (
  5,
  'Halloween Seguro 🎃',
  'Aprenda segurança de forma divertida neste Halloween!',
  '2025-10-25',
  '2025-10-31',
  3.0,
  'halloween_2025',
  'seasonal',
  'safety',
  0
);

-- Desafios Halloween
INSERT INTO event_challenges (event_id, challenge_type, challenge_goal, challenge_description, reward_fp, reward_badge)
VALUES
(5, 'missions_completed', 5, 'Complete 5 missões temáticas de Halloween', 150, 'bruxinho_seguro'),
(5, 'safety_quiz', 1, 'Passe no quiz de segurança de Halloween', 100, 'expert_halloween');

-- ============================================
-- SEED: EVENTOS SAZONAIS (Inativos até a data)
-- ============================================

-- Natal Mágico
INSERT INTO events (name, description, start_date, end_date, reward_multiplier, badge_reward, event_type, area, is_active)
VALUES (
  'Natal Mágico 🎄',
  'Celebre o Natal aprendendo sobre generosidade e gratidão!',
  '2025-12-15',
  '2025-12-25',
  2.5,
  'natal_2025',
  'seasonal',
  'emotions',
  0
);

-- Ano Novo, Novos Hábitos
INSERT INTO events (name, description, start_date, end_date, reward_multiplier, badge_reward, event_type, area, is_active)
VALUES (
  'Ano Novo, Novos Hábitos 🎊',
  'Comece o ano com metas e novos hábitos saudáveis!',
  '2026-01-01',
  '2026-01-15',
  2.0,
  'ano_novo_2026',
  'seasonal',
  'body',
  0
);

-- Volta às Aulas
INSERT INTO events (name, description, start_date, end_date, reward_multiplier, badge_reward, event_type, area, is_active)
VALUES (
  'Volta às Aulas 📚',
  'Prepare-se para o ano escolar com organização e foco!',
  '2026-02-01',
  '2026-02-15',
  1.5,
  'volta_aulas_2026',
  'seasonal',
  'creativity',
  0
);

-- ============================================
-- FIM DA MIGRATION DIA 2
-- ============================================
