// ================================================
// REWARDS MANAGER - DIA 5
// ================================================
// Sistema de Recompensas Reais onde:
// - Pais criam recompensas personalizadas
// - Crianças gastam FP para resgatar
// - Pais aprovam/rejeitam os resgates
// - Histórico completo de transações
// ================================================

/**
 * CRIAR NOVA RECOMPENSA (PAIS)
 * @param {Database} db - Instância do banco
 * @param {Object} rewardData - Dados da recompensa
 * @returns {Object} - Recompensa criada
 */
function createReward(db, rewardData) {
  const {
    familyId,
    parentId,
    rewardName,
    description = null,
    fpCost,
    icon = '🎁',
    stock = null,
    ageRestriction = null
  } = rewardData;

  // Validações
  if (!familyId || !parentId || !rewardName || !fpCost) {
    throw new Error('Dados obrigatórios: familyId, parentId, rewardName, fpCost');
  }

  if (fpCost <= 0) {
    throw new Error('FP cost deve ser maior que zero');
  }

  if (stock !== null && stock < 0) {
    throw new Error('Stock não pode ser negativo');
  }

  // Inserir recompensa
  const stmt = db.prepare(`
    INSERT INTO family_rewards
    (family_id, created_by_parent_id, reward_name, description, fp_cost, icon, stock, age_restriction)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    familyId,
    parentId,
    rewardName,
    description,
    fpCost,
    icon,
    stock,
    ageRestriction
  );

  // Retornar recompensa criada
  const newReward = db.prepare('SELECT * FROM family_rewards WHERE id = ?').get(result.lastInsertRowid);

  return {
    success: true,
    reward: newReward,
    message: `Recompensa "${rewardName}" criada com sucesso! Custa ${fpCost} FP.`
  };
}

/**
 * LISTAR RECOMPENSAS DISPONÍVEIS (CRIANÇAS)
 * @param {Database} db - Instância do banco
 * @param {Number} childId - ID da criança
 * @returns {Array} - Lista de recompensas disponíveis
 */
function listAvailableRewards(db, childId) {
  // Buscar family_id da criança
  const child = db.prepare('SELECT family_id, fp_balance FROM children WHERE id = ?').get(childId);

  if (!child) {
    throw new Error('Criança não encontrada');
  }

  // Buscar recompensas disponíveis
  const rewards = db.prepare(`
    SELECT
      r.*,
      CASE
        WHEN r.stock IS NULL THEN 1
        WHEN r.stock > 0 THEN 1
        ELSE 0
      END as is_in_stock,
      CASE
        WHEN r.fp_cost <= ? THEN 1
        ELSE 0
      END as can_afford,
      (SELECT COUNT(*) FROM reward_redemptions rd
       WHERE rd.reward_id = r.id AND rd.child_id = ? AND rd.status IN ('approved', 'completed')) as times_redeemed_by_me,
      (SELECT COUNT(*) FROM reward_redemptions rd
       WHERE rd.reward_id = r.id AND rd.status IN ('approved', 'completed')) as times_redeemed_total
    FROM family_rewards r
    WHERE r.family_id = ? AND r.is_active = 1
    ORDER BY r.fp_cost ASC
  `).all(child.fp_balance, childId, child.family_id);

  // Categorizar recompensas
  const categorized = {
    affordable: rewards.filter(r => r.can_afford && r.is_in_stock),
    outOfStock: rewards.filter(r => !r.is_in_stock),
    tooExpensive: rewards.filter(r => !r.can_afford && r.is_in_stock),
    all: rewards
  };

  return {
    success: true,
    childFpBalance: child.fp_balance,
    totalRewards: rewards.length,
    rewards: categorized,
    message: `${categorized.affordable.length} recompensas disponíveis para você!`
  };
}

/**
 * RESGATAR RECOMPENSA (CRIANÇA)
 * @param {Database} db - Instância do banco
 * @param {Object} redemptionData - Dados do resgate
 * @returns {Object} - Resultado do resgate
 */
function redeemReward(db, redemptionData) {
  const {
    childId,
    rewardId,
    childNote = null
  } = redemptionData;

  // Validações
  if (!childId || !rewardId) {
    throw new Error('childId e rewardId são obrigatórios');
  }

  // Buscar criança
  const child = db.prepare('SELECT * FROM children WHERE id = ?').get(childId);
  if (!child) {
    throw new Error('Criança não encontrada');
  }

  // Buscar recompensa
  const reward = db.prepare('SELECT * FROM family_rewards WHERE id = ? AND is_active = 1').get(rewardId);
  if (!reward) {
    throw new Error('Recompensa não encontrada ou inativa');
  }

  // Verificar se pertence à mesma família
  if (child.family_id !== reward.family_id) {
    throw new Error('Esta recompensa não pertence à sua família');
  }

  // Verificar se tem FP suficiente
  if (child.fp_balance < reward.fp_cost) {
    throw new Error(`Você precisa de ${reward.fp_cost - child.fp_balance} FP a mais para resgatar esta recompensa`);
  }

  // Verificar estoque
  if (reward.stock !== null && reward.stock <= 0) {
    throw new Error('Esta recompensa está fora de estoque');
  }

  // TRANSAÇÃO: Debitar FP e criar resgate
  const transaction = db.transaction(() => {
    // 1. Debitar FP
    db.prepare(`
      UPDATE children
      SET fp_balance = fp_balance - ?
      WHERE id = ?
    `).run(reward.fp_cost, childId);

    // 2. Criar registro de resgate
    const insertStmt = db.prepare(`
      INSERT INTO reward_redemptions
      (child_id, reward_id, fp_spent, status, child_note)
      VALUES (?, ?, ?, 'pending', ?)
    `);

    const result = insertStmt.run(childId, rewardId, reward.fp_cost, childNote);

    return result.lastInsertRowid;
  });

  const redemptionId = transaction();

  // Buscar resgate criado com detalhes
  const redemption = db.prepare(`
    SELECT
      rd.*,
      r.reward_name,
      r.icon,
      c.name as child_name
    FROM reward_redemptions rd
    JOIN family_rewards r ON rd.reward_id = r.id
    JOIN children c ON rd.child_id = c.id
    WHERE rd.id = ?
  `).get(redemptionId);

  return {
    success: true,
    redemption,
    newFpBalance: child.fp_balance - reward.fp_cost,
    message: `🎉 Resgate solicitado! "${reward.reward_name}" aguardando aprovação dos pais.`
  };
}

/**
 * APROVAR/REJEITAR RESGATE (PAIS)
 * @param {Database} db - Instância do banco
 * @param {Object} reviewData - Dados da revisão
 * @returns {Object} - Resultado da aprovação/rejeição
 */
function reviewRedemption(db, reviewData) {
  const {
    redemptionId,
    parentId,
    action, // 'approve' ou 'reject'
    rejectionReason = null,
    parentNote = null
  } = reviewData;

  // Validações
  if (!redemptionId || !parentId || !action) {
    throw new Error('redemptionId, parentId e action são obrigatórios');
  }

  if (!['approve', 'reject'].includes(action)) {
    throw new Error('action deve ser "approve" ou "reject"');
  }

  if (action === 'reject' && !rejectionReason) {
    throw new Error('rejectionReason é obrigatório ao rejeitar');
  }

  // Buscar resgate
  const redemption = db.prepare(`
    SELECT rd.*, c.family_id, r.fp_cost
    FROM reward_redemptions rd
    JOIN children c ON rd.child_id = c.id
    JOIN family_rewards r ON rd.reward_id = r.id
    WHERE rd.id = ?
  `).get(redemptionId);

  if (!redemption) {
    throw new Error('Resgate não encontrado');
  }

  // Verificar se ainda está pendente
  if (redemption.status !== 'pending') {
    throw new Error(`Este resgate já foi ${redemption.status === 'approved' ? 'aprovado' : 'rejeitado'}`);
  }

  // Verificar se pai pertence à família
  const parent = db.prepare('SELECT family_id FROM users WHERE id = ? AND role = "parent"').get(parentId);
  if (!parent || parent.family_id !== redemption.family_id) {
    throw new Error('Você não tem permissão para revisar este resgate');
  }

  // AÇÃO
  if (action === 'approve') {
    // Aprovar resgate
    db.prepare(`
      UPDATE reward_redemptions
      SET
        status = 'approved',
        reviewed_by_parent_id = ?,
        reviewed_at = CURRENT_TIMESTAMP,
        parent_note = ?
      WHERE id = ?
    `).run(parentId, parentNote, redemptionId);

    // Trigger automático já decrementa o estoque

    return {
      success: true,
      action: 'approved',
      message: '✅ Resgate aprovado! Não esqueça de entregar a recompensa.'
    };
  } else {
    // Rejeitar resgate - DEVOLVER FP
    const transaction = db.transaction(() => {
      // 1. Marcar como rejeitado
      db.prepare(`
        UPDATE reward_redemptions
        SET
          status = 'rejected',
          reviewed_by_parent_id = ?,
          reviewed_at = CURRENT_TIMESTAMP,
          rejection_reason = ?,
          parent_note = ?
        WHERE id = ?
      `).run(parentId, rejectionReason, parentNote, redemptionId);

      // 2. Devolver FP para a criança
      db.prepare(`
        UPDATE children
        SET fp_balance = fp_balance + ?
        WHERE id = ?
      `).run(redemption.fp_cost, redemption.child_id);

      // Trigger automático já incrementa o estoque
    });

    transaction();

    return {
      success: true,
      action: 'rejected',
      fpReturned: redemption.fp_cost,
      message: `❌ Resgate rejeitado. ${redemption.fp_cost} FP foram devolvidos.`
    };
  }
}

/**
 * MARCAR RESGATE COMO COMPLETADO (PAIS)
 * @param {Database} db - Instância do banco
 * @param {Number} redemptionId - ID do resgate
 * @param {Number} parentId - ID do pai
 * @returns {Object} - Resultado
 */
function completeRedemption(db, redemptionId, parentId) {
  // Buscar resgate
  const redemption = db.prepare(`
    SELECT rd.*, c.family_id
    FROM reward_redemptions rd
    JOIN children c ON rd.child_id = c.id
    WHERE rd.id = ?
  `).get(redemptionId);

  if (!redemption) {
    throw new Error('Resgate não encontrado');
  }

  // Verificar se está aprovado
  if (redemption.status !== 'approved') {
    throw new Error('Apenas resgates aprovados podem ser marcados como completados');
  }

  // Verificar permissão
  const parent = db.prepare('SELECT family_id FROM users WHERE id = ? AND role = "parent"').get(parentId);
  if (!parent || parent.family_id !== redemption.family_id) {
    throw new Error('Você não tem permissão para completar este resgate');
  }

  // Marcar como completado
  db.prepare(`
    UPDATE reward_redemptions
    SET
      status = 'completed',
      completed_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(redemptionId);

  return {
    success: true,
    message: '🎉 Recompensa entregue e marcada como completada!'
  };
}

/**
 * HISTÓRICO DE RESGATES (PAIS E CRIANÇAS)
 * @param {Database} db - Instância do banco
 * @param {Object} filters - Filtros
 * @returns {Array} - Histórico de resgates
 */
function getRedemptionHistory(db, filters = {}) {
  const {
    childId = null,
    familyId = null,
    status = null,
    limit = 50,
    offset = 0
  } = filters;

  let query = 'SELECT * FROM v_redemption_history WHERE 1=1';
  const params = [];

  if (childId) {
    query += ' AND child_id = ?';
    params.push(childId);
  }

  if (familyId) {
    query += ' AND (SELECT family_id FROM children WHERE id = child_id) = ?';
    params.push(familyId);
  }

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY redeemed_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const history = db.prepare(query).all(...params);

  return {
    success: true,
    total: history.length,
    history,
    filters: { childId, familyId, status, limit, offset }
  };
}

/**
 * ESTATÍSTICAS DE RECOMPENSAS (PAIS)
 * @param {Database} db - Instância do banco
 * @param {Number} familyId - ID da família
 * @returns {Object} - Estatísticas completas
 */
function getRewardStats(db, familyId) {
  // Total de recompensas criadas
  const totalRewards = db.prepare(`
    SELECT COUNT(*) as count FROM family_rewards WHERE family_id = ?
  `).get(familyId).count;

  // Total de resgates por status
  const redemptionsByStatus = db.prepare(`
    SELECT
      rd.status,
      COUNT(*) as count,
      SUM(rd.fp_spent) as total_fp
    FROM reward_redemptions rd
    JOIN children c ON rd.child_id = c.id
    WHERE c.family_id = ?
    GROUP BY rd.status
  `).all(familyId);

  // Recompensa mais popular
  const mostPopular = db.prepare(`
    SELECT
      r.reward_name,
      r.icon,
      COUNT(*) as redemptions
    FROM reward_redemptions rd
    JOIN family_rewards r ON rd.reward_id = r.id
    JOIN children c ON rd.child_id = c.id
    WHERE c.family_id = ? AND rd.status IN ('approved', 'completed')
    GROUP BY rd.reward_id
    ORDER BY COUNT(*) DESC
    LIMIT 1
  `).get(familyId);

  // FP gasto total pela família
  const totalFpSpent = db.prepare(`
    SELECT COALESCE(SUM(rd.fp_spent), 0) as total
    FROM reward_redemptions rd
    JOIN children c ON rd.child_id = c.id
    WHERE c.family_id = ? AND rd.status IN ('approved', 'completed')
  `).get(familyId).total;

  // Resgates pendentes
  const pendingRedemptions = db.prepare(`
    SELECT COUNT(*) as count
    FROM reward_redemptions rd
    JOIN children c ON rd.child_id = c.id
    WHERE c.family_id = ? AND rd.status = 'pending'
  `).get(familyId).count;

  // Estatísticas por criança
  const childStats = db.prepare(`
    SELECT * FROM v_child_reward_stats
    WHERE child_id IN (SELECT id FROM children WHERE family_id = ?)
  `).all(familyId);

  return {
    success: true,
    stats: {
      totalRewards,
      redemptionsByStatus,
      mostPopular: mostPopular || { reward_name: 'Nenhuma', redemptions: 0 },
      totalFpSpent,
      pendingRedemptions,
      childStats
    }
  };
}

/**
 * EDITAR RECOMPENSA (PAIS)
 * @param {Database} db - Instância do banco
 * @param {Number} rewardId - ID da recompensa
 * @param {Object} updates - Campos a atualizar
 * @returns {Object} - Recompensa atualizada
 */
function updateReward(db, rewardId, updates) {
  const allowedFields = ['reward_name', 'description', 'fp_cost', 'icon', 'stock', 'age_restriction', 'is_active'];
  const setClause = [];
  const params = [];

  Object.keys(updates).forEach(key => {
    if (allowedFields.includes(key)) {
      setClause.push(`${key} = ?`);
      params.push(updates[key]);
    }
  });

  if (setClause.length === 0) {
    throw new Error('Nenhum campo válido para atualizar');
  }

  params.push(rewardId);

  db.prepare(`
    UPDATE family_rewards
    SET ${setClause.join(', ')}
    WHERE id = ?
  `).run(...params);

  const updatedReward = db.prepare('SELECT * FROM family_rewards WHERE id = ?').get(rewardId);

  return {
    success: true,
    reward: updatedReward,
    message: 'Recompensa atualizada com sucesso!'
  };
}

/**
 * DELETAR RECOMPENSA (PAIS)
 * @param {Database} db - Instância do banco
 * @param {Number} rewardId - ID da recompensa
 * @returns {Object} - Resultado
 */
function deleteReward(db, rewardId) {
  // Verificar se há resgates pendentes
  const pendingRedemptions = db.prepare(`
    SELECT COUNT(*) as count
    FROM reward_redemptions
    WHERE reward_id = ? AND status = 'pending'
  `).get(rewardId).count;

  if (pendingRedemptions > 0) {
    throw new Error('Não é possível deletar recompensa com resgates pendentes. Aprove ou rejeite primeiro.');
  }

  // Soft delete (marcar como inativa ao invés de deletar)
  db.prepare(`
    UPDATE family_rewards
    SET is_active = 0
    WHERE id = ?
  `).run(rewardId);

  return {
    success: true,
    message: 'Recompensa desativada com sucesso!'
  };
}

/**
 * RESGATES PENDENTES DE APROVAÇÃO (PAIS)
 * @param {Database} db - Instância do banco
 * @param {Number} familyId - ID da família
 * @returns {Array} - Resgates pendentes
 */
function getPendingRedemptions(db, familyId) {
  const pending = db.prepare(`
    SELECT
      rd.id,
      rd.child_id,
      c.name as child_name,
      c.avatar as child_avatar,
      rd.reward_id,
      r.reward_name,
      r.icon,
      rd.fp_spent,
      rd.child_note,
      rd.redeemed_at,
      CAST((julianday('now') - julianday(rd.redeemed_at)) * 24 AS INTEGER) as hours_ago
    FROM reward_redemptions rd
    JOIN children c ON rd.child_id = c.id
    JOIN family_rewards r ON rd.reward_id = r.id
    WHERE c.family_id = ? AND rd.status = 'pending'
    ORDER BY rd.redeemed_at ASC
  `).all(familyId);

  return {
    success: true,
    count: pending.length,
    pending,
    message: pending.length > 0
      ? `${pending.length} resgate(s) aguardando sua aprovação!`
      : 'Nenhum resgate pendente no momento.'
  };
}

// ================================================
// EXPORTS
// ================================================

module.exports = {
  // Gerenciamento de Recompensas (Pais)
  createReward,
  updateReward,
  deleteReward,

  // Resgates (Crianças)
  listAvailableRewards,
  redeemReward,

  // Aprovação (Pais)
  reviewRedemption,
  completeRedemption,
  getPendingRedemptions,

  // Histórico e Estatísticas
  getRedemptionHistory,
  getRewardStats
};
