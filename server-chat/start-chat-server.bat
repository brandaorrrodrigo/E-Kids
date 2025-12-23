@echo off
REM E-Kids PRO - Iniciar Servidor de Chat
echo ========================================
echo  E-KIDS PRO - CHAT SERVER
echo ========================================
echo.
echo Verificando Ollama...
curl -s http://localhost:11434/api/version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Ollama nao esta rodando!
    echo.
    echo Execute em outro terminal:
    echo   ollama serve
    echo.
    pause
    exit /b 1
)

echo OK - Ollama rodando!
echo.
echo Instalando dependencias...
call npm install
echo.
echo Iniciando servidor de chat...
echo.
npm start
