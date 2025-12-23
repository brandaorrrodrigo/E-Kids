# 🤖 CHATBOT LOCAL - E-KIDS PRO
## Mascote Interativo com Ollama

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Instalação do Ollama](#instalação-do-ollama)
3. [Configuração](#configuração)
4. [Funcionalidades](#funcionalidades)
5. [Integração Frontend](#integração-frontend)
6. [API Endpoints](#api-endpoints)
7. [Contextos e Personalidades](#contextos-e-personalidades)
8. [Exemplos de Uso](#exemplos-de-uso)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 VISÃO GERAL

Chatbot local totalmente funcional usando Ollama + LLM otimizado.

### ✅ Implementado

**Backend:**
- ✅ Manager completo com integração Ollama
- ✅ Sistema de prompts contextualizados
- ✅ Memória de conversações
- ✅ Filtros de segurança infantil
- ✅ Fallback automático
- ✅ 8 rotas API

**Frontend:**
- ✅ Interface de chat animada
- ✅ Avatar do mascote dinâmico
- ✅ Sugestões inteligentes
- ✅ Typing indicators
- ✅ Histórico de mensagens
- ✅ Botão flutuante

**Características:**
- ✅ 100% privado e local
- ✅ Zero custos de API
- ✅ Funciona offline (se Ollama estiver rodando)
- ✅ Personalidade adaptável
- ✅ Linguagem infantil adequada

---

## 🚀 INSTALAÇÃO DO OLLAMA

### Windows

```powershell
# Download e instale do site oficial
# https://ollama.ai/download/windows

# Ou via PowerShell
winget install Ollama.Ollama
```

### macOS

```bash
# Download via Homebrew
brew install ollama

# Ou baixe o instalador
# https://ollama.ai/download/mac
```

### Linux

```bash
# Instalação automática
curl https://ollama.ai/install.sh | sh
```

### Verificar Instalação

```bash
ollama --version
```

---

## ⚙️ CONFIGURAÇÃO

### 1. Baixar Modelo

```bash
# Modelo recomendado (leve e rápido)
ollama pull llama3.2:3b

# Alternativas:
ollama pull mistral:7b          # Melhor qualidade
ollama pull tinyllama:1.1b      # Mais rápido (hardware fraco)
```

### 2. Iniciar Ollama

```bash
# Iniciar servidor Ollama
ollama serve

# Deve mostrar:
# Listening on 127.0.0.1:11434
```

### 3. Testar Ollama

```bash
# Testar modelo
ollama run llama3.2:3b "Olá, você está funcionando?"
```

### 4. Iniciar E-Kids PRO

```bash
cd mvp
npm install axios  # Se ainda não instalou
npm start
```

---

## 🎨 FUNCIONALIDADES

### 1. Mascote Interativo

O chatbot atua como mascote do app:
- Responde perguntas
- Dá dicas e motivação
- Ajuda com decisões
- Ensina de forma lúdica

### 2. Contextos Múltiplos

**General (Geral):**
- Conversa livre e amigável
- Perguntas sobre o dia
- Motivação geral

**Financial (Educação Financeira):**
- Ajuda com decisões de FP
- Explica benefícios de poupar
- Ajuda a criar metas

**Nature (Natureza):**
- Ensina sobre plantas e animais
- Incentiva cuidado ambiental
- Responde dúvidas sobre natureza

**Hygiene (Higiene):**
- Explica importância de hábitos
- Motiva autocuidado
- Responde dúvidas sobre higiene

**Tutor (Educacional):**
- Ajuda com lições
- Explica conceitos de forma simples
- Guia raciocínio

### 3. Memória de Conversação

- Histórico completo salvo no banco
- Contexto mantido entre mensagens
- Últimas 10 mensagens enviadas ao modelo

### 4. Sugestões Inteligentes

- Sugestões contextualizadas
- Botões de resposta rápida
- Atualizadas dinamicamente

### 5. Fallback Automático

Se Ollama não estiver disponível:
- Respostas pré-definidas
- Funcionalidade básica mantida
- Usuário não percebe erro crítico

---

## 💻 INTEGRAÇÃO FRONTEND

### Passo 1: Incluir Script

```html
<script src="/js/chatbot.js"></script>
```

### Passo 2: Inicializar

```javascript
// Após autenticação
const chatbot = new Chatbot(
  'http://localhost:3000',  // API URL
  token,                    // Auth token
  childId                   // ID da criança
);

// Tornar global
window.chatbot = chatbot;
```

### Passo 3: Renderizar Interface

```javascript
// Opção 1: Chat full (numa seção dedicada)
chatbot.render('chat-container');

// Opção 2: Botão flutuante (em qualquer página)
chatbot.renderFloatingButton();
```

### Passo 4: Definir Contexto

```javascript
// Mudar contexto conforme módulo ativo
chatbot.setContext('financial');  // Educação financeira
chatbot.setContext('nature');     // Natureza
chatbot.setContext('hygiene');    // Higiene
chatbot.setContext('general');    // Geral
```

### Exemplo Completo

```html
<!DOCTYPE html>
<html>
<head>
  <title>E-Kids PRO</title>
</head>
<body>
  <!-- Botão flutuante do chat -->
  <div id="chat-btn-container"></div>

  <!-- Container do chat -->
  <div id="main-chat-container" style="display: none;"></div>

  <script src="/js/chatbot.js"></script>
  <script>
    // Inicializar
    const chatbot = new Chatbot(
      'http://localhost:3000',
      localStorage.getItem('authToken'),
      parseInt(localStorage.getItem('selectedChildId'))
    );

    window.chatbot = chatbot;

    // Renderizar botão flutuante
    chatbot.renderFloatingButton();

    // Ou renderizar chat completo
    // chatbot.render('main-chat-container');

    // Verificar saúde do Ollama
    chatbot.checkHealth().then(health => {
      console.log('Ollama status:', health);
    });
  </script>
</body>
</html>
```

---

## 🔌 API ENDPOINTS

### Conversação

```http
POST /api/chat
```

**Body:**
```json
{
  "childId": 1,
  "message": "Por que devo guardar FP?",
  "contextType": "financial",
  "conversationId": null
}
```

**Response:**
```json
{
  "success": true,
  "conversationId": 42,
  "message": "Guardar FP é como plantar sementes...",
  "tokens": 85,
  "responseTime": 1234
}
```

### Listar Conversas

```http
GET /api/chat/conversations/:childId?limit=10
```

### Histórico de Conversa

```http
GET /api/chat/history/:conversationId?limit=50
```

### Deletar Conversa

```http
DELETE /api/chat/conversation/:conversationId
```

### Sugestões

```http
GET /api/chat/suggestions?childId=1&contextType=general
```

### Mensagem de Boas-vindas

```http
GET /api/chat/welcome?childId=1&contextType=general
```

### Estatísticas

```http
GET /api/chat/stats/:childId
```

### Verificar Saúde

```http
GET /api/chat/health
```

**Response:**
```json
{
  "success": true,
  "online": true,
  "model": "llama3.2:3b",
  "modelAvailable": true,
  "models": ["llama3.2:3b", "mistral:7b"]
}
```

---

## 🎭 CONTEXTOS E PERSONALIDADES

### Prompt Base (Todos os Contextos)

```
Você é o mascote amigável do E-Kids PRO

REGRAS ABSOLUTAS:
- Linguagem SIMPLES e INFANTIL
- SEMPRE positivo e encorajador
- NUNCA termos técnicos
- Respostas CURTAS (máximo 3 frases)
- Emojis moderados 🌟
- NUNCA violência, política ou temas adultos
- SEMPRE incentive aprendizado
- Seja amigável como um amigo da mesma idade
```

### Contexto: General

```
Conversa livre e motivadora
Pergunta sobre o dia, interesses
Sugere atividades
```

### Contexto: Financial

```
Ajuda com FP (pontos de esforço)
- FP não é dinheiro real
- Incentiva poupar sem pressão
- Benefícios de forma lúdica
- Metas alcançáveis
```

### Contexto: Nature

```
Ensina sobre natureza
- Exemplos simples
- Empatia com seres vivos
- Responsabilidade ambiental leve
- Sem culpa, apenas educação
```

### Contexto: Hygiene

```
Cria hábitos saudáveis
- Explica POR QUE
- Gentil, não assustador
- Comparações lúdicas
- Celebra progressos
```

### Contexto: Tutor

```
Ajuda com lições
- Explicações MUITO simples
- Exemplos práticos
- Incentiva curiosidade
- Guia raciocínio (não dá respostas)
```

---

## 💡 EXEMPLOS DE USO

### Exemplo 1: Educação Financeira

**Criança:** "Por que devo guardar FP?"

**Mascote:** "Guardar FP é como plantar uma sementinha 🌱 Hoje ela é pequena, mas amanhã vira uma árvore grande! Quando você junta bastante, pode comprar coisas incríveis. Quer criar uma meta comigo?"

### Exemplo 2: Natureza

**Criança:** "Como cuidar de plantas?"

**Mascote:** "As plantas são como amigos! Elas precisam de água, luz do sol e carinho. 🌱 Se você regar e cuidar todo dia, elas crescem fortes e bonitas. Quer começar cuidando de uma plantinha?"

### Exemplo 3: Higiene

**Criança:** "Por que lavar as mãos?"

**Mascote:** "Suas mãos são aventureiras! ✋ Elas tocam em tudo e pegam coisinhas invisíveis que podem te deixar doente. Quando você lava com água e sabão, tira tudo isso e protege seu corpo. É como dar um banho nos seus dedos! 🧼"

### Exemplo 4: Tutor

**Criança:** "Quanto é 5 + 3?"

**Mascote:** "Boa pergunta! 🤔 Imagina que você tem 5 estrelinhas em uma mão e ganha mais 3 na outra. Se juntar todas, quantas você tem? Conta nos dedos comigo!"

---

## 🛠️ TROUBLESHOOTING

### Problema: "Ollama não está rodando"

**Solução:**
```bash
# Iniciar Ollama
ollama serve

# Ou no Windows (como serviço)
# Abra o app Ollama da bandeja
```

### Problema: "Modelo não encontrado"

**Solução:**
```bash
# Baixar modelo
ollama pull llama3.2:3b

# Verificar modelos instalados
ollama list
```

### Problema: Respostas muito lentas

**Soluções:**

1. **Use modelo menor:**
```bash
ollama pull tinyllama:1.1b
```

2. **Aumente RAM do Ollama:**
```bash
# Linux/Mac
export OLLAMA_MAX_LOADED_MODELS=1
export OLLAMA_NUM_PARALLEL=1
```

3. **Limite tokens:**
```javascript
// No chatbot-manager.js, linha ~200
options: {
  max_tokens: 100  // Diminuir de 150 para 100
}
```

### Problema: Respostas inadequadas

**Solução:**

Editar prompts em `chatbot-manager.js`:
```javascript
// Adicionar mais regras no getSystemPrompt()
basePrompt += `
NUNCA mencione [tópico específico]
SEMPRE use exemplos de [contexto específico]
`;
```

### Problema: Fallback constante

**Verificar:**

1. Ollama está rodando?
```bash
curl http://localhost:11434/api/tags
```

2. Modelo está instalado?
```bash
ollama list
```

3. Porta correta?
```javascript
// chatbot-manager.js
const chatbot = new ChatbotManager(db, 'http://localhost:11434');
```

---

## 📊 BANCO DE DADOS

### Tabelas Criadas

**chat_conversations:**
- id, child_id, context_type
- context_data, created_at, last_message_at

**chat_messages:**
- id, conversation_id, role
- content, tokens_used, response_time_ms
- created_at

### Queries Úteis

```sql
-- Ver todas conversas de uma criança
SELECT * FROM chat_conversations WHERE child_id = 1;

-- Ver mensagens de uma conversa
SELECT * FROM chat_messages WHERE conversation_id = 42;

-- Estatísticas
SELECT
  COUNT(DISTINCT conversation_id) as total_conversations,
  COUNT(*) as total_messages,
  AVG(response_time_ms) as avg_time
FROM chat_messages;
```

---

## 🚀 PRÓXIMOS PASSOS

### Melhorias Sugeridas

1. **Áudio:**
   - Text-to-Speech para respostas
   - Voz do mascote

2. **Personalização:**
   - Nome personalizado do mascote
   - Escolher avatar/emoji

3. **Gamificação:**
   - FP por conversar
   - Badges por perguntas interessantes

4. **Analytics:**
   - Dashboard de perguntas frequentes
   - Tópicos mais discutidos
   - Sentimento das conversas

5. **Multi-idioma:**
   - Suporte para outros idiomas
   - Detecção automática

---

## 📝 COMANDOS RÁPIDOS

```bash
# Instalar Ollama
curl https://ollama.ai/install.sh | sh

# Baixar modelo
ollama pull llama3.2:3b

# Iniciar Ollama
ollama serve

# Testar
curl http://localhost:11434/api/tags

# Iniciar E-Kids PRO
cd mvp
npm start

# Testar API
curl http://localhost:3000/api/chat/health \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🎓 REQUISITOS

**Mínimos:**
- 8GB RAM
- 4GB espaço em disco
- CPU moderna (i5 ou equivalente)
- Node.js 16+

**Recomendados:**
- 16GB RAM
- 10GB espaço
- CPU i7 ou equivalente
- SSD

**Modelos por Hardware:**

| Hardware | Modelo Recomendado | Velocidade |
|----------|-------------------|------------|
| 8GB RAM  | tinyllama:1.1b   | Rápido     |
| 16GB RAM | llama3.2:3b      | Médio      |
| 32GB RAM | mistral:7b       | Lento mas melhor |

---

## ✅ CHECKLIST DE TESTE

- [ ] Ollama instalado e rodando
- [ ] Modelo baixado (llama3.2:3b)
- [ ] Servidor E-Kids iniciado
- [ ] Chat renderizado no frontend
- [ ] Mensagem enviada com sucesso
- [ ] Resposta recebida
- [ ] Sugestões aparecendo
- [ ] Contexto mudando corretamente
- [ ] Histórico sendo salvo
- [ ] Fallback funcionando (desligar Ollama)

---

**Implementação concluída em:** 16/12/2024
**Versão:** 1.0.0
**Status:** ✅ Totalmente funcional

**Arquivos criados:**
- `server/chatbot-manager.js` (520 linhas)
- `server/chatbot-routes.js` (245 linhas)
- `public/js/chatbot.js` (650 linhas)
- `CHATBOT_README.md` (este arquivo)
