// ========================================
// PROGRESSION MANAGER - Sistema de Níveis
// ========================================
// Gerencia progressão de níveis e dificuldade adaptativa
// dos mini-games do E-Kids PRO

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'ekids.db');
const db = new Database(dbPath);

class ProgressionManager {
  constructor() {
    // XP necessário para cada nível (acumulativo)
    this.XP_POR_NIVEL = {
      1: 0,
      2: 200,
      3: 500,
      4: 900,
      5: 1400,
      6: 2000,
      7: 2700,
      8: 3500,
      9: 4500,
      10: 6000  // Nível máximo
    };

    // Bônus de FP por level up
    this.FP_BONUS_POR_NIVEL = {
      2: 10, 3: 15, 4: 20, 5: 30,
      6: 40, 7: 50, 8: 60, 9: 75, 10: 100
    };
  }

  // ========================================
  // MÉTODOS PRINCIPAIS
  // ========================================

  /**
   * Obter progressão de uma criança em um jogo específico
   * @param {number} childId - ID da criança
   * @param {string} gameKey - Chave do jogo (memoria, quiz, etc)
   * @returns {object} Dados de progressão
   */
  getProgression(childId, gameKey) {
    let progression = db.prepare(`
      SELECT * FROM game_progression
      WHERE child_id = ? AND game_key = ?
    `).get(childId, gameKey);

    // Se não existe, criar novo registro
    if (!progression) {
      const insert = db.prepare(`
        INSERT INTO game_progression (child_id, game_key, nivel_atual, xp_total)
        VALUES (?, ?, 1, 0)
      `);
      const result = insert.run(childId, gameKey);

      progression = {
        id: result.lastInsertRowid,
        child_id: childId,
        game_key: gameKey,
        nivel_atual: 1,
        xp_total: 0,
        partidas_jogadas: 0,
        vitorias: 0,
        melhor_score: 0,
        melhor_tempo: null,
        nivel_up_count: 0
      };
    }

    return progression;
  }

  /**
   * Calcular XP ganho baseado em performance
   * @param {string} gameKey - Chave do jogo
   * @param {object} performance - Dados de desempenho
   * @returns {number} XP ganho
   */
  calculateXP(gameKey, performance) {
    let xp = 0;

    // XP base por completar
    if (performance.completed) {
      xp += 25;
    }

    // XP por accuracy/precisão (0-100%)
    if (performance.accuracy !== undefined) {
      if (performance.accuracy >= 90) xp += 75;      // Excelente
      else if (performance.accuracy >= 70) xp += 50; // Bom
      else if (performance.accuracy >= 50) xp += 25; // Médio
      else xp += 10;                                  // Tentou
    }

    // XP por velocidade (se aplicável)
    if (performance.time && performance.targetTime) {
      if (performance.time <= performance.targetTime * 0.7) {
        xp += 30; // Muito rápido
      } else if (performance.time <= performance.targetTime) {
        xp += 15; // No tempo
      }
    }

    // Bônus por primeira vitória do dia
    if (performance.firstOfDay) {
      xp += 20;
    }

    // Bônus por sequência perfeita
    if (performance.perfectRun) {
      xp += 40;
    }

    return Math.max(xp, 10); // Mínimo 10 XP sempre
  }

  /**
   * Registrar partida e atualizar progressão
   * @param {number} childId - ID da criança
   * @param {string} gameKey - Chave do jogo
   * @param {object} performance - Dados de desempenho
   * @returns {object} Resultado com XP, nível, etc
   */
  recordGame(childId, gameKey, performance) {
    const progression = this.getProgression(childId, gameKey);
    const xpGanho = this.calculateXP(gameKey, performance);

    const novoXP = progression.xp_total + xpGanho;
    const nivelAnterior = progression.nivel_atual;
    const novoNivel = this.calculateLevel(novoXP);

    // Atualizar estatísticas
    const update = db.prepare(`
      UPDATE game_progression
      SET
        xp_total = ?,
        nivel_atual = ?,
        partidas_jogadas = partidas_jogadas + 1,
        vitorias = vitorias + ?,
        melhor_score = MAX(melhor_score, ?),
        melhor_tempo = CASE
          WHEN melhor_tempo IS NULL THEN ?
          WHEN ? IS NOT NULL AND ? < melhor_tempo THEN ?
          ELSE melhor_tempo
        END,
        ultima_jogada = CURRENT_TIMESTAMP
      WHERE child_id = ? AND game_key = ?
    `);

    update.run(
      novoXP,
      novoNivel,
      performance.completed ? 1 : 0,
      performance.score || 0,
      performance.time,
      performance.time,
      performance.time,
      performance.time,
      childId,
      gameKey
    );

    // Verificar se subiu de nível
    let levelUpInfo = null;
    if (novoNivel > nivelAnterior) {
      levelUpInfo = this.handleLevelUp(childId, gameKey, nivelAnterior, novoNivel, novoXP);
    }

    return {
      xpGanho,
      xpTotal: novoXP,
      nivelAnterior,
      nivelAtual: novoNivel,
      levelUp: levelUpInfo,
      proximoNivel: this.getNextLevelInfo(novoNivel, novoXP),
      performance: performance
    };
  }

  /**
   * Calcular nível baseado em XP total
   * @param {number} xpTotal - XP acumulado
   * @returns {number} Nível atual
   */
  calculateLevel(xpTotal) {
    let nivel = 1;
    for (let i = 10; i >= 1; i--) {
      if (xpTotal >= this.XP_POR_NIVEL[i]) {
        nivel = i;
        break;
      }
    }
    return nivel;
  }

  /**
   * Obter informações sobre próximo nível
   * @param {number} nivelAtual - Nível atual
   * @param {number} xpAtual - XP atual
   * @returns {object} Info do próximo nível
   */
  getNextLevelInfo(nivelAtual, xpAtual) {
    if (nivelAtual >= 10) {
      return {
        isMaxLevel: true,
        mensagem: 'Você alcançou o nível MÁXIMO! 🏆'
      };
    }

    const xpNivelAtual = this.XP_POR_NIVEL[nivelAtual];
    const xpProximoNivel = this.XP_POR_NIVEL[nivelAtual + 1];
    const xpNecessario = xpProximoNivel - xpAtual;
    const xpProgresso = xpAtual - xpNivelAtual;
    const xpTotalNivel = xpProximoNivel - xpNivelAtual;
    const progressoPercentual = Math.round((xpProgresso / xpTotalNivel) * 100);

    return {
      proximoNivel: nivelAtual + 1,
      xpNecessario,
      xpAtual,
      xpProximoNivel,
      progressoPercentual
    };
  }

  /**
   * Lidar com level up (conceder recompensas, badges, etc)
   * @param {number} childId - ID da criança
   * @param {string} gameKey - Chave do jogo
   * @param {number} nivelAnterior - Nível anterior
   * @param {number} nivelNovo - Novo nível
   * @param {number} xpTotal - XP total acumulado
   * @returns {object} Info do level up
   */
  handleLevelUp(childId, gameKey, nivelAnterior, nivelNovo, xpTotal) {
    // Calcular bônus de FP
    const fpBonus = this.FP_BONUS_POR_NIVEL[nivelNovo] || 10;

    // Registrar no histórico
    db.prepare(`
      INSERT INTO level_up_history
      (child_id, game_key, nivel_anterior, nivel_novo, xp_no_levelup, fp_bonus)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(childId, gameKey, nivelAnterior, nivelNovo, xpTotal, fpBonus);

    // Incrementar contador de level ups
    db.prepare(`
      UPDATE game_progression
      SET nivel_up_count = nivel_up_count + 1
      WHERE child_id = ? AND game_key = ?
    `).run(childId, gameKey);

    // Dar FP bônus
    if (fpBonus > 0) {
      db.prepare(`
        UPDATE children
        SET fp = fp + ?
        WHERE id = ?
      `).run(fpBonus, childId);
    }

    // Verificar e conceder badges
    this.checkLevelBadges(childId, gameKey, nivelNovo);

    return {
      nivelAnterior,
      nivelNovo,
      fpBonus,
      mensagem: this.getLevelUpMessage(nivelNovo),
      estrelas: this.getStarsForLevel(nivelNovo)
    };
  }

  /**
   * Mensagem motivacional de level up
   * @param {number} nivel - Novo nível
   * @returns {string} Mensagem
   */
  getLevelUpMessage(nivel) {
    const mensagens = {
      2: '🎉 Parabéns! Você está evoluindo!',
      3: '⭐ Ótimo! Continue assim!',
      4: '🚀 Você está ficando craque!',
      5: '🏆 Nível Intermediário alcançado!',
      6: '💪 Você está ficando muito bom nisso!',
      7: '🎯 Nível Avançado! Impressionante!',
      8: '🌟 Quase lá! Você é fera!',
      9: '👑 Nível Mestre próximo!',
      10: '🏆 NÍVEL MÁXIMO! Você é um MESTRE!'
    };
    return mensagens[nivel] || '🎉 Level Up!';
  }

  /**
   * Estrelas para o nível
   * @param {number} nivel - Nível
   * @returns {string} Estrelas
   */
  getStarsForLevel(nivel) {
    if (nivel <= 2) return '⭐';
    if (nivel <= 4) return '⭐⭐';
    if (nivel <= 6) return '⭐⭐⭐';
    if (nivel <= 8) return '⭐⭐⭐⭐';
    return '⭐⭐⭐⭐⭐';
  }

  // ========================================
  // BADGES E CONQUISTAS
  // ========================================

  /**
   * Verificar e conceder badges relacionadas a níveis
   * @param {number} childId - ID da criança
   * @param {string} gameKey - Chave do jogo
   * @param {number} nivel - Novo nível
   */
  checkLevelBadges(childId, gameKey, nivel) {
    // Badge: Primeira evolução
    if (nivel === 2) {
      this.grantBadge(childId, 'primeira_evolucao');
    }

    // Badge: Nível 5 em qualquer jogo
    if (nivel === 5) {
      this.grantBadge(childId, 'nivel_5_qualquer');
    }

    // Badge: Nível 7 (Avançado) pela primeira vez
    if (nivel === 7) {
      const firstLevel7 = db.prepare(`
        SELECT COUNT(*) as count FROM game_progression
        WHERE child_id = ? AND nivel_atual >= 7
      `).get(childId);

      if (firstLevel7.count === 1) {
        this.grantBadge(childId, 'nivel_7_primeiro');
      }
    }

    // Badge: Nível 10 (MESTRE)
    if (nivel === 10) {
      this.grantBadge(childId, 'nivel_10_qualquer');

      // Verificar se é mestre em TODOS os jogos
      this.checkMasterOfAllBadge(childId);
    }

    // Badge: Nível 5+ em todos os jogos
    const allGamesLevel5 = this.checkAllGamesLevel5(childId);
    if (allGamesLevel5) {
      this.grantBadge(childId, 'nivel_5_todos');
    }

    // Badge: Evolução rápida (3 níveis em um dia)
    const levelUpsToday = this.getLevelUpsToday(childId, gameKey);
    if (levelUpsToday >= 3) {
      this.grantBadge(childId, 'rapida_evolucao');
    }
  }

  /**
   * Conceder badge para criança
   * @param {number} childId - ID da criança
   * @param {string} badgeKey - Chave da badge
   */
  grantBadge(childId, badgeKey) {
    try {
      // Inserir badge (ignora se já existe)
      db.prepare(`
        INSERT OR IGNORE INTO children_badges (child_id, badge_key)
        VALUES (?, ?)
      `).run(childId, badgeKey);

      // Verificar se foi realmente inserida (nova)
      const badge = db.prepare(`
        SELECT cb.id, bc.reward_fp
        FROM children_badges cb
        JOIN badge_catalog bc ON cb.badge_key = bc.badge_key
        WHERE cb.child_id = ? AND cb.badge_key = ?
        AND cb.id = last_insert_rowid()
      `).get(childId, badgeKey);

      // Se é nova, dar FP reward
      if (badge && badge.reward_fp) {
        db.prepare('UPDATE children SET fp = fp + ? WHERE id = ?')
          .run(badge.reward_fp, childId);
      }
    } catch (error) {
      console.error('Erro ao conceder badge:', error);
    }
  }

  /**
   * Verificar se criança tem nível 5+ em todos os jogos
   * @param {number} childId - ID da criança
   * @returns {boolean}
   */
  checkAllGamesLevel5(childId) {
    const minigamesCount = 4; // Ajustar conforme número total de jogos
    const level5Count = db.prepare(`
      SELECT COUNT(*) as count
      FROM game_progression
      WHERE child_id = ? AND nivel_atual >= 5
    `).get(childId);

    return level5Count && level5Count.count >= minigamesCount;
  }

  /**
   * Verificar se criança é mestre (nível 10) em todos os jogos
   * @param {number} childId - ID da criança
   */
  checkMasterOfAllBadge(childId) {
    const minigamesCount = 4; // Ajustar conforme número total de jogos
    const masterCount = db.prepare(`
      SELECT COUNT(*) as count
      FROM game_progression
      WHERE child_id = ? AND nivel_atual >= 10
    `).get(childId);

    if (masterCount && masterCount.count >= minigamesCount) {
      this.grantBadge(childId, 'nivelamento_completo');
    }
  }

  /**
   * Contar level ups de hoje
   * @param {number} childId - ID da criança
   * @param {string} gameKey - Chave do jogo
   * @returns {number} Quantidade de level ups hoje
   */
  getLevelUpsToday(childId, gameKey) {
    const today = new Date().toISOString().split('T')[0];
    const count = db.prepare(`
      SELECT COUNT(*) as count
      FROM level_up_history
      WHERE child_id = ?
      AND game_key = ?
      AND DATE(timestamp) = ?
    `).get(childId, gameKey, today);

    return count ? count.count : 0;
  }

  // ========================================
  // DIFICULDADE ADAPTATIVA
  // ========================================

  /**
   * Obter configuração de dificuldade para o nível atual
   * @param {string} gameKey - Chave do jogo
   * @param {number} nivel - Nível atual
   * @returns {object} Configuração de dificuldade
   */
  getDifficultyForLevel(gameKey, nivel) {
    const difficultyMethods = {
      'memoria': this.getMemoryDifficulty,
      'quiz': this.getQuizDifficulty,
      'caca_tesouro': this.getTreasureHuntDifficulty,
      'diario': this.getDiaryDifficulty,
      'matematica': this.getMathDifficulty,
      'palavra_secreta': this.getWordDifficulty
    };

    const method = difficultyMethods[gameKey];
    return method ? method.call(this, nivel) : { nivel };
  }

  // Configurações de dificuldade por jogo

  getMemoryDifficulty(nivel) {
    if (nivel <= 2) return { pares: 8, tempo: 3000, dicas: true };
    if (nivel <= 4) return { pares: 10, tempo: 2500, dicas: false };
    if (nivel <= 6) return { pares: 12, tempo: 2000, dicas: false };
    if (nivel <= 8) return { pares: 14, tempo: 1500, dicas: false };
    return { pares: 16, tempo: 1000, dicas: false };
  }

  getQuizDifficulty(nivel) {
    if (nivel <= 2) return { perguntas: 5, tempo: 20, pool: 'facil' };
    if (nivel <= 4) return { perguntas: 7, tempo: 18, pool: 'facil-medio' };
    if (nivel <= 6) return { perguntas: 10, tempo: 15, pool: 'medio' };
    if (nivel <= 8) return { perguntas: 12, tempo: 12, pool: 'medio-dificil' };
    return { perguntas: 15, tempo: 10, pool: 'dificil' };
  }

  getTreasureHuntDifficulty(nivel) {
    if (nivel <= 2) return { tesouros: 3, tempo: 300, pistasTipo: 'direta' };
    if (nivel <= 4) return { tesouros: 4, tempo: 240, pistasTipo: 'media' };
    if (nivel <= 6) return { tesouros: 5, tempo: 180, pistasTipo: 'indireta' };
    if (nivel <= 8) return { tesouros: 6, tempo: 150, pistasTipo: 'enigma' };
    return { tesouros: 7, tempo: 120, pistasTipo: 'charada' };
  }

  getDiaryDifficulty(nivel) {
    if (nivel <= 2) return { minPalavras: 20, tema: 'simples' };
    if (nivel <= 4) return { minPalavras: 30, tema: 'variado' };
    if (nivel <= 6) return { minPalavras: 50, tema: 'abstrato' };
    if (nivel <= 8) return { minPalavras: 75, tema: 'complexo' };
    return { minPalavras: 100, tema: 'filosofico' };
  }

  getMathDifficulty(nivel) {
    if (nivel <= 2) return { ops: ['+', '-'], max: 20, tempo: 90 };
    if (nivel <= 4) return { ops: ['+', '-', '×'], max: 50, tempo: 75 };
    if (nivel <= 6) return { ops: ['+', '-', '×', '÷'], max: 100, tempo: 60 };
    if (nivel <= 8) return { ops: ['+', '-', '×', '÷'], max: 200, tempo: 45, parenteses: true };
    return { ops: ['+', '-', '×', '÷', '²'], max: 500, tempo: 30 };
  }

  getWordDifficulty(nivel) {
    if (nivel <= 2) return { letras: [4, 5], tentativas: 8, categoria: 'animais-cores' };
    if (nivel <= 4) return { letras: [5, 6], tentativas: 7, categoria: 'frutas-objetos' };
    if (nivel <= 6) return { letras: [6, 8], tentativas: 6, categoria: 'profissoes' };
    if (nivel <= 8) return { letras: [8, 10], tentativas: 5, categoria: 'variadas' };
    return { letras: [10, 12], tentativas: 4, categoria: 'abstratas' };
  }

  // ========================================
  // ESTATÍSTICAS E ANALYTICS
  // ========================================

  /**
   * Obter estatísticas gerais de progressão de uma criança
   * @param {number} childId - ID da criança
   * @returns {object} Estatísticas completas
   */
  getChildProgressionStats(childId) {
    const stats = db.prepare(`
      SELECT
        game_key,
        nivel_atual,
        xp_total,
        partidas_jogadas,
        vitorias,
        melhor_score,
        melhor_tempo,
        nivel_up_count,
        ultima_jogada
      FROM game_progression
      WHERE child_id = ?
      ORDER BY nivel_atual DESC, xp_total DESC
    `).all(childId);

    const totalLevelUps = stats.reduce((sum, s) => sum + s.nivel_up_count, 0);
    const nivelMedio = stats.length > 0
      ? stats.reduce((sum, s) => sum + s.nivel_atual, 0) / stats.length
      : 0;

    return {
      jogos: stats,
      totalLevelUps,
      nivelMedio: Math.round(nivelMedio * 10) / 10,
      jogoMaisAvancado: stats[0] || null,
      totalPartidas: stats.reduce((sum, s) => sum + s.partidas_jogadas, 0),
      totalVitorias: stats.reduce((sum, s) => sum + s.vitorias, 0)
    };
  }

  /**
   * Obter histórico de level ups de uma criança
   * @param {number} childId - ID da criança
   * @param {number} limit - Limite de registros
   * @returns {array} Histórico
   */
  getLevelUpHistory(childId, limit = 10) {
    return db.prepare(`
      SELECT
        game_key,
        nivel_anterior,
        nivel_novo,
        xp_no_levelup,
        fp_bonus,
        timestamp
      FROM level_up_history
      WHERE child_id = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `).all(childId, limit);
  }
}

// Exportar instância única (Singleton)
module.exports = new ProgressionManager();
