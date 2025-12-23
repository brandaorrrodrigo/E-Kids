// HYGIENE EDUCATION MANAGER
// Gerencia hábitos de higiene, tracking e missões de autocuidado

class HygieneEducationManager {
  constructor(db) {
    this.db = db;
  }

  // ============================================
  // HÁBITOS DE HIGIENE
  // ============================================

  /**
   * Lista todos os hábitos por categoria
   */
  getHabitsByCategory(categoryId, ageGroup = null) {
    let query = `
      SELECT hh.*, hc.name as category_name, hc.category_type
      FROM hygiene_habits hh
      JOIN hygiene_categories hc ON hh.category_id = hc.id
      WHERE hh.category_id = ? AND hh.is_active = 1
    `;

    const params = [categoryId];

    if (ageGroup) {
      query += ` AND ? BETWEEN hh.age_group_min AND hh.age_group_max`;
      params.push(ageGroup);
    }

    query += ` ORDER BY hh.id`;

    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  /**
   * Lista todos os hábitos disponíveis
   */
  getAllHabits(ageGroup = null) {
    let query = `
      SELECT hh.*, hc.name as category_name, hc.category_type, hc.icon as category_icon
      FROM hygiene_habits hh
      JOIN hygiene_categories hc ON hh.category_id = hc.id
      WHERE hh.is_active = 1
    `;

    const params = [];

    if (ageGroup) {
      query += ` AND ? BETWEEN hh.age_group_min AND hh.age_group_max`;
      params.push(ageGroup);
    }

    query += ` ORDER BY hc.display_order, hh.id`;

    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  /**
   * Registra conclusão de um hábito
   */
  trackHabit(childId, habitId, date = null, notes = null) {
    const habit = this.db.prepare('SELECT * FROM hygiene_habits WHERE id = ?').get(habitId);
    if (!habit) return null;

    const trackDate = date || new Date().toISOString().split('T')[0];

    // Verificar se já foi registrado hoje
    const existing = this.db.prepare(`
      SELECT * FROM child_hygiene_tracking
      WHERE child_id = ? AND habit_id = ? AND tracked_date = ?
    `).get(childId, habitId, trackDate);

    if (existing) {
      // Incrementar vezes completadas
      this.db.prepare(`
        UPDATE child_hygiene_tracking
        SET times_completed = times_completed + 1, fp_earned = fp_earned + ?
        WHERE id = ?
      `).run(habit.reward_fp, existing.id);

      // Dar FP
      this.db.prepare('UPDATE children SET total_fp = total_fp + ? WHERE id = ?').run(habit.reward_fp, childId);

      return { times_completed: existing.times_completed + 1, fp_earned: habit.reward_fp };
    }

    // Inserir novo registro
    const stmt = this.db.prepare(`
      INSERT INTO child_hygiene_tracking (child_id, habit_id, tracked_date, times_completed, fp_earned, notes)
      VALUES (?, ?, ?, 1, ?, ?)
    `);

    stmt.run(childId, habitId, trackDate, habit.reward_fp, notes);

    // Dar FP
    this.db.prepare('UPDATE children SET total_fp = total_fp + ? WHERE id = ?').run(habit.reward_fp, childId);

    // Atualizar estatísticas
    this.updateStats(childId);

    return { times_completed: 1, fp_earned: habit.reward_fp };
  }

  /**
   * Obtém hábitos completados em uma data específica
   */
  getHabitsForDate(childId, date) {
    const stmt = this.db.prepare(`
      SELECT cht.*, hh.habit_name, hh.category_id, hc.name as category_name
      FROM child_hygiene_tracking cht
      JOIN hygiene_habits hh ON cht.habit_id = hh.id
      JOIN hygiene_categories hc ON hh.category_id = hc.id
      WHERE cht.child_id = ? AND cht.tracked_date = ?
      ORDER BY cht.created_at DESC
    `);

    return stmt.all(childId, date);
  }

  /**
   * Obtém histórico de hábitos
   */
  getHabitHistory(childId, days = 30) {
    const stmt = this.db.prepare(`
      SELECT cht.*, hh.habit_name, hc.name as category_name
      FROM child_hygiene_tracking cht
      JOIN hygiene_habits hh ON cht.habit_id = hh.id
      JOIN hygiene_categories hc ON hh.category_id = hc.id
      WHERE cht.child_id = ? AND cht.tracked_date >= date('now', '-' || ? || ' days')
      ORDER BY cht.tracked_date DESC, cht.created_at DESC
    `);

    return stmt.all(childId, days);
  }

  // ============================================
  // ESTATÍSTICAS
  // ============================================

  /**
   * Atualiza estatísticas de higiene da criança
   */
  updateStats(childId) {
    // Total de hábitos completados
    const total = this.db.prepare(`
      SELECT SUM(times_completed) as total FROM child_hygiene_tracking
      WHERE child_id = ?
    `).get(childId);

    // Sequência atual
    const streak = this.calculateCurrentStreak(childId);

    // Sequência mais longa
    const longestStreak = this.calculateLongestStreak(childId);

    // Última data registrada
    const lastDate = this.db.prepare(`
      SELECT MAX(tracked_date) as date FROM child_hygiene_tracking
      WHERE child_id = ?
    `).get(childId);

    // Calcular score de frequência (últimos 30 dias)
    const frequencyScore = this.calculateFrequencyScore(childId);

    // Atualizar ou inserir
    this.db.prepare(`
      INSERT INTO child_hygiene_stats
        (child_id, total_habits_completed, current_streak_days, longest_streak_days, last_tracked_date, frequency_score)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(child_id) DO UPDATE SET
        total_habits_completed = excluded.total_habits_completed,
        current_streak_days = excluded.current_streak_days,
        longest_streak_days = CASE
          WHEN excluded.longest_streak_days > longest_streak_days
          THEN excluded.longest_streak_days
          ELSE longest_streak_days
        END,
        last_tracked_date = excluded.last_tracked_date,
        frequency_score = excluded.frequency_score,
        updated_at = datetime('now')
    `).run(childId, total.total || 0, streak, longestStreak, lastDate.date, frequencyScore);
  }

  /**
   * Calcula sequência atual de dias
   */
  calculateCurrentStreak(childId) {
    const dates = this.db.prepare(`
      SELECT DISTINCT tracked_date FROM child_hygiene_tracking
      WHERE child_id = ?
      ORDER BY tracked_date DESC
      LIMIT 365
    `).all(childId);

    if (dates.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const row of dates) {
      const trackedDate = new Date(row.tracked_date);
      trackedDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((currentDate - trackedDate) / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
        currentDate = new Date(trackedDate);
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Calcula sequência mais longa
   */
  calculateLongestStreak(childId) {
    const dates = this.db.prepare(`
      SELECT DISTINCT tracked_date FROM child_hygiene_tracking
      WHERE child_id = ?
      ORDER BY tracked_date ASC
    `).all(childId);

    if (dates.length === 0) return 0;

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1].tracked_date);
      const currDate = new Date(dates[i].tracked_date);

      const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return longestStreak;
  }

  /**
   * Calcula score de frequência (0-100)
   */
  calculateFrequencyScore(childId, days = 30) {
    const tracked = this.db.prepare(`
      SELECT COUNT(DISTINCT tracked_date) as count
      FROM child_hygiene_tracking
      WHERE child_id = ? AND tracked_date >= date('now', '-' || ? || ' days')
    `).get(childId, days);

    return (tracked.count / days) * 100;
  }

  /**
   * Obtém estatísticas da criança
   */
  getStats(childId) {
    const stats = this.db.prepare(`
      SELECT * FROM child_hygiene_stats WHERE child_id = ?
    `).get(childId);

    if (!stats) {
      this.updateStats(childId);
      return this.db.prepare(`SELECT * FROM child_hygiene_stats WHERE child_id = ?`).get(childId);
    }

    return stats;
  }

  // ============================================
  // MISSÕES DE HIGIENE
  // ============================================

  /**
   * Lista missões de higiene disponíveis
   */
  getAvailableMissions(ageGroup = null) {
    let query = `
      SELECT hm.*, hc.name as category_name, hc.category_type
      FROM hygiene_missions hm
      JOIN hygiene_categories hc ON hm.category_id = hc.id
      WHERE hm.is_active = 1
    `;

    const params = [];

    if (ageGroup) {
      query += ` AND ? BETWEEN hm.age_group_min AND hm.age_group_max`;
      params.push(ageGroup);
    }

    query += ` ORDER BY hm.reward_fp ASC`;

    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  /**
   * Atribui missão a uma criança
   */
  assignMission(childId, missionId) {
    const mission = this.db.prepare('SELECT * FROM hygiene_missions WHERE id = ?').get(missionId);
    if (!mission) return null;

    const stmt = this.db.prepare(`
      INSERT INTO child_hygiene_missions (child_id, mission_id, current_progress, target_progress)
      VALUES (?, ?, 0, ?)
    `);

    return stmt.run(childId, missionId, mission.target_completions);
  }

  /**
   * Atualiza progresso de missão
   */
  updateMissionProgress(childId, missionId, increment = 1) {
    const stmt = this.db.prepare(`
      UPDATE child_hygiene_missions
      SET current_progress = current_progress + ?
      WHERE child_id = ? AND mission_id = ? AND status = 'active'
    `);

    stmt.run(increment, childId, missionId);

    // Verificar se completou
    const mission = this.db.prepare(`
      SELECT chm.*, hm.name, hm.reward_fp
      FROM child_hygiene_missions chm
      JOIN hygiene_missions hm ON chm.mission_id = hm.id
      WHERE chm.child_id = ? AND chm.mission_id = ? AND chm.status = 'active'
    `).get(childId, missionId);

    if (mission && mission.current_progress >= mission.target_progress) {
      this.completeMission(childId, missionId);
      return { completed: true, mission };
    }

    return { completed: false, mission };
  }

  /**
   * Completa missão
   */
  completeMission(childId, missionId) {
    // Marcar como completa
    this.db.prepare(`
      UPDATE child_hygiene_missions
      SET status = 'completed', completed_at = datetime('now')
      WHERE child_id = ? AND mission_id = ? AND status = 'active'
    `).run(childId, missionId);

    // Dar recompensa de FP
    const mission = this.db.prepare('SELECT * FROM hygiene_missions WHERE id = ?').get(missionId);
    if (mission && mission.reward_fp > 0) {
      this.db.prepare('UPDATE children SET total_fp = total_fp + ? WHERE id = ?').run(mission.reward_fp, childId);
    }

    return mission;
  }

  /**
   * Lista missões ativas
   */
  getActiveMissions(childId) {
    const stmt = this.db.prepare(`
      SELECT chm.*, hm.name, hm.description, hm.instructions, hm.reward_fp,
             hc.name as category_name
      FROM child_hygiene_missions chm
      JOIN hygiene_missions hm ON chm.mission_id = hm.id
      JOIN hygiene_categories hc ON hm.category_id = hc.id
      WHERE chm.child_id = ? AND chm.status = 'active'
    `);

    return stmt.all(childId);
  }

  // ============================================
  // BADGES
  // ============================================

  /**
   * Verifica e concede badges
   */
  checkAndAwardBadges(childId) {
    const badges = this.db.prepare('SELECT * FROM hygiene_badges').all();
    const stats = this.getStats(childId);
    const awarded = [];

    for (const badge of badges) {
      const alreadyHas = this.db.prepare(`
        SELECT id FROM child_hygiene_badges
        WHERE child_id = ? AND badge_id = ?
      `).get(childId, badge.id);

      if (alreadyHas) continue;

      const criteria = JSON.parse(badge.criteria || '{}');
      let shouldAward = false;

      if (criteria.hand_wash_streak && stats.current_streak_days >= criteria.hand_wash_streak) {
        shouldAward = true;
      }

      if (criteria.teeth_brush_streak && stats.current_streak_days >= criteria.teeth_brush_streak) {
        shouldAward = true;
      }

      if (criteria.full_routine_streak && stats.current_streak_days >= criteria.full_routine_streak) {
        shouldAward = true;
      }

      if (criteria.total_habits && stats.total_habits_completed >= criteria.total_habits) {
        shouldAward = true;
      }

      if (criteria.longest_streak && stats.longest_streak_days >= criteria.longest_streak) {
        shouldAward = true;
      }

      if (shouldAward) {
        this.awardBadge(childId, badge.id);
        awarded.push(badge);
      }
    }

    return awarded;
  }

  /**
   * Concede badge
   */
  awardBadge(childId, badgeId) {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO child_hygiene_badges (child_id, badge_id)
      VALUES (?, ?)
    `);

    stmt.run(childId, badgeId);

    // Dar FP de recompensa
    const badge = this.db.prepare('SELECT reward_fp FROM hygiene_badges WHERE id = ?').get(badgeId);
    if (badge && badge.reward_fp > 0) {
      this.db.prepare('UPDATE children SET total_fp = total_fp + ? WHERE id = ?').run(badge.reward_fp, childId);
    }
  }

  /**
   * Lista badges da criança
   */
  getChildBadges(childId) {
    const stmt = this.db.prepare(`
      SELECT chb.*, hb.name, hb.description, hb.badge_type, hb.icon
      FROM child_hygiene_badges chb
      JOIN hygiene_badges hb ON chb.badge_id = hb.id
      WHERE chb.child_id = ?
      ORDER BY chb.earned_at DESC
    `);

    return stmt.all(childId);
  }

  // ============================================
  // CATEGORIAS
  // ============================================

  /**
   * Lista todas as categorias
   */
  getAllCategories() {
    const stmt = this.db.prepare(`
      SELECT * FROM hygiene_categories
      ORDER BY display_order
    `);

    return stmt.all();
  }
}

module.exports = HygieneEducationManager;
