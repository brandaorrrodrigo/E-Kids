// E-KIDS PRO - Interface Infantil com Navegação
const API_URL = window.location.origin;

// Constante para ícone da moeda FP
const FP_ICON = '<img src="/images/moedafp1.png" alt="FP" style="width: 20px; height: 20px; object-fit: contain; display: inline-block; vertical-align: middle;" />';
const FP_ICON_LARGE = '<img src="/images/moedafp1.png" alt="FP" style="width: 32px; height: 32px; object-fit: contain; display: inline-block; vertical-align: middle;" />';

// Estado global
let currentChild = null;
let currentModule = null;
let currentModuleData = null;

// ============================================
// SISTEMA DE NAVEGAÇÃO
// ============================================

const SCREENS = [
  'screen_home',
  'screen_map',
  'screen_missions',
  'screen_store',
  'screen_module',
  'screen_badges',
  'screen_savings',
  'screen_profile'
];

function showScreen(screenId) {
  // Esconder todas as screens
  SCREENS.forEach(id => {
    const screen = document.getElementById(id);
    if (screen) {
      screen.classList.remove('active');
    }
  });

  // Mostrar screen solicitada
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
    window.scrollTo(0, 0);

    // Atualizar navbar
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.screen === screenId) {
        btn.classList.add('active');
      }
    });

    // Salvar última screen
    localStorage.setItem('ekids_last_screen', screenId);

    // Carregar dados específicos da screen
    loadScreenData(screenId);
  }
}

function loadScreenData(screenId) {
  switch(screenId) {
    case 'screen_home':
      loadHomeData();
      break;
    case 'screen_map':
      loadMap();
      break;
    case 'screen_missions':
      loadMissions();
      break;
    case 'screen_store':
      loadStore();
      break;
    case 'screen_badges':
      loadBadges();
      break;
    case 'screen_savings':
      loadSavings();
      break;
    case 'screen_profile':
      loadProfile();
      break;
  }
}

// ============================================
// INICIALIZAÇÃO E AUTENTICAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  // Configurar navbar
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showScreen(btn.dataset.screen);
    });
  });

  // Verificar autenticação e carregar perfil
  await initializeChildInterface();
});

async function initializeChildInterface() {
  // Verificar se tem token de autenticação
  const token = localStorage.getItem('ekids_token');

  if (!token) {
    // Não autenticado - redirecionar para login
    window.location.href = '/';
    return;
  }

  // Verificar se já tem criança selecionada
  const selectedChildId = localStorage.getItem('ekids_selected_child_id');

  if (selectedChildId) {
    // Carregar perfil da criança do backend
    await loadChildProfile(parseInt(selectedChildId));
  } else {
    // Buscar lista de crianças da família
    await loadChildrenList();
  }
}

async function loadChildrenList() {
  try {
    const res = await fetch(`${API_URL}/api/children`, {
      headers: getAuthHeaders()
    });

    const data = await res.json();

    if (data.success && data.children.length > 0) {
      if (data.children.length === 1) {
        // Apenas 1 criança - selecionar automaticamente
        await loadChildProfile(data.children[0].id);
      } else {
        // Múltiplas crianças - mostrar seletor
        showChildSelector(data.children);
      }
    } else {
      // Sem crianças - mostrar tela de criação
      showScreen('screen_profile');
    }
  } catch (error) {
    console.error('Erro ao carregar crianças:', error);
    // Fallback: mostrar tela de criação
    showScreen('screen_profile');
  }
}

function showChildSelector(children) {
  const profileContainer = document.getElementById('profile-container');
  if (!profileContainer) return;

  profileContainer.innerHTML = `
    <div class="child-selector">
      <h2>Quem está jogando?</h2>
      <p>Escolha seu perfil para começar!</p>
      <div class="children-grid">
        ${children.map(child => `
          <div class="child-selector-card" onclick="selectChild(${child.id})">
            <div class="child-avatar">${child.avatar || '😊'}</div>
            <h3>${child.name}</h3>
            <p>${child.age} anos</p>
            <p class="child-fp">${child.total_fp} FP ${FP_ICON}</p>
          </div>
        `).join('')}
      </div>
      <button class="btn-secondary" onclick="logout()" style="margin-top: 20px;">Sair</button>
    </div>
  `;

  showScreen('screen_profile');
}

async function selectChild(childId) {
  localStorage.setItem('ekids_selected_child_id', childId);
  await loadChildProfile(childId);
}

async function loadChildProfile(childId) {
  try {
    const res = await fetch(`${API_URL}/api/children/${childId}`, {
      headers: getAuthHeaders()
    });

    const data = await res.json();

    if (data.success && data.child) {
      currentChild = {
        id: data.child.id,
        name: data.child.name,
        age: data.child.age,
        avatar: data.child.avatar,
        total_fp: data.child.total_fp,
        mascot_name: data.child.mascot_name,
        mascot_level: data.child.mascot_level
      };

      updateHeaderInfo();

      // Restaurar última screen ou ir para home
      const lastScreen = localStorage.getItem('ekids_last_screen') || 'screen_home';
      showScreen(lastScreen);
    } else {
      console.error('Erro ao carregar perfil da criança');
      showScreen('screen_profile');
    }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    showScreen('screen_profile');
  }
}

function logout() {
  localStorage.removeItem('ekids_token');
  localStorage.removeItem('ekids_selected_child_id');
  localStorage.removeItem('ekids_last_screen');
  window.location.href = '/';
}

function switchChild() {
  // Limpar criança selecionada e recarregar para mostrar seletor
  localStorage.removeItem('ekids_selected_child_id');
  localStorage.removeItem('ekids_last_screen');
  window.location.reload();
}

function updateHeaderInfo() {
  if (currentChild) {
    document.getElementById('child-name').textContent = currentChild.name;
    document.getElementById('total-fp').textContent = currentChild.fp || 0;
    updateFPProgress(currentChild.fp || 0);
  }
}

// ============================================
// SCREEN: HOME
// ============================================

async function loadHomeData() {
  if (!currentChild) return;

  // Atualizar FP
  document.getElementById('total-fp-home').textContent = currentChild.total_fp || 0;

  // Atualizar nível do mascote
  if (currentChild.mascot_level) {
    document.getElementById('mascot-level-display').textContent = currentChild.mascot_level;
  }

  // Atualizar dias ativos
  const activeDays = parseInt(localStorage.getItem('ekids_active_days') || '0');
  document.getElementById('active-days-count').textContent = activeDays;

  // Registrar dia de hoje se não foi registrado
  const today = new Date().toDateString();
  const lastVisit = localStorage.getItem('ekids_last_visit');
  if (lastVisit !== today) {
    localStorage.setItem('ekids_last_visit', today);
    localStorage.setItem('ekids_active_days', (activeDays + 1).toString());
    document.getElementById('active-days-count').textContent = activeDays + 1;
  }

  // Atualizar mensagem do mascote
  await loadMascotMessage();
}

async function loadMascotMessage() {
  const messages = [
    'Oi! Vamos crescer juntos? 💙',
    'Você tá indo super bem! 🌟',
    'Cada tentativa é uma vitória! ⭐',
    'Estou aqui com você sempre! 😊',
    'Você é incrível do seu jeito! 🎈',
    'Vamos fazer algo legal hoje? 🚀',
    'Que bom te ver! 🤗'
  ];

  const messageEl = document.querySelector('#mascot-message p');
  if (messageEl) {
    messageEl.textContent = messages[Math.floor(Math.random() * messages.length)];
  }
}

async function doCheckin() {
  const today = new Date().toDateString();
  const lastCheckin = localStorage.getItem('ekids_last_checkin');

  if (lastCheckin === today) {
    showFPPopup('+0 FP', 'Você já fez check-in hoje! 💙');
    return;
  }

  // Registrar checkin
  localStorage.setItem('ekids_last_checkin', today);

  // Dar FP
  currentChild.fp = (currentChild.fp || 0) + 5;
  localStorage.setItem('ekids_child_profile', JSON.stringify(currentChild));
  updateHeaderInfo();

  showFPPopup('+5 FP', 'Check-in do dia completo! 💙');
}

// ============================================
// SCREEN: MISSÕES (INTEGRAÇÃO COM BACKEND)
// ============================================

let currentPhaseFilter = null;
let currentAreaFilter = null;

async function loadMissions() {
  if (!currentChild || !currentChild.id) return;

  try {
    // Buscar fases
    const phasesRes = await fetch(`${API_URL}/api/children/${currentChild.id}/phases`, {
      headers: getAuthHeaders()
    });
    const phasesData = await phasesRes.json();

    if (phasesData.success) {
      renderPhases(phasesData.phases);
    }

    // Buscar missões da fase atual (ou todas desbloqueadas)
    const unlockedPhases = phasesData.phases.filter(p => p.unlocked);
    if (unlockedPhases.length > 0) {
      // Buscar missões da primeira fase desbloqueada que não está completa
      const activePhase = unlockedPhases.find(p => p.progress < 100) || unlockedPhases[unlockedPhases.length - 1];
      currentPhaseFilter = activePhase.phase;
      await loadMissionsByPhase(activePhase.phase);
    }
  } catch (error) {
    console.error('Erro ao carregar missões:', error);
  }
}

function renderPhases(phases) {
  const phasesContainer = document.getElementById('phases-selector');
  if (!phasesContainer) return;

  phasesContainer.innerHTML = phases.map(p => `
    <button class="phase-btn ${p.unlocked ? 'unlocked' : 'locked'} ${currentPhaseFilter === p.phase ? 'active' : ''}"
            onclick="${p.unlocked ? `selectPhase(${p.phase})` : 'void(0)'}"
            ${!p.unlocked ? 'disabled' : ''}>
      <span class="phase-number">Fase ${p.phase}</span>
      <span class="phase-progress">${p.completedMissions}/${p.totalMissions}</span>
      ${!p.unlocked ? '<span class="lock-icon">🔒</span>' : ''}
    </button>
  `).join('');
}

async function selectPhase(phase) {
  currentPhaseFilter = phase;
  await loadMissionsByPhase(phase);
}

async function loadMissionsByPhase(phase) {
  if (!currentChild || !currentChild.id) return;

  try {
    const res = await fetch(`${API_URL}/api/children/${currentChild.id}/missions?phase=${phase}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();

    if (data.success) {
      renderMissions(data.missions);
    }
  } catch (error) {
    console.error('Erro ao carregar missões:', error);
  }
}

function renderMissions(missions) {
  const grid = document.getElementById('modules-grid');
  if (!grid) return;

  if (missions.length === 0) {
    grid.innerHTML = '<p class="no-missions">Nenhuma missão disponível nesta fase.</p>';
    return;
  }

  const areaIcons = {
    emotions: '💙',
    body: '💪',
    safety: '🛡️',
    creativity: '🎨',
    languages: '🌍'
  };

  grid.innerHTML = missions.map(mission => `
    <div class="module-card ${mission.completed ? 'completed' : ''}"
         onclick="${!mission.completed ? `openMission(${mission.id})` : 'void(0)'}">
      <div class="module-icon">${areaIcons[mission.area] || '⭐'}</div>
      <h3 class="module-name">${mission.title}</h3>
      <p class="module-desc">${mission.description}</p>
      <div class="module-fp">+${mission.fp_reward} FP ${FP_ICON}</div>
      ${mission.completed
        ? '<span class="completed-badge">✓ Completo</span>'
        : '<button class="btn-module">Começar!</button>'}
    </div>
  `).join('');
}

let currentMissionData = null;

async function openMission(missionId) {
  try {
    // Buscar dados da missão
    const res = await fetch(`${API_URL}/api/children/${currentChild.id}/missions?phase=${currentPhaseFilter}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();

    if (data.success) {
      const mission = data.missions.find(m => m.id === missionId);
      if (!mission) return;

      currentMissionData = mission;

      // Atualizar UI do módulo
      const areaIcons = {
        emotions: '💙',
        body: '💪',
        safety: '🛡️',
        creativity: '🎨',
        languages: '🌍'
      };

      document.getElementById('module-icon').textContent = areaIcons[mission.area] || '⭐';
      document.getElementById('module-title').textContent = mission.title;
      document.getElementById('module-story').innerHTML = `<p>${mission.prompt}</p>`;

      // Mostrar história, esconder pergunta e feedback
      document.getElementById('module-question-section').style.display = 'none';
      document.getElementById('module-feedback').style.display = 'none';

      // Após 3 segundos, mostrar pergunta
      setTimeout(() => {
        showMissionQuestion();
      }, 3000);

      // Ir para screen do módulo
      showScreen('screen_module');
    }
  } catch (error) {
    console.error('Erro ao abrir missão:', error);
  }
}

function showMissionQuestion() {
  if (!currentMissionData) return;

  const questionSection = document.getElementById('module-question-section');
  const questionText = document.getElementById('module-question-text');
  const choicesGrid = document.getElementById('choices-grid');

  questionText.textContent = 'Escolha sua resposta:';

  const choices = [
    { key: 'A', text: currentMissionData.optionA },
    { key: 'B', text: currentMissionData.optionB },
    { key: 'C', text: currentMissionData.optionC }
  ];

  choicesGrid.innerHTML = choices.map(choice => `
    <button class="choice-btn" onclick="selectMissionChoice('${choice.key}')">
      ${choice.text}
    </button>
  `).join('');

  questionSection.style.display = 'block';
}

let selectedChoice = null;

function selectMissionChoice(choiceKey) {
  if (!currentMissionData) return;

  selectedChoice = choiceKey;

  const feedbackMap = {
    A: currentMissionData.feedbackA,
    B: currentMissionData.feedbackB,
    C: currentMissionData.feedbackC
  };

  const feedback = feedbackMap[choiceKey];

  // Esconder pergunta
  document.getElementById('module-question-section').style.display = 'none';

  // Mostrar feedback
  const feedbackSection = document.getElementById('module-feedback');
  const feedbackText = document.getElementById('feedback-text');

  feedbackText.textContent = feedback;
  feedbackSection.style.display = 'block';
}

async function completeModule() {
  if (!currentMissionData || !currentChild || !selectedChoice) return;

  try {
    // Completar missão no backend
    const res = await fetch(`${API_URL}/api/children/${currentChild.id}/missions/${currentMissionData.id}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ choice: selectedChoice })
    });

    const data = await res.json();

    if (data.success) {
      // Atualizar FP
      currentChild.total_fp = (currentChild.total_fp || 0) + data.fpEarned;
      updateHeaderInfo();

      // Mostrar popup de FP
      showFPPopup(`+${data.fpEarned} FP`, `Você completou: ${currentMissionData.title}! 🌟`);

      // Se desbloqueou nova fase, mostrar mensagem
      if (data.unlockedNewPhase) {
        setTimeout(() => {
          alert('🎉 Parabéns! Você desbloqueou uma nova fase! Continue explorando!');
        }, 2000);
      }

      // Voltar para missões após 2 segundos
      setTimeout(() => {
        selectedChoice = null;
        currentMissionData = null;
        showScreen('screen_missions');
      }, 3000);
    } else {
      alert(data.error || 'Erro ao completar missão');
    }
  } catch (error) {
    console.error('Erro ao completar missão:', error);
    alert('Erro ao completar missão');
  }
}

// ============================================
// SCREEN: MAPA DO MUNDO
// ============================================

async function loadMap() {
  if (!currentChild || !currentChild.id) return;

  try {
    // Buscar status das fases
    const phasesRes = await fetch(`${API_URL}/api/children/${currentChild.id}/phases`, {
      headers: getAuthHeaders()
    });
    const phasesData = await phasesRes.json();

    if (phasesData.success) {
      renderPhasesOnMap(phasesData.phases);
    }

    // Buscar dados do mapa (áreas)
    const mapRes = await fetch(`${API_URL}/api/children/${currentChild.id}/map`, {
      headers: getAuthHeaders()
    });
    const mapData = await mapRes.json();

    if (mapData.success) {
      renderMapAreas(mapData.map);
    }
  } catch (error) {
    console.error('Erro ao carregar mapa:', error);
  }
}

function renderPhasesOnMap(phases) {
  const phasesContainer = document.getElementById('phases-selector');
  if (!phasesContainer) return;

  phasesContainer.innerHTML = `
    <h3>🎯 Seu Progresso</h3>
    <div class="phases-progress">
      ${phases.map(p => `
        <div class="phase-card ${p.unlocked ? 'unlocked' : 'locked'}">
          <h4>Fase ${p.phase} ${!p.unlocked ? '🔒' : ''}</h4>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${p.progress}%"></div>
          </div>
          <p>${p.completedMissions}/${p.totalMissions} missões</p>
        </div>
      `).join('')}
    </div>
  `;
}

function renderMapAreas(mapData) {
  const areasContainer = document.getElementById('map-areas');
  if (!areasContainer) return;

  const areaNames = {
    emotions: 'Emoções',
    body: 'Corpo & Movimento',
    safety: 'Segurança',
    creativity: 'Criatividade',
    languages: 'Idiomas'
  };

  const areaIcons = {
    emotions: '💙',
    body: '💪',
    safety: '🛡️',
    creativity: '🎨',
    languages: '🌍'
  };

  areasContainer.innerHTML = `
    <h3>🌍 Áreas de Exploração</h3>
    <div class="areas-grid">
      ${mapData.map(area => `
        <div class="area-card" onclick="exploreArea('${area.area}')">
          <div class="area-icon">${areaIcons[area.area]}</div>
          <h4>${areaNames[area.area]}</h4>
          <div class="area-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${area.progress}%"></div>
            </div>
            <p>${area.completedMissions}/${area.totalMissions} concluídas</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function exploreArea(areaKey) {
  currentAreaFilter = areaKey;
  showScreen('screen_missions');
}

// ============================================
// SCREEN: LOJA FP
// ============================================

let allStoreItems = [];

async function loadStore() {
  if (!currentChild || !currentChild.id) return;

  try {
    // Atualizar saldo
    document.getElementById('store-fp-balance').textContent = currentChild.total_fp || 0;

    // Buscar itens da loja
    const storeRes = await fetch(`${API_URL}/api/store/items`);
    const storeData = await storeRes.json();

    if (storeData.success) {
      allStoreItems = storeData.items;
      renderStoreItems(allStoreItems);
    }

    // Buscar inventário
    const invRes = await fetch(`${API_URL}/api/children/${currentChild.id}/inventory`, {
      headers: getAuthHeaders()
    });
    const invData = await invRes.json();

    if (invData.success) {
      renderInventory(invData.inventory);
    }
  } catch (error) {
    console.error('Erro ao carregar loja:', error);
  }
}

function filterStoreByType(type) {
  // Atualizar tabs
  document.querySelectorAll('.store-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');

  // Filtrar itens
  const filtered = type === 'all' ? allStoreItems : allStoreItems.filter(item => {
    if (type === 'panel') return item.type === 'panel';
    if (type === 'skin') return item.type === 'skin';
    if (type === 'accessory') return item.type.includes('accessory') || item.type.includes('hat') || item.type.includes('aura');
    return false;
  });

  renderStoreItems(filtered);
}

function renderStoreItems(items) {
  const grid = document.getElementById('store-items-grid');
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = '<p>Nenhum item disponível nesta categoria.</p>';
    return;
  }

  grid.innerHTML = items.map(item => `
    <div class="store-item-card">
      <div class="item-name">${item.name}</div>
      <div class="item-description">${item.description}</div>
      <div class="item-cost">${item.cost_fp} FP ${FP_ICON}</div>
      <button class="btn-buy" onclick="buyStoreItem(${item.id}, ${item.cost_fp})">Comprar</button>
    </div>
  `).join('');
}

async function buyStoreItem(itemId, cost) {
  if (!currentChild || !currentChild.id) return;

  if ((currentChild.total_fp || 0) < cost) {
    alert('Você não tem FP suficiente!');
    return;
  }

  if (!confirm(`Deseja comprar este item por ${cost} FP?`)) {
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/store/buy`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ childId: currentChild.id, itemId })
    });

    const data = await res.json();

    if (data.success) {
      currentChild.total_fp = data.newFP;
      updateHeaderInfo();
      showFPPopup(`-${cost} FP`, 'Item comprado com sucesso! 🛒');

      // Recarregar loja
      setTimeout(() => loadStore(), 1000);
    } else {
      alert(data.error || 'Erro ao comprar item');
    }
  } catch (error) {
    console.error('Erro ao comprar item:', error);
    alert('Erro ao comprar item');
  }
}

function renderInventory(inventory) {
  const grid = document.getElementById('inventory-grid');
  if (!grid) return;

  if (inventory.length === 0) {
    grid.innerHTML = '<p>Seu inventário está vazio. Compre itens na loja!</p>';
    return;
  }

  grid.innerHTML = inventory.map(item => `
    <div class="inventory-item-card ${item.equipped ? 'equipped' : ''}">
      <div class="item-name">${item.name}</div>
      <div class="item-type">${item.type}</div>
      ${item.equipped
        ? '<span class="equipped-badge">✓ Equipado</span>'
        : `<button class="btn-equip" onclick="equipItem(${item.item_id})">Equipar</button>`}
    </div>
  `).join('');
}

async function equipItem(itemId) {
  if (!currentChild || !currentChild.id) return;

  try {
    const res = await fetch(`${API_URL}/api/store/equip`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ childId: currentChild.id, itemId })
    });

    const data = await res.json();

    if (data.success) {
      showFPPopup('', 'Item equipado! ✨');
      setTimeout(() => loadStore(), 500);
    } else {
      alert(data.error || 'Erro ao equipar item');
    }
  } catch (error) {
    console.error('Erro ao equipar item:', error);
    alert('Erro ao equipar item');
  }
}

// ============================================
// SCREEN: BADGES
// ============================================

async function loadBadges() {
  if (!currentChild || !currentChild.id) return;

  try {
    const res = await fetch(`${API_URL}/api/children/${currentChild.id}/badges`, {
      headers: getAuthHeaders()
    });

    const data = await res.json();

    const grid = document.getElementById('badges-grid');
    const noBadgesText = document.getElementById('no-badges-text');

    if (data.badges && data.badges.length > 0) {
      noBadgesText.style.display = 'none';

      // Agrupar badges por categoria
      const badgesByCategory = {};
      data.badges.forEach(badge => {
        const category = badge.category || 'other';
        if (!badgesByCategory[category]) {
          badgesByCategory[category] = [];
        }
        badgesByCategory[category].push(badge);
      });

      let html = '';
      for (const [category, badges] of Object.entries(badgesByCategory)) {
        const categoryNames = {
          progress: '📈 Progressão',
          area: '🗺️ Áreas',
          economy: '💰 Economia',
          mascot: '🦊 Mascote',
          shop: '🛒 Loja',
          phase: '🎯 Fases',
          other: '⭐ Outras'
        };

        html += `
          <div class="badge-category">
            <h3 class="badge-category-title">${categoryNames[category] || category}</h3>
            <div class="badges-grid-category">
              ${badges.map(badge => `
                <div class="badge-item ${badge.is_new === 1 ? 'badge-new' : ''}">
                  <span class="badge-icon">${badge.icon || '🏆'}</span>
                  ${badge.is_new === 1 ? '<span class="new-indicator">NOVO!</span>' : ''}
                  <div class="badge-name">${badge.badge_name}</div>
                  <div class="badge-description">${badge.description}</div>
                  <div class="badge-date">${new Date(badge.earned_at).toLocaleDateString('pt-BR')}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      grid.innerHTML = html;

      // Marcar badges como vistos
      if (data.newBadges > 0) {
        setTimeout(async () => {
          await fetch(`${API_URL}/api/children/${currentChild.id}/badges/mark-seen`, {
            method: 'POST',
            headers: getAuthHeaders()
          });
        }, 3000);
      }
    } else {
      noBadgesText.style.display = 'block';
      grid.innerHTML = '';
    }
  } catch (error) {
    console.error('Erro ao carregar badges:', error);
  }
}

// ============================================
// SCREEN: COFRINHO
// ============================================

async function loadSavings() {
  if (!currentChild) return;

  const saved = currentChild.fpSaved || 0;
  document.getElementById('cofrinho-saved').textContent = `${saved} FP`;

  // Atualizar modais
  document.getElementById('current-fp-deposit').textContent = currentChild.fp || 0;
  document.getElementById('current-savings-withdraw').textContent = saved;
}

function openDepositModal() {
  document.getElementById('deposit-modal').style.display = 'flex';
  document.getElementById('current-fp-deposit').textContent = currentChild.fp || 0;
}

function closeDepositModal() {
  document.getElementById('deposit-modal').style.display = 'none';
  document.getElementById('deposit-amount').value = '';
}

async function depositFP() {
  const amount = parseInt(document.getElementById('deposit-amount').value);

  if (!amount || amount <= 0) {
    alert('Digite um valor válido!');
    return;
  }

  if (amount > (currentChild.fp || 0)) {
    alert('Você não tem FP suficiente!');
    return;
  }

  // Transferir FP
  currentChild.fp -= amount;
  currentChild.fpSaved = (currentChild.fpSaved || 0) + amount;

  localStorage.setItem('ekids_child_profile', JSON.stringify(currentChild));

  updateHeaderInfo();
  loadSavings();
  closeDepositModal();

  showFPPopup(`${amount} FP guardado!`, 'Seu cofrinho cresceu! 💵');
}

function openWithdrawModal() {
  document.getElementById('withdraw-modal').style.display = 'flex';
  document.getElementById('current-savings-withdraw').textContent = currentChild.fpSaved || 0;
}

function closeWithdrawModal() {
  document.getElementById('withdraw-modal').style.display = 'none';
  document.getElementById('withdraw-amount').value = '';
}

async function withdrawFP() {
  const amount = parseInt(document.getElementById('withdraw-amount').value);

  if (!amount || amount <= 0) {
    alert('Digite um valor válido!');
    return;
  }

  if (amount > (currentChild.fpSaved || 0)) {
    alert('Você não tem FP suficiente no cofrinho!');
    return;
  }

  // Transferir FP de volta
  currentChild.fpSaved -= amount;
  currentChild.fp = (currentChild.fp || 0) + amount;

  localStorage.setItem('ekids_child_profile', JSON.stringify(currentChild));

  updateHeaderInfo();
  loadSavings();
  closeWithdrawModal();

  showFPPopup(`${amount} FP retirado!`, 'Seu FP voltou para você! 💰');
}

async function claimYield() {
  showFPPopup('+0 FP', 'O rendimento vem no fim do mês! 💙');
}

// ============================================
// SCREEN: PERFIL
// ============================================

function loadProfile() {
  const createSection = document.getElementById('profile-create');
  const displaySection = document.getElementById('profile-display');

  if (currentChild) {
    // Mostrar perfil existente
    createSection.style.display = 'none';
    displaySection.style.display = 'block';

    document.getElementById('profile-avatar-display').textContent = currentChild.avatar || '😊';
    document.getElementById('profile-name-display').textContent = currentChild.name;
    document.getElementById('profile-age-display').textContent = `${currentChild.age} anos`;
    document.getElementById('profile-fp').textContent = currentChild.fp || 0;
    document.getElementById('profile-days').textContent = localStorage.getItem('ekids_active_days') || 0;

    // Contar badges
    const activities = currentChild.activitiesCompleted || 0;
    let badgeCount = 0;
    if (activities >= 1) badgeCount++;
    if (activities >= 5) badgeCount++;
    if ((currentChild.fp || 0) >= 100) badgeCount++;
    const activeDays = parseInt(localStorage.getItem('ekids_active_days') || '0');
    if (activeDays >= 3) badgeCount++;

    document.getElementById('profile-badges').textContent = badgeCount;
  } else {
    // Mostrar criação de perfil
    createSection.style.display = 'block';
    displaySection.style.display = 'none';
  }
}

function selectAvatar(emoji) {
  document.getElementById('selected-avatar').value = emoji;
  document.querySelectorAll('.avatar-btn').forEach(btn => {
    btn.classList.remove('selected');
    if (btn.dataset.avatar === emoji) {
      btn.classList.add('selected');
    }
  });
}

function createProfile() {
  const name = document.getElementById('profile-name').value.trim();
  const age = parseInt(document.getElementById('profile-age').value);
  const avatar = document.getElementById('selected-avatar').value;

  if (!name) {
    alert('Digite seu nome!');
    return;
  }

  if (!age || age < 6 || age > 12) {
    alert('Digite sua idade (6 a 12 anos)!');
    return;
  }

  // Criar perfil
  currentChild = {
    name,
    age,
    avatar,
    fp: 0,
    fpSaved: 0,
    activitiesCompleted: 0,
    createdAt: new Date().toISOString()
  };

  localStorage.setItem('ekids_child_profile', JSON.stringify(currentChild));
  updateHeaderInfo();

  showScreen('screen_home');
}

function resetProfile() {
  if (confirm('Tem certeza que quer trocar de perfil? Seus dados serão apagados.')) {
    localStorage.removeItem('ekids_child_profile');
    localStorage.removeItem('ekids_active_days');
    localStorage.removeItem('ekids_last_visit');
    localStorage.removeItem('ekids_last_checkin');
    currentChild = null;
    showScreen('screen_profile');
  }
}

// ============================================
// UTILIDADES
// ============================================

function showFPPopup(mainText, subText) {
  const popup = document.getElementById('fp-popup');
  const textEl = document.getElementById('fp-popup-text');

  textEl.innerHTML = `<strong>${mainText}</strong><br>${subText || ''}`;

  popup.style.display = 'flex';

  // Tocar som de moeda
  if (window.soundEffects) {
    window.soundEffects.playCoin();
  }

  setTimeout(() => {
    popup.style.display = 'none';
  }, 3000);
}

// ============================================
// CONTROLE DE SOM
// ============================================

function toggleSound() {
  if (window.soundEffects) {
    const enabled = window.soundEffects.toggle();
    const icon = document.getElementById('sound-icon');
    if (icon) {
      icon.textContent = enabled ? '🔊' : '🔇';
    }
    // Feedback sonoro se ativou
    if (enabled) {
      window.soundEffects.playClick();
    }
  }
}

// ============================================
// CELEBRAÇÃO COM MOEDAS CAINDO
// ============================================

function triggerCelebration() {
  // Tocar som de level up
  if (window.soundEffects) {
    window.soundEffects.playLevelUp();
  }

  // Criar container para moedas se não existir
  let container = document.getElementById('coins-celebration-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'coins-celebration-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 10000;
      overflow: hidden;
    `;
    document.body.appendChild(container);
  }

  // Criar múltiplas moedas caindo
  const numCoins = 15;
  for (let i = 0; i < numCoins; i++) {
    setTimeout(() => {
      createFallingCoin(container);
    }, i * 100);
  }
}

// ============================================
// PROGRESS BAR DE FP
// ============================================

function updateFPProgress(currentFP) {
  // Calcular progresso até o próximo milestone (cada 100 FP)
  const milestone = 100;
  const progress = (currentFP % milestone) / milestone * 100;

  // Atualizar barra de progresso
  const fpDisplay = document.querySelector('.fp-display');
  if (fpDisplay && fpDisplay.querySelector('::before')) {
    fpDisplay.style.setProperty('--fp-progress', `${progress}%`);
  }
}

function createFallingCoin(container) {
  const coin = document.createElement('img');
  coin.src = '/images/moedafp1.png';
  coin.className = 'falling-coin';

  // Posição inicial aleatória
  const startX = Math.random() * window.innerWidth;
  const rotation = Math.random() * 360;
  const duration = 2 + Math.random() * 2; // 2-4 segundos
  const delay = Math.random() * 0.5;

  coin.style.cssText = `
    position: absolute;
    width: 40px;
    height: 40px;
    left: ${startX}px;
    top: -50px;
    animation: fall ${duration}s ease-in ${delay}s forwards, spin ${duration}s linear infinite;
    pointer-events: auto;
    cursor: pointer;
    transition: transform 0.2s;
  `;

  // Efeito de hover
  coin.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.3)';
    this.style.filter = 'brightness(1.3) drop-shadow(0 0 10px #FFD700)';
    if (window.soundEffects) {
      window.soundEffects.playClick();
    }
  });

  coin.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.filter = '';
  });

  // Ao clicar na moeda
  coin.addEventListener('click', function() {
    if (window.soundEffects) {
      window.soundEffects.playCoin();
    }
    this.style.animation = 'collect 0.3s ease-out forwards';
    setTimeout(() => {
      this.remove();
    }, 300);
  });

  container.appendChild(coin);

  // Remover moeda após animação
  setTimeout(() => {
    if (coin.parentNode) {
      coin.remove();
    }
  }, (duration + delay) * 1000 + 500);
}

function getAuthHeaders() {
  const token = localStorage.getItem('ekids_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}
