// SOUND EFFECTS MANAGER - E-KIDS PRO
// Sistema de efeitos sonoros usando Web Audio API

class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.volume = 0.3; // Volume padrão (0 a 1)

    // Carregar preferências do localStorage
    this.loadSettings();

    // Inicializar AudioContext quando necessário (evita warning do Chrome)
    this.initAudioContext();
  }

  initAudioContext() {
    // Criar AudioContext apenas quando necessário
    // Isso evita o warning do Chrome sobre autoplay
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API não suportada', e);
        this.enabled = false;
      }
    }
  }

  // ============================================
  // CONFIGURAÇÕES
  // ============================================

  loadSettings() {
    const settings = localStorage.getItem('ekids_sfx_settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      this.enabled = parsed.enabled !== false;
      this.volume = parsed.volume || 0.3;
    }
  }

  saveSettings() {
    localStorage.setItem('ekids_sfx_settings', JSON.stringify({
      enabled: this.enabled,
      volume: this.volume
    }));
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    this.saveSettings();
  }

  toggle() {
    this.enabled = !this.enabled;
    this.saveSettings();
    return this.enabled;
  }

  // ============================================
  // GERADOR DE SONS
  // ============================================

  playTone(frequency, duration, type = 'sine') {
    if (!this.enabled || !this.audioContext) return;

    try {
      // Resume context se estiver suspenso
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.warn('Erro ao tocar som:', e);
    }
  }

  // ============================================
  // EFEITOS ESPECÍFICOS
  // ============================================

  // Som de moeda (tiling de frequências ascendentes)
  playCoin() {
    if (!this.enabled) return;

    this.initAudioContext();

    // Sequência rápida de tons que simula uma moeda
    const notes = [
      { freq: 988, duration: 0.05 },   // B5
      { freq: 1318, duration: 0.05 },  // E6
      { freq: 1568, duration: 0.1 }    // G6
    ];

    notes.forEach((note, i) => {
      setTimeout(() => {
        this.playTone(note.freq, note.duration, 'sine');
      }, i * 40);
    });
  }

  // Som de sucesso (arpejo ascendente)
  playSuccess() {
    if (!this.enabled) return;

    this.initAudioContext();

    const notes = [
      { freq: 523, duration: 0.1 },   // C5
      { freq: 659, duration: 0.1 },   // E5
      { freq: 784, duration: 0.2 }    // G5
    ];

    notes.forEach((note, i) => {
      setTimeout(() => {
        this.playTone(note.freq, note.duration, 'triangle');
      }, i * 80);
    });
  }

  // Som de erro (tom descendente)
  playError() {
    if (!this.enabled) return;

    this.initAudioContext();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);

    gainNode.gain.setValueAtTime(this.volume * 0.5, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // Som de clique/tap
  playClick() {
    if (!this.enabled) return;

    this.initAudioContext();
    this.playTone(800, 0.05, 'square');
  }

  // Som de notificação
  playNotification() {
    if (!this.enabled) return;

    this.initAudioContext();

    const notes = [
      { freq: 880, duration: 0.1 },   // A5
      { freq: 1108, duration: 0.15 }  // C#6
    ];

    notes.forEach((note, i) => {
      setTimeout(() => {
        this.playTone(note.freq, note.duration, 'sine');
      }, i * 100);
    });
  }

  // Som de level up (fanfarra)
  playLevelUp() {
    if (!this.enabled) return;

    this.initAudioContext();

    const notes = [
      { freq: 523, duration: 0.15 },   // C5
      { freq: 659, duration: 0.15 },   // E5
      { freq: 784, duration: 0.15 },   // G5
      { freq: 1046, duration: 0.3 }    // C6
    ];

    notes.forEach((note, i) => {
      setTimeout(() => {
        this.playTone(note.freq, note.duration, 'triangle');
      }, i * 120);
    });
  }

  // Som de unlock (desbloqueio)
  playUnlock() {
    if (!this.enabled) return;

    this.initAudioContext();

    // Tom que sobe rapidamente
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(this.volume * 0.6, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }
}

// Instância global
window.soundEffects = new SoundEffects();
