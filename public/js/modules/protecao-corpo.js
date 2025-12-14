// MÓDULO: CUIDANDO DE MIM (Proteção do Corpo)

function getModuloProtecaoCorpo() {
  return `
    <div class="activity-card">
      <h2>💙 Cuidando de Mim</h2>
      <div class="activity-content">
        <p style="font-size: 1.3rem; font-weight: 700; color: #4A90E2;">
          "Você manda no seu corpo!"
        </p>

        <h3>Regras Importantes:</h3>
        <ul>
          <li>✅ O corpo pertence a você</li>
          <li>✅ Ninguém pode tocar sem sua permissão</li>
          <li>✅ Você pode dizer "não"</li>
          <li>✅ Você pode mudar de ideia a qualquer momento</li>
        </ul>

        <h3>Partes Íntimas:</h3>
        <p><strong>Partes íntimas são as partes cobertas pela roupa íntima.</strong></p>
        <ul>
          <li>🚫 Ninguém deve tocar suas partes íntimas</li>
          <li>🚫 Ninguém deve pedir para você mostrar</li>
          <li>✅ Médicos só com responsáveis presentes</li>
          <li>✅ Banho e troca só com pessoas de confiança</li>
        </ul>

        <p style="background: #FFE6E6; padding: 15px; border-radius: 10px; border-left: 4px solid #FF6B6B;">
          <strong>Se alguém quebrar essas regras:</strong><br>
          Você deve contar para um adulto de confiança IMEDIATAMENTE.
        </p>
      </div>
    </div>

    <div class="activity-card" style="background: #E8F4FD;">
      <h3>🔐 Segredos Bons vs. Segredos Ruins</h3>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
        <div style="background: #D4EDDA; padding: 15px; border-radius: 10px;">
          <h4 style="color: #155724;">✅ Segredos BONS</h4>
          <ul style="margin-left: 20px;">
            <li>Surpresa de aniversário</li>
            <li>Presente para alguém</li>
            <li>Brincadeiras felizes</li>
          </ul>
          <p style="font-size: 0.9rem;"><em>Deixam você feliz e serão revelados logo!</em></p>
        </div>

        <div style="background: #FFE6E6; padding: 15px; border-radius: 10px;">
          <h4 style="color: #721C24;">❌ Segredos RUINS</h4>
          <ul style="margin-left: 20px;">
            <li>Segredos que deixam triste</li>
            <li>Segredos que dão medo</li>
            <li>Segredos sobre o corpo</li>
            <li>"Não conte para ninguém nunca"</li>
          </ul>
          <p style="font-size: 0.9rem;"><em>DEVEM ser contados para adulto de confiança!</em></p>
        </div>
      </div>

      <p style="font-size: 1.2rem; font-weight: 700; text-align: center; margin-top: 20px; color: #4A90E2;">
        "Segredo que machuca não é segredo, é pedido de ajuda."
      </p>
    </div>

    <div class="practice-area">
      <h3>Teste seus conhecimentos:</h3>
      <p>Clique nos conceitos que você aprendeu:</p>
      <div class="practice-buttons">
        <button class="practice-btn" onclick="practiceProtection(this)">
          Meu corpo é meu
        </button>
        <button class="practice-btn" onclick="practiceProtection(this)">
          Posso dizer NÃO
        </button>
        <button class="practice-btn" onclick="practiceProtection(this)">
          Segredo ruim devo contar
        </button>
        <button class="practice-btn" onclick="practiceProtection(this)">
          Tenho adultos de confiança
        </button>
        <button class="practice-btn" onclick="practiceProtection(this)">
          Não é minha culpa
        </button>
      </div>
      <div id="practice-protection-feedback"></div>
    </div>

    <div class="activity-card" style="background: #FFF9E6; border: 2px solid #FFB84D;">
      <h3>⭐ Lembre-se Sempre:</h3>
      <ul style="font-size: 1.1rem; line-height: 2;">
        <li>❌ <strong>NÃO é sua culpa</strong> se algo ruim acontecer</li>
        <li>❌ Você <strong>NÃO fez nada errado</strong></li>
        <li>✅ Você está <strong>CERTO</strong> em pedir ajuda</li>
        <li>✅ Adultos de confiança vão te <strong>PROTEGER</strong></li>
      </ul>
    </div>

    <button class="complete-activity-btn" onclick="completeActivity('Aprendeu proteção do corpo', 60)">
      ✅ Entendi! Vou me cuidar!
    </button>
  `;
}

let protectionCount = 0;

function practiceProtection(btn) {
  btn.classList.add('selected');
  btn.disabled = true;
  protectionCount++;

  const feedback = document.getElementById('practice-protection-feedback');

  if (protectionCount >= 4) {
    feedback.innerHTML = '<div class="practice-feedback success">🎉 Excelente! Você entendeu tudo sobre cuidar de si mesmo! Você é muito inteligente!</div>';
  } else {
    feedback.innerHTML = `<div class="practice-feedback info">✨ Continue! Você está aprendendo coisas muito importantes!</div>`;
  }
}
