// MÓDULO: MINHAS EMOÇÕES

function getModuloEmocoes() {
  return `
    <div class="activity-card">
      <h2>😊 Minhas Emoções</h2>
      <div class="activity-content">
        <p><strong>Todos temos emoções! Elas são normais e importantes.</strong></p>
        <p>Vamos aprender a reconhecer, nomear e expressar nossos sentimentos de forma saudável!</p>
      </div>
    </div>

    <div class="activity-card" style="background: linear-gradient(135deg, #FFF9E6 0%, #FFE6F0 100%);">
      <h3>As 6 Emoções Básicas:</h3>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
        <div style="text-align: center; padding: 20px; background: white; border-radius: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="font-size: 4rem;">😊</div>
          <h4 style="color: #4A90E2;">Felicidade</h4>
          <p style="font-size: 0.9rem;">Quando algo bom acontece!</p>
        </div>

        <div style="text-align: center; padding: 20px; background: white; border-radius: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="font-size: 4rem;">😢</div>
          <h4 style="color: #7B68EE;">Tristeza</h4>
          <p style="font-size: 0.9rem;">Quando perdemos algo ou alguém.</p>
        </div>

        <div style="text-align: center; padding: 20px; background: white; border-radius: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="font-size: 4rem;">😠</div>
          <h4 style="color: #FF6B6B;">Raiva</h4>
          <p style="font-size: 0.9rem;">Quando algo injusto acontece.</p>
        </div>

        <div style="text-align: center; padding: 20px; background: white; border-radius: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="font-size: 4rem;">😰</div>
          <h4 style="color: #FFB84D;">Medo</h4>
          <p style="font-size: 0.9rem;">Quando sentimos perigo.</p>
        </div>

        <div style="text-align: center; padding: 20px; background: white; border-radius: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="font-size: 4rem;">😳</div>
          <h4 style="color: #50C878;">Surpresa</h4>
          <p style="font-size: 0.9rem;">Quando algo inesperado acontece!</p>
        </div>

        <div style="text-align: center; padding: 20px; background: white; border-radius: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="font-size: 4rem;">🤢</div>
          <h4 style="color: #9B59B6;">Nojo</h4>
          <p style="font-size: 0.9rem;">Quando algo nos incomoda muito.</p>
        </div>
      </div>
    </div>

    <div class="activity-card">
      <h3>💡 O que fazer com cada emoção?</h3>

      <div style="background: #E8F4FD; padding: 15px; border-radius: 10px; margin: 10px 0;">
        <h4>😊 Quando estou FELIZ:</h4>
        <p>✅ Sorria! ✅ Compartilhe com quem você ama ✅ Aproveite o momento!</p>
      </div>

      <div style="background: #F0E6FF; padding: 15px; border-radius: 10px; margin: 10px 0;">
        <h4>😢 Quando estou TRISTE:</h4>
        <p>✅ Chore se precisar ✅ Fale com alguém de confiança ✅ Peça um abraço</p>
      </div>

      <div style="background: #FFE6E6; padding: 15px; border-radius: 10px; margin: 10px 0;">
        <h4>😠 Quando estou com RAIVA:</h4>
        <p>✅ Respire fundo ✅ Conte até 10 ✅ Fale sobre o que te deixou bravo</p>
        <p><strong>❌ NÃO:</strong> Bater, gritar ou machucar</p>
      </div>

      <div style="background: #FFF9E6; padding: 15px; border-radius: 10px; margin: 10px 0;">
        <h4>😰 Quando estou com MEDO:</h4>
        <p>✅ Conte para um adulto de confiança ✅ Peça ajuda ✅ Lembre-se: você está seguro!</p>
      </div>
    </div>

    <div class="practice-area">
      <h3>Pratique: Como você expressaria cada emoção?</h3>
      <p>Clique para praticar:</p>
      <div class="practice-buttons">
        <button class="practice-btn" onclick="practiceEmotion(this, 'feliz')">
          😊 Estou feliz!
        </button>
        <button class="practice-btn" onclick="practiceEmotion(this, 'triste')">
          😢 Estou triste...
        </button>
        <button class="practice-btn" onclick="practiceEmotion(this, 'raiva')">
          😠 Estou com raiva!
        </button>
        <button class="practice-btn" onclick="practiceEmotion(this, 'medo')">
          😰 Estou com medo...
        </button>
      </div>
      <div id="practice-emotion-feedback"></div>
    </div>

    <div class="activity-card" style="background: #E8F4FD; border: 2px solid #4A90E2;">
      <h3>⭐ Lembre-se:</h3>
      <ul style="font-size: 1.1rem; line-height: 2;">
        <li>✅ <strong>Todas as emoções são válidas!</strong></li>
        <li>✅ Não existe emoção "errada"</li>
        <li>✅ Você pode falar sobre seus sentimentos</li>
        <li>✅ Adultos de confiança querem te ajudar</li>
      </ul>
    </div>

    <button class="complete-activity-btn" onclick="completeActivity('Aprendeu sobre emoções', 60)">
      ✅ Entendi minhas emoções!
    </button>
  `;
}

let emotionCount = 0;
const emotionResponses = {
  feliz: "😊 Que maravilha! Ficar feliz é ótimo! Continue aproveitando!",
  triste: "😢 Está tudo bem ficar triste às vezes. Quer conversar com um adulto de confiança?",
  raiva: "😠 Raiva é normal, mas vamos respirar fundo juntos! Conte até 10...",
  medo: "😰 Quando temos medo, podemos pedir ajuda. Você está seguro(a)!"
};

function practiceEmotion(btn, emotion) {
  btn.classList.add('selected');
  emotionCount++;

  const feedback = document.getElementById('practice-emotion-feedback');
  const response = emotionResponses[emotion];

  feedback.innerHTML = `<div class="practice-feedback info">${response}</div>`;

  if (emotionCount >= 3) {
    setTimeout(() => {
      feedback.innerHTML = '<div class="practice-feedback success">🎉 Você está aprendendo a entender e expressar suas emoções! Muito bem!</div>';
    }, 2000);
  }
}
