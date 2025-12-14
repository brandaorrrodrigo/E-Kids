// E-KIDS PRO - Setup Script
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

console.log('');
console.log('╔══════════════════════════════════════════════╗');
console.log('║   E-KIDS PRO MVP - SETUP E MIGRAÇÃO         ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('');

// 1. Garantir pasta do banco de dados
const DB_DIR = path.join(__dirname, 'database');
if (!fs.existsSync(DB_DIR)) {
  console.log('📁 Criando diretório do banco de dados...');
  fs.mkdirSync(DB_DIR, { recursive: true });
  console.log('✅ Diretório criado');
} else {
  console.log('✅ Diretório do banco de dados já existe');
}

const DB_PATH = path.join(DB_DIR, 'ekids.db');

// 2. Conectar ao banco de dados
console.log('');
console.log('📊 Conectando ao banco de dados...');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
console.log('✅ Conectado ao banco de dados');

// 3. Executar migrations em ordem
console.log('');
console.log('🔄 Executando migrations...');
console.log('');

const migrations = [
  'migration-cofrinho-fp.sql',
  'migration-fase4-5.sql',
  'migration-fase6-7.sql',
  'migration-fase8.sql',
  'migration-fase2-3-world-store.sql',
  'migration-dia1-templates.sql',
  'migration-dia1-templates-extra.sql',
  'migration-dia2-eventos.sql',
  'migration-dia3-badges.sql',
  'migration-dia5-recompensas.sql',
  'migration-dia6-minigames.sql'
];

let successCount = 0;
let skipCount = 0;
let errorCount = 0;

migrations.forEach((migrationFile) => {
  const migrationPath = path.join(DB_DIR, migrationFile);

  if (!fs.existsSync(migrationPath)) {
    console.log(`⚠️  ${migrationFile} - Arquivo não encontrado (ignorando)`);
    skipCount++;
    return;
  }

  try {
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    db.exec(migrationSQL);
    console.log(`✅ ${migrationFile} - Executada com sucesso`);
    successCount++;
  } catch (error) {
    console.error(`❌ ${migrationFile} - Erro: ${error.message}`);
    errorCount++;
  }
});

// 4. Inicializar schema básico (caso não exista)
console.log('');
console.log('🏗️  Inicializando schema básico...');

try {
  db.exec(`
CREATE TABLE IF NOT EXISTS families (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS children (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  family_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  avatar TEXT DEFAULT 'default',
  total_fp INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mascot (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  energy INTEGER DEFAULT 100,
  happiness INTEGER DEFAULT 100,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  module_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  order_position INTEGER NOT NULL,
  is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS child_module_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  module_key TEXT NOT NULL,
  activities_completed INTEGER DEFAULT 0,
  understanding_level INTEGER DEFAULT 0,
  last_accessed TEXT,
  UNIQUE(child_id, module_key),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (module_key) REFERENCES modules(module_key) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activities_completed (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  module_key TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  fp_earned INTEGER DEFAULT 0,
  completed_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (module_key) REFERENCES modules(module_key) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS emotional_checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  emotion TEXT NOT NULL,
  comfort_level INTEGER,
  wants_to_talk INTEGER DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trust_circle (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  adult_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);
  `);

  console.log('✅ Schema básico inicializado');
} catch (error) {
  console.error('❌ Erro ao inicializar schema:', error.message);
  errorCount++;
}

// 5. Seed dos módulos básicos (se não existirem)
console.log('');
console.log('🌱 Verificando seed dos módulos básicos...');

const moduleCount = db.prepare('SELECT COUNT(1) as c FROM modules').get().c;

if (moduleCount === 0) {
  console.log('📦 Inserindo seed dos módulos...');

  const seed = db.prepare(`
    INSERT INTO modules (module_key, name, description, order_position, is_active)
    VALUES (@module_key, @name, @description, @order_position, 1)
  `);

  const seeds = [
    { module_key: 'meu-jeito-meus-limites', name: 'Meu Jeito, Meus Limites', description: 'Autonomia, consentimento e limites pessoais.', order_position: 1 },
    { module_key: 'posso-pedir-ajuda', name: 'Posso Pedir Ajuda', description: 'Pedir ajuda a adultos de confiança e reconhecer situações inseguras.', order_position: 2 },
    { module_key: 'cuidando-de-mim', name: 'Cuidando de Mim', description: 'Autocuidado, privacidade e proteção do corpo.', order_position: 3 },
    { module_key: 'minhas-emocoes', name: 'Minhas Emoções', description: 'Check-ins emocionais e identificação de sentimentos.', order_position: 4 },
    { module_key: 'desafios-positivos', name: 'Desafios Positivos', description: 'Hábitos e desafios leves com recompensas.', order_position: 5 },
  ];

  const tx = db.transaction((rows) => {
    for (const r of rows) seed.run(r);
  });

  tx(seeds);

  console.log('✅ Seed dos módulos inserido com sucesso');
} else {
  console.log(`✅ Módulos já existem (${moduleCount} módulos encontrados)`);
}

// 6. Fechar conexão
db.close();

// 7. Resumo final
console.log('');
console.log('╔══════════════════════════════════════════════╗');
console.log('║          SETUP CONCLUÍDO                     ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('');
console.log(`✅ Migrations executadas com sucesso: ${successCount}`);
console.log(`⏭️  Migrations ignoradas (não encontradas): ${skipCount}`);
console.log(`❌ Migrations com erro: ${errorCount}`);
console.log('');
console.log('📁 Banco de dados: server/database/ekids.db');
console.log('');

if (errorCount > 0) {
  console.log('⚠️  Alguns erros ocorreram. Verifique os logs acima.');
  console.log('');
  process.exit(1);
} else {
  console.log('🚀 Tudo pronto! Execute "npm run dev" para iniciar o servidor.');
  console.log('');
  process.exit(0);
}
