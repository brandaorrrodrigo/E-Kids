#!/bin/bash

# ======================================
# E-KIDS PRO - DEPLOY SCRIPT
# ======================================

set -e  # Exit on error

echo "🚀 E-KIDS PRO - INICIANDO DEPLOY"
echo "=================================="
echo ""

# 1. Verificar Node.js
echo "📦 Verificando Node.js..."
node --version || { echo "❌ Node.js não encontrado!"; exit 1; }
npm --version || { echo "❌ npm não encontrado!"; exit 1; }
echo "✅ Node.js detectado"
echo ""

# 2. Instalar dependências
echo "📚 Instalando dependências..."
npm install --production
echo "✅ Dependências instaladas"
echo ""

# 3. Verificar variáveis de ambiente
echo "🔐 Verificando .env..."
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Copiando de .env.example..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Configure as variáveis em .env antes de continuar!"
    echo "   - JWT_SECRET: Use um valor único e secreto"
    echo "   - NODE_ENV: Mude para 'production'"
    exit 1
fi
echo "✅ Arquivo .env encontrado"
echo ""

# 4. Setup do banco de dados
echo "🗄️  Configurando banco de dados..."
node server/setup.js
echo "✅ Banco de dados configurado"
echo ""

# 5. Teste rápido do servidor
echo "🧪 Testando servidor..."
timeout 3 npm start &
PID=$!
sleep 2
if ps -p $PID > /dev/null; then
    echo "✅ Servidor iniciado com sucesso"
    kill $PID 2>/dev/null || true
else
    echo "❌ Erro ao iniciar servidor"
    exit 1
fi
echo ""

# 6. Conclusão
echo "=================================="
echo "✅ DEPLOY PREPARADO COM SUCESSO!"
echo "=================================="
echo ""
echo "Para iniciar o servidor:"
echo "  npm start"
echo ""
echo "Para deploy em produção, escolha uma plataforma:"
echo "  1. Vercel: vercel --prod"
echo "  2. Heroku: git push heroku main"
echo "  3. Railway: railway up"
echo "  4. DigitalOcean App Platform"
echo "  5. VPS (servidor próprio)"
echo ""
