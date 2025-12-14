# ⚡ Comandos Rápidos - E-Kids PRO

## 🚀 Inicialização

### 1. Setup Inicial (primeira vez)
```bash
cd D:\E-Kids-PRO\mvp
npm install
node server/setup.js
```

### 2. Iniciar Servidor
```bash
npm start
# ou para desenvolvimento com auto-reload:
npm run dev
```

### 3. Testar Gerador de Missões
```bash
node server/test-generator.js
```

---

## 🌐 URLs Principais

- **Frontend Infantil:** http://localhost:3000/crianca
- **Área dos Pais:** http://localhost:3000/pais
- **Admin Missões:** http://localhost:3000/admin-missions.html
- **API Base:** http://localhost:3000/api

---

## 📡 APIs - Exemplos cURL

### Autenticação

#### Registrar Família
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "senha123",
    "parentName": "João Silva"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "senha123"
  }'
```

### Gerador de Missões (DIA 1)

#### Gerar 10 Missões de Emoções
```bash
curl -X POST http://localhost:3000/api/admin/generate-missions \
  -H "Content-Type: application/json" \
  -d '{
    "area": "emotions",
    "count": 10,
    "phase": 4
  }'
```

#### Gerar 50 Missões Balanceadas
```bash
curl -X POST http://localhost:3000/api/admin/generate-missions \
  -H "Content-Type: application/json" \
  -d '{
    "balanced": true,
    "count": 50,
    "phase": 4
  }'
```

#### Gerar Missões por Dificuldade
```bash
curl -X POST http://localhost:3000/api/admin/generate-missions \
  -H "Content-Type: application/json" \
  -d '{
    "area": "safety",
    "difficulty": 3,
    "count": 15,
    "phase": 4
  }'
```

#### Listar Templates
```bash
curl http://localhost:3000/api/admin/templates
```

#### Listar Templates de uma Área
```bash
curl "http://localhost:3000/api/admin/templates?area=emotions"
```

#### Ver Estatísticas
```bash
curl http://localhost:3000/api/admin/missions/stats
```

#### Limpar Missões Antigas
```bash
curl -X DELETE "http://localhost:3000/api/admin/generated-missions/clean?daysOld=30"
```

### Missões da Criança

#### Listar Missões (substituir :childId)
```bash
curl http://localhost:3000/api/children/1/missions?phase=4 \
  -H "Authorization: Bearer SEU_TOKEN"
```

#### Listar Missões por Área
```bash
curl "http://localhost:3000/api/children/1/missions?area=emotions" \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🗄️ Banco de Dados

### Localização
```
D:\E-Kids-PRO\mvp\server\database\ekids.db
```

### Abrir com SQLite
```bash
# Instalar SQLite Browser ou usar CLI
sqlite3 server/database/ekids.db

# Comandos úteis:
.tables                    # Listar tabelas
.schema missions           # Ver estrutura da tabela
SELECT * FROM missions;    # Listar missões
```

### Queries Úteis

#### Contar missões por tipo
```sql
SELECT
  COUNT(*) FILTER (WHERE is_generated = 1) as geradas,
  COUNT(*) FILTER (WHERE is_generated = 0 OR is_generated IS NULL) as estaticas,
  COUNT(*) as total
FROM missions;
```

#### Missões geradas nos últimos 7 dias
```sql
SELECT *
FROM missions
WHERE is_generated = 1
AND generated_at > datetime('now', '-7 days')
ORDER BY generated_at DESC;
```

#### Templates por área
```sql
SELECT area, COUNT(*) as total
FROM mission_templates
GROUP BY area;
```

#### Templates por dificuldade
```sql
SELECT difficulty, COUNT(*) as total
FROM mission_templates
GROUP BY difficulty
ORDER BY difficulty;
```

---

## 🧹 Manutenção

### Backup do Banco
```bash
# Windows
copy server\database\ekids.db server\database\ekids-backup.db

# Linux/Mac
cp server/database/ekids.db server/database/ekids-backup.db
```

### Resetar Banco (CUIDADO!)
```bash
# Apagar banco e recriar
rm server/database/ekids.db
node server/setup.js
```

### Ver Logs do Servidor
O servidor exibe logs no terminal. Procure por:
- `✅` = Sucesso
- `❌` = Erro
- `⚠️` = Aviso

---

## 📦 NPM Scripts Disponíveis

```bash
npm run setup    # Executar setup.js
npm start        # Iniciar servidor
npm run dev      # Iniciar com nodemon (auto-reload)
```

---

## 🐛 Troubleshooting

### Problema: "Cannot find module 'better-sqlite3'"
```bash
npm install
```

### Problema: "EADDRINUSE" (porta em uso)
```bash
# Encontrar processo na porta 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :3000
kill -9 <PID>
```

### Problema: Migrations não executadas
```bash
node server/setup.js
```

### Problema: Tabela não existe
```bash
# Verificar se migrations foram executadas
sqlite3 server/database/ekids.db ".tables"

# Se não tiver mission_templates, executar:
node server/setup.js
```

---

## 📊 Comandos de Monitoramento

### Ver quantidade de missões
```bash
sqlite3 server/database/ekids.db "SELECT COUNT(*) FROM missions;"
```

### Ver templates disponíveis
```bash
sqlite3 server/database/ekids.db "SELECT COUNT(*) FROM mission_templates;"
```

### Últimas 5 missões geradas
```bash
sqlite3 server/database/ekids.db "SELECT id, area, title FROM missions WHERE is_generated = 1 ORDER BY generated_at DESC LIMIT 5;"
```

---

## 🎯 Atalhos de Desenvolvimento

### Gerar 100 missões rapidamente
```bash
curl -X POST http://localhost:3000/api/admin/generate-missions \
  -H "Content-Type: application/json" \
  -d '{"balanced": true, "count": 100, "phase": 4}'
```

### Testar todas as áreas (6 missões cada)
```bash
for area in emotions safety body creativity languages friendship; do
  echo "Gerando $area..."
  curl -X POST http://localhost:3000/api/admin/generate-missions \
    -H "Content-Type: application/json" \
    -d "{\"area\": \"$area\", \"count\": 6, \"phase\": 4}"
done
```

### Ver distribuição de missões
```bash
sqlite3 server/database/ekids.db "SELECT area, COUNT(*) as total FROM missions GROUP BY area;"
```

---

## 🔗 Links Úteis

- **Documentação DIA 1:** `DIA_1_IMPLEMENTADO.md`
- **Resumo DIA 1:** `RESUMO_DIA_1.md`
- **ROADMAP Completo:** `ROADMAP_7_DIAS.md`
- **Checklist:** `CHECKLIST_VALIDACAO.md`

---

## 💡 Dicas

1. **Use `npm run dev`** durante desenvolvimento para auto-reload
2. **Faça backups** do banco antes de testar em produção
3. **Gere missões balanceadas** para manter variedade
4. **Limpe missões antigas** periodicamente (30+ dias)
5. **Monitore estatísticas** via `/api/admin/missions/stats`

---

**Última atualização:** 14/12/2025
**E-Kids PRO - DIA 1 Completo** ✅
