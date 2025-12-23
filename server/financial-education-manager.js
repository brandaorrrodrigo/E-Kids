// FINANCIAL EDUCATION MANAGER
// Gerencia educação financeira, cofrinhos, decisões de FP e relatórios

class FinancialEducationManager {
  constructor(db) {
    this.db = db;
  }

  // ============================================
  // POP-UP AO GANHAR FP
  // ============================================

  /**
   * Registra uma decisão de FP (guardar, gastar ou decidir depois)
   */
  recordFpDecision(childId, fpAmount, decision, context, source) {
    const stmt = this.db.prepare(`
      INSERT INTO fp_decisions (child_id, fp_amount, decision, context, source)
      VALUES (?, ?, ?, ?, ?)
    `);

    return stmt.run(childId, fpAmount, decision, context, source);
  }

  /**
   * Obtém histórico de decisões de uma criança
   */
  getFpDecisionHistory(childId, limit = 50) {
    const stmt = this.db.prepare(`
      SELECT * FROM fp_decisions
      WHERE child_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);

    return stmt.all(childId, limit);
  }

  /**
   * Calcula taxa de impulsividade (% de decisões "gastar agora")
   */
  getImpulsivityRate(childId, days = 30) {
    const stmt = this.db.prepare(`
      SELECT
        COUNT(*) as total_decisions,
        SUM(CASE WHEN decision = 'spend' THEN 1 ELSE 0 END) as spend_decisions,
        SUM(CASE WHEN decision = 'save' THEN 1 ELSE 0 END) as save_decisions
      FROM fp_decisions
      WHERE child_id = ? AND created_at >= date('now', '-' || ? || ' days')
    `);

    const result = stmt.get(childId, days);
    if (result.total_decisions === 0) return { impulsivity_rate: 0, savings_rate: 0 };

    return {
      impulsivity_rate: (result.spend_decisions / result.total_decisions) * 100,
      savings_rate: (result.save_decisions / result.total_decisions) * 100,
      total_decisions: result.total_decisions
    };
  }

  // ============================================
  // COFRINHO
  // ============================================

  /**
   * Cria um novo cofrinho
   */
  createPiggyBank(childId, name, goalType, targetFp = null) {
    const stmt = this.db.prepare(`
      INSERT INTO piggy_banks (child_id, name, goal_type, target_fp)
      VALUES (?, ?, ?, ?)
    `);

    return stmt.run(childId, name, goalType, targetFp);
  }

  /**
   * Lista cofrinhos ativos de uma criança
   */
  getActivePiggyBanks(childId) {
    const stmt = this.db.prepare(`
      SELECT * FROM piggy_banks
      WHERE child_id = ? AND is_active = 1
      ORDER BY created_at DESC
    `);

    return stmt.all(childId);
  }

  /**
   * Deposita FP em um cofrinho
   */
  depositToPiggyBank(piggyBankId, amount) {
    const stmt = this.db.prepare(`
      UPDATE piggy_banks
      SET current_fp = current_fp + ?
      WHERE id = ?
    `);

    return stmt.run(amount, piggyBankId);
  }

  /**
   * Retira FP de um cofrinho
   */
  withdrawFromPiggyBank(piggyBankId, amount) {
    const stmt = this.db.prepare(`
      UPDATE piggy_banks
      SET current_fp = current_fp - ?
      WHERE id = ? AND current_fp >= ?
    `);

    return stmt.run(amount, piggyBankId, amount);
  }

  /**
   * Completa uma meta do cofrinho
   */
  completePiggyBankGoal(piggyBankId) {
    const stmt = this.db.prepare(`
      UPDATE piggy_banks
      SET is_active = 0, completed_at = datetime('now')
      WHERE id = ?
    `);

    return stmt.run(piggyBankId);
  }

  /**
   * Total poupado em todos os cofrinhos
   */
  getTotalSaved(childId) {
    const stmt = this.db.prepare(`
      SELECT SUM(current_fp) as total FROM piggy_banks
      WHERE child_id = ? AND is_active = 1
    `);

    const result = stmt.get(childId);
    return result.total || 0;
  }

  // ============================================
  // EXTRATO MENSAL
  // ============================================

  /**
   * Gera ou atualiza extrato mensal
   */
  generateMonthlyStatement(childId, month, year) {
    // Calcular FP ganhos no mês
    const earned = this.db.prepare(`
      SELECT COALESCE(SUM(fp_earned), 0) as total
      FROM activities_completed
      WHERE child_id = ?
        AND strftime('%m', completed_at) = ?
        AND strftime('%Y', completed_at) = ?
    `).get(childId, month.toString().padStart(2, '0'), year.toString()).total;

    // Calcular FP guardados no mês
    const saved = this.db.prepare(`
      SELECT COALESCE(SUM(fp_amount), 0) as total
      FROM fp_decisions
      WHERE child_id = ?
        AND decision = 'save'
        AND strftime('%m', created_at) = ?
        AND strftime('%Y', created_at) = ?
    `).get(childId, month.toString().padStart(2, '0'), year.toString()).total;

    // Calcular FP gastos no mês
    const spent = this.db.prepare(`
      SELECT COALESCE(SUM(fp_amount), 0) as total
      FROM fp_decisions
      WHERE child_id = ?
        AND decision = 'spend'
        AND strftime('%m', created_at) = ?
        AND strftime('%Y', created_at) = ?
    `).get(childId, month.toString().padStart(2, '0'), year.toString()).total;

    // Buscar saldo final
    const child = this.db.prepare('SELECT total_fp FROM children WHERE id = ?').get(childId);
    const finalBalance = child.total_fp || 0;

    // Calcular % poupado
    const savingsPercentage = earned > 0 ? (saved / earned) * 100 : 0;

    // Dados do extrato
    const statementData = {
      earned,
      saved,
      spent,
      finalBalance,
      savingsPercentage: savingsPercentage.toFixed(2)
    };

    // Inserir ou atualizar extrato
    const stmt = this.db.prepare(`
      INSERT INTO monthly_statements (child_id, month, year, fp_earned, fp_saved, fp_spent, final_balance, savings_percentage, statement_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(child_id, month, year) DO UPDATE SET
        fp_earned = excluded.fp_earned,
        fp_saved = excluded.fp_saved,
        fp_spent = excluded.fp_spent,
        final_balance = excluded.final_balance,
        savings_percentage = excluded.savings_percentage,
        statement_data = excluded.statement_data
    `);

    stmt.run(childId, month, year, earned, saved, spent, finalBalance, savingsPercentage, JSON.stringify(statementData));

    return statementData;
  }

  /**
   * Obtém extrato mensal
   */
  getMonthlyStatement(childId, month, year) {
    const stmt = this.db.prepare(`
      SELECT * FROM monthly_statements
      WHERE child_id = ? AND month = ? AND year = ?
    `);

    return stmt.get(childId, month, year);
  }

  /**
   * Gera mensagem narrada do extrato
   */
  generateStatementNarration(statementData) {
    const messages = [];

    if (statementData.fp_earned > 0) {
      messages.push(`Neste mês você ganhou ${statementData.fp_earned} FP.`);
    }

    if (statementData.fp_saved > statementData.fp_spent) {
      messages.push('Você guardou mais do que gastou. Isso é o que pessoas inteligentes fazem.');
    } else if (statementData.fp_saved > 0) {
      messages.push('Você guardou um pouco. Continue assim!');
    }

    if (statementData.savingsPercentage > 50) {
      messages.push('Você é um verdadeiro poupador!');
    }

    return messages.join(' ');
  }

  // ============================================
  // MISSÕES FINANCEIRAS
  // ============================================

  /**
   * Atribui missão financeira a uma criança
   */
  assignFinancialMission(childId, missionId) {
    const mission = this.db.prepare('SELECT * FROM financial_missions WHERE id = ?').get(missionId);
    if (!mission) return null;

    const stmt = this.db.prepare(`
      INSERT INTO child_financial_missions (child_id, mission_id, current_progress, target_progress)
      VALUES (?, ?, 0, ?)
    `);

    return stmt.run(childId, missionId, mission.target_value);
  }

  /**
   * Atualiza progresso de missão financeira
   */
  updateFinancialMissionProgress(childId, missionId, increment = 1) {
    const stmt = this.db.prepare(`
      UPDATE child_financial_missions
      SET current_progress = current_progress + ?
      WHERE child_id = ? AND mission_id = ? AND status = 'active'
    `);

    stmt.run(increment, childId, missionId);

    // Verificar se completou
    const mission = this.db.prepare(`
      SELECT * FROM child_financial_missions
      WHERE child_id = ? AND mission_id = ? AND status = 'active'
    `).get(childId, missionId);

    if (mission && mission.current_progress >= mission.target_progress) {
      this.completeFinancialMission(childId, missionId);
      return { completed: true, mission };
    }

    return { completed: false, mission };
  }

  /**
   * Completa missão financeira
   */
  completeFinancialMission(childId, missionId) {
    // Marcar como completa
    this.db.prepare(`
      UPDATE child_financial_missions
      SET status = 'completed', completed_at = datetime('now')
      WHERE child_id = ? AND mission_id = ? AND status = 'active'
    `).run(childId, missionId);

    // Dar recompensa de FP
    const mission = this.db.prepare('SELECT * FROM financial_missions WHERE id = ?').get(missionId);
    if (mission && mission.reward_fp > 0) {
      this.db.prepare('UPDATE children SET total_fp = total_fp + ? WHERE id = ?').run(mission.reward_fp, childId);
    }

    return mission;
  }

  /**
   * Lista missões financeiras ativas de uma criança
   */
  getActiveFinancialMissions(childId) {
    const stmt = this.db.prepare(`
      SELECT cfm.*, fm.name, fm.description, fm.reward_fp, fm.mission_type
      FROM child_financial_missions cfm
      JOIN financial_missions fm ON cfm.mission_id = fm.id
      WHERE cfm.child_id = ? AND cfm.status = 'active'
    `);

    return stmt.all(childId);
  }

  // ============================================
  // BADGES
  // ============================================

  /**
   * Verifica e concede badges financeiros
   */
  checkAndAwardBadges(childId) {
    const badges = this.db.prepare('SELECT * FROM financial_badges').all();
    const awarded = [];

    for (const badge of badges) {
      const alreadyHas = this.db.prepare(`
        SELECT id FROM child_financial_badges
        WHERE child_id = ? AND badge_id = ?
      `).get(childId, badge.id);

      if (alreadyHas) continue;

      const criteria = JSON.parse(badge.criteria || '{}');
      let shouldAward = false;

      // Verificar critérios
      if (criteria.first_save) {
        const hasSaved = this.db.prepare(`
          SELECT id FROM fp_decisions WHERE child_id = ? AND decision = 'save' LIMIT 1
        `).get(childId);
        shouldAward = !!hasSaved;
      }

      if (criteria.total_saved) {
        const total = this.getTotalSaved(childId);
        shouldAward = total >= criteria.total_saved;
      }

      if (criteria.goals_completed) {
        const completed = this.db.prepare(`
          SELECT COUNT(*) as count FROM piggy_banks
          WHERE child_id = ? AND is_active = 0 AND completed_at IS NOT NULL
        `).get(childId);
        shouldAward = completed.count >= criteria.goals_completed;
      }

      if (shouldAward) {
        this.awardFinancialBadge(childId, badge.id);
        awarded.push(badge);
      }
    }

    return awarded;
  }

  /**
   * Concede badge financeiro
   */
  awardFinancialBadge(childId, badgeId) {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO child_financial_badges (child_id, badge_id)
      VALUES (?, ?)
    `);

    stmt.run(childId, badgeId);

    // Dar FP de recompensa
    const badge = this.db.prepare('SELECT reward_fp FROM financial_badges WHERE id = ?').get(badgeId);
    if (badge && badge.reward_fp > 0) {
      this.db.prepare('UPDATE children SET total_fp = total_fp + ? WHERE id = ?').run(badge.reward_fp, childId);
    }
  }

  /**
   * Lista badges financeiros de uma criança
   */
  getChildFinancialBadges(childId) {
    const stmt = this.db.prepare(`
      SELECT cfb.*, fb.name, fb.description, fb.badge_type, fb.icon
      FROM child_financial_badges cfb
      JOIN financial_badges fb ON cfb.badge_id = fb.id
      WHERE cfb.child_id = ?
      ORDER BY cfb.earned_at DESC
    `);

    return stmt.all(childId);
  }

  // ============================================
  // BÔNUS POR POUPANÇA
  // ============================================

  /**
   * Aplica bônus invisível por poupança
   */
  applySavingsBonus(childId, bonusType, bonusValue, reason) {
    const stmt = this.db.prepare(`
      INSERT INTO savings_bonuses (child_id, bonus_type, bonus_value, reason)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(childId, bonusType, bonusValue, reason);

    // Aplicar bônus de FP se for o caso
    if (bonusType === 'fp_extra' && bonusValue > 0) {
      this.db.prepare('UPDATE children SET total_fp = total_fp + ? WHERE id = ?').run(bonusValue, childId);
    }
  }
}

module.exports = FinancialEducationManager;
