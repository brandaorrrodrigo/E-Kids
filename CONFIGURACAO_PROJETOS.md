# 🔧 CONFIGURAÇÃO DOS 7 PROJETOS - GUIA COMPLETO

## 📍 LOCALIZAÇÃO DOS PROJETOS

Encontrei todos os 7 projetos no seu sistema:

| # | Projeto | Localização | API Key |
|---|---------|-------------|---------|
| 1 | **E-Kids PRO** 👧 | `D:\E-Kids-PRO\mvp` | `ekidspro-2025-secret-key-ultra-secure` |
| 2 | **NutriFitCoach** 🏋️ | `D:\NUTRIFITCOACH_MASTER` | `nutrifit-2025-secret-key-ultra-secure` |
| 3 | **Enem Pro** 📚 | `D:\enem-ia\enem-pro` | `enempro-2025-secret-key-ultra-secure` |
| 4 | **PetControl** 🐾 | `D:\petcontrol-ia\petcontrol-pro` | `petcontrol-2025-secret-key-ultra-secure` |
| 5 | **MedControl** 💊 | `D:\medcontrol` | `medcontrol-2025-secret-key-ultra-secure` |
| 6 | **Doutora IA** 🩺 | `D:\doutora-ia` | `doutoraia-2025-secret-key-ultra-secure` |
| 7 | **Doutora IA OAB** ⚖️ | `D:\JURIS_IA_CORE_V1` | `doutoraia-oab-2025-secret-key-ultra-secure` |

---

## 🔑 CONFIGURAÇÃO DO .ENV

Para **CADA projeto acima**, você precisa adicionar/atualizar o arquivo `.env` na raiz do projeto.

### Template do .env:

```env
# ========================================
# MULTI-TENANT CHAT SERVER CONFIGURATION
# ========================================

# URL do servidor de chat (local)
CHAT_SERVER_URL=http://localhost:3001

# URL do servidor de chat (produção - após Cloudflare Tunnel)
# CHAT_SERVER_URL=https://sua-url-cloudflare.com

# API Key específica deste projeto
CHAT_API_KEY=<copiar-da-tabela-acima>

# ========================================
# OUTRAS VARIÁVEIS DO PROJETO
# (manter as que já existem)
# ========================================
```

---

## 📝 PASSO A PASSO PARA CADA PROJETO:

### 1️⃣ E-Kids PRO (D:\E-Kids-PRO\mvp)

```bash
# Adicionar ao .env:
CHAT_SERVER_URL=http://localhost:3001
CHAT_API_KEY=ekidspro-2025-secret-key-ultra-secure
```

**Verificação:**
```bash
cd D:\E-Kids-PRO\mvp
curl -X POST http://localhost:3001/api/chat \
  -H "X-API-Key: ekidspro-2025-secret-key-ultra-secure" \
  -H "Content-Type: application/json" \
  -d "{\"userName\":\"Pedro\",\"message\":\"Oi Lu!\"}"
```

---

### 2️⃣ NutriFitCoach (D:\NUTRIFITCOACH_MASTER)

```bash
# Adicionar ao .env:
CHAT_SERVER_URL=http://localhost:3001
CHAT_API_KEY=nutrifit-2025-secret-key-ultra-secure
```

**Verificação:**
```bash
cd D:\NUTRIFITCOACH_MASTER
curl -X POST http://localhost:3001/api/chat \
  -H "X-API-Key: nutrifit-2025-secret-key-ultra-secure" \
  -H "Content-Type: application/json" \
  -d "{\"userName\":\"João\",\"message\":\"Preciso perder peso\"}"
```

---

### 3️⃣ Enem Pro (D:\enem-ia\enem-pro)

```bash
# Adicionar ao .env:
CHAT_SERVER_URL=http://localhost:3001
CHAT_API_KEY=enempro-2025-secret-key-ultra-secure
```

**Verificação:**
```bash
cd D:\enem-ia\enem-pro
curl -X POST http://localhost:3001/api/chat \
  -H "X-API-Key: enempro-2025-secret-key-ultra-secure" \
  -H "Content-Type: application/json" \
  -d "{\"userName\":\"Maria\",\"message\":\"Como estudar matemática?\"}"
```

---

### 4️⃣ PetControl (D:\petcontrol-ia\petcontrol-pro)

```bash
# Adicionar ao .env:
CHAT_SERVER_URL=http://localhost:3001
CHAT_API_KEY=petcontrol-2025-secret-key-ultra-secure
```

**Verificação:**
```bash
cd D:\petcontrol-ia\petcontrol-pro
curl -X POST http://localhost:3001/api/chat \
  -H "X-API-Key: petcontrol-2025-secret-key-ultra-secure" \
  -H "Content-Type: application/json" \
  -d "{\"userName\":\"Ana\",\"message\":\"Como cuidar do meu cachorro?\"}"
```

---

### 5️⃣ MedControl (D:\medcontrol)

```bash
# Adicionar ao .env:
CHAT_SERVER_URL=http://localhost:3001
CHAT_API_KEY=medcontrol-2025-secret-key-ultra-secure
```

**Verificação:**
```bash
cd D:\medcontrol
curl -X POST http://localhost:3001/api/chat \
  -H "X-API-Key: medcontrol-2025-secret-key-ultra-secure" \
  -H "Content-Type: application/json" \
  -d "{\"userName\":\"Carlos\",\"message\":\"Como organizar minhas consultas?\"}"
```

---

### 6️⃣ Doutora IA (D:\doutora-ia)

```bash
# Adicionar ao .env:
CHAT_SERVER_URL=http://localhost:3001
CHAT_API_KEY=doutoraia-2025-secret-key-ultra-secure
```

**Verificação:**
```bash
cd D:\doutora-ia
curl -X POST http://localhost:3001/api/chat \
  -H "X-API-Key: doutoraia-2025-secret-key-ultra-secure" \
  -H "Content-Type: application/json" \
  -d "{\"userName\":\"Rita\",\"message\":\"O que é diabetes?\"}"
```

---

### 7️⃣ Doutora IA OAB (D:\JURIS_IA_CORE_V1)

```bash
# Adicionar ao .env:
CHAT_SERVER_URL=http://localhost:3001
CHAT_API_KEY=doutoraia-oab-2025-secret-key-ultra-secure
```

**Verificação:**
```bash
cd D:\JURIS_IA_CORE_V1
curl -X POST http://localhost:3001/api/chat \
  -H "X-API-Key: doutoraia-oab-2025-secret-key-ultra-secure" \
  -H "Content-Type: application/json" \
  -d "{\"userName\":\"Paulo\",\"message\":\"O que é LGPD?\"}"
```

---

## 🚀 SCRIPT AUTOMÁTICO DE CONFIGURAÇÃO

Criei um script que adiciona automaticamente as variáveis aos arquivos .env:

```bash
# Executar: configure-all-projects.bat
```

Ele vai:
1. Verificar se cada projeto tem arquivo .env
2. Se não tiver, criar um novo
3. Se tiver, adicionar as variáveis do chat server
4. Manter todas as variáveis existentes

---

## ✅ CHECKLIST DE CONFIGURAÇÃO:

- [ ] E-Kids PRO - .env configurado
- [ ] NutriFitCoach - .env configurado
- [ ] Enem Pro - .env configurado
- [ ] PetControl - .env configurado
- [ ] MedControl - .env configurado
- [ ] Doutora IA - .env configurado
- [ ] Doutora IA OAB - .env configurado

---

## 🧪 TESTE RÁPIDO

Depois de configurar todos, execute:

```bash
test-all-projects.bat
```

Deve mostrar respostas de todos os 7 projetos! 🎉

---

## 📊 MONITORAMENTO

Acompanhe as requisições de cada projeto em:

```
http://localhost:3001/dashboard
```

Você verá:
- Total de requisições por projeto
- Última requisição de cada um
- Erros (se houver)
- Taxa de sucesso

---

## 🔄 PRÓXIMO PASSO

Depois de configurar todos os .env localmente:

1. ✅ Todos os projetos apontando para http://localhost:3001
2. 🔄 Configurar Cloudflare Tunnel (próximo guia)
3. 🔄 Atualizar .env para produção
4. 🔄 Deploy no Railway

---

**Pronto para configurar!** 🚀

Execute o script automático ou configure manualmente cada projeto seguindo os passos acima.
