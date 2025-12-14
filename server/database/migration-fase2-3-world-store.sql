-- ============================================
-- E-KIDS PRO - MIGRATION FASE 2/3 + MAPA + LOJA
-- ============================================

-- Tabela de Missões (novas Fases 2 e 3 + reestruturação)
CREATE TABLE IF NOT EXISTS missions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phase INTEGER NOT NULL,
  area TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  prompt TEXT NOT NULL,
  optionA TEXT NOT NULL,
  optionB TEXT NOT NULL,
  optionC TEXT NOT NULL,
  feedbackA TEXT NOT NULL,
  feedbackB TEXT NOT NULL,
  feedbackC TEXT NOT NULL,
  fp_reward INTEGER DEFAULT 10,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de Progresso da Criança nas Missões
CREATE TABLE IF NOT EXISTS child_mission_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  mission_id INTEGER NOT NULL,
  completed_at TEXT DEFAULT (datetime('now')),
  choice TEXT,
  fp_earned INTEGER DEFAULT 0,
  UNIQUE(child_id, mission_id),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE
);

-- Tabela de Desbloqueio de Fases
CREATE TABLE IF NOT EXISTS phases_unlock (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  phase INTEGER NOT NULL,
  unlocked INTEGER DEFAULT 0,
  unlocked_at TEXT,
  UNIQUE(child_id, phase),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Tabela de Itens da Loja
CREATE TABLE IF NOT EXISTS store_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  cost_fp INTEGER NOT NULL,
  asset_key TEXT,
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de Inventário da Criança
CREATE TABLE IF NOT EXISTS child_inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  purchased_at TEXT DEFAULT (datetime('now')),
  equipped INTEGER DEFAULT 0,
  UNIQUE(child_id, item_id),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES store_items(id) ON DELETE CASCADE
);

-- Ajustar tabela savings_transactions (interesse mensal)
CREATE TABLE IF NOT EXISTS savings_interest_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  year_month TEXT NOT NULL,
  applied_at TEXT DEFAULT (datetime('now')),
  interest_fp INTEGER NOT NULL,
  UNIQUE(child_id, year_month),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- ============================================
-- SEED: MISSÕES FASE 1 (5 missões - já existem no código)
-- ============================================
INSERT OR IGNORE INTO missions (id, phase, area, title, description, prompt, optionA, optionB, optionC, feedbackA, feedbackB, feedbackC, fp_reward, is_active)
VALUES
(1, 1, 'emotions', 'Meu Jeito, Meus Limites', 'Descobrir quem você é', 'Todo mundo é diferente, e isso é ótimo! Alguns gostam de abraços, outros não. O que você prefere quando está com seus amigos?',
  'Brincar e conversar bastante', 'Ficar mais quietinho observando', 'Às vezes sim, às vezes não',
  'Que legal! Você gosta de estar com os outros!', 'Que legal! Você gosta de observar e pensar!', 'Que legal! Você sabe que pode mudar conforme o dia!',
  10, 1),

(2, 1, 'safety', 'Posso Pedir Ajuda', 'Aprender a pedir ajuda', 'Pedir ajuda não é fraqueza, é uma super força! Se você não entende algo na escola, o que você pode fazer?',
  'Perguntar para o professor', 'Pedir para um amigo explicar', 'Tentar de novo e pedir ajuda se precisar',
  'Perfeito! Os professores adoram ajudar!', 'Ótimo! Amigos podem ajudar também!', 'Muito bem! Tentar e pedir ajuda é inteligente!',
  10, 1),

(3, 1, 'body', 'Cuidando de Mim', 'Cuidar do seu corpo', 'Seu corpo é incrível! Para ele funcionar bem, o que te ajuda a se sentir bem?',
  'Dormir bem e comer legal', 'Brincar e se movimentar', 'Fazer coisas que eu gosto',
  'Isso mesmo! Seu corpo agradece!', 'Ótimo! Movimento faz bem para tudo!', 'Perfeito! Fazer o que gosta é importante!',
  10, 1),

(4, 1, 'emotions', 'Minhas Emoções', 'Entender o que você sente', 'Você sente muitas coisas: alegria, tristeza, raiva... Quando você se sente triste, o que te ajuda?',
  'Conversar com alguém', 'Fazer algo que gosta', 'Chorar um pouco',
  'Ótimo! Falar sobre sentimentos ajuda muito!', 'Legal! Às vezes precisamos de um tempo!', 'Tudo bem! Chorar é uma forma de liberar tristeza!',
  10, 1),

(5, 1, 'creativity', 'Desafios Positivos', 'Aprender com desafios', 'Desafios são treinos para o cérebro! Se você tentar algo e não conseguir, o que você pensa?',
  'Vou tentar de novo!', 'Vou pedir uma dica', 'Vou treinar mais',
  'Incrível! Essa é a atitude de crescimento!', 'Muito bem! Pedir dicas é inteligente!', 'Ótimo! Treinar é o caminho!',
  10, 1);

-- ============================================
-- SEED: MISSÕES FASE 2 (10 missões)
-- ============================================
INSERT OR IGNORE INTO missions (id, phase, area, title, description, prompt, optionA, optionB, optionC, feedbackA, feedbackB, feedbackC, fp_reward, is_active)
VALUES
(11, 2, 'safety', 'Aprendendo a Dizer NÃO', 'Você tem o direito de dizer não', 'Se alguém pedir para você fazer algo que você não quer, o que você pode fazer?',
  'Dizer NÃO com calma', 'Explicar que não quer', 'Pedir ajuda a um adulto',
  'Perfeito! Você tem o direito de dizer não!', 'Ótimo! Explicar seus limites é importante!', 'Muito bem! Buscar ajuda é sempre uma boa ideia!',
  15, 1),

(12, 2, 'safety', 'Segurança na Piscina', 'Cuidados na água', 'A piscina é divertida, mas precisa de cuidados. O que você deve fazer antes de entrar na água?',
  'Ver se tem um adulto por perto', 'Checar se sei nadar bem naquele lugar', 'Nunca entrar sozinho',
  'Muito bem! Adultos garantem a segurança!', 'Ótimo! Conhecer seus limites é importante!', 'Perfeito! Nunca entre na água sozinho!',
  15, 1),

(13, 2, 'safety', 'Cuidado com Tomadas', 'Eletricidade é perigosa', 'Você vê uma tomada sem proteção. O que você faz?',
  'Não colocar dedos ou objetos', 'Avisar um adulto', 'Ficar longe',
  'Muito bem! Eletricidade é perigosa!', 'Ótimo! Adultos podem proteger a tomada!', 'Perfeito! Segurança em primeiro lugar!',
  15, 1),

(14, 2, 'safety', 'Fogão e Panelas Quentes', 'Cozinha tem perigos', 'Você vê uma panela no fogão. O que você deve fazer?',
  'Não tocar, pode estar quente', 'Pedir para um adulto pegar', 'Ficar longe do fogão',
  'Muito bem! Panelas quentes causam queimaduras!', 'Ótimo! Adultos sabem mexer com segurança!', 'Perfeito! O fogão não é lugar de brincar!',
  15, 1),

(15, 2, 'safety', 'Produtos de Limpeza', 'Nunca beba ou cheire produtos', 'Você vê um produto colorido embaixo da pia. O que fazer?',
  'Não abrir nem cheirar', 'Avisar um adulto', 'Deixar onde está',
  'Muito bem! Produtos de limpeza são tóxicos!', 'Ótimo! Adultos sabem o que é seguro!', 'Perfeito! Deixe onde está!',
  15, 1),

(16, 2, 'safety', 'Remédios Não São Balas', 'Cuidado com remédios', 'Você encontra um vidro com comprimidos. O que você faz?',
  'Não pegar nem abrir', 'Avisar um adulto imediatamente', 'Deixar onde estava',
  'Muito bem! Remédios só com adulto responsável!', 'Ótimo! Adultos sabem o que é seguro!', 'Perfeito! Nunca tome remédios sozinho!',
  15, 1),

(17, 2, 'body', 'Movimente-se!', 'Atividade física é importante', 'Fazer exercícios te deixa mais forte! O que você gosta de fazer?',
  'Correr e pular', 'Dançar', 'Jogar bola',
  'Incrível! Movimento é vida!', 'Ótimo! Dançar é diversão e exercício!', 'Legal! Esportes são ótimos!',
  15, 1),

(18, 2, 'emotions', 'Reconhecendo o Medo', 'Medo é um sentimento normal', 'Quando você sente medo, o que te ajuda?',
  'Falar com alguém de confiança', 'Respirar fundo', 'Lembrar que não estou sozinho',
  'Muito bem! Compartilhar medos ajuda!', 'Ótimo! Respirar acalma o corpo!', 'Perfeito! Você nunca está sozinho!',
  15, 1),

(19, 2, 'emotions', 'Alegria e Gratidão', 'Celebrar as pequenas vitórias', 'O que te deixa feliz hoje?',
  'Brincar com amigos', 'Aprender coisas novas', 'Estar com minha família',
  'Que lindo! Amigos são especiais!', 'Incrível! Aprender é crescer!', 'Maravilhoso! Família é importante!',
  15, 1),

(20, 2, 'creativity', 'Criando Histórias', 'Use sua imaginação', 'Se você pudesse criar uma história, sobre o que seria?',
  'Uma aventura', 'Amizade', 'Magia e fantasia',
  'Legal! Aventuras são emocionantes!', 'Lindo! Amizade é um tema poderoso!', 'Incrível! Imaginação não tem limites!',
  15, 1);

-- ============================================
-- SEED: MISSÕES FASE 3 (15 missões)
-- ============================================
INSERT OR IGNORE INTO missions (id, phase, area, title, description, prompt, optionA, optionB, optionC, feedbackA, feedbackB, feedbackC, fp_reward, is_active)
VALUES
(31, 3, 'safety', 'Desafios Perigosos na Internet', 'Alguns desafios são perigosos', 'Você vê um desafio online de comer pimenta ou canela. O que você faz?',
  'Não faço, isso é perigoso', 'Falo com um adulto sobre isso', 'Ignoro e bloqueio',
  'Muito bem! Isso pode machucar você!', 'Ótimo! Adultos podem te proteger!', 'Perfeito! Desafios perigosos devem ser ignorados!',
  20, 1),

(32, 3, 'safety', 'Brincadeiras Seguras', 'Brincar com segurança', 'Seus amigos querem fazer algo perigoso. O que você faz?',
  'Digo que prefiro não fazer', 'Sugiro uma brincadeira mais segura', 'Peço ajuda a um adulto',
  'Muito bem! Você sabe seus limites!', 'Ótimo! Você pode sugerir alternativas!', 'Perfeito! Buscar ajuda é inteligente!',
  20, 1),

(33, 3, 'safety', 'Atravessando a Rua na Faixa', 'Trânsito seguro', 'Você precisa atravessar a rua. Como você faz?',
  'Procuro a faixa de pedestres', 'Olho para os dois lados', 'Espero o sinal verde',
  'Perfeito! A faixa é o lugar mais seguro!', 'Muito bem! Olhar é essencial!', 'Ótimo! O sinal protege você!',
  20, 1),

(34, 3, 'safety', 'Atravessando Sem Faixa', 'Cuidado extra', 'E se não tiver faixa perto?',
  'Procuro um lugar com boa visão', 'Olho muito bem para os dois lados', 'Peço ajuda a um adulto',
  'Muito bem! Visibilidade é importante!', 'Perfeito! Cuidado dobrado!', 'Ótimo! Adultos ajudam a avaliar!',
  20, 1),

(35, 3, 'body', 'Alongamento é Legal', 'Prepare o corpo', 'Antes de brincar ou fazer esporte, o que ajuda?',
  'Alongar o corpo', 'Beber água', 'Aquecer um pouco',
  'Muito bem! Alongar evita machucados!', 'Ótimo! Água é combustível!', 'Perfeito! Aquecer prepara o corpo!',
  20, 1),

(36, 3, 'body', 'Dormir Bem Faz Bem', 'Sono é importante', 'Por que dormir bem é importante?',
  'O corpo descansa', 'O cérebro organiza o que aprendeu', 'Fico com energia',
  'Muito bem! Dormir restaura o corpo!', 'Incrível! O sono ajuda a memória!', 'Ótimo! Energia vem do descanso!',
  20, 1),

(37, 3, 'emotions', 'Raiva é Normal', 'Como lidar com raiva', 'Quando você sente raiva, o que pode ajudar?',
  'Respirar fundo', 'Contar até 10', 'Falar sobre o que me deixou com raiva',
  'Muito bem! Respirar acalma!', 'Ótimo! Pausar ajuda a pensar!', 'Perfeito! Expressar sentimentos é saudável!',
  20, 1),

(38, 3, 'emotions', 'Empatia com os Outros', 'Entender os sentimentos dos outros', 'Um amigo está triste. O que você pode fazer?',
  'Perguntar se ele quer conversar', 'Ficar por perto', 'Oferecer um abraço (se ele quiser)',
  'Lindo! Ouvir é um presente!', 'Muito bem! Presença importa!', 'Perfeito! Respeitar limites é empatia!',
  20, 1),

(39, 3, 'creativity', 'Desenhando Sentimentos', 'Arte ajuda a expressar', 'Como você pode mostrar seus sentimentos sem palavras?',
  'Desenhando', 'Pintando', 'Fazendo algo criativo',
  'Incrível! Desenho é uma linguagem!', 'Lindo! Cores expressam emoções!', 'Maravilhoso! Criar é liberar!',
  20, 1),

(40, 3, 'creativity', 'Música e Emoções', 'Música nos move', 'Como a música te faz sentir?',
  'Feliz e animado', 'Calmo e relaxado', 'Depende da música',
  'Legal! Música traz alegria!', 'Ótimo! Música acalma!', 'Muito bem! Cada música traz algo diferente!',
  20, 1),

(41, 3, 'languages', 'Oi em Inglês', 'Hello = Oi', 'Como se diz "Oi" em inglês?',
  'Hello', 'Hi', 'Hey',
  'Perfect! Hello!', 'Great! Hi!', 'Nice! Hey!',
  20, 1),

(42, 3, 'languages', 'Oi em Espanhol', 'Hola = Oi', 'Como se diz "Oi" em espanhol?',
  'Hola', '¡Hola!', 'Hola, ¿cómo estás?',
  '¡Muy bien! Hola!', '¡Perfecto!', '¡Excelente!',
  20, 1),

(43, 3, 'languages', 'Frutas em Inglês', 'Apple = Maçã', 'Como se diz "Maçã" em inglês?',
  'Apple', 'Orange', 'Banana',
  'Perfect! Apple! 🍎', 'Oops! Orange é laranja 🍊', 'Oops! Banana é banana 🍌',
  20, 1),

(44, 3, 'languages', 'Cores em Espanhol', 'Rojo = Vermelho', 'Como se diz "Vermelho" em espanhol?',
  'Rojo', 'Azul', 'Verde',
  '¡Muy bien! Rojo! ❤️', 'Oops! Azul é azul 💙', 'Oops! Verde é verde 💚',
  20, 1),

(45, 3, 'languages', 'Animais em Inglês', 'Dog = Cachorro', 'Como se diz "Cachorro" em inglês?',
  'Dog', 'Cat', 'Bird',
  'Perfect! Dog! 🐶', 'Oops! Cat é gato 🐱', 'Oops! Bird é pássaro 🐦',
  20, 1);

-- ============================================
-- SEED: ITENS DA LOJA
-- ============================================
INSERT OR IGNORE INTO store_items (id, name, type, cost_fp, asset_key, description, is_active)
VALUES
(1, 'Painel Céu Azul', 'panel', 80, 'panel_sky_blue', 'Um lindo céu azul de fundo', 1),
(2, 'Painel Galáxia', 'panel', 150, 'panel_galaxy', 'Estrelas e planetas incríveis', 1),
(3, 'Painel Floresta', 'panel', 120, 'panel_forest', 'Uma floresta verdinha', 1),
(4, 'Chapéu do Mascote', 'mascot_hat', 60, 'hat_party', 'Um chapéu divertido pro mascote', 1),
(5, 'Aura Brilhante', 'aura', 200, 'aura_sparkle', 'Uma aura mágica e brilhante', 1),
(6, 'Skin Arco-Íris', 'skin', 100, 'skin_rainbow', 'Cores do arco-íris', 1),
(7, 'Mascote com Óculos', 'mascot_accessory', 70, 'accessory_glasses', 'Óculos estilosos pro mascote', 1),
(8, 'Painel Espaço Sideral', 'panel', 180, 'panel_space', 'Viaje pelo espaço!', 1);

-- ============================================
-- FIM DA MIGRATION
-- ============================================
