# E-KIDS PRO MVP - CHECKLIST DE VALIDAÇÃO
## Demo Completo com Fases 2/3 + Mapa + Loja

---

## ⚙️ PARTE 1: SETUP INICIAL (5 min)

### 1.1 Abrir PowerShell e navegar até o projeto
```powershell
cd D:\E-Kids-PRO\mvp
```

### 1.2 Instalar dependências (se necessário)
```powershell
npm install
```
**Resultado esperado:** Todas as dependências instaladas sem erros.

### 1.3 Executar setup (criar banco e migrations)
```powershell
npm run setup
```
**Resultado esperado:**
- ✅ Diretório do banco de dados criado ou já existe
- ✅ Conectado ao banco de dados
- ✅ Migrations executadas com sucesso (5 migrations)
- ✅ Schema básico inicializado
- ✅ Seed dos módulos (5 módulos)
- Mensagem final: "🚀 Tudo pronto! Execute 'npm run dev' para iniciar o servidor."

### 1.4 Iniciar servidor
```powershell
npm run dev
```
**Resultado esperado:**
- Servidor rodando em: http://localhost:3000
- Mensagem: "✅ Migration Fase 2/3 + Mapa + Loja executada"
- Sem erros no console

---

## 🌐 PARTE 2: CRIAR CONTA E PERFIL (3 min)

### 2.1 Abrir navegador
```
URL: http://localhost:3000
```

### 2.2 Registrar família
- Clicar em "Registrar"
- Preencher:
  - Email: teste@ekids.com
  - Senha: 123456
  - Nome do Responsável: Rodrigo
- Clicar em "Registrar"

**Resultado esperado:** Redirecionamento para área dos pais.

### 2.3 Criar perfil da criança
- Na área dos pais, clicar em "Criar Perfil de Criança"
- Preencher:
  - Nome: Maria
  - Idade: 8
  - Avatar: 🦊 (escolher qualquer)
- Clicar em "Criar"

**Resultado esperado:** Criança criada com sucesso.

### 2.4 Acessar interface da criança
```
URL: http://localhost:3000/crianca
```
OU:
- Na área dos pais, clicar no nome da criança para abrir interface

**Resultado esperado:**
- Interface infantil carregada
- Navbar com 6 botões: Início, Mapa, Missões, Loja, Cofrinho, Conquistas
- FP = 0 no header

---

## 🎯 PARTE 3: VALIDAR PROGRESSÃO FASE 1 → FASE 2 (10 min)

### 3.1 Verificar Fase 1 desbloqueada
- Na interface da criança, clicar em **"Missões"**

**Resultado esperado:**
- Seletor de fases mostrando:
  - Fase 1: DESBLOQUEADA ✅ (0/5 missões)
  - Fase 2: BLOQUEADA 🔒
  - Fase 3: BLOQUEADA 🔒
- 5 missões da Fase 1 visíveis

### 3.2 Completar todas as 5 missões da Fase 1
Para cada missão:
1. Clicar na missão
2. Ler a história (aguardar 3 segundos)
3. Escolher uma resposta (A, B ou C)
4. Ler o feedback
5. Clicar em "Concluir e Ganhar FP!"

Missões da Fase 1:
- ✅ Meu Jeito, Meus Limites (+10 FP)
- ✅ Posso Pedir Ajuda (+10 FP)
- ✅ Cuidando de Mim (+10 FP)
- ✅ Minhas Emoções (+10 FP)
- ✅ Desafios Positivos (+10 FP)

**Resultado esperado após completar a 5ª missão:**
- FP total = 50 FP
- Mensagem: "🎉 Parabéns! Você desbloqueou uma nova fase! Continue explorando!"
- Ao voltar para "Missões":
  - Fase 1: 5/5 missões ✓
  - Fase 2: DESBLOQUEADA ✅ (0/10 missões)
  - Fase 3: BLOQUEADA 🔒

### 3.3 Verificar missões da Fase 2
- Clicar no botão "Fase 2"

**Resultado esperado:**
- 10 missões da Fase 2 visíveis
- Títulos incluem:
  - "Aprendendo a Dizer NÃO"
  - "Segurança na Piscina"
  - "Cuidado com Tomadas"
  - "Fogão e Panelas Quentes"
  - "Produtos de Limpeza"
  - "Remédios Não São Balas"
  - "Movimente-se!"
  - "Reconhecendo o Medo"
  - "Alegria e Gratidão"
  - "Criando Histórias"
- Cada missão dá +15 FP

### 3.4 Completar TODAS as 10 missões da Fase 2
Repetir processo anterior para as 10 missões.

**Resultado esperado após completar a 10ª missão:**
- FP total = 50 + 150 = 200 FP
- Mensagem: "🎉 Parabéns! Você desbloqueou uma nova fase!"
- Ao voltar para "Missões":
  - Fase 1: 5/5 ✓
  - Fase 2: 10/10 ✓
  - Fase 3: DESBLOQUEADA ✅ (0/15 missões)

### 3.5 Verificar missões da Fase 3
- Clicar no botão "Fase 3"

**Resultado esperado:**
- 15 missões da Fase 3 visíveis
- Inclui missões de segurança, idiomas (EN/ES), emoções
- Cada missão dá +20 FP

---

## 🗺️ PARTE 4: VALIDAR MAPA DO MUNDO (3 min)

### 4.1 Acessar o Mapa
- Clicar em **"Mapa"** na navbar

**Resultado esperado:**
- Seção "🎯 Seu Progresso" com 3 cards de fases:
  - Fase 1: 100% (5/5 missões)
  - Fase 2: 100% (10/10 missões)
  - Fase 3: 0% (0/15 missões)
- Seção "🌍 Áreas de Exploração" com 5 cards:
  - 💙 Emoções
  - 💪 Corpo & Movimento
  - 🛡️ Segurança
  - 🎨 Criatividade
  - 🌍 Idiomas
- Cada área mostra progresso (x/y concluídas)

### 4.2 Explorar uma área
- Clicar em qualquer área (ex: "Segurança")

**Resultado esperado:**
- Redirecionamento para tela "Missões"
- Missões filtradas pela área escolhida

---

## 🛒 PARTE 5: VALIDAR LOJA FP (5 min)

### 5.1 Acessar a Loja
- Clicar em **"Loja"** na navbar

**Resultado esperado:**
- Saldo exibido: "Seu saldo: 200 FP ⭐"
- Tabs: Tudo, Painéis, Skins, Acessórios
- Grade de itens com 8 itens:
  - Painel Céu Azul (80 FP)
  - Painel Galáxia (150 FP)
  - Painel Floresta (120 FP)
  - Chapéu do Mascote (60 FP)
  - Aura Brilhante (200 FP)
  - Skin Arco-Íris (100 FP)
  - Mascote com Óculos (70 FP)
  - Painel Espaço Sideral (180 FP)

### 5.2 Comprar um item
- Clicar em "Comprar" no item "Painel Céu Azul" (80 FP)
- Confirmar compra

**Resultado esperado:**
- Mensagem: "Item comprado com sucesso! 🛒"
- Saldo atualizado: 200 - 80 = 120 FP
- Item aparece na seção "🎒 Meu Inventário"

### 5.3 Equipar o item
- No inventário, clicar em "Equipar" no item comprado

**Resultado esperado:**
- Mensagem: "Item equipado! ✨"
- Item marcado com "✓ Equipado"

### 5.4 Tentar comprar item sem FP suficiente
- Tentar comprar "Painel Galáxia" (150 FP) com saldo de 120 FP

**Resultado esperado:**
- Mensagem de erro: "Você não tem FP suficiente!"

---

## 🏦 PARTE 6: VALIDAR COFRINHO COM RENDIMENTO MENSAL (5 min)

### 6.1 Acessar o Cofrinho
- Clicar em **"Cofrinho"** na navbar

**Resultado esperado:**
- Guardado: 0 FP
- Botões: "Guardar FP" e "Retirar FP"

### 6.2 Depositar FP
- Clicar em "Guardar FP"
- Digitar: 100
- Confirmar

**Resultado esperado:**
- Mensagem: "100 FP guardado! Seu cofrinho cresceu! 💵"
- Saldo atual: 120 - 100 = 20 FP
- Guardado: 100 FP

### 6.3 Aplicar rendimento mensal
**IMPORTANTE:** Verificar se já aplicou rendimento este mês.

- Se botão "Receber! 🎉" estiver visível:
  - Clicar no botão
  - **Resultado esperado:**
    - Rendimento aplicado: 3% de 100 = 3 FP
    - Guardado: 100 + 3 = 103 FP
    - Mensagem de sucesso

- Se botão não estiver visível ou der erro "Rendimento já aplicado este mês":
  - **Isso é NORMAL**: O sistema impede aplicar rendimento mais de 1x por mês
  - Regra: 3% ao mês, máximo 100 FP de rendimento

### 6.4 Retirar FP do cofrinho
- Clicar em "Retirar FP"
- Digitar: 50
- Confirmar

**Resultado esperado:**
- Mensagem: "50 FP retirado! Seu FP voltou para você! 💰"
- Saldo atual: 20 + 50 = 70 FP
- Guardado: 103 - 50 = 53 FP (se rendimento foi aplicado) ou 100 - 50 = 50 FP

---

## 🏆 PARTE 7: VALIDAR BADGES/CONQUISTAS (2 min)

### 7.1 Acessar Conquistas
- Clicar em **"Conquistas"** na navbar

**Resultado esperado:**
- Badges conquistados exibidos, incluindo:
  - 👣 Primeiros Passos (primeira missão)
  - 🌟 Explorador (5 missões) ou mais
  - 💰 Rico em FP (se tiver alcançado 100 FP)
  - 💵 Poupador Iniciante (guardou FP pela primeira vez)

---

## 🔄 PARTE 8: VALIDAR PERSISTÊNCIA (2 min)

### 8.1 Recarregar página
- Pressionar F5 ou recarregar a página

**Resultado esperado:**
- Dados mantidos:
  - FP total
  - Missões completadas
  - Fases desbloqueadas
  - Itens comprados e equipados
  - FP no cofrinho

### 8.2 Fechar e reabrir navegador
- Fechar navegador completamente
- Abrir novamente em http://localhost:3000/crianca

**Resultado esperado:**
- Todos os dados persistem (SQLite)

---

## ✅ CRITÉRIOS DE ACEITE (OBRIGATÓRIOS)

- [ ] Concluir Fase 1 destrava Fase 2 automaticamente ✅
- [ ] Concluir Fase 2 destrava Fase 3 automaticamente ✅
- [ ] Mapa mostra progresso correto por área e fase ✅
- [ ] Loja permite comprar e equipar itens ✅
- [ ] Cofrinho aplica rendimento 1x/mês com regra de 3% (max 100 FP) ✅
- [ ] Não há links mortos na navegação ✅
- [ ] Criança não fica presa na primeira tela ✅
- [ ] Dados persistem após reload/fechar navegador ✅

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### Erro: "Cannot find module 'better-sqlite3'"
**Solução:**
```powershell
npm install
```

### Erro: "Port 3000 already in use"
**Solução:**
```powershell
# Matar processo na porta 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Banco de dados não cria ou migrations não rodam
**Solução:**
```powershell
# Deletar banco antigo e recriar
Remove-Item -Force server\database\ekids.db*
npm run setup
```

### Interface não carrega ou dá erro 404
**Solução:**
- Verificar se servidor está rodando
- Acessar URL correta: http://localhost:3000/crianca
- Verificar console do navegador (F12) para erros JavaScript

---

## 📋 RESUMO DE COMANDOS

```powershell
# Setup inicial (apenas 1x)
cd D:\E-Kids-PRO\mvp
npm install
npm run setup

# Rodar servidor (sempre)
npm run dev

# URLs importantes
# http://localhost:3000 - Página inicial (login/registro)
# http://localhost:3000/pais - Área dos pais
# http://localhost:3000/crianca - Interface da criança
```

---

## ✨ VALIDAÇÃO COMPLETA

Se você conseguiu:
1. ✅ Completar Fase 1 e destravou Fase 2
2. ✅ Completar Fase 2 e destravou Fase 3
3. ✅ Ver o Mapa com progresso correto
4. ✅ Comprar e equipar itens na Loja
5. ✅ Guardar FP no Cofrinho e aplicar rendimento mensal
6. ✅ Navegar sem links mortos
7. ✅ Dados persistem após reload

**🎉 PARABÉNS! O MVP ESTÁ FUNCIONANDO PERFEITAMENTE!**

---

## 📝 NOTAS FINAIS

- **Rendimento mensal**: Só pode ser aplicado 1x por mês por criança. Se já aplicou, esperar próximo mês.
- **Fases**: Desbloqueio é automático ao completar TODAS as missões de uma fase.
- **Persistência**: Tudo é salvo em SQLite (server/database/ekids.db).
- **Dados de teste**: Use email/senha de teste. Não use dados reais.

---

**Tempo total estimado de validação: 35 minutos**
