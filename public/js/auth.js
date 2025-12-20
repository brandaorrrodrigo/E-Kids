// E-KIDS PRO MVP - Autenticação

const API_URL = '';
let authToken = localStorage.getItem('ekids_token');

// Mostrar/ocultar tabs
function showTab(tab) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const tabs = document.querySelectorAll('.tab');

  tabs.forEach(t => t.classList.remove('active'));

  if (tab === 'login') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    tabs[0].classList.add('active');
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    tabs[1].classList.add('active');
  }
}

// Login
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      errorEl.textContent = data.error || 'Erro ao fazer login';
      return;
    }

    // Salvar token
    localStorage.setItem('ekids_token', data.token);
    localStorage.setItem('ekids_family', JSON.stringify(data.family));
    authToken = data.token;

    // Redirecionar
    window.location.href = '/';
  } catch (error) {
    console.error('Erro:', error);
    errorEl.textContent = 'Erro de conexão. Tente novamente.';
  }
});

// Registro
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const parentName = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const errorEl = document.getElementById('register-error');

  if (password.length < 6) {
    errorEl.textContent = 'Senha deve ter pelo menos 6 caracteres';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parentName, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      errorEl.textContent = data.error || 'Erro ao cadastrar';
      return;
    }

    // Salvar token
    localStorage.setItem('ekids_token', data.token);
    localStorage.setItem('ekids_family', JSON.stringify(data.family));
    authToken = data.token;

    // Redirecionar
    window.location.href = '/';
  } catch (error) {
    console.error('Erro:', error);
    errorEl.textContent = 'Erro de conexão. Tente novamente.';
  }
});

// Logout
function logout() {
  localStorage.removeItem('ekids_token');
  localStorage.removeItem('ekids_family');
  localStorage.removeItem('current_child');
  authToken = null;
  window.location.href = '/';
}

// Verificar autenticação
function checkAuth() {
  return !!authToken;
}

// Header para requisições autenticadas
function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  };
}

// ============================================
// RECUPERAÇÃO DE SENHA
// ============================================

// Mostrar modal de recuperação de senha
function showForgotPassword() {
  const modal = document.getElementById('forgot-password-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.getElementById('forgot-email').value = '';
    document.getElementById('forgot-error').textContent = '';
    document.getElementById('forgot-success').style.display = 'none';
  }
}

// Esconder modal de recuperação de senha
function hideForgotPassword() {
  const modal = document.getElementById('forgot-password-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Processar formulário de recuperação de senha
document.getElementById('forgot-password-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('forgot-email').value;
  const errorEl = document.getElementById('forgot-error');
  const successEl = document.getElementById('forgot-success');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  // Limpar mensagens anteriores
  errorEl.textContent = '';
  successEl.style.display = 'none';

  // Desabilitar botão durante o envio
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  try {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      errorEl.textContent = data.error || 'Erro ao enviar email';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Link';
      return;
    }

    // Mostrar mensagem de sucesso
    successEl.textContent = data.message || 'Link de recuperação enviado! Verifique seu email.';
    successEl.style.display = 'block';

    // Fechar modal após 3 segundos
    setTimeout(() => {
      hideForgotPassword();
    }, 3000);

  } catch (error) {
    console.error('Erro:', error);
    errorEl.textContent = 'Erro de conexão. Tente novamente.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar Link';
  }
});
