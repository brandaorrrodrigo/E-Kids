// SISTEMA DE QUIZ EDUCATIVO - E-KIDS PRO
// Sistema gentil e educativo de perguntas e respostas

class QuizSystem {
  constructor(moduleKey, childId) {
    this.moduleKey = moduleKey;
    this.childId = childId;
    this.currentLevel = 1;
    this.currentQuestionIndex = 0;
    this.attempts = 0;
    this.correctAnswers = 0;
    this.questions = [];
  }

  /**
   * Inicializar quiz com perguntas
   */
  init(questions) {
    this.questions = questions;
    this.currentLevel = 1;
    this.currentQuestionIndex = 0;
    this.attempts = 0;
    this.correctAnswers = 0;
  }

  /**
   * Renderizar interface do quiz
   */
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const currentQuestion = this.questions[this.currentQuestionIndex];
    const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;

    container.innerHTML = `
      <div class="quiz-container">
        <!-- Cabeçalho com progresso -->
        <div class="quiz-header">
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width: ${progress}%"></div>
          </div>
          <p class="quiz-progress-text">
            Pergunta ${this.currentQuestionIndex + 1} de ${this.questions.length}
            <span class="quiz-level-badge">Nível ${currentQuestion.level}</span>
          </p>
        </div>

        <!-- Área da pergunta -->
        <div class="quiz-question-area">
          ${currentQuestion.image ? `<div class="quiz-image">${currentQuestion.image}</div>` : ''}
          <h3 class="quiz-question">${currentQuestion.question}</h3>
          ${currentQuestion.context ? `<p class="quiz-context">${currentQuestion.context}</p>` : ''}
        </div>

        <!-- Opções de resposta -->
        <div class="quiz-options" id="quiz-options-${this.currentQuestionIndex}">
          ${currentQuestion.options.map((option, index) => `
            <button
              class="quiz-option-btn"
              onclick="quizSystem.checkAnswer(${index})"
              data-option-index="${index}"
            >
              <span class="option-letter">${String.fromCharCode(65 + index)}</span>
              <span class="option-text">${option}</span>
            </button>
          `).join('')}
        </div>

        <!-- Área de feedback -->
        <div class="quiz-feedback" id="quiz-feedback" style="display: none;"></div>

        <!-- Estatísticas -->
        <div class="quiz-stats">
          <div class="stat-item">
            <span class="stat-icon">✅</span>
            <span class="stat-value" id="quiz-correct-count">${this.correctAnswers}</span>
            <span class="stat-label">Acertos</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">⭐</span>
            <span class="stat-value" id="quiz-fp-earned">0</span>
            <span class="stat-label">FP</span>
          </div>
        </div>
      </div>
    `;

    this.addQuizStyles();
  }

  /**
   * Verificar resposta
   */
  checkAnswer(selectedIndex) {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    const feedbackEl = document.getElementById('quiz-feedback');
    const optionsContainer = document.getElementById(`quiz-options-${this.currentQuestionIndex}`);
    const buttons = optionsContainer.querySelectorAll('.quiz-option-btn');

    // Desabilitar todos os botões
    buttons.forEach(btn => btn.disabled = true);

    this.attempts++;

    if (selectedIndex === currentQuestion.correctIndex) {
      // RESPOSTA CORRETA
      this.handleCorrectAnswer(selectedIndex, buttons, feedbackEl, currentQuestion);
    } else {
      // RESPOSTA INCORRETA
      this.handleIncorrectAnswer(selectedIndex, buttons, feedbackEl, currentQuestion);
    }
  }

  /**
   * Lidar com resposta correta
   */
  handleCorrectAnswer(selectedIndex, buttons, feedbackEl, currentQuestion) {
    this.correctAnswers++;

    // Destacar resposta correta
    buttons[selectedIndex].classList.add('correct');

    // FP fixo por nível da pergunta: Nível 1=Fácil(1), 2=Médio(2), 3+=Difícil(3)
    const fpByLevel = { 1: 1, 2: 2 };
    const fpEarned = currentQuestion.level >= 3 ? 3 : (fpByLevel[currentQuestion.level] || 1);

    // Atualizar contador de FP
    const fpCounter = document.getElementById('quiz-fp-earned');
    const currentFP = parseInt(fpCounter.textContent) || 0;
    fpCounter.textContent = currentFP + fpEarned;

    // Atualizar contador de acertos
    document.getElementById('quiz-correct-count').textContent = this.correctAnswers;

    // Mensagens de sucesso variadas
    const successMessages = [
      '🎉 Excelente! Você acertou!',
      '⭐ Muito bem! Resposta correta!',
      '✨ Incrível! Você está aprendendo muito!',
      '🌟 Parabéns! Você entendeu direitinho!',
      '💪 Arrasou! Continue assim!'
    ];

    const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];

    feedbackEl.innerHTML = `
      <div class="feedback-correct">
        <div class="feedback-icon">✅</div>
        <h4>${randomMessage}</h4>
        <p>${currentQuestion.explanation}</p>
        <div class="fp-earned-badge">+${fpEarned} FP</div>
        ${this.attempts === 1 ? '<div class="bonus-badge">🏆 Acertou de primeira!</div>' : ''}
        <button class="btn-next-question" onclick="quizSystem.nextQuestion()">
          ${this.currentQuestionIndex < this.questions.length - 1 ? 'Próxima Pergunta →' : 'Ver Resultado Final 🎊'}
        </button>
      </div>
    `;
    feedbackEl.style.display = 'block';
  }

  /**
   * Lidar com resposta incorreta
   */
  handleIncorrectAnswer(selectedIndex, buttons, feedbackEl, currentQuestion) {
    // Destacar resposta errada
    buttons[selectedIndex].classList.add('incorrect');

    // Mostrar resposta correta se for a 3ª tentativa
    const showCorrectAnswer = this.attempts >= 3;
    if (showCorrectAnswer) {
      buttons[currentQuestion.correctIndex].classList.add('correct', 'reveal');
    }

    // Mensagens educativas baseadas na tentativa
    let message, hint;
    if (this.attempts === 1) {
      message = '💭 Ops! Vamos pensar um pouco mais...';
      hint = currentQuestion.hints?.[0] || 'Releia a pergunta com atenção e tente novamente!';
    } else if (this.attempts === 2) {
      message = '🤔 Quase lá! Você consegue!';
      hint = currentQuestion.hints?.[1] || currentQuestion.hints?.[0] || 'Pense no que você aprendeu antes...';
    } else {
      message = '📚 Vamos aprender juntos!';
      hint = `A resposta correta é: <strong>${currentQuestion.options[currentQuestion.correctIndex]}</strong>`;
    }

    feedbackEl.innerHTML = `
      <div class="feedback-incorrect">
        <div class="feedback-icon">💡</div>
        <h4>${message}</h4>
        <div class="feedback-hint">${hint}</div>
        ${!showCorrectAnswer ? `
          <p class="encouragement">Não desista! Tente novamente! 💪</p>
          <button class="btn-try-again" onclick="quizSystem.enableRetry()">
            Tentar Novamente
          </button>
        ` : `
          <div class="feedback-explanation">
            <h5>Por quê?</h5>
            <p>${currentQuestion.explanation}</p>
          </div>
          <button class="btn-next-question" onclick="quizSystem.nextQuestion()">
            ${this.currentQuestionIndex < this.questions.length - 1 ? 'Próxima Pergunta →' : 'Ver Resultado Final 🎊'}
          </button>
        `}
      </div>
    `;
    feedbackEl.style.display = 'block';
  }

  /**
   * Habilitar nova tentativa
   */
  enableRetry() {
    const optionsContainer = document.getElementById(`quiz-options-${this.currentQuestionIndex}`);
    const buttons = optionsContainer.querySelectorAll('.quiz-option-btn');
    const feedbackEl = document.getElementById('quiz-feedback');

    // Reabilitar apenas botões não marcados como incorretos
    buttons.forEach(btn => {
      if (!btn.classList.contains('incorrect')) {
        btn.disabled = false;
      }
    });

    feedbackEl.style.display = 'none';
  }

  /**
   * Próxima pergunta
   */
  nextQuestion() {
    this.attempts = 0;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.questions.length) {
      this.render('quiz-container');
    } else {
      this.showResults();
    }
  }

  /**
   * Mostrar resultados finais
   */
  async showResults() {
    const container = document.getElementById('quiz-container');
    const totalQuestions = this.questions.length;
    const percentage = Math.round((this.correctAnswers / totalQuestions) * 100);
    const totalFP = parseInt(document.getElementById('quiz-fp-earned').textContent) || 0;

    let performance, message, emoji;
    if (percentage === 100) {
      performance = 'Perfeito!';
      message = 'Você acertou todas! Você é incrível! 🌟';
      emoji = '🏆';
    } else if (percentage >= 80) {
      performance = 'Excelente!';
      message = 'Você foi muito bem! Continue assim! 💪';
      emoji = '⭐';
    } else if (percentage >= 60) {
      performance = 'Muito Bom!';
      message = 'Você está aprendendo bastante! 📚';
      emoji = '👍';
    } else {
      performance = 'Continue Praticando!';
      message = 'Cada erro é uma chance de aprender! 💡';
      emoji = '🌱';
    }

    container.innerHTML = `
      <div class="quiz-results">
        <div class="results-emoji">${emoji}</div>
        <h2>${performance}</h2>
        <p class="results-message">${message}</p>

        <div class="results-stats">
          <div class="result-stat">
            <div class="result-stat-value">${this.correctAnswers}/${totalQuestions}</div>
            <div class="result-stat-label">Acertos</div>
          </div>
          <div class="result-stat">
            <div class="result-stat-value">${percentage}%</div>
            <div class="result-stat-label">Aproveitamento</div>
          </div>
          <div class="result-stat highlight">
            <div class="result-stat-value">+${totalFP} FP</div>
            <div class="result-stat-label">Pontos Ganhos</div>
          </div>
        </div>

        <div class="results-actions">
          <button class="btn-primary" onclick="quizSystem.saveAndComplete(${totalFP})">
            Finalizar Quiz ✅
          </button>
          <button class="btn-secondary" onclick="quizSystem.restart()">
            Jogar Novamente 🔄
          </button>
        </div>
      </div>
    `;

    // Tocar som de celebração se disponível
    if (window.audioManager && percentage >= 80) {
      window.audioManager.playSuccess?.();
    }
  }

  /**
   * Salvar progresso e completar
   */
  async saveAndComplete(fpEarned) {
    try {
      // Salvar atividade como completa
      await completeActivity(`Quiz ${this.moduleKey} completo`, fpEarned);

      // Voltar para a tela do módulo
      window.location.reload();
    } catch (error) {
      console.error('Erro ao salvar quiz:', error);
      alert('Ops! Erro ao salvar seu progresso. Tente novamente.');
    }
  }

  /**
   * Reiniciar quiz
   */
  restart() {
    this.currentQuestionIndex = 0;
    this.attempts = 0;
    this.correctAnswers = 0;
    this.render('quiz-container');
  }

  /**
   * Adicionar estilos do quiz
   */
  addQuizStyles() {
    if (document.getElementById('quiz-system-styles')) return;

    const style = document.createElement('style');
    style.id = 'quiz-system-styles';
    style.textContent = `
      .quiz-container {
        max-width: 700px;
        margin: 0 auto;
        padding: 20px;
      }

      .quiz-header {
        margin-bottom: 30px;
      }

      .quiz-progress-bar {
        background: #ecf0f1;
        border-radius: 10px;
        height: 8px;
        overflow: hidden;
        margin-bottom: 10px;
      }

      .quiz-progress-fill {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        height: 100%;
        transition: width 0.3s ease;
      }

      .quiz-progress-text {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #7F8C8D;
        font-size: 14px;
        margin: 0;
      }

      .quiz-level-badge {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
      }

      .quiz-question-area {
        background: white;
        padding: 25px;
        border-radius: 16px;
        margin-bottom: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .quiz-image {
        font-size: 64px;
        text-align: center;
        margin-bottom: 20px;
      }

      .quiz-question {
        color: #2c3e50;
        font-size: 20px;
        margin: 0 0 10px 0;
        line-height: 1.4;
      }

      .quiz-context {
        color: #7F8C8D;
        font-size: 14px;
        font-style: italic;
        margin: 10px 0 0 0;
      }

      .quiz-options {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 20px;
      }

      .quiz-option-btn {
        display: flex;
        align-items: center;
        gap: 15px;
        background: white;
        border: 2px solid #ecf0f1;
        padding: 16px 20px;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
        font-size: 16px;
      }

      .quiz-option-btn:hover:not(:disabled) {
        border-color: #667eea;
        transform: translateX(5px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
      }

      .quiz-option-btn:disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }

      .option-letter {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: #ecf0f1;
        border-radius: 50%;
        font-weight: bold;
        color: #7F8C8D;
        flex-shrink: 0;
      }

      .option-text {
        flex: 1;
        color: #2c3e50;
      }

      .quiz-option-btn.correct {
        border-color: #27ae60;
        background: #d5f4e6;
      }

      .quiz-option-btn.correct .option-letter {
        background: #27ae60;
        color: white;
      }

      .quiz-option-btn.incorrect {
        border-color: #e74c3c;
        background: #fadbd8;
      }

      .quiz-option-btn.incorrect .option-letter {
        background: #e74c3c;
        color: white;
      }

      .quiz-option-btn.reveal {
        animation: reveal 0.5s ease;
      }

      @keyframes reveal {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }

      .quiz-feedback {
        margin: 20px 0;
      }

      .feedback-correct,
      .feedback-incorrect {
        background: white;
        padding: 25px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .feedback-correct {
        border-left: 4px solid #27ae60;
      }

      .feedback-incorrect {
        border-left: 4px solid #f39c12;
      }

      .feedback-icon {
        font-size: 48px;
        text-align: center;
        margin-bottom: 15px;
      }

      .feedback-correct h4 {
        color: #27ae60;
        margin: 0 0 10px 0;
        text-align: center;
      }

      .feedback-incorrect h4 {
        color: #f39c12;
        margin: 0 0 10px 0;
        text-align: center;
      }

      .feedback-hint {
        background: #fff3cd;
        border-left: 3px solid #f39c12;
        padding: 15px;
        margin: 15px 0;
        border-radius: 8px;
        color: #856404;
      }

      .feedback-explanation {
        background: #d5f4e6;
        border-left: 3px solid #27ae60;
        padding: 15px;
        margin: 15px 0;
        border-radius: 8px;
      }

      .feedback-explanation h5 {
        color: #27ae60;
        margin: 0 0 10px 0;
      }

      .encouragement {
        text-align: center;
        color: #7F8C8D;
        margin: 15px 0;
      }

      .fp-earned-badge {
        display: inline-block;
        background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%);
        color: white;
        padding: 8px 20px;
        border-radius: 20px;
        font-weight: bold;
        margin: 15px auto;
        display: block;
        text-align: center;
        width: fit-content;
      }

      .bonus-badge {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        color: white;
        padding: 6px 16px;
        border-radius: 16px;
        font-size: 14px;
        font-weight: bold;
        margin: 10px auto;
        display: block;
        text-align: center;
        width: fit-content;
      }

      .btn-next-question,
      .btn-try-again {
        display: block;
        width: 100%;
        padding: 14px;
        margin-top: 15px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.2s;
      }

      .btn-try-again {
        background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%);
      }

      .btn-next-question:hover,
      .btn-try-again:hover {
        transform: scale(1.02);
      }

      .quiz-stats {
        display: flex;
        justify-content: center;
        gap: 30px;
        margin-top: 20px;
      }

      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
      }

      .stat-icon {
        font-size: 24px;
      }

      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #2c3e50;
      }

      .stat-label {
        font-size: 12px;
        color: #7F8C8D;
      }

      .quiz-results {
        text-align: center;
        padding: 40px 20px;
      }

      .results-emoji {
        font-size: 80px;
        margin-bottom: 20px;
      }

      .quiz-results h2 {
        color: #2c3e50;
        margin: 0 0 10px 0;
      }

      .results-message {
        color: #7F8C8D;
        font-size: 18px;
        margin-bottom: 30px;
      }

      .results-stats {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin: 30px 0;
        flex-wrap: wrap;
      }

      .result-stat {
        background: white;
        padding: 20px;
        border-radius: 12px;
        min-width: 120px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .result-stat.highlight {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .result-stat-value {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .result-stat.highlight .result-stat-value,
      .result-stat.highlight .result-stat-label {
        color: white;
      }

      .result-stat-label {
        font-size: 14px;
        color: #7F8C8D;
      }

      .results-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 30px;
        flex-wrap: wrap;
      }

      .results-actions button {
        padding: 14px 30px;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.2s;
      }

      .results-actions .btn-primary {
        background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
        color: white;
      }

      .results-actions .btn-secondary {
        background: white;
        border: 2px solid #667eea;
        color: #667eea;
      }

      .results-actions button:hover {
        transform: scale(1.05);
      }

      @media (max-width: 600px) {
        .quiz-container {
          padding: 15px;
        }

        .quiz-question {
          font-size: 18px;
        }

        .quiz-option-btn {
          padding: 12px 15px;
          font-size: 14px;
        }

        .results-stats {
          flex-direction: column;
          gap: 15px;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Instância global
let quizSystem;
