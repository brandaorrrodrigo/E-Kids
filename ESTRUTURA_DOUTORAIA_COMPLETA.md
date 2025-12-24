# 🏗️ ESTRUTURA COMPLETA - DOUTORA IA

## 🌐 DOMÍNIOS CONFIGURADOS

| Domínio | Serviço | Porta | Backend | Público |
|---------|---------|-------|---------|---------|
| **doutoraia.com** | Doutora IA Pro | 8001 | Railway | Advogados formados |
| **oab.doutoraia.com** | Doutora IA OAB | 8000 | Railway | Estudantes OAB |
| **chat.doutoraia.com** | Chat Server | 3001 | Seu PC | Backend IA |

---

## 🔑 API KEYS

```env
# Doutora IA OAB (Estudantes)
CHAT_API_KEY=doutoraia-oab-2025-secret-key-ultra-secure

# Doutora IA Profissional (Advogados)
CHAT_API_KEY=doutoraia-2025-secret-key-ultra-secure
```

---

## 📁 PROJETOS

### 1. Doutora IA OAB
- **Localização:** `D:\JURIS_IA_CORE_V1`
- **Domínio:** `oab.doutoraia.com`
- **Porta:** 8000
- **Framework:** FastAPI (Python)
- **Banco:** PostgreSQL + Redis
- **Público:** Estudantes preparando para OAB
- **Features:**
  - Questões OAB
  - Simulados
  - Estatísticas
  - Planos Free/Pago

### 2. Doutora IA Profissional
- **Localização:** `D:\doutora-ia`
- **Domínio:** `doutoraia.com`
- **Porta:** 8001
- **Framework:** (verificar)
- **Banco:** PostgreSQL
- **Público:** Advogados formados
- **Features:**
  - Peças jurídicas
  - Consultas profissionais
  - Jurisprudência
  - Legislação

### 3. Chat Server Multi-Tenant
- **Localização:** `D:\E-Kids-PRO\mvp\server-chat`
- **Domínio:** `chat.doutoraia.com`
- **Porta:** 3001
- **Framework:** Express.js (Node)
- **IA:** Ollama (llama3.1:8b)
- **Serve:** Ambos os projetos + outros 5

---

## 🚀 ARQUITETURA

```
                    INTERNET
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
  doutoraia.com  oab.doutoraia  chat.doutoraia
  (Railway)      (Railway)      (Cloudflare)
        │              │              │
        │              │              ▼
        │              │         Seu PC (3001)
        │              │              │
        └──────────────┴──────────────┤
                                      ▼
                               Chat Server
                                      │
                                      ▼
                                   Ollama
                              llama3.1:8b
```

---

## 🔄 FLUXO DE REQUISIÇÃO

### Exemplo: Estudante faz pergunta no OAB

1. **Usuário** acessa `oab.doutoraia.com`
2. **Frontend** (Railway) carrega
3. **Usuário** digita: "O que é LGPD?"
4. **Backend OAB** (Railway) recebe
5. **Backend** faz request para `chat.doutoraia.com`
6. **Cloudflare Tunnel** roteia para Chat Server (seu PC)
7. **Chat Server** valida API key `doutoraia-oab-...`
8. **Chat Server** envia para Ollama
9. **Ollama** processa com llama3.1:8b
10. **Resposta** volta pelo mesmo caminho
11. **Usuário** vê resposta da IA

---

## 📋 CHECKLIST DE DEPLOY

### Fase 1: Infraestrutura Base
- [x] Chat Server rodando (porta 3001)
- [x] Ollama instalado e funcionando
- [x] Cloudflare Tunnel criado
- [ ] Domínio no Cloudflare (aguardando nameservers)
- [ ] DNS configurado

### Fase 2: Doutora IA OAB
- [x] Projeto localizado
- [x] Integração chat server criada
- [x] .env configurado
- [ ] GitHub repositório
- [ ] Railway deploy
- [ ] DNS oab.doutoraia.com
- [ ] Teste produção

### Fase 3: Doutora IA Profissional
- [ ] Projeto verificado
- [ ] Integração chat server
- [ ] .env configurado
- [ ] GitHub repositório
- [ ] Railway deploy
- [ ] DNS doutoraia.com
- [ ] Teste produção

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Aguardar domínio ativar no Cloudflare (15-30 min)
2. ⏳ Configurar DNS (chat, oab, www)
3. ⏳ Deploy OAB no Railway
4. ⏳ Deploy Profissional no Railway
5. ⏳ Testes completos

---

## 💰 CUSTOS MENSAIS

| Item | Custo |
|------|-------|
| Domínio (Hostinger) | ~R$ 40/ano = R$ 3,33/mês |
| Cloudflare | Grátis |
| Chat Server (seu PC) | Grátis |
| Railway - OAB | $5/mês (~R$ 25) |
| Railway - Profissional | $5/mês (~R$ 25) |
| **TOTAL** | **~R$ 53/mês** |

**Muito mais barato que APIs pagas!** 💰
(OpenAI/Claude custariam $100-200/mês)

---

**Última atualização:** 2025-12-23
