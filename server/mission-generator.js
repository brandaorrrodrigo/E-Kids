// ============================================
// E-KIDS PRO - GERADOR DE MISSÕES INFINITAS
// ============================================

/**
 * Substitui variáveis em um template
 * @param {string} template - Template com variáveis do tipo {variavel}
 * @param {object} variables - Objeto com arrays de valores possíveis
 * @returns {string} Template com variáveis substituídas
 */
function replaceVariables(template, variables) {
  if (!variables || !template) return template;

  let result = template;
  const parsedVars = typeof variables === 'string' ? JSON.parse(variables) : variables;

  // Para cada variável no template {variavel}
  const varRegex = /{(\w+)}/g;
  let match;
  const replacements = {};

  while ((match = varRegex.exec(template)) !== null) {
    const varName = match[1];

    // Se já escolhemos um valor para esta variável, reutilizar
    if (replacements[varName]) {
      continue;
    }

    // Escolher valor aleatório do array de possibilidades
    if (parsedVars[varName] && Array.isArray(parsedVars[varName])) {
      const options = parsedVars[varName];
      const randomValue = options[Math.floor(Math.random() * options.length)];
      replacements[varName] = randomValue;
    }
  }

  // Substituir todas as ocorrências
  for (const [varName, value] of Object.entries(replacements)) {
    const regex = new RegExp(`{${varName}}`, 'g');
    result = result.replace(regex, value);
  }

  return result;
}

/**
 * Gera missões a partir de templates
 * @param {object} db - Instância do banco de dados
 * @param {object} options - Opções de geração
 * @param {string} options.area - Área específica (opcional)
 * @param {number} options.difficulty - Dificuldade específica (opcional)
 * @param {number} options.count - Quantidade de missões a gerar (padrão: 10)
 * @param {number} options.phase - Fase para as missões (padrão: 4)
 * @returns {Array} Array de missões geradas
 */
function generateMissions(db, options = {}) {
  const {
    area = null,
    difficulty = null,
    count = 10,
    phase = 4
  } = options;

  // Buscar templates
  let query = 'SELECT * FROM mission_templates WHERE is_active = 1';
  const params = [];

  if (area) {
    query += ' AND area = ?';
    params.push(area);
  }

  if (difficulty) {
    query += ' AND difficulty = ?';
    params.push(difficulty);
  }

  const templates = db.prepare(query).all(...params);

  if (templates.length === 0) {
    return [];
  }

  const generatedMissions = [];

  for (let i = 0; i < count; i++) {
    // Escolher template aleatório
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Substituir variáveis
    const title = replaceVariables(template.prompt_template, template.variables).substring(0, 50);
    const description = `Missão gerada automaticamente - Dificuldade ${template.difficulty}`;
    const prompt = replaceVariables(template.prompt_template, template.variables);
    const optionA = replaceVariables(template.optionA_template, template.variables);
    const optionB = replaceVariables(template.optionB_template, template.variables);
    const optionC = replaceVariables(template.optionC_template, template.variables);
    const feedbackA = replaceVariables(template.feedbackA_template, template.variables);
    const feedbackB = replaceVariables(template.feedbackB_template, template.variables);
    const feedbackC = replaceVariables(template.feedbackC_template, template.variables);

    // Calcular FP baseado na dificuldade
    const fpReward = template.fp_base + (template.difficulty * 2);

    // Inserir no banco
    try {
      const result = db.prepare(`
        INSERT INTO missions (
          phase, area, title, description, prompt,
          optionA, optionB, optionC,
          feedbackA, feedbackB, feedbackC,
          fp_reward, is_generated, template_id, generated_at, is_active
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, datetime('now'), 1)
      `).run(
        phase,
        template.area,
        title,
        description,
        prompt,
        optionA,
        optionB,
        optionC,
        feedbackA,
        feedbackB,
        feedbackC,
        fpReward,
        template.id
      );

      generatedMissions.push({
        id: result.lastInsertRowid,
        phase,
        area: template.area,
        title,
        description,
        prompt,
        optionA,
        optionB,
        optionC,
        feedbackA,
        feedbackB,
        feedbackC,
        fp_reward: fpReward,
        is_generated: 1,
        template_id: template.id,
        is_new: true
      });
    } catch (error) {
      console.error('Erro ao gerar missão:', error);
    }
  }

  return generatedMissions;
}

/**
 * Gera missões balanceadas por área
 * @param {object} db - Instância do banco de dados
 * @param {number} totalCount - Total de missões a gerar
 * @param {number} phase - Fase para as missões
 * @returns {Array} Array de missões geradas
 */
function generateBalancedMissions(db, totalCount = 50, phase = 4) {
  const areas = ['emotions', 'safety', 'body', 'creativity', 'languages', 'friendship'];
  const missionsPerArea = Math.ceil(totalCount / areas.length);

  let allMissions = [];

  for (const area of areas) {
    const missions = generateMissions(db, {
      area,
      count: missionsPerArea,
      phase
    });
    allMissions = allMissions.concat(missions);
  }

  return allMissions.slice(0, totalCount);
}

/**
 * Limpa missões geradas antigas (opcionalmente)
 * @param {object} db - Instância do banco de dados
 * @param {number} daysOld - Dias de antiguidaderetValue para considerar antiga
 * @returns {number} Quantidade de missões removidas
 */
function cleanOldGeneratedMissions(db, daysOld = 30) {
  const result = db.prepare(`
    DELETE FROM missions
    WHERE is_generated = 1
    AND generated_at < datetime('now', '-${daysOld} days')
    AND id NOT IN (
      SELECT DISTINCT mission_id FROM child_mission_progress
    )
  `).run();

  return result.changes;
}

module.exports = {
  generateMissions,
  generateBalancedMissions,
  cleanOldGeneratedMissions,
  replaceVariables
};
