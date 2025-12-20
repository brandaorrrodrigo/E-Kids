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
            <div class="mode-reward">+50 FP</div>
          </div>

          <div class="mode-card" onclick="checkersGame.startMode('practice')">
            <div class="mode-icon">🎯</div>
            <h3>Treino</h3>
            <p>Pratique contra IA fácil</p>
            <div class="mode-reward">30-60 FP</div>
          </div>

          <div class="mode-card" onclick="checkersGame.startMode('vsAI')">
            <div class="mode-icon">🤖</div>
            <h3>Desafio</h3>
            <p>Jogue contra IA inteligente!</p>
            <div class="mode-reward">60-120 FP</div>
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
    const fpEarned = isPlayerWin ? 60 + (capturedPieces * 5) : 20;

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

// Instância global
let checkersGame;

function backToGames() {
  window.location.href = '/minigames.html';
}
