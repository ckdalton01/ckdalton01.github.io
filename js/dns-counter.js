(function () {
  // Only run on the homepage.
  const path = window.location.pathname;
  if (path !== '/' && path !== '/index.html') return;

  const BACKEND_URL = window.backendURL || 'http://localhost:3000';
  const widget = document.getElementById('dns-counter-widget');
  const numberEl = document.getElementById('dns-counter-number');
  const resetBtn = document.getElementById('dns-counter-reset');
  if (!widget || !numberEl || !resetBtn) return;

  function computeDays(resetAt) {
    const ms = Date.now() - new Date(resetAt).getTime();
    return Math.max(0, Math.floor(ms / 86400000));
  }

  function render(days) {
    numberEl.textContent = days;
    widget.style.display = '';
  }

  async function init() {
    const [counterResult, authResult] = await Promise.allSettled([
      fetch(`${BACKEND_URL}/api/dns-counter`),
      fetch(`${BACKEND_URL}/auth/me`, { credentials: 'include' }),
    ]);

    if (counterResult.status === 'fulfilled' && counterResult.value.ok) {
      const data = await counterResult.value.json();
      render(computeDays(data.resetAt));

      if (authResult.status === 'fulfilled' && authResult.value.ok) {
        resetBtn.style.display = '';
        resetBtn.addEventListener('click', async () => {
          resetBtn.disabled = true;
          resetBtn.textContent = '…';
          try {
            const res = await fetch(`${BACKEND_URL}/api/dns-counter/reset`, {
              method: 'POST',
              credentials: 'include',
            });
            if (res.ok) {
              const updated = await res.json();
              render(computeDays(updated.resetAt));
            } else if (res.status === 401) {
              resetBtn.textContent = 'Sign in to reset';
            } else {
              resetBtn.textContent = 'Error';
            }
          } catch {
            resetBtn.textContent = 'Error';
          } finally {
            // Re-enable after a short delay so the button is not click-spammed.
            setTimeout(() => {
              resetBtn.disabled = false;
              resetBtn.textContent = 'Reset';
            }, 2000);
          }
        });
      }
    }
  }

  init().catch(function (err) {
    console.warn('dns-counter init failed:', err);
  });
})();
