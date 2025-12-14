# 🚀 E-KIDS PRO - GUIA DE DEPLOY

Este documento contém instruções completas para fazer deploy do E-Kids PRO em produção.

## 📋 PRÉ-REQUISITOS

- Node.js 18+ instalado
- npm ou yarn
- Git instalado
- Conta em uma plataforma de hospedagem (Vercel, Heroku, Railway, etc.)

## 🔧 PREPARAÇÃO LOCAL

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o `.env` e configure:

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=seu-secret-muito-seguro-aqui-change-this
DB_PATH=./server/database/ekids.db
```

**IMPORTANTE**:
- Gere um JWT_SECRET único e seguro (use um gerador de senhas com 64+ caracteres)
- Nunca commite o arquivo `.env` no Git

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Banco de Dados

```bash
node server/setup.js
```

### 4. Testar Localmente

```bash
npm start
```

Acesse: http://localhost:3000

## 🌐 OPÇÕES DE DEPLOY

### OPÇÃO 1: VERCEL (RECOMENDADO PARA TESTES)

**Vantagens**: Deploy automático, SSL grátis, CDN global, fácil configuração

**Limitações**: Serverless (cada request inicia função), SQLite pode ter problemas de persistência

#### Passo a passo:

1. Instale Vercel CLI:
```bash
npm install -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

4. Configure variáveis de ambiente no dashboard Vercel:
- NODE_ENV: production
- JWT_SECRET: seu-secret-seguro

**ATENÇÃO**: Vercel usa sistema de arquivos temporário. Para produção séria, considere Railway ou VPS.

---

### OPÇÃO 2: RAILWAY (RECOMENDADO PARA PRODUÇÃO)

**Vantagens**: Deploy fácil, suporte a SQLite, $5/mês de crédito grátis, arquivos persistentes

#### Passo a passo:

1. Acesse: https://railway.app

2. Conecte seu repositório GitHub

3. Configure variáveis de ambiente:
   - NODE_ENV: production
   - JWT_SECRET: seu-secret-seguro
   - PORT: 3000

4. Deploy automático ao push no GitHub

**VANTAGEM**: Railway tem sistema de arquivos persistente, SQLite funciona perfeitamente.

---

### OPÇÃO 3: HEROKU

**Vantagens**: Banco de dados persistente, fácil escalabilidade, add-ons disponíveis

#### Passo a passo:

1. Instale Heroku CLI:
```bash
npm install -g heroku
```

2. Faça login:
```bash
heroku login
```

3. Crie app:
```bash
heroku create ekids-pro
```

4. Configure variáveis:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=seu-secret-seguro-aqui
```

5. Crie `Procfile`:
```
web: node server/index.js
```

6. Deploy:
```bash
git push heroku main
```

---

### OPÇÃO 4: VPS (SERVIDOR PRÓPRIO)

**Vantagens**: Controle total, recursos dedicados, sem limitações

**Recomendado para**: Produção séria com muitos usuários

#### Passo a passo:

1. **Conecte ao servidor via SSH**:
```bash
ssh root@seu-servidor-ip
```

2. **Instale Node.js**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Clone o repositório**:
```bash
git clone https://github.com/seu-usuario/ekids-pro.git
cd ekids-pro/mvp
```

4. **Configure variáveis**:
```bash
cp .env.example .env
nano .env
```

5. **Instale dependências**:
```bash
npm install --production
```

6. **Configure banco de dados**:
```bash
node server/setup.js
```

7. **Instale PM2**:
```bash
npm install -g pm2
```

8. **Inicie o servidor**:
```bash
pm2 start server/index.js --name ekids-pro
pm2 save
pm2 startup
```

9. **Configure Nginx**:
```bash
sudo apt install nginx
```

Crie `/etc/nginx/sites-available/ekids-pro`:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

10. **Ative o site**:
```bash
sudo ln -s /etc/nginx/sites-available/ekids-pro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

11. **Configure SSL**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

---

## 📊 MONITORAMENTO

### Railway
- Acesse o dashboard e visualize logs em tempo real

### Heroku
```bash
heroku logs --tail
```

### VPS (PM2)
```bash
pm2 logs ekids-pro
pm2 monit
```

---

## 🔒 SEGURANÇA

### Checklist de Segurança:

- [ ] JWT_SECRET único e complexo (64+ caracteres)
- [ ] NODE_ENV=production
- [ ] HTTPS habilitado (SSL/TLS)
- [ ] Senhas de admin fortes
- [ ] Backup automático do banco de dados
- [ ] Rate limiting habilitado
- [ ] CORS configurado corretamente

---

## 💾 BACKUP

### Backup do Banco de Dados SQLite

**Manual**:
```bash
cp server/database/ekids.db backups/ekids-backup-$(date +%Y%m%d).db
```

**Automático (cron no VPS)**:
```bash
crontab -e
```

Adicione:
```
0 2 * * * cd /path/to/ekids-pro/mvp && cp server/database/ekids.db backups/ekids-backup-$(date +\%Y\%m\%d).db
```

---

## 🚀 SCRIPTS ÚTEIS

### Deploy Automático (Windows PowerShell)
```powershell
.\deploy.ps1
```

### Deploy Automático (Linux/Mac)
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🆘 TROUBLESHOOTING

### Erro: "Port 3000 already in use"
**Solução**: Mude a porta em `.env`:
```env
PORT=3001
```

### Erro: "Cannot find module"
**Solução**: Reinstale dependências:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Database locked"
**Solução**: Pare todos os processos Node.js:
```bash
# Windows
taskkill /F /IM node.exe

# Linux/Mac
pkill node
```

### Erro: "JWT Secret not defined"
**Solução**: Configure JWT_SECRET no `.env`:
```env
JWT_SECRET=seu-secret-muito-seguro
```

---

## ✅ CHECKLIST FINAL ANTES DO DEPLOY

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Banco de dados configurado e testado
- [ ] Servidor testado localmente
- [ ] .gitignore configurado (não commitar .env, *.db)
- [ ] Backup do banco de dados criado
- [ ] SSL/HTTPS configurado
- [ ] Monitoramento configurado
- [ ] Domínio configurado (se aplicável)

---

**🎉 PARABÉNS! SEU E-KIDS PRO ESTÁ PRONTO PARA PRODUÇÃO!**

## 📞 PRÓXIMOS PASSOS

1. Escolha uma plataforma de deploy (recomendamos Railway para facilidade)
2. Configure as variáveis de ambiente
3. Faça o primeiro deploy
4. Teste todas as funcionalidades
5. Configure monitoramento
6. Configure backups automáticos
7. Compartilhe o link com os primeiros usuários!

---

## 🎯 RECOMENDAÇÃO FINAL

Para produção real com usuários pagantes, recomendamos:

**Configuração Ideal**:
- **Hospedagem**: VPS (DigitalOcean, Linode, Vultr) - $5-10/mês
- **Banco de Dados**: Migrar para PostgreSQL
- **CDN**: Cloudflare (grátis)
- **Monitoramento**: UptimeRobot (grátis)
- **Backup**: Automático diário
- **SSL**: Let's Encrypt (grátis)

**Custo total**: ~$10/mês para começar

**Para MVP/Testes**:
- **Railway** (grátis com $5 de crédito/mês)
- Sem necessidade de configuração complexa
- Deploy em 2 minutos

Boa sorte com seu lançamento! 🚀
