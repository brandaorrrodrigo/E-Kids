// MÓDULO: MEUJEITO, MEUS LIMITES (Dizer Não)

function getModuloDizerNao() {
  return `
    <div class="activity-card">
      <h2>🛡️ Meu Jeito, Meus Limites</h2>
      <div class="activity-content">
        <p><strong>"Dizer NÃO também é uma forma de cuidado."</strong></p>

        <h3>Quando você pode dizer não?</h3>
        <ul>
          <li>🚫 Quando algo te deixa desconfortável</li>
          <li>🚫 Quando não quer brincar de algo</li>
          <li>🚫 Quando está cansado(a)</li>
          <li>🚫 Quando alguém pede algo estranho</li>
          <li>🚫 Quando sente medo ou confusão</li>
          <li>🚫 Quando não quer abraçar ou beijar</li>
        </ul>

        <p><strong>Lembre-se:</strong> O corpo e o sentimento também dizem não!</p>
      </div>
    </div>

    <div class="story-section">
      <h2>📖 História do Mascote Corajoso</h2>
      <div class="story-content">
        <div class="story-character">🦊</div>
        <div class="story-bubble">
          <p>Era uma vez um pequeno mascote que sempre dizia sim para tudo. Ele ficava muito cansado e triste porque não sabia dizer não.</p>
        </div>
        <div class="story-bubble">
          <p>Um dia, um amigo sábio ensinou: "Você pode dizer não quando algo não está certo para você. Isso não é ser mal-educado, é se cuidar!"</p>
        </div>
        <div class="story-bubble">
          <p>O mascote aprendeu a dizer não de forma respeitosa. Seus amigos continuaram gostando dele, e ele ficou muito mais feliz!</p>
        </div>
        <p style="text-align: center; font-size: 1.2rem; margin-top: 20px;">
          <strong>Moral:</strong> Dizer não quando necessário é saudável e importante! 💪
        </p>
      </div>
    </div>

    <div class="practice-area">
      <h3>Vamos Praticar Dizer Não!</h3>
      <p>Clique nas frases que você pode usar para dizer não de forma respeitosa:</p>
      <div class="practice-buttons">
        <button class="practice-btn" onclick="practiceSayNo(this, 'Não, obrigado(a)')">
          "Não, obrigado(a)"
        </button>
        <button class="practice-btn" onclick="practiceSayNo(this, 'Eu não quero agora')">
          "Eu não quero agora"
        </button>
        <button class="practice-btn" onclick="practiceSayNo(this, 'Isso me deixa desconfortável')">
          "Isso me deixa desconfortável"
        </button>
        <button class="practice-btn" onclick="practiceSayNo(this, 'Prefiro não fazer isso')">
          "Prefiro não fazer isso"
        </button>
        <button class="practice-btn" onclick="practiceSayNo(this, 'Vou chamar um adulto')">
          "Vou chamar um adulto"
        </button>
        <button class="practice-btn" onclick="practiceSayNo(this, 'Meu corpo não gosta disso')">
          "Meu corpo não gosta disso"
        </button>
      </div>
      <div id="practice-feedback"></div>
    </div>

    <button class="complete-activity-btn" onclick="completeActivity('Aprendeu a dizer não', 60)">
      ✅ Entendi! Eu posso dizer não!
    </button>
  `;
}

let practiceCount = 0;

function practiceSayNo(btn, phrase) {
  btn.classList.add('selected');
  btn.disabled = true;
  practiceCount++;

  const feedback = document.getElementById('practice-feedback');

  if (practiceCount >= 3) {
    feedback.innerHTML = '<div class="practice-feedback success">🎉 Muito bem! Você aprendeu várias formas de dizer não com respeito!</div>';
  } else {
    feedback.innerHTML = `<div class="practice-feedback info">✨ Ótimo! Clique em mais frases para praticar!</div>`;
  }
}
