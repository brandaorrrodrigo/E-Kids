-- ================================================
-- DIA 5: SISTEMA DE RECOMPENSAS REAIS
-- ================================================
-- Sistema onde pais criam recompensas personalizadas
-- e crianças resgatam com FP (Fun Points)
-- ================================================

-- TABELA: family_rewards
-- Catálogo de recompensas criadas pelos pais
CREATE TABLE IF NOT EXISTS family_rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  family_id INTEGER NOT NULL,
  created_by_parent_id INTEGER NOT NULL,

  -- Dados da recompensa
  reward_name TEXT NOT NULL,
  description TEXT,
  fp_cost INTEGER NOT NULL CHECK(fp_cost > 0),
  icon TEXT DEFAULT '🎁',

  -- Controle
  is_active INTEGER DEFAULT 1,
  stock INTEGER DEFAULT NULL, -- NULL = ilimitado, >0 = quantidade limitada
  age_restriction TEXT DEFAULT NULL, -- Ex: "6-10", "10+"

  -- Metadados
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
);

-- TABELA: reward_redemptions
-- Histórico de resgates de recompensas
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  reward_id INTEGER NOT NULL,

  -- Valor gasto
  fp_spent INTEGER NOT NULL,

  -- Status do resgate
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'completed')),

  -- Aprovação/Rejeição
  reviewed_by_parent_id INTEGER DEFAULT NULL,
  reviewed_at DATETIME DEFAULT NULL,
  rejection_reason TEXT DEFAULT NULL,

  -- Quando foi completada (pai entregou a recompensa)
  completed_at DATETIME DEFAULT NULL,

  -- Observações
  child_note TEXT DEFAULT NULL, -- Criança pode deixar um recado
  parent_note TEXT DEFAULT NULL, -- Pai pode deixar feedback

  -- Metadados
  redeemed_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (reward_id) REFERENCES family_rewards(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by_parent_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ================================================
-- ÍNDICES PARA PERFORMANCE
-- ================================================

CREATE INDEX IF NOT EXISTS idx_family_rewards_family
ON family_rewards(family_id, is_active);

CREATE INDEX IF NOT EXISTS idx_reward_redemptions_child
ON reward_redemptions(child_id, status);

CREATE INDEX IF NOT EXISTS idx_reward_redemptions_status
ON reward_redemptions(status, redeemed_at);

-- ================================================
-- RECOMPENSAS EXEMPLO (SEEDS)
-- ================================================
-- Algumas recompensas pré-criadas como exemplo
-- (assumindo family_id = 1 e parent_id = 1)

INSERT OR IGNORE INTO family_rewards
(id, family_id, created_by_parent_id, reward_name, description, fp_cost, icon, stock)
VALUES
  -- Recompensas Digitais
  (1, 1, 1, '30min Extra de Tela', 'Mais 30 minutos de tablet/celular além do permitido', 50, '📱', NULL),
  (2, 1, 1, '1h de Videogame', '1 hora extra de videogame no fim de semana', 100, '🎮', NULL),
  (3, 1, 1, 'Escolher Filme da Noite', 'Você escolhe qual filme a família vai assistir', 75, '🎬', NULL),

  -- Recompensas de Comida
  (4, 1, 1, 'Sobremesa Especial', 'Escolha sua sobremesa favorita para depois do jantar', 60, '🍰', NULL),
  (5, 1, 1, 'Lanche Fora', 'Lanche na padaria/lanchonete favorita', 150, '🍔', NULL),
  (6, 1, 1, 'Sorvete no Shopping', 'Passeio no shopping + sorvete', 200, '🍦', NULL),
  (7, 1, 1, 'Pizza no Fim de Semana', 'Pizza da sua escolha no sábado ou domingo', 250, '🍕', NULL),

  -- Recompensas de Tempo/Atividades
  (8, 1, 1, 'Dormir 30min Mais Tarde', 'Pode dormir 30 minutos mais tarde (1 dia)', 80, '🌙', NULL),
  (9, 1, 1, 'Escolher Passeio', 'Você escolhe o passeio do fim de semana', 300, '🎡', NULL),
  (10, 1, 1, 'Amigo em Casa', 'Convidar um amigo para passar a tarde em casa', 200, '👫', NULL),
  (11, 1, 1, 'Dia Sem Tarefas', 'Um dia livre de tarefas domésticas', 400, '🏖️', NULL),

  -- Recompensas Materiais
  (12, 1, 1, 'Figurinha/Card Especial', '1 envelope de figurinha ou card do jogo favorito', 120, '🃏', NULL),
  (13, 1, 1, 'Brinquedo Pequeno', 'Brinquedo de até R$20', 500, '🧸', 2), -- Limitado
  (14, 1, 1, 'Livro Novo', 'Livro da sua escolha', 350, '📚', NULL),
  (15, 1, 1, 'Roupa/Acessório', 'Peça de roupa ou acessório (até R$50)', 600, '👕', 1), -- Limitado

  -- Recompensas Experiências
  (16, 1, 1, 'Acampamento na Sala', 'Acampar na sala com a família', 250, '⛺', NULL),
  (17, 1, 1, 'Cozinhar Junto', 'Fazer uma receita especial junto com os pais', 180, '👨‍🍳', NULL),
  (18, 1, 1, 'Pintura/Arte Livre', '1h de atividade artística sem regras', 150, '🎨', NULL),

  -- Mega Recompensas
  (19, 1, 1, 'Parque de Diversões', 'Dia no parque de diversões', 1000, '🎢', 1), -- Limitado
  (20, 1, 1, 'Brinquedo Grande', 'Brinquedo especial (até R$100)', 1500, '🎁', 1); -- Limitado

-- ================================================
-- TRIGGERS PARA GESTÃO AUTOMÁTICA
-- ================================================

-- Trigger: Atualizar updated_at ao modificar recompensa
CREATE TRIGGER IF NOT EXISTS update_family_rewards_timestamp
AFTER UPDATE ON family_rewards
FOR EACH ROW
BEGIN
  UPDATE family_rewards
  SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;

-- Trigger: Decrementar estoque ao aprovar resgate
CREATE TRIGGER IF NOT EXISTS decrement_reward_stock
AFTER UPDATE ON reward_redemptions
FOR EACH ROW
WHEN NEW.status = 'approved' AND OLD.status = 'pending'
BEGIN
  UPDATE family_rewards
  SET stock = CASE
    WHEN stock IS NOT NULL AND stock > 0 THEN stock - 1
    ELSE stock
  END
  WHERE id = NEW.reward_id;
END;

-- Trigger: Incrementar estoque se resgate for rejeitado
CREATE TRIGGER IF NOT EXISTS increment_reward_stock_on_rejection
AFTER UPDATE ON reward_redemptions
FOR EACH ROW
WHEN NEW.status = 'rejected' AND OLD.status = 'pending'
BEGIN
  UPDATE family_rewards
  SET stock = CASE
    WHEN stock IS NOT NULL THEN stock + 1
    ELSE stock
  END
  WHERE id = NEW.reward_id;
END;

-- ================================================
-- VIEWS ÚTEIS
-- ================================================

-- View: Recompensas disponíveis com informações completas
CREATE VIEW IF NOT EXISTS v_available_rewards AS
SELECT
  r.id,
  r.family_id,
  r.reward_name,
  r.description,
  r.fp_cost,
  r.icon,
  r.stock,
  r.age_restriction,
  r.created_at,
  CASE
    WHEN r.stock IS NULL THEN 1
    WHEN r.stock > 0 THEN 1
    ELSE 0
  END as is_in_stock,
  (SELECT COUNT(*) FROM reward_redemptions rd
   WHERE rd.reward_id = r.id AND rd.status = 'approved') as times_redeemed
FROM family_rewards r
WHERE r.is_active = 1;

-- View: Histórico de resgates com detalhes completos
CREATE VIEW IF NOT EXISTS v_redemption_history AS
SELECT
  rd.id,
  rd.child_id,
  c.name as child_name,
  rd.reward_id,
  r.reward_name,
  r.icon,
  rd.fp_spent,
  rd.status,
  rd.child_note,
  rd.parent_note,
  rd.rejection_reason,
  rd.redeemed_at,
  rd.reviewed_at,
  rd.completed_at,
  u.username as reviewed_by
FROM reward_redemptions rd
JOIN children c ON rd.child_id = c.id
JOIN family_rewards r ON rd.reward_id = r.id
LEFT JOIN users u ON rd.reviewed_by_parent_id = u.id;

-- ================================================
-- ESTATÍSTICAS ÚTEIS
-- ================================================

-- View: Estatísticas por criança
CREATE VIEW IF NOT EXISTS v_child_reward_stats AS
SELECT
  c.id as child_id,
  c.name as child_name,
  COUNT(CASE WHEN rd.status = 'pending' THEN 1 END) as pending_redemptions,
  COUNT(CASE WHEN rd.status = 'approved' THEN 1 END) as approved_redemptions,
  COUNT(CASE WHEN rd.status = 'rejected' THEN 1 END) as rejected_redemptions,
  COUNT(CASE WHEN rd.status = 'completed' THEN 1 END) as completed_redemptions,
  COALESCE(SUM(CASE WHEN rd.status IN ('approved', 'completed') THEN rd.fp_spent ELSE 0 END), 0) as total_fp_spent,
  COALESCE(
    (SELECT r.reward_name
     FROM reward_redemptions rd2
     JOIN family_rewards r ON rd2.reward_id = r.id
     WHERE rd2.child_id = c.id
     GROUP BY rd2.reward_id
     ORDER BY COUNT(*) DESC
     LIMIT 1),
    'Nenhuma'
  ) as favorite_reward
FROM children c
LEFT JOIN reward_redemptions rd ON c.id = rd.child_id
GROUP BY c.id, c.name;

-- ================================================
-- MIGRATION COMPLETA DIA 5! ✅
-- ================================================
-- Tabelas: family_rewards, reward_redemptions
-- Views: v_available_rewards, v_redemption_history, v_child_reward_stats
-- Triggers: Gestão automática de estoque e timestamps
-- Seeds: 20 recompensas exemplo
-- ================================================
