-- EXPANSÃO DE HÁBITOS DE HIGIENE
-- 15+ novos hábitos de higiene e autocuidado

-- ============================================
-- HÁBITOS DE HIGIENE DAS MÃOS (Categoria 1)
-- ============================================

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(1, 'Lavar mãos antes do lanche', 'Lavar as mãos antes de comer um lanchinho',
'Suas mãos tocam em muitas coisas! Lavar antes de comer evita que você engula germes que podem fazer mal.',
'daily', 5, 3);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(1, 'Lavar mãos depois do banheiro', 'Sempre lavar as mãos após usar o banheiro',
'O banheiro tem muitos germes invisíveis. Lavar as mãos depois protege você e as outras pessoas!',
'daily', 5, 4);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(1, 'Lavar mãos ao chegar da rua', 'Lavar as mãos assim que chegar em casa',
'A rua tem muita sujeira invisível. Lavar as mãos ao chegar protege toda sua família!',
'daily', 5, 5);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(1, 'Cortar as unhas', 'Manter as unhas limpas e cortadas',
'Unhas grandes acumulam sujeira e germes. Unhas limpas e curtas são mais saudáveis!',
'weekly', 10, 6);

-- ============================================
-- HÁBITOS DE HIGIENE BUCAL (Categoria 2)
-- ============================================

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(2, 'Escovar dentes ao acordar', 'Escovar os dentes pela manhã',
'Durante a noite, bactérias se acumulam na boca. Escovar de manhã limpa tudo!',
'daily', 5, 3);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(2, 'Passar fio dental', 'Usar fio dental entre os dentes',
'O fio dental limpa lugares que a escova não alcança! Isso evita cáries e deixa o hálito fresquinho.',
'daily', 10, 4);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(2, 'Trocar escova de dentes', 'Trocar a escova de dentes quando fica velha',
'Escovas velhas não limpam bem e podem ter germes. Troque a cada 3 meses!',
'monthly', 15, 5);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(2, 'Limpar a língua', 'Escovar a língua também',
'A língua também acumula bactérias! Escovar a língua deixa o hálito mais fresco.',
'daily', 5, 6);

-- ============================================
-- HÁBITOS DE HIGIENE DO CORPO (Categoria 3)
-- ============================================

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(3, 'Lavar os pés', 'Lavar bem os pés no banho',
'Os pés ficam o dia todo dentro do sapato e suam! Lavar bem evita chulé e frieiras.',
'daily', 5, 3);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(3, 'Lavar o rosto', 'Lavar o rosto de manhã e à noite',
'O rosto acumula oleosidade e sujeira. Lavar deixa a pele limpa e saudável!',
'daily', 5, 4);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(3, 'Cortar cabelo', 'Cortar o cabelo regularmente',
'Cabelos bem cuidados ficam mais bonitos e saudáveis! Cortar ajuda o cabelo a crescer forte.',
'monthly', 10, 5);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(3, 'Usar protetor solar', 'Passar protetor solar antes de sair no sol',
'O sol pode queimar sua pele! Protetor solar protege e mantém sua pele saudável.',
'daily', 10, 6);

-- ============================================
-- HÁBITOS DE ROUPAS (Categoria 4)
-- ============================================

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(4, 'Trocar meias todo dia', 'Usar meias limpas diariamente',
'Pés suam muito! Meias limpas evitam chulé e mantêm seus pés saudáveis.',
'daily', 5, 3);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(4, 'Trocar pijama', 'Trocar de pijama regularmente',
'Você dorme muitas horas no pijama! Trocar regularmente deixa seu sono mais higiênico.',
'weekly', 10, 4);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(4, 'Guardar roupas limpas', 'Guardar roupas limpas dobradas no armário',
'Roupas organizadas duram mais e ficam sempre prontas para usar! Além disso, não amassam.',
'daily', 5, 5);

-- ============================================
-- HÁBITOS ALIMENTARES (Categoria 5)
-- ============================================

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(5, 'Beber água', 'Beber pelo menos 4 copos de água por dia',
'Água é muito importante! Ela hidrata seu corpo, ajuda a pensar melhor e mantém tudo funcionando.',
'daily', 10, 3);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(5, 'Comer frutas', 'Comer pelo menos uma fruta por dia',
'Frutas têm vitaminas que deixam você forte e saudável! São docinhos naturais deliciosos.',
'daily', 10, 4);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(5, 'Tomar café da manhã', 'Tomar um café da manhã saudável',
'O café da manhã dá energia para o dia todo! É como colocar gasolina no seu corpo pela manhã.',
'daily', 10, 5);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(5, 'Evitar comer muitos doces', 'Não comer doces em excesso',
'Doces são gostosos, mas em excesso fazem mal aos dentes e à saúde. Equilíbrio é importante!',
'daily', 10, 6);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(5, 'Comer devagar', 'Mastigar bem a comida antes de engolir',
'Comer devagar ajuda na digestão e você aproveita melhor o sabor! Seu corpo agradece.',
'daily', 5, 7);

-- ============================================
-- HÁBITOS EXTRAS DE SAÚDE
-- ============================================

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(3, 'Dormir cedo', 'Ir para a cama no horário certo',
'Dormir bem é super importante! Enquanto você dorme, seu corpo cresce e se recupera.',
'daily', 10, 7);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(3, 'Fazer exercícios', 'Brincar, correr ou fazer atividade física',
'Mexer o corpo deixa você forte, saudável e feliz! Além de ser divertido!',
'daily', 10, 8);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(1, 'Cobrir boca ao espirrar', 'Cobrir a boca com o braço ao espirrar ou tossir',
'Espirros espalham germes! Cobrir a boca protege as outras pessoas de ficarem doentes.',
'daily', 5, 7);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(3, 'Limpar os ouvidos', 'Limpar as orelhas suavemente (só a parte de fora)',
'As orelhas também precisam de cuidado! Limpe apenas a parte de fora, nunca enfie nada dentro.',
'weekly', 5, 9);

INSERT OR IGNORE INTO hygiene_habits (category_id, title, description, why_important, frequency_type, fp_reward, display_order) VALUES
(4, 'Usar roupas confortáveis', 'Usar roupas adequadas para o clima',
'Roupas confortáveis deixam você feliz e saudável! No frio, agasalhe-se. No calor, use roupas leves.',
'daily', 5, 6);

-- ============================================
-- FIM DAS EXPANSÕES
-- ============================================

PRAGMA foreign_keys = ON;
