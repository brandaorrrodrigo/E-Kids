@echo off
echo.
echo ============================================
echo   E-KIDS PRO MVP - INICIALIZACAO RAPIDA
echo ============================================
echo.

REM Verificar se Node.js está instalado
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale Node.js em: https://nodejs.org
    pause
    exit /b 1
)

echo [1/4] Verificando dependencias...
if not exist node_modules (
    echo [2/4] Instalando dependencias...
    call npm install
) else (
    echo [2/4] Dependencias ja instaladas.
)

echo [3/4] Configurando banco de dados...
if not exist server\database\ekids.db (
    call npm run setup
) else (
    echo Banco de dados ja configurado.
)

echo [4/4] Iniciando servidor...
echo.
echo ============================================
echo   MVP PRONTO!
echo ============================================
echo.
echo Acesse: http://localhost:3000
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

call npm start
