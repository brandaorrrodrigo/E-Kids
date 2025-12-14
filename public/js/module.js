// E-KIDS PRO MVP - Gerenciador de Módulos

let currentChild = null;
let currentModule = null;

document.addEventListener('DOMContentLoaded', () => {
  // Carregar criança e módulo
  const childData = localStorage.getItem('current_child');
  const moduleData = localStorage.getItem('current_module');

  if (!childData || !moduleData) {
    window.location.href = '/';
    return;
  }

  currentChild = JSON.parse(childData);
  currentModule = JSON.parse(moduleData);

  // Atualizar header
  document.getElementById('module-title').textContent = currentModule.module_name;
  document.getElementById('total-fp').textContent = currentChild.total_fp;

  // Carregar conteúdo do módulo
  loadModuleContent();
});

// Carregar conteúdo específico do módulo
function loadModuleContent() {
  const content = document.getElementById('module-content');

  switch (currentModule.module_key) {
    case 'dizer_nao':
      content.innerHTML = getModuloDizerNao();
      break;
    case 'pedir_ajuda':
      content.innerHTML = getModuloPedirAjuda();
      break;
    case 'protecao_corpo':
      content.innerHTML = getModuloProtecaoCorpo();
      break;
    case 'emocoes':
      content.innerHTML = getModuloEmocoes();
      break;
    case 'desafios':
      content.innerHTML = getModuloDesafios();
      break;
    default:
      content.innerHTML = '<div class="activity-card"><h2>Módulo em desenvolvimento</h2></div>';
  }
}

// Completar atividade e ganhar FP
async function completeActivity(activityName, fpEarned) {
  try {
    const response = await fetch(`${API_URL}/api/activities/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        childId: currentChild.id,
        moduleKey: currentModule.module_key,
        activityName,
        fpEarned
      })
    });

    if (response.ok) {
      // Atualizar FP
      currentChild.total_fp += fpEarned;
      document.getElementById('total-fp').textContent = currentChild.total_fp;

      // Verificar se este módulo é a missão do dia
      const today = new Date().toDateString();
      const savedMission = localStorage.getItem(`daily_mission_${currentChild.id}_${today}`);

      if (savedMission) {
        const dailyMission = JSON.parse(savedMission);

        // Se o módulo atual é a missão do dia, marcar como completa
        if (dailyMission.type === 'module' && dailyMission.moduleKey === currentModule.module_key) {
          localStorage.setItem(`mission_completed_${currentChild.id}_${today}`, 'true');

          // Feedback especial para missão do dia
          showFeedback(`🎯 Missão do dia completa! Você ganhou ${fpEarned} FP! ⭐`, 'success');
        } else {
          // Feedback normal
          showFeedback(`Muito bem! Você ganhou ${fpEarned} FP! ⭐`, 'success');
        }
      } else {
        // Feedback normal
        showFeedback(`Muito bem! Você ganhou ${fpEarned} FP! ⭐`, 'success');
      }

      // Atualizar localStorage
      localStorage.setItem('current_child', JSON.stringify(currentChild));
    }
  } catch (error) {
    console.error('Erro ao completar atividade:', error);
  }
}

// Mostrar feedback
function showFeedback(message, type = 'success') {
  const mascotBubble = document.getElementById('mascot-bubble');
  mascotBubble.querySelector('p').textContent = message;
  mascotBubble.classList.add('show');

  setTimeout(() => {
    mascotBubble.classList.remove('show');
  }, 5000);
}

// Toggle mascote helper
function toggleMascot() {
  const bubble = document.getElementById('mascot-bubble');
  bubble.classList.toggle('show');
}

// Voltar
function goBack() {
  window.location.href = '/crianca.html';
}
