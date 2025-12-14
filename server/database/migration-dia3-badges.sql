-- ============================================
-- E-KIDS PRO - MIGRATION DIA 3: SISTEMA DE CONQUISTAS EXPANDIDO
-- ============================================
-- 100+ BADGES com sistema de raridade

-- Expandir tabela de badges com novos campos
CREATE TABLE IF NOT EXISTS badge_catalog (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  badge_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- progressao, especializacao, streaks, economia, mascote, social, criatividade
  rarity TEXT NOT NULL CHECK(rarity IN ('bronze', 'prata', 'ouro', 'platina')),
  icon TEXT NOT NULL, -- emoji
  unlock_condition TEXT NOT NULL,
  reward_fp INTEGER DEFAULT 0,
  is_secret INTEGER DEFAULT 0, -- badges secretos
  unlock_hint TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_badge_catalog_category ON badge_catalog(category);
CREATE INDEX IF NOT EXISTS idx_badge_catalog_rarity ON badge_catalog(rarity);

-- Expandir tabela child_badges com mais informações
CREATE TABLE IF NOT EXISTS child_badges_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  badge_key TEXT NOT NULL,
  progress INTEGER DEFAULT 0, -- progresso atual
  goal INTEGER NOT NULL, -- meta para desbloquear
  percentage REAL GENERATED ALWAYS AS (CAST(progress AS REAL) / goal * 100) STORED,
  UNIQUE(child_id, badge_key),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_key) REFERENCES badge_catalog(badge_key) ON DELETE CASCADE
);

-- ============================================
-- SEED: 100+ BADGES ORGANIZADOS POR CATEGORIA
-- ============================================

-- ==========================================
-- CATEGORIA 1: PROGRESSÃO (20 badges)
-- ==========================================

-- Primeiras missões
INSERT INTO badge_catalog (badge_key, name, description, category, rarity, icon, unlock_condition, reward_fp, unlock_hint) VALUES
('primeira_missao', 'Primeiro Passo', 'Complete sua primeira missão!', 'progressao', 'bronze', '👶', '1 missão completada', 10, 'Complete qualquer missão'),
('10_missoes', 'Explorador', 'Complete 10 missões', 'progressao', 'bronze', '🗺️', '10 missões completadas', 50, 'Continue completando missões'),
('50_missoes', 'Aventureiro', 'Complete 50 missões', 'progressao', 'prata', '⛰️', '50 missões completadas', 150, 'Você está no caminho certo!'),
('100_missoes', 'Mestre das Missões', 'Complete 100 missões', 'progressao', 'ouro', '🏆', '100 missões completadas', 300, 'Continue sua jornada!'),
('250_missoes', 'Lenda Viva', 'Complete 250 missões!', 'progressao', 'platina', '👑', '250 missões completadas', 500, 'Você é incrível!');

-- Níveis de FP
INSERT INTO badge_catalog (badge_key, name, description, category, rarity, icon, unlock_condition, reward_fp, unlock_hint) VALUES
('100_fp', 'Primeiras Moedas', 'Acumule 100 FP', 'progressao', 'bronze', '💰', 'Total de 100 FP acumulados', 20, 'Continue ganhando FP'),
('500_fp', 'Cofre Crescendo', 'Acumule 500 FP', 'progressao', 'bronze', '💵', 'Total de 500 FP acumulados', 50, 'Seu esforço está valendo a pena'),
('1000_fp', 'Milionário Júnior', 'Acumule 1000 FP!', 'progressao', 'prata', '💎', 'Total de 1000 FP acumulados', 100, 'Continue poupando'),
('5000_fp', 'Magnata Mirim', 'Acumule 5000 FP!', 'progressao', 'ouro', '🏦', 'Total de 5000 FP acumulados', 250, 'Você é um mestre das finanças!'),
('10000_fp', 'Imperador da Fortuna', 'Acumule 10000 FP!!!', 'progressao', 'platina', '👑💎', 'Total de 10000 FP acumulados', 500, 'Nível máximo alcançado!');

-- Fases completadas
INSERT INTO badge_catalog (badge_key, name, description, category, rarity, icon, unlock_condition, reward_fp, unlock_hint) VALUES
('fase_1_completa', 'Iniciante Completo', 'Complete todas as missões da Fase 1', 'progressao', 'bronze', '1️⃣', 'Fase 1 100% completa', 100, 'Complete todas as missões da Fase 1'),
('fase_2_completa', 'Aprendiz Dedicado', 'Complete todas as missões da Fase 2', 'progressao', 'prata', '2️⃣', 'Fase 2 100% completa', 150, 'Complete todas as missões da Fase 2'),
('fase_3_completa', 'Explorador Completo', 'Complete todas as missões da Fase 3', 'progressao', 'ouro', '3️⃣', 'Fase 3 100% completa', 200, 'Complete todas as missões da Fase 3'),
('fase_4_completa', 'Mestre da Fase 4', 'Complete todas as missões da Fase 4', 'progressao', 'ouro', '4️⃣', 'Fase 4 100% completa', 250, 'Quase lá!'),
('todas_fases', 'Conquistador Supremo', 'Complete TODAS as fases!', 'progressao', 'platina', '✨', 'Todas as fases completas', 1000, 'O máximo da dedicação!');

-- Níveis do mascote
INSERT INTO badge_catalog (badge_key, name, description, category, rarity, icon, unlock_condition, reward_fp, unlock_hint) VALUES
('mascote_nivel_5', 'Treinador Iniciante', 'Seu mascote chegou ao nível 5', 'progressao', 'bronze', '🐣', 'Mascote nível 5', 50, 'Continue cuidando do seu mascote'),
('mascote_nivel_10', 'Treinador Dedicado', 'Seu mascote chegou ao nível 10!', 'progressao', 'prata', '🐥', 'Mascote nível 10', 100, 'Você está fazendo um ótimo trabalho'),
('mascote_nivel_20', 'Treinador Expert', 'Seu mascote chegou ao nível 20!', 'progressao', 'ouro', '🦅', 'Mascote nível 20', 200, 'Seu mascote está orgulhoso de você!'),
('mascote_nivel_50', 'Lenda dos Treinadores', 'Seu mascote chegou ao nível 50!!!', 'progressao', 'platina', '🦸', 'Mascote nível 50', 500, 'Vocês são uma dupla imbatível!');

-- ==========================================
-- CATEGORIA 2: ESPECIALIZAÇÃO (25 badges)
-- ==========================================

-- Expert em Emoções
INSERT INTO badge_catalog (badge_key, name, description, category, rarity, icon, unlock_condition, reward_fp, unlock_hint) VALUES
('emocoes_iniciante', 'Conhecendo Emoções', 'Complete 5 missões de emoções', 'especializacao', 'bronze', '😊', '5 missões de emoções', 30, 'Foque em missões de emoções'),
('emocoes_intermediario', 'Expert Emocional', 'Complete 15 missões de emoções', 'especializacao', 'prata', '😌', '15 missões de emoções', 75, 'Continue explorando suas emoções'),
('emocoes_avancado', 'Mestre das Emoções', 'Complete 30 missões de emoções', 'especializacao', 'ouro', '🧘', '30 missões de emoções', 150, 'Você entende muito de sentimentos!'),
('emocoes_expert', 'Guru Emocional', 'Complete 50 missões de emoções!', 'especializacao', 'platina', '💝', '50 missões de emoções', 300, 'Especialista em inteligência emocional!');

-- Expert em Segurança
INSERT INTO badge_catalog (badge_key, name, description, category, rarity, icon, unlock_condition, reward_fp, unlock_hint) VALUES
('seguranca_iniciante', 'Aprendendo Limites', 'Complete 5 missões de segurança', 'especializacao', 'bronze', '🛡️', '5 missões de segurança', 30, 'Aprenda sobre seus limites'),
('seguranca_intermediario', 'Defensor de Si', 'Complete 15 missões de segurança', 'especializacao', 'prata', '🦸‍♂️', '15 missões de segurança', 75, 'Você está ficando mais seguro!'),
('seguranca_avancado', 'Guardião dos Limites', 'Complete 30 missões de segurança', 'especializacao', 'ouro', '🛡️✨', '30 missões de segurança', 150, 'Você se protege muito bem!'),
('seguranca_expert', 'Mestre da Proteção', 'Complete 50 missões de segurança!', 'especializacao', 'platina', '👮', '50 missões de segurança', 300, 'Expert em segurança pessoal!');

-- Expert em Corpo e Saúde
INSERT INTO badge_catalog (badge_key, name, description, category, rarity, icon, unlock_condition, reward_fp, unlock_hint) VALUES
('corpo_iniciante', 'Cuidando de Mim', 'Complete 5 missões de corpo', 'especializacao', 'bronze', '💪', '5 missões de corpo', 30, 'Cuide do seu corpo'),
('corpo_intermediario', 'Corpo Saudável', 'Complete 15 missões de corpo', 'especializacao', 'prata', '🏃', '15 missões de corpo', 75, 'Continue se movimentando'),
('corpo_avancado', 'Atleta Mirim', 'Complete 30 missões de corpo', 'especializacao', 'ouro', '🏅', '30 missões de corpo', 150, 'Você está super saudável!'),
('corpo_expert', 'Campeão do Bem-Estar', 'Complete 50 missões de corpo!', 'especializacao', 'platina', '🏆💪', '50 missões de corpo', 300, 'Mestre do autocuidado!');

-- Expert em Criatividade
INSERT INTO badge_catalog (badge_key, name, description, category, rarity, icon, unlock_condition, reward_fp, unlock_hint) VALUES
('criatividade_iniciante', 'Imaginação Ativa', 'Complete 5 missões de criatividade', 'especializacao', 'bronze', '🎨', '5 missões de criatividade', 30, 'Solte sua criatividade'),
('criatividade_intermediario', 'Artista em Formação', 'Complete 15 missões de criatividade', 'especializacao', 'prata', '🖌️', '15 missões de criatividade', 75, 'Você é muito criativo!'),
('criatividade_avancado', 'Criador Genial', 'Complete 30 missões de criatividade', 'especializacao', 'ouro', '🌟', '30 missões de criatividade', 150, 'Sua criatividade não tem limites!'),
('criatividade_expert', 'Da Vinci Júnior', 'Complete 50 missões de criatividade!', 'especializacao', 'platina', '🎭✨', '50 missões de criatividade', 300, 'Gênio criativo!');

-- Expert em Idiomas
INSERT INTO badge_catalog (badge_key, name, description, category, rarity, icon, unlock_condition, reward_fp, unlock_hint) VALUES
('idiomas_iniciante', 'Primeira Palavra', 'Complete 5 missões de idiomas', 'especializacao', 'bronze', '🗣️', '5 missões de idiomas', 30, 'Explore novos idiomas'),
('idiomas_intermediario', 'Poliglota Mirim', 'Complete 15 missões de idiomas', 'especializacao', 'prata', '🌍', '15 missões de idiomas', 75, 'Você está aprendendo muito!'),
('idiomas_avancado', 'Comunicador Global', 'Complete 30 missões de idiomas', 'especializacao', 'ouro', '🌐', '30 missões de idiomas', 150, 'Você fala com o mundo!'),
('idiomas_expert', 'Mestre das Línguas', 'Complete 50 missões de idiomas!', 'especializacao', 'platina', '📚🌍', '50 missões de idiomas', 300, 'Cidadão do mundo!');

-- Expert em Amizade
INSERT INTO badge_catalog (badge_key, name, description, category, rarity, icon, unlock_condition, reward_fp, unlock_hint) VALUES
('amizade_iniciante', 'Fazendo Amigos', 'Complete 5 missões de amizade', 'especializacao', 'bronze', '👫', '5 missões de amizade', 30, 'Cultive amizades'),
('amizade_intermediario', 'Amigo Verdadeiro', 'Complete 15 missões de amizade', 'especializacao', 'prata', '🤝', '15 missões de amizade', 75, 'Você é um ótimo amigo!'),
('amizade_avancado', 'Maestro Social', 'Complete 30 missões de amizade', 'especializacao', 'ouro', '💕', '30 missões de amizade', 150, 'Suas amizades são sólidas!'),
('amizade_expert', 'Embaixador da Amizade', 'Complete 50 missões de amizade!', 'especializacao', 'platina', '👑💕', '50 missões de amizade', 300, 'Mestre dos relacionamentos!');

-- ==========================================
-- CATEGORIA 3: STREAKS (15 badges)
-- ==========================================

INSERT INTO badge_catalog (badge_key, name, description, category, rarity, icon, unlock_condition, reward_fp, unlock_hint) VALUES
('streak_3', 'Três Dias Seguidos', 'Complete missões por 3 dias consecutivos', 'streaks', 'bronze', '🔥', '3 dias consecutivos', 30, 'Continue voltando todo dia'),
('streak_7', 'Uma Semana Inteira!', 'Complete missões por 7 dias consecutivos', 'streaks', 'bronze', '⭐', '7 dias consecutivos', 70, 'Uma semana de dedicação!'),
('streak_14', 'Duas Semanas Fortes', 'Complete missões por 14 dias consecutivos', 'streaks', 'prata', '🌟', '14 dias consecutivos', 140, 'Você está formando um hábito!'),
('streak_30', 'Mês Completo!', 'Complete missões por 30 dias consecutivos!', 'streaks', 'ouro', '📅', '30 dias consecutivos', 300, 'Um mês de constância!'),
('streak_60', 'Dois Meses Imbatível', 'Complete missões por 60 dias consecutivos!', 'streaks', 'ouro', '🗓️', '60 dias consecutivos', 600, 'Você é imparável!'),
('streak_90', 'Trimestre Perfeito', 'Complete missões por 90 dias consecutivos!', 'streaks', 'platina', '💎', '90 dias consecutivos', 900, 'Dedicação platina!'),
('streak_180', 'Semestre de Ouro', 'Complete missões por 180 dias consecutivos!', 'streaks', 'platina', '👑', '180 dias consecutivos', 1800, 'Você é uma lenda!'),
('streak_365', 'Ano Inteiro!!!', 'Complete missões por 365 dias consecutivos!!!', 'streaks', 'platina', '🎆', '365 dias consecutivos', 3650, 'LENDÁRIO! Um ano completo!');

-- Streaks específicos
INSERT INTO badge_catalog (badge_key, name, description, category, rarity, icon, unlock_condition, reward_fp, unlock_hint) VALUES
('checkin_emocional_7', 'Semana Emocional', 'Faça check-in emocional por 7 dias seguidos', 'streaks', 'bronze', '😊🔥', '7 check-ins consecutivos', 50, 'Check-in diário de emoções'),
('checkin_emocional_30', 'Mês de Autoconhecimento', 'Faça check-in emocional por 30 dias!', 'streaks', 'ouro', '🧘🔥', '30 check-ins consecutivos', 200, 'Você se conhece muito bem!'),
('mascote_feliz_7', 'Mascote Amado', 'Mantenha mascote feliz por 7 dias', 'streaks', 'bronze', '😊🐾', 'Mascote com 80+ felicidade por 7 dias', 50, 'Cuide bem do seu mascote'),
('mascote_feliz_30', 'Melhor Amigo', 'Mantenha mascote feliz por 30 dias!', 'streaks', 'ouro', '💖🐾', 'Mascote com 80+ felicidade por 30 dias', 200, 'Vocês são inseparáveis!'),
('tarefas_casa_7', 'Semana Organizada', 'Complete tarefas de casa por 7 dias', 'streaks', 'prata', '🏠🔥', 'Tarefas domésticas por 7 dias', 100, 'Continue ajudando em casa'),
('exercicio_7', 'Semana Ativa', 'Faça exercício por 7 dias consecutivos', 'streaks', 'prata', '🏃🔥', 'Atividade física por 7 dias', 100, 'Mantenha o corpo ativo'),
('exercicio_30', 'Atleta Nato', 'Faça exercício por 30 dias!', 'streaks', 'platina', '🏅🔥', 'Atividade física por 30 dias', 400, 'Você é um campeão!');

-- ==========================================
-- CATEGORIA 4: ECONOMIA E FINANÇAS (20 badges)
-- ==========================================

INSERT INTO badge_catalog (badge_key, name, description, category, rarity, icon, unlock_condition, reward_fp, unlock_hint) VALUES
('primeira_compra', 'Primeira Compra', 'Faça sua primeira compra na loja', 'economia', 'bronze', '🛒', 'Comprar 1 item', 10, 'Use seus FP na loja'),
('economista_mirim', 'Economista Mirim', 'Economize 100 FP sem gastar', 'economia', 'bronze', '🏦', 'Acumular 100 FP sem compras', 50, 'Guarde seus FP'),
('poupador_bronze', 'Poupador Bronze', 'Economize 500 FP', 'economia', 'prata', '💰', 'Acumular 500 FP', 100, 'Continue poupando'),
('poupador_ouro', 'Poupador de Ouro', 'Economize 2000 FP!', 'economia', 'ouro', '💎', 'Acumular 2000 FP', 200, 'Você tem disciplina financeira!'),
('investidor', 'Primeiro Investimento', 'Coloque FP no cofrinho', 'economia', 'bronze', '🐷', 'Usar cofrinho pela primeira vez', 30, 'Invista no cofrinho'),
('investidor_serio', 'Investidor Sério', 'Acumule 1000 FP no cofrinho', 'economia', 'prata', '🏦', '1000 FP no cofrinho', 150, 'Continue investindo'),
('magnata', 'Magnata Mirim', 'Tenha 5000 FP no cofrinho!', 'economia', 'ouro', '💵', '5000 FP no cofrinho', 300, 'Você entende de investimento!'),
('juros_feliz', 'Primeira Rentabilidade', 'Receba seus primeiros juros do cofrinho', 'economia', 'bronze', '📈', 'Receber juros 1x', 20, 'Espere o mês virar!'),
('rei_dos_juros', 'Rei dos Juros', 'Receba juros por 6 meses seguidos', 'economia', 'ouro', '👑💰', 'Receber juros por 6 meses', 500, 'Investimento de longo prazo!'),
('comprador_consciente', 'Comprador Consciente', 'Compare preços antes de comprar 5x', 'economia', 'prata', '🤔', 'Comparar opções 5x', 100, 'Pense antes de gastar'),
('negociador', 'Negociador', 'Negocie com os pais 3 vezes', 'economia', 'bronze', '🤝', 'Negociar 3x', 50, 'Apresente seus argumentos'),
('planejador', 'Planejador Financeiro', 'Crie uma meta de economia', 'economia', 'prata', '🎯', 'Definir meta de FP', 75, 'Defina um objetivo'),
('realizador', 'Realizador de Sonhos', 'Atinja uma meta de economia', 'economia', 'ouro', '✨', 'Alcançar meta definida', 200, 'Trabalhe pela sua meta'),
('doador', 'Coração Generoso', 'Doe FP para uma boa causa', 'economia', 'prata', '💝', 'Doar FP 1x', 100, 'Compartilhe sua riqueza'),
('filantropo', 'Filantro po Mirim', 'Doe 500 FP ao longo do tempo', 'economia', 'ouro', '💖', 'Doar 500 FP total', 250, 'Generosidade é riqueza'),
('zero_dividas', 'Sem Dívidas', 'Não peça FP adiantado por 30 dias', 'economia', 'prata', '🆓', '30 dias sem adiantamento', 150, 'Viva dentro do orçamento'),
('empreendedor', 'Empreendedor Nato', 'Crie uma forma criativa de ganhar FP extra', 'economia', 'ouro', '💡', 'Propor tarefa extra', 200, 'Use a criatividade para ganhar FP'),
('cliente_vip', 'Cliente VIP', 'Faça 50 compras na loja', 'economia', 'prata', '🌟', '50 compras', 100, 'Continue comprando conscientemente'),
('investidor_diamante', 'Investidor Diamante', 'Mantenha cofrinho ativo por 1 ano', 'economia', 'platina', '💎', 'Cofrinho por 365 dias', 1000, 'Investidor de longo prazo!'),
('educador_financeiro', 'Educador Financeiro', 'Ensine algo sobre dinheiro para alguém', 'economia', 'ouro', '🎓', 'Compartilhar conhecimento', 300, 'Ensine o que aprendeu');

-- ==========================================
-- CATEGORIA 5: MASCOTE (10 badges)
-- ==========================================

INSERT INTO badge_catalog (badge_key, name, description, category, rarity, icon, unlock_condition, reward_fp, unlock_hint) VALUES
('mascote_nasceu', 'Nasceu um Amigo!', 'Crie seu mascote', 'mascote', 'bronze', '🥚', 'Criar mascote', 10, 'Crie seu companheiro'),
('mascote_batizado', 'Nome Especial', 'Dê um nome ao seu mascote', 'mascote', 'bronze', '📝', 'Nomear mascote', 20, 'Escolha um nome legal'),
('mascote_feliz', 'Mascote Sorridente', 'Mantenha felicidade em 90+', 'mascote', 'prata', '😊', 'Felicidade 90+', 50, 'Cuide bem dele'),
('mascote_energizado', 'Cheio de Energia', 'Mantenha energia em 90+', 'mascote', 'prata', '⚡', 'Energia 90+', 50, 'Não deixe ele cansar'),
('mascote_perfeito', 'Cuidados Perfeitos', 'Felicidade E energia em 95+', 'mascote', 'ouro', '✨', 'Ambos 95+', 150, 'Cuidados impecáveis'),
('melhor_amigo', 'Melhor Amigo', 'Interaja com mascote 100 vezes', 'mascote', 'prata', '💕', '100 interações', 100, 'Passe tempo com ele'),
('inseparaveis', 'Inseparáveis', 'Interaja com mascote 500 vezes!', 'mascote', 'ouro', '💖', '500 interações', 300, 'Vocês são uma dupla!'),
('veterinario', 'Veterinário Júnior', 'Cure mascote triste 10x', 'mascote', 'bronze', '🏥', 'Curar mascote 10x', 50, 'Cuide quando ele ficar triste'),
('evolucao', 'Primeira Evolução', 'Evolua seu mascote', 'mascote', 'ouro', '🦋', 'Mascote evoluir', 200, 'Continue subindo de nível'),
('lenda_mascote', 'Lenda do Mascote', 'Mascote nível máximo!', 'mascote', 'platina', '👑🐉', 'Mascote nível 100', 1000, 'Lendário!');

-- ==========================================
-- CATEGORIA 6: BADGES SOCIAIS (10 badges)
-- ==========================================

INSERT INTO badge_catalog (badge_key, name, description, category, rarity, icon, unlock_condition, reward_fp, unlock_hint) VALUES
('primeira_ajuda', 'Primeira Ajuda', 'Ajude alguém pela primeira vez', 'social', 'bronze', '🤝', 'Ajudar 1 pessoa', 20, 'Ajude quem precisa'),
('bom_samaritano', 'Bom Samaritano', 'Ajude 10 pessoas', 'social', 'prata', '💝', 'Ajudar 10 pessoas', 100, 'Continue ajudando'),
('heroi_cotidiano', 'Herói do Cotidiano', 'Ajude 50 pessoas!', 'social', 'ouro', '🦸', 'Ajudar 50 pessoas', 250, 'Você faz a diferença!'),
('amigo_fiel', 'Amigo Fiel', 'Tenha 5 amigos no círculo de confiança', 'social', 'prata', '👫', '5 amigos cadastrados', 75, 'Cultive amizades'),
('comunicador', 'Comunicador', 'Compartilhe sentimentos 20x', 'social', 'bronze', '💬', 'Expressar-se 20x', 50, 'Fale sobre o que sente'),
('empatico', 'Coração Empático', 'Complete missões de empatia 15x', 'social', 'prata', '💖', '15 missões de empatia', 100, 'Entenda os outros'),
('pacificador', 'Pacificador', 'Resolva conflitos pacificamente 5x', 'social', 'ouro', '🕊️', 'Resolver 5 conflitos', 150, 'Use palavras, não força'),
('lider', 'Líder Natural', 'Organize atividade em grupo 3x', 'social', 'ouro', '👑', 'Liderar 3 atividades', 200, 'Tome iniciativa'),
('inclusivo', 'Incluindo Todos', 'Inclua alguém novo 5x', 'social', 'prata', '🌈', 'Incluir 5 pessoas', 100, 'Ninguém fica de fora'),
('exemplo', 'Exemplo Positivo', 'Seja elogiado por bom comportamento 10x', 'social', 'ouro', '⭐', '10 elogios recebidos', 200, 'Seja um exemplo');

-- ==========================================
-- CATEGORIA 7: CRIATIVIDADE E EXPRESSÃO (10 badges)
-- ==========================================

INSERT INTO badge_catalog (badge_key, name, description, category, rarity, icon, unlock_condition, reward_fp, unlock_hint) VALUES
('primeiro_desenho', 'Primeiro Traço', 'Faça seu primeiro desenho', 'criatividade', 'bronze', '🎨', 'Desenhar 1x', 15, 'Solte a imaginação'),
('artista', 'Artista em Formação', 'Faça 10 desenhos', 'criatividade', 'prata', '🖌️', 'Desenhar 10x', 75, 'Continue criando'),
('escritor', 'Escritor Mirim', 'Escreva uma história', 'criatividade', 'prata', '📝', 'Escrever história', 100, 'Crie uma narrativa'),
('musico', 'Músico Iniciante', 'Crie uma música ou ritmo', 'criatividade', 'prata', '🎵', 'Criar música', 100, 'Experimente sons'),
('inventor', 'Inventor Criativo', 'Invente algo novo', 'criatividade', 'ouro', '💡', 'Criar invenção', 150, 'Use a criatividade'),
('poeta', 'Poeta do Coração', 'Escreva um poema', 'criatividade', 'prata', '📜', 'Escrever poema', 100, 'Expresse em versos'),
('ator', 'Ator Nato', 'Faça uma apresentação teatral', 'criatividade', 'ouro', '🎭', 'Atuar 1x', 150, 'Interprete um personagem'),
('construtor', 'Construtor Genial', 'Construa algo com as mãos', 'criatividade', 'prata', '🔨', 'Construir 1x', 100, 'Crie com as mãos'),
('chef', 'Chef Mirim', 'Ajude a cozinhar algo novo', 'criatividade', 'prata', '👨‍🍳', 'Cozinhar 1x', 100, 'Explore a culinária'),
('renascenca', 'Da Vinci Mirim', 'Explore 5 formas diferentes de arte', 'criatividade', 'platina', '🌟', '5 tipos de arte', 500, 'Seja versátil!');

-- ==========================================
-- CATEGORIA 8: BADGES SECRETOS (5 badges)
-- ==========================================

INSERT INTO badge_catalog (badge_key, name, description, category, rarity, icon, unlock_condition, reward_fp, is_secret, unlock_hint) VALUES
('coruja_noturna', 'Coruja Noturna', 'Complete missão depois das 22h', 'secreto', 'prata', '🦉', 'Missão após 22h', 100, 1, '???'),
('madrugador', 'Pássaro Matinal', 'Complete missão antes das 6h', 'secreto', 'prata', '🐔', 'Missão antes de 6h', 100, 1, '???'),
('perfeccionista', 'Perfeição Absoluta', 'Acerte todas as opções em 10 missões', 'secreto', 'ouro', '💯', '10 missões perfeitas', 300, 1, '???'),
('explorador_nato', 'Explorador Nato', 'Complete pelo menos 1 missão de cada área', 'secreto', 'ouro', '🗺️', 'Todas as áreas exploradas', 250, 1, '???'),
('unicornio', 'Unicórnio Mágico', 'Atinja todos os badges de uma categoria', 'secreto', 'platina', '🦄', 'Categoria 100%', 1000, 1, '???');

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_child_badges_progress_child ON child_badges_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_child_badges_progress_percentage ON child_badges_progress(percentage);

-- ============================================
-- FIM DA MIGRATION DIA 3
-- ============================================
-- TOTAL: 105 BADGES ÚNICOS
-- 8 CATEGORIAS
-- 4 NÍVEIS DE RARIDADE
-- Sistema de progresso com porcentagem
-- Badges secretos
-- ============================================
