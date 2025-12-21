// JOGOS DE RACIOCÍNIO - E-KIDS PRO
// Jogos educativos que estimulam memória, lógica e atenção

// ================================================
// 1. JOGO DA MEMÓRIA
// ================================================

class MemoryGame {
  constructor(containerId, theme = 'emocoes') {
    this.containerId = containerId;
    this.theme = theme;
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.startTime = null;
    this.timerInterval = null;
    this.isProcessing = false;

    this.themes = {
      emocoes: ['😊', '😢', '😠', '😰', '😴', '😲', '🤗', '😌'],
      animais: ['🐶', '🐱', '🐰', '🐻', '🦊', '🐼', '🐨', '🦁'],
      frutas: ['🍎', '🍌', '🍊', '🍇', '🍓', '🍉', '🍑', '🍍'],
      numeros: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣']
    };
  }

  init() {
    this.createCards();
    this.render();
    this.startTimer();
  }

  createCards() {
    const icons = this.themes[this.theme] || this.themes.emocoes;
    const pairs = icons.concat(icons); // Duplicar para criar pares

    // Embaralhar
    this.cards = pairs.sort(() => Math.random() - 0.5).map((icon, index) => ({
      id: index,
      icon: icon,
      isFlipped: false,
      isMatched: false
    }));
  }

  render() {
    const container = document.getElementById(this.containerId);
    container.innerHTML = `
      <div class="memory-game">
        <div class="game-header">
          <div class="game-stat">
            <span class="stat-label">Movimentos:</span>
            <span class="stat-value" id="memory-moves">0</span>
          </div>
          <div class="game-stat">
            <span class="stat-label">Tempo:</span>
            <span class="stat-value" id="memory-time">0:00</span>
          </div>
          <div class="game-stat">
            <span class="stat-label">Pares:</span>
            <span class="stat-value" id="memory-pairs">0/${this.cards.length / 2}</span>
          </div>
        </div>

        <div class="memory-board">
          ${this.cards.map(card => `
            <div class="memory-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}"
                 data-id="${card.id}"
                 onclick="memoryGame.flipCard(${card.id})">
              <div class="card-inner">
                <div class="card-front">❓</div>
                <div class="card-back">${card.icon}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="game-actions">
          <button class="btn-secondary" onclick="memoryGame.restart()">Reiniciar 🔄</button>
          <button class="btn-secondary" onclick="backToGames()">Voltar ←</button>
        </div>
      </div>
    `;
  }

  flipCard(cardId) {
    if (this.isProcessing) return;

    const card = this.cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    // Virar carta
    card.isFlipped = true;
    this.flippedCards.push(card);
    this.updateCardDisplay(cardId);

    // Verificar se já tem 2 cartas viradas
    if (this.flippedCards.length === 2) {
      this.moves++;
      document.getElementById('memory-moves').textContent = this.moves;
      this.checkMatch();
    }
  }

  updateCardDisplay(cardId) {
    const cardElement = document.querySelector(`[data-id="${cardId}"]`);
    const card = this.cards.find(c => c.id === cardId);

    if (card.isFlipped) {
      cardElement.classList.add('flipped');
    }
    if (card.isMatched) {
      cardElement.classList.add('matched');
    }
  }

  checkMatch() {
    this.isProcessing = true;
    const [card1, card2] = this.flippedCards;

    setTimeout(() => {
      if (card1.icon === card2.icon) {
        // Match!
        card1.isMatched = true;
        card2.isMatched = true;
        this.matchedPairs++;

        document.getElementById('memory-pairs').textContent = `${this.matchedPairs}/${this.cards.length / 2}`;

        // Animar match
        this.updateCardDisplay(card1.id);
        this.updateCardDisplay(card2.id);

        // Verificar vitória
        if (this.matchedPairs === this.cards.length / 2) {
          this.gameWon();
        }
      } else {
        // Não match - virar de volta
        card1.isFlipped = false;
        card2.isFlipped = false;

        const card1Element = document.querySelector(`[data-id="${card1.id}"]`);
        const card2Element = document.querySelector(`[data-id="${card2.id}"]`);
        card1Element.classList.remove('flipped');
        card2Element.classList.remove('flipped');
      }

      this.flippedCards = [];
      this.isProcessing = false;
    }, 800);
  }

  startTimer() {
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      document.getElementById('memory-time').textContent =
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  gameWon() {
    clearInterval(this.timerInterval);
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);

    // FP fixo: 8 pares = Dificuldade média = 10 FP
    const fpEarned = 10;

    setTimeout(() => {
      const container = document.getElementById(this.containerId);
      container.innerHTML = `
        <div class="game-result">
          <div class="result-emoji">🎉</div>
          <h2>Parabéns!</h2>
          <p>Você completou o jogo da memória!</p>

          <div class="result-stats">
            <div class="result-stat">
              <div class="result-stat-value">${this.moves}</div>
              <div class="result-stat-label">Movimentos</div>
            </div>
            <div class="result-stat">
              <div class="result-stat-value">${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, '0')}</div>
              <div class="result-stat-label">Tempo</div>
            </div>
            <div class="result-stat highlight">
              <div class="result-stat-value">+${fpEarned} FP</div>
              <div class="result-stat-label">Ganhos</div>
            </div>
          </div>

          <div class="game-actions">
            <button class="btn-primary" onclick="memoryGame.saveAndExit(${fpEarned})">Finalizar ✅</button>
            <button class="btn-secondary" onclick="memoryGame.restart()">Jogar Novamente 🔄</button>
          </div>
        </div>
      `;
    }, 500);
  }

  async saveAndExit(fpEarned) {
    try {
      const currentChild = JSON.parse(localStorage.getItem('current_child') || '{}');
      await fetch('/api/minigames/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ekids_token')}`
        },
        body: JSON.stringify({
          childId: currentChild.id,
          gameKey: 'memory',
          score: this.matchedPairs,
          fpEarned: fpEarned
        })
      });

      backToGames();
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
      backToGames();
    }
  }

  restart() {
    clearInterval(this.timerInterval);
    this.matchedPairs = 0;
    this.moves = 0;
    this.flippedCards = [];
    this.isProcessing = false;
    this.createCards();
    this.render();
    this.startTimer();
  }
}

// ================================================
// 2. JOGO DE SEQUÊNCIA DE PADRÕES
// ================================================

class PatternGame {
  constructor(containerId) {
    this.containerId = containerId;
    this.level = 1;
    this.currentPattern = [];
    this.playerPattern = [];
    this.score = 0;
    this.isPlaying = false;
  }

  init() {
    this.render();
    setTimeout(() => this.startRound(), 1000);
  }

  render() {
    const container = document.getElementById(this.containerId);
    container.innerHTML = `
      <div class="pattern-game">
        <div class="game-header">
          <div class="game-stat">
            <span class="stat-label">Nível:</span>
            <span class="stat-value" id="pattern-level">${this.level}</span>
          </div>
          <div class="game-stat">
            <span class="stat-label">Pontos:</span>
            <span class="stat-value" id="pattern-score">${this.score}</span>
          </div>
        </div>

        <div class="pattern-message" id="pattern-message">
          Observe a sequência!
        </div>

        <div class="pattern-board">
          <div class="pattern-btn" data-color="red" onclick="patternGame.playerClick('red')">
            <div class="pattern-btn-inner red"></div>
          </div>
          <div class="pattern-btn" data-color="blue" onclick="patternGame.playerClick('blue')">
            <div class="pattern-btn-inner blue"></div>
          </div>
          <div class="pattern-btn" data-color="green" onclick="patternGame.playerClick('green')">
            <div class="pattern-btn-inner green"></div>
          </div>
          <div class="pattern-btn" data-color="yellow" onclick="patternGame.playerClick('yellow')">
            <div class="pattern-btn-inner yellow"></div>
          </div>
        </div>

        <div class="game-actions">
          <button class="btn-secondary" onclick="patternGame.restart()">Reiniciar 🔄</button>
          <button class="btn-secondary" onclick="backToGames()">Voltar ←</button>
        </div>
      </div>
    `;
  }

  startRound() {
    this.playerPattern = [];
    const colors = ['red', 'blue', 'green', 'yellow'];
    this.currentPattern.push(colors[Math.floor(Math.random() * 4)]);
    this.playPattern();
  }

  async playPattern() {
    this.isPlaying = true;
    document.getElementById('pattern-message').textContent = 'Observe a sequência!';

    for (let i = 0; i < this.currentPattern.length; i++) {
      await this.wait(500);
      await this.flashButton(this.currentPattern[i]);
    }

    this.isPlaying = false;
    document.getElementById('pattern-message').textContent = 'Sua vez! Repita a sequência!';
  }

  async flashButton(color) {
    const btn = document.querySelector(`[data-color="${color}"]`);
    btn.classList.add('active');

    // Tocar som (se disponível)
    this.playSound(color);

    await this.wait(400);
    btn.classList.remove('active');
  }

  playSound(color) {
    // Sons diferentes para cada cor
    const frequencies = { red: 261.63, blue: 329.63, green: 392.00, yellow: 493.88 };
    if (window.audioManager && window.audioManager.playTone) {
      window.audioManager.playTone(frequencies[color], 200);
    }
  }

  playerClick(color) {
    if (this.isPlaying) return;

    this.flashButton(color);
    this.playerPattern.push(color);

    // Verificar se está correto
    const currentIndex = this.playerPattern.length - 1;
    if (this.playerPattern[currentIndex] !== this.currentPattern[currentIndex]) {
      this.gameLost();
      return;
    }

    // Verificar se completou a sequência
    if (this.playerPattern.length === this.currentPattern.length) {
      this.score += this.level * 10;
      this.level++;
      document.getElementById('pattern-level').textContent = this.level;
      document.getElementById('pattern-score').textContent = this.score;

      setTimeout(() => this.startRound(), 1000);
    }
  }

  gameLost() {
    this.isPlaying = true;
    document.getElementById('pattern-message').innerHTML =
      '<span style="color: #e74c3c;">Ops! Sequência errada!</span>';

    // FP fixo por nível alcançado: <5=Fácil(5), 5-10=Médio(10), >10=Difícil(15)
    const fpEarned = this.level > 10 ? 15 : (this.level >= 5 ? 10 : 5);

    setTimeout(() => {
      const container = document.getElementById(this.containerId);
      container.innerHTML = `
        <div class="game-result">
          <div class="result-emoji">🎯</div>
          <h2>Fim de Jogo!</h2>
          <p>Você chegou até o nível ${this.level}!</p>

          <div class="result-stats">
            <div class="result-stat">
              <div class="result-stat-value">${this.level}</div>
              <div class="result-stat-label">Nível Alcançado</div>
            </div>
            <div class="result-stat">
              <div class="result-stat-value">${this.score}</div>
              <div class="result-stat-label">Pontos</div>
            </div>
            <div class="result-stat highlight">
              <div class="result-stat-value">+${fpEarned} FP</div>
              <div class="result-stat-label">Ganhos</div>
            </div>
          </div>

          <div class="game-actions">
            <button class="btn-primary" onclick="patternGame.saveAndExit(${fpEarned})">Finalizar ✅</button>
            <button class="btn-secondary" onclick="patternGame.restart()">Jogar Novamente 🔄</button>
          </div>
        </div>
      `;
    }, 1500);
  }

  async saveAndExit(fpEarned) {
    try {
      const currentChild = JSON.parse(localStorage.getItem('current_child') || '{}');
      await fetch('/api/minigames/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ekids_token')}`
        },
        body: JSON.stringify({
          childId: currentChild.id,
          gameKey: 'pattern',
          score: this.score,
          fpEarned: fpEarned
        })
      });

      backToGames();
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
      backToGames();
    }
  }

  restart() {
    this.level = 1;
    this.currentPattern = [];
    this.playerPattern = [];
    this.score = 0;
    this.isPlaying = false;
    this.render();
    setTimeout(() => this.startRound(), 1000);
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ================================================
// 3. JOGO DE LÓGICA - ENCONTRE O PADRÃO
// ================================================

class LogicGame {
  constructor(containerId) {
    this.containerId = containerId;
    this.currentQuestion = 0;
    this.score = 0;
    this.questions = this.generateQuestions();
  }

  generateQuestions() {
    return [
      {
        question: "Qual número completa a sequência?",
        sequence: "2, 4, 6, 8, ?",
        options: ["9", "10", "11", "12"],
        correct: 1,
        explanation: "É uma sequência de números pares: cada número aumenta 2!"
      },
      {
        question: "Qual forma vem a seguir?",
        sequence: "⭐ ⭕ ⭐ ⭕ ?",
        options: ["⭐", "⭕", "🔺", "🔷"],
        correct: 0,
        explanation: "O padrão alterna entre estrela e círculo!"
      },
      {
        question: "Complete o padrão de cores:",
        sequence: "🔴 🔵 🔴 🔵 ?",
        options: ["🔴", "🔵", "🟢", "🟡"],
        correct: 0,
        explanation: "As cores se alternam: vermelho, azul, vermelho, azul..."
      },
      {
        question: "Qual número falta?",
        sequence: "1, 1, 2, 3, 5, 8, ?",
        options: ["11", "12", "13", "14"],
        correct: 2,
        explanation: "Sequência de Fibonacci: cada número é a soma dos dois anteriores!"
      },
      {
        question: "Que símbolo completa?",
        sequence: "😊 😊 😢 😊 😊 😢 😊 😊 ?",
        options: ["😊", "😢", "😠", "😴"],
        correct: 1,
        explanation: "O padrão é: dois felizes, um triste!"
      }
    ];
  }

  init() {
    this.render();
  }

  render() {
    const container = document.getElementById(this.containerId);
    const q = this.questions[this.currentQuestion];

    container.innerHTML = `
      <div class="logic-game">
        <div class="game-header">
          <div class="game-stat">
            <span class="stat-label">Questão:</span>
            <span class="stat-value">${this.currentQuestion + 1}/${this.questions.length}</span>
          </div>
          <div class="game-stat">
            <span class="stat-label">Acertos:</span>
            <span class="stat-value" id="logic-score">${this.score}</span>
          </div>
        </div>

        <div class="logic-question">
          <h3>${q.question}</h3>
          <div class="sequence-display">${q.sequence}</div>
        </div>

        <div class="logic-options">
          ${q.options.map((option, index) => `
            <button class="logic-option-btn" onclick="logicGame.checkAnswer(${index})">
              ${option}
            </button>
          `).join('')}
        </div>

        <div id="logic-feedback" class="logic-feedback" style="display: none;"></div>

        <div class="game-actions">
          <button class="btn-secondary" onclick="backToGames()">Voltar ←</button>
        </div>
      </div>
    `;
  }

  checkAnswer(selectedIndex) {
    const q = this.questions[this.currentQuestion];
    const feedbackEl = document.getElementById('logic-feedback');
    const buttons = document.querySelectorAll('.logic-option-btn');

    buttons.forEach(btn => btn.disabled = true);

    if (selectedIndex === q.correct) {
      this.score++;
      document.getElementById('logic-score').textContent = this.score;
      buttons[selectedIndex].style.background = '#27ae60';
      buttons[selectedIndex].style.color = 'white';

      feedbackEl.innerHTML = `
        <div class="feedback-correct">
          ✅ <strong>Correto!</strong><br>
          ${q.explanation}
        </div>
      `;
    } else {
      buttons[selectedIndex].style.background = '#e74c3c';
      buttons[selectedIndex].style.color = 'white';
      buttons[q.correct].style.background = '#27ae60';
      buttons[q.correct].style.color = 'white';

      feedbackEl.innerHTML = `
        <div class="feedback-incorrect">
          💡 <strong>Ops!</strong><br>
          ${q.explanation}
        </div>
      `;
    }

    feedbackEl.style.display = 'block';

    setTimeout(() => {
      this.currentQuestion++;
      if (this.currentQuestion < this.questions.length) {
        this.render();
      } else {
        this.showResults();
      }
    }, 2500);
  }

  showResults() {
    // FP fixo por pontuação: <5=Fácil(5), 5-10=Médio(10), >10=Difícil(15)
    const fpEarned = this.score > 10 ? 15 : (this.score >= 5 ? 10 : 5);
    const container = document.getElementById(this.containerId);

    container.innerHTML = `
      <div class="game-result">
        <div class="result-emoji">🧠</div>
        <h2>Resultado Final!</h2>
        <p>Você completou todos os desafios de lógica!</p>

        <div class="result-stats">
          <div class="result-stat">
            <div class="result-stat-value">${this.score}/${this.questions.length}</div>
            <div class="result-stat-label">Acertos</div>
          </div>
          <div class="result-stat">
            <div class="result-stat-value">${Math.round((this.score / this.questions.length) * 100)}%</div>
            <div class="result-stat-label">Aproveitamento</div>
          </div>
          <div class="result-stat highlight">
            <div class="result-stat-value">+${fpEarned} FP</div>
            <div class="result-stat-label">Ganhos</div>
          </div>
        </div>

        <div class="game-actions">
          <button class="btn-primary" onclick="logicGame.saveAndExit(${fpEarned})">Finalizar ✅</button>
          <button class="btn-secondary" onclick="logicGame.restart()">Jogar Novamente 🔄</button>
        </div>
      </div>
    `;
  }

  async saveAndExit(fpEarned) {
    try {
      const currentChild = JSON.parse(localStorage.getItem('current_child') || '{}');
      await fetch('/api/minigames/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ekids_token')}`
        },
        body: JSON.stringify({
          childId: currentChild.id,
          gameKey: 'logic',
          score: this.score,
          fpEarned: fpEarned
        })
      });

      backToGames();
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
      backToGames();
    }
  }

  restart() {
    this.currentQuestion = 0;
    this.score = 0;
    this.questions = this.generateQuestions();
    this.render();
  }
}

// ================================================
// FUNÇÕES AUXILIARES
// ================================================

function backToGames() {
  window.location.href = '/minigames.html';
}

// Instâncias globais
let memoryGame;
let patternGame;
let logicGame;

// Inicializar jogo específico
function startGame(gameName) {
  const container = document.getElementById('game-area');

  switch(gameName) {
    case 'memory':
      memoryGame = new MemoryGame('game-area', 'emocoes');
      memoryGame.init();
      break;
    case 'pattern':
      patternGame = new PatternGame('game-area');
      patternGame.init();
      break;
    case 'logic':
      logicGame = new LogicGame('game-area');
      logicGame.init();
      break;
  }

  // Adicionar estilos
  addReasoningGamesStyles();
}

// Adicionar estilos CSS
function addReasoningGamesStyles() {
  if (document.getElementById('reasoning-games-styles')) return;

  const style = document.createElement('style');
  style.id = 'reasoning-games-styles';
  style.textContent = `
    /* Jogo da Memória */
    .memory-board {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      max-width: 600px;
      margin: 30px auto;
      padding: 20px;
    }

    .memory-card {
      aspect-ratio: 1;
      cursor: pointer;
      perspective: 1000px;
    }

    .card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform 0.6s;
      transform-style: preserve-3d;
    }

    .memory-card.flipped .card-inner {
      transform: rotateY(180deg);
    }

    .card-front, .card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      font-size: 48px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .card-front {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .card-back {
      background: white;
      transform: rotateY(180deg);
    }

    .memory-card.matched .card-back {
      background: #d5f4e6;
      animation: matched 0.6s ease;
    }

    @keyframes matched {
      0%, 100% { transform: rotateY(180deg) scale(1); }
      50% { transform: rotateY(180deg) scale(1.1); }
    }

    /* Jogo de Padrões */
    .pattern-board {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      max-width: 400px;
      margin: 30px auto;
      padding: 20px;
    }

    .pattern-btn {
      aspect-ratio: 1;
      cursor: pointer;
      padding: 10px;
    }

    .pattern-btn-inner {
      width: 100%;
      height: 100%;
      border-radius: 12px;
      transition: all 0.2s;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .pattern-btn-inner.red { background: #e74c3c; }
    .pattern-btn-inner.blue { background: #3498db; }
    .pattern-btn-inner.green { background: #27ae60; }
    .pattern-btn-inner.yellow { background: #f39c12; }

    .pattern-btn.active .pattern-btn-inner {
      transform: scale(0.95);
      box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.5);
    }

    .pattern-message {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: #2c3e50;
      margin: 20px 0;
      min-height: 30px;
    }

    /* Jogo de Lógica */
    .logic-question {
      background: white;
      padding: 30px;
      border-radius: 16px;
      margin: 20px auto;
      max-width: 600px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .logic-question h3 {
      color: #2c3e50;
      margin: 0 0 20px 0;
      text-align: center;
    }

    .sequence-display {
      background: #ecf0f1;
      padding: 20px;
      border-radius: 12px;
      font-size: 32px;
      text-align: center;
      font-weight: bold;
      letter-spacing: 8px;
    }

    .logic-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      max-width: 500px;
      margin: 20px auto;
      padding: 0 20px;
    }

    .logic-option-btn {
      padding: 20px;
      font-size: 24px;
      font-weight: bold;
      background: white;
      border: 2px solid #ecf0f1;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .logic-option-btn:hover:not(:disabled) {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }

    .logic-option-btn:disabled {
      cursor: not-allowed;
    }

    .logic-feedback {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
    }

    .feedback-correct {
      background: #d5f4e6;
      color: #27ae60;
      border-left: 4px solid #27ae60;
      padding: 15px;
    }

    .feedback-incorrect {
      background: #fff3cd;
      color: #856404;
      border-left: 4px solid #f39c12;
      padding: 15px;
    }

    /* Cabeçalho do jogo */
    .game-header {
      display: flex;
      justify-content: center;
      gap: 40px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .game-stat {
      text-align: center;
    }

    .stat-label {
      display: block;
      font-size: 12px;
      color: #7F8C8D;
      margin-bottom: 5px;
    }

    .stat-value {
      display: block;
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
    }

    /* Ações do jogo */
    .game-actions {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 30px;
      flex-wrap: wrap;
    }

    .game-actions button {
      padding: 12px 24px;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .game-actions button:hover {
      transform: scale(1.05);
    }

    /* Responsivo */
    @media (max-width: 600px) {
      .memory-board {
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        padding: 10px;
      }

      .card-front, .card-back {
        font-size: 32px;
      }

      .sequence-display {
        font-size: 24px;
        letter-spacing: 4px;
      }

      .logic-options {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
}
