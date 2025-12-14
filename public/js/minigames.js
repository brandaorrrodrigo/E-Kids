// ================================================
// MINI-GAMES FRONTEND - E-KIDS PRO
// ================================================

// Estado global
let currentChild = null;
let currentGame = null;
let gameData = null;
let gameStartTime = null;
let timerInterval = null;
let progressionData = {}; // Armazena progressão de todos os jogos

// ================================================
// INICIALIZAÇÃO
// ================================================

document.addEventListener('DOMContentLoaded', async () => {
  await loadChildData();
  await loadDailyProgress();
  await loadAllProgression();
});

async function loadChildData() {
  try {
    const childId = localStorage.getItem('currentChildId');
    if (!childId) {
      alert('Nenhuma criança selecionada!');
      window.location.href = '/crianca.html';
      return;
    }

    currentChild = { id: parseInt(childId) };

    // Buscar FP balance
    const response = await fetch(`/api/children/${childId}`);
    const data = await response.json();

    if (data.success) {
      document.getElementById('child-fp').textContent = data.child.total_fp || 0;
    }
  } catch (error) {
    console.error('Erro ao carregar dados da criança:', error);
  }
}

async function loadDailyProgress() {
  try {
    const response = await fetch(`/api/minigames/daily-progress/${currentChild.id}`);
    const data = await response.json();

    if (data.success && data.progress.length > 0) {
      data.progress.forEach(game => {
        const playsElement = document.getElementById(`plays-${game.game_key}`);
        if (playsElement) {
          if (game.plays_remaining !== null) {
            playsElement.textContent = `${game.plays_today}/${game.plays_per_day} jogadas hoje`;
          } else {
            playsElement.textContent = `${game.plays_today} jogadas hoje`;
          }
        }
      });
    }
  } catch (error) {
    console.error('Erro ao carregar progresso diário:', error);
  }
}

// ================================================
// SISTEMA DE PROGRESSÃO
// ================================================

async function loadAllProgression() {
  try {
    const response = await fetch(`/api/progression/${currentChild.id}`);
    const data = await response.json();

    if (data.success && data.stats && data.stats.jogos) {
      // Armazenar dados de progressão
      data.stats.jogos.forEach(jogo => {
        progressionData[jogo.game_key] = jogo;
        updateProgressionUI(jogo.game_key, jogo);
      });
    }
  } catch (error) {
    console.error('Erro ao carregar progressão:', error);
  }
}

async function loadGameProgression(gameKey) {
  try {
    const response = await fetch(`/api/progression/${currentChild.id}/${gameKey}`);
    const data = await response.json();

    if (data.success) {
      progressionData[gameKey] = data.progression;
      return data;
    }
  } catch (error) {
    console.error('Erro ao carregar progressão do jogo:', error);
  }
  return null;
}

function updateProgressionUI(gameKey, progression) {
  // Atualizar badge de nível
  const badge = document.getElementById(`level-badge-${gameKey}`);
  if (badge) {
    const levelIcon = badge.querySelector('.level-icon');
    const levelText = badge.querySelector('.level-text');

    levelText.textContent = `Nível ${progression.nivel_atual}`;

    // Atualizar ícone baseado no nível
    if (progression.nivel_atual >= 10) {
      levelIcon.textContent = '👑';
      badge.className = 'game-level-badge level-10';
    } else if (progression.nivel_atual >= 7) {
      levelIcon.textContent = '💎';
      badge.className = 'game-level-badge level-7-9';
    } else if (progression.nivel_atual >= 4) {
      levelIcon.textContent = '🏅';
      badge.className = 'game-level-badge level-4-6';
    } else {
      levelIcon.textContent = '⭐';
      badge.className = 'game-level-badge level-1-3';
    }
  }

  // Atualizar barra de FP de progressão
  const fpBar = document.getElementById(`fp-bar-${gameKey}`);
  if (fpBar) {
    const fpProgress = fpBar.querySelector('.fp-progress');
    const fpText = fpBar.querySelector('.fp-text');

    // Calcular FP para próximo nível
    const fpRequirements = {
      1: 0, 2: 200, 3: 500, 4: 900, 5: 1400,
      6: 2000, 7: 2700, 8: 3500, 9: 4500, 10: 6000
    };

    const currentLevelFP = fpRequirements[progression.nivel_atual];
    const nextLevelFP = fpRequirements[progression.nivel_atual + 1] || fpRequirements[10];
    const fpInCurrentLevel = progression.xp_total - currentLevelFP; // backend ainda usa xp_total
    const fpNeededForNext = nextLevelFP - currentLevelFP;

    const percentage = progression.nivel_atual >= 10 ? 100 : (fpInCurrentLevel / fpNeededForNext) * 100;

    fpProgress.style.width = `${percentage}%`;

    if (progression.nivel_atual >= 10) {
      fpText.textContent = 'NÍVEL MÁXIMO!';
    } else {
      fpText.textContent = `${fpInCurrentLevel} / ${fpNeededForNext} FP`;
    }
  }
}

function showFPGain(fpAmount) {
  const fpGainEl = document.createElement('div');
  fpGainEl.className = 'fp-gain-animation';
  fpGainEl.textContent = `+${fpAmount} FP de Progressão`;
  document.body.appendChild(fpGainEl);

  setTimeout(() => {
    fpGainEl.remove();
  }, 3000);
}

function showLevelUpModal(levelUpInfo) {
  const modal = document.getElementById('levelup-modal');
  const gameNames = {
    'memoria': 'Jogo da Memória',
    'quiz': 'Quiz Relâmpago',
    'cacaotesouro': 'Caça ao Tesouro',
    'diario': 'Diário do Dia'
  };

  // Preencher dados do modal
  document.getElementById('levelup-old').textContent = `Nível ${levelUpInfo.nivelAnterior}`;
  document.getElementById('levelup-new').textContent = `Nível ${levelUpInfo.nivelNovo}`;
  document.getElementById('levelup-game').textContent = gameNames[currentGame] || currentGame;
  document.getElementById('levelup-bonus').textContent = `+${levelUpInfo.fpBonus} FP`;

  // Atualizar ícone baseado no novo nível
  const icon = document.getElementById('levelup-icon');
  if (levelUpInfo.nivelNovo >= 10) {
    icon.textContent = '👑';
  } else if (levelUpInfo.nivelNovo >= 7) {
    icon.textContent = '💎';
  } else if (levelUpInfo.nivelNovo >= 4) {
    icon.textContent = '🏅';
  } else {
    icon.textContent = '🎉';
  }

  // Mensagem personalizada
  const message = document.getElementById('levelup-message');
  if (levelUpInfo.nivelNovo >= 10) {
    message.textContent = 'Você alcançou o NÍVEL MÁXIMO! Você é um MESTRE! 👑';
  } else if (levelUpInfo.nivelNovo >= 7) {
    message.textContent = 'Nível avançado desbloqueado! O desafio aumentou! 💎';
  } else {
    message.textContent = 'O jogo ficou mais desafiador! Você está evoluindo! 🚀';
  }

  // Mostrar modal
  modal.style.display = 'flex';
}

function closeLevelUpModal() {
  document.getElementById('levelup-modal').style.display = 'none';
}

// ================================================
// SELEÇÃO DE JOGO
// ================================================

function selectGame(gameKey) {
  // Esconder seleção
  document.getElementById('game-selection').style.display = 'none';

  // Mostrar jogo selecionado
  document.getElementById(`game-${gameKey}`).style.display = 'block';

  currentGame = gameKey;
}

function backToSelection() {
  // Parar timer se houver
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // Esconder todos os jogos
  document.querySelectorAll('.game-screen').forEach(screen => {
    screen.style.display = 'none';
  });

  // Esconder resultado
  document.getElementById('game-result').style.display = 'none';

  // Mostrar seleção
  document.getElementById('game-selection').style.display = 'block';

  // Recarregar progresso
  loadDailyProgress();

  currentGame = null;
  gameData = null;
}

function playAgain() {
  // Esconder resultado
  document.getElementById('game-result').style.display = 'none';

  // Mostrar jogo novamente (seletor de dificuldade)
  if (currentGame === 'memoria') {
    document.getElementById('memoria-difficulty').style.display = 'block';
    document.getElementById('memoria-board').innerHTML = '';
  } else if (currentGame === 'quiz') {
    document.getElementById('quiz-difficulty').style.display = 'block';
    document.getElementById('quiz-game').innerHTML = '';
  } else if (currentGame === 'cacaotesouro') {
    document.getElementById('treasure-difficulty').style.display = 'block';
    document.getElementById('treasure-game').innerHTML = '';
  } else if (currentGame === 'diario') {
    startDiary();
  }
}

// ================================================
// TIMER
// ================================================

function startTimer(elementId) {
  gameStartTime = Date.now();
  const element = document.getElementById(elementId);

  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    element.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  return gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0;
}

// ================================================
// JOGO DA MEMÓRIA
// ================================================

let memoryGame = {
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  totalPairs: 0,
  errors: 0,
  difficulty: 'facil'
};

async function startMemoryGame(difficulty) {
  memoryGame.difficulty = difficulty;

  // Esconder seletor de dificuldade
  document.getElementById('memoria-difficulty').style.display = 'none';

  // Buscar dados do jogo
  try {
    const response = await fetch('/api/minigames/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        childId: currentChild.id,
        gameKey: 'memoria',
        difficulty
      })
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || 'Erro ao iniciar jogo');
      backToSelection();
      return;
    }

    gameData = data;
    memoryGame.cards = data.content.cards;
    memoryGame.totalPairs = data.content.totalPairs;
    memoryGame.matchedPairs = 0;
    memoryGame.errors = 0;
    memoryGame.flippedCards = [];

    renderMemoryBoard();

    // Iniciar timer
    startTimer('memoria-time');
    document.getElementById('memoria-errors').textContent = '0';

  } catch (error) {
    console.error('Erro ao iniciar Jogo da Memória:', error);
    alert('Erro ao carregar jogo. Tente novamente.');
    backToSelection();
  }
}

function renderMemoryBoard() {
  const board = document.getElementById('memoria-board');
  board.innerHTML = '';

  memoryGame.cards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'memory-card';
    cardElement.dataset.index = index;
    cardElement.textContent = card.flipped || card.matched ? card.emoji : '';

    if (card.matched) {
      cardElement.classList.add('matched');
    } else if (card.flipped) {
      cardElement.classList.add('flipped');
    }

    cardElement.onclick = () => flipMemoryCard(index);

    board.appendChild(cardElement);
  });
}

function flipMemoryCard(index) {
  const card = memoryGame.cards[index];

  // Ignorar se já virada ou matched
  if (card.flipped || card.matched) return;

  // Ignorar se já tem 2 cartas viradas
  if (memoryGame.flippedCards.length >= 2) return;

  // Virar carta
  card.flipped = true;
  memoryGame.flippedCards.push(index);

  renderMemoryBoard();

  // Verificar par se tiver 2 cartas viradas
  if (memoryGame.flippedCards.length === 2) {
    setTimeout(checkMemoryMatch, 600);
  }
}

function checkMemoryMatch() {
  const [index1, index2] = memoryGame.flippedCards;
  const card1 = memoryGame.cards[index1];
  const card2 = memoryGame.cards[index2];

  if (card1.emoji === card2.emoji) {
    // Match!
    card1.matched = true;
    card2.matched = true;
    memoryGame.matchedPairs++;

    // Verificar se terminou
    if (memoryGame.matchedPairs === memoryGame.totalPairs) {
      setTimeout(finishMemoryGame, 800);
    }
  } else {
    // Erro
    memoryGame.errors++;
    document.getElementById('memoria-errors').textContent = memoryGame.errors;

    // Desvirar cartas
    card1.flipped = false;
    card2.flipped = false;
  }

  memoryGame.flippedCards = [];
  renderMemoryBoard();
}

async function finishMemoryGame() {
  const timeSeconds = stopTimer();

  // Calcular score (menos erros e menos tempo = melhor)
  const maxErrors = memoryGame.totalPairs * 2; // Máximo de erros "razoável"
  const errorPenalty = Math.min(memoryGame.errors / maxErrors, 1) * 50; // até -50 pontos
  const score = Math.max(0, Math.round(100 - errorPenalty));

  // Registrar jogada
  await recordGamePlay('memoria', score, timeSeconds, 1, {
    pairs: memoryGame.totalPairs,
    errors: memoryGame.errors
  });
}

// ================================================
// QUIZ RELÂMPAGO
// ================================================

let quizGame = {
  questions: [],
  currentQuestion: 0,
  correctAnswers: 0,
  difficulty: 'facil'
};

async function startQuiz(difficulty) {
  quizGame.difficulty = difficulty;

  // Esconder seletor de dificuldade
  document.getElementById('quiz-difficulty').style.display = 'none';

  try {
    const response = await fetch('/api/minigames/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        childId: currentChild.id,
        gameKey: 'quiz',
        difficulty
      })
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || 'Erro ao iniciar quiz');
      backToSelection();
      return;
    }

    gameData = data;
    quizGame.questions = data.content.questions;
    quizGame.currentQuestion = 0;
    quizGame.correctAnswers = 0;

    document.getElementById('quiz-total').textContent = quizGame.questions.length;

    // Iniciar timer
    startTimer('quiz-time');

    // Mostrar primeira pergunta
    renderQuizQuestion();

  } catch (error) {
    console.error('Erro ao iniciar Quiz:', error);
    alert('Erro ao carregar quiz. Tente novamente.');
    backToSelection();
  }
}

function renderQuizQuestion() {
  const container = document.getElementById('quiz-game');
  const question = quizGame.questions[quizGame.currentQuestion];

  document.getElementById('quiz-current').textContent = quizGame.currentQuestion + 1;

  container.innerHTML = `
    <div class="quiz-question">
      <strong>Pergunta ${quizGame.currentQuestion + 1}:</strong><br>
      ${question.question}
    </div>
    <div class="quiz-options">
      ${question.options.map((option, index) => `
        <div class="quiz-option" onclick="selectQuizAnswer(${index})">
          ${option}
        </div>
      `).join('')}
    </div>
  `;
}

function selectQuizAnswer(selectedIndex) {
  const question = quizGame.questions[quizGame.currentQuestion];
  const options = document.querySelectorAll('.quiz-option');

  // Desabilitar cliques
  options.forEach(opt => opt.style.pointerEvents = 'none');

  // Marcar correta/incorreta
  options[selectedIndex].classList.add(
    selectedIndex === question.correctIndex ? 'correct' : 'incorrect'
  );

  if (selectedIndex !== question.correctIndex) {
    options[question.correctIndex].classList.add('correct');
  }

  // Contar se acertou
  if (selectedIndex === question.correctIndex) {
    quizGame.correctAnswers++;
  }

  // Próxima pergunta após 1.5s
  setTimeout(() => {
    quizGame.currentQuestion++;

    if (quizGame.currentQuestion < quizGame.questions.length) {
      renderQuizQuestion();
    } else {
      finishQuiz();
    }
  }, 1500);
}

async function finishQuiz() {
  const timeSeconds = stopTimer();

  // Score baseado em acertos (0-100)
  const score = Math.round((quizGame.correctAnswers / quizGame.questions.length) * 100);

  // Registrar jogada
  await recordGamePlay('quiz', score, timeSeconds, 1, {
    totalQuestions: quizGame.questions.length,
    correctAnswers: quizGame.correctAnswers
  });
}

// ================================================
// CAÇA AO TESOURO
// ================================================

let treasureGame = {
  treasures: [],
  foundCount: 0,
  difficulty: 'facil'
};

async function startTreasureHunt(difficulty) {
  treasureGame.difficulty = difficulty;

  // Esconder seletor de dificuldade
  document.getElementById('treasure-difficulty').style.display = 'none';

  try {
    const response = await fetch('/api/minigames/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        childId: currentChild.id,
        gameKey: 'cacaotesouro',
        difficulty
      })
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || 'Erro ao iniciar caça ao tesouro');
      backToSelection();
      return;
    }

    gameData = data;
    treasureGame.treasures = data.content.treasures;
    treasureGame.foundCount = 0;

    document.getElementById('treasure-total').textContent = treasureGame.treasures.length;
    document.getElementById('treasure-found').textContent = '0';

    // Iniciar timer
    startTimer('treasure-time');

    // Renderizar tesouros
    renderTreasureHunt();

  } catch (error) {
    console.error('Erro ao iniciar Caça ao Tesouro:', error);
    alert('Erro ao carregar jogo. Tente novamente.');
    backToSelection();
  }
}

function renderTreasureHunt() {
  const container = document.getElementById('treasure-game');

  container.innerHTML = treasureGame.treasures.map((treasure, index) => `
    <div
      class="treasure-item ${treasure.found ? 'found' : ''} ${treasure.isSecret ? 'treasure-secret' : ''}"
      onclick="${treasure.found ? '' : `findTreasure(${index})`}"
    >
      <div class="treasure-clue">
        ${treasure.found
          ? `<strong>✓ ${treasure.locationName}</strong> - Encontrado!`
          : treasure.clue
        }
      </div>
      <div class="treasure-status">${treasure.found ? '✅' : '❓'}</div>
    </div>
  `).join('');
}

function findTreasure(index) {
  const treasure = treasureGame.treasures[index];

  if (treasure.found) return;

  // Confirmar se achou
  const confirmed = confirm(`Você encontrou o tesouro em "${treasure.locationName}"?`);

  if (confirmed) {
    treasure.found = true;
    treasureGame.foundCount++;

    document.getElementById('treasure-found').textContent = treasureGame.foundCount;

    renderTreasureHunt();

    // Verificar se terminou
    if (treasureGame.foundCount === treasureGame.treasures.length) {
      setTimeout(finishTreasureHunt, 500);
    }
  }
}

async function finishTreasureHunt() {
  const timeSeconds = stopTimer();

  // Score baseado em quantos achou
  const score = Math.round((treasureGame.foundCount / treasureGame.treasures.length) * 100);

  // Verificar se achou tesouro secreto
  const foundSecret = treasureGame.treasures.some(t => t.isSecret && t.found);

  // Registrar jogada
  await recordGamePlay('cacaotesouro', score, timeSeconds, 1, {
    totalTreasures: treasureGame.treasures.length,
    found: treasureGame.foundCount,
    foundSecret
  });
}

// ================================================
// DIÁRIO DO DIA
// ================================================

async function startDiary() {
  try {
    const response = await fetch('/api/minigames/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        childId: currentChild.id,
        gameKey: 'diario',
        difficulty: 'livre'
      })
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || 'Erro ao iniciar diário');
      backToSelection();
      return;
    }

    gameData = data;

    // Mostrar prompt
    document.getElementById('diary-prompt').textContent = data.content.prompt;

    // Limpar textarea
    document.getElementById('diary-text').value = '';
    document.getElementById('diary-words').textContent = '0';

  } catch (error) {
    console.error('Erro ao iniciar Diário:', error);
    alert('Erro ao carregar diário. Tente novamente.');
    backToSelection();
  }
}

function updateWordCount() {
  const text = document.getElementById('diary-text').value.trim();
  const words = text ? text.split(/\s+/).length : 0;

  document.getElementById('diary-words').textContent = words;
}

async function saveDiary() {
  const text = document.getElementById('diary-text').value.trim();

  if (!text || text.length < 10) {
    alert('Escreva pelo menos algumas palavras no seu diário!');
    return;
  }

  const wordCount = text.split(/\s+/).length;

  // Score baseado em quantidade de palavras
  const minWords = gameData.content.minWords || 20;
  let score = Math.min(100, Math.round((wordCount / minWords) * 100));

  // Garantir score mínimo se escreveu algo
  if (score < 50 && text.length > 20) {
    score = 50;
  }

  // Registrar jogada
  await recordGamePlay('diario', score, 0, 1, {
    entry: text,
    wordCount
  });
}

// ================================================
// REGISTRAR JOGADA
// ================================================

async function recordGamePlay(gameKey, score, timeSeconds, completed, gameDataExtra = {}) {
  try {
    // Registrar no sistema de mini-games
    const minigameResponse = await fetch('/api/minigames/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        childId: currentChild.id,
        gameKey,
        difficulty: gameKey === 'diario' ? 'livre' : (memoryGame.difficulty || quizGame.difficulty || treasureGame.difficulty),
        score,
        timeSeconds,
        completed,
        gameData: gameDataExtra
      })
    });

    const minigameData = await minigameResponse.json();

    if (!minigameData.success) {
      alert('Erro ao salvar jogo: ' + (minigameData.message || 'Erro desconhecido'));
      return;
    }

    // Registrar no sistema de progressão
    const progressionResponse = await fetch('/api/progression/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        childId: currentChild.id,
        gameKey,
        performance: {
          score,
          accuracy: score, // Score de 0-100 pode ser usado como accuracy
          time: timeSeconds,
          targetTime: gameKey === 'memoria' ? 120 : gameKey === 'quiz' ? 180 : 300,
          completed: completed
        }
      })
    });

    const progressionData = await progressionResponse.json();

    // Combinar dados
    const combinedData = {
      ...minigameData,
      progression: progressionData.success ? progressionData : null
    };

    // Mostrar resultado
    showGameResult(combinedData, score, timeSeconds, gameDataExtra);

  } catch (error) {
    console.error('Erro ao registrar jogada:', error);
    alert('Erro ao salvar seu progresso. Mas você jogou muito bem!');
  }
}

// ================================================
// MOSTRAR RESULTADO
// ================================================

function showGameResult(data, score, timeSeconds, gameDataExtra) {
  stopTimer();

  // Atualizar FP display
  document.getElementById('child-fp').textContent = data.newFpBalance;

  // Processar dados de progressão
  if (data.progression) {
    const prog = data.progression;

    // Mostrar FP de progressão ganho
    if (prog.xpGanho) { // backend retorna xpGanho, mas mostramos como FP
      showFPGain(prog.xpGanho);
    }

    // Atualizar UI de progressão
    if (prog.nivelAtual) {
      const progressionForUI = {
        nivel_atual: prog.nivelAtual,
        xp_total: prog.xpTotal || prog.xp_total || 0 // backend usa xp_total internamente
      };
      updateProgressionUI(currentGame, progressionForUI);
    }

    // Mostrar modal de level up (esperar 2s para mostrar depois do resultado)
    if (prog.levelUp) {
      setTimeout(() => {
        showLevelUpModal(prog.levelUp);
      }, 2000);
    }
  }

  // Preencher resultado
  document.getElementById('result-title').textContent = score >= 80 ? 'Incrível!' : score >= 60 ? 'Muito Bom!' : 'Parabéns!';

  // Adicionar FP de progressão à mensagem se disponível
  let message = data.message || 'Você jogou muito bem!';
  if (data.progression && data.progression.xpGanho) {
    message += ` Você ganhou ${data.progression.xpGanho} FP de Progressão!`;
  }
  document.getElementById('result-message').textContent = message;

  document.getElementById('result-fp').textContent = data.fpEarned;

  // Estatísticas
  const statsHTML = [];

  if (currentGame === 'memoria') {
    statsHTML.push(`<div>💯 Score: ${score}/100</div>`);
    statsHTML.push(`<div>❌ Erros: ${gameDataExtra.errors}</div>`);
    statsHTML.push(`<div>⏱️ Tempo: ${formatTime(timeSeconds)}</div>`);
  } else if (currentGame === 'quiz') {
    statsHTML.push(`<div>✅ Acertos: ${gameDataExtra.correctAnswers}/${gameDataExtra.totalQuestions}</div>`);
    statsHTML.push(`<div>💯 Score: ${score}/100</div>`);
    statsHTML.push(`<div>⏱️ Tempo: ${formatTime(timeSeconds)}</div>`);
  } else if (currentGame === 'cacaotesouro') {
    statsHTML.push(`<div>🏆 Tesouros: ${gameDataExtra.found}/${gameDataExtra.totalTreasures}</div>`);
    if (gameDataExtra.foundSecret) {
      statsHTML.push(`<div>✨ Tesouro Secreto Encontrado!</div>`);
    }
    statsHTML.push(`<div>⏱️ Tempo: ${formatTime(timeSeconds)}</div>`);
  } else if (currentGame === 'diario') {
    statsHTML.push(`<div>📝 Palavras escritas: ${gameDataExtra.wordCount}</div>`);
    statsHTML.push(`<div>💭 Seu diário foi salvo!</div>`);
  }

  document.getElementById('result-stats').innerHTML = statsHTML.join('');

  // Conquistas
  if (data.newAchievements && data.newAchievements.length > 0) {
    const achievementsEl = document.getElementById('result-achievements');
    achievementsEl.style.display = 'block';

    const achievementsHTML = `
      <h3>🏆 Novas Conquistas!</h3>
      ${data.newAchievements.map(ach => `
        <div class="achievement-item">
          <span>${ach.icon}</span>
          <strong>${ach.achievement_name}</strong>
          <span>+${ach.fp_reward} FP</span>
        </div>
      `).join('')}
    `;

    achievementsEl.innerHTML = achievementsHTML;
  } else {
    document.getElementById('result-achievements').style.display = 'none';
  }

  // Mostrar resultado
  document.getElementById('game-result').style.display = 'flex';
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ================================================
// INICIALIZAR DIÁRIO AUTOMATICAMENTE
// ================================================

// Se o jogo selecionado for diário, já inicializar
document.addEventListener('DOMContentLoaded', () => {
  const gameParam = new URLSearchParams(window.location.search).get('game');

  if (gameParam) {
    setTimeout(() => {
      selectGame(gameParam);

      if (gameParam === 'diario') {
        startDiary();
      }
    }, 500);
  }
});
