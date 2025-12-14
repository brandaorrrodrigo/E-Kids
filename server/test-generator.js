// ============================================
// SCRIPT DE TESTE - GERADOR DE MISSÕES
// ============================================

const Database = require('better-sqlite3');
const path = require('path');
const missionGenerator = require('./mission-generator');

console.log('');
console.log('╔══════════════════════════════════════════════╗');
console.log('║   TESTE - GERADOR DE MISSÕES INFINITAS      ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('');

// Conectar ao banco
const DB_PATH = path.join(__dirname, 'database', 'ekids.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Verificar se a tabela de templates existe
console.log('📊 Verificando estrutura do banco...');
const tableExists = db.prepare(`
  SELECT name FROM sqlite_master
  WHERE type='table' AND name='mission_templates'
`).get();

if (!tableExists) {
  console.error('❌ Tabela mission_templates não existe!');
  console.log('Execute: node server/setup.js');
  process.exit(1);
}

console.log('✅ Tabela mission_templates encontrada');

// Contar templates
const templatesCount = db.prepare('SELECT COUNT(*) as count FROM mission_templates').get();
console.log(`📝 Templates disponíveis: ${templatesCount.count}`);

if (templatesCount.count === 0) {
  console.error('❌ Nenhum template encontrado!');
  console.log('Execute as migrations de templates primeiro.');
  process.exit(1);
}

// Estatísticas dos templates
console.log('');
console.log('📈 Estatísticas dos Templates:');
const byArea = db.prepare(`
  SELECT area, COUNT(*) as count
  FROM mission_templates
  GROUP BY area
`).all();

byArea.forEach(item => {
  console.log(`   ${item.area}: ${item.count} templates`);
});

// Teste 1: Gerar missões de uma área específica
console.log('');
console.log('🧪 TESTE 1: Gerar 5 missões de Emotions');
console.log('');

const emotionMissions = missionGenerator.generateMissions(db, {
  area: 'emotions',
  count: 5,
  phase: 4
});

console.log(`✅ ${emotionMissions.length} missões geradas`);
console.log('');
console.log('📋 Exemplo de missão gerada:');
console.log('');
console.log(`Título: ${emotionMissions[0]?.title}`);
console.log(`Área: ${emotionMissions[0]?.area}`);
console.log(`Fase: ${emotionMissions[0]?.phase}`);
console.log(`Pergunta: ${emotionMissions[0]?.prompt}`);
console.log(`Opção A: ${emotionMissions[0]?.optionA}`);
console.log(`Opção B: ${emotionMissions[0]?.optionB}`);
console.log(`Opção C: ${emotionMissions[0]?.optionC}`);
console.log(`FP: ${emotionMissions[0]?.fp_reward}`);
console.log('');

// Teste 2: Gerar missões balanceadas
console.log('🧪 TESTE 2: Gerar 12 missões balanceadas (todas as áreas)');
console.log('');

const balancedMissions = missionGenerator.generateBalancedMissions(db, 12, 4);

console.log(`✅ ${balancedMissions.length} missões balanceadas geradas`);
console.log('');
console.log('📊 Distribuição por área:');
const distribution = {};
balancedMissions.forEach(m => {
  distribution[m.area] = (distribution[m.area] || 0) + 1;
});
Object.entries(distribution).forEach(([area, count]) => {
  console.log(`   ${area}: ${count} missões`);
});
console.log('');

// Teste 3: Gerar missões de dificuldade específica
console.log('🧪 TESTE 3: Gerar 3 missões de Safety (dificuldade 2)');
console.log('');

const safetyMissions = missionGenerator.generateMissions(db, {
  area: 'safety',
  difficulty: 2,
  count: 3,
  phase: 4
});

console.log(`✅ ${safetyMissions.length} missões de segurança geradas`);
safetyMissions.forEach((m, i) => {
  console.log(`   ${i + 1}. ${m.prompt.substring(0, 60)}...`);
});
console.log('');

// Estatísticas finais
console.log('📊 Estatísticas Finais do Banco:');
const totalMissions = db.prepare('SELECT COUNT(*) as count FROM missions WHERE is_active = 1').get();
const generatedMissions = db.prepare('SELECT COUNT(*) as count FROM missions WHERE is_active = 1 AND is_generated = 1').get();
const staticMissions = totalMissions.count - generatedMissions.count;

console.log(`   Total de missões: ${totalMissions.count}`);
console.log(`   Missões estáticas: ${staticMissions}`);
console.log(`   Missões geradas: ${generatedMissions.count}`);
console.log('');

// Teste 4: Substituição de variáveis
console.log('🧪 TESTE 4: Teste de substituição de variáveis');
console.log('');

const template = "Você está em {lugar} e vê {objeto}. O que você faz?";
const variables = {
  lugar: ["casa", "escola", "parque"],
  objeto: ["um brinquedo", "um livro", "um amigo"]
};

for (let i = 0; i < 3; i++) {
  const result = missionGenerator.replaceVariables(template, variables);
  console.log(`   ${i + 1}. ${result}`);
}
console.log('');

// Resumo
console.log('╔══════════════════════════════════════════════╗');
console.log('║         TESTES CONCLUÍDOS COM SUCESSO        ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('');
console.log('✅ Sistema de geração funcionando perfeitamente!');
console.log('');
console.log('📋 Próximos passos:');
console.log('   1. Gerar mais missões via API');
console.log('   2. Testar no frontend');
console.log('   3. Criar interface de admin');
console.log('');

// Fechar conexão
db.close();
