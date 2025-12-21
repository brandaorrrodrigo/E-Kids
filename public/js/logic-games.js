// JOGOS DE LÓGICA - E-KIDS PRO
// Sudoku, Torre de Hanói, Campo Minado, 2048, Quebra-Cabeça Deslizante

// ================================================
// 1. SUDOKU INFANTIL
// ================================================

class SudokuGame {
  constructor(containerId) {
    this.containerId = containerId;
    this.size = 4; // 3, 4, ou 6
    this.board = [];
    this.solution = [];
    this.initialCells = [];
    this.selectedCell = null;
    this.mistakes = 0;
    this.startTime = Date.now();
  }

  init() {
    this.showDifficultySelection();
  }

  showDifficultySelection() {
    const container = document.getElementById(this.containerId);
    container.innerHTML = `
      <div class="game-mode-selection">
        <h2>🔢 Sudoku Infantil</h2>
        <p>Complete o tabuleiro sem repetir números!</p>

        <div class="mode-cards">
          <div class="mode-card" onclick="sudokuGame.startGame(3)">
            <div class="mode-icon">😊</div>
            <h3>Fácil</h3>
            <p>Tabuleiro 3×3 (números 1-3)</p>
            <div class="mode-reward">20 FP</div>
          </div>

          <div class="mode-card" onclick="sudokuGame.startGame(4)">
            <div class="mode-icon">🤔</div>
            <h3>Médio</h3>
            <p>Tabuleiro 4×4 (números 1-4)</p>
            <div class="mode-reward">40 FP</div>
          </div>

          <div class="mode-card" onclick="sudokuGame.startGame(6)">
            <div class="mode-icon">😎</div>
            <h3>Difícil</h3>
            <p>Tabuleiro 6×6 (números 1-6)</p>
            <div class="mode-reward">60 FP</div>
          </div>
        </div>

        <button class="btn-secondary" onclick="backToGames()" style="margin-top: 20px;">
          Voltar ←
        </button>
      </div>
    `;
  }

  startGame(size) {
    this.size = size;
    this.mistakes = 0;
    this.startTime = Date.now();
    this.generatePuzzle();
    this.render();
  }

  generatePuzzle() {
    // Criar solução válida
    this.solution = this.createValidBoard();

    // Criar puzzle removendo números
    this.board = JSON.parse(JSON.stringify(this.solution));
    this.initialCells = [];

    const cellsToRemove = Math.floor(this.size * this.size * 0.5); // Remove 50%
    let removed = 0;

    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * this.size);
      const col = Math.floor(Math.random() * this.size);

      if (this.board[row][col] !== 0) {
        this.board[row][col] = 0;
        removed++;
      }
    }

    // Marcar células iniciais (não editáveis)
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] !== 0) {
          this.initialCells.push(`${row}-${col}`);
        }
      }
    }
  }

  createValidBoard() {
    const board = Array(this.size).fill(0).map(() => Array(this.size).fill(0));
    this.fillBoard(board, 0, 0);
    return board;
  }

  fillBoard(board, row, col) {
    if (row === this.size) return true;
    if (col === this.size) return this.fillBoard(board, row + 1, 0);

    const numbers = Array.from({length: this.size}, (_, i) => i + 1);
    this.shuffle(numbers);

    for (const num of numbers) {
      if (this.isValidPlacement(board, row, col, num)) {
        board[row][col] = num;
        if (this.fillBoard(board, row, col + 1)) return true;
        board[row][col] = 0;
      }
    }

    return false;
  }

  isValidPlacement(board, row, col, num) {
    // Verificar linha
    for (let c = 0; c < this.size; c++) {
      if (board[row][c] === num) return false;
    }

    // Verificar coluna
    for (let r = 0; r < this.size; r++) {
      if (board[r][col] === num) return false;
    }

    // Verificar sub-grade (para 4x4 e 6x6)
    if (this.size === 4 || this.size === 6) {
      const boxSize = this.size === 4 ? 2 : 3;
      const boxRow = Math.floor(row / boxSize) * boxSize;
      const boxCol = Math.floor(col / boxSize) * boxSize;

      for (let r = boxRow; r < boxRow + boxSize; r++) {
        for (let c = boxCol; c < boxCol + boxSize; c++) {
          if (board[r][c] === num) return false;
        }
      }
    }

    return true;
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  render() {
    const container = document.getElementById(this.containerId);

    container.innerHTML = `
      <div class="sudoku-game">
        <div class="game-header">
          <button class="btn-secondary" onclick="sudokuGame.showDifficultySelection()">← Voltar</button>
          <div class="game-stats">
            <span>❌ Erros: ${this.mistakes}</span>
            <span>⏱️ ${this.getElapsedTime()}</span>
          </div>
        </div>

        <div class="sudoku-board size-${this.size}">
          ${this.board.map((row, rowIdx) => `
            <div class="sudoku-row">
              ${row.map((cell, colIdx) => {
                const isInitial = this.initialCells.includes(`${rowIdx}-${colIdx}`);
                const isSelected = this.selectedCell &&
                  this.selectedCell.row === rowIdx &&
                  this.selectedCell.col === colIdx;

                return `
                  <div class="sudoku-cell ${isInitial ? 'initial' : 'editable'} ${isSelected ? 'selected' : ''}"
                       onclick="sudokuGame.selectCell(${rowIdx}, ${colIdx})">
                    ${cell || ''}
                  </div>
                `;
              }).join('')}
            </div>
          `).join('')}
        </div>

        <div class="sudoku-numbers">
          ${Array.from({length: this.size}, (_, i) => i + 1).map(num => `
            <button class="number-btn" onclick="sudokuGame.placeNumber(${num})">${num}</button>
          `).join('')}
          <button class="number-btn erase" onclick="sudokuGame.placeNumber(0)">🗑️</button>
        </div>

        <div class="game-actions">
          <button class="btn-secondary" onclick="sudokuGame.showHint()">💡 Dica</button>
          <button class="btn-primary" onclick="sudokuGame.checkSolution()">✅ Verificar</button>
        </div>
      </div>
    `;

    this.addSudokuStyles();
  }

  selectCell(row, col) {
    if (this.initialCells.includes(`${row}-${col}`)) return;
    this.selectedCell = { row, col };
    this.render();
  }

  placeNumber(num) {
    if (!this.selectedCell) {
      alert('Selecione uma célula primeiro!');
      return;
    }

    const { row, col } = this.selectedCell;
    this.board[row][col] = num;

    // Verificar se está correto
    if (num !== 0 && num !== this.solution[row][col]) {
      this.mistakes++;
    }

    this.render();
  }

  showHint() {
    // Encontrar primeira célula vazia e mostrar resposta
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          this.board[row][col] = this.solution[row][col];
          this.render();
          return;
        }
      }
    }
    alert('Todas as células já estão preenchidas!');
  }

  checkSolution() {
    // Verificar se está completo
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          alert('Complete todo o tabuleiro primeiro!');
          return;
        }
      }
    }

    // Verificar se está correto
    let correct = true;
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] !== this.solution[row][col]) {
          correct = false;
          break;
        }
      }
    }

    if (correct) {
      this.gameWon();
    } else {
      alert('Ainda há erros! Continue tentando! 💪');
    }
  }

  gameWon() {
    // FP fixo por dificuldade: 3x3=Fácil(5), 4x4=Médio(10), 6x6=Difícil(15)
    const fpRewards = { 3: 5, 4: 10, 6: 15 };
    const finalFP = fpRewards[this.size] || 5;

    const container = document.getElementById(this.containerId);
    container.innerHTML = `
      <div class="game-result">
        <div class="result-emoji">🎉</div>
        <h2>Parabéns! Você completou o Sudoku!</h2>
        <p>Seu raciocínio lógico está excelente!</p>

        <div class="result-stats">
          <div class="result-stat">
            <div class="result-stat-value">${this.mistakes}</div>
            <div class="result-stat-label">Erros</div>
          </div>
          <div class="result-stat">
            <div class="result-stat-value">${this.getElapsedTime()}</div>
            <div class="result-stat-label">Tempo</div>
          </div>
          <div class="result-stat highlight">
            <div class="result-stat-value">+${finalFP} FP</div>
            <div class="result-stat-label">Ganhos</div>
          </div>
        </div>

        <div class="game-actions">
          <button class="btn-primary" onclick="sudokuGame.saveAndExit(${finalFP})">Finalizar ✅</button>
          <button class="btn-secondary" onclick="sudokuGame.showDifficultySelection()">Jogar Novamente 🔄</button>
        </div>
      </div>
    `;
  }

  getElapsedTime() {
    const seconds = Math.floor((Date.now() - this.startTime) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          gameKey: 'sudoku',
          score: this.size * 10,
          fpEarned: fpEarned
        })
      });

      backToGames();
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
      backToGames();
    }
  }

  addSudokuStyles() {
    if (document.getElementById('sudoku-styles')) return;

    const style = document.createElement('style');
    style.id = 'sudoku-styles';
    style.textContent = `
      .sudoku-board {
        display: inline-block;
        background: #2c3e50;
        padding: 4px;
        border-radius: 8px;
        margin: 20px auto;
      }

      .sudoku-row {
        display: flex;
      }

      .sudoku-cell {
        width: 60px;
        height: 60px;
        background: white;
        border: 1px solid #bdc3c7;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
      }

      .sudoku-board.size-3 .sudoku-cell {
        width: 80px;
        height: 80px;
        font-size: 32px;
      }

      .sudoku-board.size-6 .sudoku-cell {
        width: 50px;
        height: 50px;
        font-size: 20px;
      }

      .sudoku-cell.initial {
        background: #ecf0f1;
        color: #2c3e50;
        cursor: not-allowed;
      }

      .sudoku-cell.editable {
        color: #3498db;
      }

      .sudoku-cell.selected {
        background: #fff9c4;
        box-shadow: inset 0 0 0 3px #f39c12;
      }

      .sudoku-cell:hover:not(.initial) {
        background: #e3f2fd;
      }

      .sudoku-numbers {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin: 20px 0;
        flex-wrap: wrap;
      }

      .number-btn {
        width: 50px;
        height: 50px;
        font-size: 24px;
        font-weight: bold;
        background: white;
        border: 2px solid #3498db;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .number-btn:hover {
        background: #3498db;
        color: white;
        transform: scale(1.1);
      }

      .number-btn.erase {
        background: #e74c3c;
        color: white;
        border-color: #e74c3c;
      }

      @media (max-width: 600px) {
        .sudoku-cell {
          width: 45px;
          height: 45px;
          font-size: 18px;
        }

        .sudoku-board.size-3 .sudoku-cell {
          width: 60px;
          height: 60px;
          font-size: 24px;
        }

        .number-btn {
          width: 40px;
          height: 40px;
          font-size: 20px;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ================================================
// 2. TORRE DE HANÓI
// ================================================

class HanoiGame {
  constructor(containerId) {
    this.containerId = containerId;
    this.numDisks = 3;
    this.towers = [[], [], []];
    this.moves = 0;
    this.minMoves = 0;
    this.selectedTower = null;
    this.startTime = Date.now();
  }

  init() {
    this.showDifficultySelection();
  }

  showDifficultySelection() {
    const container = document.getElementById(this.containerId);
    container.innerHTML = `
      <div class="game-mode-selection">
        <h2>🗼 Torre de Hanói</h2>
        <p>Mova todos os discos para a torre da direita!</p>

        <div class="mode-cards">
          <div class="mode-card" onclick="hanoiGame.startGame(3)">
            <div class="mode-icon">😊</div>
            <h3>3 Discos</h3>
            <p>Mínimo de 7 movimentos</p>
            <div class="mode-reward">30 FP</div>
          </div>

          <div class="mode-card" onclick="hanoiGame.startGame(4)">
            <div class="mode-icon">🤔</div>
            <h3>4 Discos</h3>
            <p>Mínimo de 15 movimentos</p>
            <div class="mode-reward">40 FP</div>
          </div>

          <div class="mode-card" onclick="hanoiGame.startGame(5)">
            <div class="mode-icon">😎</div>
            <h3>5 Discos</h3>
            <p>Mínimo de 31 movimentos</p>
            <div class="mode-reward">50 FP</div>
          </div>

          <div class="mode-card" onclick="hanoiGame.startGame(6)">
            <div class="mode-icon">🔥</div>
            <h3>6 Discos</h3>
            <p>Mínimo de 63 movimentos</p>
            <div class="mode-reward">60 FP</div>
          </div>
        </div>

        <button class="btn-secondary" onclick="backToGames()" style="margin-top: 20px;">
          Voltar ←
        </button>
      </div>
    `;
  }

  startGame(numDisks) {
    this.numDisks = numDisks;
    this.moves = 0;
    this.minMoves = Math.pow(2, numDisks) - 1;
    this.selectedTower = null;
    this.startTime = Date.now();

    // Inicializar torres
    this.towers = [[], [], []];
    for (let i = numDisks; i >= 1; i--) {
      this.towers[0].push(i);
    }

    this.render();
  }

  render() {
    const container = document.getElementById(this.containerId);

    container.innerHTML = `
      <div class="hanoi-game">
        <div class="game-header">
          <button class="btn-secondary" onclick="hanoiGame.showDifficultySelection()">← Voltar</button>
          <div class="game-stats">
            <span>🎯 Movimentos: ${this.moves} / ${this.minMoves}</span>
            <span>⏱️ ${this.getElapsedTime()}</span>
          </div>
        </div>

        <div class="hanoi-info">
          <p><strong>Regras:</strong></p>
          <p>✅ Mova todos os discos para a torre da direita</p>
          <p>✅ Só pode mover um disco por vez</p>
          <p>✅ Nunca coloque um disco maior sobre um menor</p>
        </div>

        <div class="hanoi-board">
          ${this.towers.map((tower, idx) => `
            <div class="hanoi-tower ${this.selectedTower === idx ? 'selected' : ''}"
                 onclick="hanoiGame.selectTower(${idx})">
              <div class="tower-pole"></div>
              <div class="tower-disks">
                ${this.renderTower(tower)}
              </div>
              <div class="tower-base">Torre ${idx + 1}</div>
            </div>
          `).join('')}
        </div>

        <div class="game-actions">
          <button class="btn-secondary" onclick="hanoiGame.resetGame()">🔄 Reiniciar</button>
          <button class="btn-secondary" onclick="hanoiGame.showSolution()">💡 Solução</button>
        </div>
      </div>
    `;

    this.addHanoiStyles();
  }

  renderTower(tower) {
    if (tower.length === 0) {
      return '<div class="disk-placeholder"></div>';
    }

    return tower.map(diskSize => `
      <div class="hanoi-disk size-${diskSize}" data-size="${diskSize}">
        <div class="disk-label">${diskSize}</div>
      </div>
    `).reverse().join('');
  }

  selectTower(towerIdx) {
    if (this.selectedTower === null) {
      // Selecionar torre origem
      if (this.towers[towerIdx].length > 0) {
        this.selectedTower = towerIdx;
      }
    } else {
      // Mover disco
      if (this.selectedTower === towerIdx) {
        this.selectedTower = null; // Desselecionar
      } else {
        this.moveDisk(this.selectedTower, towerIdx);
        this.selectedTower = null;
      }
    }
    this.render();
  }

  moveDisk(fromTower, toTower) {
    const from = this.towers[fromTower];
    const to = this.towers[toTower];

    if (from.length === 0) return;

    const disk = from[from.length - 1];

    // Verificar se movimento é válido
    if (to.length > 0 && to[to.length - 1] < disk) {
      alert('❌ Não pode colocar disco maior sobre disco menor!');
      return;
    }

    // Fazer movimento
    to.push(from.pop());
    this.moves++;

    // Verificar vitória
    if (this.towers[2].length === this.numDisks) {
      this.gameWon();
    }
  }

  resetGame() {
    this.startGame(this.numDisks);
  }

  showSolution() {
    alert(`💡 Dica da Torre de Hanói:\n\n1. Mova os discos menores para a torre do meio\n2. Mova o maior disco para a torre da direita\n3. Mova os discos menores de volta para cima do maior\n\nRepita esse padrão! O número mínimo de movimentos é ${this.minMoves}.`);
  }

  gameWon() {
    // FP fixo por dificuldade: 3 discos=Fácil(5), 4=Médio(10), 5+=Difícil(15)
    const fpRewards = { 3: 5, 4: 10 };
    const fpEarned = this.numDisks >= 5 ? 15 : (fpRewards[this.numDisks] || 5);

    setTimeout(() => {
      const container = document.getElementById(this.containerId);
      container.innerHTML = `
        <div class="game-result">
          <div class="result-emoji">🎉</div>
          <h2>Torre Completa!</h2>
          <p>${this.moves <= this.minMoves ? 'Perfeito! Você fez no mínimo de movimentos!' : 'Você conseguiu! Tente fazer em menos movimentos na próxima!'}</p>

          <div class="result-stats">
            <div class="result-stat">
              <div class="result-stat-value">${this.moves}</div>
              <div class="result-stat-label">Movimentos</div>
            </div>
            <div class="result-stat">
              <div class="result-stat-value">${this.minMoves}</div>
              <div class="result-stat-label">Mínimo</div>
            </div>
            <div class="result-stat highlight">
              <div class="result-stat-value">+${fpEarned} FP</div>
              <div class="result-stat-label">Ganhos</div>
            </div>
          </div>

          <div class="game-actions">
            <button class="btn-primary" onclick="hanoiGame.saveAndExit(${fpEarned})">Finalizar ✅</button>
            <button class="btn-secondary" onclick="hanoiGame.showDifficultySelection()">Jogar Novamente 🔄</button>
          </div>
        </div>
      `;
    }, 500);
  }

  getElapsedTime() {
    const seconds = Math.floor((Date.now() - this.startTime) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          gameKey: 'hanoi',
          score: this.numDisks * 100,
          fpEarned: fpEarned
        })
      });

      backToGames();
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
      backToGames();
    }
  }

  addHanoiStyles() {
    if (document.getElementById('hanoi-styles')) return;

    const style = document.createElement('style');
    style.id = 'hanoi-styles';
    style.textContent = `
      .hanoi-board {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        min-height: 300px;
        padding: 40px 20px;
        gap: 20px;
      }

      .hanoi-tower {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        position: relative;
        min-height: 250px;
        justify-content: flex-end;
      }

      .hanoi-tower.selected {
        background: rgba(52, 152, 219, 0.1);
        border-radius: 12px;
      }

      .tower-pole {
        position: absolute;
        width: 8px;
        height: 200px;
        background: linear-gradient(to bottom, #8b4513, #654321);
        bottom: 40px;
        border-radius: 4px;
      }

      .tower-disks {
        position: relative;
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        gap: 2px;
        min-height: 200px;
        justify-content: flex-start;
        z-index: 1;
      }

      .hanoi-disk {
        height: 25px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        transition: all 0.3s;
        position: relative;
      }

      .hanoi-disk:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.3);
      }

      .hanoi-disk.size-1 { width: 60px; background: #e74c3c; }
      .hanoi-disk.size-2 { width: 80px; background: #f39c12; }
      .hanoi-disk.size-3 { width: 100px; background: #f1c40f; }
      .hanoi-disk.size-4 { width: 120px; background: #2ecc71; }
      .hanoi-disk.size-5 { width: 140px; background: #3498db; }
      .hanoi-disk.size-6 { width: 160px; background: #9b59b6; }

      .disk-placeholder {
        height: 25px;
        width: 60px;
      }

      .tower-base {
        width: 100%;
        max-width: 180px;
        height: 40px;
        background: #34495e;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        margin-top: 10px;
      }

      .hanoi-info {
        background: #e3f2fd;
        padding: 20px;
        border-radius: 12px;
        margin: 20px;
        text-align: center;
      }

      .hanoi-info p {
        margin: 5px 0;
        color: #2c3e50;
      }

      @media (max-width: 768px) {
        .hanoi-board {
          padding: 20px 10px;
        }

        .hanoi-disk.size-1 { width: 40px; }
        .hanoi-disk.size-2 { width: 55px; }
        .hanoi-disk.size-3 { width: 70px; }
        .hanoi-disk.size-4 { width: 85px; }
        .hanoi-disk.size-5 { width: 100px; }
        .hanoi-disk.size-6 { width: 115px; }

        .tower-pole {
          height: 150px;
        }

        .tower-disks {
          min-height: 150px;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ================================================
// 3. CAMPO MINADO EDUCATIVO
// ================================================

class MinesweeperGame {
  constructor(containerId) {
    this.containerId = containerId;
    this.rows = 8;
    this.cols = 8;
    this.mines = 10;
    this.board = [];
    this.revealed = [];
    this.flags = [];
    this.gameOver = false;
    this.startTime = Date.now();
  }

  init() {
    this.showDifficultySelection();
  }

  showDifficultySelection() {
    const container = document.getElementById(this.containerId);
    container.innerHTML = `
      <div class="game-mode-selection">
        <h2>💣 Campo Minado Educativo</h2>
        <p>Encontre os tesouros sem pisar nas armadilhas!</p>

        <div class="mode-cards">
          <div class="mode-card" onclick="minesweeperGame.startGame(6, 6, 5)">
            <div class="mode-icon">😊</div>
            <h3>Fácil</h3>
            <p>6×6 com 5 armadilhas</p>
            <div class="mode-reward">30 FP</div>
          </div>

          <div class="mode-card" onclick="minesweeperGame.startGame(8, 8, 10)">
            <div class="mode-icon">🤔</div>
            <h3>Médio</h3>
            <p>8×8 com 10 armadilhas</p>
            <div class="mode-reward">50 FP</div>
          </div>

          <div class="mode-card" onclick="minesweeperGame.startGame(10, 10, 15)">
            <div class="mode-icon">😎</div>
            <h3>Difícil</h3>
            <p>10×10 com 15 armadilhas</p>
            <div class="mode-reward">80 FP</div>
          </div>
        </div>

        <button class="btn-secondary" onclick="backToGames()" style="margin-top: 20px;">
          Voltar ←
        </button>
      </div>
    `;
  }

  startGame(rows, cols, mines) {
    this.rows = rows;
    this.cols = cols;
    this.mines = mines;
    this.gameOver = false;
    this.startTime = Date.now();
    this.generateBoard();
    this.render();
  }

  generateBoard() {
    // Inicializar tabuleiro
    this.board = Array(this.rows).fill(0).map(() => Array(this.cols).fill(0));
    this.revealed = Array(this.rows).fill(0).map(() => Array(this.cols).fill(false));
    this.flags = Array(this.rows).fill(0).map(() => Array(this.cols).fill(false));

    // Colocar minas
    let minesPlaced = 0;
    while (minesPlaced < this.mines) {
      const row = Math.floor(Math.random() * this.rows);
      const col = Math.floor(Math.random() * this.cols);

      if (this.board[row][col] !== -1) {
        this.board[row][col] = -1; // -1 = mina
        minesPlaced++;
      }
    }

    // Calcular números
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.board[row][col] !== -1) {
          this.board[row][col] = this.countAdjacentMines(row, col);
        }
      }
    }
  }

  countAdjacentMines(row, col) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (this.isValid(newRow, newCol) && this.board[newRow][newCol] === -1) {
          count++;
        }
      }
    }
    return count;
  }

  isValid(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  render() {
    const container = document.getElementById(this.containerId);
    const flagsUsed = this.flags.flat().filter(f => f).length;

    container.innerHTML = `
      <div class="minesweeper-game">
        <div class="game-header">
          <button class="btn-secondary" onclick="minesweeperGame.showDifficultySelection()">← Voltar</button>
          <div class="game-stats">
            <span>🚩 Bandeiras: ${flagsUsed} / ${this.mines}</span>
            <span>⏱️ ${this.getElapsedTime()}</span>
          </div>
        </div>

        <div class="mine-board">
          ${this.board.map((row, rowIdx) => `
            <div class="mine-row">
              ${row.map((cell, colIdx) => {
                const isRevealed = this.revealed[rowIdx][colIdx];
                const isFlagged = this.flags[rowIdx][colIdx];
                const isMine = cell === -1;

                return `
                  <div class="mine-cell ${isRevealed ? 'revealed' : ''} ${isFlagged ? 'flagged' : ''}"
                       onclick="minesweeperGame.revealCell(${rowIdx}, ${colIdx})"
                       oncontextmenu="minesweeperGame.toggleFlag(${rowIdx}, ${colIdx}); return false;">
                    ${isRevealed ? (isMine ? '💣' : (cell > 0 ? cell : '')) : (isFlagged ? '🚩' : '')}
                  </div>
                `;
              }).join('')}
            </div>
          `).join('')}
        </div>

        <div class="mine-instructions">
          <p><strong>Como jogar:</strong></p>
          <p>🖱️ Clique para revelar | 🖱️ Botão direito para bandeira</p>
          <p>Os números mostram quantas armadilhas estão ao redor!</p>
        </div>
      </div>
    `;

    this.addMinesweeperStyles();
  }

  revealCell(row, col) {
    if (this.gameOver || this.revealed[row][col] || this.flags[row][col]) return;

    this.revealed[row][col] = true;

    if (this.board[row][col] === -1) {
      // Pisou na mina
      this.gameLost();
      return;
    }

    // Se célula vazia, revelar adjacentes
    if (this.board[row][col] === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const newRow = row + dr;
          const newCol = col + dc;
          if (this.isValid(newRow, newCol) && !this.revealed[newRow][newCol]) {
            this.revealCell(newRow, newCol);
          }
        }
      }
    }

    this.render();
    this.checkWin();
  }

  toggleFlag(row, col) {
    if (this.gameOver || this.revealed[row][col]) return;
    this.flags[row][col] = !this.flags[row][col];
    this.render();
  }

  checkWin() {
    let unrevealedCount = 0;
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (!this.revealed[row][col] && this.board[row][col] !== -1) {
          unrevealedCount++;
        }
      }
    }

    if (unrevealedCount === 0) {
      this.gameWon();
    }
  }

  gameLost() {
    this.gameOver = true;

    // Revelar todas as minas
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.board[row][col] === -1) {
          this.revealed[row][col] = true;
        }
      }
    }

    this.render();

    setTimeout(() => {
      const container = document.getElementById(this.containerId);
      container.innerHTML = `
        <div class="game-result">
          <div class="result-emoji">💥</div>
          <h2>Ops! Você pisou numa armadilha!</h2>
          <p>Não desista! Tente novamente com mais cuidado!</p>

          <div class="result-stats">
            <div class="result-stat highlight">
              <div class="result-stat-value">+10 FP</div>
              <div class="result-stat-label">Por tentar</div>
            </div>
          </div>

          <div class="game-actions">
            <button class="btn-primary" onclick="minesweeperGame.saveAndExit(10)">Finalizar ✅</button>
            <button class="btn-secondary" onclick="minesweeperGame.startGame(${this.rows}, ${this.cols}, ${this.mines})">Tentar Novamente 🔄</button>
          </div>
        </div>
      `;
    }, 1000);
  }

  gameWon() {
    this.gameOver = true;
    // FP fixo por dificuldade: 5 minas=Fácil(5), 10=Médio(10), 15=Difícil(15)
    const fpRewards = { 5: 5, 10: 10, 15: 15 };
    const fpEarned = fpRewards[this.mines] || 5;

    const container = document.getElementById(this.containerId);
    container.innerHTML = `
      <div class="game-result">
        <div class="result-emoji">🏆</div>
        <h2>Parabéns! Você venceu!</h2>
        <p>Você encontrou todos os tesouros sem pisar nas armadilhas!</p>

        <div class="result-stats">
          <div class="result-stat">
            <div class="result-stat-value">${this.getElapsedTime()}</div>
            <div class="result-stat-label">Tempo</div>
          </div>
          <div class="result-stat highlight">
            <div class="result-stat-value">+${fpEarned} FP</div>
            <div class="result-stat-label">Ganhos</div>
          </div>
        </div>

        <div class="game-actions">
          <button class="btn-primary" onclick="minesweeperGame.saveAndExit(${fpEarned})">Finalizar ✅</button>
          <button class="btn-secondary" onclick="minesweeperGame.showDifficultySelection()">Jogar Novamente 🔄</button>
        </div>
      </div>
    `;
  }

  getElapsedTime() {
    const seconds = Math.floor((Date.now() - this.startTime) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          gameKey: 'minesweeper',
          score: this.mines * 10,
          fpEarned: fpEarned
        })
      });

      backToGames();
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
      backToGames();
    }
  }

  addMinesweeperStyles() {
    if (document.getElementById('minesweeper-styles')) return;

    const style = document.createElement('style');
    style.id = 'minesweeper-styles';
    style.textContent = `
      .mine-board {
        display: inline-block;
        background: #2c3e50;
        padding: 4px;
        border-radius: 8px;
        margin: 20px auto;
      }

      .mine-row {
        display: flex;
      }

      .mine-cell {
        width: 40px;
        height: 40px;
        background: #95a5a6;
        border: 2px outset #bdc3c7;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        user-select: none;
        transition: all 0.1s;
      }

      .mine-cell:hover:not(.revealed) {
        background: #b4c4d4;
        transform: scale(1.05);
      }

      .mine-cell.revealed {
        background: #ecf0f1;
        border: 1px solid #bdc3c7;
        cursor: default;
        color: #2c3e50;
      }

      .mine-cell.flagged {
        background: #f39c12;
      }

      .mine-instructions {
        background: #e8f5e9;
        padding: 15px;
        border-radius: 12px;
        margin: 20px;
        text-align: center;
      }

      .mine-instructions p {
        margin: 5px 0;
        color: #2c3e50;
      }

      @media (max-width: 600px) {
        .mine-cell {
          width: 32px;
          height: 32px;
          font-size: 14px;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ================================================
// 4. JOGO 2048
// ================================================

class Game2048 {
  constructor(containerId) {
    this.containerId = containerId;
    this.size = 4;
    this.board = [];
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('2048_best') || '0');
    this.gameOver = false;
    this.startTime = Date.now();
  }

  init() {
    this.startGame();
  }

  startGame() {
    this.board = Array(this.size).fill(0).map(() => Array(this.size).fill(0));
    this.score = 0;
    this.gameOver = false;
    this.startTime = Date.now();

    // Adicionar 2 blocos iniciais
    this.addRandomTile();
    this.addRandomTile();

    this.render();
    this.setupKeyboard();
  }

  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (this.gameOver) return;

      const key = e.key;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        e.preventDefault();
        this.move(key);
      }
    });
  }

  addRandomTile() {
    const emptyCells = [];
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  move(direction) {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    switch (direction) {
      case 'ArrowUp': this.moveUp(); break;
      case 'ArrowDown': this.moveDown(); break;
      case 'ArrowLeft': this.moveLeft(); break;
      case 'ArrowRight': this.moveRight(); break;
    }

    // Se o tabuleiro mudou, adicionar novo bloco
    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    this.render();
    this.checkGameOver();
  }

  moveLeft() {
    for (let row = 0; row < this.size; row++) {
      const newRow = this.mergeLine(this.board[row]);
      this.board[row] = newRow;
    }
  }

  moveRight() {
    for (let row = 0; row < this.size; row++) {
      const reversed = this.board[row].slice().reverse();
      const merged = this.mergeLine(reversed);
      this.board[row] = merged.reverse();
    }
  }

  moveUp() {
    for (let col = 0; col < this.size; col++) {
      const column = this.board.map(row => row[col]);
      const merged = this.mergeLine(column);
      for (let row = 0; row < this.size; row++) {
        this.board[row][col] = merged[row];
      }
    }
  }

  moveDown() {
    for (let col = 0; col < this.size; col++) {
      const column = this.board.map(row => row[col]).reverse();
      const merged = this.mergeLine(column);
      for (let row = 0; row < this.size; row++) {
        this.board[row][col] = merged[this.size - 1 - row];
      }
    }
  }

  mergeLine(line) {
    // Remover zeros
    let newLine = line.filter(num => num !== 0);

    // Mesclar números iguais
    for (let i = 0; i < newLine.length - 1; i++) {
      if (newLine[i] === newLine[i + 1]) {
        newLine[i] *= 2;
        this.score += newLine[i];
        newLine.splice(i + 1, 1);
      }
    }

    // Preencher com zeros
    while (newLine.length < this.size) {
      newLine.push(0);
    }

    return newLine;
  }

  checkGameOver() {
    // Verificar se há células vazias
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) return;
      }
    }

    // Verificar se há movimentos possíveis
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const current = this.board[row][col];
        if (col < this.size - 1 && current === this.board[row][col + 1]) return;
        if (row < this.size - 1 && current === this.board[row + 1][col]) return;
      }
    }

    this.gameOver = true;
    this.showGameOver();
  }

  showGameOver() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('2048_best', this.bestScore.toString());
    }

    const maxTile = Math.max(...this.board.flat());
    // FP fixo por desempenho: <256=Fácil(5), 256-1023=Médio(10), >=1024=Difícil(15)
    const fpEarned = maxTile >= 1024 ? 15 : (maxTile >= 256 ? 10 : 5);

    setTimeout(() => {
      const container = document.getElementById(this.containerId);
      container.innerHTML = `
        <div class="game-result">
          <div class="result-emoji">${maxTile >= 2048 ? '🏆' : '🎮'}</div>
          <h2>${maxTile >= 2048 ? 'Você alcançou 2048!' : 'Fim de Jogo!'}</h2>
          <p>${maxTile >= 2048 ? 'Parabéns! Você é um mestre da matemática!' : 'Continue praticando para chegar no 2048!'}</p>

          <div class="result-stats">
            <div class="result-stat">
              <div class="result-stat-value">${maxTile}</div>
              <div class="result-stat-label">Maior Bloco</div>
            </div>
            <div class="result-stat">
              <div class="result-stat-value">${this.score}</div>
              <div class="result-stat-label">Pontuação</div>
            </div>
            <div class="result-stat highlight">
              <div class="result-stat-value">+${fpEarned} FP</div>
              <div class="result-stat-label">Ganhos</div>
            </div>
          </div>

          <div class="game-actions">
            <button class="btn-primary" onclick="game2048.saveAndExit(${fpEarned})">Finalizar ✅</button>
            <button class="btn-secondary" onclick="game2048.startGame()">Jogar Novamente 🔄</button>
          </div>
        </div>
      `;
    }, 500);
  }

  render() {
    const container = document.getElementById(this.containerId);

    container.innerHTML = `
      <div class="game-2048">
        <div class="game-header">
          <button class="btn-secondary" onclick="backToGames()">← Voltar</button>
          <div class="game-scores">
            <div class="score-box">
              <div class="score-label">Pontos</div>
              <div class="score-value">${this.score}</div>
            </div>
            <div class="score-box">
              <div class="score-label">Recorde</div>
              <div class="score-value">${this.bestScore}</div>
            </div>
          </div>
        </div>

        <div class="board-2048">
          ${this.board.map(row => `
            <div class="board-row-2048">
              ${row.map(cell => `
                <div class="tile-2048 tile-${cell}">
                  ${cell || ''}
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>

        <div class="game-instructions-2048">
          <p><strong>Use as setas ⬆️⬇️⬅️➡️ para mover!</strong></p>
          <p>Combine números iguais para formar números maiores!</p>
          <p>Meta: Alcançar o bloco 2048! 🎯</p>
        </div>

        <div class="game-actions">
          <button class="btn-secondary" onclick="game2048.startGame()">🔄 Novo Jogo</button>
        </div>
      </div>
    `;

    this.add2048Styles();
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
          gameKey: '2048',
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

  add2048Styles() {
    if (document.getElementById('2048-styles')) return;

    const style = document.createElement('style');
    style.id = '2048-styles';
    style.textContent = `
      .game-scores {
        display: flex;
        gap: 15px;
      }

      .score-box {
        background: #bbada0;
        padding: 10px 20px;
        border-radius: 8px;
        color: white;
        text-align: center;
        min-width: 80px;
      }

      .score-label {
        font-size: 12px;
        text-transform: uppercase;
      }

      .score-value {
        font-size: 24px;
        font-weight: bold;
      }

      .board-2048 {
        background: #bbada0;
        padding: 10px;
        border-radius: 12px;
        display: inline-block;
        margin: 20px auto;
      }

      .board-row-2048 {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
      }

      .board-row-2048:last-child {
        margin-bottom: 0;
      }

      .tile-2048 {
        width: 80px;
        height: 80px;
        background: #cdc1b4;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        font-weight: bold;
        color: #776e65;
        transition: all 0.15s;
      }

      .tile-2 { background: #eee4da; color: #776e65; }
      .tile-4 { background: #ede0c8; color: #776e65; }
      .tile-8 { background: #f2b179; color: #f9f6f2; }
      .tile-16 { background: #f59563; color: #f9f6f2; }
      .tile-32 { background: #f67c5f; color: #f9f6f2; }
      .tile-64 { background: #f65e3b; color: #f9f6f2; }
      .tile-128 { background: #edcf72; color: #f9f6f2; font-size: 28px; }
      .tile-256 { background: #edcc61; color: #f9f6f2; font-size: 28px; }
      .tile-512 { background: #edc850; color: #f9f6f2; font-size: 28px; }
      .tile-1024 { background: #edc53f; color: #f9f6f2; font-size: 24px; }
      .tile-2048 { background: #edc22e; color: #f9f6f2; font-size: 24px; }

      .game-instructions-2048 {
        background: #fff3cd;
        padding: 15px;
        border-radius: 12px;
        margin: 20px;
        text-align: center;
      }

      .game-instructions-2048 p {
        margin: 5px 0;
        color: #2c3e50;
      }

      @media (max-width: 600px) {
        .tile-2048 {
          width: 60px;
          height: 60px;
          font-size: 24px;
        }

        .tile-128, .tile-256, .tile-512 {
          font-size: 20px;
        }

        .tile-1024, .tile-2048 {
          font-size: 18px;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ================================================
// 5. QUEBRA-CABEÇA DESLIZANTE (15-PUZZLE)
// ================================================

class SlidingPuzzleGame {
  constructor(containerId) {
    this.containerId = containerId;
    this.size = 3; // 3x3 (8-puzzle), 4x4 (15-puzzle), 5x5 (24-puzzle)
    this.board = [];
    this.emptyPos = { row: 0, col: 0 };
    this.moves = 0;
    this.startTime = Date.now();
  }

  init() {
    this.showDifficultySelection();
  }

  showDifficultySelection() {
    const container = document.getElementById(this.containerId);
    container.innerHTML = `
      <div class="game-mode-selection">
        <h2>🧩 Quebra-Cabeça Deslizante</h2>
        <p>Organize os números em ordem!</p>

        <div class="mode-cards">
          <div class="mode-card" onclick="slidingPuzzleGame.startGame(3)">
            <div class="mode-icon">😊</div>
            <h3>Fácil</h3>
            <p>3×3 (8 peças)</p>
            <div class="mode-reward">25 FP</div>
          </div>

          <div class="mode-card" onclick="slidingPuzzleGame.startGame(4)">
            <div class="mode-icon">🤔</div>
            <h3>Médio</h3>
            <p>4×4 (15 peças)</p>
            <div class="mode-reward">45 FP</div>
          </div>

          <div class="mode-card" onclick="slidingPuzzleGame.startGame(5)">
            <div class="mode-icon">😎</div>
            <h3>Difícil</h3>
            <p>5×5 (24 peças)</p>
            <div class="mode-reward">70 FP</div>
          </div>
        </div>

        <button class="btn-secondary" onclick="backToGames()" style="margin-top: 20px;">
          Voltar ←
        </button>
      </div>
    `;
  }

  startGame(size) {
    this.size = size;
    this.moves = 0;
    this.startTime = Date.now();
    this.generateBoard();
    this.render();
  }

  generateBoard() {
    // Criar tabuleiro resolvido
    const numbers = [];
    for (let i = 1; i < this.size * this.size; i++) {
      numbers.push(i);
    }
    numbers.push(0); // 0 representa espaço vazio

    // Embaralhar
    this.board = [];
    let idx = 0;
    for (let row = 0; row < this.size; row++) {
      this.board[row] = [];
      for (let col = 0; col < this.size; col++) {
        this.board[row][col] = numbers[idx++];
        if (numbers[idx - 1] === 0) {
          this.emptyPos = { row, col };
        }
      }
    }

    // Embaralhar fazendo movimentos aleatórios (garante solução)
    for (let i = 0; i < 100; i++) {
      const validMoves = this.getValidMoves();
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      this.swap(this.emptyPos.row, this.emptyPos.col, randomMove.row, randomMove.col);
    }

    this.moves = 0; // Resetar contagem após embaralhar
  }

  getValidMoves() {
    const moves = [];
    const { row, col } = this.emptyPos;

    if (row > 0) moves.push({ row: row - 1, col });
    if (row < this.size - 1) moves.push({ row: row + 1, col });
    if (col > 0) moves.push({ row, col: col - 1 });
    if (col < this.size - 1) moves.push({ row, col: col + 1 });

    return moves;
  }

  swap(row1, col1, row2, col2) {
    const temp = this.board[row1][col1];
    this.board[row1][col1] = this.board[row2][col2];
    this.board[row2][col2] = temp;

    if (this.board[row2][col2] === 0) {
      this.emptyPos = { row: row2, col: col2 };
    } else {
      this.emptyPos = { row: row1, col: col1 };
    }
  }

  clickTile(row, col) {
    // Verificar se está adjacente ao espaço vazio
    const { row: emptyRow, col: emptyCol } = this.emptyPos;
    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      this.swap(row, col, emptyRow, emptyCol);
      this.moves++;
      this.render();
      this.checkWin();
    }
  }

  checkWin() {
    let expected = 1;
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (row === this.size - 1 && col === this.size - 1) {
          if (this.board[row][col] !== 0) return;
        } else {
          if (this.board[row][col] !== expected++) return;
        }
      }
    }

    this.gameWon();
  }

  gameWon() {
    // FP fixo por dificuldade: 3x3=Fácil(5), 4x4=Médio(10), 5x5=Difícil(15)
    const fpRewards = { 3: 5, 4: 10, 5: 15 };
    const fpEarned = fpRewards[this.size] || 5;

    const container = document.getElementById(this.containerId);
    container.innerHTML = `
      <div class="game-result">
        <div class="result-emoji">🎉</div>
        <h2>Parabéns! Você completou o quebra-cabeça!</h2>
        <p>Seu raciocínio espacial está excelente!</p>

        <div class="result-stats">
          <div class="result-stat">
            <div class="result-stat-value">${this.moves}</div>
            <div class="result-stat-label">Movimentos</div>
          </div>
          <div class="result-stat">
            <div class="result-stat-value">${this.getElapsedTime()}</div>
            <div class="result-stat-label">Tempo</div>
          </div>
          <div class="result-stat highlight">
            <div class="result-stat-value">+${fpEarned} FP</div>
            <div class="result-stat-label">Ganhos</div>
          </div>
        </div>

        <div class="game-actions">
          <button class="btn-primary" onclick="slidingPuzzleGame.saveAndExit(${fpEarned})">Finalizar ✅</button>
          <button class="btn-secondary" onclick="slidingPuzzleGame.showDifficultySelection()">Jogar Novamente 🔄</button>
        </div>
      </div>
    `;
  }

  render() {
    const container = document.getElementById(this.containerId);

    container.innerHTML = `
      <div class="sliding-puzzle-game">
        <div class="game-header">
          <button class="btn-secondary" onclick="slidingPuzzleGame.showDifficultySelection()">← Voltar</button>
          <div class="game-stats">
            <span>🎯 Movimentos: ${this.moves}</span>
            <span>⏱️ ${this.getElapsedTime()}</span>
          </div>
        </div>

        <div class="puzzle-board size-${this.size}">
          ${this.board.map((row, rowIdx) => `
            <div class="puzzle-row">
              ${row.map((cell, colIdx) => `
                <div class="puzzle-tile ${cell === 0 ? 'empty' : ''}"
                     onclick="slidingPuzzleGame.clickTile(${rowIdx}, ${colIdx})">
                  ${cell || ''}
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>

        <div class="puzzle-instructions">
          <p><strong>Dica:</strong> Clique nos números adjacentes ao espaço vazio para movê-los!</p>
        </div>
      </div>
    `;

    this.addSlidingPuzzleStyles();
  }

  getElapsedTime() {
    const seconds = Math.floor((Date.now() - this.startTime) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          gameKey: 'sliding_puzzle',
          score: this.size * 100,
          fpEarned: fpEarned
        })
      });

      backToGames();
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
      backToGames();
    }
  }

  addSlidingPuzzleStyles() {
    if (document.getElementById('sliding-puzzle-styles')) return;

    const style = document.createElement('style');
    style.id = 'sliding-puzzle-styles';
    style.textContent = `
      .puzzle-board {
        display: inline-block;
        background: #2c3e50;
        padding: 10px;
        border-radius: 12px;
        margin: 20px auto;
      }

      .puzzle-row {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
      }

      .puzzle-row:last-child {
        margin-bottom: 0;
      }

      .puzzle-tile {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        font-weight: bold;
        color: white;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      }

      .puzzle-board.size-5 .puzzle-tile {
        width: 60px;
        height: 60px;
        font-size: 24px;
      }

      .puzzle-tile:hover:not(.empty) {
        transform: scale(1.05);
        box-shadow: 0 6px 12px rgba(0,0,0,0.3);
      }

      .puzzle-tile.empty {
        background: transparent;
        cursor: default;
        box-shadow: none;
      }

      .puzzle-instructions {
        background: #e8eaf6;
        padding: 15px;
        border-radius: 12px;
        margin: 20px;
        text-align: center;
      }

      .puzzle-instructions p {
        margin: 5px 0;
        color: #2c3e50;
      }

      @media (max-width: 600px) {
        .puzzle-tile {
          width: 60px;
          height: 60px;
          font-size: 24px;
        }

        .puzzle-board.size-5 .puzzle-tile {
          width: 48px;
          height: 48px;
          font-size: 18px;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Instâncias globais
let sudokuGame;
let hanoiGame;
let minesweeperGame;
let game2048;
let slidingPuzzleGame;

function backToGames() {
  window.location.href = '/minigames.html';
}
