-- ============================================
-- E-KIDS PRO - MIGRATION DIA 1: GERADOR DE MISSÕES INFINITAS
-- ============================================

-- Tabela de Templates de Missões
CREATE TABLE IF NOT EXISTS mission_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  area TEXT NOT NULL,
  difficulty INTEGER NOT NULL CHECK(difficulty >= 1 AND difficulty <= 10),
  prompt_template TEXT NOT NULL,
  optionA_template TEXT NOT NULL,
  optionB_template TEXT NOT NULL,
  optionC_template TEXT NOT NULL,
  feedbackA_template TEXT NOT NULL,
  feedbackB_template TEXT NOT NULL,
  feedbackC_template TEXT NOT NULL,
  variables TEXT, -- JSON com variáveis possíveis: {"nome": ["Ana", "João"], "lugar": ["parque", "escola"]}
  fp_base INTEGER DEFAULT 10,
  tags TEXT, -- JSON com tags para categorização
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Adicionar campo 'is_generated' na tabela missions para diferenciar missões estáticas de geradas
ALTER TABLE missions ADD COLUMN is_generated INTEGER DEFAULT 0;

-- Adicionar campo 'template_id' para rastrear qual template gerou a missão
ALTER TABLE missions ADD COLUMN template_id INTEGER;

-- Adicionar campo 'generated_at' para saber quando foi gerada
ALTER TABLE missions ADD COLUMN generated_at TEXT;

-- Adicionar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_missions_is_generated ON missions(is_generated);
CREATE INDEX IF NOT EXISTS idx_missions_template_id ON missions(template_id);
CREATE INDEX IF NOT EXISTS idx_mission_templates_area ON mission_templates(area);

-- ============================================
-- SEED: TEMPLATES DE MISSÕES - ÁREA EMOTIONS
-- ============================================
INSERT OR IGNORE INTO mission_templates (area, difficulty, prompt_template, optionA_template, optionB_template, optionC_template, feedbackA_template, feedbackB_template, feedbackC_template, variables, fp_base, tags, is_active)
VALUES
-- Emotions - Nível 1-3 (Fácil)
('emotions', 1, 'Você está se sentindo {emocao}. O que você pode fazer?', 'Falar com alguém', 'Respirar fundo', 'Fazer algo que gosto', 'Ótimo! Falar sobre sentimentos ajuda!', 'Muito bem! Respirar acalma!', 'Perfeito! Fazer o que gosta é importante!', '{"emocao": ["feliz", "triste", "com medo", "com raiva", "ansioso", "entediado", "animado"]}', 10, '["emocoes", "basico", "sentimentos"]', 1),

('emotions', 2, '{pessoa} está se sentindo {emocao}. Como você pode ajudar?', 'Perguntar se quer conversar', 'Ficar por perto', 'Dar um abraço (se quiser)', 'Lindo! Ouvir é um presente!', 'Muito bem! Presença importa!', 'Perfeito! Respeitar limites é importante!', '{"pessoa": ["Seu amigo", "Sua irmã", "Seu irmão", "Seu colega", "Sua prima", "Seu primo"], "emocao": ["triste", "com medo", "nervoso", "chateado", "sozinho"]}', 12, '["emocoes", "empatia", "amizade"]', 1),

('emotions', 2, 'Você ganhou {conquista}, mas {pessoa} não. Como você se sente?', 'Feliz, mas também penso em {pessoa}', 'Quero compartilhar minha alegria', 'Vou perguntar se {pessoa} está bem', 'Muito bem! Você é empático!', 'Lindo! Compartilhar alegria multiplica!', 'Perfeito! Cuidar dos outros é importante!', '{"conquista": ["um prêmio", "uma medalha", "elogios", "um presente"], "pessoa": ["seu amigo", "seu colega", "sua irmã", "seu irmão"]}', 12, '["emocoes", "empatia", "conquistas"]', 1),

('emotions', 3, 'Você sente {emocao1} e {emocao2} ao mesmo tempo. Isso é normal?', 'Sim! Podemos sentir várias emoções juntas', 'Sim, sentimentos são complexos', 'Sim, e tudo bem', 'Exato! Emoções podem se misturar!', 'Muito bem! Você entende seus sentimentos!', 'Perfeito! Aceitar emoções é crescer!', '{"emocao1": ["alegria", "tristeza", "empolgação", "medo"], "emocao2": ["preocupação", "nervosismo", "saudade", "cansaço"]}', 15, '["emocoes", "complexidade", "auto-conhecimento"]', 1),

('emotions', 3, 'Quando você está {emocao}, o que te ajuda a se acalmar?', 'Conversar com alguém de confiança', 'Fazer respiração profunda', 'Me distrair com {atividade}', 'Muito bem! Compartilhar ajuda!', 'Ótimo! Respiração é poderosa!', 'Legal! {atividade} é uma boa distração!', '{"emocao": ["nervoso", "ansioso", "preocupado", "estressado", "irritado"], "atividade": ["desenho", "música", "leitura", "brincadeira", "jogos"]}', 15, '["emocoes", "auto-regulacao", "calma"]', 1),

-- Emotions - Nível 4-6 (Médio)
('emotions', 4, 'Você percebe que está com {emocao} há vários dias. O que você pode fazer?', 'Conversar com um adulto de confiança', 'Escrever sobre meus sentimentos', 'Procurar ajuda profissional se precisar', 'Muito bem! Buscar apoio é importante!', 'Ótimo! Escrever ajuda a organizar!', 'Perfeito! Pedir ajuda é sinal de força!', '{"emocao": ["tristeza", "ansiedade", "medo", "preocupação", "raiva"]}', 18, '["emocoes", "persistencia", "ajuda"]', 1),

('emotions', 5, '{pessoa} disse algo que te magoou. Como você lida com isso?', 'Falo como me senti', 'Penso antes de reagir', 'Peço para conversarmos', 'Muito bem! Comunicação é chave!', 'Ótimo! Pausar é inteligente!', 'Perfeito! Diálogo resolve conflitos!', '{"pessoa": ["Um amigo", "Um colega", "Alguém da família", "Seu irmão", "Sua irmã"]}', 20, '["emocoes", "conflitos", "comunicacao"]', 1),

('emotions', 6, 'Você está feliz mas percebe que {pessoa} está {emocao}. O que fazer?', 'Perguntar se posso ajudar', 'Dar espaço mas mostrar que estou aqui', 'Oferecer fazer {atividade} junto', 'Lindo! Empatia é se importar!', 'Muito bem! Respeitar espaço é importante!', 'Ótimo! Convites gentis ajudam!', '{"pessoa": ["seu amigo", "seu irmão", "sua irmã", "seu primo"], "emocao": ["triste", "chateado", "sozinho", "nervoso"], "atividade": ["algo divertido", "uma brincadeira", "algo relaxante"]}', 20, '["emocoes", "empatia", "suporte"]', 1),

-- ============================================
-- SEED: TEMPLATES DE MISSÕES - ÁREA SAFETY
-- ============================================
('safety', 1, 'Você vê {objeto} que pode ser perigoso. O que você faz?', 'Não toco e aviso um adulto', 'Fico longe', 'Peço ajuda', 'Muito bem! Segurança em primeiro lugar!', 'Ótimo! Evitar perigo é inteligente!', 'Perfeito! Pedir ajuda é sempre bom!', '{"objeto": ["uma tomada sem proteção", "uma faca na mesa", "produtos de limpeza", "remédios", "fósforos", "um isqueiro"]}', 10, '["seguranca", "casa", "perigos"]', 1),

('safety', 2, 'Um {pessoa} que você não conhece te oferece {item}. O que fazer?', 'Digo "Não, obrigado" e me afasto', 'Aviso um adulto de confiança', 'Não aceito nada de estranhos', 'Muito bem! Você sabe se proteger!', 'Ótimo! Contar para adultos é importante!', 'Perfeito! Essa é a regra de ouro!', '{"pessoa": ["adulto", "pessoa"], "item": ["doce", "um presente", "uma carona", "ajuda"]}', 15, '["seguranca", "estranhos", "protecao"]', 1),

('safety', 2, 'Você está em {lugar} e se perde. O que você faz?', 'Fico onde estou e peço ajuda', 'Procuro um {ajudante}', 'Não saio com estranhos', 'Muito bem! Ficar no lugar ajuda a ser encontrado!', 'Ótimo! Essas pessoas podem ajudar com segurança!', 'Perfeito! Sempre mantenha essa regra!', '{"lugar": ["um shopping", "uma festa", "um parque", "a escola"], "ajudante": ["segurança", "policial", "funcionário do local"]}', 15, '["seguranca", "perdido", "ajuda"]', 1),

('safety', 3, 'Você vai {acao} sozinho pela primeira vez. O que é importante lembrar?', 'Avisar onde vou e quando volto', 'Levar telefone para contato', 'Conhecer bem o caminho', 'Muito bem! Informar ajuda na segurança!', 'Ótimo! Comunicação é importante!', 'Perfeito! Planejamento é segurança!', '{"acao": ["à casa de um amigo", "à padaria", "à escola", "comprar algo perto"]}', 18, '["seguranca", "autonomia", "responsabilidade"]', 1),

('safety', 4, 'Alguém te pede para {acao} mas você sente que não é seguro. O que fazer?', 'Digo NÃO com firmeza', 'Procuro um adulto de confiança', 'Confio no meu instinto', 'Muito bem! Você tem o direito de dizer não!', 'Ótimo! Buscar ajuda é importante!', 'Perfeito! Seu instinto te protege!', '{"acao": ["guardar um segredo", "fazer algo perigoso", "ir a um lugar sozinho", "esconder algo"]}', 20, '["seguranca", "limites", "instinto"]', 1),

('safety', 5, 'Você está online e alguém te pede {informacao}. O que você faz?', 'Nunca compartilho informações pessoais', 'Falo com meus pais antes', 'Bloqueio a pessoa', 'Muito bem! Seus dados são privados!', 'Ótimo! Sempre consulte seus pais!', 'Perfeito! Proteger-se online é importante!', '{"informacao": ["seu endereço", "senha", "fotos suas", "nome da sua escola", "telefone"]}', 22, '["seguranca", "internet", "privacidade"]', 1),

-- ============================================
-- SEED: TEMPLATES DE MISSÕES - ÁREA BODY
-- ============================================
('body', 1, 'Para ter um corpo saudável, o que é importante fazer?', 'Comer {alimento} saudáveis', 'Fazer atividade física', 'Dormir bem', 'Muito bem! Alimentação é energia!', 'Ótimo! Movimento é vida!', 'Perfeito! Descanso é essencial!', '{"alimento": ["frutas e verduras", "alimentos variados", "comida de verdade"]}', 10, '["corpo", "saude", "habitos"]', 1),

('body', 2, 'Você vai fazer {atividade}. O que é importante fazer antes?', 'Beber água', 'Alongar o corpo', 'Aquecer um pouco', 'Ótimo! Hidratação é fundamental!', 'Muito bem! Alongar evita lesões!', 'Perfeito! Aquecer prepara o corpo!', '{"atividade": ["esporte", "corrida", "uma brincadeira ativa", "dançar", "jogar bola"]}', 12, '["corpo", "exercicio", "preparacao"]', 1),

('body', 3, 'É importante cuidar da {parte}. Como você faz isso?', 'Escovo bem {quantidade} por dia', 'Vou ao dentista regularmente', 'Cuido da alimentação', 'Muito bem! Higiene é saúde!', 'Ótimo! Prevenção é importante!', 'Perfeito! O que comemos afeta tudo!', '{"parte": ["saúde bucal", "higiene dos dentes"], "quantidade": ["2 vezes", "após as refeições"]}', 15, '["corpo", "higiene", "dentes"]', 1),

('body', 4, 'Seu corpo precisa de descanso. Quantas horas você deve dormir?', '{horas} é ideal para minha idade', 'Ter horário regular para dormir', 'Evitar telas antes de dormir', 'Muito bem! Sono suficiente é importante!', 'Ótimo! Rotina ajuda a dormir melhor!', 'Perfeito! Telas atrapalham o sono!', '{"horas": ["8 a 10 horas", "Pelo menos 9 horas", "Entre 8 e 11 horas"]}', 18, '["corpo", "sono", "descanso"]', 1),

('body', 5, 'Você percebe que está {sintoma}. O que deve fazer?', 'Avisar um adulto', 'Descansar um pouco', 'Beber água e observar', 'Muito bem! Comunicar é importante!', 'Ótimo! Descanso ajuda na recuperação!', 'Bom! Hidratação e atenção ao corpo!', '{"sintoma": ["com dor de cabeça", "com dor de barriga", "muito cansado", "tonto"]}', 20, '["corpo", "sintomas", "cuidado"]', 1),

-- ============================================
-- SEED: TEMPLATES DE MISSÕES - ÁREA CREATIVITY
-- ============================================
('creativity', 1, 'Você quer criar {criacao}. O que você pode usar?', 'Minha imaginação', '{material}', 'Ideias diferentes', 'Incrível! Imaginação não tem limites!', 'Legal! {material} é ótimo para criar!', 'Muito bem! Criatividade é combinar ideias!', '{"criacao": ["um desenho", "uma história", "uma música", "uma dança"], "material": ["papel e lápis", "materiais recicláveis", "o que tenho em casa"]}', 10, '["criatividade", "arte", "expressao"]', 1),

('creativity', 2, 'Você quer fazer {projeto} mas não sabe como começar. O que fazer?', 'Começo por algo simples', 'Peço ideias para outras pessoas', 'Experimento e vejo o que acontece', 'Ótimo! Começar é o primeiro passo!', 'Muito bem! Colaboração enriquece!', 'Perfeito! Experimentar é aprender!', '{"projeto": ["uma pintura", "uma construção", "uma invenção", "um experimento"]}', 12, '["criatividade", "projetos", "iniciativa"]', 1),

('creativity', 3, 'Algo que você criou não saiu como esperava. Como você reage?', 'Tento de novo de forma diferente', 'Aprendo com o erro', 'Busco inspiração em outros lugares', 'Incrível! Persistência é chave!', 'Muito bem! Erros ensinam!', 'Ótimo! Inspiração está em toda parte!', '{}', 15, '["criatividade", "resiliencia", "aprendizado"]', 1),

('creativity', 4, 'Você pode expressar {sentimento} através de {arte}. Como seria?', 'Usando cores que representam o sentimento', 'Criando formas e movimentos', 'Contando uma história', 'Lindo! Cores falam por nós!', 'Muito bem! Arte é movimento!', 'Perfeito! Narrativas expressam emoções!', '{"sentimento": ["alegria", "tristeza", "amor", "medo", "paz"], "arte": ["pintura", "dança", "música", "desenho"]}', 18, '["criatividade", "emocoes", "expressao"]', 1),

-- ============================================
-- SEED: TEMPLATES DE MISSÕES - ÁREA LANGUAGES
-- ============================================
('languages', 1, 'Como se diz "{palavra_pt}" em {idioma}?', '{palavra_en}', '{palavra_wrong1}', '{palavra_wrong2}', 'Perfect! {palavra_en}! 🎉', 'Oops! Essa é outra palavra.', 'Oops! Tente novamente!', '{"palavra_pt": ["Olá", "Obrigado", "Bom dia"], "idioma": ["inglês"], "palavra_en": ["Hello", "Thank you", "Good morning"], "palavra_wrong1": ["Goodbye", "Please", "Good night"], "palavra_wrong2": ["Yes", "No", "Sorry"]}', 10, '["idiomas", "ingles", "basico"]', 1),

('languages', 2, 'Em {idioma}, {animal} se diz...', '{animal_traducao}', '{animal_wrong1}', '{animal_wrong2}', '¡Perfecto! {animal_traducao}! 🐾', 'Oops! Esse é outro animal.', 'Quase! Tente de novo.', '{"idioma": ["espanhol"], "animal": ["gato", "cachorro", "pássaro"], "animal_traducao": ["gato", "perro", "pájaro"], "animal_wrong1": ["perro", "gato", "pez"], "animal_wrong2": ["conejo", "caballo", "vaca"]}', 12, '["idiomas", "espanhol", "animais"]', 1),

('languages', 3, 'Qual dessas palavras em {idioma} significa "{significado}"?', '{resposta_certa}', '{resposta_errada1}', '{resposta_errada2}', 'Great! {resposta_certa} está correto!', 'Not quite! Tente outra.', 'Oops! Essa não é.', '{"idioma": ["inglês"], "significado": ["Família", "Casa", "Amigo"], "resposta_certa": ["Family", "House", "Friend"], "resposta_errada1": ["Father", "Horse", "Food"], "resposta_errada2": ["Funny", "Home", "Fruit"]}', 15, '["idiomas", "vocabulario", "traducao"]', 1);

-- ============================================
-- FIM DA MIGRATION DIA 1
-- ============================================
