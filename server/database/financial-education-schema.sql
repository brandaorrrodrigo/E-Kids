-- =====================================================================
-- MÓDULO: EDUCAÇÃO FINANCEIRA E COFRINHO
-- =====================================================================

-- Extensão do Cofrinho com múltiplos cofrinhos
CREATE TABLE IF NOT EXISTS piggy_banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    goal_type VARCHAR(50) NOT NULL CHECK (goal_type IN ('short', 'medium', 'dream', 'planet')),
    target_fp INTEGER,
    current_fp INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Decisões de FP (guardar vs gastar)
CREATE TABLE IF NOT EXISTS fp_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    fp_amount INTEGER NOT NULL,
    decision VARCHAR(50) NOT NULL CHECK (decision IN ('save', 'spend', 'decide_later')),
    context VARCHAR(100) NOT NULL, -- 'earned_from_quiz', 'earned_from_mission', 'app_exit'
    source VARCHAR(100), -- origem do FP
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Extrato mensal
CREATE TABLE IF NOT EXISTS monthly_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    fp_earned INTEGER DEFAULT 0,
    fp_saved INTEGER DEFAULT 0,
    fp_spent INTEGER DEFAULT 0,
    final_balance INTEGER DEFAULT 0,
    savings_percentage DECIMAL(5,2) DEFAULT 0,
    statement_data JSONB, -- dados detalhados
    audio_url TEXT, -- URL para áudio narrado
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(child_id, month, year)
);

-- Badges financeiros
CREATE TABLE IF NOT EXISTS financial_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    badge_type VARCHAR(50) NOT NULL, -- 'beginner_saver', 'smart_planner', 'piggy_master'
    icon VARCHAR(100),
    criteria JSONB,
    reward_fp INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges financeiros conquistados
CREATE TABLE IF NOT EXISTS child_financial_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES financial_badges(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(child_id, badge_id)
);

-- Missões financeiras
CREATE TABLE IF NOT EXISTS financial_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_type VARCHAR(50) NOT NULL, -- 'save_fp_days', 'no_spend_today', 'reach_goal'
    name VARCHAR(200) NOT NULL,
    description TEXT,
    duration_days INTEGER,
    target_value INTEGER,
    reward_fp INTEGER NOT NULL,
    reward_badge_id UUID REFERENCES financial_badges(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progresso das missões financeiras
CREATE TABLE IF NOT EXISTS child_financial_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES financial_missions(id),
    current_progress INTEGER DEFAULT 0,
    target_progress INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Bônus por poupança (invisível)
CREATE TABLE IF NOT EXISTS savings_bonuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    bonus_type VARCHAR(50) NOT NULL, -- 'fp_extra', 'minigame_unlock'
    bonus_value INTEGER,
    reason TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_piggy_banks_child ON piggy_banks(child_id);
CREATE INDEX IF NOT EXISTS idx_fp_decisions_child ON fp_decisions(child_id);
CREATE INDEX IF NOT EXISTS idx_monthly_statements_child ON monthly_statements(child_id);
CREATE INDEX IF NOT EXISTS idx_child_financial_missions_child ON child_financial_missions(child_id);

-- Seed data - Badges financeiros
INSERT INTO financial_badges (name, description, badge_type, icon, criteria, reward_fp) VALUES
('Poupador Iniciante', 'Guardou FP pela primeira vez', 'beginner_saver', 'piggy_beginner.svg', '{"first_save": true}', 10),
('Planejador Esperto', 'Completou primeira meta de poupança', 'smart_planner', 'planner.svg', '{"goals_completed": 1}', 25),
('Mestre do Cofrinho', 'Poupou mais de 100 FP no total', 'piggy_master', 'piggy_master.svg', '{"total_saved": 100}', 50),
('Guardião do Futuro', 'Poupou por 7 dias seguidos', 'consistency', 'guardian.svg', '{"consecutive_saves": 7}', 30),
('Investidor Junior', 'Poupou mais do que gastou em um mês', 'monthly_saver', 'investor.svg', '{"monthly_savings_rate": 50}', 40);

-- Seed data - Missões financeiras
INSERT INTO financial_missions (mission_type, name, description, duration_days, target_value, reward_fp) VALUES
('save_fp_days', 'Guardião de 3 Dias', 'Guarde FP no cofrinho por 3 dias seguidos', 3, 3, 15),
('no_spend_today', 'Dia sem Gastar', 'Não gaste FP hoje', 1, 1, 10),
('reach_goal', 'Primeira Meta', 'Complete sua primeira meta do cofrinho', NULL, 1, 20),
('save_fp_days', 'Guardião Semanal', 'Guarde FP por 7 dias seguidos', 7, 7, 50),
('save_percentage', 'Poupador Esperto', 'Poupe pelo menos 50% dos FP que ganhar hoje', 1, 50, 25);
