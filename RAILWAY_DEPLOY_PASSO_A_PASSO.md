# 🚂 RAILWAY DEPLOY - GUIA COMPLETO PARA OS 7 PROJETOS

## 🎯 O QUE É O RAILWAY?

Railway é uma plataforma de deploy moderna que:
- ✅ Deploy automático via GitHub
- ✅ HTTPS incluído
- ✅ Banco de dados PostgreSQL gratuito
- ✅ $5 de crédito grátis/mês
- ✅ Escala automaticamente
- ✅ Logs em tempo real

**Custo estimado:** $0-5/mês por projeto (depende do uso)

---

## 📋 ANTES DE COMEÇAR

### ✅ Pré-requisitos:

1. **Conta no GitHub:** https://github.com
2. **Conta no Railway:** https://railway.app
3. **Cloudflare Tunnel configurado** (para o chat server)
4. **Repositórios GitHub criados** para cada projeto

---

## 🔧 PREPARAÇÃO DOS PROJETOS

Antes de fazer deploy, cada projeto precisa:

### 1️⃣ Arquivo `railway.json` (opcional mas recomendado)

Crie na raiz de cada projeto:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2️⃣ Arquivo `.gitignore`

Certifique-se de que o `.gitignore` inclui:

```
node_modules/
.env
.env.local
*.log
.DS_Store
dist/
build/
.next/
```

### 3️⃣ Arquivo `package.json`

Deve ter o script `start`:

```json
{
  "scripts": {
    "start": "node server/index.js",
    "dev": "nodemon server/index.js"
  }
}
```

---

## 🚀 DEPLOY PASSO A PASSO

Vou mostrar o processo completo para **cada um dos 7 projetos**.

---

## 1️⃣ E-KIDS PRO

### GitHub

1. **Criar repositório:**
   ```bash
   cd D:\E-Kids-PRO\mvp
   git init
   git add .
   git commit -m "Initial commit - E-Kids PRO"
   gh repo create ekids-pro --public --source=. --push
   ```

2. **Ou se já existe:**
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/ekids-pro.git
   git push -u origin main
   ```

### Railway

1. Acesse: https://railway.app/new
2. Clique em **"Deploy from GitHub repo"**
3. Selecione o repositório **ekids-pro**
4. Clique em **"Deploy Now"**

### Variáveis de Ambiente

Após o deploy, vá em **Variables** e adicione:

```env
NODE_ENV=production
PORT=3000

# Chat Server (após Cloudflare Tunnel)
CHAT_SERVER_URL=https://chat.seudominio.com
CHAT_API_KEY=ekidspro-2025-secret-key-ultra-secure

# Database (se necessário)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT Secret
JWT_SECRET=ekids-super-secret-key-production-2025

# Outras variáveis específicas do projeto...
```

### Verificação

```bash
curl https://ekids-pro.up.railway.app/health
```

---

## 2️⃣ NUTRIFITCOACH

### GitHub

```bash
cd D:\NUTRIFITCOACH_MASTER
git init
git add .
git commit -m "Initial commit - NutriFitCoach"
gh repo create nutrifitcoach --public --source=. --push
```

### Railway

1. New Project → Deploy from GitHub
2. Selecionar repositório **nutrifitcoach**
3. Deploy

### Variáveis de Ambiente

```env
NODE_ENV=production
PORT=3000

CHAT_SERVER_URL=https://chat.seudominio.com
CHAT_API_KEY=nutrifit-2025-secret-key-ultra-secure

DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=nutrifit-super-secret-key-production-2025

# Variáveis específicas...
```

### URL Final

```
https://nutrifitcoach.up.railway.app
```

---

## 3️⃣ ENEM PRO

### GitHub

```bash
cd D:\enem-ia\enem-pro
git init
git add .
git commit -m "Initial commit - Enem Pro"
gh repo create enem-pro --public --source=. --push
```

### Railway

1. New Project → Deploy from GitHub
2. Selecionar repositório **enem-pro**
3. Deploy

### Variáveis de Ambiente

```env
NODE_ENV=production
PORT=3000

CHAT_SERVER_URL=https://chat.seudominio.com
CHAT_API_KEY=enempro-2025-secret-key-ultra-secure

DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=enempro-super-secret-key-production-2025

# Variáveis específicas...
```

### URL Final

```
https://enem-pro.up.railway.app
```

---

## 4️⃣ PETCONTROL

### GitHub

```bash
cd D:\petcontrol-ia\petcontrol-pro
git init
git add .
git commit -m "Initial commit - PetControl"
gh repo create petcontrol --public --source=. --push
```

### Railway

1. New Project → Deploy from GitHub
2. Selecionar repositório **petcontrol**
3. Deploy

### Variáveis de Ambiente

```env
NODE_ENV=production
PORT=3000

CHAT_SERVER_URL=https://chat.seudominio.com
CHAT_API_KEY=petcontrol-2025-secret-key-ultra-secure

DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=petcontrol-super-secret-key-production-2025

# Variáveis específicas...
```

### URL Final

```
https://petcontrol.up.railway.app
```

---

## 5️⃣ MEDCONTROL

### GitHub

```bash
cd D:\medcontrol
git init
git add .
git commit -m "Initial commit - MedControl"
gh repo create medcontrol --public --source=. --push
```

### Railway

1. New Project → Deploy from GitHub
2. Selecionar repositório **medcontrol**
3. Deploy

### Variáveis de Ambiente

```env
NODE_ENV=production
PORT=3000

CHAT_SERVER_URL=https://chat.seudominio.com
CHAT_API_KEY=medcontrol-2025-secret-key-ultra-secure

DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=medcontrol-super-secret-key-production-2025

# Variáveis específicas...
```

### URL Final

```
https://medcontrol.up.railway.app
```

---

## 6️⃣ DOUTORA IA

### GitHub

```bash
cd D:\doutora-ia
git init
git add .
git commit -m "Initial commit - Doutora IA"
gh repo create doutora-ia --public --source=. --push
```

### Railway

1. New Project → Deploy from GitHub
2. Selecionar repositório **doutora-ia**
3. Deploy

### Variáveis de Ambiente

```env
NODE_ENV=production
PORT=3000

CHAT_SERVER_URL=https://chat.seudominio.com
CHAT_API_KEY=doutoraia-2025-secret-key-ultra-secure

DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=doutoraia-super-secret-key-production-2025

# Variáveis específicas...
```

### URL Final

```
https://doutora-ia.up.railway.app
```

---

## 7️⃣ DOUTORA IA OAB

### GitHub

```bash
cd D:\JURIS_IA_CORE_V1
git init
git add .
git commit -m "Initial commit - Doutora IA OAB"
gh repo create doutora-ia-oab --public --source=. --push
```

### Railway

1. New Project → Deploy from GitHub
2. Selecionar repositório **doutora-ia-oab**
3. Deploy

### Variáveis de Ambiente

```env
NODE_ENV=production
PORT=3000

CHAT_SERVER_URL=https://chat.seudominio.com
CHAT_API_KEY=doutoraia-oab-2025-secret-key-ultra-secure

DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=doutoraia-oab-super-secret-key-production-2025

# Variáveis específicas...
```

### URL Final

```
https://doutora-ia-oab.up.railway.app
```

---

## 🗄️ BANCO DE DADOS (PostgreSQL)

Para cada projeto que precisa de banco de dados:

### 1. Adicionar PostgreSQL no Railway

1. No projeto, clique em **"New"**
2. Selecione **"Database"** → **"PostgreSQL"**
3. Railway cria automaticamente

### 2. Conectar ao Projeto

A variável `DATABASE_URL` é criada automaticamente:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### 3. No código do projeto:

```javascript
// Usar a DATABASE_URL
const dbUrl = process.env.DATABASE_URL;
```

---

## 📊 MONITORAMENTO

### Logs em Tempo Real

1. Acesse o projeto no Railway
2. Clique em **"Deployments"**
3. Selecione o deployment ativo
4. Veja os logs em tempo real

### Métricas

1. **CPU e Memória:** Dashboard do Railway
2. **Requisições:** Dashboard do chat server
3. **Erros:** Logs do Railway

---

## 🔄 DEPLOY CONTÍNUO

Cada vez que você fizer push para o GitHub:

```bash
git add .
git commit -m "Update feature X"
git push
```

Railway automaticamente:
1. Detecta o push
2. Faz rebuild
3. Testa
4. Faz deploy
5. Atualiza a URL

---

## 🎛️ DOMÍNIO CUSTOMIZADO (Opcional)

Para usar seu próprio domínio:

### No Railway

1. Acesse o projeto
2. **Settings** → **Domains**
3. Clique em **"Custom Domain"**
4. Adicione: `ekids.seudominio.com`

### No Cloudflare (DNS)

Adicione registro CNAME:

```
Type: CNAME
Name: ekids
Target: ekids-pro.up.railway.app
Proxy: On (laranja)
```

Resultado: `https://ekids.seudominio.com`

---

## ✅ CHECKLIST DE DEPLOY

### Para CADA projeto:

- [ ] Código no GitHub
- [ ] `.gitignore` configurado
- [ ] `railway.json` criado
- [ ] Projeto criado no Railway
- [ ] Variáveis de ambiente configuradas
- [ ] PostgreSQL adicionado (se necessário)
- [ ] Deploy bem-sucedido
- [ ] Testado a URL
- [ ] Logs verificados
- [ ] Chat funcionando

### Geral:

- [ ] Cloudflare Tunnel rodando
- [ ] Chat server acessível
- [ ] Dashboard monitorando
- [ ] Todos os 7 projetos online

---

## 🆘 PROBLEMAS COMUNS

### 1. Build Failed

✅ Verifique os logs no Railway
✅ Veja se `package.json` tem todas as dependências
✅ Confira se o script `start` está correto

### 2. Application Error

✅ Verifique as variáveis de ambiente
✅ Veja os logs para identificar o erro
✅ Teste localmente primeiro

### 3. Database Connection Failed

✅ Verifique se PostgreSQL foi adicionado
✅ Confira se `DATABASE_URL` está configurada
✅ Teste a conexão com o banco

### 4. Chat não conecta

✅ Verifique `CHAT_SERVER_URL`
✅ Teste a URL do Cloudflare Tunnel
✅ Confira a `CHAT_API_KEY`

### 5. Deploy travado

✅ Cancele o deployment atual
✅ Faça um novo push
✅ Verifique se há erros no código

---

## 💰 CUSTOS ESTIMADOS

### Railway (por projeto):

- **Plano Hobby:** $5 grátis/mês
- **Uso além do gratuito:** ~$0-10/mês

### Total para 7 projetos:

- **Estimativa:** $0-35/mês
- **Máximo:** ~$70/mês (se todos forem muito usados)

### Otimização de Custos:

1. Use o mesmo banco de dados para projetos similares
2. Configure sleep/wake em projetos de baixo uso
3. Monitore o dashboard do Railway
4. Ajuste recursos conforme necessário

---

## 📊 RESULTADO FINAL

Depois de deployar todos os 7 projetos:

```
✅ E-Kids PRO:        https://ekids-pro.up.railway.app
✅ NutriFitCoach:     https://nutrifitcoach.up.railway.app
✅ Enem Pro:          https://enem-pro.up.railway.app
✅ PetControl:        https://petcontrol.up.railway.app
✅ MedControl:        https://medcontrol.up.railway.app
✅ Doutora IA:        https://doutora-ia.up.railway.app
✅ Doutora IA OAB:    https://doutora-ia-oab.up.railway.app

🤖 Chat Server:       https://chat.seudominio.com
📊 Dashboard:         https://chat.seudominio.com/dashboard
```

**Todos usando o MESMO servidor de chat multi-tenant!** 🎉

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Deploy de todos os projetos
2. ✅ Teste cada um
3. ✅ Configure domínios customizados (opcional)
4. ✅ Monitore uso e custos
5. ✅ Escale conforme necessário

---

## 📞 SUPORTE

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Status:** https://railway.statuspage.io

---

**Pronto! Seus 7 projetos estão na internet!** 🌐🚂🎉
