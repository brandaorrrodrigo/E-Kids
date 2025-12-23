-- EXPANSÃO DE BADGES E MISSÕES
-- 15 novos badges (5 por módulo) e 15 novas missões (5 por módulo)

-- ============================================
-- NOVOS BADGES DE EDUCAÇÃO FINANCEIRA
-- ============================================

INSERT OR IGNORE INTO financial_badges (name, description, icon, criteria_type, criteria_value, reward_fp, display_order) VALUES
('Mestre da Poupança', 'Guardou FP em 30 dias diferentes!', '👑', 'save_days', 30, 100, 6),
('Cofrinho Cheio', 'Acumulou 1000 FP no cofrinho!', '🏆', 'total_saved', 1000, 150, 7),
('Disciplina Financeira', 'Guardou pelo menos 50% em 10 meses', '🎯', 'save_percentage_months', 10, 200, 8),
('Investidor Mirim', 'Completou 5 metas de poupança!', '💎', 'goals_completed', 5, 150, 9),
('Sabedoria Financeira', 'Completou todas as missões financeiras!', '🦉', 'missions_completed', 5, 250, 10);

-- ============================================
-- NOVOS BADGES DE NATUREZA
-- ============================================

INSERT OR IGNORE INTO nature_badges (name, description, icon, criteria_type, criteria_value, reward_fp, display_order) VALUES
('Guardião da Natureza', 'Completou 50 lições sobre natureza!', '🛡️', 'lessons_completed', 50, 150, 6),
('Amigo dos Animais', 'Completou todas as lições sobre animais!', '🐾', 'category_completed', 2, 100, 7),
('Jardineiro Expert', 'Completou todas as lições sobre plantas!', '🌺', 'category_completed', 1, 100, 8),
('Eco Guerreiro', 'Completou todas as missões de meio ambiente!', '♻️', 'missions_completed', 5, 200, 9),
('Sábio da Natureza', 'Acertou 100 escolhas sobre natureza!', '🌟', 'correct_choices', 100, 250, 10);

-- ============================================
-- NOVOS BADGES DE HIGIENE
-- ============================================

INSERT OR IGNORE INTO hygiene_badges (name, description, icon, criteria_type, criteria_value, reward_fp, display_order) VALUES
('Campeão da Higiene', 'Completou hábitos por 100 dias!', '🏅', 'total_habits', 100, 150, 6),
('Sequência de Ouro', 'Manteve sequência de 30 dias!', '⭐', 'streak_days', 30, 200, 7),
('Mestre dos Dentes', 'Escovou os dentes 60 vezes!', '🦷', 'habit_specific', 60, 100, 8),
('Super Limpo', 'Completou todos os tipos de hábitos!', '✨', 'all_categories', 5, 150, 9),
('Hábitos Perfeitos', 'Completou todas as missões de higiene!', '💫', 'missions_completed', 5, 250, 10);

-- ============================================
-- NOVAS MISSÕES DE EDUCAÇÃO FINANCEIRA
-- ============================================

INSERT OR IGNORE INTO financial_missions (title, description, mission_type, target_value, fp_reward, duration_days, display_order) VALUES
('Poupador Consistente', 'Guardar FP por 7 dias seguidos', 'save_streak', 7, 100, 7, 6),
('Meta Ambiciosa', 'Guardar 500 FP em um único cofrinho', 'save_amount', 500, 150, 30, 7),
('Decisões Sábias', 'Tomar 20 decisões de poupar', 'save_decisions', 20, 120, 30, 8),
('Três Cofrinhos', 'Criar e manter 3 cofrinhos ativos', 'piggy_banks', 3, 100, 30, 9),
('Planejador Financeiro', 'Completar 3 metas de médio prazo', 'goals_completed', 3, 200, 90, 10);

-- ============================================
-- NOVAS MISSÕES DE NATUREZA
-- ============================================

INSERT OR IGNORE INTO nature_missions (title, description, mission_type, target_value, fp_reward, duration_days, display_order) VALUES
('Explorador da Natureza', 'Completar 15 lições sobre natureza', 'lessons_completed', 15, 100, 30, 6),
('Acertos Perfeitos', 'Acertar 20 escolhas seguidas', 'correct_streak', 20, 150, 30, 7),
('Estudante Dedicado', 'Fazer 1 lição por dia durante 10 dias', 'daily_lessons', 10, 120, 10, 8),
('Mestre da Biodiversidade', 'Completar lições de todas as 4 categorias', 'all_categories', 4, 100, 30, 9),
('Protetor Ambiental', 'Completar todas as lições de meio ambiente', 'category_master', 3, 200, 60, 10);

-- ============================================
-- NOVAS MISSÕES DE HIGIENE
-- ============================================

INSERT OR IGNORE INTO hygiene_missions (title, description, mission_type, target_value, fp_reward, duration_days, display_order) VALUES
('Rotina Perfeita', 'Completar hábitos por 14 dias seguidos', 'streak_days', 14, 120, 14, 6),
('Variedade Saudável', 'Completar 5 hábitos diferentes em um dia', 'variety_day', 5, 80, 1, 7),
('Cuidado Total', 'Completar 50 hábitos no total', 'total_habits', 50, 150, 30, 8),
('Manhã Perfeita', 'Escovar dentes ao acordar por 10 dias', 'specific_habit', 10, 100, 10, 9),
('Campeão da Saúde', 'Completar pelo menos 3 hábitos por dia durante 20 dias', 'daily_minimum', 20, 200, 20, 10);

-- ============================================
-- DESAFIOS ESPECIAIS COMBINADOS
-- ============================================

-- Missão financeira especial com tema ecológico
INSERT OR IGNORE INTO financial_missions (title, description, mission_type, target_value, fp_reward, duration_days, display_order) VALUES
('Cofrinho do Planeta', 'Guardar FP para comprar tema verde', 'save_for_theme', 500, 300, 60, 11);

-- Missão de natureza com recompensa extra
INSERT OR IGNORE INTO nature_missions (title, description, mission_type, target_value, fp_reward, duration_days, display_order) VALUES
('Amigo do Planeta', 'Completar 10 lições sobre reciclagem e economia', 'environmental_focus', 10, 250, 30, 11);

-- Missão de higiene com recompensa especial
INSERT OR IGNORE INTO hygiene_missions (title, description, mission_type, target_value, fp_reward, duration_days, display_order) VALUES
('Semana da Saúde', 'Completar todos os hábitos todos os dias durante 7 dias', 'perfect_week', 7, 300, 7, 11);

-- ============================================
-- BADGES ESPECIAIS DE CONQUISTA GERAL
-- ============================================

-- Badge especial para quem completou tudo em educação financeira
INSERT OR IGNORE INTO financial_badges (name, description, icon, criteria_type, criteria_value, reward_fp, display_order) VALUES
('Gênio Financeiro', 'Desbloqueou todos os outros badges financeiros!', '🌟', 'all_badges', 9, 500, 11);

-- Badge especial para quem completou tudo em natureza
INSERT OR IGNORE INTO nature_badges (name, description, icon, criteria_type, criteria_value, reward_fp, display_order) VALUES
('Guardião Supremo', 'Desbloqueou todos os outros badges de natureza!', '🌍', 'all_badges', 9, 500, 11);

-- Badge especial para quem completou tudo em higiene
INSERT OR IGNORE INTO hygiene_badges (name, description, icon, criteria_type, criteria_value, reward_fp, display_order) VALUES
('Mestre da Saúde', 'Desbloqueou todos os outros badges de higiene!', '💪', 'all_badges', 9, 500, 11);

-- ============================================
-- FIM DAS EXPANSÕES
-- ============================================

PRAGMA foreign_keys = ON;
