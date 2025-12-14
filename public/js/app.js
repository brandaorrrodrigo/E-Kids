// E-KIDS PRO MVP - App Principal

document.addEventListener('DOMContentLoaded', async () => {
  const loading = document.getElementById('loading');
  const authScreen = document.getElementById('auth-screen');
  const profileSelectScreen = document.getElementById('profile-select-screen');

  // Verificar se está autenticado
  if (!checkAuth()) {
    loading.style.display = 'none';
    authScreen.style.display = 'block';
    return;
  }

  // Carregar perfis das crianças
  try {
    const response = await fetch(`${API_URL}/api/children`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar perfis');
    }

    const data = await response.json();
    const children = data.children;

    loading.style.display = 'none';
    profileSelectScreen.style.display = 'block';

    // Renderizar crianças
    renderChildren(children);
  } catch (error) {
    console.error('Erro:', error);
    // Se erro de autenticação, fazer logout
    if (error.message.includes('401')) {
      logout();
    }
  }
});

// Renderizar lista de crianças
function renderChildren(children) {
  const container = document.getElementById('children-list');
  container.innerHTML = '';

  if (children.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #7F8C8D;">Nenhuma criança cadastrada ainda. Clique em "Adicionar Criança" para começar!</p>';
    return;
  }

  children.forEach(child => {
    const card = document.createElement('div');
    card.className = 'child-card';
    card.onclick = () => selectChild(child);

    const avatarEmoji = getAvatarEmoji(child.avatar);

    card.innerHTML = `
      <div class="child-avatar">${avatarEmoji}</div>
      <h3>${child.name}</h3>
      <p>Nível do Mascote: ${child.mascot_level || 1}</p>
      <div class="fp-badge">⭐ ${child.total_fp} FP</div>
    `;

    container.appendChild(card);
  });
}

// Selecionar criança
function selectChild(child) {
  localStorage.setItem('current_child', JSON.stringify(child));
  window.location.href = '/crianca.html';
}

// Mostrar modal de criar criança
function showCreateChild() {
  document.getElementById('create-child-modal').style.display = 'flex';
}

// Esconder modal
function hideCreateChild() {
  document.getElementById('create-child-modal').style.display = 'none';
  document.getElementById('create-child-form').reset();
}

// Criar criança
document.getElementById('create-child-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('child-name').value;
  const age = document.getElementById('child-age').value;
  const avatar = document.querySelector('input[name="avatar"]:checked')?.value || 'fox';

  try {
    const response = await fetch(`${API_URL}/api/children`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, age: parseInt(age) || null, avatar })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'Erro ao criar perfil');
      return;
    }

    // Recarregar página
    window.location.reload();
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro de conexão. Tente novamente.');
  }
});

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

// Voltar para home
function goHome() {
  window.location.href = '/';
}
