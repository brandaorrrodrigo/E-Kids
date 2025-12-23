// NATURE EDUCATION MANAGER
// Gerencia lições de natureza, plantas, animais e missões ambientais

class NatureEducationManager {
  constructor(db) {
    this.db = db;
  }

  // ============================================
  // LIÇÕES DE NATUREZA
  // ============================================

  /**
   * Lista todas as lições de natureza por categoria
   */
  getLessonsByCategory(categoryId, ageGroup = null) {
    let query = `
      SELECT nl.*, nc.name as category_name, nc.category_type
      FROM nature_lessons nl
      JOIN nature_categories nc ON nl.category_id = nc.id
      WHERE nl.category_id = ?
    `;

    const params = [categoryId];

    if (ageGroup) {
      query += ` AND (nl.age_group = ? OR nl.age_group IS NULL)`;
      params.push(ageGroup);
    }

    query += ` ORDER BY nl.id`;

    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  /**
   * Obtém uma lição específica com suas escolhas
   */
  getLessonWithChoices(lessonId) {
    const lesson = this.db.prepare(`
      SELECT nl.*, nc.name as category_name, nc.category_type
      FROM nature_lessons nl
      JOIN nature_categories nc ON nl.category_id = nc.id
      WHERE nl.id = ?
    `).get(lessonId);

    if (!lesson) return null;

    // Buscar escolhas se for tipo 'choice'
    if (lesson.lesson_type === 'choice') {
      const choices = this.db.prepare(`
        SELECT * FROM nature_choices
        WHERE lesson_id = ?
        ORDER BY display_order
      `).all(lessonId);

      lesson.choices = choices;
    }

    return lesson;
  }

  /**
   * Registra progresso em uma lição
   */
  completeLesson(childId, lessonId, choicesMade = null) {
    const lesson = this.db.prepare('SELECT * FROM nature_lessons WHERE id = ?').get(lessonId);
    if (!lesson) return null;

    // Registrar progresso
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO child_nature_progress (child_id, lesson_id, status, choices_made, completed_at)
      VALUES (?, ?, 'completed', ?, datetime('now'))
    `);

    stmt.run(childId, lessonId, choicesMade ? JSON.stringify(choicesMade) : null);

    // Dar FP de recompensa
    if (lesson.reward_fp > 0) {
      this.db.prepare('UPDATE children SET total_fp = total_fp + ? WHERE id = ?').run(lesson.reward_fp, childId);
    }

    return { lesson, fp_earned: lesson.reward_fp };
  }

  /**
   * Lista progresso de lições de uma criança
   */
  getChildProgress(childId, categoryId = null) {
    let query = `
      SELECT cnp.*, nl.title, nl.lesson_type, nc.name as category_name
      FROM child_nature_progress cnp
      JOIN nature_lessons nl ON cnp.lesson_id = nl.id
      JOIN nature_categories nc ON nl.category_id = nc.id
      WHERE cnp.child_id = ?
    `;

    const params = [childId];

    if (categoryId) {
      query += ` AND nl.category_id = ?`;
      params.push(categoryId);
    }

    query += ` ORDER BY cnp.completed_at DESC`;

    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  // ============================================
  // MISSÕES DE NATUREZA
  // ============================================

  /**
   * Lista missões de natureza disponíveis
   */
  getAvailableMissions(ageGroup = null) {
    let query = `
      SELECT nm.*, nc.name as category_name, nc.category_type
      FROM nature_missions nm
      JOIN nature_categories nc ON nm.category_id = nc.id
      WHERE nm.is_active = 1
    `;

    const params = [];

    if (ageGroup) {
      query += ` AND ? BETWEEN nm.age_group_min AND nm.age_group_max`;
      params.push(ageGroup);
    }

    query += ` ORDER BY nm.reward_fp ASC`;

    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  /**
   * Atribui missão de natureza a uma criança
   */
  assignMission(childId, missionId) {
    const mission = this.db.prepare('SELECT * FROM nature_missions WHERE id = ?').get(missionId);
    if (!mission) return null;

    const stmt = this.db.prepare(`
      INSERT INTO child_nature_missions (child_id, mission_id, current_progress, target_progress)
      VALUES (?, ?, 0, ?)
    `);

    return stmt.run(childId, missionId, mission.target_value);
  }

  /**
   * Atualiza progresso de missão
   */
  updateMissionProgress(childId, missionId, increment = 1, notes = null) {
    const stmt = this.db.prepare(`
      UPDATE child_nature_missions
      SET current_progress = current_progress + ?, notes = COALESCE(?, notes)
      WHERE child_id = ? AND mission_id = ? AND status = 'active'
    `);

    stmt.run(increment, notes, childId, missionId);

    // Verificar se completou
    const mission = this.db.prepare(`
      SELECT cnm.*, nm.name, nm.reward_fp, nm.mission_type
      FROM child_nature_missions cnm
      JOIN nature_missions nm ON cnm.mission_id = nm.id
      WHERE cnm.child_id = ? AND cnm.mission_id = ? AND cnm.status = 'active'
    `).get(childId, missionId);

    if (mission && mission.current_progress >= mission.target_progress) {
      this.completeMission(childId, missionId);
      return { completed: true, mission };
    }

    return { completed: false, mission };
  }

  /**
   * Completa missão de natureza
   */
  completeMission(childId, missionId) {
    // Marcar como completa
    this.db.prepare(`
      UPDATE child_nature_missions
      SET status = 'completed', completed_at = datetime('now')
      WHERE child_id = ? AND mission_id = ? AND status = 'active'
    `).run(childId, missionId);

    // Dar recompensa de FP
    const mission = this.db.prepare('SELECT * FROM nature_missions WHERE id = ?').get(missionId);
    if (mission && mission.reward_fp > 0) {
      this.db.prepare('UPDATE children SET total_fp = total_fp + ? WHERE id = ?').run(mission.reward_fp, childId);
    }

    return mission;
  }

  /**
   * Lista missões ativas de uma criança
   */
  getActiveMissions(childId) {
    const stmt = this.db.prepare(`
      SELECT cnm.*, nm.name, nm.description, nm.instructions, nm.reward_fp, nm.mission_type,
             nc.name as category_name
      FROM child_nature_missions cnm
      JOIN nature_missions nm ON cnm.mission_id = nm.id
      JOIN nature_categories nc ON nm.category_id = nc.id
      WHERE cnm.child_id = ? AND cnm.status = 'active'
      ORDER BY cnm.started_at DESC
    `);

    return stmt.all(childId);
  }

  /**
   * Lista missões completadas de uma criança
   */
  getCompletedMissions(childId) {
    const stmt = this.db.prepare(`
      SELECT cnm.*, nm.name, nm.description, nm.reward_fp, nc.name as category_name
      FROM child_nature_missions cnm
      JOIN nature_missions nm ON cnm.mission_id = nm.id
      JOIN nature_categories nc ON nm.category_id = nc.id
      WHERE cnm.child_id = ? AND cnm.status = 'completed'
      ORDER BY cnm.completed_at DESC
    `);

    return stmt.all(childId);
  }

  // ============================================
  // BADGES DE NATUREZA
  // ============================================

  /**
   * Verifica e concede badges de natureza
   */
  checkAndAwardBadges(childId) {
    const badges = this.db.prepare('SELECT * FROM nature_badges').all();
    const awarded = [];

    for (const badge of badges) {
      const alreadyHas = this.db.prepare(`
        SELECT id FROM child_nature_badges
        WHERE child_id = ? AND badge_id = ?
      `).get(childId, badge.id);

      if (alreadyHas) continue;

      const criteria = JSON.parse(badge.criteria || '{}');
      let shouldAward = false;

      // Verificar critérios
      if (criteria.care_days) {
        const missions = this.db.prepare(`
          SELECT COUNT(*) as count FROM child_nature_missions
          WHERE child_id = ? AND status = 'completed'
            AND current_progress >= ?
        `).get(childId, criteria.care_days);
        shouldAward = missions.count > 0;
      }

      if (criteria.animal_lessons) {
        const lessons = this.db.prepare(`
          SELECT COUNT(*) as count FROM child_nature_progress cnp
          JOIN nature_lessons nl ON cnp.lesson_id = nl.id
          JOIN nature_categories nc ON nl.category_id = nc.id
          WHERE cnp.child_id = ? AND nc.category_type = 'animals'
        `).get(childId);
        shouldAward = lessons.count >= criteria.animal_lessons;
      }

      if (criteria.nature_missions) {
        const missions = this.db.prepare(`
          SELECT COUNT(*) as count FROM child_nature_missions
          WHERE child_id = ? AND status = 'completed'
        `).get(childId);
        shouldAward = missions.count >= criteria.nature_missions;
      }

      if (shouldAward) {
        this.awardBadge(childId, badge.id);
        awarded.push(badge);
      }
    }

    return awarded;
  }

  /**
   * Concede badge de natureza
   */
  awardBadge(childId, badgeId) {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO child_nature_badges (child_id, badge_id)
      VALUES (?, ?)
    `);

    stmt.run(childId, badgeId);

    // Dar FP de recompensa
    const badge = this.db.prepare('SELECT reward_fp FROM nature_badges WHERE id = ?').get(badgeId);
    if (badge && badge.reward_fp > 0) {
      this.db.prepare('UPDATE children SET total_fp = total_fp + ? WHERE id = ?').run(badge.reward_fp, childId);
    }
  }

  /**
   * Lista badges de natureza de uma criança
   */
  getChildBadges(childId) {
    const stmt = this.db.prepare(`
      SELECT cnb.*, nb.name, nb.description, nb.badge_type, nb.icon
      FROM child_nature_badges cnb
      JOIN nature_badges nb ON cnb.badge_id = nb.id
      WHERE cnb.child_id = ?
      ORDER BY cnb.earned_at DESC
    `);

    return stmt.all(childId);
  }

  // ============================================
  // CATEGORIAS
  // ============================================

  /**
   * Lista todas as categorias de natureza
   */
  getAllCategories() {
    const stmt = this.db.prepare(`
      SELECT * FROM nature_categories
      ORDER BY display_order
    `);

    return stmt.all();
  }

  /**
   * Obtém estatísticas de uma categoria para uma criança
   */
  getCategoryStats(childId, categoryId) {
    const lessonsCompleted = this.db.prepare(`
      SELECT COUNT(*) as count FROM child_nature_progress cnp
      JOIN nature_lessons nl ON cnp.lesson_id = nl.id
      WHERE cnp.child_id = ? AND nl.category_id = ?
    `).get(childId, categoryId);

    const missionsCompleted = this.db.prepare(`
      SELECT COUNT(*) as count FROM child_nature_missions cnm
      JOIN nature_missions nm ON cnm.mission_id = nm.id
      WHERE cnm.child_id = ? AND nm.category_id = ? AND cnm.status = 'completed'
    `).get(childId, categoryId);

    return {
      lessons_completed: lessonsCompleted.count,
      missions_completed: missionsCompleted.count
    };
  }

  // ============================================
  // TEMAS VERDES (COFRINHO VERDE)
  // ============================================

  /**
   * Lista temas de natureza disponíveis
   */
  getAvailableThemes() {
    const stmt = this.db.prepare(`
      SELECT * FROM nature_themes
      ORDER BY unlock_fp_cost ASC
    `);

    return stmt.all();
  }

  /**
   * Desbloqueia tema de natureza
   */
  unlockTheme(childId, themeId) {
    const theme = this.db.prepare('SELECT * FROM nature_themes WHERE id = ?').get(themeId);
    if (!theme) return null;

    // Verificar se tem FP suficiente
    const child = this.db.prepare('SELECT total_fp FROM children WHERE id = ?').get(childId);
    if (child.total_fp < theme.unlock_fp_cost) {
      return { success: false, error: 'FP insuficiente' };
    }

    // Descontar FP
    this.db.prepare('UPDATE children SET total_fp = total_fp - ? WHERE id = ?').run(theme.unlock_fp_cost, childId);

    // Desbloquear tema
    this.db.prepare(`
      INSERT OR IGNORE INTO child_nature_themes (child_id, theme_id)
      VALUES (?, ?)
    `).run(childId, themeId);

    return { success: true, theme };
  }

  /**
   * Lista temas desbloqueados de uma criança
   */
  getUnlockedThemes(childId) {
    const stmt = this.db.prepare(`
      SELECT cnt.*, nt.name, nt.theme_type, nt.description
      FROM child_nature_themes cnt
      JOIN nature_themes nt ON cnt.theme_id = nt.id
      WHERE cnt.child_id = ?
      ORDER BY cnt.unlocked_at DESC
    `);

    return stmt.all(childId);
  }
}

module.exports = NatureEducationManager;
