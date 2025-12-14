// ================================================
// MINI-GAMES MANAGER - DIA 6
// ================================================
// Gerenciamento de 4 mini-games educativos:
// 1. Jogo da Memória - Exercita memória visual
// 2. Quiz Rápido - Conhecimentos gerais
// 3. Caça ao Tesouro - Exploração do app
// 4. Diário Diário - Reflexão e escrita
// ================================================

/**
 * LISTAR TODOS OS MINI-GAMES DISPONÍVEIS
 * @param {Database} db - Instância do banco
 * @returns {Array} - Lista de mini-games
 */
function listAvailableGames(db) {
  const games = db.prepare(`
    SELECT * FROM minigames_catalog
    WHERE is_active = 1
    ORDER BY id ASC
  `).all();

  return {
    success: true,
    totalGames: games.length,
    games: games.map(g => ({
      ...g,
      difficulty_levels: g.difficulty_levels.split(',')
    }))
  };
}

/**
 * COMEÇAR NOVO JOGO
 * @param {Database} db - Instância do banco
 * @param {Number} childId - ID da criança
 * @param {String} gameKey - Chave do jogo
 * @param {String} difficulty - Dificuldade
 * @returns {Object} - Dados para iniciar o jogo
 */
function startGame(db, childId, gameKey, difficulty = 'facil') {
  // Verificar se criança existe
  const child = db.prepare('SELECT * FROM children WHERE id = ?').get(childId);
  if (!child) {
    throw new Error('Criança não encontrada');
  }

  // Buscar jogo
  const game = db.prepare('SELECT * FROM minigames_catalog WHERE game_key = ? AND is_active = 1').get(gameKey);
  if (!game) {
    throw new Error('Jogo não encontrado');
  }

  // Verificar limite de jogadas por dia (se aplicável)
  if (game.plays_per_day !== null) {
    const playsToday = db.prepare(`
      SELECT COUNT(*) as count
      FROM minigame_plays
      WHERE child_id = ? AND game_key = ? AND DATE(played_at) = DATE('now')
    `).get(childId, gameKey).count;

    if (playsToday >= game.plays_per_day) {
      return {
        success: false,
        error: 'limit_reached',
        message: `Você já jogou ${game.game_name} ${game.plays_per_day}x hoje! Volte amanhã.`,
        playsToday,
        maxPlays: game.plays_per_day
      };
    }
  }

  // Gerar conteúdo do jogo baseado no tipo
  let gameContent = {};

  switch (gameKey) {
    case 'memoria':
      gameContent = generateMemoryGame(difficulty);
      break;
    case 'quiz':
      gameContent = generateQuiz(difficulty);
      break;
    case 'cacaotesouro':
      gameContent = generateTreasureHunt(difficulty);
      break;
    case 'diario':
      gameContent = generateDiaryPrompt();
      break;
    default:
      throw new Error('Tipo de jogo não implementado');
  }

  return {
    success: true,
    game: {
      game_key: game.game_key,
      game_name: game.game_name,
      icon: game.icon,
      difficulty,
      fp_reward_range: [game.fp_reward_min, game.fp_reward_max]
    },
    content: gameContent,
    message: `Boa sorte, ${child.name}! 🎮`
  };
}

/**
 * REGISTRAR JOGADA COMPLETADA
 * @param {Database} db - Instância do banco
 * @param {Object} playData - Dados da jogada
 * @returns {Object} - Resultado com FP ganho
 */
function recordPlay(db, playData) {
  const {
    childId,
    gameKey,
    difficulty = 'facil',
    score = 0,
    timeSeconds = 0,
    completed = 1,
    gameData = null
  } = playData;

  // Buscar jogo
  const game = db.prepare('SELECT * FROM minigames_catalog WHERE game_key = ?').get(gameKey);
  if (!game) {
    throw new Error('Jogo não encontrado');
  }

  // Calcular FP ganho baseado em performance
  const fpEarned = calculateFpReward(game, score, timeSeconds, completed, difficulty);

  // TRANSAÇÃO: Registrar jogada + Atualizar FP (trigger automático)
  const transaction = db.transaction(() => {
    // 1. Registrar jogada
    const insertStmt = db.prepare(`
      INSERT INTO minigame_plays
      (child_id, game_key, difficulty, score, time_seconds, completed, fp_earned, game_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      childId,
      gameKey,
      difficulty,
      score,
      timeSeconds,
      completed,
      fpEarned,
      gameData ? JSON.stringify(gameData) : null
    );

    // Trigger automático atualiza FP da criança

    return result.lastInsertRowid;
  });

  const playId = transaction();

  // Verificar conquistas desbloqueadas
  const newAchievements = checkAndUnlockMinigameAchievements(db, childId, gameKey);

  // Buscar novo saldo de FP
  const newFpBalance = db.prepare('SELECT fp_balance FROM children WHERE id = ?').get(childId).fp_balance;

  return {
    success: true,
    playId,
    fpEarned,
    newFpBalance,
    newAchievements: newAchievements.length > 0 ? newAchievements : null,
    message: fpEarned > 0
      ? `🎉 Você ganhou ${fpEarned} FP!`
      : 'Jogo registrado! Continue tentando para ganhar mais FP.'
  };
}

/**
 * CALCULAR FP GANHO BASEADO EM PERFORMANCE
 * @param {Object} game - Dados do jogo
 * @param {Number} score - Pontuação
 * @param {Number} timeSeconds - Tempo em segundos
 * @param {Number} completed - Se completou (0 ou 1)
 * @param {String} difficulty - Dificuldade
 * @returns {Number} - FP ganho
 */
function calculateFpReward(game, score, timeSeconds, completed, difficulty) {
  if (!completed) return 0;

  let baseFp = game.fp_reward_min;
  const maxFp = game.fp_reward_max;

  // Multiplicador de dificuldade
  const difficultyMultiplier = {
    'facil': 1.0,
    'medio': 1.3,
    'dificil': 1.6,
    'livre': 1.0
  }[difficulty] || 1.0;

  // FP baseado em score (0-100)
  const scorePercentage = Math.min(score, 100) / 100;
  let fpFromScore = baseFp + ((maxFp - baseFp) * scorePercentage);

  // Aplicar multiplicador de dificuldade
  fpFromScore *= difficultyMultiplier;

  // Bônus por velocidade (se completou rápido)
  if (timeSeconds > 0 && timeSeconds < 60) {
    const speedBonus = Math.floor((60 - timeSeconds) / 10); // +1 FP a cada 10s economizado
    fpFromScore += speedBonus;
  }

  // Arredondar e garantir limites
  return Math.max(
    game.fp_reward_min,
    Math.min(Math.round(fpFromScore), maxFp * 2) // Até 2x o máximo com bônus
  );
}

/**
 * VERIFICAR E DESBLOQUEAR CONQUISTAS DE MINI-GAMES
 * @param {Database} db - Instância do banco
 * @param {Number} childId - ID da criança
 * @param {String} gameKey - Chave do jogo
 * @returns {Array} - Conquistas desbloqueadas
 */
function checkAndUnlockMinigameAchievements(db, childId, gameKey) {
  // Buscar estatísticas da criança neste jogo
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total_plays,
      SUM(completed) as completed_plays,
      MAX(score) as high_score,
      MIN(CASE WHEN completed = 1 THEN time_seconds END) as best_time,
      (SELECT COUNT(DISTINCT DATE(played_at))
       FROM minigame_plays
       WHERE child_id = ? AND game_key = ? AND completed = 1
       AND DATE(played_at) BETWEEN DATE('now', '-30 days') AND DATE('now')) as streak_days
    FROM minigame_plays
    WHERE child_id = ? AND game_key = ?
  `).get(childId, gameKey, childId, gameKey);

  // Última jogada
  const lastPlay = db.prepare(`
    SELECT * FROM minigame_plays
    WHERE child_id = ? AND game_key = ?
    ORDER BY played_at DESC
    LIMIT 1
  `).get(childId, gameKey);

  // Buscar conquistas ainda não desbloqueadas
  const availableAchievements = db.prepare(`
    SELECT *
    FROM minigame_achievements
    WHERE game_key = ?
    AND achievement_key NOT IN (
      SELECT achievement_key
      FROM child_minigame_achievements
      WHERE child_id = ?
    )
  `).all(gameKey, childId);

  const unlockedAchievements = [];

  // Verificar cada conquista
  availableAchievements.forEach(achievement => {
    let shouldUnlock = false;

    switch (achievement.unlock_condition) {
      case 'first_play':
        shouldUnlock = stats.total_plays === 1;
        break;

      case '5_plays':
        shouldUnlock = stats.total_plays >= 5;
        break;

      case '10_plays':
        shouldUnlock = stats.total_plays >= 10;
        break;

      case '10_perfect':
        // 10 quizzes perfeitos
        const perfectCount = db.prepare(`
          SELECT COUNT(*) as count
          FROM minigame_plays
          WHERE child_id = ? AND game_key = ? AND score = 100 AND completed = 1
        `).get(childId, gameKey).count;
        shouldUnlock = perfectCount >= 10;
        break;

      case '50_correct':
        // 50 perguntas corretas (quiz)
        const correctAnswers = db.prepare(`
          SELECT SUM(score) as total
          FROM minigame_plays
          WHERE child_id = ? AND game_key = 'quiz'
        `).get(childId).total || 0;
        shouldUnlock = correctAnswers >= 50;
        break;

      case 'perfect_score':
        shouldUnlock = stats.high_score === 100;
        break;

      case 'speed_30s':
        shouldUnlock = stats.best_time !== null && stats.best_time <= 30;
        break;

      case 'speed_5s':
        shouldUnlock = lastPlay && lastPlay.time_seconds <= 5 && lastPlay.completed === 1;
        break;

      case 'all_treasures':
        // Encontrou todos os tesouros em uma jogada
        shouldUnlock = lastPlay && lastPlay.score === 100 && lastPlay.completed === 1;
        break;

      case 'secret_treasure':
        // Tesouro secreto (game_data contém "secret": true)
        if (lastPlay && lastPlay.game_data) {
          try {
            const data = JSON.parse(lastPlay.game_data);
            shouldUnlock = data.foundSecret === true;
          } catch (e) {}
        }
        break;

      case '7_streak':
        shouldUnlock = stats.streak_days >= 7;
        break;

      case '30_streak':
        shouldUnlock = stats.streak_days >= 30;
        break;

      case 'long_entry':
        // Diário com 100+ palavras
        if (lastPlay && lastPlay.game_data) {
          try {
            const data = JSON.parse(lastPlay.game_data);
            const wordCount = (data.entry || '').split(/\s+/).length;
            shouldUnlock = wordCount >= 100;
          } catch (e) {}
        }
        break;
    }

    if (shouldUnlock) {
      // Desbloquear conquista
      try {
        db.prepare(`
          INSERT OR IGNORE INTO child_minigame_achievements (child_id, achievement_key)
          VALUES (?, ?)
        `).run(childId, achievement.achievement_key);

        unlockedAchievements.push(achievement);
        // Trigger automático já adiciona FP
      } catch (e) {
        // Já desbloqueada (race condition)
      }
    }
  });

  return unlockedAchievements;
}

/**
 * ESTATÍSTICAS DE MINI-GAMES DA CRIANÇA
 * @param {Database} db - Instância do banco
 * @param {Number} childId - ID da criança
 * @returns {Object} - Estatísticas completas
 */
function getChildMinigameStats(db, childId) {
  // Estatísticas por jogo
  const statsByGame = db.prepare(`
    SELECT * FROM v_child_minigame_stats
    WHERE child_id = ?
  `).all(childId);

  // Total de jogadas
  const totalPlays = db.prepare(`
    SELECT COUNT(*) as count FROM minigame_plays WHERE child_id = ?
  `).get(childId).count;

  // Total de FP ganho
  const totalFpEarned = db.prepare(`
    SELECT COALESCE(SUM(fp_earned), 0) as total
    FROM minigame_plays
    WHERE child_id = ?
  `).get(childId).total;

  // Conquistas desbloqueadas
  const achievements = db.prepare(`
    SELECT
      cma.achievement_key,
      ma.achievement_name,
      ma.icon,
      ma.game_key,
      ma.fp_reward,
      ma.is_secret,
      cma.unlocked_at
    FROM child_minigame_achievements cma
    JOIN minigame_achievements ma ON cma.achievement_key = ma.achievement_key
    WHERE cma.child_id = ?
    ORDER BY cma.unlocked_at DESC
  `).all(childId);

  // Jogo favorito (mais jogado)
  const favoriteGame = db.prepare(`
    SELECT
      mg.game_key,
      mg.game_name,
      mg.icon,
      COUNT(*) as plays
    FROM minigame_plays mp
    JOIN minigames_catalog mg ON mp.game_key = mg.game_key
    WHERE mp.child_id = ?
    GROUP BY mp.game_key
    ORDER BY COUNT(*) DESC
    LIMIT 1
  `).get(childId);

  return {
    success: true,
    stats: {
      totalPlays,
      totalFpEarned,
      totalAchievements: achievements.length,
      favoriteGame: favoriteGame || null,
      byGame: statsByGame,
      achievements
    }
  };
}

/**
 * RANKING GLOBAL DE UM MINI-GAME
 * @param {Database} db - Instância do banco
 * @param {String} gameKey - Chave do jogo
 * @param {Number} limit - Limite de resultados
 * @returns {Object} - Ranking
 */
function getGameLeaderboard(db, gameKey, limit = 10) {
  const leaderboard = db.prepare(`
    SELECT * FROM v_minigame_leaderboard
    WHERE game_key = ?
    ORDER BY rank ASC
    LIMIT ?
  `).all(gameKey, limit);

  const game = db.prepare('SELECT * FROM minigames_catalog WHERE game_key = ?').get(gameKey);

  return {
    success: true,
    game: {
      game_key: game.game_key,
      game_name: game.game_name,
      icon: game.icon
    },
    leaderboard,
    total: leaderboard.length
  };
}

// ================================================
// GERADORES DE CONTEÚDO DOS JOGOS
// ================================================

/**
 * GERAR JOGO DA MEMÓRIA
 */
function generateMemoryGame(difficulty) {
  const pairsCount = {
    'facil': 8,
    'medio': 12,
    'dificil': 16
  }[difficulty] || 8;

  // Pool de emojis para as cartas
  const emojiPool = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐',
    '😀', '😢', '😠', '😱', '🤔', '😴', '🥳', '😎',
    '⚽', '🏀', '🎮', '🎸', '🎨', '📚', '🚗', '✈️'
  ];

  // Selecionar emojis aleatórios
  const shuffled = emojiPool.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, pairsCount);

  // Criar pares e embaralhar
  const cards = [...selected, ...selected]
    .map((emoji, index) => ({
      id: index,
      emoji,
      flipped: false,
      matched: false
    }))
    .sort(() => Math.random() - 0.5);

  return {
    type: 'memoria',
    difficulty,
    totalPairs: pairsCount,
    cards,
    maxScore: 100,
    instructions: 'Encontre todos os pares de cartas! Menos erros = mais FP.'
  };
}

/**
 * GERAR QUIZ
 */
function generateQuiz(difficulty) {
  const questionsCount = {
    'facil': 5,
    'medio': 8,
    'dificil': 10
  }[difficulty] || 5;

  // Pool de perguntas
  const questionPool = {
    facil: [
      { question: 'Quanto é 2 + 2?', options: ['3', '4', '5', '6'], correct: 1 },
      { question: 'Qual é a cor do céu?', options: ['Verde', 'Azul', 'Vermelho', 'Amarelo'], correct: 1 },
      { question: 'Quantas patas tem um cachorro?', options: ['2', '3', '4', '5'], correct: 2 },
      { question: 'O que as plantas precisam para viver?', options: ['Só água', 'Só sol', 'Sol, água e ar', 'Nada'], correct: 2 },
      { question: 'Qual é o animal que mia?', options: ['Cachorro', 'Gato', 'Pássaro', 'Peixe'], correct: 1 },
      { question: 'Quanto é 5 + 3?', options: ['6', '7', '8', '9'], correct: 2 },
      { question: 'Qual é a forma de uma bola?', options: ['Quadrado', 'Triângulo', 'Círculo', 'Retângulo'], correct: 2 }
    ],
    medio: [
      { question: 'Quanto é 7 x 3?', options: ['18', '21', '24', '27'], correct: 1 },
      { question: 'Quantos dias tem uma semana?', options: ['5', '6', '7', '8'], correct: 2 },
      { question: 'Qual é o planeta mais próximo do Sol?', options: ['Terra', 'Marte', 'Mercúrio', 'Vênus'], correct: 2 },
      { question: 'Quanto é 15 - 8?', options: ['5', '6', '7', '8'], correct: 2 },
      { question: 'Quantos meses tem um ano?', options: ['10', '11', '12', '13'], correct: 2 },
      { question: 'Qual é o maior animal do mundo?', options: ['Elefante', 'Girafa', 'Baleia Azul', 'Tubarão'], correct: 2 }
    ],
    dificil: [
      { question: 'Quanto é 12 x 8?', options: ['84', '92', '96', '104'], correct: 2 },
      { question: 'Quantos continentes existem?', options: ['5', '6', '7', '8'], correct: 2 },
      { question: 'Qual é a capital do Brasil?', options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'], correct: 2 },
      { question: 'Quanto é 100 ÷ 4?', options: ['20', '25', '30', '35'], correct: 1 },
      { question: 'Quantos segundos tem um minuto?', options: ['50', '55', '60', '65'], correct: 2 }
    ]
  };

  const pool = questionPool[difficulty] || questionPool.facil;
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, questionsCount);

  return {
    type: 'quiz',
    difficulty,
    totalQuestions: questionsCount,
    questions: selected.map((q, i) => ({
      id: i + 1,
      question: q.question,
      options: q.options,
      correctIndex: q.correct
    })),
    maxScore: 100,
    instructions: 'Responda as perguntas corretamente! Cada acerto vale pontos.'
  };
}

/**
 * GERAR CAÇA AO TESOURO
 */
function generateTreasureHunt(difficulty) {
  const treasuresCount = {
    'facil': 3,
    'medio': 5,
    'dificil': 7
  }[difficulty] || 3;

  // Locais possíveis para esconder tesouros
  const locations = [
    { id: 'dashboard', name: 'Dashboard', clue: 'Onde você vê seu mascote todos os dias' },
    { id: 'missoes', name: 'Missões', clue: 'Onde você completa tarefas diárias' },
    { id: 'badges', name: 'Conquistas', clue: 'Onde ficam seus badges de ouro' },
    { id: 'recompensas', name: 'Recompensas', clue: 'Onde você gasta seus FP' },
    { id: 'diario', name: 'Diário', clue: 'Onde você escreve seus pensamentos' },
    { id: 'perfil', name: 'Perfil', clue: 'Onde está sua foto e nome' },
    { id: 'loja', name: 'Loja Virtual', clue: 'Onde você compra itens para seu mascote' },
    { id: 'eventos', name: 'Eventos', clue: 'Onde aparecem desafios especiais' }
  ];

  const shuffled = locations.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, treasuresCount);

  // Um tesouro secreto (bônus)
  const hasSecret = Math.random() > 0.5;
  if (hasSecret && selected.length < locations.length) {
    selected.push({
      id: 'secreto',
      name: 'Tesouro Secreto',
      clue: '✨ Procure onde menos espera...',
      isSecret: true
    });
  }

  return {
    type: 'cacaotesouro',
    difficulty,
    totalTreasures: selected.length,
    treasures: selected.map((loc, i) => ({
      id: i + 1,
      locationId: loc.id,
      locationName: loc.name,
      clue: loc.clue,
      found: false,
      isSecret: loc.isSecret || false
    })),
    maxScore: 100,
    instructions: 'Siga as pistas e encontre todos os tesouros escondidos no app!'
  };
}

/**
 * GERAR PROMPT DE DIÁRIO
 */
function generateDiaryPrompt() {
  const prompts = [
    '💭 O que te deixou feliz hoje?',
    '🌟 Algo novo que você aprendeu?',
    '🙏 Por que você é grato hoje?',
    '💪 Qual foi seu maior desafio hoje?',
    '🎯 O que você quer fazer amanhã?',
    '😊 Conte sobre um momento especial de hoje',
    '🤔 O que você poderia ter feito diferente?',
    '❤️ Quem te ajudou hoje? Como?',
    '🎨 Se hoje fosse uma cor, qual seria? Por quê?',
    '🚀 Qual é seu maior sonho agora?'
  ];

  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  return {
    type: 'diario',
    difficulty: 'livre',
    prompt: randomPrompt,
    minWords: 20,
    maxWords: null,
    maxScore: 20, // FP fixo
    instructions: 'Escreva sobre o que você está sentindo. Seja sincero! Quanto mais você escrever, melhor.'
  };
}

// ================================================
// EXPORTS
// ================================================

module.exports = {
  // Gerais
  listAvailableGames,
  startGame,
  recordPlay,

  // Estatísticas
  getChildMinigameStats,
  getGameLeaderboard,

  // Conquistas
  checkAndUnlockMinigameAchievements,

  // Utilitários
  calculateFpReward,

  // Geradores (para testes)
  generateMemoryGame,
  generateQuiz,
  generateTreasureHunt,
  generateDiaryPrompt
};
