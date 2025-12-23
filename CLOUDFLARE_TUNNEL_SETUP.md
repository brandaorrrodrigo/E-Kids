# 🌐 Cloudflare Tunnel - Setup Guide

## O que é Cloudflare Tunnel?

O **Cloudflare Tunnel** expõe seu servidor local (localhost:3001) para a internet de forma **segura**, com **HTTPS automático** e **sem precisar abrir portas no roteador**.

**Vantagens:**
- ✅ 100% GRÁTIS
- ✅ HTTPS automático
- ✅ Sem configuração de firewall/roteador
- ✅ Proteção DDoS da Cloudflare
- ✅ Logs de acesso

---

## 📋 Pré-requisitos

1. Conta na Cloudflare (grátis): https://dash.cloudflare.com/sign-up
2. Domínio configurado na Cloudflare (pode ser grátis do Freenom ou seu próprio)

---

## 🚀 Instalação (Uma vez só)

### Windows:

1. Baixe o cloudflared:
```powershell
# Abra PowerShell como Administrador
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "C:\Windows\System32\cloudflared.exe"
```

2. Verifique instalação:
```powershell
cloudflared --version
```

### Linux/Mac:

```bash
# Linux
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared

# Mac (via Homebrew)
brew install cloudflare/cloudflare/cloudflared
```

---

## 🔧 Configuração (Uma vez só)

### 1. Login na Cloudflare

```bash
cloudflared tunnel login
```

Isso vai abrir o navegador. Faça login e autorize.

### 2. Criar Tunnel

```bash
cloudflared tunnel create ekids-chat
```

Anote o **Tunnel ID** que aparecerá. Ex: `abc123-def456-...`

### 3. Configurar DNS

```bash
# Substitua SEU-TUNNEL-ID pelo ID do passo anterior
cloudflared tunnel route dns ekids-chat chat.ekidspro.com
```

Substitua `chat.ekidspro.com` pelo subdomínio que você quer usar.

### 4. Criar arquivo de configuração

Crie o arquivo `cloudflared-config.yml` na pasta do projeto:

```yaml
tunnel: SEU-TUNNEL-ID-AQUI
credentials-file: C:/Users/SEU-USUARIO/.cloudflared/SEU-TUNNEL-ID.json

ingress:
  - hostname: chat.ekidspro.com
    service: http://localhost:3001
  - service: http_status:404
```

**IMPORTANTE:** Substitua:
- `SEU-TUNNEL-ID-AQUI` pelo ID do tunnel
- `SEU-USUARIO` pelo seu usuário do Windows
- `chat.ekidspro.com` pelo seu subdomínio

---

## ▶️ Executando o Tunnel

### Modo Teste (Temporário)

```bash
# Apenas para testar (URL temporária)
cloudflared tunnel --url http://localhost:3001
```

Isso gera uma URL temporária tipo: `https://abc-123.trycloudflare.com`

### Modo Produção (Permanente)

```bash
# Usando o arquivo de configuração
cloudflared tunnel run --config cloudflared-config.yml ekids-chat
```

---

## 🤖 Iniciar automaticamente com Windows

### Opção 1: Instalar como Serviço do Windows

```powershell
# Abra PowerShell como Administrador
cloudflared service install
```

O tunnel vai iniciar automaticamente quando o PC ligar.

### Opção 2: Script de Inicialização

Crie um arquivo `start-tunnel.bat`:

```bat
@echo off
cd "D:\E-Kids-PRO\mvp"
cloudflared tunnel run --config cloudflared-config.yml ekids-chat
```

Adicione ao **Agendador de Tarefas** do Windows para rodar na inicialização.

---

## 🔒 Segurança

### 1. Verificar acesso

Teste se o tunnel está funcionando:

```bash
curl -H "X-API-Key: sua-api-key-aqui" https://chat.ekidspro.com/health
```

### 2. Logs

Cloudflare automaticamente loga todos os acessos no dashboard:
https://dash.cloudflare.com → Seu domínio → Analytics

---

## 📊 Arquitetura Final

```
Internet → Cloudflare Tunnel (HTTPS)
              ↓
          localhost:3001 (Chat Server)
              ↓
          Ollama (localhost:11434)
```

---

## 🛠️ Troubleshooting

### Tunnel não conecta

```bash
# Ver logs detalhados
cloudflared tunnel run --config cloudflared-config.yml ekids-chat --loglevel debug
```

### Erro "tunnel credentials not found"

```bash
# Verificar onde está o arquivo de credentials
dir C:\Users\SEU-USUARIO\.cloudflared\
```

### DNS não propagou

Aguarde 5-10 minutos ou force flush do DNS:

```bash
# Windows
ipconfig /flushdns

# Linux/Mac
sudo dscacheutil -flushcache
```

---

## 📝 Checklist

- [ ] cloudflared instalado
- [ ] Login na Cloudflare feito
- [ ] Tunnel criado
- [ ] DNS configurado
- [ ] cloudflared-config.yml criado
- [ ] Tunnel rodando
- [ ] Teste de acesso funcionando
- [ ] (Opcional) Serviço do Windows configurado

---

## 🔗 Links Úteis

- Documentação oficial: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps
- Dashboard: https://dash.cloudflare.com
- Status da Cloudflare: https://www.cloudflarestatus.com

---

**Pronto!** Seu servidor de chat agora está acessível na internet de forma segura! 🎉
