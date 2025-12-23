@echo off
REM E-Kids PRO - Iniciar todos os servidores
REM Este script inicia:
REM 1. Servidor Principal (porta 3000)
REM 2. Servidor de Chat (porta 3001)
REM 3. Cloudflare Tunnel (expõe porta 3001)

echo ========================================
echo  E-KIDS PRO - INICIANDO SERVIDORES
echo ========================================
echo.

REM Verificar se Ollama está rodando
echo [1/4] Verificando Ollama...
curl -s http://localhost:11434/api/version >nul 2>&1
if %errorlevel% neq 0 (
    echo AVISO: Ollama nao esta rodando!
    echo Execute: ollama serve
    echo.
    pause
    exit /b 1
)
echo OK - Ollama rodando!
echo.

REM Iniciar Servidor Principal (porta 3000)
echo [2/4] Iniciando Servidor Principal (porta 3000)...
start "E-Kids Server Principal" cmd /k "cd /d D:\E-Kids-PRO\mvp && npm start"
timeout /t 3 /nobreak >nul
echo OK - Servidor Principal iniciado!
echo.

REM Iniciar Servidor de Chat (porta 3001)
echo [3/4] Iniciando Servidor de Chat (porta 3001)...
start "E-Kids Chat Server" cmd /k "cd /d D:\E-Kids-PRO\mvp\server-chat && npm start"
timeout /t 3 /nobreak >nul
echo OK - Servidor de Chat iniciado!
echo.

REM Iniciar Cloudflare Tunnel (opcional)
echo [4/4] Cloudflare Tunnel (OPCIONAL)
echo.
choice /c SN /m "Deseja iniciar o Cloudflare Tunnel"
if %errorlevel%==1 (
    echo Iniciando Cloudflare Tunnel...
    start "Cloudflare Tunnel" cmd /k "cloudflared tunnel --url http://localhost:3001"
    echo OK - Tunnel iniciado!
) else (
    echo Tunnel ignorado. Execute manualmente se necessario.
)

echo.
echo ========================================
echo  TODOS OS SERVIDORES INICIADOS!
echo ========================================
echo.
echo Servidor Principal: http://localhost:3000
echo Servidor de Chat:   http://localhost:3001
echo Interface Crianca:  http://localhost:3000/crianca
echo.
echo Pressione qualquer tecla para abrir no navegador...
pause >nul

start http://localhost:3000/crianca

echo.
echo Para parar os servidores, feche todas as janelas de terminal.
echo.
pause
