// ============================================
// E-KIDS PRO - GERENCIADOR DE DASHBOARD DOS PAIS
// ============================================
// Sistema completo de relatórios, insights e alertas

/**
 * Gera relatório semanal completo da criança
 */
function getWeeklyReport(db, childId) {
  const now = new Date();
  const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const child = db.prepare('SELECT * FROM children WHERE id = ?').get(childId);

  // Missões completadas na semana
  const missionsCompleted = db.prepare(`
    SELECT COUNT(*) as count, SUM(fp_earned) as totalFP
    FROM activities_completed
    WHERE child_id = ? AND datetime(completed_at) >= datetime(?)
  `).get(childId, oneWeekAgo.toISOString());

  // Missões por dia da semana
  const missionsByDay = db.prepare(`
    SELECT
      strftime('%w', completed_at) as dayOfWeek,
      COUNT(*) as count
    FROM activities_completed
    WHERE child_id = ? AND datetime(completed_at) >= datetime(?)
    GROUP BY dayOfWeek
  `).all(childId, oneWeekAgo.toISOString());

  // Missões por área
  const missionsByArea = db.prepare(`
    SELECT
      module_key,
      COUNT(*) as count,
      SUM(fp_earned) as fpEarned
    FROM activities_completed
    WHERE child_id = ? AND datetime(completed_at) >= datetime(?)
    GROUP BY module_key
  `).all(childId, oneWeekAgo.toISOString());

  // Check-ins emocionais
  const emotionalCheckins = db.prepare(`
    SELECT emotion, COUNT(*) as count
    FROM emotional_checkins
    WHERE child_id = ? AND datetime(created_at) >= datetime(?)
    GROUP BY emotion
  `).all(childId, oneWeekAgo.toISOString());

  // Badges desbloqueados na semana
  const newBadges = db.prepare(`
    SELECT cb.*, bc.name, bc.rarity, bc.reward_fp
    FROM child_badges cb
    JOIN badge_catalog bc ON cb.badge_key = bc.badge_key
    WHERE cb.child_id = ? AND datetime(cb.earned_at) >= datetime(?)
  `).all(childId, oneWeekAgo.toISOString());

  // Progresso do mascote
  const mascot = db.prepare('SELECT * FROM mascot WHERE child_id = ?').get(childId);

  // Streak atual
  const streak = calculateCurrentStreak(db, childId);

  return {
    period: {
      start: oneWeekAgo.toISOString(),
      end: now.toISOString(),
      days: 7
    },
    child: {
      name: child.name,
      age: child.age,
      totalFP: child.total_fp
    },
    missions: {
      total: missionsCompleted.count || 0,
      fpEarned: missionsCompleted.totalFP || 0,
      byDay: missionsByDay,
      byArea: missionsByArea,
      averagePerDay: Math.round((missionsCompleted.count || 0) / 7 * 10) / 10
    },
    emotional: {
      checkinsCount: emotionalCheckins.length,
      emotions: emotionalCheckins,
      mostFrequent: getMostFrequentEmotion(emotionalCheckins)
    },
    achievements: {
      newBadges: newBadges.length,
      badges: newBadges,
      totalFPFromBadges: newBadges.reduce((sum, b) => sum + b.reward_fp, 0)
    },
    mascot: {
      level: mascot?.level || 0,
      happiness: mascot?.happiness || 0,
      energy: mascot?.energy || 0
    },
    streak: {
      current: streak,
      weekActive: streak >= 7
    }
  };
}

/**
 * Gera relatório mensal completo
 */
function getMonthlyReport(db, childId) {
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  const child = db.prepare('SELECT * FROM children WHERE id = ?').get(childId);

  // Estatísticas do mês
  const stats = db.prepare(`
    SELECT
      COUNT(*) as totalMissions,
      SUM(fp_earned) as totalFP
    FROM activities_completed
    WHERE child_id = ? AND datetime(completed_at) >= datetime(?)
  `).get(childId, oneMonthAgo.toISOString());

  // Progresso por semana do mês
  const weeklyProgress = db.prepare(`
    SELECT
      strftime('%W', completed_at) as week,
      COUNT(*) as missions,
      SUM(fp_earned) as fp
    FROM activities_completed
    WHERE child_id = ? AND datetime(completed_at) >= datetime(?)
    GROUP BY week
    ORDER BY week
  `).all(childId, oneMonthAgo.toISOString());

  // Áreas mais trabalhadas
  const topAreas = db.prepare(`
    SELECT
      module_key,
      COUNT(*) as count,
      SUM(fp_earned) as fpEarned
    FROM activities_completed
    WHERE child_id = ? AND datetime(completed_at) >= datetime(?)
    GROUP BY module_key
    ORDER BY count DESC
    LIMIT 5
  `).all(childId, oneMonthAgo.toISOString());

  // Badges do mês
  const monthlyBadges = db.prepare(`
    SELECT cb.*, bc.name, bc.category, bc.rarity
    FROM child_badges cb
    JOIN badge_catalog bc ON cb.badge_key = bc.badge_key
    WHERE cb.child_id = ? AND datetime(cb.earned_at) >= datetime(?)
  `).all(childId, oneMonthAgo.toISOString());

  // Emoções do mês
  const emotionalSummary = db.prepare(`
    SELECT
      emotion,
      COUNT(*) as count,
      AVG(comfort_level) as avgComfort
    FROM emotional_checkins
    WHERE child_id = ? AND datetime(created_at) >= datetime(?)
    GROUP BY emotion
    ORDER BY count DESC
  `).all(childId, oneMonthAgo.toISOString());

  // Comparação com mês anterior
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
  const previousMonth = db.prepare(`
    SELECT
      COUNT(*) as totalMissions,
      SUM(fp_earned) as totalFP
    FROM activities_completed
    WHERE child_id = ?
    AND datetime(completed_at) >= datetime(?)
    AND datetime(completed_at) < datetime(?)
  `).get(childId, twoMonthsAgo.toISOString(), oneMonthAgo.toISOString());

  const growth = {
    missions: calculateGrowth(previousMonth.totalMissions, stats.totalMissions),
    fp: calculateGrowth(previousMonth.totalFP, stats.totalFP)
  };

  return {
    period: {
      start: oneMonthAgo.toISOString(),
      end: now.toISOString(),
      days: 30
    },
    child: {
      name: child.name,
      totalFP: child.total_fp
    },
    summary: {
      totalMissions: stats.totalMissions || 0,
      totalFP: stats.totalFP || 0,
      averagePerDay: Math.round((stats.totalMissions || 0) / 30 * 10) / 10,
      fpPerDay: Math.round((stats.totalFP || 0) / 30)
    },
    progress: {
      weekly: weeklyProgress,
      topAreas: topAreas
    },
    achievements: {
      badges: monthlyBadges.length,
      byRarity: groupByRarity(monthlyBadges)
    },
    emotional: {
      summary: emotionalSummary,
      totalCheckins: emotionalSummary.reduce((sum, e) => sum + e.count, 0)
    },
    growth: growth
  };
}

/**
 * Gera insights automáticos baseado no comportamento
 */
function generateInsights(db, childId) {
  const insights = [];
  const weeklyReport = getWeeklyReport(db, childId);

  // Insight 1: Consistência
  if (weeklyReport.streak.current >= 7) {
    insights.push({
      type: 'positive',
      category: 'consistency',
      icon: '🔥',
      title: 'Sequência Incrível!',
      message: `${weeklyReport.child.name} está em uma sequência de ${weeklyReport.streak.current} dias! Continue incentivando!`,
      priority: 'high'
    });
  } else if (weeklyReport.missions.total === 0) {
    insights.push({
      type: 'alert',
      category: 'consistency',
      icon: '⚠️',
      title: 'Semana Sem Atividades',
      message: `${weeklyReport.child.name} não completou nenhuma missão esta semana. Que tal incentivar uma atividade hoje?`,
      priority: 'high'
    });
  }

  // Insight 2: Área Favorita
  if (weeklyReport.missions.byArea.length > 0) {
    const favoriteArea = weeklyReport.missions.byArea.reduce((max, area) =>
      area.count > (max.count || 0) ? area : max
    , {});

    insights.push({
      type: 'info',
      category: 'preference',
      icon: '⭐',
      title: 'Área Favorita Identificada',
      message: `${weeklyReport.child.name} está adorando atividades de ${favoriteArea.module_key}! ${favoriteArea.count} missões completadas.`,
      priority: 'medium'
    });
  }

  // Insight 3: Badges
  if (weeklyReport.achievements.newBadges > 0) {
    insights.push({
      type: 'positive',
      category: 'achievement',
      icon: '🏆',
      title: 'Conquistas Desbloqueadas!',
      message: `${weeklyReport.achievements.newBadges} ${weeklyReport.achievements.newBadges === 1 ? 'badge desbloqueado' : 'badges desbloqueados'} esta semana! +${weeklyReport.achievements.totalFPFromBadges} FP`,
      priority: 'high'
    });
  }

  // Insight 4: Emoções
  if (weeklyReport.emotional.mostFrequent) {
    const emotion = weeklyReport.emotional.mostFrequent;
    if (emotion.emotion === 'triste' || emotion.emotion === 'com medo') {
      insights.push({
        type: 'alert',
        category: 'emotional',
        icon: '💙',
        title: 'Atenção Emocional Necessária',
        message: `${weeklyReport.child.name} relatou estar "${emotion.emotion}" com frequência. Considere conversar sobre os sentimentos.`,
        priority: 'high'
      });
    } else if (emotion.emotion === 'feliz' || emotion.emotion === 'animado') {
      insights.push({
        type: 'positive',
        category: 'emotional',
        icon: '😊',
        title: 'Estado Emocional Positivo',
        message: `${weeklyReport.child.name} tem se sentido "${emotion.emotion}" frequentemente. Ótimo sinal!`,
        priority: 'low'
      });
    }
  }

  // Insight 5: Mascote
  if (weeklyReport.mascot.happiness < 50) {
    insights.push({
      type: 'alert',
      category: 'mascot',
      icon: '🐾',
      title: 'Mascote Precisa de Atenção',
      message: `O mascote está com felicidade baixa (${weeklyReport.mascot.happiness}/100). Incentive ${weeklyReport.child.name} a interagir mais!`,
      priority: 'medium'
    });
  }

  // Insight 6: Produtividade
  const avgPerDay = weeklyReport.missions.averagePerDay;
  if (avgPerDay >= 3) {
    insights.push({
      type: 'positive',
      category: 'productivity',
      icon: '🚀',
      title: 'Alta Produtividade!',
      message: `Média de ${avgPerDay} missões por dia! ${weeklyReport.child.name} está super dedicado(a)!`,
      priority: 'medium'
    });
  } else if (avgPerDay < 1) {
    insights.push({
      type: 'suggestion',
      category: 'productivity',
      icon: '💡',
      title: 'Oportunidade de Crescimento',
      message: `Apenas ${weeklyReport.missions.total} missões esta semana. Que tal estabelecer uma meta de 2 missões por dia?`,
      priority: 'medium'
    });
  }

  // Ordenar por prioridade
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return insights;
}

/**
 * Gera alertas para os pais
 */
function generateAlerts(db, childId) {
  const alerts = [];
  const child = db.prepare('SELECT * FROM children WHERE id = ?').get(childId);

  // Alerta 1: Inatividade prolongada
  const lastActivity = db.prepare(`
    SELECT MAX(datetime(completed_at)) as lastDate
    FROM activities_completed
    WHERE child_id = ?
  `).get(childId);

  if (lastActivity.lastDate) {
    const daysSinceLastActivity = Math.floor((Date.now() - new Date(lastActivity.lastDate)) / (1000 * 60 * 60 * 24));

    if (daysSinceLastActivity >= 3) {
      alerts.push({
        type: 'warning',
        severity: 'high',
        icon: '⏰',
        title: 'Inatividade Detectada',
        message: `${child.name} não completa missões há ${daysSinceLastActivity} dias.`,
        action: 'Incentive uma atividade hoje',
        createdAt: new Date().toISOString()
      });
    }
  }

  // Alerta 2: Emoções negativas frequentes
  const recentNegativeEmotions = db.prepare(`
    SELECT COUNT(*) as count
    FROM emotional_checkins
    WHERE child_id = ?
    AND (emotion = 'triste' OR emotion = 'com medo' OR emotion = 'irritado')
    AND datetime(created_at) >= datetime('now', '-7 days')
  `).get(childId);

  if (recentNegativeEmotions.count >= 3) {
    alerts.push({
      type: 'important',
      severity: 'high',
      icon: '💔',
      title: 'Atenção: Emoções Negativas',
      message: `${child.name} relatou emoções negativas ${recentNegativeEmotions.count}x nos últimos 7 dias.`,
      action: 'Considere conversar sobre os sentimentos',
      createdAt: new Date().toISOString()
    });
  }

  // Alerta 3: FP muito baixo
  if (child.total_fp < 50) {
    alerts.push({
      type: 'info',
      severity: 'low',
      icon: '💰',
      title: 'FP Baixo',
      message: `${child.name} está com apenas ${child.total_fp} FP.`,
      action: 'Complete missões para ganhar mais FP',
      createdAt: new Date().toISOString()
    });
  }

  // Alerta 4: Streak em risco
  const streak = calculateCurrentStreak(db, childId);
  const lastActivityToday = db.prepare(`
    SELECT COUNT(*) as count
    FROM activities_completed
    WHERE child_id = ? AND date(completed_at) = date('now')
  `).get(childId);

  if (streak >= 7 && lastActivityToday.count === 0) {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 18) { // Após 18h
      alerts.push({
        type: 'reminder',
        severity: 'medium',
        icon: '🔥',
        title: 'Sequência em Risco!',
        message: `${child.name} tem uma sequência de ${streak} dias, mas ainda não completou nenhuma missão hoje!`,
        action: 'Complete pelo menos uma missão para manter a sequência',
        createdAt: new Date().toISOString()
      });
    }
  }

  // Alerta 5: Mascote negligenciado
  const mascot = db.prepare('SELECT * FROM mascot WHERE child_id = ?').get(childId);
  if (mascot && (mascot.happiness < 30 || mascot.energy < 30)) {
    alerts.push({
      type: 'reminder',
      severity: 'medium',
      icon: '🐾',
      title: 'Mascote Precisa de Cuidados',
      message: `O mascote de ${child.name} está ${mascot.happiness < 30 ? 'triste' : 'cansado'}.`,
      action: 'Incentive interação com o mascote',
      createdAt: new Date().toISOString()
    });
  }

  // Ordenar por severidade
  const severityOrder = { high: 1, medium: 2, low: 3 };
  alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return alerts;
}

/**
 * Gera dados para gráficos
 */
function getChartData(db, childId, period = 'week') {
  const days = period === 'week' ? 7 : 30;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Missões por dia
  const missionsByDay = db.prepare(`
    SELECT
      date(completed_at) as date,
      COUNT(*) as missions,
      SUM(fp_earned) as fp
    FROM activities_completed
    WHERE child_id = ? AND datetime(completed_at) >= datetime(?)
    GROUP BY date(completed_at)
    ORDER BY date
  `).all(childId, startDate.toISOString());

  // Preencher dias sem atividade com 0
  const filledData = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    const existing = missionsByDay.find(d => d.date === dateStr);

    filledData.push({
      date: dateStr,
      missions: existing?.missions || 0,
      fp: existing?.fp || 0,
      dayOfWeek: date.toLocaleDateString('pt-BR', { weekday: 'short' })
    });
  }

  // Distribuição por área
  const areaDistribution = db.prepare(`
    SELECT
      module_key,
      COUNT(*) as count,
      SUM(fp_earned) as totalFP
    FROM activities_completed
    WHERE child_id = ? AND datetime(completed_at) >= datetime(?)
    GROUP BY module_key
  `).all(childId, startDate.toISOString());

  // Progresso emocional
  const emotionalTrend = db.prepare(`
    SELECT
      date(created_at) as date,
      emotion,
      comfort_level,
      COUNT(*) as count
    FROM emotional_checkins
    WHERE child_id = ? AND datetime(created_at) >= datetime(?)
    GROUP BY date(created_at), emotion
    ORDER BY date
  `).all(childId, startDate.toISOString());

  return {
    timeline: filledData,
    areaDistribution: areaDistribution,
    emotionalTrend: emotionalTrend,
    period: period,
    totalDays: days
  };
}

/**
 * Gera resumo executivo para os pais
 */
function getExecutiveSummary(db, childId) {
  const weeklyReport = getWeeklyReport(db, childId);
  const insights = generateInsights(db, childId);
  const alerts = generateAlerts(db, childId);

  const child = db.prepare('SELECT * FROM children WHERE id = ?').get(childId);
  const totalBadges = db.prepare(`
    SELECT COUNT(*) as count FROM child_badges WHERE child_id = ?
  `).get(childId).count;

  return {
    child: {
      name: child.name,
      age: child.age,
      totalFP: child.total_fp
    },
    thisWeek: {
      missions: weeklyReport.missions.total,
      fpEarned: weeklyReport.missions.fpEarned,
      newBadges: weeklyReport.achievements.newBadges,
      streak: weeklyReport.streak.current
    },
    highlights: insights.slice(0, 3), // Top 3 insights
    alerts: alerts.slice(0, 3), // Top 3 alerts
    totalBadges: totalBadges,
    lastUpdated: new Date().toISOString()
  };
}

// Funções auxiliares

function calculateCurrentStreak(db, childId) {
  const activities = db.prepare(`
    SELECT DISTINCT date(completed_at) as date
    FROM activities_completed
    WHERE child_id = ?
    ORDER BY date DESC
    LIMIT 365
  `).all(childId);

  if (activities.length === 0) return 0;

  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Verificar se tem atividade hoje ou ontem
  if (activities[0].date !== today && activities[0].date !== yesterday) {
    return 0; // Sequência quebrada
  }

  let currentDate = activities[0].date === today ? today : yesterday;

  for (const activity of activities) {
    if (activity.date === currentDate) {
      streak++;
      const date = new Date(currentDate);
      date.setDate(date.getDate() - 1);
      currentDate = date.toISOString().split('T')[0];
    } else {
      break;
    }
  }

  return streak;
}

function getMostFrequentEmotion(emotions) {
  if (emotions.length === 0) return null;
  return emotions.reduce((max, e) => e.count > (max.count || 0) ? e : max, {});
}

function calculateGrowth(previous, current) {
  if (!previous || previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function groupByRarity(badges) {
  const grouped = {};
  badges.forEach(badge => {
    if (!grouped[badge.rarity]) grouped[badge.rarity] = 0;
    grouped[badge.rarity]++;
  });
  return grouped;
}

module.exports = {
  getWeeklyReport,
  getMonthlyReport,
  generateInsights,
  generateAlerts,
  getChartData,
  getExecutiveSummary
};
