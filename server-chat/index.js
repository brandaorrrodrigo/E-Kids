// E-KIDS PRO - MULTI-TENANT CHAT SERVER
// Servidor isolado para API de chat (Ollama + TTS)
// Serve MÚLTIPLOS projetos com um único Ollama

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
require('dotenv').config();

const { getProjectByApiKey, getAllProjects, getProjectStats } = require('./projects-config');

const app = express();
const PORT = process.env.PORT || 3001;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

// Estatísticas globais
const stats = {
  totalRequests: 0,
  byProject: {},
  startTime: new Date()
};

// ============================================
// MIDDLEWARES
// ============================================

app.use(cors());
app.use(express.json());

// Logging global
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// AUTENTICAÇÃO MULTI-TENANT
// ============================================

function authenticateProject(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      error: 'API key não fornecida',
      message: 'Adicione o header X-API-Key com a chave do seu projeto'
    });
  }

  // Buscar projeto pela API key
  const project = getProjectByApiKey(apiKey);

  if (!project) {
    console.warn(`⚠️ API key inválida tentada: ${apiKey.substring(0, 15)}...`);
    return res.status(403).json({
      error: 'API key inválida',
      message: 'Projeto não encontrado ou API key incorreta'
    });
  }

  // Anexar projeto à requisição
  req.project = project;

  // Inicializar stats do projeto se não existir
  if (!stats.byProject[project.id]) {
    stats.byProject[project.id] = {
      name: project.name,
      requests: 0,
      errors: 0,
      lastRequest: null
    };
  }

  console.log(`✅ Autenticado: ${project.name} (${project.id})`);
  next();
}

// ============================================
// RATE LIMITING POR PROJETO
// ============================================

const createProjectRateLimiter = () => {
  return rateLimit({
    windowMs: 60000, // 1 minuto
    // Limite é dinâmico baseado no projeto
    max: (req) => req.project?.rateLimit || 10,
    message: (req) => ({
      error: 'Rate limit excedido',
      message: `Limite de ${req.project.rateLimit} requisições por minuto atingido`,
      project: req.project.name,
      retryAfter: '60 segundos'
    }),
    standardHeaders: true,
    legacyHeaders: false,
    // Identificar por projeto + IP
    keyGenerator: (req) => {
      const projectId = req.project?.id || 'unknown';
      return `${projectId}-${req.ip}`;
    },
    // Handler de limite excedido
    handler: (req, res) => {
      console.warn(`⚠️ Rate limit excedido: ${req.project.name} - IP: ${req.ip}`);
      stats.byProject[req.project.id].errors++;
      res.status(429).json({
        error: 'Rate limit excedido',
        message: `Limite de ${req.project.rateLimit} requisições por minuto atingido`,
        project: req.project.name,
        retryAfter: 60
      });
    }
  });
};

const projectRateLimiter = createProjectRateLimiter();

// ============================================
// CHAT MANAGER MULTI-TENANT
// ============================================

class MultiTenantChatManager {
  constructor(ollamaUrl) {
    this.ollamaUrl = ollamaUrl;
  }

  async chat(project, userName, message, contextType = 'general') {
    try {
      // Usar system prompt do projeto
      const systemPrompt = project.systemPrompt;

      const response = await axios.post(`${this.ollamaUrl}/api/chat`, {
        model: project.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Usuário: ${userName}\nMensagem: ${message}` }
        ],
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 200
        }
      }, {
        timeout: 35000
      });

      return {
        success: true,
        message: response.data.message.content.trim(),
        tokens: response.data.eval_count || 0,
        model: project.model,
        project: project.name
      };

    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Ollama não está rodando');
      }
      if (error.code === 'ETIMEDOUT') {
        throw new Error('Ollama demorou muito para responder');
      }
      throw error;
    }
  }

  getFallbackResponse(project, message = '') {
    const messageLower = message.toLowerCase();

    // Respostas genéricas por projeto
    const fallbacks = {
      nutrifit: [
        "Mantenha o foco nos seus objetivos! 💪",
        "Lembre-se: consistência é a chave! 🥗",
        "Pequenos passos levam a grandes conquistas! ✨"
      ],
      enempro: [
        "Continue estudando! Você está no caminho certo! 📚",
        "Cada questão resolvida é um passo rumo à aprovação! ✏️",
        "Persistência é a chave do sucesso no ENEM! 🎯"
      ],
      ekidspro: [
        "Que legal! Me conta mais sobre isso! 😊",
        "Você é muito inteligente! Continue assim! ✨",
        "Adoro quando você me faz perguntas! 💜"
      ],
      petcontrol: [
        "Seu pet é muito sortudo de ter você! 🐾",
        "Cuidar com amor faz toda diferença! 💕",
        "Sempre aqui para ajudar seu amiguinho! 🐕"
      ],
      medcontrol: [
        "Organização é fundamental para saúde! 📋",
        "Lembre-se de suas consultas e medicamentos! ⚕️",
        "Cuidar da saúde é cuidar de você! 💊"
      ],
      doutoraia: [
        "Consulte sempre um médico para diagnóstico correto! 🩺",
        "Saúde é prioridade - busque orientação profissional! ⚕️",
        "Esta informação é apenas educacional! 💉"
      ],
      'doutoraia-oab': [
        "Consulte um advogado para seu caso específico! ⚖️",
        "Legislação pode mudar - confirme com profissional! 📜",
        "Esta informação é apenas educacional! 👨‍⚖️"
      ]
    };

    const projectFallbacks = fallbacks[project.id] || fallbacks.ekidspro;
    const response = projectFallbacks[Math.floor(Math.random() * projectFallbacks.length)];

    return {
      success: true,
      message: response,
      tokens: 0,
      source: 'fallback',
      project: project.name
    };
  }
}

const chatManager = new MultiTenantChatManager(OLLAMA_URL);

// ============================================
// ROTAS
// ============================================

// Health check (sem autenticação)
app.get('/health', (req, res) => {
  const uptime = Math.floor((Date.now() - stats.startTime) / 1000);
  res.json({
    status: 'online',
    service: 'multi-tenant-chat-server',
    timestamp: new Date().toISOString(),
    uptime: `${uptime}s`,
    ollama: OLLAMA_URL,
    projects: getProjectStats().total
  });
});

// Dashboard de estatísticas (sem autenticação)
app.get('/dashboard', (req, res) => {
  const uptime = Math.floor((Date.now() - stats.startTime) / 1000);

  res.json({
    server: {
      status: 'online',
      uptime: `${uptime}s`,
      startTime: stats.startTime,
      ollama: OLLAMA_URL
    },
    stats: {
      totalRequests: stats.totalRequests,
      byProject: stats.byProject
    },
    projects: getProjectStats()
  });
});

// Listar projetos (sem autenticação - útil para debug)
app.get('/projects', (req, res) => {
  res.json({
    total: getProjectStats().total,
    projects: getAllProjects()
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
      url: OLLAMA_URL
    });
  } catch (error) {
    res.json({
      success: false,
      online: false,
      error: error.message,
      url: OLLAMA_URL
    });
  }
});

// Chat endpoint (COM autenticação e rate limit)
app.post('/api/chat', authenticateProject, projectRateLimiter, async (req, res) => {
  try {
    const { userName, message, contextType } = req.body;
    const project = req.project;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Mensagem não fornecida' });
    }

    // Incrementar estatísticas
    stats.totalRequests++;
    stats.byProject[project.id].requests++;
    stats.byProject[project.id].lastRequest = new Date();

    console.log(`💬 [${project.name}] ${userName || 'Anônimo'}: "${message.substring(0, 50)}..."`);

    const response = await chatManager.chat(project, userName, message, contextType);

    res.json(response);

  } catch (error) {
    console.error(`❌ [${req.project.name}] Erro:`, error.message);

    // Incrementar erros
    stats.byProject[req.project.id].errors++;

    // Fallback em caso de erro
    res.json(chatManager.getFallbackResponse(req.project, req.body.message));
  }
});

// Welcome message (COM autenticação)
app.get('/api/chat/welcome', authenticateProject, (req, res) => {
  const project = req.project;
  res.json({
    success: true,
    welcome: project.welcomeMessage,
    project: project.name
  });
});

// TTS endpoint (importar rotas TTS)
const ttsRoutes = require('./tts-routes');
app.use('/api/tts', authenticateProject, ttsRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  const projectStats = getProjectStats();

  console.log(`
╔══════════════════════════════════════════════╗
║   MULTI-TENANT CHAT SERVER                   ║
╚══════════════════════════════════════════════╝

🚀 Servidor rodando em: http://localhost:${PORT}

🤖 Ollama: ${OLLAMA_URL}
📊 Projetos ativos: ${projectStats.total}

📡 Endpoints Públicos:
   GET  /health          - Status do servidor
   GET  /dashboard       - Dashboard completo
   GET  /projects        - Listar projetos
   GET  /api/chat/health - Status do Ollama

🔐 Endpoints Autenticados (requerem X-API-Key):
   POST /api/chat        - Enviar mensagem
   GET  /api/chat/welcome- Mensagem de boas-vindas
   POST /api/tts/speak   - Gerar áudio

📋 Projetos Configurados:
${projectStats.projects.map(p => `   • ${p.name} (${p.id}) - ${p.model} - ${p.rateLimit} req/min`).join('\n')}

💡 Para expor na internet:
   cloudflared tunnel --url http://localhost:${PORT}

📊 Dashboard: http://localhost:${PORT}/dashboard

`);
});
