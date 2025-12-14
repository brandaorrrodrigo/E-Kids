// E-KIDS PRO MVP - Database Setup
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando banco de dados E-Kids PRO MVP...');

// Criar diretório database se não existir
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Conectar ao banco
const dbPath = path.join(dbDir, 'ekids.db');
const db = new Database(dbPath);

console.log('📂 Banco de dados criado em:', dbPath);

// Ler schema SQL
const schemaPath = path.join(dbDir, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Executar schema
console.log('📋 Executando schema...');
db.exec(schema);

console.log('✅ Banco de dados configurado com sucesso!');
console.log('');
console.log('📊 Tabelas criadas:');
console.log('  - families (famílias)');
console.log('  - children (crianças)');
console.log('  - mascot (mascote)');
console.log('  - modules (módulos)');
console.log('  - child_module_progress (progresso)');
console.log('  - activities_completed (atividades)');
console.log('  - emotional_checkins (check-ins emocionais)');
console.log('  - trust_circle (círculo de confiança)');
console.log('');
console.log('🎓 5 módulos inseridos:');
console.log('  1. Meu Jeito, Meus Limites');
console.log('  2. Posso Pedir Ajuda');
console.log('  3. Cuidando de Mim');
console.log('  4. Minhas Emoções');
console.log('  5. Desafios Positivos');
console.log('');
console.log('🎉 Pronto para iniciar o servidor!');

db.close();
