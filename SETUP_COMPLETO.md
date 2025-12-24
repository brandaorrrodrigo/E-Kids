# 🚀 SETUP COMPLETO - 7 Projetos Multi-Tenant

## ✅ STATUS ATUAL:

- ✅ **Servidor Multi-Tenant** rodando (porta 3001)
- ✅ **Ollama** instalado e funcionando
- ✅ **Modelos** instalados (llama3.2 + llama3.1:8b)
- ✅ **7 Projetos** configurados

---

## 📋 SEUS 7 PROJETOS:

| # | Nome | Pasta | API Key |
|---|------|-------|---------|
| 1 | NutriFitCoach 🏋️ | `/nutrifit-coach` | `nutrifit-2025-secret-key-ultra-secure` |
| 2 | Enem Pro 📚 | `/enem-pro` | `enempro-2025-secret-key-ultra-secure` |
| 3 | E-Kids PRO 👧 | `/mvp` (este) | `ekidspro-2025-secret-key-ultra-secure` |
| 4 | PetControl 🐾 | `/pet-control` | `petcontrol-2025-secret-key-ultra-secure` |
| 5 | MedControl 💊 | `/med-control` | `medcontrol-2025-secret-key-ultra-secure` |
| 6 | Doutora IA 🩺 | `/doutora-ia` | `doutoraia-2025-secret-key-ultra-secure` |
| 7 | Doutora IA OAB ⚖️ | `/doutora-ia-oab` | `doutoraia-oab-2025-secret-key-ultra-secure` |

---

## 🔧 CONFIGURAÇÃO POR PROJETO:

### **Para CADA projeto**, você precisa:

#### 1. Adicionar no arquivo `.env`:

```env
# Chat Server Multi-Tenant
CHAT_SERVER_URL=http://localhost:3001
CHAT_API_KEY=SUA-API-KEY-AQUI

# Exemplo para E-Kids PRO:
# CHAT_API_KEY=ekidspro-2025-secret-key-ultra-secure

# Exemplo para NutriFit:
# CHAT_API_KEY=nutrifit-2025-secret-key-ultra-secure
```

#### 2. No código do servidor (se usar proxy):

```javascript
// server/chat-proxy.js ou similar
const ChatProxy = require('./chat-proxy');

const chatProxy = new ChatProxy(
  process.env.CHAT_SERVER_URL || 'http://localhost:3001',
  process.env.CHAT_API_KEY
);

// Usar em rotas:
app.post('/api/chat', async (req, res) => {
  const response = await chatProxy.chat(
    req.body.userName,
    req.body.message,
    req.body.contextType
  );
  res.json(response);
});
```

#### 3. Ou fazer requisição direta:

```javascript
// Cliente (frontend)
const response = await fetch(`${CHAT_SERVER_URL}/api/chat`, {
  method: 'POST',
  headers: {
    'X-API-Key': 'nutrifit-2025-secret-key-ultra-secure',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userName: 'João',
    message: 'Oi!',
    contextType: 'general'
  })
});

const data = await response.json();
console.log(data.message); // Resposta da IA
```

---

## 🧪 TESTAR CADA PROJETO:

### **Script de Teste Rápido:**

Salve como `test-all-projects.bat`:

```bat
@echo off
echo ========================================
echo  TESTANDO TODOS OS 7 PROJETOS
echo ========================================
echo.

echo [1/7] E-Kids PRO (Lu)...
curl -s -X POST http://127.0.0.1:3001/api/chat ^
  -H "X-API-Key: ekidspro-2025-secret-key-ultra-secure" ^
  -H "Content-Type: application/json" ^
  -d "{\"userName\":\"Teste\",\"message\":\"Oi\"}" | findstr "message"
echo.

echo [2/7] NutriFitCoach...
curl -s -X POST http://127.0.0.1:3001/api/chat ^
  -H "X-API-Key: nutrifit-2025-secret-key-ultra-secure" ^
  -H "Content-Type: application/json" ^
  -d "{\"userName\":\"Teste\",\"message\":\"Oi\"}" | findstr "message"
echo.

echo [3/7] Enem Pro...
curl -s -X POST http://127.0.0.1:3001/api/chat ^
  -H "X-API-Key: enempro-2025-secret-key-ultra-secure" ^
  -H "Content-Type: application/json" ^
  -d "{\"userName\":\"Teste\",\"message\":\"Oi\"}" | findstr "message"
echo.

echo [4/7] PetControl...
curl -s -X POST http://127.0.0.1:3001/api/chat ^
  -H "X-API-Key: petcontrol-2025-secret-key-ultra-secure" ^
  -H "Content-Type: application/json" ^
  -d "{\"userName\":\"Teste\",\"message\":\"Oi\"}" | findstr "message"
echo.

echo [5/7] MedControl...
curl -s -X POST http://127.0.0.1:3001/api/chat ^
  -H "X-API-Key: medcontrol-2025-secret-key-ultra-secure" ^
  -H "Content-Type: application/json" ^
  -d "{\"userName\":\"Teste\",\"message\":\"Oi\"}" | findstr "message"
echo.

echo [6/7] Doutora IA...
curl -s -X POST http://127.0.0.1:3001/api/chat ^
  -H "X-API-Key: doutoraia-2025-secret-key-ultra-secure" ^
  -H "Content-Type: application/json" ^
  -d "{\"userName\":\"Teste\",\"message\":\"Oi\"}" | findstr "message"
echo.

echo [7/7] Doutora IA OAB...
curl -s -X POST http://127.0.0.1:3001/api/chat ^
  -H "X-API-Key: doutoraia-oab-2025-secret-key-ultra-secure" ^
  -H "Content-Type: application/json" ^
  -d "{\"userName\":\"Teste\",\"message\":\"Oi\"}" | findstr "message"
echo.

echo ========================================
echo  TESTE COMPLETO!
echo ========================================
pause
```

---

## 🌐 CLOUDFLARE TUNNEL (Expor na Internet):

### **Opção 1: Túnel Temporário (Teste)**

```bash
cloudflared tunnel --url http://localhost:3001
```

Vai gerar URL tipo: `https://abc-123.trycloudflare.com`

Use essa URL nos `.env` dos projetos em produção:

```env
CHAT_SERVER_URL=https://abc-123.trycloudflare.com
```

### **Opção 2: Túnel Permanente** (Recomendado)

Ver arquivo: `CLOUDFLARE_TUNNEL_SETUP.md`

Resumo:
```bash
# 1. Instalar
# (ver guia completo)

# 2. Login
cloudflared tunnel login

# 3. Criar tunnel
cloudflared tunnel create ekids-chat-server

# 4. Configurar DNS
cloudflared tunnel route dns ekids-chat-server chat.seudominio.com

# 5. Rodar
cloudflared tunnel run ekids-chat-server
```

Depois, em TODOS os projetos:

```env
# Produção
CHAT_SERVER_URL=https://chat.seudominio.com
```

---

## 📊 MONITORAMENTO:

### **Dashboard em Tempo Real:**

```
http://localhost:3001/dashboard
```

Mostra:
- Total de requisições
- Requisições por projeto
- Erros por projeto
- Última requisição de cada projeto

### **Ver Projetos Ativos:**

```
http://localhost:3001/projects
```

### **Health Check:**

```
http://localhost:3001/health
```

---

## 🚀 DEPLOY NO RAILWAY:

### **Para CADA projeto web:**

1. **Criar novo projeto no Railway**
   - Login: https://railway.app
   - New Project → Deploy from GitHub
   - Escolher repositório do projeto

2. **Configurar variáveis de ambiente:**

```env
# Projeto E-Kids PRO
NODE_ENV=production
JWT_SECRET=ekidspro-secret-2025
CHAT_SERVER_URL=https://chat.seudominio.com
CHAT_API_KEY=ekidspro-2025-secret-key-ultra-secure

# Projeto NutriFit
NODE_ENV=production
JWT_SECRET=nutrifit-secret-2025
CHAT_SERVER_URL=https://chat.seudominio.com
CHAT_API_KEY=nutrifit-2025-secret-key-ultra-secure

# ... etc para cada projeto
```

3. **Deploy!**

Cada projeto vai ter sua própria URL:
- `ekidspro.up.railway.app`
- `nutrifit.up.railway.app`
- `enempro.up.railway.app`
- etc...

**TODOS usando o MESMO chat server!** 🎉

---

## ✅ CHECKLIST FINAL:

### **Desenvolvimento Local:**

- [ ] Ollama rodando (`ollama serve`)
- [ ] Modelos instalados (llama3.2 + llama3.1:8b)
- [ ] Chat server rodando (porta 3001)
- [ ] Testou os 7 projetos (`test-all-projects.bat`)
- [ ] Dashboard funcionando

### **Produção:**

- [ ] Cloudflare Tunnel configurado
- [ ] Chat server exposto na internet
- [ ] URL do tunnel anotada
- [ ] `.env` de cada projeto atualizado
- [ ] Deploy de cada projeto no Railway
- [ ] Testou cada projeto em produção

---

## 🆘 TROUBLESHOOTING:

### **Erro: "API key inválida"**

✅ Verifique se a API key no `.env` do projeto é EXATAMENTE igual à configurada em `projects-config.js`

### **Erro: "Ollama não está rodando"**

✅ Execute em outro terminal:
```bash
ollama serve
```

### **Erro: "Rate limit excedido"**

✅ Aguarde 1 minuto ou aumente o limite em `projects-config.js`

### **Projeto não responde**

✅ Verifique:
1. Chat server rodando? `curl http://localhost:3001/health`
2. API key correta?
3. Veja os logs do chat server

---

## 📝 PRÓXIMOS PASSOS:

1. **Teste local:** Rode `test-all-projects.bat`
2. **Configure Cloudflare:** Expor chat server
3. **Deploy projetos:** Um por um no Railway
4. **Teste produção:** Cada projeto online

---

**Pronto para começar?** 🚀

Qualquer dúvida, me chama! 😊
