// E-KIDS PRO - CHAT SERVER
// Servidor isolado para API de chat (Ollama + TTS)
// Roda localmente e é exposto via Cloudflare Tunnel

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY || 'ekids-chat-secret-key-2025';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:latest';

// ============================================
// MIDDLEWARES
// ============================================

app.use(cors());
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// AUTENTICAÇÃO POR API KEY
// ============================================

function authenticateAPIKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      error: 'API key não fornecida',
      message: 'Adicione o header X-API-Key'
    });
  }

  if (apiKey !== API_KEY) {
    console.warn(`⚠️ API key inválida: ${apiKey.substring(0, 10)}...`);
    return res.status(403).json({
      error: 'API key inválida'
    });
  }

  next();
}

// ============================================
// RATE LIMITING
// ============================================

const chatLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minuto
  max: parseInt(process.env.RATE_LIMIT_MAX) || 20, // 20 requests por minuto
  message: {
    error: 'Muitas requisições',
    message: 'Aguarde um momento antes de enviar mais mensagens'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Identificar por IP + user agent
  keyGenerator: (req) => {
    return req.ip + req.headers['user-agent'];
  }
});

// ============================================
// CHAT MANAGER SIMPLIFICADO
// ============================================

class SimpleChatManager {
  constructor(ollamaUrl, model) {
    this.ollamaUrl = ollamaUrl;
    this.model = model;
  }

  getSystemPrompt(childName, contextType = 'general') {
    const basePrompt = `Você é a Lu 👧, assistente virtual do E-Kids PRO.

IDENTIDADE:
- Nome: Lu
- Personalidade: Alegre, carinhosa, educada
- Público: Crianças de 5-12 anos

REGRAS ABSOLUTAS:
- Linguagem SIMPLES e INFANTIL
- SEMPRE positiva e encorajadora
- Respostas CURTAS (máximo 3 frases)
- Use emojis moderadamente 💜
- NUNCA fale sobre violência, política ou temas adultos

CRIANÇA ATUAL: ${childName || 'amiguinho'}
CONTEXTO: ${contextType}`;

    return basePrompt;
  }

  async chat(childName, message, contextType = 'general') {
    try {
      const systemPrompt = this.getSystemPrompt(childName, contextType);

      const response = await axios.post(`${this.ollamaUrl}/api/chat`, {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 150
        }
      }, {
        timeout: 30000
      });

      return {
        success: true,
        message: response.data.message.content.trim(),
        tokens: response.data.eval_count || 0,
        model: this.model
      };

    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Ollama não está rodando');
      }
      throw error;
    }
  }

  getFallbackResponse(message = '') {
    const responses = [
      "Que legal! Me conta mais sobre isso! 😊",
      "Uau! Você é muito inteligente! ✨",
      "Adoro quando você me faz perguntas! 💜",
      "Isso é super interessante! Continue assim! 🌟",
      "Você está indo muito bem! Estou orgulhosa! 💪"
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }
}

const chatManager = new SimpleChatManager(OLLAMA_URL, OLLAMA_MODEL);

// ============================================
// ROTAS
// ============================================

// Health check (sem autenticação)
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'ekids-chat-server',
    timestamp: new Date().toISOString(),
    ollama: OLLAMA_URL,
    model: OLLAMA_MODEL
  });
});

// Verificar Ollama (sem autenticação)
app.get('/api/chat/health', async (req, res) => {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/version`, { timeout: 5000 });
    res.json({
      success: true,
      online: true,
      ollama_version: response.data.version,
      model: OLLAMA_MODEL
    });
  } catch (error) {
    res.json({
      success: false,
      online: false,
      error: error.message
    });
  }
});

// Chat endpoint (COM autenticação e rate limit)
app.post('/api/chat', authenticateAPIKey, chatLimiter, async (req, res) => {
  try {
    const { childName, message, contextType } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Mensagem não fornecida' });
    }

    console.log(`💬 Chat request: ${childName || 'anônimo'} - "${message.substring(0, 50)}..."`);

    const response = await chatManager.chat(childName, message, contextType);

    res.json(response);

  } catch (error) {
    console.error('❌ Erro no chat:', error.message);

    // Fallback em caso de erro
    res.json({
      success: true,
      message: chatManager.getFallbackResponse(req.body.message),
      tokens: 0,
      fallback: true,
      error: error.message
    });
  }
});

// TTS endpoint (importar rotas TTS)
const ttsRoutes = require('./tts-routes');
app.use('/api/tts', authenticateAPIKey, ttsRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║   E-KIDS PRO - CHAT SERVER (ISOLADO)        ║
╚══════════════════════════════════════════════╝

🚀 Servidor rodando em: http://localhost:${PORT}

🔐 API Key configurada: ${API_KEY.substring(0, 15)}...
🤖 Ollama: ${OLLAMA_URL}
🧠 Modelo: ${OLLAMA_MODEL}
⏱️  Rate Limit: ${process.env.RATE_LIMIT_MAX || 20} req/min

📡 Endpoints:
   GET  /health - Status do servidor
   GET  /api/chat/health - Status do Ollama
   POST /api/chat - Enviar mensagem (requer API key)
   POST /api/tts/speak - Gerar áudio (requer API key)

💡 Para expor na internet: Use Cloudflare Tunnel
   cloudflared tunnel --url http://localhost:${PORT}

`);
});
