// EDUCAÇÃO FINANCEIRA - Frontend Module
// Pop-ups, Cofrinho e Decisões de FP

class FinancialEducation {
  constructor(apiUrl, token, childId) {
    this.apiUrl = apiUrl;
    this.token = token;
    this.childId = childId;
  }

  // ============================================
  // POP-UP AO GANHAR FP
  // ============================================

  /**
   * Exibe pop-up de decisão quando a criança ganha FP
   */
  showFpDecisionPopup(fpAmount, context, source) {
    return new Promise((resolve) => {
      // Criar modal
      const modal = document.createElement('div');
      modal.id = 'fp-decision-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s;
      `;

      modal.innerHTML = `
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 24px;
          padding: 40px;
          max-width: 500px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          animation: slideUp 0.4s;
        ">
          <div style="font-size: 80px; margin-bottom: 20px;">🎉</div>
          <h2 style="color: white; font-size: 32px; margin-bottom: 20px;">
            Você ganhou ${fpAmount} FP!
          </h2>
          <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin-bottom: 30px;">
            Quer guardar no seu cofrinho para ficar mais rico depois?
          </p>
          <div style="display: flex; flex-direction: column; gap: 15px;">
            <button id="fp-save-btn" style="
              background: #48bb78;
              color: white;
              border: none;
              padding: 20px;
              border-radius: 16px;
              font-size: 20px;
              font-weight: bold;
              cursor: pointer;
              transition: transform 0.2s;
            ">
              🐷 Guardar no cofrinho
            </button>
            <button id="fp-spend-btn" style="
              background: #ed8936;
              color: white;
              border: none;
              padding: 20px;
              border-radius: 16px;
              font-size: 20px;
              font-weight: bold;
              cursor: pointer;
              transition: transform 0.2s;
            ">
              ✨ Usar agora
            </button>
            <button id="fp-later-btn" style="
              background: rgba(255,255,255,0.2);
              color: white;
              border: none;
              padding: 15px;
              border-radius: 12px;
              font-size: 16px;
              cursor: pointer;
              transition: transform 0.2s;
            ">
              Decidir depois
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Adicionar hover effects
      modal.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          btn.style.transform = 'scale(1.05)';
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'scale(1)';
        });
      });

      // Event listeners
      document.getElementById('fp-save-btn').addEventListener('click', () => {
        this.recordDecision(fpAmount, 'save', context, source);
        document.body.removeChild(modal);
        this.showFeedback('Muito bem! Você guardou seu FP! 🌟', 'success');
        resolve('save');
      });

      document.getElementById('fp-spend-btn').addEventListener('click', () => {
        this.recordDecision(fpAmount, 'spend', context, source);
        document.body.removeChild(modal);
        resolve('spend');
      });

      document.getElementById('fp-later-btn').addEventListener('click', () => {
        this.recordDecision(fpAmount, 'decide_later', context, source);
        document.body.removeChild(modal);
        resolve('decide_later');
      });
    });
  }

  /**
   * Registra decisão de FP na API
   */
  async recordDecision(fpAmount, decision, context, source) {
    try {
      const response = await fetch(`${this.apiUrl}/api/financial/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          childId: this.childId,
          fpAmount,
          decision,
          context,
          source
        })
      });

      const data = await response.json();

      if (data.badges && data.badges.length > 0) {
        this.showBadgeUnlocked(data.badges[0]);
      }

      return data;
    } catch (error) {
      console.error('Erro ao registrar decisão:', error);
    }
  }

  /**
   * Pop-up ao sair do app com FP disponível
   */
  showExitReminder(currentFp) {
    if (currentFp <= 0) return Promise.resolve(false);

    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.id = 'exit-reminder-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      `;

      modal.innerHTML = `
        <div style="
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          border-radius: 24px;
          padding: 40px;
          max-width: 450px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        ">
          <div style="font-size: 70px; margin-bottom: 20px;">🐷</div>
          <h2 style="color: white; font-size: 28px; margin-bottom: 20px;">
            Você não usou seus FP hoje
          </h2>
          <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin-bottom: 30px;">
            Quer guardar no cofrinho para o futuro?
          </p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <button id="save-all-btn" style="
              background: white;
              color: #f5576c;
              border: none;
              padding: 18px;
              border-radius: 14px;
              font-size: 18px;
              font-weight: bold;
              cursor: pointer;
            ">
              Guardar tudo
            </button>
            <button id="exit-without-save-btn" style="
              background: rgba(255,255,255,0.2);
              color: white;
              border: none;
              padding: 15px;
              border-radius: 12px;
              font-size: 16px;
              cursor: pointer;
            ">
              Sair sem guardar
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      document.getElementById('save-all-btn').addEventListener('click', () => {
        this.recordDecision(currentFp, 'save', 'app_exit', 'exit_reminder');
        document.body.removeChild(modal);
        this.showFeedback('Seu FP está guardado! 💰', 'success');
        resolve(true);
      });

      document.getElementById('exit-without-save-btn').addEventListener('click', () => {
        this.recordDecision(currentFp, 'decide_later', 'app_exit', 'exit_reminder');
        document.body.removeChild(modal);
        resolve(false);
      });
    });
  }

  // ============================================
  // COFRINHO VISUAL
  // ============================================

  /**
   * Renderiza interface do cofrinho
   */
  async renderPiggyBank(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      const response = await fetch(`${this.apiUrl}/api/financial/piggy-banks/${this.childId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      const data = await response.json();

      if (!data.success) {
        console.error('Erro ao carregar cofrinhos');
        return;
      }

      container.innerHTML = `
        <div style="padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="font-size: 32px; color: #2d3748; margin-bottom: 10px;">
              Meu Cofrinho 🐷
            </h2>
            <p style="font-size: 24px; color: #4a5568; font-weight: bold;">
              Total guardado: ${data.totalSaved} FP
            </p>
          </div>

          <div id="piggy-banks-list" style="display: grid; gap: 20px;">
            ${data.banks.map(bank => this.renderPiggyBankCard(bank)).join('')}
          </div>

          <button id="new-piggy-btn" style="
            width: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 20px;
            border-radius: 16px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
          ">
            ➕ Criar novo cofrinho
          </button>
        </div>
      `;

      document.getElementById('new-piggy-btn').addEventListener('click', () => {
        this.showCreatePiggyBankModal();
      });

    } catch (error) {
      console.error('Erro ao renderizar cofrinho:', error);
    }
  }

  /**
   * Renderiza card de um cofrinho
   */
  renderPiggyBankCard(bank) {
    const progress = bank.target_fp ? (bank.current_fp / bank.target_fp) * 100 : 0;
    const goalTypes = {
      short: { emoji: '🎯', name: 'Meta Curta', color: '#48bb78' },
      medium: { emoji: '🚀', name: 'Meta Média', color: '#4299e1' },
      dream: { emoji: '🌟', name: 'Grande Sonho', color: '#ed8936' },
      planet: { emoji: '🌍', name: 'Planeta', color: '#38b2ac' }
    };

    const type = goalTypes[bank.goal_type] || goalTypes.short;

    return `
      <div style="
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border-left: 6px solid ${type.color};
      ">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
          <div>
            <div style="font-size: 32px; margin-bottom: 8px;">${type.emoji}</div>
            <h3 style="font-size: 20px; color: #2d3748; margin-bottom: 4px;">${bank.name}</h3>
            <span style="
              background: ${type.color}20;
              color: ${type.color};
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
            ">${type.name}</span>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 28px; color: ${type.color}; font-weight: bold;">
              ${bank.current_fp} FP
            </div>
            ${bank.target_fp ? `<div style="font-size: 14px; color: #718096;">de ${bank.target_fp} FP</div>` : ''}
          </div>
        </div>

        ${bank.target_fp ? `
          <div style="background: #edf2f7; border-radius: 12px; height: 12px; overflow: hidden; margin-top: 12px;">
            <div style="
              background: linear-gradient(90deg, ${type.color} 0%, ${type.color}aa 100%);
              height: 100%;
              width: ${Math.min(progress, 100)}%;
              transition: width 0.5s;
            "></div>
          </div>
          <p style="text-align: center; margin-top: 8px; font-size: 14px; color: #4a5568;">
            ${Math.round(progress)}% completo
          </p>
        ` : ''}
      </div>
    `;
  }

  /**
   * Modal para criar novo cofrinho
   */
  showCreatePiggyBankModal() {
    const modal = document.createElement('div');
    modal.id = 'create-piggy-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    modal.innerHTML = `
      <div style="
        background: white;
        border-radius: 24px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
      ">
        <h2 style="font-size: 28px; margin-bottom: 24px; text-align: center;">
          Criar Cofrinho 🐷
        </h2>
        <form id="piggy-form">
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #2d3748;">
              Nome do cofrinho
            </label>
            <input type="text" id="piggy-name" required style="
              width: 100%;
              padding: 12px;
              border: 2px solid #e2e8f0;
              border-radius: 12px;
              font-size: 16px;
            " placeholder="Ex: Bicicleta nova">
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #2d3748;">
              Tipo de meta
            </label>
            <select id="piggy-type" required style="
              width: 100%;
              padding: 12px;
              border: 2px solid #e2e8f0;
              border-radius: 12px;
              font-size: 16px;
            ">
              <option value="short">🎯 Meta Curta</option>
              <option value="medium">🚀 Meta Média</option>
              <option value="dream">🌟 Grande Sonho</option>
              <option value="planet">🌍 Planeta</option>
            </select>
          </div>

          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #2d3748;">
              Meta de FP (opcional)
            </label>
            <input type="number" id="piggy-target" min="1" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #e2e8f0;
              border-radius: 12px;
              font-size: 16px;
            " placeholder="Ex: 100">
          </div>

          <div style="display: flex; gap: 12px;">
            <button type="submit" style="
              flex: 1;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              padding: 16px;
              border-radius: 12px;
              font-size: 18px;
              font-weight: bold;
              cursor: pointer;
            ">
              Criar
            </button>
            <button type="button" id="cancel-btn" style="
              flex: 1;
              background: #e2e8f0;
              color: #2d3748;
              border: none;
              padding: 16px;
              border-radius: 12px;
              font-size: 18px;
              font-weight: bold;
              cursor: pointer;
            ">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('piggy-form').addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('piggy-name').value;
      const goalType = document.getElementById('piggy-type').value;
      const targetFp = document.getElementById('piggy-target').value || null;

      try {
        const response = await fetch(`${this.apiUrl}/api/financial/piggy-bank`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({
            childId: this.childId,
            name,
            goalType,
            targetFp: targetFp ? parseInt(targetFp) : null
          })
        });

        if (response.ok) {
          document.body.removeChild(modal);
          this.showFeedback('Cofrinho criado com sucesso! 🎉', 'success');
          this.renderPiggyBank('piggy-bank-container');
        }
      } catch (error) {
        console.error('Erro ao criar cofrinho:', error);
      }
    });

    document.getElementById('cancel-btn').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  }

  // ============================================
  // FEEDBACK E BADGES
  // ============================================

  /**
   * Mostra feedback visual
   */
  showFeedback(message, type = 'success') {
    const colors = {
      success: '#48bb78',
      info: '#4299e1',
      warning: '#ed8936'
    };

    const feedback = document.createElement('div');
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 20px 30px;
      border-radius: 16px;
      font-size: 18px;
      font-weight: bold;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      z-index: 10001;
      animation: slideInRight 0.3s;
    `;
    feedback.textContent = message;

    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.style.animation = 'slideOutRight 0.3s';
      setTimeout(() => document.body.removeChild(feedback), 300);
    }, 3000);
  }

  /**
   * Mostra badge desbloqueado
   */
  showBadgeUnlocked(badge) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.5s;
    `;

    modal.innerHTML = `
      <div style="
        text-align: center;
        animation: zoomIn 0.5s;
      ">
        <div style="font-size: 120px; margin-bottom: 20px;">🏆</div>
        <h2 style="color: #ffd700; font-size: 42px; margin-bottom: 16px; text-shadow: 0 0 20px rgba(255,215,0,0.5);">
          Badge Desbloqueado!
        </h2>
        <h3 style="color: white; font-size: 32px; margin-bottom: 12px;">
          ${badge.name}
        </h3>
        <p style="color: rgba(255,255,255,0.8); font-size: 20px; max-width: 400px;">
          ${badge.description}
        </p>
        ${badge.reward_fp > 0 ? `
          <div style="
            background: rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 20px;
            margin-top: 24px;
            display: inline-block;
          ">
            <p style="color: white; font-size: 18px;">
              +${badge.reward_fp} FP de bônus!
            </p>
          </div>
        ` : ''}
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 16px 40px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 30px;
        ">
          Continuar
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    // Narrar badge com áudio
    if (window.audioManager) {
      window.audioManager.speakBadgeUnlock(badge.name, badge.description);
    }
  }

  // ============================================
  // EXTRATO MENSAL
  // ============================================

  /**
   * Busca extrato mensal
   */
  async getMonthlyStatement(month, year) {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/financial/monthly-statement/${this.childId}?month=${month}&year=${year}`,
        {
          headers: { 'Authorization': `Bearer ${this.token}` }
        }
      );

      const data = await response.json();
      return data.success ? data.statement : null;

    } catch (error) {
      console.error('Erro ao buscar extrato:', error);
      return null;
    }
  }

  /**
   * Exibe extrato mensal com narração
   */
  async showMonthlyStatement(month, year) {
    const statement = await this.getMonthlyStatement(month, year);
    if (!statement) {
      this.showFeedback('Nenhum extrato disponível para este mês', 'error');
      return;
    }

    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s;
      overflow-y: auto;
      padding: 20px;
    `;

    const monthName = this.getMonthName(statement.month);

    modal.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 24px;
        padding: 40px;
        max-width: 600px;
        width: 100%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        animation: slideUp 0.4s;
        position: relative;
      ">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 60px; margin-bottom: 16px;">📊</div>
          <h2 style="color: white; font-size: 32px; margin: 0 0 8px 0;">
            Extrato de ${monthName}
          </h2>
          <p style="color: rgba(255,255,255,0.8); font-size: 16px; margin: 0;">
            Veja como você se saiu!
          </p>
        </div>

        <!-- Estatísticas -->
        <div style="
          background: rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
        ">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
            <div style="text-align: center;">
              <div style="font-size: 36px; margin-bottom: 8px;">💰</div>
              <div style="color: white; font-size: 28px; font-weight: bold;">
                ${statement.fp_earned}
              </div>
              <div style="color: rgba(255,255,255,0.8); font-size: 14px;">
                FP Ganhos
              </div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 36px; margin-bottom: 8px;">🐷</div>
              <div style="color: #48bb78; font-size: 28px; font-weight: bold;">
                ${statement.fp_saved}
              </div>
              <div style="color: rgba(255,255,255,0.8); font-size: 14px;">
                FP Guardados
              </div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 36px; margin-bottom: 8px;">✨</div>
              <div style="color: #ed8936; font-size: 28px; font-weight: bold;">
                ${statement.fp_spent}
              </div>
              <div style="color: rgba(255,255,255,0.8); font-size: 14px;">
                FP Usados
              </div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 36px; margin-bottom: 8px;">🎯</div>
              <div style="color: #ffd700; font-size: 28px; font-weight: bold;">
                ${statement.total_fp}
              </div>
              <div style="color: rgba(255,255,255,0.8); font-size: 14px;">
                Saldo Total
              </div>
            </div>
          </div>

          <!-- Percentual de poupança -->
          <div style="
            background: rgba(255,255,255,0.15);
            border-radius: 12px;
            padding: 16px;
            text-align: center;
          ">
            <div style="color: white; font-size: 48px; font-weight: bold; margin-bottom: 8px;">
              ${statement.savings_percentage}%
            </div>
            <div style="color: rgba(255,255,255,0.9); font-size: 16px;">
              do que você ganhou foi guardado!
            </div>
            <div style="
              background: rgba(255,255,255,0.2);
              height: 12px;
              border-radius: 6px;
              margin-top: 12px;
              overflow: hidden;
            ">
              <div style="
                background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
                height: 100%;
                width: ${statement.savings_percentage}%;
                transition: width 1s ease-out;
                border-radius: 6px;
              "></div>
            </div>
          </div>
        </div>

        <!-- Comentário motivacional -->
        <div style="
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          text-align: center;
        ">
          <div style="font-size: 32px; margin-bottom: 12px;">
            ${this.getSavingsEmoji(statement.savings_percentage)}
          </div>
          <p style="color: white; font-size: 18px; margin: 0;">
            ${this.getSavingsComment(statement.savings_percentage)}
          </p>
        </div>

        <!-- Botões -->
        <div style="display: flex; gap: 12px;">
          <button id="play-narration-btn" style="
            flex: 1;
            background: rgba(255,255,255,0.2);
            color: white;
            border: none;
            padding: 16px;
            border-radius: 12px;
            font-size: 18px;
            cursor: pointer;
            transition: background 0.2s;
          ">
            🔊 Ouvir Extrato
          </button>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
            flex: 1;
            background: white;
            color: #667eea;
            border: none;
            padding: 16px;
            border-radius: 12px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            Fechar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Botão de narração
    const playBtn = document.getElementById('play-narration-btn');
    if (playBtn && window.audioManager) {
      playBtn.onmouseover = () => playBtn.style.background = 'rgba(255,255,255,0.3)';
      playBtn.onmouseout = () => playBtn.style.background = 'rgba(255,255,255,0.2)';

      playBtn.onclick = () => {
        if (window.audioManager.isPlaying) {
          window.audioManager.stop();
          playBtn.innerHTML = '🔊 Ouvir Extrato';
        } else {
          window.audioManager.speakMonthlyStatement(statement);
          playBtn.innerHTML = '⏸️ Parar';
        }
      };
    }
  }

  /**
   * Exibe extrato do mês atual automaticamente
   */
  async showCurrentMonthStatement() {
    const now = new Date();
    await this.showMonthlyStatement(now.getMonth() + 1, now.getFullYear());
  }

  // ============================================
  // UTILITÁRIOS
  // ============================================

  getMonthName(month) {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[month - 1] || 'Mês Desconhecido';
  }

  getSavingsEmoji(percentage) {
    if (percentage >= 80) return '🏆';
    if (percentage >= 50) return '⭐';
    if (percentage >= 20) return '👍';
    return '💪';
  }

  getSavingsComment(percentage) {
    if (percentage >= 80) {
      return 'Incrível! Você é um super poupador! Continue assim!';
    } else if (percentage >= 50) {
      return 'Muito bem! Você está guardando bastante! Excelente trabalho!';
    } else if (percentage >= 20) {
      return 'Bom começo! Que tal tentar guardar um pouquinho mais?';
    } else {
      return 'Você pode fazer melhor! Tente guardar mais no próximo mês!';
    }
  }
}

// CSS Animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes slideInRight {
    from { transform: translateX(100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100px); opacity: 0; }
  }
  @keyframes zoomIn {
    from { transform: scale(0.5); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FinancialEducation;
}
