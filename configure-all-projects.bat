@echo off
REM Script para configurar automaticamente .env de todos os 7 projetos

echo.
echo ========================================
echo  CONFIGURANDO TODOS OS 7 PROJETOS
echo ========================================
echo.

REM Definir variáveis comuns
set CHAT_URL=http://localhost:3001

echo [1/7] Configurando E-Kids PRO...
set PROJECT_PATH=D:\E-Kids-PRO\mvp
set API_KEY=ekidspro-2025-secret-key-ultra-secure
call :configure_project "%PROJECT_PATH%" "%API_KEY%" "E-Kids PRO"
echo.

echo [2/7] Configurando NutriFitCoach...
set PROJECT_PATH=D:\NUTRIFITCOACH_MASTER
set API_KEY=nutrifit-2025-secret-key-ultra-secure
call :configure_project "%PROJECT_PATH%" "%API_KEY%" "NutriFitCoach"
echo.

echo [3/7] Configurando Enem Pro...
set PROJECT_PATH=D:\enem-ia\enem-pro
set API_KEY=enempro-2025-secret-key-ultra-secure
call :configure_project "%PROJECT_PATH%" "%API_KEY%" "Enem Pro"
echo.

echo [4/7] Configurando PetControl...
set PROJECT_PATH=D:\petcontrol-ia\petcontrol-pro
set API_KEY=petcontrol-2025-secret-key-ultra-secure
call :configure_project "%PROJECT_PATH%" "%API_KEY%" "PetControl"
echo.

echo [5/7] Configurando MedControl...
set PROJECT_PATH=D:\medcontrol
set API_KEY=medcontrol-2025-secret-key-ultra-secure
call :configure_project "%PROJECT_PATH%" "%API_KEY%" "MedControl"
echo.

echo [6/7] Configurando Doutora IA...
set PROJECT_PATH=D:\doutora-ia
set API_KEY=doutoraia-2025-secret-key-ultra-secure
call :configure_project "%PROJECT_PATH%" "%API_KEY%" "Doutora IA"
echo.

echo [7/7] Configurando Doutora IA OAB...
set PROJECT_PATH=D:\JURIS_IA_CORE_V1
set API_KEY=doutoraia-oab-2025-secret-key-ultra-secure
call :configure_project "%PROJECT_PATH%" "%API_KEY%" "Doutora IA OAB"
echo.

echo ========================================
echo  CONFIGURACAO COMPLETA!
echo ========================================
echo.
echo Todos os 7 projetos foram configurados!
echo.
echo Proximos passos:
echo 1. Testar: test-all-projects.bat
echo 2. Dashboard: http://localhost:3001/dashboard
echo.
pause
exit /b 0

REM ========================================
REM Funcao para configurar cada projeto
REM ========================================
:configure_project
set PROJ_PATH=%~1
set PROJ_KEY=%~2
set PROJ_NAME=%~3

REM Verificar se o diretório existe
if not exist "%PROJ_PATH%" (
    echo    ERRO: Diretorio nao encontrado: %PROJ_PATH%
    exit /b 1
)

REM Verificar se já existe .env
if exist "%PROJ_PATH%\.env" (
    echo    .env ja existe - adicionando configuracoes...

    REM Verificar se já tem CHAT_SERVER_URL
    findstr /C:"CHAT_SERVER_URL" "%PROJ_PATH%\.env" >nul
    if errorlevel 1 (
        echo. >> "%PROJ_PATH%\.env"
        echo # ======================================== >> "%PROJ_PATH%\.env"
        echo # MULTI-TENANT CHAT SERVER >> "%PROJ_PATH%\.env"
        echo # ======================================== >> "%PROJ_PATH%\.env"
        echo CHAT_SERVER_URL=%CHAT_URL% >> "%PROJ_PATH%\.env"
        echo CHAT_API_KEY=%PROJ_KEY% >> "%PROJ_PATH%\.env"
        echo    SUCESSO - Variaveis adicionadas ao .env existente
    ) else (
        echo    INFO - .env ja tem configuracoes do chat server
    )
) else (
    echo    Criando novo .env...
    (
        echo # ========================================
        echo # %PROJ_NAME% - Environment Variables
        echo # ========================================
        echo.
        echo # MULTI-TENANT CHAT SERVER
        echo CHAT_SERVER_URL=%CHAT_URL%
        echo CHAT_API_KEY=%PROJ_KEY%
        echo.
        echo # Adicione outras variaveis abaixo:
    ) > "%PROJ_PATH%\.env"
    echo    SUCESSO - Novo .env criado
)

exit /b 0
