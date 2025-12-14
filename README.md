# 🌟 E-KIDS PRO - Sistema Completo de Educação e Autonomia Infantil

**Proteção Infantil + Educação Financeira + Gamificação + Mini-Games**

> Plataforma educacional gamificada que ensina crianças (6-12 anos) sobre educação financeira, responsabilidade e autonomia através de missões interativas e mini-games.

---

## 🎯 SOBRE O SISTEMA

O E-Kids PRO é uma plataforma completa que combina:

- **🛡️ Proteção e Autonomia**: 5 módulos essenciais sobre limites e autocuidado
- **💰 Educação Financeira**: Cofrinho digital com rendimento mensal
- **🎮 Mini-Games Educativos**: 4 jogos que ensinam de forma divertida
- **⭐ Sistema de Pontos (FP)**: Gamificação completa com níveis e badges
- **🛒 Loja de Recompensas**: Troque FP por recompensas reais
- **📊 Dashboard Parental**: Controle total para os pais acompanharem

---

## 🚀 INSTALAÇÃO RÁPIDA

### Pré-requisitos
- Node.js 16+ instalado
- NPM ou Yarn

### Passo 1: Instalar dependências
```bash
cd D:\E-Kids-PRO\mvp
npm install
```

### Passo 2: Configurar variáveis de ambiente
```bash
# Copiar arquivo de exemplo
copy .env.example .env

# Editar .env se necessário (opcional para testes locais)
```

### Passo 3: Configurar banco de dados
```bash
npm run setup
```

### Passo 4: Iniciar servidor
```bash
npm start
```

### Passo 5: Acessar aplicação
Abra o navegador em: **http://localhost:3000**

---

## 🎯 COMO USAR

### 1. Criar Conta (Área dos Pais)
- Acesse http://localhost:3000
- Clique em "Cadastrar"
- Preencha: Nome, Email, Senha
- Clique em "Cadastrar"

### 2. Criar Perfil da Criança
- Após login, clique em "+ Adicionar Criança"
- Preencha: Nome da criança, Idade (opcional)
- Escolha um avatar
- Clique em "Criar Perfil"

### 3. Criança Acessa Módulos
- Clique no perfil da criança
- Navegue pelos 5 módulos disponíveis
- Complete atividades
- Ganhe FP (Fun Points)

### 4. Pais Acompanham Progresso
- Clique em "👨‍👩‍👧 Área dos Pais"
- Veja estatísticas
- Leia sobre cada módulo
- Acompanhe progresso das crianças

---

## 📁 ESTRUTURA DO PROJETO

```
mvp/
├── server/
│   ├── index.js           # Servidor principal
│   ├── setup-db.js        # Setup do banco de dados
│   └── database/
│       ├── schema.sql     # Schema SQL
│       └── ekids.db       # Banco SQLite (criado automaticamente)
├── public/
│   ├── index.html         # Página de login/cadastro
│   ├── crianca.html       # Interface infantil
│   ├── modulo.html        # Página de módulo
│   ├── pais.html          # Área dos pais
│   ├── css/
│   │   ├── main.css       # Estilos principais
│   │   ├── child.css      # Estilos interface infantil
│   │   ├── parents.css    # Estilos área dos pais
│   │   └── module.css     # Estilos módulos
│   └── js/
│       ├── auth.js        # Autenticação
│       ├── app.js         # App principal
│       ├── child.js       # Interface infantil
│       ├── parents.js     # Área dos pais
│       ├── module.js      # Gerenciador de módulos
│       └── modules/       # Conteúdo dos 5 módulos
│           ├── dizer-nao.js
│           ├── pedir-ajuda.js
│           ├── protecao-corpo.js
│           ├── emocoes.js
│           └── desafios.js
├── package.json
├── .env.example
└── README.md
```

---

## 🎓 FUNCIONALIDADES PRINCIPAIS

### 1. Módulos Educacionais (5 módulos)
- **🛡️ Meu Jeito, Meus Limites** - Aprender a dizer não (60 FP)
- **🤝 Posso Pedir Ajuda** - Desenvolver confiança (60 FP)
- **💙 Cuidando de Mim** - Proteção do corpo e limites pessoais (60 FP)
- **😊 Minhas Emoções** - Reconhecer e expressar emoções (60 FP)
- **⭐ Desafios Positivos** - Fortalecer autoconfiança (35-60 FP/desafio)

### 2. Mini-Games Educativos (4 jogos)

#### 🧠 Jogo da Memória
- **Objetivo**: Desenvolver concentração e memória
- **Mecânica**: Encontre pares de cartas
- **Níveis**: Fácil (8 pares), Médio (12 pares), Difícil (16 pares)
- **FP**: 3-10 pontos baseado em desempenho
- **Limite**: 3 jogadas por dia

#### 📚 Quiz Educativo
- **Objetivo**: Conhecimentos gerais e aprendizado
- **Mecânica**: Responda perguntas de múltipla escolha
- **Níveis**: Fácil (5 perguntas), Médio (7 perguntas), Difícil (10 perguntas)
- **FP**: 2-10 pontos baseado em acertos
- **Limite**: 3 jogadas por dia

#### 🗺️ Caça ao Tesouro
- **Objetivo**: Raciocínio lógico e resolução de problemas
- **Mecânica**: Siga pistas para encontrar tesouros escondidos
- **Níveis**: Fácil (3 tesouros), Médio (5 tesouros), Difícil (7 tesouros)
- **FP**: 5-15 pontos baseado em velocidade
- **Limite**: 3 jogadas por dia

#### 📝 Diário Diário
- **Objetivo**: Expressão emocional e escrita criativa
- **Mecânica**: Escreva sobre um tema diário
- **Temas**: Gratidão, sonhos, conquistas, emoções
- **FP**: 5-10 pontos baseado em palavras escritas
- **Limite**: 1 entrada por dia

### 3. Sistema de Recompensas

#### 🏦 Cofrinho Digital
- Guarde FP e receba rendimento mensal (5%)
- Visualize crescimento da poupança
- Aprenda sobre investimento de forma prática

#### 🛒 Loja de Itens
- **Painéis Decorativos**: Personalize sua interface (50-200 FP)
- **Skins**: Mude a aparência do mascote (100-300 FP)
- **Acessórios**: Itens especiais para o avatar (50-150 FP)
- **Recompensas Reais**: Aprovadas pelos pais (variável)

### 4. Sistema de Conquistas

**20+ Badges disponíveis**, incluindo:
- 🏆 Primeiro Passo (completar primeiro módulo)
- 🎮 Gamer Iniciante (jogar primeiro mini-game)
- 💰 Poupador (fazer primeiro depósito no cofrinho)
- 🔥 Streak de 3 dias
- 🎯 Mestre da Memória (100% no jogo da memória)
- 📚 Sábio (acertar todas no quiz)
- 🗺️ Explorador (encontrar todos os tesouros)
- ✍️ Escritor (completar 7 entradas no diário)

---

## 👨‍👩‍👧 ÁREA DOS PAIS

### Funcionalidades:
- ✅ Visão geral de todas as crianças
- ✅ Estatísticas de progresso
- ✅ Explicação detalhada de cada módulo
- ✅ Dicas para pais
- ✅ Quando buscar ajuda profissional
- ✅ Recursos de apoio (Disque 100, etc.)

### Acesso:
http://localhost:3000/pais.html

---

## 🔒 SEGURANÇA E PRIVACIDADE

### Conformidade:
- ✅ ECA (Estatuto da Criança e do Adolescente)
- ✅ LGPD (Lei Geral de Proteção de Dados)
- ✅ Linguagem apropriada para 4-10 anos
- ✅ Nunca traumatiza
- ✅ Sempre empodera

### Dados:
- Armazenados localmente em SQLite
- Senhas com hash bcrypt
- JWT para autenticação
- Dados de família isolados

**Este sistema NÃO substitui profissionais ou autoridades.**

---

## 🛠️ COMANDOS DISPONÍVEIS

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npm run setup

# Iniciar servidor (produção)
npm start

# Iniciar servidor (desenvolvimento com auto-reload)
npm run dev
```

---

## 📊 BANCO DE DADOS

### Tabelas Principais:
- `families` - Famílias (pais/responsáveis)
- `children` - Crianças
- `mascot` - Mascote de cada criança
- `modules` - Módulos disponíveis
- `child_module_progress` - Progresso nos módulos
- `activities_completed` - Atividades completadas
- `emotional_checkins` - Check-ins emocionais
- `trust_circle` - Círculo de confiança

### Backup:
O arquivo `server/database/ekids.db` contém todos os dados.
Para backup, copie este arquivo regularmente.

---

## 🧪 TESTANDO O MVP

### Cenário de Teste Completo:

1. **Criar conta de pai/responsável**
2. **Criar 2 perfis de crianças** (avatares diferentes)
3. **Selecionar primeira criança**
4. **Completar módulo "Meu Jeito, Meus Limites"**
5. **Completar módulo "Cuidando de Mim"**
6. **Fazer check-in emocional**
7. **Voltar e acessar Área dos Pais**
8. **Verificar estatísticas e progresso**
9. **Ler orientações para pais**
10. **Testar com segunda criança**

---

## 🚀 DEPLOY EM PRODUÇÃO

Para fazer deploy do E-Kids PRO em produção, consulte o guia completo:

📖 **[README_DEPLOY.md](README_DEPLOY.md)** - Guia completo de deploy

### Deploy Rápido (Railway - Recomendado)

1. Acesse: https://railway.app
2. Conecte seu repositório GitHub
3. Configure variáveis de ambiente:
   - `NODE_ENV`: production
   - `JWT_SECRET`: seu-secret-muito-seguro
   - `PORT`: 3000
4. Deploy automático ao push!

### Scripts de Deploy Disponíveis

```bash
# Windows (PowerShell)
.\deploy.ps1

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

### Arquivos de Configuração

- ✅ `.env.example` - Template de variáveis de ambiente
- ✅ `.gitignore` - Arquivos ignorados pelo Git
- ✅ `vercel.json` - Configuração para Vercel
- ✅ `Procfile` - Configuração para Heroku
- ✅ `deploy.sh` - Script de deploy para Linux/Mac
- ✅ `deploy.ps1` - Script de deploy para Windows

---

## 📱 PRÓXIMOS PASSOS (Futuras Features)

### Em desenvolvimento:
- [ ] Modo multiplayer (competição entre irmãos)
- [ ] Mais mini-games (quebra-cabeças, labirintos)
- [ ] Notificações push para pais
- [ ] Relatórios semanais por email
- [ ] Integração com IA para diálogos adaptativos
- [ ] App mobile nativo (React Native)
- [ ] Modo offline
- [ ] Marketplace de recompensas expandido
- [ ] Sistema de metas de longo prazo
- [ ] Conquistas familiares

---

## ⚠️ IMPORTANTE PARA MÃES TESTADORAS

### Este MVP é uma ferramenta de APOIO, não substituto de:
- ❤️ Amor familiar
- 👀 Atenção parental
- 👨‍⚕️ Profissionais qualificados (psicólogos, pedagogos)
- 🚔 Autoridades competentes

### Se a criança mencionar algo preocupante:
1. **ACREDITE** e **APOIE**
2. Não pressione ou interrogue
3. Busque profissional qualificado
4. Entre em contato com recursos de apoio:
   - **Disque 100** (Disque Direitos Humanos)
   - **Conselho Tutelar** local
   - **Psicólogo infantil**

---

## 📞 RECURSOS DE APOIO

### Brasil:
- **Disque 100** - Disque Direitos Humanos (24h)
- **Conselho Tutelar** - Busque o mais próximo
- **CREAS** - Centro de Referência Especializado
- **Psicólogos Infantis** - Rede pública e privada

---

## 💙 MENSAGEM FINAL

**"E-Kids PRO ensina aquilo que a escola e os jogos não ensinam:**
**Limites, proteção emocional, autonomia e diálogo."**

Este MVP foi criado com máximo cuidado, responsabilidade ética e amor.

Obrigado por testar e ajudar a proteger nossas crianças! 🛡️

---

## 📝 LICENÇA

Proprietary - E-Kids PRO © 2025

---

## 🤝 FEEDBACK

Para feedback sobre o MVP, entre em contato com a equipe de desenvolvimento.

**Bons testes!** 🚀
