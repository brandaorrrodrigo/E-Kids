// MÓDULO: DESAFIOS POSITIVOS

function getModuloDesafios() {
  return `
    <div class="activity-card">
      <h2>⭐ Desafios Positivos</h2>
      <div class="activity-content">
        <p><strong>Vamos fortalecer sua autoconfiança e habilidades através de desafios divertidos!</strong></p>
        <p>Cada desafio que você completa te deixa mais forte, mais confiante e mais feliz! 💪</p>
      </div>
    </div>

    <div class="activity-card" style="background: linear-gradient(135deg, #FFE6F0 0%, #E8F4FD 100%);">
      <h3>🎨 Desafio 1: Desenho Expressivo</h3>
      <p>Desenhe como você está se sentindo hoje!</p>
      <div style="background: white; padding: 20px; border-radius: 10px; margin: 15px 0; text-align: center;">
        <p>🖍️ Pegue papel e lápis de cor</p>
        <p>✏️ Desenhe você mesmo com a emoção de hoje</p>
        <p>🎨 Use cores que representem seu sentimento</p>
      </div>
      <button class="btn-primary" style="width: 100%; margin-top: 10px;" onclick="completeChallenge('Desenho Expressivo', 40)">
        ✅ Completei o desenho!
      </button>
    </div>

    <div class="activity-card" style="background: linear-gradient(135deg, #FFF9E6 0%, #E6F7FF 100%);">
      <h3>💝 Desafio 2: Missão de Bondade</h3>
      <p>Faça algo gentil para alguém hoje!</p>
      <div style="background: white; padding: 20px; border-radius: 10px; margin: 15px 0;">
        <h4>Ideias de bondade:</h4>
        <ul style="margin-left: 20px;">
          <li>🤗 Dar um abraço em alguém que você ama</li>
          <li>💌 Fazer um cartão para alguém especial</li>
          <li>🧹 Ajudar a arrumar a casa</li>
          <li>😊 Fazer alguém sorrir</li>
          <li>🎁 Compartilhar um brinquedo</li>
        </ul>
      </div>
      <button class="btn-primary" style="width: 100%; margin-top: 10px;" onclick="completeChallenge('Missão de Bondade', 50)">
        ✅ Fui bondoso(a) hoje!
      </button>
    </div>

    <div class="activity-card" style="background: linear-gradient(135deg, #E8F4FD 0%, #F0E6FF 100%);">
      <h3>📖 Desafio 3: História Criativa</h3>
      <p>Crie uma história sobre um herói corajoso!</p>
      <div style="background: white; padding: 20px; border-radius: 10px; margin: 15px 0;">
        <h4>Sua história deve ter:</h4>
        <ul style="margin-left: 20px;">
          <li>🦸 Um herói (pode ser você!)</li>
          <li>⭐ Uma missão importante</li>
          <li>💪 Um momento de coragem</li>
          <li>🎉 Um final feliz</li>
        </ul>
        <p style="margin-top: 15px;"><strong>Conte sua história para alguém da família!</strong></p>
      </div>
      <button class="btn-primary" style="width: 100%; margin-top: 10px;" onclick="completeChallenge('História Criativa', 45)">
        ✅ Contei minha história!
      </button>
    </div>

    <div class="activity-card" style="background: linear-gradient(135deg, #FFE6E6 0%, #FFF9E6 100%);">
      <h3>🌟 Desafio 4: Treino de Coragem</h3>
      <p>Faça algo que te deixa um pouquinho nervoso(a), mas que é seguro!</p>
      <div style="background: white; padding: 20px; border-radius: 10px; margin: 15px 0;">
        <h4>Exemplos de coragem:</h4>
        <ul style="margin-left: 20px;">
          <li>🗣️ Falar em voz alta quando precisa de algo</li>
          <li>👋 Cumprimentar alguém novo</li>
          <li>🎤 Cantar uma música para a família</li>
          <li>🙋 Fazer uma pergunta na aula</li>
          <li>🛡️ Dizer "não" quando necessário</li>
        </ul>
        <p style="background: #E8F4FD; padding: 10px; border-radius: 5px; margin-top: 15px;">
          <strong>Lembre-se:</strong> Coragem é fazer mesmo com um pouquinho de medo! 💪
        </p>
      </div>
      <button class="btn-primary" style="width: 100%; margin-top: 10px;" onclick="completeChallenge('Treino de Coragem', 60)">
        ✅ Fui corajoso(a)!
      </button>
    </div>

    <div class="activity-card" style="background: linear-gradient(135deg, #D4EDDA 0%, #E8F4FD 100%);">
      <h3>🎯 Desafio 5: Meta do Dia</h3>
      <p>Escolha uma meta pequena para hoje!</p>
      <div style="background: white; padding: 20px; border-radius: 10px; margin: 15px 0;">
        <h4>Ideias de metas:</h4>
        <ul style="margin-left: 20px;">
          <li>📚 Ler 10 minutos</li>
          <li>🧘 Fazer 5 respirações profundas</li>
          <li>💧 Beber 4 copos de água</li>
          <li>🏃 Brincar fora por 20 minutos</li>
          <li>🧸 Arrumar os brinquedos</li>
        </ul>
        <p style="margin-top: 15px;"><strong>Escolha uma e complete hoje!</strong></p>
      </div>
      <button class="btn-primary" style="width: 100%; margin-top: 10px;" onclick="completeChallenge('Meta do Dia', 35)">
        ✅ Completei minha meta!
      </button>
    </div>

    <div class="activity-card" style="background: #FFF9E6; border: 2px solid #FFB84D;">
      <h3>⭐ Sistema de FP (Fun Points)</h3>
      <p>Cada desafio que você completa te dá FP! ⭐</p>
      <p><strong>Para que servem os FP?</strong></p>
      <ul style="margin-left: 20px;">
        <li>📊 Mostram seu progresso</li>
        <li>🦊 Deixam seu mascote mais feliz</li>
        <li>🏆 Desbloqueiam badges especiais</li>
        <li>💪 Mostram seu esforço e dedicação</li>
      </ul>
      <p style="margin-top: 15px; font-size: 1.1rem;">
        <strong>Lembre-se:</strong> FP são pelo seu ESFORÇO, não pela perfeição! ✨
      </p>
    </div>

    <div style="text-align: center; padding: 30px; background: white; border-radius: 15px; margin-top: 20px;">
      <h3 style="color: #4A90E2;">Você está indo muito bem! 🌟</h3>
      <p style="font-size: 1.1rem;">Continue completando desafios e aprendendo coisas novas!</p>
      <button class="complete-activity-btn" onclick="completeActivity('Explorou desafios positivos', 50)">
        ✅ Estou pronto(a) para mais desafios!
      </button>
    </div>
  `;
}

async function completeChallenge(challengeName, fpEarned) {
  await completeActivity(challengeName, fpEarned);

  // Mostrar mensagem especial
  showFeedback(`🎉 Desafio "${challengeName}" completado! +${fpEarned} FP! Continue assim!`, 'success');
}
