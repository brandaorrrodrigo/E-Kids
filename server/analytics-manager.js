// ANALYTICS MANAGER - E-KIDS PRO
// Sistema de análise e estatísticas para dashboard dos pais

class AnalyticsManager {
  constructor(db) {
    this.db = db;
  }

  // ============================================
  // VISÃO GERAL DA CRIANÇA
  // ============================================

  getChildOverview(childId, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString();

    return {
      // Dados básicos
      child: this.db.prepare('SELECT * FROM children WHERE id = ?').get(childId),

      // FP e atividades
      fpStats: this.getFpStats(childId, days),
      activitiesStats: this.getActivitiesStats(childId, days),

      // Educação Financeira
      financialStats: this.getFinancialStats(childId, days),

      // Natureza
      natureStats: this.getNatureStats(childId, days),

      // Higiene
      hygieneStats: this.getHygieneStats(childId, days),

      // Chatbot
      chatStats: this.getChatStats(childId, days),

      // Badges totais
      totalBadges: this.getTotalBadges(childId)
    };
  }

  // ============================================
  // ESTATÍSTICAS DE FP
  // ============================================

  getFpStats(childId, days) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().split('T')[0];

    // Total de FP ganho
    const earned = this.db.prepare(`
      SELECT COALESCE(SUM(fp_earned), 0) as total
      FROM activities_completed
      WHERE child_id = ?
        AND DATE(completed_at) >= ?
    `).get(childId, sinceStr);

    // FP atual
    const current = this.db.prepare(`
      SELECT total_fp FROM children WHERE id = ?
    `).get(childId);

    // Tendência diária
    const dailyTrend = this.db.prepare(`
      SELECT
        DATE(completed_at) as date,
        SUM(fp_earned) as fp
      FROM activities_completed
      WHERE child_id = ?
        AND DATE(completed_at) >= ?
      GROUP BY DATE(completed_at)
      ORDER BY date
    `).all(childId, sinceStr);

    return {
      totalEarned: earned.total,
      current: current?.total_fp || 0,
      dailyAverage: Math.round(earned.total / days),
      dailyTrend
    };
  }

  // ============================================
  // ESTATÍSTICAS DE ATIVIDADES
  // ============================================

  getActivitiesStats(childId, days) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().split('T')[0];

    const stats = this.db.prepare(`
      SELECT
        COUNT(*) as total_completed,
        COUNT(DISTINCT DATE(completed_at)) as active_days
      FROM activities_completed
      WHERE child_id = ?
        AND DATE(completed_at) >= ?
    `).get(childId, sinceStr);

    // Atividades por categoria
    const byCategory = this.db.prepare(`
      SELECT
        a.category,
        COUNT(*) as count,
        SUM(ac.fp_earned) as fp_earned
      FROM activities_completed ac
      JOIN activities a ON ac.activity_id = a.id
      WHERE ac.child_id = ?
        AND DATE(ac.completed_at) >= ?
      GROUP BY a.category
      ORDER BY count DESC
    `).all(childId, sinceStr);

    // Top 5 atividades
    const topActivities = this.db.prepare(`
      SELECT
        a.title,
        COUNT(*) as count,
        SUM(ac.fp_earned) as fp_earned
      FROM activities_completed ac
      JOIN activities a ON ac.activity_id = a.id
      WHERE ac.child_id = ?
        AND DATE(ac.completed_at) >= ?
      GROUP BY a.id
      ORDER BY count DESC
      LIMIT 5
    `).all(childId, sinceStr);

    return {
      ...stats,
      byCategory,
      topActivities
    };
  }

  // ============================================
  // ESTATÍSTICAS FINANCEIRAS
  // ============================================

  getFinancialStats(childId, days) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().split('T')[0];

    // Decisões de FP
    const decisions = this.db.prepare(`
      SELECT
        decision_type,
        COUNT(*) as count,
        SUM(fp_amount) as total_fp
      FROM fp_decisions
      WHERE child_id = ?
        AND DATE(created_at) >= ?
      GROUP BY decision_type
    `).all(childId, sinceStr);

    // Cofrinhos ativos
    const piggyBanks = this.db.prepare(`
      SELECT
        goal_type,
        COUNT(*) as count,
        SUM(current_fp) as total_saved
      FROM piggy_banks
      WHERE child_id = ?
        AND is_active = 1
      GROUP BY goal_type
    `).all(childId);

    // Badges financeiras
    const badges = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM child_financial_badges
      WHERE child_id = ?
    `).get(childId);

    // Missões completas
    const missions = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM child_financial_missions
      WHERE child_id = ?
        AND completion_date IS NOT NULL
    `).get(childId);

    // Taxa de poupança média
    const savingsRate = this.db.prepare(`
      SELECT AVG(savings_percentage) as avg_rate
      FROM monthly_statements
      WHERE child_id = ?
        AND DATE(created_at) >= ?
    `).get(childId, sinceStr);

    return {
      decisions,
      piggyBanks,
      badgesEarned: badges.count,
      missionsCompleted: missions.count,
      averageSavingsRate: Math.round(savingsRate?.avg_rate || 0)
    };
  }

  // ============================================
  // ESTATÍSTICAS DE NATUREZA
  // ============================================

  getNatureStats(childId, days) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().split('T')[0];

    // Lições completadas
    const lessons = this.db.prepare(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN completed = 1 THEN 1 END) as completed
      FROM child_nature_progress
      WHERE child_id = ?
        AND DATE(created_at) >= ?
    `).get(childId, sinceStr);

    // Taxa de acerto
    const accuracy = this.db.prepare(`
      SELECT
        COUNT(*) as total_choices,
        SUM(CASE WHEN was_correct = 1 THEN 1 ELSE 0 END) as correct_choices
      FROM child_nature_progress
      WHERE child_id = ?
        AND DATE(created_at) >= ?
        AND choice_id IS NOT NULL
    `).get(childId, sinceStr);

    // Lições por categoria
    const byCategory = this.db.prepare(`
      SELECT
        nc.name,
        nc.icon,
        COUNT(cnp.id) as lessons_completed
      FROM nature_categories nc
      LEFT JOIN nature_lessons nl ON nc.id = nl.category_id
      LEFT JOIN child_nature_progress cnp ON nl.id = cnp.lesson_id
        AND cnp.child_id = ?
        AND cnp.completed = 1
        AND DATE(cnp.created_at) >= ?
      GROUP BY nc.id
      ORDER BY lessons_completed DESC
    `).all(childId, sinceStr);

    // Badges e missões
    const badges = this.db.prepare(`
      SELECT COUNT(*) as count FROM child_nature_badges WHERE child_id = ?
    `).get(childId);

    const missions = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM child_nature_missions
      WHERE child_id = ?
        AND completion_date IS NOT NULL
    `).get(childId);

    const accuracyRate = accuracy.total_choices > 0
      ? Math.round((accuracy.correct_choices / accuracy.total_choices) * 100)
      : 0;

    return {
      lessonsCompleted: lessons.completed || 0,
      accuracyRate,
      byCategory,
      badgesEarned: badges.count,
      missionsCompleted: missions.count
    };
  }

  // ============================================
  // ESTATÍSTICAS DE HIGIENE
  // ============================================

  getHygieneStats(childId, days) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().split('T')[0];

    // Stats gerais
    const stats = this.db.prepare(`
      SELECT
        current_streak_days,
        longest_streak_days,
        total_habits_completed
      FROM child_hygiene_stats
      WHERE child_id = ?
    `).get(childId);

    // Hábitos completados no período
    const habitsInPeriod = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM child_hygiene_tracking
      WHERE child_id = ?
        AND tracked_date >= ?
    `).get(childId, sinceStr);

    // Hábitos por categoria
    const byCategory = this.db.prepare(`
      SELECT
        hc.name,
        hc.icon,
        COUNT(cht.id) as habits_completed
      FROM hygiene_categories hc
      LEFT JOIN hygiene_habits hh ON hc.id = hh.category_id
      LEFT JOIN child_hygiene_tracking cht ON hh.id = cht.habit_id
        AND cht.child_id = ?
        AND cht.tracked_date >= ?
      GROUP BY hc.id
      ORDER BY habits_completed DESC
    `).all(childId, sinceStr);

    // Top 5 hábitos
    const topHabits = this.db.prepare(`
      SELECT
        hh.title,
        COUNT(cht.id) as count
      FROM hygiene_habits hh
      LEFT JOIN child_hygiene_tracking cht ON hh.id = cht.habit_id
        AND cht.child_id = ?
        AND cht.tracked_date >= ?
      GROUP BY hh.id
      ORDER BY count DESC
      LIMIT 5
    `).all(childId, sinceStr);

    // Badges e missões
    const badges = this.db.prepare(`
      SELECT COUNT(*) as count FROM child_hygiene_badges WHERE child_id = ?
    `).get(childId);

    const missions = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM child_hygiene_missions
      WHERE child_id = ?
        AND completion_date IS NOT NULL
    `).get(childId);

    // Frequência semanal (últimos 7 dias)
    const weeklyFrequency = this.db.prepare(`
      SELECT
        tracked_date,
        COUNT(*) as habits_count
      FROM child_hygiene_tracking
      WHERE child_id = ?
        AND tracked_date >= DATE('now', '-7 days')
      GROUP BY tracked_date
      ORDER BY tracked_date
    `).all(childId);

    return {
      currentStreak: stats?.current_streak_days || 0,
      longestStreak: stats?.longest_streak_days || 0,
      totalHabits: stats?.total_habits_completed || 0,
      habitsInPeriod: habitsInPeriod.count,
      byCategory,
      topHabits,
      weeklyFrequency,
      badgesEarned: badges.count,
      missionsCompleted: missions.count
    };
  }

  // ============================================
  // ESTATÍSTICAS DO CHATBOT
  // ============================================

  getChatStats(childId, days) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().split('T')[0];

    // Conversações e mensagens
    const stats = this.db.prepare(`
      SELECT
        COUNT(DISTINCT cc.id) as total_conversations,
        COUNT(cm.id) as total_messages
      FROM chat_conversations cc
      LEFT JOIN chat_messages cm ON cc.id = cm.conversation_id
      WHERE cc.child_id = ?
        AND DATE(cc.created_at) >= ?
    `).get(childId, sinceStr);

    // Contextos mais usados
    const byContext = this.db.prepare(`
      SELECT
        context_type,
        COUNT(*) as count
      FROM chat_conversations
      WHERE child_id = ?
        AND DATE(created_at) >= ?
      GROUP BY context_type
      ORDER BY count DESC
    `).all(childId, sinceStr);

    return {
      totalConversations: stats.total_conversations || 0,
      totalMessages: stats.total_messages || 0,
      byContext
    };
  }

  // ============================================
  // BADGES TOTAIS
  // ============================================

  getTotalBadges(childId) {
    const financial = this.db.prepare(`
      SELECT COUNT(*) as count FROM child_financial_badges WHERE child_id = ?
    `).get(childId);

    const nature = this.db.prepare(`
      SELECT COUNT(*) as count FROM child_nature_badges WHERE child_id = ?
    `).get(childId);

    const hygiene = this.db.prepare(`
      SELECT COUNT(*) as count FROM child_hygiene_badges WHERE child_id = ?
    `).get(childId);

    return {
      financial: financial.count,
      nature: nature.count,
      hygiene: hygiene.count,
      total: financial.count + nature.count + hygiene.count
    };
  }

  // ============================================
  // COMPARAÇÃO TEMPORAL
  // ============================================

  getComparisonStats(childId, currentDays = 30, previousDays = 30) {
    const current = this.getChildOverview(childId, currentDays);

    const previousStart = new Date();
    previousStart.setDate(previousStart.getDate() - (currentDays + previousDays));
    const previousEnd = new Date();
    previousEnd.setDate(previousEnd.getDate() - currentDays);

    // FP no período anterior
    const previousFp = this.db.prepare(`
      SELECT COALESCE(SUM(fp_earned), 0) as total
      FROM activities_completed
      WHERE child_id = ?
        AND DATE(completed_at) >= ?
        AND DATE(completed_at) < ?
    `).get(childId,
      previousStart.toISOString().split('T')[0],
      previousEnd.toISOString().split('T')[0]
    );

    const fpChange = current.fpStats.totalEarned - previousFp.total;
    const fpChangePercent = previousFp.total > 0
      ? Math.round((fpChange / previousFp.total) * 100)
      : 0;

    return {
      current,
      comparison: {
        fpChange,
        fpChangePercent,
        trend: fpChange > 0 ? 'up' : fpChange < 0 ? 'down' : 'stable'
      }
    };
  }

  // ============================================
  // FAMÍLIA OVERVIEW
  // ============================================

  getFamilyOverview(familyId, days = 30) {
    const children = this.db.prepare(`
      SELECT id, name, age_group, total_fp
      FROM children
      WHERE family_id = ?
      ORDER BY name
    `).all(familyId);

    const childrenStats = children.map(child => ({
      ...child,
      overview: this.getChildOverview(child.id, days)
    }));

    // Totais da família
    const totalFp = children.reduce((sum, child) => sum + (child.total_fp || 0), 0);
    const totalBadges = childrenStats.reduce((sum, child) =>
      sum + child.overview.totalBadges.total, 0
    );

    return {
      children: childrenStats,
      totals: {
        totalFp,
        totalBadges,
        childrenCount: children.length
      }
    };
  }
}

module.exports = AnalyticsManager;
