# 🚀 Deploy E-Kids PRO no Railway

## Por que Railway?

O **Vercel** (onde ekidspro.com está agora) não suporta:
- ❌ SQLite (banco de dados precisa de filesystem persistente)
- ❌ Python (necessário para TTS com gTTS)
- ❌ Servidores stateful (só serverless functions)

O **Railway** suporta tudo:
- ✅ Node.js 20 + Python 3.11
- ✅ SQLite com filesystem persistente
- ✅ Servidor sempre rodando (não serverless)
- ✅ Plano gratuito com $5/mês de crédito

---

## 📋 Passo a Passo

### 1. Criar conta no Railway

1. Acesse: https://railway.app
2. Clique em **"Start a New Project"**
3. Faça login com GitHub (recomendado)

### 2. Criar novo projeto

1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha o repositório: `brandaorrrodrigo/E-Kids`
4. Railway vai detectar automaticamente Node.js + Python

### 3. Configurar variáveis de ambiente

No painel do Railway, vá em **"Variables"** e adicione:

```
NODE_ENV=production
JWT_SECRET=ekids-pro-railway-secret-2025-ultra-seguro
PORT=3000
```

### 4. Configurar domínio customizado

1. No Railway, vá em **"Settings"** → **"Domains"**
2. Clique em **"Generate Domain"** (você ganhará um domínio tipo: `ekids-pro-production.up.railway.app`)
3. Para usar **ekidspro.com**:
   - Copie o domínio gerado do Railway
   - Vá no seu provedor de domínio (GoDaddy, Namecheap, etc.)
   - Adicione um registro CNAME:
     - **Nome**: `@` ou `www`
     - **Valor**: domínio do Railway (ex: `ekids-pro-production.up.railway.app`)
   - Aguarde propagação DNS (5-30 minutos)

### 5. Deploy automático

- Railway vai fazer deploy automaticamente a cada push no GitHub
- O build vai:
  1. Instalar Node.js 20 e Python 3.11
  2. Instalar dependências npm (`npm install`)
  3. Instalar dependências Python (`pip install gtts edge-tts`)
  4. Iniciar servidor (`node server/index.js`)

---

## 🔍 Verificar se funcionou

1. Acesse o domínio do Railway (ex: `https://ekids-pro-production.up.railway.app`)
2. Você deve ver a página inicial do E-Kids PRO
3. Teste o chatbot com voz (Lu deve falar com voz feminina gTTS)
4. Teste os jogos de xadrez/damas

---

## 🐛 Troubleshooting

### Erro: "Application failed to respond"

- Verifique os logs no Railway dashboard
- Certifique-se que PORT está configurado como variável de ambiente
- Verifique se o build completou (Node.js + Python instalados)

### Erro: "Cannot find module 'better-sqlite3'"

- Railway deve compilar `better-sqlite3` automaticamente
- Se falhar, adicione no `railway.json`:
  ```json
  "buildCommand": "npm install --build-from-source"
  ```

### Domínio customizado não funciona

- Verifique configuração CNAME no provedor de domínio
- Aguarde propagação DNS (pode levar até 48h, mas geralmente 30min)
- Use `https://dnschecker.org` para verificar propagação

---

## 💰 Custo estimado

Railway oferece:
- **$5 de crédito grátis por mês**
- Custo típico do E-Kids PRO: **$3-4/mês** (uso leve/médio)
- Se exceder $5, precisará adicionar cartão de crédito

---

## 🔄 Atualizações futuras

Toda vez que você fizer `git push origin main`, o Railway vai:
1. Detectar o novo commit
2. Fazer rebuild automático
3. Atualizar o site em ~2-3 minutos

**Sem necessidade de redeployar manualmente!**

---

## 📞 Precisa de ajuda?

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Support E-Kids PRO**: (criar issue no GitHub)

---

## ✅ Checklist de deploy

- [ ] Conta criada no Railway
- [ ] Repositório conectado
- [ ] Variáveis de ambiente configuradas
- [ ] Primeiro deploy completado
- [ ] Site acessível no domínio Railway
- [ ] Chatbot funcionando com voz
- [ ] Xadrez/Damas funcionando
- [ ] (Opcional) Domínio customizado configurado

---

**Boa sorte! 🚀**
