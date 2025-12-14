// ============================================
// E-KIDS PRO - GERENCIADOR DE EVENTOS
// ============================================

/**
 * Busca eventos ativos no momento
 */
function getActiveEvents(db) {
  const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const events = db.prepare(`
    SELECT * FROM events
    WHERE is_active = 1
    AND date(start_date) <= date(?)
    AND date(end_date) >= date(?)
    ORDER BY start_date
  `).all(now, now);

  return events.map(event => ({
    ...event,
    days_remaining: getDaysRemaining(event.end_date),
    challenges: getEventChallenges(db, event.id)
  }));
}

/**
 * Calcula dias restantes do evento
 */
function getDaysRemaining(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Busca desafios de um evento
 */
function getEventChallenges(db, eventId) {
  return db.prepare(`
    SELECT * FROM event_challenges
    WHERE event_id = ? AND is_active = 1
  `).all(eventId);
}

/**
 * Busca próximos eventos (ainda não iniciados)
 */
function getUpcomingEvents(db, limit = 5) {
  const now = new Date().toISOString().split('T')[0];

  return db.prepare(`
    SELECT * FROM events
    WHERE is_active = 1
    AND date(start_date) > date(?)
    ORDER BY start_date
    LIMIT ?
  `).all(now, limit);
}

/**
 * Busca progresso da criança nos eventos ativos
 */
function getChildEventProgress(db, childId) {
  const activeEvents = getActiveEvents(db);
  const progress = [];

  activeEvents.forEach(event => {
    const eventProgress = db.prepare(`
      SELECT * FROM child_event_progress
      WHERE child_id = ? AND event_id = ?
    `).all(childId, event.id);

    progress.push({
      event: event,
      challenges_progress: eventProgress,
      total_fp_earned: eventProgress.reduce((sum, p) => sum + (p.fp_earned || 0), 0),
      completed_challenges: eventProgress.filter(p => p.completed).length,
      total_challenges: event.challenges.length
    });
  });

  return progress;
}

/**
 * Registra progresso em um desafio de evento
 */
function updateChallengeProgress(db, childId, eventId, challengeId, increment = 1) {
  // Buscar desafio
  const challenge = db.prepare(`
    SELECT * FROM event_challenges
    WHERE id = ? AND event_id = ?
  `).get(challengeId, eventId);

  if (!challenge) {
    throw new Error('Desafio não encontrado');
  }

  // Buscar ou criar progresso
  let progress = db.prepare(`
    SELECT * FROM child_event_progress
    WHERE child_id = ? AND event_id = ? AND challenge_id = ?
  `).get(childId, eventId, challengeId);

  if (!progress) {
    // Criar novo registro de progresso
    db.prepare(`
      INSERT INTO child_event_progress (child_id, event_id, challenge_id, progress)
      VALUES (?, ?, ?, ?)
    `).run(childId, eventId, challengeId, increment);

    progress = db.prepare(`
      SELECT * FROM child_event_progress
      WHERE child_id = ? AND event_id = ? AND challenge_id = ?
    `).get(childId, eventId, challengeId);
  } else {
    // Atualizar progresso existente
    const newProgress = progress.progress + increment;

    db.prepare(`
      UPDATE child_event_progress
      SET progress = ?
      WHERE id = ?
    `).run(newProgress, progress.id);

    progress.progress = newProgress;
  }

  // Verificar se completou o desafio
  if (progress.progress >= challenge.challenge_goal && !progress.completed) {
    completeChallenge(db, progress.id, challenge);
  }

  return progress;
}

/**
 * Completa um desafio e concede recompensas
 */
function completeChallenge(db, progressId, challenge) {
  const now = new Date().toISOString();

  // Marcar como completado
  db.prepare(`
    UPDATE child_event_progress
    SET completed = 1,
        completed_at = ?,
        fp_earned = ?,
        badges_earned = ?
    WHERE id = ?
  `).run(now, challenge.reward_fp, challenge.reward_badge, progressId);

  // Buscar criança para adicionar FP
  const progress = db.prepare(`
    SELECT * FROM child_event_progress WHERE id = ?
  `).get(progressId);

  // Adicionar FP à criança
  db.prepare(`
    UPDATE children
    SET total_fp = total_fp + ?
    WHERE id = ?
  `).run(challenge.reward_fp, progress.child_id);

  // Se tiver badge, adicionar
  if (challenge.reward_badge) {
    try {
      db.prepare(`
        INSERT INTO child_badges (child_id, badge_key, earned_at)
        VALUES (?, ?, ?)
      `).run(progress.child_id, challenge.reward_badge, now);
    } catch (error) {
      // Badge já existe, ignorar
      console.log('Badge já existe:', challenge.reward_badge);
    }
  }

  return {
    completed: true,
    fp_earned: challenge.reward_fp,
    badge_earned: challenge.reward_badge
  };
}

/**
 * Calcula multiplicador de FP para missões durante evento
 */
function getEventMultiplier(db, area = null) {
  const activeEvents = getActiveEvents(db);

  let bestMultiplier = 1.0;

  activeEvents.forEach(event => {
    // Se o evento é específico de uma área, aplicar só para essa área
    if (event.area && area) {
      if (event.area === area && event.reward_multiplier > bestMultiplier) {
        bestMultiplier = event.reward_multiplier;
      }
    } else if (!event.area) {
      // Evento global, aplicar para todas as áreas
      if (event.reward_multiplier > bestMultiplier) {
        bestMultiplier = event.reward_multiplier;
      }
    }
  });

  return bestMultiplier;
}

/**
 * Ativa/desativa eventos automaticamente baseado nas datas
 */
function autoActivateEvents(db) {
  const now = new Date().toISOString().split('T')[0];

  // Ativar eventos que começaram
  const activated = db.prepare(`
    UPDATE events
    SET is_active = 1
    WHERE date(start_date) <= date(?)
    AND date(end_date) >= date(?)
    AND is_active = 0
  `).run(now, now);

  // Desativar eventos que terminaram
  const deactivated = db.prepare(`
    UPDATE events
    SET is_active = 0
    WHERE date(end_date) < date(?)
    AND is_active = 1
  `).run(now);

  return {
    activated: activated.changes,
    deactivated: deactivated.changes
  };
}

/**
 * Cria evento customizado
 */
function createEvent(db, eventData) {
  const {
    name,
    description,
    startDate,
    endDate,
    rewardMultiplier = 1.5,
    badgeReward = null,
    eventType = 'custom',
    area = null
  } = eventData;

  const result = db.prepare(`
    INSERT INTO events (
      name, description, start_date, end_date,
      reward_multiplier, badge_reward, event_type, area, is_active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    name, description, startDate, endDate,
    rewardMultiplier, badgeReward, eventType, area
  );

  return {
    id: result.lastInsertRowid,
    ...eventData
  };
}

module.exports = {
  getActiveEvents,
  getUpcomingEvents,
  getChildEventProgress,
  updateChallengeProgress,
  completeChallenge,
  getEventMultiplier,
  autoActivateEvents,
  createEvent,
  getEventChallenges,
  getDaysRemaining
};
