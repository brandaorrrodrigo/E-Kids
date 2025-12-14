// ============================================
// E-KIDS PRO - GERADOR DE CARROSSÉIS V2 - EXPANDIDO
// ============================================
// Gerador com 15+ temas e 75+ variações de conteúdo

/**
 * Biblioteca MASSIVA de conteúdo para carrosséis
 */
const carouselContent = {
  // ==========================================
  // TEMA 1: Problemas atuais na educação infantil
  // ==========================================
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

  // ==========================================
  // TEMA 2: O que a escola não ensina
  // ==========================================
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

  // ==========================================
  // TEMA 3: Desenvolvimento Emocional
  // ==========================================
  desenvolvimentoEmocional: [
    {
      titulo: "Criança que não sabe nomear emoções",
      problema: "Sente raiva, tristeza, medo - mas não sabe o que é",
      consequencia: "Birras, explosões, dificuldade em se expressar",
      solucao: "E-Kids tem check-ins emocionais diários com o mascote",
      beneficio: "Criança identifica: 'Estou com medo' em vez de chorar sem parar",
      hashtags: ["#Emocoes", "#InteligenciaEmocional", "#CheckInEmocional"]
    },
    {
      titulo: "Frustração = Explosão",
      problema: "Criança não consegue lidar quando algo dá errado",
      consequencia: "Desiste fácil, tem birras, afasta amigos",
      solucao: "E-Kids ensina que errar é parte do processo",
      beneficio: "Criança tenta de novo, respira fundo, pede ajuda",
      hashtags: ["#Resiliencia", "#Frustracao", "#InteligenciaEmocional"]
    },
    {
      titulo: "Medo de falar sobre sentimentos",
      problema: "Criança guarda tudo, não compartilha",
      consequencia: "Ansiedade, isolamento, problemas não resolvidos",
      solucao: "E-Kids cria espaço seguro com círculo de confiança",
      beneficio: "Criança se abre com adultos de confiança",
      hashtags: ["#ComunicacaoEmocional", "#CirculoDeConfianca", "#SaudeEmocional"]
    },
    {
      titulo: "Empatia? O que é isso?",
      problema: "Criança não entende sentimentos dos outros",
      consequencia: "Conflitos, bullying, dificuldade em fazer amigos",
      solucao: "E-Kids tem missões de 'como o outro se sente'",
      beneficio: "Criança desenvolve empatia e melhora relações",
      hashtags: ["#Empatia", "#RelacionamentosInfantis", "#InteligenciaSocial"]
    },
    {
      titulo: "Autoestima lá embaixo",
      problema: "Criança se compara, se acha incapaz",
      consequencia: "Não tenta coisas novas, fica pra trás",
      solucao: "E-Kids celebra CADA conquista, por menor que seja",
      beneficio: "Criança confiante: 'Eu consigo!'",
      hashtags: ["#Autoestima", "#Confianca", "#CriancaSegura"]
    }
  ],

  // ==========================================
  // TEMA 4: Segurança e Limites
  // ==========================================
  segurancaLimites: [
    {
      titulo: "Meu corpo, minhas regras",
      problema: "Criança não sabe que pode dizer NÃO",
      consequencia: "Vulnerável a situações de abuso e desconforto",
      solucao: "E-Kids ensina: seu corpo é SEU, você escolhe",
      beneficio: "Criança empoderada que defende seus limites",
      hashtags: ["#ConsentimentoInfantil", "#MeuCorpoMinhasRegras", "#ProtecaoInfantil"]
    },
    {
      titulo: "Segredos bons vs segredos ruins",
      problema: "Criança guarda tudo que pedem para guardar",
      consequencia: "Situações perigosas não relatadas aos pais",
      solucao: "E-Kids ensina diferença entre surpresa e segredo perigoso",
      beneficio: "Criança conta aos pais quando algo está errado",
      hashtags: ["#SegurancaInfantil", "#ComunicacaoFamiliar", "#ProtecaoInfantil"]
    },
    {
      titulo: "Círculo de confiança",
      problema: "Criança não sabe a quem recorrer em emergência",
      consequencia: "Desespero em situações de risco",
      solucao: "E-Kids cria lista de adultos de confiança da criança",
      beneficio: "Criança sabe exatamente quem pode ajudar",
      hashtags: ["#CirculoDeConfianca", "#RedeDe Apoio", "#SegurancaInfantil"]
    },
    {
      titulo: "Toques apropriados",
      problema: "Criança não distingue carinho de toque inadequado",
      consequencia: "Risco de abuso sexual infantil",
      solucao: "E-Kids ensina regra da calcinha/cueca de forma lúdica",
      beneficio: "Criança identifica e recusa toques inapropriados",
      hashtags: ["#EducacaoSexualInfantil", "#ProtecaoInfantil", "#PrevencaoAbuso"]
    },
    {
      titulo: "Segurança digital",
      problema: "Criança compartilha informações com estranhos online",
      consequencia: "Exposição a predadores e cyberbullying",
      solucao: "E-Kids ensina privacidade e segurança na internet",
      beneficio: "Criança usa internet de forma segura e consciente",
      hashtags: ["#SegurancaDigital", "#PrivacidadeInfantil", "#InternetSegura"]
    }
  ],

  // ==========================================
  // TEMA 5: Educação Financeira Profunda
  // ==========================================
  educacaoFinanceira: [
    {
      titulo: "Quer, pede, ganha",
      problema: "Criança não entende que dinheiro é limitado",
      consequencia: "Adulto consumista e endividado",
      solucao: "E-Kids simula economia real com FP limitados",
      beneficio: "Criança aprende a escolher: isso OU aquilo",
      hashtags: ["#EducacaoFinanceira", "#EscolhasFinanceiras", "#ConsumoConsciente"]
    },
    {
      titulo: "O poder dos juros compostos",
      problema: "Criança não vê vantagem em guardar dinheiro",
      consequencia: "Gasta tudo que ganha, zero poupança",
      solucao: "E-Kids dá 3% ao mês no cofrinho - criança VÊ crescer",
      beneficio: "Aos 8 anos já entende investimento!",
      hashtags: ["#JurosCompostos", "#Investimento", "#PouparCedo"]
    },
    {
      titulo: "Trabalho = Dinheiro",
      problema: "Criança acha que dinheiro 'aparece'",
      consequencia: "Não valoriza o esforço dos pais",
      solucao: "E-Kids dá FP por tarefas e responsabilidades",
      beneficio: "Criança entende: esforço gera recompensa",
      hashtags: ["#ValorDoTrabalho", "#Esforco", "#ResponsabilidadeFinanceira"]
    },
    {
      titulo: "Planejamento financeiro infantil",
      problema: "Criança quer tudo AGORA",
      consequencia: "Impulsividade financeira na vida adulta",
      solucao: "E-Kids ensina: poupar para objetivos maiores",
      beneficio: "Criança planeja, espera, conquista - e valoriza mais!",
      hashtags: ["#Planejamento", "#ObjetivosFinanceiros", "#GratificacaoAdiada"]
    },
    {
      titulo: "Doar também é importante",
      problema: "Criança só pensa em acumular",
      consequencia: "Adulto egoísta e materialista",
      solucao: "E-Kids incentiva doações e atos de generosidade",
      beneficio: "Criança equilibrada: ganha, poupa, gasta E doa",
      hashtags: ["#Generosidade", "#Doacao", "#EducacaoFinanceiraCompleta"]
    }
  ],

  // ==========================================
  // TEMA 6: Rotina e Organização
  // ==========================================
  rotinaOrganizacao: [
    {
      titulo: "Caos todos os dias",
      problema: "Criança sem rotina, tudo é briga",
      consequencia: "Estresse familiar, criança ansiosa",
      solucao: "E-Kids transforma rotina em checklist gamificado",
      beneficio: "Criança segue rotina sozinha e com prazer",
      hashtags: ["#RotinaInfantil", "#Organizacao", "#VidaOrganizada"]
    },
    {
      titulo: "Quarto = zona de guerra",
      problema: "Criança deixa tudo jogado, não organiza nada",
      consequencia: "Perde coisas, pais fazem tudo",
      solucao: "E-Kids gamifica: 'Missão Organização' com recompensa",
      beneficio: "Criança arruma quarto sem ser mandada!",
      hashtags: ["#OrganizacaoInfantil", "#QuartoOrganizado", "#Autonomia"]
    },
    {
      titulo: "Tarefas de casa? Só com briga",
      problema: "Pais brigam para criança fazer qualquer coisa",
      consequencia: "Desgaste familiar constante",
      solucao: "E-Kids torna tarefas divertidas e recompensadoras",
      beneficio: "Criança faz tarefas por vontade própria",
      hashtags: ["#TarefasDomesticas", "#CriancaAjudante", "#ResponsabilidadeInfantil"]
    },
    {
      titulo: "Hora de dormir = batalha",
      problema: "Criança resiste, adia, faz birra",
      consequencia: "Dorme tarde, cansaço, irritação",
      solucao: "E-Kids cria rotina de sono com recompensas",
      beneficio: "Criança dorme na hora certa, descansada",
      hashtags: ["#SonoInfantil", "#RotinaDeSono", "#CriancaDescansada"]
    },
    {
      titulo: "Gestão de tempo? Nem existe",
      problema: "Criança não sabe quanto tempo tem para brincar/estudar",
      consequencia: "Não cumpre prazos, sempre atrasada",
      solucao: "E-Kids ensina gestão de tempo através de missões temporizadas",
      beneficio: "Criança entende tempo e cumpre horários",
      hashtags: ["#GestaoTempo", "#Pontualidade", "#OrganizacaoInfantil"]
    }
  ],

  // ==========================================
  // TEMA 7: Corpo e Saúde
  // ==========================================
  corpoSaude: [
    {
      titulo: "Sedentarismo infantil crescente",
      problema: "Criança prefere tela a movimento",
      consequencia: "Obesidade, problemas de saúde, baixa autoestima",
      solucao: "E-Kids gamifica atividade física com desafios",
      beneficio: "Criança se movimenta e se diverte",
      hashtags: ["#AtividadeFisica", "#SaudeInfantil", "#MovimentoInfantil"]
    },
    {
      titulo: "Não quer comer saudável",
      problema: "Criança só aceita ultraprocessados",
      consequencia: "Deficiências nutricionais, doenças",
      solucao: "E-Kids cria missões de experimentar alimentos novos",
      beneficio: "Criança se abre para alimentação saudável",
      hashtags: ["#AlimentacaoInfantil", "#ComerSaudavel", "#NutricaoInfantil"]
    },
    {
      titulo: "Higiene? Só com lembretes",
      problema: "Esquecer de escovar dentes, tomar banho, lavar mãos",
      consequencia: "Problemas dentários e de saúde",
      solucao: "E-Kids cria checklist diário de higiene com FP",
      beneficio: "Criança cuida da higiene sem precisar ser lembrada",
      hashtags: ["#HigieneInfantil", "#SaudeBucal", "#CuidadosPessoais"]
    },
    {
      titulo: "Postura? Que é isso?",
      problema: "Criança fica corcunda no celular/tablet",
      consequencia: "Problemas posturais desde cedo",
      solucao: "E-Kids ensina postura adequada de forma lúdica",
      beneficio: "Criança consciente do próprio corpo",
      hashtags: ["#Postura", "#SaudePostural", "#CorporalInfantil"]
    },
    {
      titulo: "Conhecendo o próprio corpo",
      problema: "Criança não sabe nomear partes do corpo corretamente",
      consequencia: "Dificuldade de comunicar dores e desconfortos",
      solucao: "E-Kids ensina anatomia básica de forma adequada",
      beneficio: "Criança conhece e respeita o próprio corpo",
      hashtags: ["#EducacaoSexual", "#CorpoHumano", "#AnatomiaInfantil"]
    }
  ],

  // ==========================================
  // TEMA 8: Criatividade e Expressão
  // ==========================================
  criatividadeExpressao: [
    {
      titulo: "Só consome, não cria",
      problema: "Criança passa horas assistindo, nunca criando",
      consequencia: "Criatividade atrofiada, passividade",
      solucao: "E-Kids incentiva desenhos, histórias, invenções",
      beneficio: "Criança criadora, não só consumidora",
      hashtags: ["#Criatividade", "#ExpressaoInfantil", "#CriadoraDeConteudo"]
    },
    {
      titulo: "Medo de errar ao criar",
      problema: "Criança não desenha/cria com medo de 'ficar feio'",
      consequencia: "Bloqueio criativo, baixa autoestima",
      solucao: "E-Kids celebra o processo, não perfeição",
      beneficio: "Criança cria livremente, sem medo",
      hashtags: ["#ProcessoCriativo", "#SemMedoDeErrar", "#LiberdadeCriativa"]
    },
    {
      titulo: "Expressão artística zero",
      problema: "Criança não tem oportunidade de se expressar",
      consequencia: "Emoções reprimidas, falta de identidade",
      solucao: "E-Kids oferece espaço para arte, música, escrita",
      beneficio: "Criança se expressa e se conhece melhor",
      hashtags: ["#ArteInfantil", "#ExpressaoArtistica", "#Autoconhecimento"]
    },
    {
      titulo: "Imaginação podada",
      problema: "Tudo é literal, criança não inventa mais",
      consequencia: "Adulto sem criatividade para resolver problemas",
      solucao: "E-Kids estimula histórias, faz de conta, invenções",
      beneficio: "Criança com imaginação fértil e livre",
      hashtags: ["#Imaginacao", "#FazDeConta", "#BrincarLivre"]
    },
    {
      titulo: "Não sabe se expressar",
      problema: "Criança guarda sentimentos, não sabe comunicar",
      consequencia: "Frustração, birras, isolamento",
      solucao: "E-Kids ensina expressão através de desenho, escrita, fala",
      beneficio: "Criança que comunica o que sente",
      hashtags: ["#ComunicacaoInfantil", "#ExpressaoEmocional", "#Comunicacao"]
    }
  ],

  // ==========================================
  // TEMA 9: Amizade e Relacionamentos
  // ==========================================
  amizadeRelacionamentos: [
    {
      titulo: "Dificuldade em fazer amigos",
      problema: "Criança tímida ou agressiva, afasta colegas",
      consequencia: "Isolamento, baixa autoestima, solidão",
      solucao: "E-Kids ensina habilidades sociais passo a passo",
      beneficio: "Criança faz e mantém amizades saudáveis",
      hashtags: ["#AmizadeInfantil", "#HabilidadesSociais", "#Socializacao"]
    },
    {
      titulo: "Não sabe compartilhar",
      problema: "Tudo é 'meu', gera conflitos",
      consequencia: "Criança rejeitada por colegas",
      solucao: "E-Kids gamifica o compartilhar com recompensas",
      beneficio: "Criança aprende generosidade e cooperação",
      hashtags: ["#Compartilhar", "#Generosidade", "#ConvivenciaInfantil"]
    },
    {
      titulo: "Conflitos = briga física",
      problema: "Criança não sabe resolver desentendimentos com palavras",
      consequencia: "Agressividade, punições, rejeição",
      solucao: "E-Kids ensina resolução de conflitos pacífica",
      beneficio: "Criança conversa, negocia, resolve",
      hashtags: ["#ResolucaoConflitos", "#ComunicacaoNaoViolenta", "#PazInfantil"]
    },
    {
      titulo: "Bullying: sofre ou pratica",
      problema: "Criança é vítima ou agressor - ambos precisam de ajuda",
      consequencia: "Traumas, baixa autoestima, agressividade",
      solucao: "E-Kids ensina empatia, limites e quando pedir ajuda",
      beneficio: "Criança protegida e respeitosa",
      hashtags: ["#AntiB ullying", "#Empatia", "#Respeito"]
    },
    {
      titulo: "Amizades tóxicas",
      problema: "Criança não identifica relações prejudiciais",
      consequencia: "Abuso emocional, baixa autoestima",
      solucao: "E-Kids ensina sinais de amizade saudável vs tóxica",
      beneficio: "Criança escolhe amigos que fazem bem",
      hashtags: ["#AmizadesSaudaveis", "#RelacionamentosSaudaveis", "#LimitesNasAmizades"]
    }
  ],

  // ==========================================
  // TEMA 10: Tecnologia Consciente
  // ==========================================
  tecnologiaConsciente: [
    {
      titulo: "Viciado em telas",
      problema: "Criança passa 6+ horas por dia em dispositivos",
      consequencia: "Problemas de visão, atenção, relacionamento",
      solucao: "E-Kids oferece diversão educativa com tempo controlado",
      beneficio: "Criança usa tela com propósito e moderação",
      hashtags: ["#TempoDetela", "#UsoConsciente", "#EquilibrioDigital"]
    },
    {
      titulo: "Conteúdo inadequado",
      problema: "Criança acessa qualquer coisa sem supervisão",
      consequencia: "Exposição a violência, sexo, ideias prejudiciais",
      solucao: "E-Kids oferece ambiente 100% seguro e supervisionado",
      beneficio: "Pais tranquilos, criança protegida",
      hashtags: ["#ConteudoSeguro", "#ProtecaoInfantil", "#InternetSegura"]
    },
    {
      titulo: "Jogos violentos",
      problema: "Criança exposta a violência gráfica desde cedo",
      consequencia: "Dessensibilização, agressividade",
      solucao: "E-Kids oferece jogos educativos e não-violentos",
      beneficio: "Diversão que ensina, não traumatiza",
      hashtags: ["#JogosEducativos", "#SemViolencia", "#DiversaoSaudavel"]
    },
    {
      titulo: "Cyberbullying",
      problema: "Criança sofre ou pratica bullying online",
      consequencia: "Trauma, ansiedade, depressão infantil",
      solucao: "E-Kids ensina cidadania digital e empatia online",
      beneficio: "Criança respeitosa e protegida no ambiente digital",
      hashtags: ["#CidadaniaDigital", "#CyberbullyingNao", "#InternetSegura"]
    },
    {
      titulo: "Vício em jogos",
      problema: "Criança joga compulsivamente, negligencia vida real",
      consequencia: "Isolamento, problemas escolares, saúde",
      solucao: "E-Kids equilibra jogo educativo com vida real",
      beneficio: "Tecnologia como ferramenta, não escape",
      hashtags: ["#EquilibrioDigital", "#SemVicio", "#VidaReal"]
    }
  ],

  // ==========================================
  // TEMA 11: Autoestima e Confiança
  // ==========================================
  autoestimaConfianca: [
    {
      titulo: "Não acredita em si mesmo",
      problema: "Criança sempre diz: 'Não consigo', 'Sou burro'",
      consequencia: "Não tenta, não aprende, fica pra trás",
      solucao: "E-Kids celebra CADA conquista, mostra progresso visual",
      beneficio: "Criança confiante: 'Eu sou capaz!'",
      hashtags: ["#Autoestima", "#Confianca", "#EuConsigo"]
    },
    {
      titulo: "Comparação destrutiva",
      problema: "Criança se compara com colegas, se acha inferior",
      consequencia: "Inveja, baixa autoestima, desistência",
      solucao: "E-Kids foca em crescimento individual, não competição",
      beneficio: "Criança compete consigo mesma, não com outros",
      hashtags: ["#SemComparacao", "#CrescimentoPessoal", "#AutoestimaInfantil"]
    },
    {
      titulo: "Medo de errar",
      problema: "Criança tem pavor de fazer algo errado",
      consequencia: "Paralisia, não tenta nada novo",
      solucao: "E-Kids normaliza erro como parte do aprendizado",
      beneficio: "Criança arrisca, erra, aprende, cresce",
      hashtags: ["#ErrarEAprender", "#SemMedoDeErrar", "#Resiliencia"]
    },
    {
      titulo: "Perfeccionismo infantil",
      problema: "Criança se frustra se não fica perfeito",
      consequencia: "Ansiedade, desistência, sofrimento",
      solucao: "E-Kids valoriza esforço, não perfeição",
      beneficio: "Criança aprende que 'bom' é suficiente",
      hashtags: ["#SemPerfeccionismo", "#ProcessoImporta", "#SaudeEmocional"]
    },
    {
      titulo: "Opinião dos outros define tudo",
      problema: "Criança só se valoriza se outros elogiam",
      consequencia: "Dependência emocional, busca aprovação constante",
      solucao: "E-Kids ensina autovalorização independente",
      beneficio: "Criança se orgulha de si mesma, não precisa validação",
      hashtags: ["#Autovalorizacao", "#IndependenciaEmocional", "#Autoconfianca"]
    }
  ],

  // ==========================================
  // TEMA 12: Preparação para o Futuro
  // ==========================================
  preparacaoFuturo: [
    {
      titulo: "Mundo mudou, educação não",
      problema: "Escola prepara para o passado, não futuro",
      consequencia: "Jovens sem as habilidades que o mercado exige",
      solucao: "E-Kids ensina competências do século 21",
      beneficio: "Criança preparada para o futuro do trabalho",
      hashtags: ["#FuturoDoTrabalho", "#Competencias21", "#EducacaoDoFuturo"]
    },
    {
      titulo: "Inteligência artificial está aí",
      problema: "Profissões tradicionais sendo automatizadas",
      consequencia: "Jovens sem preparo para nova economia",
      solucao: "E-Kids ensina criatividade, empatia - o que IA não faz",
      beneficio: "Criança com habilidades à prova de automação",
      hashtags: ["#FuturoDoTrabalho", "#HabilidadesHumanas", "#IAeEducacao"]
    },
    {
      titulo: "Empreendedorismo desde cedo",
      problema: "Criança só pensa em 'ser empregado'",
      consequencia: "Falta de visão empreendedora",
      solucao: "E-Kids estimula criação, iniciativa, gestão de recursos",
      beneficio: "Criança pensa como empreendedor",
      hashtags: ["#EmpreendedorismoInfantil", "#MentePraEmpreender", "#Iniciativa"]
    },
    {
      titulo: "Adaptabilidade zero",
      problema: "Criança rígida, não se adapta a mudanças",
      consequencia: "Adulto que sofre com imprevistos",
      solucao: "E-Kids ensina flexibilidade através de desafios variados",
      beneficio: "Criança resiliente e adaptável",
      hashtags: ["#Adaptabilidade", "#Flexibilidade", "#Resiliencia"]
    },
    {
      titulo: "Pensamento global",
      problema: "Criança com visão limitada, local",
      consequencia: "Perder oportunidades num mundo conectado",
      solucao: "E-Kids ensina idiomas, culturas, perspectivas",
      beneficio: "Criança cidadã do mundo",
      hashtags: ["#CidadaoGlobal", "#PensamentoGlobal", "#EducacaoGlobal"]
    }
  ]
};

/**
 * CTAs MASSIVAMENTE variados
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
  },
  {
    texto1: "Criança de hoje, adulto preparado amanhã.",
    texto2: "👉 Descubra como",
    texto3: "👉 E-Kids PRO - Link na bio"
  },
  {
    texto1: "Além da escola: educação para a vida.",
    texto2: "👉 Experimente grátis",
    texto3: "👉 E-Kids PRO"
  },
  {
    texto1: "Ensine brincando, eduque para sempre.",
    texto2: "👉 Teste agora",
    texto3: "👉 Link na bio"
  },
  {
    texto1: "O futuro do seu filho começa hoje.",
    texto2: "👉 Junte-se a milhares de pais",
    texto3: "👉 E-Kids PRO"
  }
];

/**
 * Gera carrossel Instagram (1080x1080)
 */
function gerarCarrosselInstagram(tema, index = 0) {
  if (!carouselContent[tema]) {
    throw new Error(`Tema "${tema}" não encontrado`);
  }

  const conteudo = carouselContent[tema][index % carouselContent[tema].length];
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
  if (!carouselContent[tema]) {
    throw new Error(`Tema "${tema}" não encontrado`);
  }

  const conteudo = carouselContent[tema][index % carouselContent[tema].length];
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
 * Lista todos os temas disponíveis
 */
function listarTemas() {
  return Object.keys(carouselContent).map(key => ({
    chave: key,
    nome: key.replace(/([A-Z])/g, ' $1').trim(),
    variacoes: carouselContent[key].length
  }));
}

/**
 * Gera todos os carrosséis de um tema
 */
function gerarTodosCarrosselsTema(tema) {
  if (!carouselContent[tema]) {
    throw new Error(`Tema "${tema}" não encontrado`);
  }

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
 * Estatísticas do gerador
 */
function estatisticas() {
  const temas = Object.keys(carouselContent);
  const totalVariacoes = temas.reduce((sum, tema) => sum + carouselContent[tema].length, 0);
  const totalCarrosseis = totalVariacoes * 2; // Instagram + TikTok

  return {
    temas: temas.length,
    variacoes: totalVariacoes,
    carrosseisUnicos: totalCarrosseis,
    ctasDisponiveis: ctas.length,
    hashtagsUnicas: [...new Set(temas.flatMap(t => carouselContent[t].flatMap(c => c.hashtags)))].length
  };
}

module.exports = {
  carouselContent,
  ctas,
  gerarCarrosselInstagram,
  gerarCarrosselTikTok,
  gerarTodosCarrosselsTema,
  listarTemas,
  estatisticas
};
