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

    <div class="quiz-section" style="margin-top: 30px;">
      <h3>🎯 Quiz: Teste seu Conhecimento!</h3>
      <p>Vamos ver o que você aprendeu sobre dizer não! Responda as perguntas e ganhe FP extra!</p>
      <button class="btn-start-quiz" onclick="startDizerNaoQuiz()">
        Começar Quiz 🚀
      </button>
      <div id="quiz-container"></div>
    </div>
  `;
}

// Perguntas do quiz (5 níveis de dificuldade)
const dizerNaoQuestions = [
  // NÍVEL 1 - Básico
  {
    level: 1,
    question: "O que você deve fazer quando algo te deixa desconfortável?",
    image: "🤔",
    options: [
      "Continuar fazendo mesmo com medo",
      "Dizer NÃO e se afastar",
      "Ficar quieto e não falar nada",
      "Fingir que está tudo bem"
    ],
    correctIndex: 1,
    explanation: "Quando algo te deixa desconfortável, você tem o direito de dizer NÃO e se afastar. Seu corpo e seus sentimentos são importantes!",
    hints: [
      "Pense: o que te faz sentir seguro e protegido?",
      "Lembre-se: dizer não quando algo está errado é se cuidar!"
    ]
  },

  // NÍVEL 2 - Intermediário
  {
    level: 2,
    question: "Seu amigo quer brincar de luta, mas você está cansado. O que você faz?",
    context: "Situação: É hora do recreio e você quer descansar.",
    image: "😴",
    options: [
      "Brinco mesmo cansado para não deixá-lo triste",
      "Digo: 'Não quero agora, estou cansado'",
      "Finjo estar doente",
      "Saio correndo sem falar nada"
    ],
    correctIndex: 1,
    explanation: "Você pode dizer não de forma educada explicando como se sente. Seus amigos vão entender e respeitar seus limites!",
    hints: [
      "Como você pode explicar que está cansado de forma gentil?",
      "Lembre: ser honesto sobre seus sentimentos é importante!"
    ]
  },

  // NÍVEL 3 - Prático
  {
    level: 3,
    question: "Uma pessoa adulta que você não conhece bem pede para você guardar um segredo. O que você faz?",
    image: "🤫",
    context: "Situação: Um adulto que não é da sua família quer que você guarde segredo.",
    options: [
      "Guardo o segredo porque adultos sempre sabem o que é certo",
      "Digo NÃO e conto para meus pais ou responsáveis",
      "Guardo só dessa vez",
      "Aceito se ele prometer me dar algo"
    ],
    correctIndex: 1,
    explanation: "Segredos de adultos para crianças não são OK! Você deve sempre contar para seus pais ou responsáveis quando alguém pede para guardar segredo.",
    hints: [
      "Pense: segredos bons deixam você feliz, segredos ruins deixam você preocupado...",
      "Lembre: você SEMPRE pode contar tudo para seus pais ou responsáveis!"
    ]
  },

  // NÍVEL 4 - Complexo
  {
    level: 4,
    question: "Você está na casa de um parente e ele insiste para você dar um beijo de despedida, mas você não quer. O que fazer?",
    context: "Situação: Seus pais estão por perto e o parente está insistindo.",
    image: "😟",
    options: [
      "Dou o beijo para não criar confusão",
      "Digo: 'Prefiro dar um tchauzinho!' e aceno",
      "Choro e saio correndo",
      "Finjo que não ouvi"
    ],
    correctIndex: 1,
    explanation: "Você nunca precisa beijar ou abraçar alguém se não quiser! Pode oferecer um tchauzinho ou um high-five. Seu corpo, suas regras!",
    hints: [
      "Existe outra forma carinhosa de se despedir sem contato físico?",
      "Pense: você tem direito de escolher como quer cumprimentar as pessoas!"
    ]
  },

  // NÍVEL 5 - Avançado/Situações Difíceis
  {
    level: 5,
    question: "Seu melhor amigo conta que alguém pediu para ele tirar a roupa para 'tirar uma foto legal'. O que você aconselha?",
    context: "Situação: Seu amigo está confuso e não sabe o que fazer.",
    image: "📸",
    options: [
      "Que ele faça, se é só uma foto",
      "Que diga NÃO FORTE, saia de perto e conte para um adulto de confiança AGORA",
      "Que pergunte para a pessoa por que quer a foto",
      "Que pense melhor depois"
    ],
    correctIndex: 1,
    explanation: "NINGUÉM deve pedir para uma criança tirar a roupa ou fazer coisas estranhas. Isso é MUITO ERRADO! Sempre dizer NÃO, sair e contar para um adulto de confiança imediatamente. Você pode salvar seu amigo!",
    hints: [
      "Isso parece ser algo seguro ou perigoso?",
      "O que você faria se alguém pedisse isso para você?"
    ]
  }
];

function startDizerNaoQuiz() {
  // Esconder conteúdo do módulo
  const activityCards = document.querySelectorAll('.activity-card, .story-section, .practice-area, .complete-activity-btn, .btn-start-quiz');
  activityCards.forEach(card => card.style.display = 'none');

  // Inicializar quiz
  const currentChild = JSON.parse(localStorage.getItem('current_child') || '{}');
  quizSystem = new QuizSystem('dizer-nao', currentChild.id);
  quizSystem.init(dizerNaoQuestions);
  quizSystem.render('quiz-container');
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
