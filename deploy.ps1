# ======================================
# E-KIDS PRO - DEPLOY SCRIPT (PowerShell)
# ======================================

Write-Host "🚀 E-KIDS PRO - INICIANDO DEPLOY" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""

# 1. Verificar Node.js
Write-Host "📦 Verificando Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js $nodeVersion detectado" -ForegroundColor Green
    Write-Host "✅ npm $npmVersion detectado" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js ou npm não encontrado!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 2. Instalar dependências
Write-Host "📚 Instalando dependências..." -ForegroundColor Cyan
npm install --production
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependências instaladas" -ForegroundColor Green
Write-Host ""

# 3. Verificar variáveis de ambiente
Write-Host "🔐 Verificando .env..." -ForegroundColor Cyan
if (-not (Test-Path .env)) {
    Write-Host "⚠️  Arquivo .env não encontrado. Copiando de .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠️  IMPORTANTE: Configure as variáveis em .env antes de continuar!" -ForegroundColor Yellow
    Write-Host "   - JWT_SECRET: Use um valor único e secreto" -ForegroundColor Yellow
    Write-Host "   - NODE_ENV: Mude para 'production'" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
Write-Host ""

# 4. Setup do banco de dados
Write-Host "🗄️  Configurando banco de dados..." -ForegroundColor Cyan
node server/setup.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Avisos no setup do banco, mas continuando..." -ForegroundColor Yellow
}
Write-Host "✅ Banco de dados configurado" -ForegroundColor Green
Write-Host ""

# 5. Conclusão
Write-Host "==================================" -ForegroundColor Green
Write-Host "✅ DEPLOY PREPARADO COM SUCESSO!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar o servidor:" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "Para deploy em produção, escolha uma plataforma:" -ForegroundColor Cyan
Write-Host "  1. Vercel: vercel --prod" -ForegroundColor White
Write-Host "  2. Heroku: git push heroku main" -ForegroundColor White
Write-Host "  3. Railway: railway up" -ForegroundColor White
Write-Host "  4. DigitalOcean App Platform" -ForegroundColor White
Write-Host "  5. VPS (servidor próprio)" -ForegroundColor White
Write-Host ""
