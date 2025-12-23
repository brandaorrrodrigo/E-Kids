# 🤖 E-Kids PRO - Chat Server (Isolado)

Servidor isolado que roda **apenas** a API de chat com Ollama + TTS.

---

## 🎯 Por que servidor isolado?

Esta arquitetura separa o chat do resto do sistema:

- **Servidor Principal (porta 3000)**: Vai para Railway/Vercel (nuvem)
  - App web, autenticação, database, jogos, etc.

- **Servidor de Chat (porta 3001)**: Roda no seu PC local
  - Ollama (IA local)
  - TTS (gTTS - voz feminina)
  - Exposto via Cloudflare Tunnel (HTTPS grátis)

---

## 📦 Instalação

```bash
cd server-chat
npm install
```

---

## ⚙️ Configuração

Crie/edite o arquivo `.env`:

```env
PORT=3001
API_KEY=ekids-chat-secret-key-2025-ultra-secure
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:latest
RATE_LIMIT_MAX=20
RATE_LIMIT_WINDOW_MS=60000
```

---

## ▶️ Executar

### Windows:

```bat
start-chat-server.bat
```

### Linux/Mac:

```bash
npm start
```

---

## 🔒 Segurança

### API Key

Todas as requisições precisam do header:

```
X-API-Key: ekids-chat-secret-key-2025-ultra-secure
```

### Rate Limiting

Máximo de **20 requisições por minuto** por IP/usuário.

---

## 📡 Endpoints

### GET /health
Verifica status do servidor (sem autenticação).

```bash
curl http://localhost:3001/health
```

### GET /api/chat/health
Verifica se Ollama está online.

```bash
curl -H "X-API-Key: sua-key" http://localhost:3001/api/chat/health
```

### POST /api/chat
Envia mensagem para o chatbot.

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "X-API-Key: sua-key" \
  -H "Content-Type: application/json" \
  -d '{
    "childName": "João",
    "message": "Oi Lu!",
    "contextType": "general"
  }'
```

Resposta:
```json
{
  "success": true,
  "message": "Oi João! Como você está hoje? 😊",
  "tokens": 25,
  "model": "llama3.2:latest"
}
```

### POST /api/tts/speak
Gera áudio com voz feminina (gTTS).

```bash
curl -X POST http://localhost:3001/api/tts/speak \
  -H "X-API-Key: sua-key" \
  -H "Content-Type: application/json" \
  -d '{"text": "Olá! Eu sou a Lu!"}' \
  --output audio.mp3
```

---

## 🌐 Expor na Internet

Use **Cloudflare Tunnel** para expor este servidor:

```bash
# Modo temporário (teste)
cloudflared tunnel --url http://localhost:3001

# Modo permanente (ver CLOUDFLARE_TUNNEL_SETUP.md)
cloudflared tunnel run --config cloudflared-config.yml ekids-chat
```

---

## 🔍 Logs

O servidor loga todas as requisições:

```
2025-12-22T19:30:45.123Z - POST /api/chat
💬 Chat request: João - "Oi Lu!"
```

---

## 🐛 Troubleshooting

### Erro: "Ollama não está rodando"

```bash
# Inicie o Ollama em outro terminal
ollama serve
```

### Erro: "API key inválida"

Verifique se a API_KEY no `.env` do servidor de chat é a **mesma** que a CHAT_API_KEY no `.env` do servidor principal.

### Porta 3001 já em uso

```bash
# Windows: encontrar processo
netstat -ano | findstr :3001

# Matar processo (substitua PID)
taskkill /F /PID 12345

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

---

## 📊 Arquitetura Completa

```
┌─────────────────────────────────────────┐
│  Railway/Vercel (Nuvem)                 │
│  ├─ Servidor Principal (port 3000)     │
│  ├─ App Web, DB, Auth                   │
│  └─ Proxy para Chat Server              │
└──────────────┬──────────────────────────┘
               │ HTTPS (API Key)
               │
     ┌─────────▼──────────────┐
     │  Cloudflare Tunnel     │
     │  chat.ekidspro.com     │
     └─────────┬──────────────┘
               │
┌──────────────▼──────────────────────────┐
│  Seu PC (localhost)                     │
│  └─ Chat Server (port 3001) ◄──────┐   │
│     ├─ API /api/chat                │   │
│     └─ TTS /api/tts                 │   │
│                                     │   │
│  └─ Ollama (port 11434) ────────────┘   │
│     └─ llama3.2:latest                  │
└─────────────────────────────────────────┘
```

---

## ✅ Checklist

- [ ] Node.js instalado
- [ ] Ollama instalado e rodando
- [ ] Modelo llama3.2:latest baixado
- [ ] Python + gTTS instalado
- [ ] npm install executado
- [ ] .env configurado
- [ ] Servidor iniciado (npm start)
- [ ] Teste de health funcionando
- [ ] Cloudflare Tunnel configurado (opcional)

---

**Pronto para receber requisições do servidor principal!** 🚀
