@echo off
REM Teste completo de todos os 7 projetos no Chat Server Multi-Tenant

echo.
echo ========================================
echo  TESTANDO TODOS OS 7 PROJETOS
echo ========================================
echo.

REM Verificar se servidor está rodando
echo Verificando servidor...
curl -s http://127.0.0.1:3001/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Servidor de chat nao esta rodando!
    echo Execute: cd server-chat ^&^& npm start
    pause
    exit /b 1
)
echo OK - Servidor rodando!
echo.

echo ========================================
echo.

echo [1/7] E-KIDS PRO (Lu) - Educacao Infantil
echo ----------------------------------------
curl -s -X POST http://127.0.0.1:3001/api/chat ^
  -H "X-API-Key: ekidspro-2025-secret-key-ultra-secure" ^
  -H "Content-Type: application/json" ^
  -d "{\"userName\":\"Pedro\",\"message\":\"Oi Lu!\"}"
echo.
echo.

echo [2/7] NUTRIFIT COACH - Nutricao e Fitness
echo ----------------------------------------
curl -s -X POST http://127.0.0.1:3001/api/chat ^
  -H "X-API-Key: nutrifit-2025-secret-key-ultra-secure" ^
  -H "Content-Type: application/json" ^
  -d "{\"userName\":\"Joao\",\"message\":\"Preciso perder peso\"}"
echo.
echo.

echo [3/7] ENEM PRO - Preparacao ENEM
echo ----------------------------------------
curl -s -X POST http://127.0.0.1:3001/api/chat ^
  -H "X-API-Key: enempro-2025-secret-key-ultra-secure" ^
  -H "Content-Type: application/json" ^
  -d "{\"userName\":\"Maria\",\"message\":\"Como estudar matematica?\"}"
echo.
echo.

echo [4/7] PET CONTROL - Gestao de Pets
echo ----------------------------------------
curl -s -X POST http://127.0.0.1:3001/api/chat ^
  -H "X-API-Key: petcontrol-2025-secret-key-ultra-secure" ^
  -H "Content-Type: application/json" ^
  -d "{\"userName\":\"Ana\",\"message\":\"Como cuidar do meu cachorro?\"}"
echo.
echo.

echo [5/7] MED CONTROL - Controle Medico
echo ----------------------------------------
curl -s -X POST http://127.0.0.1:3001/api/chat ^
  -H "X-API-Key: medcontrol-2025-secret-key-ultra-secure" ^
  -H "Content-Type: application/json" ^
  -d "{\"userName\":\"Carlos\",\"message\":\"Como organizar minhas consultas?\"}"
echo.
echo.

echo [6/7] DOUTORA IA - Assistente Medica
echo ----------------------------------------
curl -s -X POST http://127.0.0.1:3001/api/chat ^
  -H "X-API-Key: doutoraia-2025-secret-key-ultra-secure" ^
  -H "Content-Type: application/json" ^
  -d "{\"userName\":\"Rita\",\"message\":\"O que e diabetes?\"}"
echo.
echo.

echo [7/7] DOUTORA IA OAB - Assistente Juridica
echo ----------------------------------------
curl -s -X POST http://127.0.0.1:3001/api/chat ^
  -H "X-API-Key: doutoraia-oab-2025-secret-key-ultra-secure" ^
  -H "Content-Type: application/json" ^
  -d "{\"userName\":\"Paulo\",\"message\":\"O que e LGPD?\"}"
echo.
echo.

echo ========================================
echo  TESTE COMPLETO!
echo ========================================
echo.
echo Dashboard: http://localhost:3001/dashboard
echo.
pause
