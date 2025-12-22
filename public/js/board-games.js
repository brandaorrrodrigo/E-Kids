// JOGOS DE TABULEIRO - E-KIDS PRO
// Dama e Xadrez educativos com tutoriais interativos

// ================================================
// JOGO DE DAMA
// ================================================

class CheckersGame {
  constructor(containerId) {
    this.containerId = containerId;
    this.board = [];
    this.selectedPiece = null;
    this.currentPlayer = 'red'; // red ou black
    this.gameMode = 'tutorial'; // tutorial, practice, vsAI
    this.tutorialStep = 0;
    this.aiDifficulty = 'easy'; // easy, medium, hard
    this.score = { red: 12, black: 12 };
    this.moveHistory = [];
    this.tutorialCompleted = localStorage.getItem('checkers_tutorial') === 'true';
  }

  init() {
    if (!this.tutorialCompleted) {
      this.startTutorial();
    } else {
      this.showModeSelection();
    }
  }

  showModeSelection() {
    const container = document.getElementById(this.containerId);
    container.innerHTML = `
      <div class="game-mode-selection">
        <h2>🎯 Jogo de Dama</h2>
        <p>Escolha como você quer jogar:</p>

        <div class="mode-cards">
          <div class="mode-card" onclick="checkersGame.startMode('tutorial')">
            <div class="mode-icon">📚</div>
            <h3>Tutorial</h3>
            <p>Aprenda do zero como jogar dama!</p>
            <div class="mode-reward">Aprenda Grátis</div>
          </div>

          <div class="mode-card" onclick="checkersGame.startMode('practice')">
            <div class="mode-icon">🎯</div>
            <h3>Treino</h3>
            <p>Pratique contra IA fácil</p>
            <div class="mode-reward">+5 FP</div>
          </div>

          <div class="mode-card" onclick="checkersGame.startMode('vsAI')">
            <div class="mode-icon">🤖</div>
            <h3>Desafio</h3>
            <p>Jogue contra IA inteligente!</p>
            <div class="mode-reward">+10 FP</div>
          </div>
        </div>

        <button class="btn-secondary" onclick="backToGames()" style="margin-top: 20px;">
          Voltar ←
        </button>
      </div>
    `;
  }

  startMode(mode) {
    this.gameMode = mode;
    if (mode === 'tutorial') {
      this.startTutorial();
    } else {
      this.initBoard();
      this.render();
      if (mode === 'vsAI' || mode === 'practice') {
        this.aiDifficulty = mode === 'practice' ? 'easy' : 'medium';
      }
    }
  }

  startTutorial() {
    this.tutorialStep = 0;
    this.gameMode = 'tutorial';
    this.showTutorialStep();
  }

  showTutorialStep() {
    const container = document.getElementById(this.containerId);

    const tutorialSteps = [
      {
        title: "Bem-vindo ao Jogo de Dama! 🎉",
        message: "Vou te ensinar a jogar dama do zero! É super divertido e fácil de aprender!",
        image: "⚫⚪",
        action: "Começar Tutorial"
      },
      {
        title: "O Tabuleiro 📋",
        message: "A dama é jogada num tabuleiro 8x8 (igual ao xadrez). Cada jogador tem 12 peças: você será as vermelhas 🔴 e eu serei as pretas ⚫.",
        image: "🟫⬜🟫⬜<br>⬜🟫⬜🟫<br>🟫⬜🟫⬜<br>⬜🟫⬜🟫",
        action: "Entendi!"
      },
      {
        title: "Como as Peças se Movem 🚶",
        message: "As peças normais se movem APENAS para frente, na diagonal, uma casa por vez. Não podem voltar!",
        image: "⬜🟫⬜<br>🟫🔴🟫<br>⬜🟫⬜",
        action: "Legal!"
      },
      {
        title: "Capturando Peças 💥",
        message: "Para capturar uma peça inimiga, você PULA por cima dela na diagonal! A peça capturada sai do jogo.",
        image: "🔴<br>⬜⚫⬜<br>⬜🟫⬜",
        action: "Entendi a captura!"
      },
      {
        title: "Peças Dama 👑",
        message: "Quando sua peça chega do outro lado do tabuleiro, ela vira DAMA! 🔴👑 As damas podem andar para FRENTE e para TRÁS!",
        image: "👑",
        action: "Que legal!"
      },
      {
        title: "Como Ganhar 🏆",
        message: "Você ganha quando:<br>✅ Capturar todas as peças do adversário<br>✅ Bloquear todas as peças dele (sem movimentos válidos)",
        image: "🏆",
        action: "Vamos Jogar!"
      }
    ];

    const step = tutorialSteps[this.tutorialStep];

    container.innerHTML = `
      <div class="tutorial-screen">
        <div class="tutorial-header">
          <span class="tutorial-progress">Passo ${this.tutorialStep + 1}/${tutorialSteps.length}</span>
        </div>

        <div class="tutorial-content">
          <h2>${step.title}</h2>
          <div class="tutorial-image">${step.image}</div>
          <div class="tutorial-message">${step.message}</div>
        </div>

        <button class="btn-primary tutorial-btn" onclick="checkersGame.nextTutorialStep()">
          ${step.action}
        </button>
      </div>
    `;
  }

  nextTutorialStep() {
    this.tutorialStep++;

    if (this.tutorialStep >= 6) {
      // Tutorial completo
      localStorage.setItem('checkers_tutorial', 'true');
      this.tutorialCompleted = true;
      this.startPracticeMission();
    } else {
      this.showTutorialStep();
    }
  }

  startPracticeMission() {
    const container = document.getElementById(this.containerId);
    container.innerHTML = `
      <div class="tutorial-screen">
        <div class="tutorial-content">
          <h2>🎯 Missão Prática!</h2>
          <div class="tutorial-image">💪</div>
          <div class="tutorial-message">
            Agora que você aprendeu as regras, vamos praticar!<br><br>
            <strong>Missão:</strong> Jogue uma partida de treino e capture pelo menos 3 peças!
          </div>
        </div>

        <button class="btn-primary tutorial-btn" onclick="checkersGame.startMode('practice')">
          Começar Treino! 🚀
        </button>
      </div>
    `;
  }

  initBoard() {
    // Criar tabuleiro 8x8
    this.board = [];
    for (let row = 0; row < 8; row++) {
      this.board[row] = [];
      for (let col = 0; col < 8; col++) {
        // Casas escuras nas primeiras 3 linhas = peças pretas
        if ((row + col) % 2 === 1 && row < 3) {
          this.board[row][col] = { player: 'black', isKing: false };
        }
        // Casas escuras nas últimas 3 linhas = peças vermelhas
        else if ((row + col) % 2 === 1 && row > 4) {
          this.board[row][col] = { player: 'red', isKing: false };
        }
        else {
          this.board[row][col] = null;
        }
      }
    }
    this.currentPlayer = 'red';
    this.selectedPiece = null;
    this.score = { red: 12, black: 12 };
  }

  render() {
    const container = document.getElementById(this.containerId);

    container.innerHTML = `
      <div class="checkers-game">
        <div class="game-info">
          <div class="player-info ${this.currentPlayer === 'black' ? 'active' : ''}">
            <span class="player-icon">⚫</span>
            <span class="player-name">IA</span>
            <span class="player-score">${this.score.black} peças</span>
          </div>

          <div class="game-status">
            <div class="turn-indicator">
              ${this.currentPlayer === 'red' ? 'Sua vez! 🔴' : 'IA pensando... 🤔'}
            </div>
          </div>

          <div class="player-info ${this.currentPlayer === 'red' ? 'active' : ''}">
            <span class="player-icon">🔴</span>
            <span class="player-name">Você</span>
            <span class="player-score">${this.score.red} peças</span>
          </div>
        </div>

        <div class="checkers-board">
          ${this.board.map((row, rowIndex) => `
            <div class="board-row">
              ${row.map((cell, colIndex) => {
                const isDark = (rowIndex + colIndex) % 2 === 1;
                const isSelected = this.selectedPiece &&
                  this.selectedPiece.row === rowIndex &&
                  this.selectedPiece.col === colIndex;
                const validMoves = this.selectedPiece ?
                  this.getValidMoves(this.selectedPiece.row, this.selectedPiece.col) : [];
                const isValidMove = validMoves.some(m => m.row === rowIndex && m.col === colIndex);

                return `
                  <div class="board-cell ${isDark ? 'dark' : 'light'} ${isSelected ? 'selected' : ''} ${isValidMove ? 'valid-move' : ''}"
                       onclick="checkersGame.cellClick(${rowIndex}, ${colIndex})">
                    ${cell ? `
                      <div class="checker-piece ${cell.player} ${cell.isKing ? 'king' : ''}">
                        ${cell.isKing ? '👑' : (cell.player === 'red' ? '🔴' : '⚫')}
                      </div>
                    ` : ''}
                    ${isValidMove ? '<div class="move-hint">•</div>' : ''}
                  </div>
                `;
              }).join('')}
            </div>
          `).join('')}
        </div>

        <div class="game-actions">
          <button class="btn-secondary" onclick="checkersGame.showHelp()">💡 Dica</button>
          <button class="btn-secondary" onclick="checkersGame.showModeSelection()">Sair</button>
        </div>
      </div>
    `;

    this.addBoardGameStyles();
  }

  cellClick(row, col) {
    const cell = this.board[row][col];

    // Se não tem peça selecionada
    if (!this.selectedPiece) {
      // Só pode selecionar peças do jogador atual
      if (cell && cell.player === this.currentPlayer && this.currentPlayer === 'red') {
        this.selectedPiece = { row, col };
        this.render();
      }
    } else {
      // Tem peça selecionada - tentar mover
      const validMoves = this.getValidMoves(this.selectedPiece.row, this.selectedPiece.col);
      const move = validMoves.find(m => m.row === row && m.col === col);

      if (move) {
        this.makeMove(this.selectedPiece.row, this.selectedPiece.col, row, col, move.captures);
        this.selectedPiece = null;

        // Verificar vitória
        if (this.checkWin()) {
          return;
        }

        // Trocar turno
        this.currentPlayer = 'black';
        this.render();

        // IA joga
        setTimeout(() => this.aiMove(), 1000);
      } else {
        // Clicou em lugar inválido - desselecionar
        this.selectedPiece = null;
        this.render();
      }
    }
  }

  getValidMoves(row, col) {
    const piece = this.board[row][col];
    if (!piece) return [];

    const moves = [];
    const directions = piece.isKing ?
      [[-1, -1], [-1, 1], [1, -1], [1, 1]] : // Dama move para todas direções
      piece.player === 'red' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]]; // Peças normais só para frente

    // Movimentos simples
    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (this.isValidPosition(newRow, newCol) && !this.board[newRow][newCol]) {
        moves.push({ row: newRow, col: newCol, captures: [] });
      }
    }

    // Capturas
    for (const [dRow, dCol] of directions) {
      const jumpRow = row + dRow;
      const jumpCol = col + dCol;
      const landRow = row + dRow * 2;
      const landCol = col + dCol * 2;

      if (this.isValidPosition(landRow, landCol)) {
        const jumpPiece = this.board[jumpRow][jumpCol];
        const landCell = this.board[landRow][landCol];

        if (jumpPiece && jumpPiece.player !== piece.player && !landCell) {
          moves.push({
            row: landRow,
            col: landCol,
            captures: [{ row: jumpRow, col: jumpCol }]
          });
        }
      }
    }

    return moves;
  }

  isValidPosition(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  makeMove(fromRow, fromCol, toRow, toCol, captures) {
    const piece = this.board[fromRow][fromCol];

    // Mover peça
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;

    // Capturar peças
    if (captures && captures.length > 0) {
      captures.forEach(cap => {
        this.board[cap.row][cap.col] = null;
        this.score[piece.player === 'red' ? 'black' : 'red']--;
      });
    }

    // Promover a dama
    if ((piece.player === 'red' && toRow === 0) || (piece.player === 'black' && toRow === 7)) {
      piece.isKing = true;
    }

    this.moveHistory.push({ fromRow, fromCol, toRow, toCol, captures });
  }

  aiMove() {
    // IA simples: encontrar todas as jogadas válidas e escolher uma
    const allMoves = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.player === 'black') {
          const moves = this.getValidMoves(row, col);
          moves.forEach(move => {
            allMoves.push({ fromRow: row, fromCol: col, ...move });
          });
        }
      }
    }

    if (allMoves.length === 0) {
      // IA sem movimentos - jogador venceu!
      this.gameWon('red');
      return;
    }

    // Priorizar capturas
    const captureMoves = allMoves.filter(m => m.captures && m.captures.length > 0);
    const selectedMoves = captureMoves.length > 0 ? captureMoves : allMoves;

    // Escolher movimento aleatório (IA fácil)
    const move = selectedMoves[Math.floor(Math.random() * selectedMoves.length)];

    this.makeMove(move.fromRow, move.fromCol, move.row, move.col, move.captures);

    // Verificar vitória
    if (this.checkWin()) {
      return;
    }

    this.currentPlayer = 'red';
    this.render();
  }

  checkWin() {
    if (this.score.black === 0) {
      this.gameWon('red');
      return true;
    }
    if (this.score.red === 0) {
      this.gameWon('black');
      return true;
    }
    return false;
  }

  gameWon(winner) {
    const isPlayerWin = winner === 'red';
    const capturedPieces = 12 - this.score[winner === 'red' ? 'black' : 'red'];
    // FP fixo por dificuldade da IA: easy=5, medium=10, hard=15
    const fpByDifficulty = { 'easy': 5, 'medium': 10, 'hard': 15 };
    const fpEarned = isPlayerWin ? (fpByDifficulty[this.aiDifficulty] || 10) : 0;

    setTimeout(() => {
      const container = document.getElementById(this.containerId);
      container.innerHTML = `
        <div class="game-result">
          <div class="result-emoji">${isPlayerWin ? '🏆' : '😅'}</div>
          <h2>${isPlayerWin ? 'Você Venceu!' : 'A IA Venceu!'}</h2>
          <p>${isPlayerWin ? 'Parabéns! Você jogou muito bem!' : 'Não desista! Continue praticando!'}</p>

          <div class="result-stats">
            <div class="result-stat">
              <div class="result-stat-value">${capturedPieces}</div>
              <div class="result-stat-label">Peças Capturadas</div>
            </div>
            <div class="result-stat">
              <div class="result-stat-value">${this.moveHistory.length}</div>
              <div class="result-stat-label">Movimentos</div>
            </div>
            <div class="result-stat highlight">
              <div class="result-stat-value">+${fpEarned} FP</div>
              <div class="result-stat-label">Ganhos</div>
            </div>
          </div>

          <div class="game-actions">
            <button class="btn-primary" onclick="checkersGame.saveAndExit(${fpEarned})">Finalizar ✅</button>
            <button class="btn-secondary" onclick="checkersGame.showModeSelection()">Jogar Novamente 🔄</button>
          </div>
        </div>
      `;
    }, 300);
  }

  showHelp() {
    alert('💡 Dica:\n\n✅ Tente capturar as peças da IA pulando sobre elas\n✅ Proteja suas peças evitando deixá-las isoladas\n✅ Tente chegar do outro lado para virar Dama! 👑');
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
          gameKey: 'checkers',
          score: 12 - this.score.black,
          fpEarned: fpEarned
        })
      });

      backToGames();
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
      backToGames();
    }
  }

  addBoardGameStyles() {
    if (document.getElementById('board-games-styles')) return;

    const style = document.createElement('style');
    style.id = 'board-games-styles';
    style.textContent = `
      .checkers-board {
        display: grid;
        grid-template-rows: repeat(8, 1fr);
        width: min(500px, 90vw);
        height: min(500px, 90vw);
        margin: 20px auto;
        border: 4px solid #2c3e50;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      }

      .board-row {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
      }

      .board-cell {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: pointer;
        transition: all 0.2s;
      }

      .board-cell.light {
        background: #f0d9b5;
      }

      .board-cell.dark {
        background: #b58863;
      }

      .board-cell.selected {
        background: #7fc97f !important;
        box-shadow: inset 0 0 0 3px #27ae60;
      }

      .board-cell.valid-move {
        background: #ffffcc !important;
        cursor: pointer;
      }

      .move-hint {
        position: absolute;
        width: 20px;
        height: 20px;
        background: #27ae60;
        border-radius: 50%;
        opacity: 0.6;
      }

      .checker-piece {
        width: 70%;
        height: 70%;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        transition: transform 0.2s;
      }

      .checker-piece.red {
        background: radial-gradient(circle at 30% 30%, #ff6b6b, #c92a2a);
      }

      .checker-piece.black {
        background: radial-gradient(circle at 30% 30%, #555, #222);
      }

      .checker-piece.king {
        box-shadow: 0 0 12px gold;
      }

      .board-cell:hover .checker-piece {
        transform: scale(1.1);
      }

      .game-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        gap: 20px;
      }

      .player-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 15px;
        border-radius: 12px;
        background: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        min-width: 120px;
      }

      .player-info.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        transform: scale(1.05);
      }

      .player-icon {
        font-size: 32px;
      }

      .player-name {
        font-weight: bold;
        font-size: 14px;
      }

      .player-score {
        font-size: 12px;
        opacity: 0.8;
      }

      .game-status {
        text-align: center;
      }

      .turn-indicator {
        font-size: 18px;
        font-weight: bold;
        color: #2c3e50;
        padding: 12px 20px;
        background: white;
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .tutorial-screen {
        max-width: 600px;
        margin: 0 auto;
        text-align: center;
        padding: 40px 20px;
      }

      .tutorial-header {
        margin-bottom: 30px;
      }

      .tutorial-progress {
        background: #ecf0f1;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        color: #7F8C8D;
      }

      .tutorial-content {
        background: white;
        padding: 40px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        margin-bottom: 30px;
      }

      .tutorial-content h2 {
        color: #2c3e50;
        margin: 0 0 20px 0;
      }

      .tutorial-image {
        font-size: 64px;
        margin: 30px 0;
        line-height: 1.5;
      }

      .tutorial-message {
        color: #7F8C8D;
        font-size: 18px;
        line-height: 1.6;
      }

      .tutorial-btn {
        width: 100%;
        max-width: 300px;
        padding: 18px;
        font-size: 18px;
      }

      .game-mode-selection {
        text-align: center;
        padding: 20px;
      }

      .game-mode-selection h2 {
        color: #2c3e50;
        margin-bottom: 10px;
      }

      .game-mode-selection > p {
        color: #7F8C8D;
        margin-bottom: 30px;
      }

      .mode-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
      }

      .mode-card {
        background: white;
        padding: 30px 20px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        cursor: pointer;
        transition: all 0.3s;
        border: 3px solid transparent;
      }

      .mode-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        border-color: #667eea;
      }

      .mode-icon {
        font-size: 48px;
        margin-bottom: 15px;
      }

      .mode-card h3 {
        color: #2c3e50;
        margin: 0 0 10px 0;
      }

      .mode-card p {
        color: #7F8C8D;
        font-size: 14px;
        margin: 0 0 15px 0;
      }

      .mode-reward {
        background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%);
        color: white;
        padding: 8px 16px;
        border-radius: 12px;
        font-weight: bold;
        display: inline-block;
      }

      @media (max-width: 600px) {
        .game-info {
          flex-direction: column;
        }

        .mode-cards {
          grid-template-columns: 1fr;
        }

        .checker-piece {
          font-size: 1.5rem;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ================================================
// JOGO DE XADREZ
// ================================================

class ChessGame {
  constructor(containerId) {
    this.containerId = containerId;
    this.board = [];
    this.selectedPiece = null;
    this.currentPlayer = 'white'; // white ou black
    this.gameMode = 'tutorial'; // tutorial, practice, vsAI
    this.tutorialStep = 0;
    this.aiDifficulty = 'easy';
    this.moveHistory = [];
    this.capturedPieces = { white: [], black: [] };
    this.tutorialCompleted = localStorage.getItem('chess_tutorial') === 'true';
    this.kingPositions = { white: { row: 7, col: 4 }, black: { row: 0, col: 4 } };
    this.inCheck = { white: false, black: false };
  }

  init() {
    if (!this.tutorialCompleted) {
      this.startTutorial();
    } else {
      this.showModeSelection();
    }
  }

  showModeSelection() {
    const container = document.getElementById(this.containerId);
    container.innerHTML = `
      <div class="game-mode-selection">
        <h2>♟️ Jogo de Xadrez</h2>
        <p>Escolha como você quer jogar:</p>

        <div class="mode-cards">
          <div class="mode-card" onclick="chessGame.startMode('tutorial')">
            <div class="mode-icon">📚</div>
            <h3>Tutorial</h3>
            <p>Aprenda do zero como jogar xadrez!</p>
            <div class="mode-reward">Aprenda Grátis</div>
          </div>

          <div class="mode-card" onclick="chessGame.startMode('practice')">
            <div class="mode-icon">🎯</div>
            <h3>Treino</h3>
            <p>Pratique contra IA fácil</p>
            <div class="mode-reward">+5 FP</div>
          </div>

          <div class="mode-card" onclick="chessGame.startMode('vsAI')">
            <div class="mode-icon">🤖</div>
            <h3>Desafio</h3>
            <p>Jogue contra IA inteligente!</p>
            <div class="mode-reward">+10 FP</div>
          </div>
        </div>

        <button class="btn-secondary" onclick="backToGames()" style="margin-top: 20px;">
          Voltar ←
        </button>
      </div>
    `;
  }

  startMode(mode) {
    this.gameMode = mode;
    if (mode === 'tutorial') {
      this.startTutorial();
    } else {
      this.initBoard();
      this.render();
      if (mode === 'vsAI' || mode === 'practice') {
        this.aiDifficulty = mode === 'practice' ? 'easy' : 'medium';
      }
    }
  }

  startTutorial() {
    this.tutorialStep = 0;
    this.gameMode = 'tutorial';
    this.showTutorialStep();
  }

  showTutorialStep() {
    const container = document.getElementById(this.containerId);

    const tutorialSteps = [
      {
        title: "Bem-vindo ao Xadrez! ♟️",
        message: "O xadrez é o jogo dos reis! Vou te ensinar a jogar do zero. É um jogo de estratégia super divertido!",
        image: "👑♟️",
        action: "Começar Tutorial"
      },
      {
        title: "O Tabuleiro 📋",
        message: "O xadrez usa um tabuleiro 8x8, igual à dama. Cada jogador começa com 16 peças: você será as brancas ⚪ e eu serei as pretas ⚫. As brancas sempre jogam primeiro!",
        image: "⬜⬛⬜⬛<br>⬛⬜⬛⬜<br>⬜⬛⬜⬛<br>⬛⬜⬛⬜",
        action: "Entendi!"
      },
      {
        title: "O Rei 👑",
        message: "O REI é a peça mais importante! Ele move 1 casa em qualquer direção. Se seu rei for capturado, você perde! O objetivo é dar XEQUE-MATE no rei adversário.",
        image: "👑",
        action: "Legal!"
      },
      {
        title: "A Rainha 💎",
        message: "A RAINHA é a peça mais poderosa! Ela pode mover quantas casas quiser na horizontal, vertical ou diagonal. É muito importante protegê-la!",
        image: "💎",
        action: "Uau!"
      },
      {
        title: "As Torres 🏰",
        message: "As TORRES movem quantas casas quiserem, mas só na horizontal ou vertical (nunca na diagonal). Você tem 2 torres, uma em cada canto.",
        image: "🏰",
        action: "Entendi!"
      },
      {
        title: "Os Bispos ⛪",
        message: "Os BISPOS movem quantas casas quiserem, mas APENAS na diagonal. Você tem 2 bispos: um nas casas brancas e outro nas pretas.",
        image: "⛪",
        action: "Beleza!"
      },
      {
        title: "Os Cavalos 🐴",
        message: "Os CAVALOS são especiais! Eles movem em \"L\": 2 casas numa direção e 1 na outra. São as ÚNICAS peças que podem PULAR sobre outras!",
        image: "🐴",
        action: "Que legal!"
      },
      {
        title: "Os Peões ⚔️",
        message: "Os PEÕES são as menores peças. Movem 1 casa para frente (2 no primeiro movimento). Capturam na diagonal! Se chegarem do outro lado, viram RAINHA! 💎",
        image: "⚔️",
        action: "Entendi!"
      },
      {
        title: "Xeque e Xeque-Mate ⚠️",
        message: "XEQUE = Quando o rei está sob ataque.<br>XEQUE-MATE = Quando o rei está em xeque e não tem como escapar. Aí você VENCE! 🏆",
        image: "⚠️👑",
        action: "Agora faz sentido!"
      },
      {
        title: "Como Ganhar 🏆",
        message: "Você vence quando:<br>✅ Der XEQUE-MATE no rei adversário<br>✅ O adversário desistir<br><br>Agora você está pronto para jogar! 🎉",
        image: "🏆",
        action: "Vamos Jogar!"
      }
    ];

    const step = tutorialSteps[this.tutorialStep];

    container.innerHTML = `
      <div class="tutorial-screen">
        <div class="tutorial-header">
          <span class="tutorial-progress">Passo ${this.tutorialStep + 1}/${tutorialSteps.length}</span>
        </div>

        <div class="tutorial-content">
          <h2>${step.title}</h2>
          <div class="tutorial-image">${step.image}</div>
          <div class="tutorial-message">${step.message}</div>
        </div>

        <button class="btn-primary tutorial-btn" onclick="chessGame.nextTutorialStep()">
          ${step.action}
        </button>
      </div>
    `;
  }

  nextTutorialStep() {
    this.tutorialStep++;

    if (this.tutorialStep >= 10) {
      // Tutorial completo
      localStorage.setItem('chess_tutorial', 'true');
      this.tutorialCompleted = true;
      this.startPracticeMission();
    } else {
      this.showTutorialStep();
    }
  }

  startPracticeMission() {
    const container = document.getElementById(this.containerId);
    container.innerHTML = `
      <div class="tutorial-screen">
        <div class="tutorial-content">
          <h2>🎯 Missão Prática!</h2>
          <div class="tutorial-image">💪</div>
          <div class="tutorial-message">
            Agora que você aprendeu as regras, vamos praticar!<br><br>
            <strong>Missão:</strong> Jogue uma partida de treino e tente dar xeque-mate!
          </div>
        </div>

        <button class="btn-primary tutorial-btn" onclick="chessGame.startMode('practice')">
          Começar Treino! 🚀
        </button>
      </div>
    `;
  }

  initBoard() {
    // Criar tabuleiro 8x8 vazio
    this.board = Array(8).fill(null).map(() => Array(8).fill(null));

    // Configurar peças pretas (linha 0 e 1)
    const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    for (let col = 0; col < 8; col++) {
      this.board[0][col] = { type: backRow[col], player: 'black' };
      this.board[1][col] = { type: 'pawn', player: 'black' };
    }

    // Configurar peças brancas (linha 6 e 7)
    for (let col = 0; col < 8; col++) {
      this.board[6][col] = { type: 'pawn', player: 'white' };
      this.board[7][col] = { type: backRow[col], player: 'white' };
    }

    this.currentPlayer = 'white';
    this.selectedPiece = null;
    this.capturedPieces = { white: [], black: [] };
    this.kingPositions = { white: { row: 7, col: 4 }, black: { row: 0, col: 4 } };
    this.moveHistory = [];
  }

  getPieceIcon(piece) {
    if (!piece) return '';

    const icons = {
      white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
      },
      black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
      }
    };

    return icons[piece.player][piece.type];
  }

  render() {
    const container = document.getElementById(this.containerId);

    container.innerHTML = `
      <div class="chess-game">
        <div class="game-info">
          <div class="player-info ${this.currentPlayer === 'black' ? 'active' : ''}">
            <span class="player-icon">⚫</span>
            <span class="player-name">IA</span>
            <span class="player-score">${this.capturedPieces.white.length} capturadas</span>
          </div>

          <div class="game-status">
            <div class="turn-indicator">
              ${this.currentPlayer === 'white' ? 'Sua vez! ⚪' : 'IA pensando... 🤔'}
            </div>
            ${this.inCheck[this.currentPlayer] ? '<div class="check-warning">⚠️ XEQUE!</div>' : ''}
          </div>

          <div class="player-info ${this.currentPlayer === 'white' ? 'active' : ''}">
            <span class="player-icon">⚪</span>
            <span class="player-name">Você</span>
            <span class="player-score">${this.capturedPieces.black.length} capturadas</span>
          </div>
        </div>

        <div class="chess-board">
          ${this.board.flatMap((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0;
              const isSelected = this.selectedPiece &&
                this.selectedPiece.row === rowIndex &&
                this.selectedPiece.col === colIndex;
              const validMoves = this.selectedPiece ?
                this.getValidMoves(this.selectedPiece.row, this.selectedPiece.col) : [];
              const isValidMove = validMoves.some(m => m.row === rowIndex && m.col === colIndex);

              return `
                <div class="board-cell ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isValidMove ? 'valid-move' : ''}"
                     onclick="chessGame.cellClick(${rowIndex}, ${colIndex})">
                  ${cell ? `
                    <div class="chess-piece ${cell.player}">
                      ${this.getPieceIcon(cell)}
                    </div>
                  ` : ''}
                  ${isValidMove ? '<div class="move-hint">•</div>' : ''}
                </div>
              `;
            })
          ).join('')}
        </div>

        <div class="captured-pieces">
          <div class="captured-group">
            <strong>Você capturou:</strong>
            <div class="captured-list">
              ${this.capturedPieces.black.map(p => this.getPieceIcon(p)).join(' ')}
            </div>
          </div>
          <div class="captured-group">
            <strong>IA capturou:</strong>
            <div class="captured-list">
              ${this.capturedPieces.white.map(p => this.getPieceIcon(p)).join(' ')}
            </div>
          </div>
        </div>

        <div class="game-actions">
          <button class="btn-secondary" onclick="chessGame.showHelp()">💡 Dica</button>
          <button class="btn-secondary" onclick="chessGame.showModeSelection()">Sair</button>
        </div>
      </div>
    `;

    this.addChessStyles();
  }

  cellClick(row, col) {
    const cell = this.board[row][col];

    // Se não tem peça selecionada
    if (!this.selectedPiece) {
      // Só pode selecionar peças do jogador atual
      if (cell && cell.player === this.currentPlayer && this.currentPlayer === 'white') {
        this.selectedPiece = { row, col };
        this.render();
      }
    } else {
      // Tem peça selecionada - tentar mover
      const validMoves = this.getValidMoves(this.selectedPiece.row, this.selectedPiece.col);
      const move = validMoves.find(m => m.row === row && m.col === col);

      if (move) {
        this.makeMove(this.selectedPiece.row, this.selectedPiece.col, row, col);
        this.selectedPiece = null;

        // Verificar xeque-mate
        if (this.isCheckmate('black')) {
          this.gameWon('white');
          return;
        }

        // Trocar turno
        this.currentPlayer = 'black';
        this.render();

        // IA joga
        setTimeout(() => this.aiMove(), 1000);
      } else {
        // Clicou em lugar inválido - desselecionar
        this.selectedPiece = null;
        this.render();
      }
    }
  }

  getValidMoves(row, col) {
    const piece = this.board[row][col];
    if (!piece) return [];

    let moves = [];

    switch (piece.type) {
      case 'pawn':
        moves = this.getPawnMoves(row, col, piece);
        break;
      case 'rook':
        moves = this.getRookMoves(row, col, piece);
        break;
      case 'knight':
        moves = this.getKnightMoves(row, col, piece);
        break;
      case 'bishop':
        moves = this.getBishopMoves(row, col, piece);
        break;
      case 'queen':
        moves = this.getQueenMoves(row, col, piece);
        break;
      case 'king':
        moves = this.getKingMoves(row, col, piece);
        break;
    }

    // Filtrar movimentos que deixam o rei em xeque
    return moves.filter(move => !this.wouldBeInCheck(row, col, move.row, move.col, piece.player));
  }

  getPawnMoves(row, col, piece) {
    const moves = [];
    const direction = piece.player === 'white' ? -1 : 1;
    const startRow = piece.player === 'white' ? 6 : 1;

    // Movimento para frente
    const newRow = row + direction;
    if (this.isValidPosition(newRow, col) && !this.board[newRow][col]) {
      moves.push({ row: newRow, col });

      // Movimento duplo na primeira jogada
      if (row === startRow) {
        const doubleRow = row + direction * 2;
        if (!this.board[doubleRow][col]) {
          moves.push({ row: doubleRow, col });
        }
      }
    }

    // Capturas diagonais
    for (const dCol of [-1, 1]) {
      const newCol = col + dCol;
      if (this.isValidPosition(newRow, newCol)) {
        const target = this.board[newRow][newCol];
        if (target && target.player !== piece.player) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }

    return moves;
  }

  getRookMoves(row, col, piece) {
    return this.getLineMoves(row, col, piece, [[0, 1], [0, -1], [1, 0], [-1, 0]]);
  }

  getBishopMoves(row, col, piece) {
    return this.getLineMoves(row, col, piece, [[1, 1], [1, -1], [-1, 1], [-1, -1]]);
  }

  getQueenMoves(row, col, piece) {
    return this.getLineMoves(row, col, piece, [
      [0, 1], [0, -1], [1, 0], [-1, 0],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ]);
  }

  getKnightMoves(row, col, piece) {
    const moves = [];
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    for (const [dRow, dCol] of knightMoves) {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (this.isValidPosition(newRow, newCol)) {
        const target = this.board[newRow][newCol];
        if (!target || target.player !== piece.player) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }

    return moves;
  }

  getKingMoves(row, col, piece) {
    const moves = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (this.isValidPosition(newRow, newCol)) {
        const target = this.board[newRow][newCol];
        if (!target || target.player !== piece.player) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }

    return moves;
  }

  getLineMoves(row, col, piece, directions) {
    const moves = [];

    for (const [dRow, dCol] of directions) {
      let newRow = row + dRow;
      let newCol = col + dCol;

      while (this.isValidPosition(newRow, newCol)) {
        const target = this.board[newRow][newCol];

        if (!target) {
          moves.push({ row: newRow, col: newCol });
        } else {
          if (target.player !== piece.player) {
            moves.push({ row: newRow, col: newCol });
          }
          break;
        }

        newRow += dRow;
        newCol += dCol;
      }
    }

    return moves;
  }

  isValidPosition(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  wouldBeInCheck(fromRow, fromCol, toRow, toCol, player) {
    // Simular o movimento
    const originalPiece = this.board[fromRow][fromCol];
    const capturedPiece = this.board[toRow][toCol];

    this.board[toRow][toCol] = originalPiece;
    this.board[fromRow][fromCol] = null;

    // Atualizar posição do rei se necessário
    let originalKingPos = null;
    if (originalPiece.type === 'king') {
      originalKingPos = { ...this.kingPositions[player] };
      this.kingPositions[player] = { row: toRow, col: toCol };
    }

    // Verificar se está em xeque
    const inCheck = this.isInCheck(player);

    // Reverter movimento
    this.board[fromRow][fromCol] = originalPiece;
    this.board[toRow][toCol] = capturedPiece;

    if (originalKingPos) {
      this.kingPositions[player] = originalKingPos;
    }

    return inCheck;
  }

  isInCheck(player) {
    const kingPos = this.kingPositions[player];
    const opponent = player === 'white' ? 'black' : 'white';

    // Verificar se alguma peça adversária pode capturar o rei
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.player === opponent) {
          const moves = this.getValidMovesWithoutCheckTest(row, col, piece);
          if (moves.some(m => m.row === kingPos.row && m.col === kingPos.col)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  getValidMovesWithoutCheckTest(row, col, piece) {
    // Versão simplificada sem verificar xeque (para evitar recursão infinita)
    switch (piece.type) {
      case 'pawn': return this.getPawnMoves(row, col, piece);
      case 'rook': return this.getRookMoves(row, col, piece);
      case 'knight': return this.getKnightMoves(row, col, piece);
      case 'bishop': return this.getBishopMoves(row, col, piece);
      case 'queen': return this.getQueenMoves(row, col, piece);
      case 'king': return this.getKingMoves(row, col, piece);
      default: return [];
    }
  }

  isCheckmate(player) {
    if (!this.isInCheck(player)) return false;

    // Verificar se há algum movimento válido
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.player === player) {
          const moves = this.getValidMoves(row, col);
          if (moves.length > 0) {
            return false;
          }
        }
      }
    }

    return true;
  }

  makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    const captured = this.board[toRow][toCol];

    // Capturar peça se houver
    if (captured) {
      this.capturedPieces[piece.player].push(captured);
    }

    // Mover peça
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;

    // Atualizar posição do rei
    if (piece.type === 'king') {
      this.kingPositions[piece.player] = { row: toRow, col: toCol };
    }

    // Promoção de peão
    if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
      piece.type = 'queen'; // Promover automaticamente para rainha
    }

    // Atualizar estado de xeque
    this.inCheck.white = this.isInCheck('white');
    this.inCheck.black = this.isInCheck('black');

    this.moveHistory.push({ fromRow, fromCol, toRow, toCol, captured });
  }

  aiMove() {
    // IA simples: encontrar todas as jogadas válidas e escolher uma
    const allMoves = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.player === 'black') {
          const moves = this.getValidMoves(row, col);
          moves.forEach(move => {
            allMoves.push({
              fromRow: row,
              fromCol: col,
              toRow: move.row,
              toCol: move.col,
              piece: piece,
              captures: this.board[move.row][move.col]
            });
          });
        }
      }
    }

    if (allMoves.length === 0) {
      // IA sem movimentos - jogador venceu!
      this.gameWon('white');
      return;
    }

    // Priorizar capturas
    const captureMoves = allMoves.filter(m => m.captures);
    const selectedMoves = captureMoves.length > 0 ? captureMoves : allMoves;

    // Escolher movimento aleatório
    const move = selectedMoves[Math.floor(Math.random() * selectedMoves.length)];

    this.makeMove(move.fromRow, move.fromCol, move.toRow, move.toCol);

    // Verificar xeque-mate
    if (this.isCheckmate('white')) {
      this.gameWon('black');
      return;
    }

    this.currentPlayer = 'white';
    this.render();
  }

  gameWon(winner) {
    const isPlayerWin = winner === 'white';
    // FP fixo por dificuldade da IA: easy=5, medium=10, hard=15
    const fpByDifficulty = { 'easy': 5, 'medium': 10, 'hard': 15 };
    const fpEarned = isPlayerWin ? (fpByDifficulty[this.aiDifficulty] || 10) : 0;

    setTimeout(() => {
      const container = document.getElementById(this.containerId);
      container.innerHTML = `
        <div class="game-result">
          <div class="result-emoji">${isPlayerWin ? '🏆' : '😅'}</div>
          <h2>${isPlayerWin ? 'Xeque-Mate! Você Venceu!' : 'Xeque-Mate! A IA Venceu!'}</h2>
          <p>${isPlayerWin ? 'Parabéns! Você é um mestre do xadrez!' : 'Não desista! O xadrez requer prática!'}</p>

          <div class="result-stats">
            <div class="result-stat">
              <div class="result-stat-value">${this.capturedPieces[winner].length}</div>
              <div class="result-stat-label">Peças Capturadas</div>
            </div>
            <div class="result-stat">
              <div class="result-stat-value">${this.moveHistory.length}</div>
              <div class="result-stat-label">Movimentos</div>
            </div>
            <div class="result-stat highlight">
              <div class="result-stat-value">+${fpEarned} FP</div>
              <div class="result-stat-label">Ganhos</div>
            </div>
          </div>

          <div class="game-actions">
            <button class="btn-primary" onclick="chessGame.saveAndExit(${fpEarned})">Finalizar ✅</button>
            <button class="btn-secondary" onclick="chessGame.showModeSelection()">Jogar Novamente 🔄</button>
          </div>
        </div>
      `;
    }, 300);
  }

  showHelp() {
    alert('💡 Dicas de Xadrez:\n\n✅ Proteja seu rei sempre!\n✅ Tente controlar o centro do tabuleiro\n✅ Desenvolva suas peças (tire-as da posição inicial)\n✅ Pense alguns movimentos à frente\n✅ A rainha é poderosa, mas não a perca cedo!');
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
          gameKey: 'chess',
          score: this.capturedPieces.white.length + this.capturedPieces.black.length,
          fpEarned: fpEarned
        })
      });

      backToGames();
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
      backToGames();
    }
  }

  addChessStyles() {
    if (document.getElementById('chess-styles')) return;

    const style = document.createElement('style');
    style.id = 'chess-styles';
    style.textContent = `
      .chess-board {
        display: grid;
        grid-template-rows: repeat(8, 1fr);
        grid-template-columns: repeat(8, 1fr);
        width: min(500px, 90vw);
        height: min(500px, 90vw);
        aspect-ratio: 1;
        margin: 20px auto;
        border: 4px solid #2c3e50;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        position: relative;
        z-index: 5;
      }

      .board-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: pointer;
        transition: background 0.2s;
        min-width: 0;
        min-height: 0;
      }

      .board-cell.light {
        background: #f0d9b5;
      }

      .board-cell.dark {
        background: #b58863;
      }

      .board-cell.selected {
        background: #7fc97f !important;
        box-shadow: inset 0 0 0 3px #27ae60;
      }

      .board-cell.valid-move {
        background: #ffffcc !important;
        cursor: pointer;
      }

      .chess-piece {
        font-size: 2.5rem;
        cursor: pointer;
        transition: transform 0.2s;
        user-select: none;
      }

      .board-cell:hover .chess-piece {
        transform: scale(1.15);
      }

      .captured-pieces {
        display: flex;
        justify-content: space-around;
        padding: 20px;
        gap: 20px;
        flex-wrap: wrap;
      }

      .captured-group {
        background: white;
        padding: 15px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        min-width: 200px;
      }

      .captured-group strong {
        display: block;
        margin-bottom: 10px;
        color: #2c3e50;
        font-size: 14px;
      }

      .captured-list {
        font-size: 1.5rem;
        min-height: 30px;
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }

      .check-warning {
        background: #e74c3c;
        color: white;
        padding: 8px 16px;
        border-radius: 12px;
        font-weight: bold;
        margin-top: 10px;
        animation: pulse 1s infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }

      .game-actions {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin: 20px 0;
        flex-wrap: wrap;
      }

      .btn-secondary {
        background: #6c757d !important;
        color: white !important;
        border: none !important;
        padding: 12px 24px !important;
        border-radius: 8px !important;
        font-size: 16px !important;
        font-weight: bold !important;
        cursor: pointer !important;
        transition: all 0.3s !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        position: relative !important;
        z-index: 10 !important;
      }

      .btn-secondary:hover {
        background: #5a6268 !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
      }

      .btn-secondary:active {
        transform: translateY(0);
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }

      .btn-primary:active {
        transform: translateY(0);
      }

      .game-mode-selection {
        text-align: center;
        padding: 20px;
      }

      .game-mode-selection h2 {
        color: #2c3e50;
        margin-bottom: 10px;
      }

      .game-mode-selection > p {
        color: #7F8C8D;
        margin-bottom: 30px;
      }

      .mode-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
        position: relative;
        z-index: 10;
      }

      .mode-card {
        background: white;
        padding: 30px 20px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        cursor: pointer;
        transition: all 0.3s;
        border: 3px solid transparent;
        position: relative;
        z-index: 10;
      }

      .mode-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        border-color: #667eea;
      }

      .mode-icon {
        font-size: 48px;
        margin-bottom: 15px;
      }

      .mode-card h3 {
        color: #2c3e50;
        margin: 0 0 10px 0;
      }

      .mode-card p {
        color: #7F8C8D;
        font-size: 14px;
        margin: 0 0 15px 0;
      }

      .mode-reward {
        background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%);
        color: white;
        padding: 8px 16px;
        border-radius: 12px;
        font-weight: bold;
        display: inline-block;
      }

      .tutorial-btn {
        width: 100%;
        max-width: 300px;
        padding: 18px;
        font-size: 18px;
      }

      .game-mode-selection {
        position: relative;
        z-index: 10;
      }

      @media (max-width: 600px) {
        .chess-piece {
          font-size: 1.8rem;
        }

        .captured-pieces {
          flex-direction: column;
        }

        .mode-cards {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Instâncias globais
let checkersGame;
let chessGame;

function backToGames() {
  window.location.href = '/minigames.html';
}
