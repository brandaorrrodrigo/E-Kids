# MÓDULOS EDUCACIONAIS - E-KIDS PRO
## Educação Financeira, Natureza e Higiene

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Módulo: Educação Financeira](#módulo-educação-financeira)
3. [Módulo: Natureza e Meio Ambiente](#módulo-natureza-e-meio-ambiente)
4. [Módulo: Higiene e Autocuidado](#módulo-higiene-e-autocuidado)
5. [Integração Frontend](#integração-frontend)
6. [API Endpoints](#api-endpoints)
7. [Como Testar](#como-testar)

---

## 🎯 VISÃO GERAL

Três módulos educacionais totalmente funcionais foram implementados no E-KIDS PRO:

### ✅ Implementação Completa

**Backend:**
- ✅ Migrations SQL (SQLite)
- ✅ Managers (classes de lógica de negócio)
- ✅ Rotas API (30+ endpoints)
- ✅ Integração com sistema de FP e Badges

**Frontend:**
- ✅ Interfaces visuais completas
- ✅ Pop-ups animados
- ✅ Tracking em tempo real
- ✅ Sistema de feedback

**Banco de Dados:**
- ✅ 24 tabelas novas
- ✅ Seed data incluído
- ✅ Índices otimizados

---

## 💰 MÓDULO: EDUCAÇÃO FINANCEIRA

### Funcionalidades

#### 1. Pop-up ao Ganhar FP
- **Quando:** Toda vez que a criança ganha FP
- **Opções:**
  - 🐷 Guardar no cofrinho
  - ✨ Usar agora
  - ⏰ Decidir depois
- **Registro:** Todas as decisões são armazenadas para análise

#### 2. Pop-up ao Sair do App
- **Quando:** Criança tenta sair com FP não usado
- **Opções:**
  - Guardar tudo
  - Sair sem guardar

#### 3. Sistema de Cofrinhos
- **Tipos:**
  - 🎯 Meta Curta
  - 🚀 Meta Média
  - 🌟 Grande Sonho
  - 🌍 Planeta
- **Recursos:**
  - Nome personalizado
  - Meta de FP (opcional)
  - Barra de progresso visual
  - Múltiplos cofrinhos simultâneos

#### 4. Extrato Mensal
- **Automático:** Gerado todo mês
- **Contém:**
  - FP ganhos
  - FP guardados
  - FP gastos
  - Percentual poupado
  - Versão narrada (texto)

#### 5. Missões Financeiras
- Guardar FP por X dias
- Não gastar FP hoje
- Atingir meta do cofrinho
- Poupar X% dos ganhos

#### 6. Badges Financeiros
- 🐷 Poupador Iniciante
- 📊 Planejador Esperto
- 💰 Mestre do Cofrinho
- 🛡️ Guardião do Futuro
- 💎 Investidor Junior

### Uso Frontend

```javascript
// Inicializar módulo
const financial = new FinancialEducation(
  'http://localhost:3000',
  'seu-token-jwt',
  childId
);

// Mostrar pop-up de decisão ao ganhar FP
financial.showFpDecisionPopup(50, 'earned_from_quiz', 'quiz_matematica');

// Renderizar interface do cofrinho
financial.renderPiggyBank('piggy-bank-container');

// Pop-up ao sair
financial.showExitReminder(currentFp);
```

---

## 🌱 MÓDULO: NATUREZA E MEIO AMBIENTE

### Funcionalidades

#### 1. Categorias
- 🌱 Plantas
- 🐾 Animais
- 🌍 Ambiente
- 💚 Responsabilidade

#### 2. Lições Interativas
**Tipos:**
- **Histórias:** Conteúdo educativo narrativo
- **Escolhas:** Situações com múltiplas opções
  - Exemplo: "O que fazer quando um animal está assustado?"
  - Feedback imediato e educativo

#### 3. Missões
- Regar uma planta
- Observar animal com respeito
- Jogar lixo no lugar certo
- Cuidar de algo vivo por X dias

#### 4. Badges de Natureza
- 🌱 Amigo das Plantas
- 🐾 Protetor dos Animais
- 🌍 Guardião da Natureza
- ♻️ Planeta Limpo
- 💚 Coração Verde

#### 5. Temas Verdes
- Desbloqueáveis com FP guardado
- Mascotes e decorações temáticas
- Recompensa por cuidado ambiental

### Uso Frontend

```javascript
// Inicializar módulo
const nature = new NatureEducation(
  'http://localhost:3000',
  'seu-token-jwt',
  childId
);

// Renderizar interface principal
nature.renderMainInterface('nature-container');

// Iniciar lição específica
nature.startLesson(lessonId);

// Atualizar progresso de missão
nature.updateMissionProgress(missionId);
```

---

## 🧼 MÓDULO: HIGIENE E AUTOCUIDADO

### Funcionalidades

#### 1. Categorias de Hábitos
- 🤲 Mãos
- 🦷 Boca e Dentes
- 🚿 Corpo e Banho
- 👕 Roupas
- 🍎 Alimentos

#### 2. Hábitos Pré-configurados
**Mãos:**
- Lavar antes de comer
- Lavar após banheiro

**Dentes:**
- Escovar após almoço
- Escovar antes de dormir

**Corpo:**
- Tomar banho
- Trocar de roupa ao chegar em casa

**Roupas:**
- Trocar de meia diariamente

**Alimentos:**
- Lavar frutas antes de comer

#### 3. Sistema de Tracking
- Registro diário de hábitos
- Múltiplas conclusões por dia
- Histórico completo
- Guia visual para cada hábito

#### 4. Estatísticas
- 🔥 Sequência atual (dias seguidos)
- ✅ Total de hábitos completados
- 🏆 Melhor sequência
- 💯 Frequência (%)

#### 5. Missões de Higiene
- Sequência de X dias
- Rotina completa
- Consistência mensal

#### 6. Badges de Higiene
- 🤲 Mãos Limpas
- 😁 Sorriso Forte
- 💪 Corpo Saudável
- 🛡️ Guardião da Saúde
- 👑 Mestre do Autocuidado

### Uso Frontend

```javascript
// Inicializar módulo
const hygiene = new HygieneEducation(
  'http://localhost:3000',
  'seu-token-jwt',
  childId
);

// Renderizar interface principal
hygiene.renderMainInterface('hygiene-container');

// Registrar hábito
hygiene.trackHabit(habitId);

// Ver histórico
hygiene.showHistory();
```

---

## 🎨 INTEGRAÇÃO FRONTEND

### Passo 1: Incluir Scripts

```html
<!-- No HTML da página infantil -->
<script src="/js/financial-education.js"></script>
<script src="/js/nature-education.js"></script>
<script src="/js/hygiene-education.js"></script>
```

### Passo 2: Inicializar Módulos

```javascript
// Após autenticação e obtenção do token
const API_URL = 'http://localhost:3000';
const token = localStorage.getItem('authToken');
const childId = parseInt(localStorage.getItem('selectedChildId'));

// Inicializar módulos
const financialEducation = new FinancialEducation(API_URL, token, childId);
const natureEducation = new NatureEducation(API_URL, token, childId);
const hygieneEducation = new HygieneEducation(API_URL, token, childId);

// Tornar global para acesso em botões
window.financialEducation = financialEducation;
window.natureEducation = natureEducation;
window.hygieneEducation = hygieneEducation;
```

### Passo 3: Integrar com Sistema de FP

```javascript
// Interceptar ganho de FP
function onFpEarned(amount, context, source) {
  // Mostrar pop-up de decisão
  financialEducation.showFpDecisionPopup(amount, context, source)
    .then(decision => {
      console.log('Decisão:', decision);
      // Continuar fluxo normal
    });
}

// Interceptar saída do app
window.addEventListener('beforeunload', async (e) => {
  const child = getCurrentChild();
  if (child && child.total_fp > 0) {
    e.preventDefault();
    await financialEducation.showExitReminder(child.total_fp);
  }
});
```

### Passo 4: Criar Páginas/Seções

```html
<!-- Seção Educação Financeira -->
<div id="financial-section" style="display: none;">
  <div id="piggy-bank-container"></div>
</div>

<!-- Seção Natureza -->
<div id="nature-section" style="display: none;">
  <div id="nature-container"></div>
</div>

<!-- Seção Higiene -->
<div id="hygiene-section" style="display: none;">
  <div id="hygiene-container"></div>
</div>
```

```javascript
// Renderizar quando seção é ativada
function showFinancialSection() {
  document.getElementById('financial-section').style.display = 'block';
  financialEducation.renderPiggyBank('piggy-bank-container');
}

function showNatureSection() {
  document.getElementById('nature-section').style.display = 'block';
  natureEducation.renderMainInterface('nature-container');
}

function showHygieneSection() {
  document.getElementById('hygiene-section').style.display = 'block';
  hygieneEducation.renderMainInterface('hygiene-container');
}
```

---

## 🔌 API ENDPOINTS

### Educação Financeira

```
POST   /api/financial/decision
GET    /api/financial/piggy-banks/:childId
POST   /api/financial/piggy-bank
GET    /api/financial/statement/:childId/:month/:year
GET    /api/financial/missions/:childId
POST   /api/financial/mission/assign
GET    /api/financial/badges/:childId
```

### Natureza e Meio Ambiente

```
GET    /api/nature/categories
GET    /api/nature/lessons/:categoryId
GET    /api/nature/lesson/:lessonId
POST   /api/nature/lesson/complete
GET    /api/nature/missions
POST   /api/nature/mission/assign
POST   /api/nature/mission/progress
GET    /api/nature/missions/:childId
GET    /api/nature/badges/:childId
```

### Higiene e Autocuidado

```
GET    /api/hygiene/categories
GET    /api/hygiene/habits
POST   /api/hygiene/track
GET    /api/hygiene/tracking/:childId
GET    /api/hygiene/stats/:childId
GET    /api/hygiene/history/:childId
GET    /api/hygiene/missions
POST   /api/hygiene/mission/assign
GET    /api/hygiene/missions/:childId
GET    /api/hygiene/badges/:childId
```

---

## 🧪 COMO TESTAR

### 1. Iniciar Servidor

```bash
cd mvp
npm start
```

### 2. Testar Educação Financeira

```bash
# Criar cofrinho
curl -X POST http://localhost:3000/api/financial/piggy-bank \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"childId": 1, "name": "Bicicleta Nova", "goalType": "short", "targetFp": 100}'

# Registrar decisão de FP
curl -X POST http://localhost:3000/api/financial/decision \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"childId": 1, "fpAmount": 50, "decision": "save", "context": "earned_from_quiz", "source": "quiz_matematica"}'

# Ver cofrinhos
curl http://localhost:3000/api/financial/piggy-banks/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 3. Testar Natureza

```bash
# Ver categorias
curl http://localhost:3000/api/nature/categories \
  -H "Authorization: Bearer SEU_TOKEN"

# Completar lição
curl -X POST http://localhost:3000/api/nature/lesson/complete \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"childId": 1, "lessonId": 1, "choicesMade": [1]}'

# Atribuir missão
curl -X POST http://localhost:3000/api/nature/mission/assign \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"childId": 1, "missionId": 1}'
```

### 4. Testar Higiene

```bash
# Ver hábitos
curl http://localhost:3000/api/hygiene/habits \
  -H "Authorization: Bearer SEU_TOKEN"

# Registrar hábito
curl -X POST http://localhost:3000/api/hygiene/track \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"childId": 1, "habitId": 1}'

# Ver estatísticas
curl http://localhost:3000/api/hygiene/stats/1 \
  -H "Authorization: Bearer SEU_TOKEN"

# Ver histórico
curl http://localhost:3000/api/hygiene/history/1?days=30 \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 📊 DASHBOARD DOS PAIS

Todos os módulos incluem dados para o dashboard dos pais:

### Educação Financeira
- Taxa de impulsividade (% gastar vs guardar)
- Total poupado
- Frequência de decisões
- Histórico de extratos mensais
- Badges conquistados

### Natureza
- Lições completadas por categoria
- Missões ativas e concluídas
- Tendência de empatia com animais
- Cuidado ambiental

### Higiene
- Frequência de hábitos (0-100%)
- Sequência atual de dias
- Melhor sequência
- Hábitos mais e menos completados
- Sugestões de reforço

---

## 🎓 CARACTERÍSTICAS PEDAGÓGICAS

### Educação Financeira
- ✅ Não pressiona (sempre opcional)
- ✅ Recompensa positiva (nunca punição)
- ✅ Linguagem lúdica
- ✅ Progressão gradual
- ✅ FP ≠ dinheiro real

### Natureza
- ✅ Sem imagens agressivas
- ✅ Sem culpa ou medo
- ✅ Empatia construtiva
- ✅ Escolhas com explicação
- ✅ Respeito aos animais

### Higiene
- ✅ Neutro e educativo
- ✅ Sem nojo ou repulsa
- ✅ Guias visuais claros
- ✅ Reforço positivo
- ✅ Repetição gentil

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Backend implementado
2. ✅ Frontend implementado
3. ✅ Integração com FP e Badges
4. ⏳ Testes com usuários reais
5. ⏳ Ajustes baseados em feedback
6. ⏳ Adicionar áudio narrado
7. ⏳ Criar versão para pais no dashboard

---

## 📞 SUPORTE

Para dúvidas ou problemas:
1. Verificar logs do servidor: `console.log` no terminal
2. Verificar console do navegador: F12 > Console
3. Verificar tabelas do banco: `server/database/ekids.db`

---

**Implementação concluída em:** 15/12/2024
**Versão:** 1.0.0
**Status:** ✅ Totalmente funcional
