// E-KIDS PRO MVP - Área dos Pais

// Constante para ícone da moeda FP
const FP_ICON = '<img src="/images/moedafp1.png" alt="FP" style="width: 20px; height: 20px; object-fit: contain; display: inline-block; vertical-align: middle;" />';

document.addEventListener('DOMContentLoaded', async () => {
  if (!checkAuth()) {
    window.location.href = '/';
    return;
  }

  await loadDashboard();
});

// Carregar dashboard dos pais
async function loadDashboard() {
  try {
    const response = await fetch(`${API_URL}/api/parents/dashboard`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();
    const { children, stats } = data;

    // Atualizar estatísticas
    document.getElementById('total-children').textContent = stats.total_children;
    document.getElementById('total-fp').textContent = stats.total_fp;
    document.getElementById('total-activities').textContent = stats.total_activities;

    // Renderizar progresso das crianças
    await renderChildrenProgress(children);
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
  }
}

// Renderizar progresso das crianças
async function renderChildrenProgress(children) {
  const container = document.getElementById('children-progress');
  container.innerHTML = '';

  if (children.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #7F8C8D;">Nenhuma criança cadastrada ainda.</p>';
    return;
  }

  for (const child of children) {
    // Buscar progresso detalhado
    const progressResponse = await fetch(`${API_URL}/api/children/${child.id}/progress`, {
      headers: getAuthHeaders()
    });
    const progressData = await progressResponse.json();
    const progress = progressData.progress;

    // Criar card
    const card = document.createElement('div');
    card.className = 'child-progress-card';

    const avatarEmoji = getAvatarEmoji(child.avatar);

    let progressHTML = '';
    progress.forEach(module => {
      progressHTML += `
        <div class="module-progress-item">
          <span class="module-name">${module.icon} ${module.module_name}</span>
          <span class="module-activities">${module.activities_completed || 0} atividades</span>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="child-progress-header">
        <div class="avatar">${avatarEmoji}</div>
        <div class="info">
          <h3>${child.name}</h3>
          <p>${FP_ICON} ${child.total_fp} FP | ${child.total_activities} atividades completadas</p>
        </div>
      </div>
      <div class="modules-progress">
        ${progressHTML}
      </div>
    `;

    container.appendChild(card);
  }
}

// Converter avatar para emoji
function getAvatarEmoji(avatar) {
  const avatars = {
    bear: '🐻',
    cat: '🐱',
    dog: '🐶',
    rabbit: '🐰',
    fox: '🦊',
    panda: '🐼',
    default: '🦊'
  };
  return avatars[avatar] || avatars.default;
}
