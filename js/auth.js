// Authentication state management for Hugo site
(function() {
  const BACKEND_URL = window.backendURL || 'http://localhost:3000';
  const shouldCheckAuth = !BACKEND_URL.startsWith('/');

  async function checkAuthStatus() {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const user = await response.json();
        displayLoggedInUser(user);
      } else {
        displayLoginButton();
      }
    } catch (error) {
      console.warn('Could not check auth status:', error);
      displayLoginButton();
    }
  }

  function displayLoggedInUser(user) {
    const loginButton = document.getElementById('auth-login-button');
    const authContainer = document.getElementById('auth-container');

    if (!authContainer) return;

    if (loginButton) {
      loginButton.style.display = 'none';
    }

    let userInfo = document.getElementById('auth-user-info');
    if (!userInfo) {
      userInfo = document.createElement('div');
      userInfo.id = 'auth-user-info';
      userInfo.className = 'auth-user-info';
      authContainer.appendChild(userInfo);
    }

    userInfo.innerHTML = `
      <span class="auth-user-name">${user.displayName || user.email}</span>
      <a href="${BACKEND_URL}/auth/logout" class="auth-logout-button">Sign out</a>
    `;
  }

  function displayLoginButton() {
    const loginButton = document.getElementById('auth-login-button');
    const userInfo = document.getElementById('auth-user-info');

    if (loginButton) {
      loginButton.style.display = 'inline-block';
    }
    if (userInfo) {
      userInfo.remove();
    }
  }

  function initAuth() {
    if (shouldCheckAuth) {
      checkAuthStatus();
    } else {
      displayLoginButton();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }
})();
