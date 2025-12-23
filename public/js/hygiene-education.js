// HIGIENE E AUTOCUIDADO - Frontend Module
// Tracking de Hábitos, Sequências e Rotinas

class HygieneEducation {
  constructor(apiUrl, token, childId) {
    this.apiUrl = apiUrl;
    this.token = token;
    this.childId = childId;
  }

  // ============================================
  // INTERFACE PRINCIPAL
  // ============================================

  async renderMainInterface(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      const [habits, stats, todayTracking] = await Promise.all([
        this.fetchHabits(),
        this.fetchStats(),
        this.fetchTodayTracking()
      ]);

      container.innerHTML = `
        <div style="padding: 20px; max-width: 1000px; margin: 0 auto;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 36px; color: #2d3748; margin-bottom: 12px;">
              🧼 Higiene e Autocuidado
            </h1>
            <p style="font-size: 18px; color: #4a5568;">
              Cuidar do corpo é cuidar de você!
            </p>
          </div>

          <!-- Estatísticas -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px;">
            ${this.renderStatsCards(stats)}
          </div>

          <!-- Hábitos de Hoje -->
          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 28px; color: #2d3748; margin-bottom: 20px;">
              Hábitos de Hoje
            </h2>
            <div style="display: grid; gap: 16px;">
              ${habits.map(habit => this.renderHabitCard(habit, todayTracking)).join('')}
            </div>
          </div>

          <!-- Botão Ver Histórico -->
          <button onclick="hygieneEducation.showHistory()" style="
            width: 100%;
            background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
            color: white;
            border: none;
            padding: 20px;
            border-radius: 16px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
          ">
            📊 Ver Histórico
          </button>
        </div>
      `;

    } catch (error) {
      console.error('Erro ao renderizar interface:', error);
    }
  }

  renderStatsCards(stats) {
    if (!stats) {
      return '<p style="text-align: center; color: #718096;">Comece a registrar seus hábitos!</p>';
    }

    return `
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        padding: 24px;
        text-align: center;
        color: white;
      ">
        <div style="font-size: 48px; margin-bottom: 8px;">🔥</div>
        <div style="font-size: 32px; font-weight: bold; margin-bottom: 4px;">
          ${stats.current_streak_days}
        </div>
        <div style="font-size: 14px; opacity: 0.9;">
          Dias seguidos
        </div>
      </div>

      <div style="
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        border-radius: 20px;
        padding: 24px;
        text-align: center;
        color: white;
      ">
        <div style="font-size: 48px; margin-bottom: 8px;">✅</div>
        <div style="font-size: 32px; font-weight: bold; margin-bottom: 4px;">
          ${stats.total_habits_completed}
        </div>
        <div style="font-size: 14px; opacity: 0.9;">
          Hábitos completados
        </div>
      </div>

      <div style="
        background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
        border-radius: 20px;
        padding: 24px;
        text-align: center;
        color: white;
      ">
        <div style="font-size: 48px; margin-bottom: 8px;">🏆</div>
        <div style="font-size: 32px; font-weight: bold; margin-bottom: 4px;">
          ${stats.longest_streak_days}
        </div>
        <div style="font-size: 14px; opacity: 0.9;">
          Melhor sequência
        </div>
      </div>

      <div style="
        background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
        border-radius: 20px;
        padding: 24px;
        text-align: center;
        color: white;
      ">
        <div style="font-size: 48px; margin-bottom: 8px;">💯</div>
        <div style="font-size: 32px; font-weight: bold; margin-bottom: 4px;">
          ${Math.round(stats.frequency_score)}%
        </div>
        <div style="font-size: 14px; opacity: 0.9;">
          Frequência
        </div>
      </div>
    `;
  }

  renderHabitCard(habit, todayTracking) {
    const tracked = todayTracking.find(t => t.habit_id === habit.id);
    const isCompleted = !!tracked;
    const timesCompleted = tracked ? tracked.times_completed : 0;

    const categoryIcons = {
      hands: '🤲',
      teeth: '🦷',
      body: '🚿',
      clothes: '👕',
      food: '🍎'
    };

    const icon = categoryIcons[habit.category_type] || '🧼';

    return `
      <div style="
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        border-left: 6px solid ${isCompleted ? '#48bb78' : '#e2e8f0'};
        display: flex;
        align-items: center;
        gap: 20px;
      ">
        <div style="
          font-size: 48px;
          filter: ${isCompleted ? 'none' : 'grayscale(100%) opacity(0.5)'};
        ">${icon}</div>

        <div style="flex: 1;">
          <h3 style="font-size: 20px; color: #2d3748; margin-bottom: 8px;">
            ${habit.habit_name}
          </h3>
          <p style="font-size: 14px; color: #718096; margin-bottom: 12px;">
            ${habit.description}
          </p>

          ${habit.visual_guide ? `
            <div style="
              background: #f7fafc;
              padding: 12px;
              border-radius: 12px;
              font-size: 12px;
              color: #4a5568;
              margin-bottom: 12px;
            ">
              📝 ${habit.visual_guide}
            </div>
          ` : ''}

          ${isCompleted ? `
            <div style="
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: #c6f6d5;
              color: #22543d;
              padding: 8px 16px;
              border-radius: 12px;
              font-size: 14px;
              font-weight: bold;
            ">
              ✅ Feito ${timesCompleted}x hoje
            </div>
          ` : ''}
        </div>

        <button onclick="hygieneEducation.trackHabit(${habit.id})" style="
          background: ${isCompleted ? '#48bb78' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          white-space: nowrap;
          transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.05)'"
          onmouseout="this.style.transform='scale(1)'">
          ${isCompleted ? '✅ Feito' : '✓ Marcar'}
        </button>
      </div>
    `;
  }

  // ============================================
  // TRACKING DE HÁBITOS
  // ============================================

  async trackHabit(habitId) {
    try {
      const response = await fetch(`${this.apiUrl}/api/hygiene/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          childId: this.childId,
          habitId
        })
      });

      const data = await response.json();

      if (data.success) {
        // Mostrar animação de sucesso
        this.showSuccessAnimation(data.fp_earned);

        // Se conquistou badge
        if (data.badges && data.badges.length > 0) {
          setTimeout(() => {
            this.showBadgeUnlocked(data.badges[0]);
          }, 1000);
        }

        // Recarregar interface
        setTimeout(() => {
          this.renderMainInterface('hygiene-container');
        }, 1500);
      }

    } catch (error) {
      console.error('Erro ao registrar hábito:', error);
    }
  }

  showSuccessAnimation(fpEarned) {
    const animation = document.createElement('div');
    animation.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;
      padding: 40px 60px;
      border-radius: 24px;
      font-size: 32px;
      font-weight: bold;
      text-align: center;
      z-index: 10000;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: zoomIn 0.3s;
    `;

    animation.innerHTML = `
      <div style="font-size: 80px; margin-bottom: 16px;">✅</div>
      <div>Muito bem!</div>
      <div style="font-size: 24px; margin-top: 12px;">+${fpEarned} FP</div>
    `;

    document.body.appendChild(animation);

    setTimeout(() => {
      animation.style.animation = 'zoomOut 0.3s';
      setTimeout(() => document.body.removeChild(animation), 300);
    }, 1200);
  }

  // ============================================
  // HISTÓRICO
  // ============================================

  async showHistory() {
    try {
      const response = await fetch(`${this.apiUrl}/api/hygiene/history/${this.childId}?days=30`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      const data = await response.json();

      if (!data.success) return;

      const modal = document.createElement('div');
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
          max-width: 800px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        ">
          <h2 style="font-size: 32px; margin-bottom: 24px; text-align: center;">
            📊 Histórico de Hábitos
          </h2>

          ${data.history.length > 0 ? `
            <div style="display: grid; gap: 12px;">
              ${data.history.map(item => `
                <div style="
                  background: #f7fafc;
                  border-radius: 12px;
                  padding: 16px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                ">
                  <div>
                    <div style="font-weight: bold; color: #2d3748; margin-bottom: 4px;">
                      ${item.habit_name}
                    </div>
                    <div style="font-size: 12px; color: #718096;">
                      ${new Date(item.tracked_date).toLocaleDateString('pt-BR')} - ${item.category_name}
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 18px; color: #48bb78; font-weight: bold;">
                      +${item.fp_earned} FP
                    </div>
                    <div style="font-size: 12px; color: #718096;">
                      ${item.times_completed}x
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : '<p style="text-align: center; color: #718096; padding: 40px;">Ainda não há histórico</p>'}

          <button onclick="this.parentElement.parentElement.remove()" style="
            width: 100%;
            background: #e2e8f0;
            color: #2d3748;
            border: none;
            padding: 16px;
            border-radius: 12px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 24px;
          ">
            Fechar
          </button>
        </div>
      `;

      document.body.appendChild(modal);

    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  }

  // ============================================
  // API HELPERS
  // ============================================

  async fetchHabits() {
    const response = await fetch(`${this.apiUrl}/api/hygiene/habits`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();
    return data.habits || [];
  }

  async fetchStats() {
    const response = await fetch(`${this.apiUrl}/api/hygiene/stats/${this.childId}`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();
    return data.stats;
  }

  async fetchTodayTracking() {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`${this.apiUrl}/api/hygiene/tracking/${this.childId}?date=${today}`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();
    return data.habits || [];
  }

  // ============================================
  // BADGES
  // ============================================

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
      z-index: 10001;
    `;

    modal.innerHTML = `
      <div style="text-align: center; animation: zoomIn 0.5s;">
        <div style="font-size: 120px; margin-bottom: 20px;">🏆</div>
        <h2 style="color: #ffd700; font-size: 42px; margin-bottom: 16px;">
          Badge Conquistado!
        </h2>
        <h3 style="color: white; font-size: 32px; margin-bottom: 12px;">
          ${badge.name}
        </h3>
        <p style="color: rgba(255,255,255,0.8); font-size: 20px;">
          ${badge.description}
        </p>
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
  }
}

// CSS Animations
const style = document.createElement('style');
style.textContent = `
  @keyframes zoomIn {
    from { transform: scale(0.5); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes zoomOut {
    from { transform: scale(1); opacity: 1; }
    to { transform: scale(0.5); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HygieneEducation;
}
