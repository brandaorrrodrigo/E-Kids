// CHATBOT - Frontend E-KIDS PRO
// Interface de chat com mascote interativo

class Chatbot {
  constructor(apiUrl, token, childId) {
    this.apiUrl = apiUrl;
    this.token = token;
    this.childId = childId;
    this.conversationId = null;
    this.contextType = 'general';
    this.isTyping = false;
  }

  // ============================================
  // INICIALIZAÇÃO
  // ============================================

  /**
   * Renderiza interface do chat
   */
  async render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Criar estrutura do chat
    container.innerHTML = `
      <div id="chat-container" style="
        display: flex;
        flex-direction: column;
        height: 600px;
        max-width: 500px;
        margin: 0 auto;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      ">
        <!-- Header -->
        <div style="
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        ">
          <div id="mascot-avatar" style="
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: bounce 2s infinite;
          ">
            👧
          </div>
          <div style="flex: 1;">
            <h3 style="color: white; margin: 0; font-size: 20px;">Lu - Sua Assistente</h3>
            <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0 0; font-size: 14px;" id="chat-status">
              Online e pronta para ajudar! 💜
            </p>
          </div>
          <button onclick="chatbot.toggleChat()" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
          ">✕</button>
        </div>

        <!-- Messages Area -->
        <div id="chat-messages" style="
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        "></div>

        <!-- Suggestions -->
        <div id="chat-suggestions" style="
          padding: 0 20px 16px 20px;
          display: flex;
          gap: 8px;
          overflow-x: auto;
        "></div>

        <!-- Input Area -->
        <div style="
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-top: 1px solid rgba(255,255,255,0.2);
        ">
          <div style="
            display: flex;
            gap: 12px;
            background: white;
            border-radius: 24px;
            padding: 12px 20px;
          ">
            <input
              type="text"
              id="chat-input"
              placeholder="Digite sua mensagem..."
              style="
                flex: 1;
                border: none;
                outline: none;
                font-size: 16px;
                background: transparent;
              "
            />
            <button onclick="chatbot.sendMessage()" style="
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border: none;
              color: white;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              cursor: pointer;
              font-size: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.1)'"
              onmouseout="this.style.transform='scale(1)'">
              ➤
            </button>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });

    // Carregar mensagem de boas-vindas
    await this.loadWelcome();

    // Carregar sugestões
    await this.loadSuggestions();
  }

  /**
   * Renderiza botão flutuante do chat
   */
  renderFloatingButton(containerId) {
    let container = document.getElementById(containerId);

    // Se não houver container especificado, criar na raiz do body
    if (!container) {
      container = document.body;
    }

    // Criar botão flutuante
    const btn = document.createElement('div');
    btn.id = 'chat-floating-btn';
    btn.onclick = () => this.toggleChat();
    btn.style.cssText = `
      width: 90px;
      height: 90px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
      transition: transform 0.3s;
      animation: pulse 2s infinite;
    `;
    btn.innerHTML = '<div style="display: flex; flex-direction: column; align-items: center; gap: 4px;"><div style="font-size: 32px;">👧</div><div style="font-size: 10px; font-weight: bold; color: white;">Fale com a Lu</div></div>';
    btn.onmouseenter = () => btn.style.transform = 'scale(1.1)';
    btn.onmouseleave = () => btn.style.transform = 'scale(1)';
    container.appendChild(btn);
  }

  toggleChat() {
    const chatContainer = document.getElementById('chat-container');
    const chatbotWrapper = document.getElementById('chatbot-container');

    if (chatContainer) {
      const isHidden = chatContainer.style.display === 'none';
      chatContainer.style.display = isHidden ? 'flex' : 'none';

      // Também mostrar/esconder o wrapper
      if (chatbotWrapper) {
        chatbotWrapper.style.display = isHidden ? 'block' : 'none';
      }
    }
  }

  // ============================================
  // MENSAGENS
  // ============================================

  async sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message || this.isTyping) return;

    // Limpar input
    input.value = '';

    // Adicionar mensagem do usuário
    this.addMessage('user', message);

    // Mostrar typing indicator
    this.showTypingIndicator();

    try {
      const url = `${this.apiUrl}/api/chat`;

      // Enviar para API
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          childId: this.childId,
          message,
          contextType: this.contextType,
          conversationId: this.conversationId
        })
      });

      const data = await response.json();

      // Remover typing indicator
      this.hideTypingIndicator();

      if (data.success) {
        // Salvar conversation ID
        if (data.conversationId) {
          this.conversationId = data.conversationId;
        }

        // Adicionar resposta do mascote
        this.addMessage('assistant', data.message);

        // Recarregar sugestões
        await this.loadSuggestions();
      } else {
        console.error('Erro na resposta:', data.error);
        this.addMessage('assistant', `Ops! ${data.error || 'Erro desconhecido'} 😅`);
      }

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      this.hideTypingIndicator();
      this.addMessage('assistant', 'Ops! A Lu teve um probleminha. Tenta de novo? 😅');
    }
  }

  addMessage(role, content) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;

    const isUser = role === 'user';

    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      display: flex;
      ${isUser ? 'justify-content: flex-end' : 'justify-content: flex-start'};
      animation: slideIn 0.3s;
    `;

    const messageId = 'msg-' + Date.now();

    messageDiv.innerHTML = `
      <div style="
        max-width: 75%;
        padding: 16px 20px;
        border-radius: ${isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px'};
        background: ${isUser ? 'white' : 'rgba(255,255,255,0.95)'};
        color: ${isUser ? '#2d3748' : '#2d3748'};
        font-size: 16px;
        line-height: 1.5;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        ${isUser ? '' : 'border-left: 4px solid #667eea;'}
        position: relative;
      ">
        ${this.formatMessage(content)}
        ${!isUser ? `
          <button
            id="${messageId}"
            style="
              position: absolute;
              top: 8px;
              right: 8px;
              background: transparent;
              border: none;
              font-size: 18px;
              cursor: pointer;
              opacity: 0.6;
              transition: opacity 0.2s, transform 0.2s;
              padding: 4px;
            "
            onmouseover="this.style.opacity='1'; this.style.transform='scale(1.1)'"
            onmouseout="this.style.opacity='0.6'; this.style.transform='scale(1)'"
            title="Ouvir mensagem"
          >🔊</button>
        ` : ''}
      </div>
    `;

    messagesContainer.appendChild(messageDiv);

    // Adicionar evento de áudio para mensagens do assistente
    if (!isUser && window.audioManager) {
      const audioBtn = document.getElementById(messageId);
      if (audioBtn) {
        audioBtn.onclick = () => {
          if (window.audioManager.isPlaying) {
            window.audioManager.stop();
            audioBtn.innerHTML = '🔊';
          } else {
            window.audioManager.speakChatMessage(content, this.contextType);
            audioBtn.innerHTML = '⏸️';
          }
        };

        // Auto-play se configurado
        const autoPlay = localStorage.getItem('ekids-chat-autoplay') === 'true';
        if (autoPlay) {
          setTimeout(() => {
            window.audioManager.speakChatMessage(content, this.contextType);
            audioBtn.innerHTML = '⏸️';
          }, 300);
        }
      }
    }

    // Scroll para o final
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  formatMessage(content) {
    // Converter emojis e formatação básica
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  showTypingIndicator() {
    this.isTyping = true;

    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;

    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.style.cssText = `
      display: flex;
      justify-content: flex-start;
      animation: slideIn 0.3s;
    `;

    typingDiv.innerHTML = `
      <div style="
        padding: 16px 20px;
        border-radius: 20px 20px 20px 4px;
        background: rgba(255,255,255,0.95);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border-left: 4px solid #667eea;
      ">
        <div style="display: flex; gap: 6px;">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTypingIndicator() {
    this.isTyping = false;
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // ============================================
  // SUGESTÕES
  // ============================================

  async loadSuggestions() {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/chat/suggestions?childId=${this.childId}&contextType=${this.contextType}`,
        {
          headers: { 'Authorization': `Bearer ${this.token}` }
        }
      );

      const data = await response.json();

      if (data.success && data.suggestions) {
        this.renderSuggestions(data.suggestions);
      }

    } catch (error) {
      console.error('Erro ao carregar sugestões:', error);
    }
  }

  renderSuggestions(suggestions) {
    const container = document.getElementById('chat-suggestions');
    if (!container) return;

    container.innerHTML = suggestions.map(suggestion => `
      <button onclick="chatbot.useSuggestion('${suggestion.replace(/'/g, "\\'")}')" style="
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        padding: 10px 16px;
        border-radius: 20px;
        font-size: 14px;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s;
      " onmouseover="this.style.background='rgba(255,255,255,0.3)'"
        onmouseout="this.style.background='rgba(255,255,255,0.2)'">
        ${suggestion}
      </button>
    `).join('');
  }

  useSuggestion(suggestion) {
    const input = document.getElementById('chat-input');
    if (input) {
      input.value = suggestion;
      input.focus();
    }
  }

  // ============================================
  // BOAS-VINDAS
  // ============================================

  async loadWelcome() {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/chat/welcome?childId=${this.childId}&contextType=${this.contextType}`,
        {
          headers: { 'Authorization': `Bearer ${this.token}` }
        }
      );

      const data = await response.json();

      if (data.success) {
        this.addMessage('assistant', data.welcome);
      }

    } catch (error) {
      console.error('Erro ao carregar boas-vindas:', error);
      this.addMessage('assistant', 'Oi! Eu sou a Lu, sua assistente no E-Kids! Estou aqui para te ajudar! 😊💜');
    }
  }

  // ============================================
  // CONTEXTO
  // ============================================

  setContext(contextType) {
    this.contextType = contextType;
    this.conversationId = null; // Iniciar nova conversa

    // Atualizar avatar da Lu
    const avatarEmojis = {
      general: '👧',
      financial: '💰',
      nature: '🌱',
      hygiene: '🧼',
      tutor: '📚'
    };

    const avatar = document.getElementById('mascot-avatar');
    if (avatar) {
      avatar.textContent = avatarEmojis[contextType] || '👧';
    }

    // Limpar mensagens
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) {
      messagesContainer.innerHTML = '';
    }

    // Carregar nova mensagem de boas-vindas
    this.loadWelcome();
    this.loadSuggestions();
  }

  // ============================================
  // VERIFICAR SAÚDE
  // ============================================

  async checkHealth() {
    try {
      const response = await fetch(`${this.apiUrl}/api/chat/health`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      const data = await response.json();

      const statusEl = document.getElementById('chat-status');
      if (statusEl) {
        if (data.online && data.modelAvailable) {
          statusEl.textContent = 'Online • Ollama';
          statusEl.style.color = 'rgba(72, 187, 120, 1)';
        } else if (data.online && !data.modelAvailable) {
          statusEl.textContent = 'Offline • Modelo não encontrado';
          statusEl.style.color = 'rgba(237, 137, 54, 1)';
        } else {
          statusEl.textContent = 'Offline • Modo básico';
          statusEl.style.color = 'rgba(255, 255, 255, 0.6)';
        }
      }

      return data;

    } catch (error) {
      console.error('Erro ao verificar saúde:', error);
      return { online: false };
    }
  }
}

// CSS Animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4); }
    50% { box-shadow: 0 8px 32px rgba(102, 126, 234, 0.6); }
  }

  .typing-dot {
    width: 8px;
    height: 8px;
    background: #667eea;
    border-radius: 50%;
    animation: typing 1.4s infinite;
  }

  .typing-dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.7;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }

  #chat-messages::-webkit-scrollbar {
    width: 8px;
  }

  #chat-messages::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
  }

  #chat-messages::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.3);
    border-radius: 4px;
  }

  #chat-messages::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.4);
  }

  #chat-suggestions::-webkit-scrollbar {
    height: 6px;
  }

  #chat-suggestions::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.1);
    border-radius: 3px;
  }

  #chat-suggestions::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.3);
    border-radius: 3px;
  }
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Chatbot;
}
