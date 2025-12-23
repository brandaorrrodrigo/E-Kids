# 🏢 Multi-Tenant Chat Server - Guia Completo

## 🎯 O que é?

Um **ÚNICO servidor de chat** que serve **7 projetos diferentes** com um único Ollama!

---

## 📊 Projetos Configurados:

| # | Projeto | Descrição | Modelo | Rate Limit |
|---|---------|-----------|--------|------------|
| 1 | **NutriFitCoach** 🏋️ | Coaching Nutricional | llama3.2 | 30/min |
| 2 | **Enem Pro** 📚 | Preparação ENEM | llama3.1:8b | 25/min |
| 3 | **E-Kids PRO** 👧 | Educação Infantil | llama3.2 | 20/min |
| 4 | **PetControl** 🐾 | Gestão de Pets | llama3.2 | 25/min |
| 5 | **MedControl** 💊 | Controle Médico | llama3.2 | 20/min |
| 6 | **Doutora IA** 🩺 | Assistente Médica | llama3.1:8b | 15/min |
| 7 | **Doutora IA OAB** ⚖️ | Assistente Jurídica | llama3.1:8b | 15/min |

---

## 🔑 API Keys por Projeto:

Cada projeto tem sua própria API key única:

```env
# NutriFitCoach
nutrifit-2025-secret-key-ultra-secure

# Enem Pro
enempro-2025-secret-key-ultra-secure

# E-Kids PRO
ekidspro-2025-secret-key-ultra-secure

# PetControl
petcontrol-2025-secret-key-ultra-secure

# MedControl
medcontrol-2025-secret-key-ultra-secure

# Doutora IA
doutoraia-2025-secret-key-ultra-secure

# Doutora IA OAB
doutoraia-oab-2025-secret-key-ultra-secure
```

**IMPORTANTE:** Troque essas keys em produção!

---

## 🚀 Como Usar:

### 1. De cada projeto web:

```javascript
// No servidor principal de cada projeto
const CHAT_SERVER_URL = 'http://localhost:3001'; // ou https://chat.seudominio.com
const CHAT_API_KEY = 'nutrifit-2025-secret-key-ultra-secure'; // Key do projeto

// Fazer requisição
const response = await fetch(`${CHAT_SERVER_URL}/api/chat`, {
  method: 'POST',
  headers: {
    'X-API-Key': CHAT_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userName: 'João',
    message: 'Oi, preciso de ajuda com dieta!',
    contextType: 'general'
  })
});

const data = await response.json();
console.log(data.message); // Resposta do chat
```

### 2. Resposta:

```json
{
  "success": true,
  "message": "Olá João! Ficarei feliz em ajudar com sua dieta! 🥗 Qual é seu objetivo principal?",
  "tokens": 25,
  "model": "llama3.2:latest",
  "project": "NutriFitCoach"
}
```

---

## 📊 Dashboard de Estatísticas:

Acesse: **http://localhost:3001/dashboard**

```json
{
  "server": {
    "status": "online",
    "uptime": "3600s",
    "ollama": "http://localhost:11434"
  },
  "stats": {
    "totalRequests": 1523,
    "byProject": {
      "nutrifit": {
        "name": "NutriFitCoach",
        "requests": 456,
        "errors": 2,
        "lastRequest": "2025-12-23T10:30:45.123Z"
      },
      "enempro": {
        "name": "Enem Pro",
        "requests": 389,
        "errors": 1,
        "lastRequest": "2025-12-23T10:29:12.456Z"
      },
      "ekidspro": {
        "name": "E-Kids PRO",
        "requests": 234,
        "errors": 0,
        "lastRequest": "2025-12-23T10:28:33.789Z"
      }
      // ... outros projetos
    }
  }
}
```

---

## 🔒 Segurança:

### API Key por Projeto

Cada projeto só pode acessar com sua própria key:

```bash
# Projeto NutriFit (SUCESSO)
curl -H "X-API-Key: nutrifit-2025-secret-key-ultra-secure" \
  http://localhost:3001/api/chat -d '...'

# Projeto Enem tentando usar key do NutriFit (FALHA)
curl -H "X-API-Key: nutrifit-2025-secret-key-ultra-secure" \
  http://localhost:3001/api/chat -d '...'
# Funciona mas responde como NutriFit, não Enem
```

### Rate Limiting Individual

Cada projeto tem seu próprio limite:

- NutriFitCoach: 30 req/min
- Enem Pro: 25 req/min
- E-Kids PRO: 20 req/min
- Etc...

Se exceder, retorna:

```json
{
  "error": "Rate limit excedido",
  "message": "Limite de 30 requisições por minuto atingido",
  "project": "NutriFitCoach",
  "retryAfter": 60
}
```

---

## 🧠 Modelos por Projeto:

### llama3.2:latest (Rápido, 3.2B parâmetros)
- NutriFitCoach
- E-Kids PRO
- PetControl
- MedControl

### llama3.1:8b (Maior, melhor qualidade)
- Enem Pro (educação complexa)
- Doutora IA (medicina)
- Doutora IA OAB (jurídico)

---

## 🎨 Personalização por Projeto:

Cada projeto tem:

1. **System Prompt único** - Define personalidade
2. **Welcome Message** - Mensagem de boas-vindas
3. **Fallback Messages** - Respostas quando Ollama offline
4. **Rate Limit próprio** - Controle de uso
5. **Modelo específico** - llama3.2 ou llama3.1:8b

---

## 📝 Adicionar Novo Projeto:

Edite `projects-config.js`:

```javascript
'meuprojeto-2025-secret-key': {
  id: 'meuprojeto',
  name: 'Meu Projeto',
  description: 'Descrição do projeto',
  model: 'llama3.2:latest',
  rateLimit: 20,
  color: '#ff0000',
  systemPrompt: `
    Você é um assistente do Meu Projeto...
  `,
  welcomeMessage: 'Olá! Bem-vindo ao Meu Projeto!'
}
```

Reinicie o servidor. Pronto! ✅

---

## 🧪 Testar:

### Teste rápido de todos os projetos:

```bash
# NutriFit
curl -X POST http://localhost:3001/api/chat \
  -H "X-API-Key: nutrifit-2025-secret-key-ultra-secure" \
  -H "Content-Type: application/json" \
  -d '{"userName":"Teste","message":"Oi"}'

# Enem Pro
curl -X POST http://localhost:3001/api/chat \
  -H "X-API-Key: enempro-2025-secret-key-ultra-secure" \
  -H "Content-Type: application/json" \
  -d '{"userName":"Teste","message":"Oi"}'

# E-Kids PRO
curl -X POST http://localhost:3001/api/chat \
  -H "X-API-Key: ekidspro-2025-secret-key-ultra-secure" \
  -H "Content-Type: application/json" \
  -d '{"userName":"Teste","message":"Oi"}'
```

Cada um deve responder de forma diferente! 🎉

---

## 💰 Custo e Performance:

### Com Multi-Tenant:

- **1 Ollama** rodando
- **1 Cloudflare Tunnel**
- **1 servidor** de chat
- **Total:** ~GRÁTIS (seu PC)

### Sem Multi-Tenant (7 servidores separados):

- **7 Ollamas** ou **7 APIs pagas**
- **7 Cloudflare Tunnels** ou servidores
- **Total:** ~$70-100/mês

**Economia: 100%!** 💰

---

## 📊 Logs:

O servidor loga todas as requisições:

```
2025-12-23T10:30:45.123Z - POST /api/chat
✅ Autenticado: NutriFitCoach (nutrifit)
💬 [NutriFitCoach] João: "Oi, preciso de ajuda com dieta!"

2025-12-23T10:31:12.456Z - POST /api/chat
✅ Autenticado: Enem Pro (enempro)
💬 [Enem Pro] Maria: "Como resolver equações do 2º grau?"

2025-12-23T10:31:45.789Z - POST /api/chat
✅ Autenticado: E-Kids PRO (ekidspro)
💬 [E-Kids PRO] Pedro: "Oi Lu!"
```

---

## 🔧 Configuração nos Projetos Web:

### Cada projeto precisa adicionar no `.env`:

```env
# URL do chat server (local ou Cloudflare Tunnel)
CHAT_SERVER_URL=http://localhost:3001
# ou em produção:
# CHAT_SERVER_URL=https://chat.seudominio.com

# API Key única do projeto
CHAT_API_KEY=nutrifit-2025-secret-key-ultra-secure
```

### No código (usando o proxy já criado):

```javascript
// server/chat-proxy.js
const chatProxy = new ChatProxy(
  process.env.CHAT_SERVER_URL,
  process.env.CHAT_API_KEY
);
```

---

## ✅ Checklist de Deploy:

- [ ] Ollama instalado e rodando
- [ ] Modelos baixados (llama3.2:latest e llama3.1:8b)
- [ ] servidor-chat com npm install
- [ ] Testar localmente (npm start)
- [ ] Configurar Cloudflare Tunnel
- [ ] Atualizar .env de cada projeto web com CHAT_API_KEY
- [ ] Deploy dos projetos web no Railway
- [ ] Testar cada projeto em produção

---

**Pronto! Um servidor para governar todos eles!** 🚀👑
