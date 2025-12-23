// NATUREZA E MEIO AMBIENTE - Frontend Module
// Lições, Missões e Cuidado com o Planeta

class NatureEducation {
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
      const [categories, missions, badges] = await Promise.all([
        this.fetchCategories(),
        this.fetchActiveMissions(),
        this.fetchBadges()
      ]);

      container.innerHTML = `
        <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 36px; color: #2d3748; margin-bottom: 12px;">
              🌱 Natureza e Cuidado
            </h1>
            <p style="font-size: 18px; color: #4a5568;">
              Aprenda a cuidar de plantas, animais e do nosso planeta
            </p>
          </div>

          <!-- Categorias -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px;">
            ${categories.map(cat => this.renderCategoryCard(cat)).join('')}
          </div>

          <!-- Missões Ativas -->
          ${missions.length > 0 ? `
            <div style="margin-bottom: 40px;">
              <h2 style="font-size: 28px; color: #2d3748; margin-bottom: 20px;">
                Minhas Missões Ativas
              </h2>
              <div style="display: grid; gap: 16px;">
                ${missions.map(m => this.renderMissionCard(m)).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Badges -->
          ${badges.length > 0 ? `
            <div>
              <h2 style="font-size: 28px; color: #2d3748; margin-bottom: 20px;">
                Badges Conquistados
              </h2>
              <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                ${badges.map(b => this.renderBadge(b)).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;

      // Adicionar event listeners
      document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
          const categoryId = card.dataset.categoryId;
          this.showCategoryLessons(categoryId);
        });
      });

    } catch (error) {
      console.error('Erro ao renderizar interface:', error);
    }
  }

  renderCategoryCard(category) {
    const icons = {
      plants: '🌱',
      animals: '🐾',
      environment: '🌍',
      responsibility: '💚'
    };

    const colors = {
      plants: '#48bb78',
      animals: '#ed8936',
      environment: '#4299e1',
      responsibility: '#9f7aea'
    };

    const icon = icons[category.category_type] || '🌿';
    const color = colors[category.category_type] || '#48bb78';

    return `
      <div class="category-card" data-category-id="${category.id}" style="
        background: white;
        border-radius: 20px;
        padding: 30px;
        text-align: center;
        cursor: pointer;
        transition: transform 0.3s, box-shadow 0.3s;
        border: 3px solid ${color}20;
      " onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.1)'"
        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
        <div style="font-size: 64px; margin-bottom: 16px;">${icon}</div>
        <h3 style="font-size: 22px; color: #2d3748; margin-bottom: 8px;">
          ${category.name}
        </h3>
        <p style="font-size: 14px; color: #718096;">
          ${category.description}
        </p>
      </div>
    `;
  }

  renderMissionCard(mission) {
    const progress = (mission.current_progress / mission.target_progress) * 100;

    return `
      <div style="
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        border-left: 6px solid #48bb78;
      ">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 20px; color: #2d3748; margin-bottom: 8px;">
              ${mission.name}
            </h3>
            <p style="font-size: 14px; color: #718096; margin-bottom: 12px;">
              ${mission.description}
            </p>
            <div style="
              background: #f7fafc;
              padding: 12px;
              border-radius: 12px;
              font-size: 14px;
              color: #4a5568;
            ">
              📝 ${mission.instructions}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 24px; color: #48bb78; font-weight: bold;">
              ${mission.reward_fp} FP
            </div>
          </div>
        </div>

        <div style="background: #e6fffa; border-radius: 12px; height: 12px; overflow: hidden; margin-bottom: 8px;">
          <div style="
            background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
            height: 100%;
            width: ${Math.min(progress, 100)}%;
            transition: width 0.5s;
          "></div>
        </div>
        <p style="font-size: 14px; color: #4a5568; text-align: center;">
          ${mission.current_progress} / ${mission.target_progress}
        </p>

        <button onclick="natureEducation.updateMissionProgress(${mission.mission_id})" style="
          width: 100%;
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 16px;
        ">
          ✅ Registrar Progresso
        </button>
      </div>
    `;
  }

  renderBadge(badge) {
    return `
      <div style="
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        border-radius: 16px;
        padding: 20px;
        text-align: center;
        color: white;
        min-width: 150px;
      ">
        <div style="font-size: 48px; margin-bottom: 8px;">🏆</div>
        <h4 style="font-size: 16px; font-weight: bold; margin-bottom: 4px;">
          ${badge.name}
        </h4>
        <p style="font-size: 12px; opacity: 0.9;">
          ${badge.description}
        </p>
      </div>
    `;
  }

  // ============================================
  // LIÇÕES
  // ============================================

  async showCategoryLessons(categoryId) {
    try {
      const response = await fetch(`${this.apiUrl}/api/nature/lessons/${categoryId}`, {
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
        overflow-y: auto;
      `;

      modal.innerHTML = `
        <div style="
          background: white;
          border-radius: 24px;
          padding: 40px;
          max-width: 800px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        ">
          <h2 style="font-size: 32px; margin-bottom: 24px; text-align: center;">
            Lições
          </h2>
          <div style="display: grid; gap: 16px;">
            ${data.lessons.map(lesson => `
              <div style="
                background: #f7fafc;
                border-radius: 16px;
                padding: 20px;
                cursor: pointer;
                transition: background 0.2s;
              " onmouseover="this.style.background='#edf2f7'"
                onmouseout="this.style.background='#f7fafc'"
                onclick="natureEducation.startLesson(${lesson.id})">
                <h3 style="font-size: 20px; color: #2d3748; margin-bottom: 8px;">
                  ${lesson.title}
                </h3>
                <p style="font-size: 14px; color: #718096; margin-bottom: 12px;">
                  ${lesson.description || ''}
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="
                    background: #48bb7820;
                    color: #48bb78;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: bold;
                  ">
                    ${lesson.lesson_type === 'choice' ? '❓ Escolhas' : '📖 História'}
                  </span>
                  <span style="font-size: 16px; color: #48bb78; font-weight: bold;">
                    +${lesson.reward_fp} FP
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
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
            margin-top: 20px;
          ">
            Fechar
          </button>
        </div>
      `;

      document.body.appendChild(modal);

    } catch (error) {
      console.error('Erro ao carregar lições:', error);
    }
  }

  async startLesson(lessonId) {
    try {
      const response = await fetch(`${this.apiUrl}/api/nature/lesson/${lessonId}`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      const data = await response.json();

      if (!data.success) return;

      const lesson = data.lesson;

      if (lesson.lesson_type === 'choice') {
        this.showChoiceLesson(lesson);
      } else {
        this.showStoryLesson(lesson);
      }

    } catch (error) {
      console.error('Erro ao iniciar lição:', error);
    }
  }

  showChoiceLesson(lesson) {
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
      <div style="
        background: white;
        border-radius: 24px;
        padding: 40px;
        max-width: 600px;
        width: 90%;
        text-align: center;
      ">
        <h2 style="font-size: 28px; color: #2d3748; margin-bottom: 20px;">
          ${lesson.title}
        </h2>
        <p style="font-size: 18px; color: #4a5568; margin-bottom: 30px;">
          ${lesson.content_text}
        </p>
        <div style="display: grid; gap: 12px;">
          ${lesson.choices.map(choice => `
            <button onclick="natureEducation.selectChoice(${lesson.id}, ${choice.id}, ${choice.is_correct})" style="
              background: ${choice.is_correct ? '#48bb78' : '#e2e8f0'};
              color: ${choice.is_correct ? 'white' : '#2d3748'};
              border: none;
              padding: 20px;
              border-radius: 16px;
              font-size: 16px;
              cursor: pointer;
              text-align: left;
              transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.02)'"
              onmouseout="this.style.transform='scale(1)'">
              ${choice.choice_text}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Remover modal anterior se existir
    const existingModal = document.querySelector('[style*="z-index: 10000"]');
    if (existingModal) existingModal.remove();

    document.body.appendChild(modal);
  }

  async selectChoice(lessonId, choiceId, isCorrect) {
    // Remover modal
    const modal = document.querySelector('[style*="z-index: 10001"]');
    if (modal) modal.remove();

    // Completar lição
    try {
      await fetch(`${this.apiUrl}/api/nature/lesson/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          childId: this.childId,
          lessonId,
          choicesMade: [choiceId]
        })
      });

      this.showFeedback(
        isCorrect ? 'Muito bem! Resposta correta! 🌟' : 'Continue aprendendo! 💚',
        isCorrect ? 'success' : 'info'
      );

    } catch (error) {
      console.error('Erro ao completar lição:', error);
    }
  }

  // ============================================
  // MISSÕES
  // ============================================

  async updateMissionProgress(missionId) {
    try {
      const response = await fetch(`${this.apiUrl}/api/nature/mission/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          childId: this.childId,
          missionId,
          increment: 1
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.completed) {
          this.showFeedback('Missão completada! 🎉', 'success');
        } else {
          this.showFeedback('Progresso registrado! 👍', 'info');
        }

        // Recarregar interface
        this.renderMainInterface('nature-container');
      }

    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
    }
  }

  // ============================================
  // API HELPERS
  // ============================================

  async fetchCategories() {
    const response = await fetch(`${this.apiUrl}/api/nature/categories`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();
    return data.categories || [];
  }

  async fetchActiveMissions() {
    const response = await fetch(`${this.apiUrl}/api/nature/missions/${this.childId}`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();
    return data.missions || [];
  }

  async fetchBadges() {
    const response = await fetch(`${this.apiUrl}/api/nature/badges/${this.childId}`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();
    return data.badges || [];
  }

  // ============================================
  // FEEDBACK
  // ============================================

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
      z-index: 10002;
      animation: slideInRight 0.3s;
    `;
    feedback.textContent = message;

    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.style.animation = 'slideOutRight 0.3s';
      setTimeout(() => document.body.removeChild(feedback), 300);
    }, 3000);
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NatureEducation;
}
