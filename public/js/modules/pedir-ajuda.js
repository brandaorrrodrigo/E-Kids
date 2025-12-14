// MÓDULO: POSSO PEDIR AJUDA

function getModuloPedirAjuda() {
  return `
    <div class="activity-card">
      <h2>🤝 Posso Pedir Ajuda</h2>
      <div class="activity-content">
        <p><strong>"Pedir ajuda é um sinal de FORÇA, não de fraqueza."</strong></p>

        <h3>Quando você deve pedir ajuda?</h3>
        <ul>
          <li>🆘 Quando algo é difícil demais</li>
          <li>🆘 Quando sente medo</li>
          <li>🆘 Quando está confuso(a)</li>
          <li>🆘 Quando está triste</li>
          <li>🆘 Quando algo parece errado</li>
          <li>🆘 Quando alguém não respeita seus limites</li>
        </ul>

        <p><strong>Lembre-se:</strong> Se algo pesa no coração, é hora de pedir ajuda!</p>
      </div>
    </div>

    <div class="story-section">
      <h2>📖 História do Coelho Corajoso</h2>
      <div class="story-content">
        <div class="story-character">🐰</div>
        <div class="story-bubble">
          <p>Um pequeno coelho tentava resolver tudo sozinho. Ele carregava pedras pesadas e ficava muito cansado.</p>
        </div>
        <div class="story-bubble">
          <p>Um dia, ele pediu ajuda para sua família. Juntos, eles conseguiram carregar as pedras facilmente!</p>
        </div>
        <div class="story-bubble">
          <p>O coelho aprendeu: "Pedir ajuda não me torna fraco. Na verdade, me torna mais forte porque aprendo com os outros!"</p>
        </div>
        <p style="text-align: center; font-size: 1.2rem; margin-top: 20px;">
          <strong>Moral:</strong> Pedir ajuda é coragem, não fraqueza! 💪
        </p>
      </div>
    </div>

    <div class="practice-area">
      <h3>Como Pedir Ajuda?</h3>
      <p>Pratique essas frases:</p>
      <div class="practice-buttons">
        <button class="practice-btn" onclick="practiceAskHelp(this, 'Eu preciso de ajuda')">
          "Eu preciso de ajuda"
        </button>
        <button class="practice-btn" onclick="practiceAskHelp(this, 'Isso está difícil')">
          "Isso está difícil para mim"
        </button>
        <button class="practice-btn" onclick="practiceAskHelp(this, 'Estou com medo')">
          "Estou com medo"
        </button>
        <button class="practice-btn" onclick="practiceAskHelp(this, 'Posso falar com você')">
          "Posso falar com você sobre algo importante?"
        </button>
        <button class="practice-btn" onclick="practiceAskHelp(this, 'Aconteceu algo')">
          "Aconteceu algo que me deixou desconfortável"
        </button>
      </div>
      <div id="practice-help-feedback"></div>
    </div>

    <div class="activity-card" style="background: #FFF9E6; border: 2px solid #FFB84D;">
      <h3>💡 Importante!</h3>
      <p>Se você contar para um adulto e ele não acreditar, <strong>conte para OUTRO adulto</strong> da sua lista de confiança.</p>
      <p><strong>Continue falando até alguém te escutar e ajudar.</strong></p>
      <p style="font-size: 1.1rem; margin-top: 10px;">✨ Você merece ser ouvido(a)!</p>
    </div>

    <button class="complete-activity-btn" onclick="completeActivity('Aprendeu a pedir ajuda', 60)">
      ✅ Entendi! Eu posso pedir ajuda!
    </button>
  `;
}

let helpCount = 0;

function practiceAskHelp(btn, phrase) {
  btn.classList.add('selected');
  btn.disabled = true;
  helpCount++;

  const feedback = document.getElementById('practice-help-feedback');

  if (helpCount >= 3) {
    feedback.innerHTML = '<div class="practice-feedback success">🎉 Perfeito! Você sabe como pedir ajuda!</div>';
  } else {
    feedback.innerHTML = `<div class="practice-feedback info">✨ Continue praticando!</div>`;
  }
}
