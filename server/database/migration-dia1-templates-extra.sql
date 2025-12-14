-- ============================================
-- E-KIDS PRO - TEMPLATES EXTRAS (continuação)
-- Mais 30+ templates para atingir 50+ totais
-- ============================================

-- ============================================
-- ÁREA EMOTIONS - Templates avançados
-- ============================================
INSERT OR IGNORE INTO mission_templates (area, difficulty, prompt_template, optionA_template, optionB_template, optionC_template, feedbackA_template, feedbackB_template, feedbackC_template, variables, fp_base, tags, is_active)
VALUES
('emotions', 4, 'Você está {emocao} antes de {evento}. Isso é normal?', 'Sim, é natural sentir assim', 'Sim, e posso me preparar', 'Sim, muita gente sente isso', 'Muito bem! Reconhecer é o primeiro passo!', 'Ótimo! Preparação ajuda!', 'Perfeito! Você não está sozinho!', '{"emocao": ["nervoso", "ansioso", "empolgado", "preocupado"], "evento": ["uma apresentação", "uma prova", "conhecer gente nova", "um desafio"]}', 18, '["emocoes", "ansiedade", "eventos"]', 1),

('emotions', 5, 'Você sente ciúmes porque {situacao}. Como lidar?', 'Converso sobre meus sentimentos', 'Penso que todos são únicos', 'Trabalho em mim mesmo', 'Muito bem! Expressar é saudável!', 'Lindo! Cada pessoa é especial!', 'Incrível! Auto-desenvolvimento é chave!', '{"situacao": ["seu amigo está brincando com outro", "seu irmão ganhou atenção", "alguém é melhor em algo que você"]}', 22, '["emocoes", "ciumes", "auto-estima"]', 1),

('emotions', 6, 'Você precisa fazer {tarefa} mas está sem vontade. O que te motiva?', 'Pensar no resultado positivo', 'Começar devagar', 'Pedir apoio de alguém', 'Muito bem! Visualizar ajuda!', 'Ótimo! Começar é o mais difícil!', 'Perfeito! Apoio faz diferença!', '{"tarefa": ["lição de casa", "arrumar o quarto", "praticar algo", "ajudar em casa"]}', 20, '["emocoes", "motivacao", "disciplina"]', 1),

('emotions', 7, 'Você cometeu um erro em {situacao}. Como você lida?', 'Assumo e aprendo com isso', 'Peço desculpas se preciso', 'Penso em como fazer diferente', 'Excelente! Responsabilidade é maturidade!', 'Muito bem! Pedir desculpas é importante!', 'Ótimo! Erros são aprendizados!', '{"situacao": ["uma brincadeira", "a escola", "casa", "com um amigo"]}', 24, '["emocoes", "erros", "responsabilidade"]', 1),

('emotions', 8, 'Você se sente {emocao_negativa} sobre {aspecto}. O que te ajuda?', 'Conversar com alguém que me entende', 'Focar no que posso melhorar', 'Lembrar das minhas qualidades', 'Muito bem! Apoio faz diferença!', 'Ótimo! Foco no crescimento!', 'Perfeito! Auto-aceitação é amor próprio!', '{"emocao_negativa": ["inseguro", "mal", "diferente"], "aspecto": ["minha aparência", "minhas habilidades", "ser diferente"]}', 25, '["emocoes", "auto-estima", "aceitacao"]', 1),

-- ============================================
-- ÁREA SAFETY - Templates avançados
-- ============================================
('safety', 6, '{pessoa} pede para você {acao} mas diz "não conte para ninguém". O que fazer?', 'Não guardo segredos que me deixam desconfortável', 'Conto para um adulto de confiança', 'Digo NÃO e me afasto', 'Muito bem! Segredos ruins não devem ser guardados!', 'Perfeito! Adultos podem te proteger!', 'Ótimo! Você tem esse direito!', '{"pessoa": ["Alguém", "Uma pessoa"], "acao": ["guardar um segredo", "fazer algo estranho", "esconder algo"]}', 25, '["seguranca", "segredos", "protecao"]', 1),

('safety', 5, 'Você está em {lugar} e algo te deixa desconfortável. O que fazer?', 'Saio da situação', 'Procuro um adulto de confiança', 'Confio no meu instinto', 'Muito bem! Remover-se é inteligente!', 'Ótimo! Buscar ajuda é sempre bom!', 'Perfeito! Seu instinto te protege!', '{"lugar": ["uma festa", "a casa de alguém", "um lugar público", "online"]}', 22, '["seguranca", "instinto", "desconforto"]', 1),

('safety', 7, 'Alguém tenta te fazer sentir {sentimento} para conseguir {objetivo}. Como reagir?', 'Reconheço a manipulação', 'Digo não com firmeza', 'Busco ajuda de um adulto', 'Excelente! Você reconhece táticas manipulativas!', 'Muito bem! Firmeza é proteção!', 'Ótimo! Adultos podem ajudar!', '{"sentimento": ["culpado", "com medo", "obrigado"], "objetivo": ["algo de você", "que você faça algo", "que guarde segredo"]}', 28, '["seguranca", "manipulacao", "limites"]', 1),

('safety', 4, 'Você vê {situacao_perigo} acontecendo. O que fazer?', 'Não me envolvo diretamente', 'Chamo um adulto imediatamente', 'Ligo para emergência se necessário', 'Muito bem! Segurança em primeiro lugar!', 'Perfeito! Adultos sabem lidar!', 'Ótimo! Conhecer emergências é importante!', '{"situacao_perigo": ["uma briga", "alguém machucado", "um acidente", "algo perigoso"]}', 20, '["seguranca", "emergencias", "ajuda"]', 1),

('safety', 6, 'Na internet, você vê {conteudo}. O que fazer?', 'Fecho e não compartilho', 'Falo com meus pais sobre isso', 'Bloqueio/denuncio se necessário', 'Muito bem! Não espalhar é importante!', 'Ótimo! Transparência com pais é essencial!', 'Perfeito! Denunciar protege outros!', '{"conteudo": ["algo inadequado", "cyberbullying", "algo suspeito", "conteúdo impróprio"]}', 24, '["seguranca", "internet", "conteudo"]', 1),

-- ============================================
-- ÁREA BODY - Templates avançados
-- ============================================
('body', 6, 'Você está praticando {esporte} e sente {sintoma}. O que fazer?', 'Paro e descanso', 'Aviso alguém', 'Bebo água e observo', 'Muito bem! Ouvir o corpo é importante!', 'Ótimo! Comunicar é essencial!', 'Bom! Hidratação e atenção!', '{"esporte": ["um esporte", "exercício", "uma atividade"], "sintoma": ["dor", "muito cansaço", "tontura", "falta de ar"]}', 22, '["corpo", "exercicio", "limites"]', 1),

('body', 5, 'Para ter ossos fortes, o que ajuda?', 'Alimentos ricos em cálcio', 'Tomar sol (vitamina D)', 'Fazer exercícios', 'Muito bem! Cálcio constrói ossos!', 'Ótimo! Vitamina D é essencial!', 'Perfeito! Movimento fortalece!', '{}', 20, '["corpo", "saude", "ossos"]', 1),

('body', 4, 'Você vai {acao} em um dia de {clima}. O que é importante?', 'Usar protetor solar', 'Beber bastante água', 'Usar roupas adequadas', 'Muito bem! Proteção solar é essencial!', 'Ótimo! Hidratação é fundamental!', 'Perfeito! Vestir-se adequadamente ajuda!', '{"acao": ["brincar", "fazer esporte", "ficar"], "clima": ["sol forte", "muito calor", "calor"]}', 18, '["corpo", "clima", "protecao"]', 1),

('body', 7, 'Você percebe mudanças em seu {aspecto_corpo}. Como você se sente?', 'É normal, meu corpo está crescendo', 'Posso conversar com adultos sobre isso', 'Cada pessoa cresce no seu tempo', 'Muito bem! Mudanças são normais!', 'Ótimo! Conversar tira dúvidas!', 'Perfeito! Cada um é único!', '{"aspecto_corpo": ["corpo", "altura", "peso", "voz"]}', 25, '["corpo", "puberdade", "mudancas"]', 1),

('body', 3, 'Higiene pessoal é importante. O que você faz diariamente?', 'Tomo banho', 'Escovo os dentes', 'Lavo as mãos', 'Muito bem! Limpeza é saúde!', 'Ótimo! Dentes limpos são saudáveis!', 'Perfeito! Mãos limpas evitam doenças!', '{}', 15, '["corpo", "higiene", "rotina"]', 1),

-- ============================================
-- ÁREA CREATIVITY - Templates avançados
-- ============================================
('creativity', 5, 'Você quer criar algo único. O que te inspira?', '{fonte_inspiracao}', 'Combinar ideias diferentes', 'Experimentar sem medo', 'Lindo! Inspiração vem de {fonte_inspiracao}!', 'Incrível! Combinações criam novidade!', 'Perfeito! Experimentar é criar!', '{"fonte_inspiracao": ["A natureza", "Histórias que ouço", "Pessoas ao meu redor", "Meus sentimentos"]}', 20, '["criatividade", "inspiracao", "originalidade"]', 1),

('creativity', 6, 'Você quer melhorar em {habilidade}. Como você pratica?', 'Pratico um pouco todo dia', 'Observo quem faz bem', 'Aceito que vou errar no começo', 'Muito bem! Consistência traz progresso!', 'Ótimo! Aprender com outros enriquece!', 'Perfeito! Erros fazem parte!', '{"habilidade": ["desenho", "música", "escrita", "dança", "construção"]}', 22, '["criatividade", "pratica", "melhoria"]', 1),

('creativity', 4, 'Você pode criar {projeto} usando {recurso}. Como começar?', 'Planejo primeiro', 'Começo e ajusto no caminho', 'Peço ideias e faço à minha maneira', 'Ótimo! Planejar organiza!', 'Legal! Aprender fazendo!', 'Muito bem! Colaboração + originalidade!', '{"projeto": ["uma história", "uma invenção", "uma obra de arte"], "recurso": ["materiais simples", "sucata", "o que tenho"]}', 18, '["criatividade", "projetos", "recursos"]', 1),

('creativity', 7, 'Você quer expressar {tema} de forma criativa. Que formato escolhe?', 'Visual (desenho/pintura)', 'Sonoro (música/sons)', 'Narrativo (história/teatro)', 'Lindo! Imagens falam muito!', 'Incrível! Sons tocam a alma!', 'Maravilhoso! Palavras criam mundos!', '{"tema": ["uma ideia", "um sentimento", "uma mensagem", "uma história"]}', 25, '["criatividade", "expressao", "formatos"]', 1),

('creativity', 8, 'Sua criação pode {impacto}. Como você se sente sobre isso?', 'Feliz em poder contribuir', 'Responsável pelo que crio', 'Inspirado a criar mais', 'Lindo! Criatividade é poder!', 'Muito bem! Consciência criativa!', 'Incrível! Inspiração gera mais criação!', '{"impacto": ["inspirar outros", "fazer alguém feliz", "ensinar algo", "mudar algo"]}', 28, '["criatividade", "impacto", "proposito"]', 1),

-- ============================================
-- ÁREA LANGUAGES - Templates avançados
-- ============================================
('languages', 4, 'Complete a frase em {idioma}: "I {verbo} {objeto}"', 'like apples', 'love music', 'eat breakfast', 'Great! "I like apples!" 🍎', 'Perfect! "I love music!" 🎵', 'Good! "I eat breakfast!" 🍳', '{"idioma": ["inglês"], "verbo": ["like", "love", "eat"], "objeto": ["apples", "music", "breakfast"]}', 18, '["idiomas", "ingles", "frases"]', 1),

('languages', 5, 'Em {idioma}, como você diria "{frase}"?', '{traducao_certa}', '{traducao_errada1}', '{traducao_errada2}', '¡Perfecto! {traducao_certa}!', 'Casi! Tente outra vez.', 'No exactamente. Tente novamente.', '{"idioma": ["espanhol"], "frase": ["Como você está?", "Tenha um bom dia", "Até logo"], "traducao_certa": ["¿Cómo estás?", "Que tengas un buen día", "Hasta luego"], "traducao_errada1": ["¿Qué tal?", "Buenos días", "Adiós"], "traducao_errada2": ["¿Cómo te llamas?", "Buenas noches", "Nos vemos"]}', 22, '["idiomas", "espanhol", "conversacao"]', 1),

('languages', 3, 'Números em {idioma}: quanto é {numero}?', '{numero_traducao}', '{numero_errado1}', '{numero_errado2}', 'Excellent! {numero_traducao}! 🎯', 'Oops! Tente outro número.', 'Not quite! Tente de novo.', '{"idioma": ["inglês"], "numero": ["cinco", "dez", "vinte"], "numero_traducao": ["five", "ten", "twenty"], "numero_errado1": ["four", "nine", "twelve"], "numero_errado2": ["six", "eleven", "thirty"]}', 15, '["idiomas", "numeros", "ingles"]', 1),

('languages', 6, '{idioma} tem palavras parecidas com português. Qual dessas é um "falso cognato"?', '{falso_cognato}', '{cognato_verdadeiro1}', '{cognato_verdadeiro2}', 'Muito bem! {falso_cognato} não significa o que parece!', 'Essa é parecida mesmo!', 'Essa também é um cognato verdadeiro!', '{"idioma": ["Inglês"], "falso_cognato": ["Push (empurrar, não puxar)", "Actually (na verdade, não atualmente)", "Pretend (fingir, não pretender)"], "cognato_verdadeiro1": ["Music (música)", "Animal (animal)", "Chocolate (chocolate)"], "cognato_verdadeiro2": ["Family (família)", "Color (cor)", "Important (importante)"]}', 24, '["idiomas", "vocabulario", "falsos-cognatos"]', 1),

('languages', 7, 'Para aprender {idioma} melhor, o que ajuda?', 'Praticar todos os dias', 'Ouvir músicas e ver vídeos', 'Conversar quando possível', 'Perfect! Practice makes perfect!', '¡Excelente! Immersion helps a lot!', 'Great! Speaking is learning!', '{"idioma": ["um novo idioma", "inglês", "espanhol"]}', 25, '["idiomas", "aprendizagem", "dicas"]', 1);

-- ============================================
-- ÁREA NOVA: FRIENDSHIP (Amizade)
-- ============================================
INSERT OR IGNORE INTO mission_templates (area, difficulty, prompt_template, optionA_template, optionB_template, optionC_template, feedbackA_template, feedbackB_template, feedbackC_template, variables, fp_base, tags, is_active)
VALUES
('friendship', 2, 'Seu amigo está {situacao}. Como você pode ser um bom amigo?', 'Ofereço ajuda', 'Fico por perto', 'Pergunto como posso ajudar', 'Lindo! Oferecer ajuda é amizade!', 'Muito bem! Presença é apoio!', 'Ótimo! Perguntar mostra interesse!', '{"situacao": ["com dificuldade em algo", "passando por momento difícil", "precisando de apoio"]}', 12, '["amizade", "empatia", "apoio"]', 1),

('friendship', 3, 'Você e seu amigo querem fazer coisas diferentes. Como resolver?', 'Conversamos e decidimos juntos', 'Fazemos as duas coisas', 'Cada um faz o que quer dessa vez', 'Muito bem! Diálogo é importante!', 'Ótimo! Compromisso é bom!', 'Legal! Respeitar diferenças é amizade!', '{}', 15, '["amizade", "conflitos", "negociacao"]', 1),

('friendship', 4, 'Um amigo fez algo que te magoou. O que fazer?', 'Converso com ele sobre meus sentimentos', 'Dou um tempo mas depois conversamos', 'Penso se foi sem querer', 'Muito bem! Comunicação resolve!', 'Ótimo! Tempo ajuda a processar!', 'Bom! Intenção importa!', '{}', 18, '["amizade", "magoa", "perdao"]', 1),

('friendship', 5, 'Como ser um bom amigo quando {situacao}?', 'Sendo honesto mas gentil', 'Respeitando seus sentimentos', 'Apoiando suas escolhas', 'Muito bem! Honestidade com gentileza!', 'Ótimo! Respeito é fundamental!', 'Lindo! Apoiar é amizade verdadeira!', '{"situacao": ["ele erra", "tem opinião diferente", "faz escolhas que eu não faria"]}', 20, '["amizade", "respeito", "apoio"]', 1);

-- ============================================
-- FIM DOS TEMPLATES EXTRAS
-- ============================================
