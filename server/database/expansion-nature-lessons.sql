-- EXPANSÃO DE LIÇÕES DE NATUREZA
-- 20+ novas lições educacionais sobre natureza, plantas, animais e meio ambiente

-- ============================================
-- LIÇÕES SOBRE PLANTAS
-- ============================================

-- Lição 2: Como as Plantas Crescem
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(1, 'Como as Plantas Crescem', 'As plantas crescem de sementes pequenininhas! Elas precisam de três coisas mágicas: água, luz do sol e terra. É como se a planta tivesse uma receita especial!', 'choice', 2, 10);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Como as Plantas Crescem'),
 'O que as plantas precisam para crescer?',
 'Água, luz e terra', 1, 'Isso mesmo! Essas são as três coisas essenciais!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Como as Plantas Crescem'),
 'O que as plantas precisam para crescer?',
 'Apenas água', 0, 'Água é importante, mas as plantas precisam de mais coisas!', 2),
((SELECT id FROM nature_lessons WHERE title = 'Como as Plantas Crescem'),
 'O que as plantas precisam para crescer?',
 'Apenas luz', 0, 'Luz é importante, mas não é suficiente sozinha!', 3);

-- Lição 3: Plantando uma Semente
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(1, 'Plantando uma Semente', 'Você quer plantar uma sementinha! Primeiro, escolha um vasinho com terra. Faça um buraquinho pequeno, coloque a semente e cubra com terra. Não esqueça de regar!', 'choice', 3, 10);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Plantando uma Semente'),
 'Qual é o primeiro passo?',
 'Colocar terra no vaso', 1, 'Perfeito! Primeiro preparamos a terra!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Plantando uma Semente'),
 'Qual é o primeiro passo?',
 'Colocar a semente', 0, 'Primeiro precisamos preparar a terra!', 2);

-- Lição 4: Cuidando das Flores
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(1, 'Cuidando das Flores', 'As flores são como pinturas da natureza! Elas deixam tudo mais bonito e atraem borboletas e abelhas. Para cuidar, regue de manhã e proteja do vento forte.', 'choice', 4, 10);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Cuidando das Flores'),
 'Quando é melhor regar as flores?',
 'De manhã cedinho', 1, 'Muito bem! De manhã a água não evapora rápido!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Cuidando das Flores'),
 'Quando é melhor regar as flores?',
 'No meio-dia quente', 0, 'No calor, a água evapora rápido demais!', 2);

-- Lição 5: Árvores Frutíferas
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(1, 'Árvores que Dão Frutas', 'Algumas árvores são muito generosas e nos dão frutas deliciosas! Manga, laranja, maçã... todas vêm de árvores. Mas elas levam tempo para crescer e dar frutos.', 'choice', 5, 15);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Árvores que Dão Frutas'),
 'Quanto tempo leva para uma árvore dar frutas?',
 'Muitos meses ou anos', 1, 'Exato! As árvores precisam crescer fortes primeiro!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Árvores que Dão Frutas'),
 'Quanto tempo leva para uma árvore dar frutas?',
 'Uma semana', 0, 'Árvores levam muito mais tempo que isso!', 2);

-- ============================================
-- LIÇÕES SOBRE ANIMAIS
-- ============================================

-- Lição 6: Cachorros e Gatos
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(2, 'Nossos Amigos Peludos', 'Cachorros e gatos são animais domésticos que vivem com as pessoas. Eles precisam de carinho, comida, água e um lugar seguro para dormir. São como membros da família!', 'choice', 6, 10);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Nossos Amigos Peludos'),
 'Como devemos tratar nossos bichinhos?',
 'Com carinho e cuidado', 1, 'Isso mesmo! Eles merecem amor e atenção!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Nossos Amigos Peludos'),
 'Como devemos tratar nossos bichinhos?',
 'Deixar sozinhos sempre', 0, 'Os bichinhos precisam de companhia e cuidado!', 2);

-- Lição 7: Pássaros
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order) VALUES
(2, 'Pássaros Cantores', 'Os pássaros são animais que voam e cantam! Eles fazem ninhos nas árvores para colocar seus ovinhos. Alguns pássaros comem sementes, outros comem insetos.', 'choice', 7, 10);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Pássaros Cantores'),
 'O que os pássaros fazem nas árvores?',
 'Fazem ninhos', 1, 'Perfeito! Os ninhos são as casinhas dos pássaros!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Pássaros Cantores'),
 'O que os pássaros fazem nas árvores?',
 'Só descansam', 0, 'Eles também fazem ninhos para seus filhotes!', 2);

-- Lição 8: Animais da Fazenda
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(2, 'Animais da Fazenda', 'Na fazenda vivem vacas, porcos, galinhas e outros animais. Eles nos dão leite, ovos e nos ajudam com o trabalho. São muito importantes!', 'choice', 8, 10);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Animais da Fazenda'),
 'O que as galinhas nos dão?',
 'Ovos', 1, 'Isso mesmo! Ovos fresquinhos!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Animais da Fazenda'),
 'O que as galinhas nos dão?',
 'Leite', 0, 'Leite vem das vacas! Galinhas dão ovos!', 2);

-- Lição 9: Insetos Úteis
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(2, 'Insetos que Ajudam', 'Nem todos os insetos são ruins! As abelhas fazem mel e ajudam as flores a se reproduzir. As joaninhas comem pulgões que estragam as plantas.', 'choice', 9, 15);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Insetos que Ajudam'),
 'O que as abelhas produzem?',
 'Mel delicioso', 1, 'Sim! E também ajudam as flores!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Insetos que Ajudam'),
 'O que as abelhas produzem?',
 'Nada útil', 0, 'As abelhas são muito importantes! Fazem mel e polinizam!', 2);

-- Lição 10: Animais Marinhos
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(2, 'Vida no Mar', 'O mar é a casa de muitos animais incríveis! Peixes coloridos, tartarugas, golfinhos e até baleias gigantes! O oceano é como uma cidade debaixo d''água!', 'choice', 10, 15);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Vida no Mar'),
 'Onde vivem os golfinhos?',
 'No oceano', 1, 'Correto! O mar é a casa deles!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Vida no Mar'),
 'Onde vivem os golfinhos?',
 'Na floresta', 0, 'Golfinhos vivem no mar!', 2);

-- ============================================
-- LIÇÕES SOBRE MEIO AMBIENTE
-- ============================================

-- Lição 11: Economizar Água
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(3, 'Economizando Água', 'A água é muito preciosa! Nem todos têm água limpa. Podemos economizar fechando a torneira enquanto escovamos os dentes e tomando banhos mais curtos.', 'choice', 11, 15);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Economizando Água'),
 'Como economizar água ao escovar os dentes?',
 'Fechar a torneira', 1, 'Muito bem! Isso economiza muita água!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Economizando Água'),
 'Como economizar água ao escovar os dentes?',
 'Deixar a torneira aberta', 0, 'Isso desperdiça água! Melhor fechar!', 2);

-- Lição 12: Reciclagem
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(3, 'Reciclando é Legal', 'Reciclar é transformar lixo em coisas novas! Papel, plástico, vidro e metal podem virar novos objetos. Separar o lixo ajuda muito o planeta!', 'choice', 12, 15);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Reciclando é Legal'),
 'O que podemos reciclar?',
 'Papel, plástico, vidro e metal', 1, 'Perfeito! Todos esses podem ser reciclados!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Reciclando é Legal'),
 'O que podemos reciclar?',
 'Apenas papel', 0, 'Podemos reciclar muito mais que isso!', 2);

-- Lição 13: Poluição do Ar
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(3, 'Ar Limpo para Respirar', 'O ar que respiramos precisa ser limpo! Carros e fábricas soltam fumaça que suja o ar. Podemos ajudar andando mais a pé ou de bicicleta!', 'choice', 13, 15);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Ar Limpo para Respirar'),
 'Como podemos poluir menos?',
 'Andar a pé ou de bicicleta', 1, 'Ótimo! Isso não solta fumaça!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Ar Limpo para Respirar'),
 'Como podemos poluir menos?',
 'Usar carro sempre', 0, 'Carros soltam fumaça! Caminhar é melhor!', 2);

-- Lição 14: Energia Solar
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(3, 'Energia do Sol', 'O Sol é como uma bateria gigante no céu! Podemos usar painéis solares para transformar luz do sol em eletricidade. É energia limpa e renovável!', 'choice', 14, 20);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Energia do Sol'),
 'Por que energia solar é boa?',
 'É limpa e não acaba', 1, 'Exato! O sol sempre volta todo dia!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Energia do Sol'),
 'Por que energia solar é boa?',
 'Porque é cara', 0, 'É boa porque é limpa e renovável!', 2);

-- Lição 15: Lixo nos Oceanos
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(3, 'Mantendo o Mar Limpo', 'Infelizmente, muito lixo vai parar no mar. Isso machuca os animais marinhos! Nunca jogue lixo na praia e sempre use lixeiras.', 'choice', 15, 20);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Mantendo o Mar Limpo'),
 'O que fazer com lixo na praia?',
 'Colocar na lixeira', 1, 'Perfeito! Protegemos os animais assim!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Mantendo o Mar Limpo'),
 'O que fazer com lixo na praia?',
 'Deixar na areia', 0, 'Isso pode ir para o mar e machucar animais!', 2);

-- ============================================
-- LIÇÕES SOBRE RESPONSABILIDADE
-- ============================================

-- Lição 16: Apagar Luzes
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(4, 'Economizando Energia', 'Quando saímos de um cômodo, devemos apagar a luz! Isso economiza energia e ajuda o planeta. É um gesto pequenininho mas muito importante!', 'choice', 16, 10);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Economizando Energia'),
 'Você sai do quarto, o que fazer?',
 'Apagar a luz', 1, 'Isso mesmo! Economize energia!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Economizando Energia'),
 'Você sai do quarto, o que fazer?',
 'Deixar tudo ligado', 0, 'Isso gasta energia à toa!', 2);

-- Lição 17: Não Desperdiçar Comida
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(4, 'Valorizando a Comida', 'A comida é muito importante! Muitas pessoas trabalharam para ela chegar no seu prato. Não devemos desperdiçar. Pegue só o que vai comer!', 'choice', 17, 15);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Valorizando a Comida'),
 'Como não desperdiçar comida?',
 'Pegar só o que vou comer', 1, 'Muito bem! Assim não sobra!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Valorizando a Comida'),
 'Como não desperdiçar comida?',
 'Encher o prato sempre', 0, 'Melhor pegar menos e repetir se quiser!', 2);

-- Lição 18: Plantar Árvores
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(4, 'Plantando Árvores', 'Plantar uma árvore é como dar um presente para o futuro! As árvores limpam o ar, dão sombra, servem de casa para bichos e algumas dão frutas!', 'choice', 18, 20);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Plantando Árvores'),
 'Por que plantar árvores é bom?',
 'Todas as razões acima', 1, 'Sim! Árvores são incríveis e fazem muito bem!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Plantando Árvores'),
 'Por que plantar árvores é bom?',
 'Só para fazer sombra', 0, 'Árvores fazem muito mais que isso!', 2);

-- Lição 19: Cuidar de Animais de Rua
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(4, 'Ajudando Animais de Rua', 'Alguns animais não têm casa nem comida. Se você vir um animal de rua com fome ou sede, pode ajudar! Mas sempre peça ajuda de um adulto primeiro.', 'choice', 19, 15);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Ajudando Animais de Rua'),
 'Viu um cachorro com fome, o que fazer?',
 'Pedir ajuda de um adulto', 1, 'Muito bem! Adultos sabem como ajudar!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Ajudando Animais de Rua'),
 'Viu um cachorro com fome, o que fazer?',
 'Ignorar o animal', 0, 'Podemos ajudar, mas sempre com um adulto!', 2);

-- Lição 20: Respeitar a Natureza
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(4, 'Respeitando a Natureza', 'Quando visitamos parques e florestas, devemos respeitar! Não arrancar folhas, não assustar bichos, não jogar lixo. A natureza é a casa de muitos seres!', 'choice', 20, 20);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Respeitando a Natureza'),
 'Como se comportar na natureza?',
 'Respeitar plantas e animais', 1, 'Perfeito! Somos visitantes na casa deles!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Respeitando a Natureza'),
 'Como se comportar na natureza?',
 'Fazer o que quiser', 0, 'Devemos respeitar a natureza!', 2);

-- ============================================
-- LIÇÕES EXTRAS
-- ============================================

-- Lição 21: Ciclo da Água
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(3, 'A Viagem da Água', 'A água faz uma viagem incrível! O sol aquece a água, ela sobe pro céu virando nuvem, depois cai como chuva e volta para rios e mares. É um ciclo mágico!', 'choice', 21, 20);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'A Viagem da Água'),
 'O que acontece com a água no céu?',
 'Vira nuvem e depois chuva', 1, 'Isso mesmo! É o ciclo da água!', 1),
((SELECT id FROM nature_lessons WHERE title = 'A Viagem da Água'),
 'O que acontece com a água no céu?',
 'Desaparece para sempre', 0, 'A água sempre volta! É um ciclo!', 2);

-- Lição 22: Compostagem
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(3, 'Transformando Restos em Adubo', 'Cascas de frutas, legumes e outros restos de comida podem virar adubo! Isso se chama compostagem. O adubo deixa a terra super nutritiva para plantas!', 'choice', 22, 20);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Transformando Restos em Adubo'),
 'O que é compostagem?',
 'Transformar restos em adubo', 1, 'Exatamente! É reciclar restos orgânicos!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Transformando Restos em Adubo'),
 'O que é compostagem?',
 'Jogar tudo no lixo normal', 0, 'Podemos transformar em adubo útil!', 2);

-- Lição 23: Borboletas e Flores
INSERT OR IGNORE INTO nature_lessons (category_id, title, content_text, lesson_type, display_order, fp_reward) VALUES
(2, 'Borboletas e Suas Flores', 'Borboletas adoram flores! Elas voam de flor em flor bebendo néctar. Enquanto isso, ajudam as flores a se reproduzir levando pólen. É uma parceria linda!', 'choice', 23, 15);

INSERT OR IGNORE INTO nature_choices (lesson_id, situation, choice_text, is_correct, explanation, display_order) VALUES
((SELECT id FROM nature_lessons WHERE title = 'Borboletas e Suas Flores'),
 'Por que borboletas são importantes?',
 'Ajudam as flores a se reproduzir', 1, 'Sim! Elas levam pólen de flor em flor!', 1),
((SELECT id FROM nature_lessons WHERE title = 'Borboletas e Suas Flores'),
 'Por que borboletas são importantes?',
 'Só são bonitas', 0, 'São bonitas e também muito úteis!', 2);

-- ============================================
-- FIM DAS EXPANSÕES
-- ============================================

PRAGMA foreign_keys = ON;
