// ============================================
// E-KIDS PRO - GERENCIADOR DE BADGES
// ============================================
// Sistema completo de conquistas com 105+ badges

/**
 * Verifica e desbloqueia badges automaticamente para uma criança
 * Baseado em ações específicas
 */
function checkAndUnlockBadges(db, childId, action, value = 1) {
  const unlockedBadges = [];

  // Buscar estatísticas da criança
  const stats = getChildStats(db, childId);

  // Mapa de ações para badges
  const badgeChecks = {
    // PROGRESSÃO
    'missao_completada': [
      { badge: 'primeira_missao', condition: stats.totalMissions >= 1 },
      { badge: '10_missoes', condition: stats.totalMissions >= 10 },
      { badge: '50_missoes', condition: stats.totalMissions >= 50 },
      { badge: '100_missoes', condition: stats.totalMissions >= 100 },
      { badge: '250_missoes', condition: stats.totalMissions >= 250 }
    ],

    'fp_acumulado': [
      { badge: '100_fp', condition: stats.totalFPEarned >= 100 },
      { badge: '500_fp', condition: stats.totalFPEarned >= 500 },
      { badge: '1000_fp', condition: stats.totalFPEarned >= 1000 },
      { badge: '5000_fp', condition: stats.totalFPEarned >= 5000 },
      { badge: '10000_fp', condition: stats.totalFPEarned >= 10000 }
    ],

    'mascote_nivel': [
      { badge: 'mascote_nivel_5', condition: stats.mascoteLevel >= 5 },
      { badge: 'mascote_nivel_10', condition: stats.mascoteLevel >= 10 },
      { badge: 'mascote_nivel_20', condition: stats.mascoteLevel >= 20 },
      { badge: 'mascote_nivel_50', condition: stats.mascoteLevel >= 50 }
    ],

    // ESPECIALIZAÇÃO
    'missao_emocoes': [
      { badge: 'emocoes_iniciante', condition: stats.missionsByArea.emotions >= 5 },
      { badge: 'emocoes_intermediario', condition: stats.missionsByArea.emotions >= 15 },
      { badge: 'emocoes_avancado', condition: stats.missionsByArea.emotions >= 30 },
      { badge: 'emocoes_expert', condition: stats.missionsByArea.emotions >= 50 }
    ],

    'missao_seguranca': [
      { badge: 'seguranca_iniciante', condition: stats.missionsByArea.safety >= 5 },
      { badge: 'seguranca_intermediario', condition: stats.missionsByArea.safety >= 15 },
      { badge: 'seguranca_avancado', condition: stats.missionsByArea.safety >= 30 },
      { badge: 'seguranca_expert', condition: stats.missionsByArea.safety >= 50 }
    ],

    'missao_corpo': [
      { badge: 'corpo_iniciante', condition: stats.missionsByArea.body >= 5 },
      { badge: 'corpo_intermediario', condition: stats.missionsByArea.body >= 15 },
      { badge: 'corpo_avancado', condition: stats.missionsByArea.body >= 30 },
      { badge: 'corpo_expert', condition: stats.missionsByArea.body >= 50 }
    ],

    'missao_criatividade': [
      { badge: 'criatividade_iniciante', condition: stats.missionsByArea.creativity >= 5 },
      { badge: 'criatividade_intermediario', condition: stats.missionsByArea.creativity >= 15 },
      { badge: 'criatividade_avancado', condition: stats.missionsByArea.creativity >= 30 },
      { badge: 'criatividade_expert', condition: stats.missionsByArea.creativity >= 50 }
    ],

    'missao_idiomas': [
      { badge: 'idiomas_iniciante', condition: stats.missionsByArea.languages >= 5 },
      { badge: 'idiomas_intermediario', condition: stats.missionsByArea.languages >= 15 },
      { badge: 'idiomas_avancado', condition: stats.missionsByArea.languages >= 30 },
      { badge: 'idiomas_expert', condition: stats.missionsByArea.languages >= 50 }
    ],

    'missao_amizade': [
      { badge: 'amizade_iniciante', condition: stats.missionsByArea.friendship >= 5 },
      { badge: 'amizade_intermediario', condition: stats.missionsByArea.friendship >= 15 },
      { badge: 'amizade_avancado', condition: stats.missionsByArea.friendship >= 30 },
      { badge: 'amizade_expert', condition: stats.missionsByArea.friendship >= 50 }
    ],

    // STREAKS
    'streak_diario': [
      { badge: 'streak_3', condition: stats.currentStreak >= 3 },
      { badge: 'streak_7', condition: stats.currentStreak >= 7 },
      { badge: 'streak_14', condition: stats.currentStreak >= 14 },
      { badge: 'streak_30', condition: stats.currentStreak >= 30 },
      { badge: 'streak_60', condition: stats.currentStreak >= 60 },
      { badge: 'streak_90', condition: stats.currentStreak >= 90 },
      { badge: 'streak_180', condition: stats.currentStreak >= 180 },
      { badge: 'streak_365', condition: stats.currentStreak >= 365 }
    ],

    // MASCOTE
    'mascote_criado': [
      { badge: 'mascote_nasceu', condition: stats.hasMascot }
    ],

    'mascote_nomeado': [
      { badge: 'mascote_batizado', condition: stats.mascotHasName }
    ],

    'mascote_interacao': [
      { badge: 'melhor_amigo', condition: stats.mascotInteractions >= 100 },
      { badge: 'inseparaveis', condition: stats.mascotInteractions >= 500 }
    ],

    // ECONOMIA
    'primeira_compra_feita': [
      { badge: 'primeira_compra', condition: stats.totalPurchases >= 1 }
    ],

    'cofrinho_usado': [
      { badge: 'investidor', condition: stats.hasPiggyBank }
    ],

    // CRIATIVIDADE
    'desenho_feito': [
      { badge: 'primeiro_desenho', condition: stats.drawings >= 1 },
      { badge: 'artista', condition: stats.drawings >= 10 }
    ]
  };

  // Verificar badges relevantes para a ação
  const checksForAction = badgeChecks[action] || [];

  checksForAction.forEach(check => {
    if (check.condition) {
      const unlocked = unlockBadge(db, childId, check.badge);
      if (unlocked) {
        unlockedBadges.push(unlocked);
      }
    }
  });

  return unlockedBadges;
}

/**
 * Desbloqueia um badge específico
 */
function unlockBadge(db, childId, badgeKey) {
  try {
    // Verificar se badge existe
    const badge = db.prepare(`
      SELECT * FROM badge_catalog WHERE badge_key = ?
    `).get(badgeKey);

    if (!badge) {
      console.log(`Badge ${badgeKey} não encontrado no catálogo`);
      return null;
    }

    // Verificar se já tem o badge
    const existing = db.prepare(`
      SELECT * FROM child_badges WHERE child_id = ? AND badge_key = ?
    `).get(childId, badgeKey);

    if (existing) {
      // Já tem o badge
      return null;
    }

    // Desbloquear badge
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO child_badges (child_id, badge_key, earned_at)
      VALUES (?, ?, ?)
    `).run(childId, badgeKey, now);

    // Adicionar recompensa FP
    if (badge.reward_fp > 0) {
      db.prepare(`
        UPDATE children
        SET total_fp = total_fp + ?
        WHERE id = ?
      `).run(badge.reward_fp, childId);
    }

    console.log(`✅ Badge desbloqueado: ${badge.name} (+${badge.reward_fp} FP)`);

    return {
      badge: badge,
      earnedAt: now,
      rewardFP: badge.reward_fp
    };
  } catch (error) {
    console.error('Erro ao desbloquear badge:', error);
    return null;
  }
}

/**
 * Coleta estatísticas da criança para verificação de badges
 */
function getChildStats(db, childId) {
  const child = db.prepare('SELECT * FROM children WHERE id = ?').get(childId);

  // Total de missões completadas
  const totalMissions = db.prepare(`
    SELECT COUNT(*) as count FROM activities_completed WHERE child_id = ?
  `).get(childId)?.count || 0;

  // Total de FP ganhos (acumulados ao longo do tempo)
  const totalFPEarned = db.prepare(`
    SELECT SUM(fp_earned) as total FROM activities_completed WHERE child_id = ?
  `).get(childId)?.total || 0;

  // Missões por área
  const missionsByArea = {
    emotions: 0,
    safety: 0,
    body: 0,
    creativity: 0,
    languages: 0,
    friendship: 0
  };

  const areaStats = db.prepare(`
    SELECT module_key, COUNT(*) as count
    FROM activities_completed
    WHERE child_id = ?
    GROUP BY module_key
  `).all(childId);

  areaStats.forEach(stat => {
    if (stat.module_key.includes('emocao') || stat.module_key.includes('emocoes')) {
      missionsByArea.emotions += stat.count;
    } else if (stat.module_key.includes('segur') || stat.module_key.includes('limite')) {
      missionsByArea.safety += stat.count;
    } else if (stat.module_key.includes('corpo') || stat.module_key.includes('cuidando')) {
      missionsByArea.body += stat.count;
    } else if (stat.module_key.includes('criativ')) {
      missionsByArea.creativity += stat.count;
    } else if (stat.module_key.includes('idioma') || stat.module_key.includes('lingua')) {
      missionsByArea.languages += stat.count;
    } else if (stat.module_key.includes('amizade') || stat.module_key.includes('amigo')) {
      missionsByArea.friendship += stat.count;
    }
  });

  // Streak atual (simplificado - pode ser melhorado)
  const currentStreak = calculateStreak(db, childId);

  // Mascote
  const mascot = db.prepare('SELECT * FROM mascot WHERE child_id = ?').get(childId);
  const hasMascot = !!mascot;
  const mascotLevel = mascot?.level || 0;
  const mascotHasName = mascot?.name && mascot.name !== 'Mascote';
  const mascotInteractions = 0; // TODO: implementar tracking de interações

  // Economia
  const totalPurchases = 0; // TODO: implementar tracking de compras
  const hasPiggyBank = false; // TODO: verificar se já usou cofrinho

  // Criatividade
  const drawings = 0; // TODO: implementar tracking de desenhos

  return {
    child,
    totalMissions,
    totalFPEarned,
    missionsByArea,
    currentStreak,
    hasMascot,
    mascoteLevel: mascotLevel,
    mascotHasName,
    mascotInteractions,
    totalPurchases,
    hasPiggyBank,
    drawings
  };
}

/**
 * Calcula streak atual de dias consecutivos
 */
function calculateStreak(db, childId) {
  const activities = db.prepare(`
    SELECT DATE(completed_at) as date
    FROM activities_completed
    WHERE child_id = ?
    ORDER BY completed_at DESC
    LIMIT 365
  `).all(childId);

  if (activities.length === 0) return 0;

  let streak = 1;
  let lastDate = new Date(activities[0].date);

  for (let i = 1; i < activities.length; i++) {
    const currentDate = new Date(activities[i].date);
    const diffDays = Math.floor((lastDate - currentDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
      lastDate = currentDate;
    } else if (diffDays > 1) {
      break;
    }
  }

  return streak;
}

/**
 * Lista todos os badges do catálogo
 */
function listAllBadges(db, options = {}) {
  const { category, rarity, includeSecret = false } = options;

  let query = 'SELECT * FROM badge_catalog WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (rarity) {
    query += ' AND rarity = ?';
    params.push(rarity);
  }

  if (!includeSecret) {
    query += ' AND is_secret = 0';
  }

  query += ' ORDER BY category, rarity, id';

  return db.prepare(query).all(...params);
}

/**
 * Lista badges da criança
 */
function getChildBadges(db, childId) {
  const badges = db.prepare(`
    SELECT
      cb.*,
      bc.name,
      bc.description,
      bc.category,
      bc.rarity,
      bc.icon,
      bc.reward_fp
    FROM child_badges cb
    JOIN badge_catalog bc ON cb.badge_key = bc.badge_key
    WHERE cb.child_id = ?
    ORDER BY cb.earned_at DESC
  `).all(childId);

  return badges;
}

/**
 * Estatísticas de badges da criança
 */
function getChildBadgeStats(db, childId) {
  const total = db.prepare(`
    SELECT COUNT(*) as count FROM child_badges WHERE child_id = ?
  `).get(childId)?.count || 0;

  const byRarity = db.prepare(`
    SELECT bc.rarity, COUNT(*) as count
    FROM child_badges cb
    JOIN badge_catalog bc ON cb.badge_key = bc.badge_key
    WHERE cb.child_id = ?
    GROUP BY bc.rarity
  `).all(childId);

  const byCategory = db.prepare(`
    SELECT bc.category, COUNT(*) as count
    FROM child_badges cb
    JOIN badge_catalog bc ON cb.badge_key = bc.badge_key
    WHERE cb.child_id = ?
    GROUP BY bc.category
  `).all(childId);

  const totalFPFromBadges = db.prepare(`
    SELECT SUM(bc.reward_fp) as total
    FROM child_badges cb
    JOIN badge_catalog bc ON cb.badge_key = bc.badge_key
    WHERE cb.child_id = ?
  `).get(childId)?.total || 0;

  const totalBadgesAvailable = db.prepare(`
    SELECT COUNT(*) as count FROM badge_catalog WHERE is_secret = 0
  `).get()?.count || 0;

  const completionPercentage = totalBadgesAvailable > 0
    ? Math.round((total / totalBadgesAvailable) * 100)
    : 0;

  return {
    total,
    byRarity,
    byCategory,
    totalFPFromBadges,
    totalBadgesAvailable,
    completionPercentage
  };
}

/**
 * Progresso em direção a próximos badges
 */
function getNextBadges(db, childId, limit = 5) {
  const stats = getChildStats(db, childId);
  const currentBadges = getChildBadges(db, childId).map(b => b.badge_key);

  const suggestions = [];

  // Badges de missões totais
  const missionBadges = [
    { key: 'primeira_missao', goal: 1, current: stats.totalMissions },
    { key: '10_missoes', goal: 10, current: stats.totalMissions },
    { key: '50_missoes', goal: 50, current: stats.totalMissions },
    { key: '100_missoes', goal: 100, current: stats.totalMissions },
    { key: '250_missoes', goal: 250, current: stats.totalMissions }
  ];

  missionBadges.forEach(b => {
    if (!currentBadges.includes(b.key) && b.current < b.goal) {
      const badge = db.prepare('SELECT * FROM badge_catalog WHERE badge_key = ?').get(b.key);
      if (badge) {
        suggestions.push({
          ...badge,
          progress: b.current,
          goal: b.goal,
          percentage: Math.min(Math.round((b.current / b.goal) * 100), 100)
        });
      }
    }
  });

  // Badges de FP
  const fpBadges = [
    { key: '100_fp', goal: 100, current: stats.totalFPEarned },
    { key: '500_fp', goal: 500, current: stats.totalFPEarned },
    { key: '1000_fp', goal: 1000, current: stats.totalFPEarned },
    { key: '5000_fp', goal: 5000, current: stats.totalFPEarned }
  ];

  fpBadges.forEach(b => {
    if (!currentBadges.includes(b.key) && b.current < b.goal) {
      const badge = db.prepare('SELECT * FROM badge_catalog WHERE badge_key = ?').get(b.key);
      if (badge) {
        suggestions.push({
          ...badge,
          progress: b.current,
          goal: b.goal,
          percentage: Math.min(Math.round((b.current / b.goal) * 100), 100)
        });
      }
    }
  });

  // Ordenar por progresso (mais próximos primeiro)
  suggestions.sort((a, b) => b.percentage - a.percentage);

  return suggestions.slice(0, limit);
}

/**
 * Atualizar progresso de um badge
 */
function updateBadgeProgress(db, childId, badgeKey, progress) {
  try {
    const badge = db.prepare('SELECT * FROM badge_catalog WHERE badge_key = ?').get(badgeKey);
    if (!badge) return null;

    // Verificar se já tem o badge desbloqueado
    const unlocked = db.prepare(`
      SELECT * FROM child_badges WHERE child_id = ? AND badge_key = ?
    `).get(childId, badgeKey);

    if (unlocked) {
      return { alreadyUnlocked: true, badge };
    }

    // Atualizar ou criar progresso
    const existing = db.prepare(`
      SELECT * FROM child_badges_progress WHERE child_id = ? AND badge_key = ?
    `).get(childId, badgeKey);

    // TODO: Extrair goal do unlock_condition (por enquanto, usar valor padrão)
    const goal = 100;

    if (existing) {
      db.prepare(`
        UPDATE child_badges_progress
        SET progress = ?
        WHERE child_id = ? AND badge_key = ?
      `).run(progress, childId, badgeKey);
    } else {
      db.prepare(`
        INSERT INTO child_badges_progress (child_id, badge_key, progress, goal)
        VALUES (?, ?, ?, ?)
      `).run(childId, badgeKey, progress, goal);
    }

    // Verificar se atingiu meta
    if (progress >= goal) {
      return unlockBadge(db, childId, badgeKey);
    }

    return { progress, goal, percentage: Math.round((progress / goal) * 100) };
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    return null;
  }
}

module.exports = {
  checkAndUnlockBadges,
  unlockBadge,
  getChildStats,
  listAllBadges,
  getChildBadges,
  getChildBadgeStats,
  getNextBadges,
  updateBadgeProgress,
  calculateStreak
};
