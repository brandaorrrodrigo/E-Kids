// AUDIO MANAGER - E-KIDS PRO
// Sistema de Text-to-Speech e narração de áudio
// Usa Web Speech API (nativo do browser)

class AudioManager {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.currentAudio = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.useTTSAPI = true; // Usar API TTS em vez de Web Speech
    this.voiceSettings = {
      rate: 0.95,     // Velocidade (0.1 a 10)
      pitch: 1.05,    // Tom levemente mais alto para voz feminina natural (0 a 2)
      volume: 0.9,    // Volume (0 a 1)
      lang: 'pt-BR'   // Idioma
    };

    // Carregar preferências do localStorage
    this.loadSettings();

    // Esperar vozes carregarem (fallback Web Speech)
    this.voices = [];
    this.loadVoices();

    // Event listener para quando vozes estiverem disponíveis
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }

    // Verificar se API TTS está disponível
    this.checkTTSAPI();
  }

  async checkTTSAPI() {
    try {
      const response = await fetch('/api/tts/status');
      const data = await response.json();
      this.useTTSAPI = data.status === 'online';
      console.log('🎤 TTS API Status:', this.useTTSAPI ? 'Online (Piper)' : 'Offline (Web Speech fallback)');
    } catch (error) {
      this.useTTSAPI = false;
      console.log('🎤 TTS API não disponível, usando Web Speech API');
    }
  }

  // ============================================
  // CONFIGURAÇÃO DE VOZES
  // ============================================

  loadVoices() {
    this.voices = this.synth.getVoices();

    // Priorizar voz FEMININA em português do Brasil
    // Nomes comuns de vozes femininas: Maria, Luciana, Francisca (excluída), etc.
    const femaleVoiceNames = ['maria', 'luciana', 'vitoria', 'camila', 'female', 'mulher'];
    const excludedNames = ['francisca']; // Vozes a evitar

    // Filtrar vozes pt-BR
    const ptBRVoices = this.voices.filter(voice =>
      voice.lang === 'pt-BR' || voice.lang === 'pt_BR'
    );

    // Procurar voz feminina pt-BR (excluindo Francisca)
    let selectedVoice = ptBRVoices.find(voice => {
      const nameLower = voice.name.toLowerCase();
      return femaleVoiceNames.some(fem => nameLower.includes(fem)) &&
             !excludedNames.some(excl => nameLower.includes(excl));
    });

    // Se não encontrou feminina pt-BR, pegar qualquer pt-BR
    if (!selectedVoice && ptBRVoices.length > 0) {
      selectedVoice = ptBRVoices[0];
    }

    // Fallback para português genérico
    if (!selectedVoice) {
      const ptVoices = this.voices.filter(voice => voice.lang.startsWith('pt'));
      selectedVoice = ptVoices.find(voice => {
        const nameLower = voice.name.toLowerCase();
        return femaleVoiceNames.some(fem => nameLower.includes(fem)) &&
               !excludedNames.some(excl => nameLower.includes(excl));
      }) || ptVoices[0];
    }

    this.selectedVoice = selectedVoice || this.voices[0];

    console.log('🎤 Vozes disponíveis:', this.voices.length);
    console.log('🎤 Voz selecionada:', this.selectedVoice?.name);
    console.log('🎤 Vozes pt-BR encontradas:', ptBRVoices.map(v => v.name).join(', '));
  }

  getAvailableVoices(lang = 'pt') {
    return this.voices.filter(voice => voice.lang.startsWith(lang));
  }

  setVoice(voiceName) {
    const voice = this.voices.find(v => v.name === voiceName);
    if (voice) {
      this.selectedVoice = voice;
      this.saveSettings();
    }
  }

  // ============================================
  // TEXT-TO-SPEECH PRINCIPAL
  // ============================================

  /**
   * Fala um texto
   * @param {string} text - Texto para falar
   * @param {object} options - Opções adicionais
   */
  async speak(text, options = {}) {
    // Cancelar qualquer fala anterior
    this.stop();

    // Limpar emojis e caracteres especiais
    const cleanText = this.cleanText(text);

    // Usar API TTS (Piper) se disponível
    if (this.useTTSAPI) {
      try {
        await this.speakWithAPI(cleanText, options);
        return;
      } catch (error) {
        console.warn('Erro na API TTS, usando fallback Web Speech:', error);
        this.useTTSAPI = false; // Desabilitar para próximas chamadas
      }
    }

    // Fallback: Web Speech API
    this.speakWithWebSpeech(cleanText, options);
  }

  /**
   * Fala usando API TTS (Piper)
   */
  async speakWithAPI(text, options = {}) {
    const response = await fetch('/api/tts/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    // Receber áudio como blob
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Criar elemento de áudio
    this.currentAudio = new Audio(audioUrl);
    this.currentAudio.volume = options.volume || this.voiceSettings.volume;

    // Event listeners
    this.currentAudio.onplay = () => {
      this.isPlaying = true;
      this.isPaused = false;
      if (options.onStart) options.onStart();
    };

    this.currentAudio.onended = () => {
      this.isPlaying = false;
      this.isPaused = false;
      URL.revokeObjectURL(audioUrl); // Limpar memória
      if (options.onEnd) options.onEnd();
    };

    this.currentAudio.onerror = (event) => {
      console.error('Erro no áudio:', event);
      this.isPlaying = false;
      URL.revokeObjectURL(audioUrl);
      if (options.onError) options.onError(event);
    };

    this.currentAudio.onpause = () => {
      this.isPaused = true;
      if (options.onPause) options.onPause();
    };

    // Reproduzir
    await this.currentAudio.play();
  }

  /**
   * Fala usando Web Speech API (fallback)
   */
  speakWithWebSpeech(text, options = {}) {
    // Criar utterance
    this.currentUtterance = new SpeechSynthesisUtterance(text);

    // Aplicar configurações
    this.currentUtterance.voice = this.selectedVoice;
    this.currentUtterance.rate = options.rate || this.voiceSettings.rate;
    this.currentUtterance.pitch = options.pitch || this.voiceSettings.pitch;
    this.currentUtterance.volume = options.volume || this.voiceSettings.volume;
    this.currentUtterance.lang = options.lang || this.voiceSettings.lang;

    // Event listeners
    this.currentUtterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      if (options.onStart) options.onStart();
    };

    this.currentUtterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      if (options.onEnd) options.onEnd();
    };

    this.currentUtterance.onerror = (event) => {
      console.error('Erro no TTS:', event);
      this.isPlaying = false;
      if (options.onError) options.onError(event);
    };

    this.currentUtterance.onpause = () => {
      this.isPaused = true;
      if (options.onPause) options.onPause();
    };

    this.currentUtterance.onresume = () => {
      this.isPaused = false;
      if (options.onResume) options.onResume();
    };

    // Falar
    this.synth.speak(this.currentUtterance);
  }

  /**
   * Pausa a fala
   */
  pause() {
    if (this.isPlaying && !this.isPaused) {
      if (this.currentAudio) {
        this.currentAudio.pause();
      } else {
        this.synth.pause();
      }
    }
  }

  /**
   * Retoma a fala
   */
  resume() {
    if (this.isPlaying && this.isPaused) {
      if (this.currentAudio) {
        this.currentAudio.play();
      } else {
        this.synth.resume();
      }
    }
  }

  /**
   * Para a fala
   */
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.synth.cancel();
    this.isPlaying = false;
    this.isPaused = false;
  }

  // ============================================
  // NARRAÇÃO ESPECIALIZADA
  // ============================================

  /**
   * Narra mensagem do chatbot
   */
  speakChatMessage(message, context = 'general') {
    // Vozes diferentes por contexto - tom feminino suave e natural
    const contextSettings = {
      general: { rate: 0.95, pitch: 1.05 },
      financial: { rate: 0.9, pitch: 1.0 },
      nature: { rate: 0.95, pitch: 1.08 },
      hygiene: { rate: 0.95, pitch: 1.05 },
      tutor: { rate: 0.9, pitch: 1.0 }
    };

    this.speak(message, contextSettings[context] || contextSettings.general);
  }

  /**
   * Narra extrato mensal completo
   */
  speakMonthlyStatement(statement) {
    const narration = `
      Olá! Aqui está seu extrato de ${this.getMonthName(statement.month)}!

      Você ganhou ${statement.fp_earned} pontos de esforço este mês.
      Guardou ${statement.fp_saved} pontos no cofrinho.
      Usou ${statement.fp_spent} pontos.

      Isso significa que você guardou ${statement.savings_percentage} por cento do que ganhou!
      ${this.getSavingsComment(statement.savings_percentage)}

      Seu saldo total agora é ${statement.total_fp} pontos!
      Continue assim!
    `;

    this.speak(narration, {
      rate: 0.85,
      pitch: 1.0,
      onEnd: () => {
        console.log('Narração do extrato concluída');
      }
    });
  }

  /**
   * Narra conquista de badge
   */
  speakBadgeUnlock(badgeName, description) {
    const narration = `
      Parabéns! Você desbloqueou a conquista ${badgeName}!
      ${description}
      Continue assim!
    `;

    this.speak(narration, {
      rate: 0.9,
      pitch: 1.2,
      volume: 1.0
    });
  }

  /**
   * Narra completar missão
   */
  speakMissionComplete(missionTitle, reward) {
    const narration = `
      Missão concluída! ${missionTitle}.
      Você ganhou ${reward} pontos de esforço!
      Incrível!
    `;

    this.speak(narration, {
      rate: 0.9,
      pitch: 1.15
    });
  }

  /**
   * Narra lição de natureza
   */
  speakNatureLesson(lesson) {
    const narration = `
      ${lesson.title}.
      ${lesson.content_text}
    `;

    this.speak(narration, {
      rate: 0.85,
      pitch: 1.1
    });
  }

  /**
   * Feedback de escolha
   */
  speakChoiceFeedback(explanation, isCorrect) {
    const prefix = isCorrect ? 'Muito bem!' : 'Quase lá!';

    this.speak(`${prefix} ${explanation}`, {
      rate: 0.9,
      pitch: isCorrect ? 1.2 : 1.0
    });
  }

  // ============================================
  // UTILITÁRIOS
  // ============================================

  cleanText(text) {
    return text
      // Remover emojis
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      // Remover símbolos especiais
      .replace(/[*_~`]/g, '')
      // Limpar espaços extras
      .replace(/\s+/g, ' ')
      .trim();
  }

  getMonthName(month) {
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    return months[month - 1] || 'desconhecido';
  }

  getSavingsComment(percentage) {
    if (percentage >= 80) {
      return 'Você é um super poupador!';
    } else if (percentage >= 50) {
      return 'Muito bom! Continue guardando!';
    } else if (percentage >= 20) {
      return 'Bom começo! Tente guardar um pouco mais!';
    } else {
      return 'Que tal tentar guardar mais no próximo mês?';
    }
  }

  // ============================================
  // CONFIGURAÇÕES
  // ============================================

  updateSettings(settings) {
    this.voiceSettings = {
      ...this.voiceSettings,
      ...settings
    };
    this.saveSettings();
  }

  saveSettings() {
    localStorage.setItem('ekids-audio-settings', JSON.stringify({
      ...this.voiceSettings,
      voiceName: this.selectedVoice?.name
    }));
  }

  loadSettings() {
    const saved = localStorage.getItem('ekids-audio-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        this.voiceSettings = {
          rate: settings.rate || 0.9,
          pitch: settings.pitch || 1.1,
          volume: settings.volume || 1.0,
          lang: settings.lang || 'pt-BR'
        };
      } catch (e) {
        console.error('Erro ao carregar configurações de áudio:', e);
      }
    }
  }

  // ============================================
  // CONTROLES DE UI
  // ============================================

  /**
   * Renderiza botão de áudio para uma mensagem
   */
  createAudioButton(text, context = 'general') {
    const button = document.createElement('button');
    button.className = 'audio-btn';
    button.innerHTML = '🔊';
    button.title = 'Ouvir mensagem';

    button.style.cssText = `
      background: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 4px 8px;
      opacity: 0.6;
      transition: opacity 0.2s;
    `;

    button.onmouseover = () => button.style.opacity = '1';
    button.onmouseout = () => button.style.opacity = '0.6';

    button.onclick = (e) => {
      e.stopPropagation();

      if (this.isPlaying) {
        this.stop();
        button.innerHTML = '🔊';
      } else {
        this.speakChatMessage(text, context);
        button.innerHTML = '⏸️';
      }
    };

    return button;
  }

  /**
   * Renderiza painel de controle de áudio
   */
  renderAudioControls(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div style="
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      ">
        <h3 style="margin: 0 0 16px 0;">🔊 Configurações de Áudio</h3>

        <!-- Velocidade -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px;">
            Velocidade: <span id="rate-value">${this.voiceSettings.rate}</span>x
          </label>
          <input
            type="range"
            id="rate-slider"
            min="0.5"
            max="2"
            step="0.1"
            value="${this.voiceSettings.rate}"
            style="width: 100%;"
          />
        </div>

        <!-- Tom -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px;">
            Tom: <span id="pitch-value">${this.voiceSettings.pitch}</span>
          </label>
          <input
            type="range"
            id="pitch-slider"
            min="0.5"
            max="2"
            step="0.1"
            value="${this.voiceSettings.pitch}"
            style="width: 100%;"
          />
        </div>

        <!-- Volume -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px;">
            Volume: <span id="volume-value">${Math.round(this.voiceSettings.volume * 100)}%</span>
          </label>
          <input
            type="range"
            id="volume-slider"
            min="0"
            max="1"
            step="0.1"
            value="${this.voiceSettings.volume}"
            style="width: 100%;"
          />
        </div>

        <!-- Teste -->
        <button
          id="test-audio-btn"
          style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            width: 100%;
            font-size: 16px;
          "
        >
          🎵 Testar Voz
        </button>
      </div>
    `;

    // Event listeners
    document.getElementById('rate-slider').addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.voiceSettings.rate = value;
      document.getElementById('rate-value').textContent = value;
      this.saveSettings();
    });

    document.getElementById('pitch-slider').addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.voiceSettings.pitch = value;
      document.getElementById('pitch-value').textContent = value;
      this.saveSettings();
    });

    document.getElementById('volume-slider').addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.voiceSettings.volume = value;
      document.getElementById('volume-value').textContent = Math.round(value * 100);
      this.saveSettings();
    });

    document.getElementById('test-audio-btn').addEventListener('click', () => {
      this.speak('Olá! Eu sou o mascote do E-Kids PRO! Estou aqui para te ajudar a aprender e se divertir!');
    });
  }

  // ============================================
  // VERIFICAÇÕES
  // ============================================

  isSupported() {
    return 'speechSynthesis' in window;
  }

  getStatus() {
    return {
      supported: this.isSupported(),
      playing: this.isPlaying,
      paused: this.isPaused,
      voicesCount: this.voices.length,
      selectedVoice: this.selectedVoice?.name || 'Nenhuma',
      settings: this.voiceSettings
    };
  }
}

// Criar instância global
window.audioManager = new AudioManager();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AudioManager;
}
