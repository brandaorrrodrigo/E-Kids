// ============================================
// E-KIDS PRO - GERADOR DE CARROSSÉIS EDUCATIVOS
// ============================================

/**
 * Biblioteca de conteúdo para carrosséis
 */
const carouselContent = {
  // TEMA 1: Problemas atuais na educação infantil
  problemasEducacao: [
    {
      titulo: "Crianças sem limites financeiros",
      problema: "Muitas crianças crescem sem entender o valor do dinheiro",
      consequencia: "Adolescentes e adultos endividados, sem controle financeiro",
      solucao: "E-Kids ensina através de missões práticas e recompensas reais",
      beneficio: "Criança aprende a poupar, planejar e valorizar conquistas",
      hashtags: ["#EducacaoFinanceira", "#CriancasResponsaveis", "#PaisConscientes"]
    },
    {
      titulo: "Falta de autonomia emocional",
      problema: "Crianças que não sabem lidar com frustração e emoções",
      consequencia: "Adultos com dificuldade em relacionamentos e trabalho",
      solucao: "E-Kids trabalha inteligência emocional de forma lúdica",
      beneficio: "Criança desenvolve resiliência e autoconhecimento",
      hashtags: ["#InteligenciaEmocional", "#EducacaoEmocional", "#CriancasFortes"]
    },
    {
      titulo: "Sem noção de responsabilidade",
      problema: "Tudo é feito pelos pais, criança não assume tarefas",
      consequencia: "Adolescentes dependentes, sem iniciativa",
      solucao: "E-Kids gamifica tarefas domésticas e responsabilidades",
      beneficio: "Criança aprende autonomia brincando",
      hashtags: ["#CriancasAutonomas", "#EducacaoAtiva", "#ResponsabilidadeInfantil"]
    },
    {
      titulo: "Exposição digital sem limites",
      problema: "Crianças passam horas em telas sem supervisão",
      consequencia: "Problemas de atenção, ansiedade e segurança digital",
      solucao: "E-Kids oferece conteúdo educativo e tempo controlado",
      beneficio: "Tecnologia a favor do desenvolvimento saudável",
      hashtags: ["#SegurancaDigital", "#TempoDetela", "#TecnologiaEducativa"]
    },
    {
      titulo: "Educação financeira tardia",
      problema: "Escola não ensina finanças, pais não sabem como ensinar",
      consequencia: "Jovens sem preparo para o mundo financeiro real",
      solucao: "E-Kids cria sistema de economia virtual ligado ao real",
      beneficio: "Base financeira sólida desde cedo",
      hashtags: ["#FinancasInfantis", "#EducacaoFinanceiraInfantil", "#DinheiroParaCriancas"]
    }
  ],

  // TEMA 2: O que a escola não ensina
  escolaNaoEnsina: [
    {
      titulo: "Gestão do dinheiro",
      falta: "Escola ensina matemática, mas não educação financeira prática",
      impacto: "Adultos com diploma mas sem controle das próprias finanças",
      ekidsEnsina: "Sistema de FP (Fun Points) que simula economia real",
      resultado: "Criança aprende poupança, investimento e planejamento",
      hashtags: ["#EducacaoFinanceira", "#AlemDaEscola", "#VidaPratica"]
    },
    {
      titulo: "Inteligência emocional",
      falta: "Escola foca no cognitivo, esquece o emocional",
      impacto: "Crianças brilhantes academicamente mas perdidas emocionalmente",
      ekidsEnsina: "Missões diárias de reconhecimento e gestão emocional",
      resultado: "Criança que identifica, nomeia e regula suas emoções",
      hashtags: ["#InteligenciaEmocional", "#EducacaoIntegral", "#SaudeEmocional"]
    },
    {
      titulo: "Segurança pessoal",
      falta: "Escola não ensina limites corporais e autodefesa emocional",
      impacto: "Crianças vulneráveis a situações de risco",
      ekidsEnsina: "Módulos de segurança, limites e quando pedir ajuda",
      resultado: "Criança empoderada e segura de si",
      hashtags: ["#SegurancaInfantil", "#ProtecaoInfantil", "#CriancasSeguras"]
    },
    {
      titulo: "Pensamento crítico real",
      falta: "Escola ensina decorar, não questionar e pensar",
      impacto: "Adultos que seguem sem refletir",
      ekidsEnsina: "Missões que exigem escolhas, consequências e reflexão",
      resultado: "Criança que pensa antes de agir",
      hashtags: ["#PensamentoCritico", "#EducacaoAtiva", "#CriancasPensantes"]
    },
    {
      titulo: "Habilidades para a vida",
      falta: "Escola prepara para prova, não para vida",
      impacto: "Jovens perdidos após formatura",
      ekidsEnsina: "Competências práticas: organização, comunicação, resiliência",
      resultado: "Criança preparada para o mundo real",
      hashtags: ["#EducacaoParaVida", "#CompetenciasDoFuturo", "#VidaReal"]
    }
  ],

  // TEMA 3: Como ensinar brincando
  ensinarBrincando: [
    {
      titulo: "Gamificação funciona",
      conceito: "Criança aprende 10x mais quando se diverte",
      como: "E-Kids transforma responsabilidades em missões e desafios",
      exemplo: "Arrumar o quarto vira 'Missão Organização' com recompensa",
      resultado: "Criança pede para fazer tarefas!",
      hashtags: ["#Gamificacao", "#AprenderBrincando", "#EducacaoLudica"]
    },
    {
      titulo: "Recompensas que ensinam",
      conceito: "Não é 'comprar comportamento', é ensinar causa e efeito",
      como: "E-Kids usa sistema de pontos que a criança gerencia",
      exemplo: "Criança decide: guardar, investir ou gastar FP",
      resultado: "Aprende planejamento financeiro naturalmente",
      hashtags: ["#RecompensasEducativas", "#CausaEfeito", "#EducacaoPositiva"]
    },
    {
      titulo: "Mascote como mentor",
      conceito: "Criança se conecta emocionalmente com personagens",
      como: "E-Kids tem mascote que cresce junto com a criança",
      exemplo: "Mascote comemora conquistas e apoia em desafios",
      resultado: "Motivação constante e vínculo emocional positivo",
      hashtags: ["#AprendizadoEmocional", "#MascoteEducativo", "#VinculoPositivo"]
    },
    {
      titulo: "Autonomia aos poucos",
      conceito: "Criança ganha liberdade conforme demonstra responsabilidade",
      como: "E-Kids tem fases progressivas de complexidade",
      exemplo: "Começa com tarefas simples, evolui para decisões complexas",
      resultado: "Confiança e autonomia crescem juntas",
      hashtags: ["#Autonomia", "#CrescimentoGradual", "#DesenvolvimentoInfantil"]
    },
    {
      titulo: "Aprender com escolhas",
      conceito: "Errar em ambiente seguro é aprender sem risco real",
      como: "E-Kids permite escolhas e mostra consequências",
      exemplo: "Gastar todos os FP = não consegue comprar item desejado",
      resultado: "Aprende planejamento através da experiência",
      hashtags: ["#AprendizadoAtivo", "#ErrarParaAprender", "#ExperienciaPratica"]
    }
  ],

  // TEMA 4: Benefícios a longo prazo
  beneficiosLongoPrazo: [
    {
      titulo: "Adolescente financeiramente consciente",
      agora: "Criança aprende a poupar para objetivos",
      futuro: "Adolescente que não se endivida, planeja compras",
      comparacao: "Enquanto outros pedem tudo, seu filho negocia e entende valor",
      impacto: "Jovem preparado para o primeiro salário",
      hashtags: ["#FuturoFinanceiro", "#AdolescenteResponsavel", "#EducacaoLongoPrazo"]
    },
    {
      titulo: "Adulto emocionalmente equilibrado",
      agora: "Criança identifica e nomeia emoções diariamente",
      futuro: "Adulto que lida com estresse, frustração e conflitos",
      comparacao: "Enquanto outros explodem, seu filho respira e resolve",
      impacto: "Relacionamentos saudáveis e carreira estável",
      hashtags: ["#SaudeEmocional", "#EquilibrioEmocional", "#AdultoEquilibrado"]
    },
    {
      titulo: "Profissional autônomo e proativo",
      agora: "Criança assume tarefas e resolve problemas sozinha",
      futuro: "Profissional que toma iniciativa, não espera ordens",
      comparacao: "Enquanto outros precisam de supervisão, seu filho lidera",
      impacto: "Carreira de sucesso e satisfação profissional",
      hashtags: ["#FuturoProfissional", "#Proatividade", "#Lideranca"]
    },
    {
      titulo: "Cidadão consciente e seguro",
      agora: "Criança aprende limites, segurança e quando pedir ajuda",
      futuro: "Adulto que se protege e protege outros",
      comparacao: "Enquanto outros são vulneráveis, seu filho é empoderado",
      impacto: "Vida mais segura e relações mais saudáveis",
      hashtags: ["#SegurancaPessoal", "#Empoderamento", "#CidadaoConsciente"]
    },
    {
      titulo: "Investidor desde jovem",
      agora: "Criança entende rendimento do cofrinho (3% ao mês)",
      futuro: "Jovem que investe cedo e entende juros compostos",
      comparacao: "Aos 25 anos, tem patrimônio enquanto outros têm dívidas",
      impacto: "Independência financeira mais cedo",
      hashtags: ["#EducacaoFinanceira", "#InvestirCedo", "#IndependenciaFinanceira"]
    }
  ],

  // TEMA 5: Como o E-Kids transforma
  transformacao: [
    {
      titulo: "De birra a negociação",
      antes: "Criança faz birra quando quer algo",
      durante: "E-Kids ensina que tudo tem custo e planejamento",
      depois: "Criança negocia, planeja e trabalha para conquistar",
      prova: "Pais relatam: 'Meu filho me surpreendeu poupando!'",
      hashtags: ["#SemBirra", "#CriancaMadura", "#Negociacao"]
    },
    {
      titulo: "De 'não sei' a 'eu consigo'",
      antes: "Criança desiste fácil, não tenta",
      durante: "E-Kids celebra tentativas e ensina resiliência",
      depois: "Criança tenta, erra, aprende e persiste",
      prova: "Aumento de 300% em tarefas completadas sozinha",
      hashtags: ["#Resiliencia", "#Persistencia", "#EuConsigo"]
    },
    {
      titulo: "De telas sem fim a tempo produtivo",
      antes: "Horas no tablet sem aprender nada",
      durante: "E-Kids oferece diversão educativa e limitada",
      depois: "Criança usa tecnologia com propósito",
      prova: "80% das crianças pedem para fazer missões",
      hashtags: ["#UsoConsciente", "#TecnologiaEducativa", "#TempoProdutivo"]
    },
    {
      titulo: "De dependente a autônomo",
      antes: "Pais fazem tudo pela criança",
      durante: "E-Kids gamifica responsabilidades",
      depois: "Criança assume tarefas e se orgulha",
      prova: "Famílias relatam menos conflitos em casa",
      hashtags: ["#Autonomia", "#IndependenciaInfantil", "#CriancaResponsavel"]
    },
    {
      titulo: "De consumista a consciente",
      antes: "Quer tudo que vê, não entende valor",
      durante: "E-Kids ensina escolhas e consequências",
      depois: "Criança avalia, compara e decide com consciência",
      prova: "Redução de 70% em pedidos impulsivos",
      hashtags: ["#ConsumoConsciente", "#ValorDoDinheiro", "#EscolhasInteligentes"]
    }
  ]
};

/**
 * CTAs variados para não ficar repetitivo
 */
const ctas = [
  {
    texto1: "Educação que forma hábitos para a vida toda.",
    texto2: "👉 Link na bio",
    texto3: "👉 Conheça o E-Kids PRO"
  },
  {
    texto1: "Transforme a educação do seu filho hoje.",
    texto2: "👉 Acesse agora",
    texto3: "👉 E-Kids PRO - Link na bio"
  },
  {
    texto1: "Seu filho merece educação completa.",
    texto2: "👉 Saiba mais",
    texto3: "👉 E-Kids PRO"
  },
  {
    texto1: "Prepare seu filho para o futuro.",
    texto2: "👉 Comece agora",
    texto3: "👉 Link na bio - E-Kids PRO"
  },
  {
    texto1: "Desenvolvimento completo do ser humano.",
    texto2: "👉 Conheça o método",
    texto3: "👉 E-Kids PRO - Link na bio"
  },
  {
    texto1: "Educação financeira + emocional + segurança.",
    texto2: "👉 Tudo em um só lugar",
    texto3: "👉 E-Kids PRO"
  }
];

/**
 * Gera carrossel Instagram (1080x1080)
 */
function gerarCarrosselInstagram(tema, index = 0) {
  const conteudo = carouselContent[tema][index];
  const cta = ctas[Math.floor(Math.random() * ctas.length)];

  const slides = [];

  // Slide 1: Título/Problema
  slides.push({
    numero: 1,
    formato: "instagram",
    dimensoes: "1080x1080",
    background: "#667eea",
    titulo: conteudo.titulo || conteudo.falta || conteudo.conceito || conteudo.agora,
    subtitulo: conteudo.problema || conteudo.falta || conteudo.conceito,
    fonte_titulo: "Bold, 72px",
    fonte_subtitulo: "Regular, 48px",
    cor_texto: "#FFFFFF",
    marca_dagua: "Logo E-Kids (canto inferior direito, 80x80px, opacidade 30%)",
    elementos: ["Ícone relacionado ao tema", "Gradiente sutil"]
  });

  // Slide 2: Consequência/Impacto
  if (conteudo.consequencia || conteudo.impacto) {
    slides.push({
      numero: 2,
      formato: "instagram",
      dimensoes: "1080x1080",
      background: "#764ba2",
      titulo: "O resultado disso?",
      corpo: conteudo.consequencia || conteudo.impacto || conteudo.como,
      fonte_titulo: "Bold, 64px",
      fonte_corpo: "Regular, 44px",
      cor_texto: "#FFFFFF",
      marca_dagua: "Logo E-Kids (canto inferior direito, 80x80px, opacidade 30%)",
      elementos: ["Ícone de alerta", "Lista ou bullets"]
    });
  }

  // Slide 3: Solução E-Kids
  slides.push({
    numero: 3,
    formato: "instagram",
    dimensoes: "1080x1080",
    background: "#FFFFFF",
    titulo: "E-Kids ensina:",
    corpo: conteudo.solucao || conteudo.ekidsEnsina || conteudo.durante || conteudo.exemplo,
    fonte_titulo: "Bold, 64px, #667eea",
    fonte_corpo: "Regular, 44px, #333333",
    marca_dagua: "Logo E-Kids (canto inferior direito, 80x80px, opacidade 30%)",
    elementos: ["Ícone do E-Kids", "Ilustração criança feliz"]
  });

  // Slide 4: Benefício/Resultado
  slides.push({
    numero: 4,
    formato: "instagram",
    dimensoes: "1080x1080",
    background: "#F093FB",
    titulo: "Resultado:",
    corpo: conteudo.beneficio || conteudo.resultado || conteudo.depois || conteudo.prova,
    fonte_titulo: "Bold, 64px",
    fonte_corpo: "Regular, 44px",
    cor_texto: "#FFFFFF",
    marca_dagua: "Logo E-Kids (canto inferior direito, 80x80px, opacidade 30%)",
    elementos: ["Ícone de sucesso/check", "Estatística visual se houver"]
  });

  // Slide 5: CTA
  slides.push({
    numero: 5,
    formato: "instagram",
    dimensoes: "1080x1080",
    background: "Gradiente #667eea → #764ba2",
    titulo: cta.texto1,
    corpo: `${cta.texto2}\n${cta.texto3}`,
    fonte_titulo: "Bold, 56px",
    fonte_corpo: "Bold, 48px",
    cor_texto: "#FFFFFF",
    marca_dagua: "Logo E-Kids (canto inferior direito, 120x120px, opacidade 50%)",
    elementos: ["Logo E-Kids grande", "Seta ou botão visual"]
  });

  return {
    formato: "instagram",
    dimensoes: "1080x1080",
    tema: tema,
    slides: slides,
    hashtags: conteudo.hashtags,
    total_slides: slides.length
  };
}

/**
 * Gera carrossel TikTok (1080x1920)
 */
function gerarCarrosselTikTok(tema, index = 0) {
  const conteudo = carouselContent[tema][index];
  const cta = ctas[Math.floor(Math.random() * ctas.length)];

  const slides = [];

  // Slide 1: Hook/Problema (vertical)
  slides.push({
    numero: 1,
    formato: "tiktok",
    dimensoes: "1080x1920",
    background: "#667eea",
    titulo: "VOCÊ SABIA?",
    corpo: conteudo.titulo || conteudo.problema,
    fonte_titulo: "Bold, 96px",
    fonte_corpo: "Bold, 72px",
    cor_texto: "#FFFFFF",
    marca_dagua: "Logo E-Kids (canto inferior, 100x100px, opacidade 30%)",
    elementos: ["Emoji grande relacionado", "Número ou estatística"]
  });

  // Slide 2: Aprofundamento
  slides.push({
    numero: 2,
    formato: "tiktok",
    dimensoes: "1080x1920",
    background: "#764ba2",
    titulo: "O PROBLEMA:",
    corpo: conteudo.problema || conteudo.falta || conteudo.antes,
    fonte_titulo: "Bold, 80px",
    fonte_corpo: "Regular, 64px",
    cor_texto: "#FFFFFF",
    marca_dagua: "Logo E-Kids (canto inferior, 100x100px, opacidade 30%)",
    elementos: ["Ícone X ou ⚠️", "Texto escalonado"]
  });

  // Slide 3: Consequência
  slides.push({
    numero: 3,
    formato: "tiktok",
    dimensoes: "1080x1920",
    background: "#F5576C",
    titulo: "RESULTADO:",
    corpo: conteudo.consequencia || conteudo.impacto || conteudo.comparacao,
    fonte_titulo: "Bold, 80px",
    fonte_corpo: "Regular, 60px",
    cor_texto: "#FFFFFF",
    marca_dagua: "Logo E-Kids (canto inferior, 100x100px, opacidade 30%)",
    elementos: ["Emoji triste ou preocupado", "Dados visuais"]
  });

  // Slide 4: Solução E-Kids
  slides.push({
    numero: 4,
    formato: "tiktok",
    dimensoes: "1080x1920",
    background: "#FFFFFF",
    titulo: "A SOLUÇÃO:",
    corpo: conteudo.solucao || conteudo.ekidsEnsina || conteudo.durante,
    fonte_titulo: "Bold, 80px, #667eea",
    fonte_corpo: "Bold, 64px, #333333",
    marca_dagua: "Logo E-Kids (canto inferior, 100x100px, opacidade 30%)",
    elementos: ["Logo E-Kids", "Emoji ✅ ou 💡"]
  });

  // Slide 5: Transformação
  slides.push({
    numero: 5,
    formato: "tiktok",
    dimensoes: "1080x1920",
    background: "#43E97B",
    titulo: "O RESULTADO:",
    corpo: conteudo.beneficio || conteudo.resultado || conteudo.depois,
    fonte_titulo: "Bold, 80px",
    fonte_corpo: "Bold, 64px",
    cor_texto: "#FFFFFF",
    marca_dagua: "Logo E-Kids (canto inferior, 100x100px, opacidade 30%)",
    elementos: ["Emoji feliz/celebração", "Antes → Depois"]
  });

  // Slide 6: CTA
  slides.push({
    numero: 6,
    formato: "tiktok",
    dimensoes: "1080x1920",
    background: "Gradiente #667eea → #764ba2",
    titulo: cta.texto1,
    corpo: `${cta.texto2}\n\n${cta.texto3}`,
    fonte_titulo: "Bold, 72px",
    fonte_corpo: "Bold, 64px",
    cor_texto: "#FFFFFF",
    marca_dagua: "Logo E-Kids (centro inferior, 150x150px, opacidade 60%)",
    elementos: ["Logo E-Kids grande", "Seta para baixo → Bio"]
  });

  return {
    formato: "tiktok",
    dimensoes: "1080x1920",
    tema: tema,
    slides: slides,
    hashtags: conteudo.hashtags,
    total_slides: slides.length
  };
}

/**
 * Gera todos os carrosséis de um tema
 */
function gerarTodosCarrosselsTema(tema) {
  const conteudos = carouselContent[tema];
  const carrosseisInstagram = [];
  const carrosselsTikTok = [];

  conteudos.forEach((_, index) => {
    carrosseisInstagram.push(gerarCarrosselInstagram(tema, index));
    carrosselsTikTok.push(gerarCarrosselTikTok(tema, index));
  });

  return {
    tema,
    instagram: carrosseisInstagram,
    tiktok: carrosselsTikTok,
    total: conteudos.length
  };
}

/**
 * Gera carrossel customizado
 */
function gerarCarrosselCustomizado(dados) {
  const {
    formato = 'instagram',
    titulo,
    problema,
    solucao,
    beneficio,
    hashtags = []
  } = dados;

  if (formato === 'instagram') {
    return {
      formato: 'instagram',
      dimensoes: '1080x1080',
      slides: [
        {
          numero: 1,
          background: '#667eea',
          titulo: titulo,
          corpo: problema,
          cor_texto: '#FFFFFF'
        },
        {
          numero: 2,
          background: '#FFFFFF',
          titulo: 'E-Kids ensina:',
          corpo: solucao,
          cor_texto: '#333333'
        },
        {
          numero: 3,
          background: '#F093FB',
          titulo: 'Resultado:',
          corpo: beneficio,
          cor_texto: '#FFFFFF'
        },
        {
          numero: 4,
          background: 'Gradiente',
          titulo: 'Conheça o E-Kids PRO',
          corpo: '👉 Link na bio',
          cor_texto: '#FFFFFF'
        }
      ],
      hashtags
    };
  }

  // TikTok similar...
  return gerarCarrosselTikTok('problemasEducacao', 0);
}

module.exports = {
  carouselContent,
  ctas,
  gerarCarrosselInstagram,
  gerarCarrosselTikTok,
  gerarTodosCarrosselsTema,
  gerarCarrosselCustomizado
};
