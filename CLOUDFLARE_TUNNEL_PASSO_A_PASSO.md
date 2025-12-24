# ☁️ CLOUDFLARE TUNNEL - GUIA PASSO A PASSO

## 🎯 O QUE É E POR QUE USAR?

O Cloudflare Tunnel permite expor seu servidor local (porta 3001) na internet de forma **GRATUITA** e **SEGURA**, com:
- ✅ HTTPS automático (certificado SSL grátis)
- ✅ Proteção DDoS
- ✅ Sem abrir portas no firewall
- ✅ URL personalizada ou temporária
- ✅ 100% GRÁTIS

---

## 🚀 MÉTODO 1: TUNNEL TEMPORÁRIO (Teste Rápido - 5 min)

Ideal para testar agora mesmo!

### Passo 1: Baixar Cloudflared

**Windows:**
```bash
# Baixe de:
https://github.com/cloudflare/cloudflared/releases/latest

# Ou usando winget:
winget install --id Cloudflare.cloudflared
```

### Passo 2: Iniciar Tunnel

```bash
cloudflared tunnel --url http://localhost:3001
```

### Passo 3: Copiar a URL

Você verá algo assim:

```
2025-12-23 10:00:00 INF +--------------------------------------------------------------------------------------------+
2025-12-23 10:00:00 INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
2025-12-23 10:00:00 INF |  https://abc-def-123.trycloudflare.com                                                      |
2025-12-23 10:00:00 INF +--------------------------------------------------------------------------------------------+
```

**Copie essa URL!** Exemplo: `https://abc-def-123.trycloudflare.com`

### Passo 4: Testar

```bash
curl https://abc-def-123.trycloudflare.com/health
```

Deve retornar o status do servidor! 🎉

### ⚠️ Limitações do Tunnel Temporário:

- URL muda toda vez que reinicia
- Não é permanente
- OK para desenvolvimento, mas não para produção

---

## 🏆 MÉTODO 2: TUNNEL PERMANENTE (Produção - 15 min)

Ideal para produção - URL fixa que não muda!

### Passo 1: Criar Conta Cloudflare (se não tiver)

1. Acesse: https://dash.cloudflare.com/sign-up
2. Crie uma conta gratuita
3. Adicione seu domínio (se tiver) ou use um subdomínio do Cloudflare

### Passo 2: Instalar Cloudflared

**Windows:**
```bash
# Baixe o instalador:
https://github.com/cloudflare/cloudflared/releases/latest

# Ou usando winget:
winget install --id Cloudflare.cloudflared
```

**Linux:**
```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

**Mac:**
```bash
brew install cloudflare/cloudflare/cloudflared
```

### Passo 3: Login no Cloudflare

```bash
cloudflared tunnel login
```

Isso vai:
1. Abrir seu navegador
2. Pedir para fazer login no Cloudflare
3. Autorizar o cloudflared
4. Criar um certificado em `~/.cloudflared/cert.pem`

### Passo 4: Criar o Tunnel

```bash
cloudflared tunnel create ekids-chat-server
```

Você verá:

```
Tunnel credentials written to: C:\Users\SEU_USUARIO\.cloudflared\<TUNNEL_ID>.json
Created tunnel ekids-chat-server with id <TUNNEL_ID>
```

**Anote o TUNNEL_ID!** (você vai precisar)

### Passo 5: Criar Arquivo de Configuração

Crie o arquivo: `C:\Users\SEU_USUARIO\.cloudflared\config.yml`

```yaml
# Configuração do Tunnel E-Kids Chat Server
tunnel: <SEU_TUNNEL_ID>
credentials-file: C:\Users\SEU_USUARIO\.cloudflared\<SEU_TUNNEL_ID>.json

ingress:
  # Rota principal - Chat Server
  - hostname: chat.seudominio.com
    service: http://localhost:3001

  # Rota de fallback (obrigatória)
  - service: http_status:404
```

**Substitua:**
- `<SEU_TUNNEL_ID>` pelo ID que você anotou
- `chat.seudominio.com` pelo seu domínio (ou use um subdomínio gratuito do Cloudflare)

### Passo 6: Configurar DNS

**Se você TEM um domínio:**

```bash
cloudflared tunnel route dns ekids-chat-server chat.seudominio.com
```

**Se você NÃO TEM um domínio:**

Use a URL gratuita do Cloudflare:
```bash
cloudflared tunnel route dns ekids-chat-server <TUNNEL_ID>.cfargotunnel.com
```

### Passo 7: Iniciar o Tunnel

```bash
cloudflared tunnel run ekids-chat-server
```

Você verá:

```
2025-12-23 10:00:00 INF Starting tunnel tunnelID=<ID>
2025-12-23 10:00:00 INF Registered tunnel connection
2025-12-23 10:00:00 INF +--------------------------------------------------------------------------------------------+
2025-12-23 10:00:00 INF |  Your tunnel is now online!                                                                |
2025-12-23 10:00:00 INF |  https://chat.seudominio.com                                                               |
2025-12-23 10:00:00 INF +--------------------------------------------------------------------------------------------+
```

### Passo 8: Testar

```bash
curl https://chat.seudominio.com/health
```

Deve funcionar! 🎉

### Passo 9: Rodar como Serviço (Windows)

Para que o tunnel inicie automaticamente com o Windows:

```bash
cloudflared service install
```

Agora o tunnel vai rodar sempre, mesmo após reiniciar o PC!

---

## 🔧 CONFIGURAÇÃO AVANÇADA

### Tunnel com Múltiplas Rotas

Você pode expor vários serviços com um único tunnel:

```yaml
tunnel: <SEU_TUNNEL_ID>
credentials-file: C:\Users\SEU_USUARIO\.cloudflared\<SEU_TUNNEL_ID>.json

ingress:
  # Chat Server
  - hostname: chat.seudominio.com
    service: http://localhost:3001

  # Dashboard separado
  - hostname: dashboard.seudominio.com
    service: http://localhost:3001/dashboard

  # Outro projeto
  - hostname: app.seudominio.com
    service: http://localhost:3000

  # Fallback
  - service: http_status:404
```

### Logs e Monitoramento

```bash
# Ver logs em tempo real
cloudflared tunnel --loglevel debug run ekids-chat-server

# Listar todos os tunnels
cloudflared tunnel list

# Informações de um tunnel
cloudflared tunnel info ekids-chat-server

# Deletar um tunnel (cuidado!)
cloudflared tunnel delete ekids-chat-server
```

---

## 📋 ATUALIZAR PROJETOS PARA PRODUÇÃO

Depois de configurar o tunnel, atualize o `.env` de **TODOS os 7 projetos**:

```env
# Comentar a URL local:
# CHAT_SERVER_URL=http://localhost:3001

# Usar a URL do Cloudflare Tunnel:
CHAT_SERVER_URL=https://chat.seudominio.com

# OU se usar URL do Cloudflare gratuita:
# CHAT_SERVER_URL=https://<TUNNEL_ID>.cfargotunnel.com

# API Key continua a mesma:
CHAT_API_KEY=sua-api-key-aqui
```

### Script para Atualizar Todos os .env:

Criei um script: `update-env-production.bat`

```batch
@echo off
echo Atualizando todos os projetos para produção...
echo.

set PROD_URL=https://chat.seudominio.com

REM Atualizar cada projeto
echo [1/7] E-Kids PRO
call :update_env "D:\E-Kids-PRO\mvp" "%PROD_URL%"

echo [2/7] NutriFitCoach
call :update_env "D:\NUTRIFITCOACH_MASTER" "%PROD_URL%"

echo [3/7] Enem Pro
call :update_env "D:\enem-ia\enem-pro" "%PROD_URL%"

echo [4/7] PetControl
call :update_env "D:\petcontrol-ia\petcontrol-pro" "%PROD_URL%"

echo [5/7] MedControl
call :update_env "D:\medcontrol" "%PROD_URL%"

echo [6/7] Doutora IA
call :update_env "D:\doutora-ia" "%PROD_URL%"

echo [7/7] Doutora IA OAB
call :update_env "D:\JURIS_IA_CORE_V1" "%PROD_URL%"

echo.
echo Todos os projetos atualizados para: %PROD_URL%
pause
exit /b 0

:update_env
set PROJECT=%~1
set URL=%~2
echo    Atualizando %PROJECT%...
REM Substitui CHAT_SERVER_URL no .env
powershell -Command "(Get-Content '%PROJECT%\.env') -replace 'CHAT_SERVER_URL=.*', 'CHAT_SERVER_URL=%URL%' | Set-Content '%PROJECT%\.env'"
echo    OK
exit /b 0
```

---

## ✅ CHECKLIST CLOUDFLARE TUNNEL

### Tunnel Temporário:
- [ ] Cloudflared instalado
- [ ] Tunnel iniciado (`cloudflared tunnel --url http://localhost:3001`)
- [ ] URL copiada
- [ ] Testado com curl/navegador
- [ ] Projetos locais funcionando

### Tunnel Permanente:
- [ ] Conta Cloudflare criada
- [ ] Cloudflared instalado
- [ ] Login feito (`cloudflared tunnel login`)
- [ ] Tunnel criado
- [ ] Arquivo config.yml configurado
- [ ] DNS configurado
- [ ] Tunnel rodando
- [ ] Testado em produção
- [ ] Serviço instalado (opcional)
- [ ] .env de todos os projetos atualizado

---

## 🆘 PROBLEMAS COMUNS

### 1. "cloudflared: command not found"
✅ Reinstale o cloudflared ou adicione ao PATH do sistema

### 2. "tunnel already exists"
✅ Liste os tunnels: `cloudflared tunnel list`
✅ Use o existente ou delete: `cloudflared tunnel delete nome-tunnel`

### 3. "failed to connect to origin"
✅ Verifique se o servidor está rodando na porta 3001
✅ Teste localmente: `curl http://localhost:3001/health`

### 4. "DNS record already exists"
✅ Acesse o painel Cloudflare e remova o registro DNS antigo

### 5. Tunnel funciona mas projetos não conectam
✅ Verifique se atualizou o .env de todos os projetos
✅ Teste a URL: `curl https://chat.seudominio.com/health`

---

## 📊 MONITORAMENTO

### Ver Status do Tunnel

```bash
# Localmente
cloudflared tunnel info ekids-chat-server

# No Dashboard Cloudflare
https://dash.cloudflare.com/
# → Zero Trust → Access → Tunnels
```

### Métricas em Tempo Real

- **Dashboard do Chat Server:** `https://chat.seudominio.com/dashboard`
- **Cloudflare Analytics:** Painel Zero Trust
- **Logs do Tunnel:** `cloudflared tunnel --loglevel debug run ekids-chat-server`

---

## 🚀 RESULTADO FINAL

Depois de configurar:

✅ Servidor local na porta 3001
✅ Cloudflare Tunnel expondo como https://chat.seudominio.com
✅ 7 projetos web no Railway
✅ Todos conectando ao mesmo chat server
✅ HTTPS seguro e gratuito
✅ Proteção DDoS incluída
✅ Monitoramento em tempo real

**Custo total: $0 (Cloudflare) + ~$0-35/mês (Railway)**

---

## 📞 PRÓXIMOS PASSOS

1. ✅ Configure o tunnel (temporário ou permanente)
2. ✅ Teste a conexão
3. ✅ Atualize os .env dos 7 projetos
4. 🔄 Deploy no Railway (próximo guia)
5. 🔄 Teste em produção

---

**Pronto! Seu servidor está na internet!** 🌐🎉

Qualquer dúvida, consulte a documentação oficial:
- https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
