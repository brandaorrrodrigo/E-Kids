@echo off
REM Script de verificacao completa da configuracao

echo.
echo ========================================
echo  VERIFICACAO COMPLETA DO SETUP
echo ========================================
echo.

set ERRORS=0
set WARNINGS=0

REM ========================================
REM 1. Verificar Chat Server
REM ========================================
echo [1/4] Verificando Chat Server...
curl -s http://127.0.0.1:3001/health >nul 2>&1
if %errorlevel% neq 0 (
    echo    ERRO: Chat server nao esta rodando!
    echo    Execute: cd D:\E-Kids-PRO\mvp\server-chat ^&^& npm start
    set /a ERRORS+=1
) else (
    echo    OK - Chat server rodando
)
echo.

REM ========================================
REM 2. Verificar Ollama
REM ========================================
echo [2/4] Verificando Ollama...
curl -s http://127.0.0.1:11434/api/version >nul 2>&1
if %errorlevel% neq 0 (
    echo    ERRO: Ollama nao esta rodando!
    echo    Execute: ollama serve
    set /a ERRORS+=1
) else (
    echo    OK - Ollama rodando
)
echo.

REM ========================================
REM 3. Verificar Modelos Ollama
REM ========================================
echo [3/4] Verificando modelos Ollama...

echo    Verificando llama3.2:latest...
ollama list | findstr "llama3.2" >nul 2>&1
if %errorlevel% neq 0 (
    echo    AVISO: Modelo llama3.2:latest nao encontrado
    echo    Execute: ollama pull llama3.2:latest
    set /a WARNINGS+=1
) else (
    echo    OK - llama3.2:latest instalado
)

echo    Verificando llama3.1:8b...
ollama list | findstr "llama3.1:8b" >nul 2>&1
if %errorlevel% neq 0 (
    echo    AVISO: Modelo llama3.1:8b nao encontrado
    echo    Execute: ollama pull llama3.1:8b
    set /a WARNINGS+=1
) else (
    echo    OK - llama3.1:8b instalado
)
echo.

REM ========================================
REM 4. Verificar Arquivos .env dos Projetos
REM ========================================
echo [4/4] Verificando configuracao dos projetos...

call :check_env "D:\E-Kids-PRO\mvp" "E-Kids PRO"
call :check_env "D:\NUTRIFITCOACH_MASTER" "NutriFitCoach"
call :check_env "D:\enem-ia\enem-pro" "Enem Pro"
call :check_env "D:\petcontrol-ia\petcontrol-pro" "PetControl"
call :check_env "D:\medcontrol" "MedControl"
call :check_env "D:\doutora-ia" "Doutora IA"
call :check_env "D:\JURIS_IA_CORE_V1" "Doutora IA OAB"

echo.

REM ========================================
REM RESUMO
REM ========================================
echo ========================================
echo  RESUMO
echo ========================================
echo.

if %ERRORS% equ 0 (
    if %WARNINGS% equ 0 (
        echo Status: TUDO OK! ✓
        echo.
        echo Tudo funcionando perfeitamente!
        echo Pode testar os projetos: test-all-projects.bat
    ) else (
        echo Status: OK COM AVISOS
        echo.
        echo Erros: 0
        echo Avisos: %WARNINGS%
        echo.
        echo Sistema funcional, mas alguns modelos podem estar faltando.
    )
) else (
    echo Status: ERROS ENCONTRADOS ✗
    echo.
    echo Erros: %ERRORS%
    echo Avisos: %WARNINGS%
    echo.
    echo Corrija os erros acima antes de continuar.
)

echo.
echo ========================================
echo  PROXIMOS PASSOS
echo ========================================
echo.

if %ERRORS% equ 0 (
    echo 1. Testar todos os projetos:
    echo    test-all-projects.bat
    echo.
    echo 2. Ver dashboard:
    echo    http://localhost:3001/dashboard
    echo.
    echo 3. Configurar Cloudflare Tunnel:
    echo    Ver: CLOUDFLARE_TUNNEL_PASSO_A_PASSO.md
    echo.
    echo 4. Deploy no Railway:
    echo    Ver: RAILWAY_DEPLOY_PASSO_A_PASSO.md
) else (
    echo 1. Corrigir os erros acima
    echo 2. Executar novamente: verify-setup.bat
)

echo.
pause
exit /b %ERRORS%

REM ========================================
REM Funcao para verificar .env de cada projeto
REM ========================================
:check_env
set PROJECT_PATH=%~1
set PROJECT_NAME=%~2

if not exist "%PROJECT_PATH%\.env" (
    echo    [%PROJECT_NAME%] AVISO: .env nao encontrado
    echo                      Execute: configure-all-projects.bat
    set /a WARNINGS+=1
) else (
    findstr /C:"CHAT_SERVER_URL" "%PROJECT_PATH%\.env" >nul 2>&1
    if errorlevel 1 (
        echo    [%PROJECT_NAME%] AVISO: .env sem CHAT_SERVER_URL
        echo                      Execute: configure-all-projects.bat
        set /a WARNINGS+=1
    ) else (
        findstr /C:"CHAT_API_KEY" "%PROJECT_PATH%\.env" >nul 2>&1
        if errorlevel 1 (
            echo    [%PROJECT_NAME%] AVISO: .env sem CHAT_API_KEY
            echo                      Execute: configure-all-projects.bat
            set /a WARNINGS+=1
        ) else (
            echo    [%PROJECT_NAME%] OK - .env configurado
        )
    )
)
exit /b 0
