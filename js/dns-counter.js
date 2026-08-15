(function () {
  // Only run on the homepage.
  const path = window.location.pathname;
  if (path !== '/' && path !== '/index.html') return;

  const BACKEND_URL = window.backendURL || 'http://localhost:3000';
  const SUPABASE_URL = window.supabaseUrl || '';
  const SUPABASE_ANON_KEY = window.supabaseAnonKey || '';
  const CACHE_KEY = 'dns_counter_resetAt';
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

  // Fetch reset_at directly from Supabase — bypasses Render entirely, always available.
  async function fetchResetAt() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/dns_counter?select=reset_at&id=eq.1&limit=1`,
      { headers: { apikey: SUPABASE_ANON_KEY, Accept: 'application/json' } }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return rows[0]?.reset_at ?? null;
  }

  async function init() {
    // Show cached value immediately so something is visible while Supabase responds.
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) render(computeDays(cached));

    const [resetAtResult, authResult] = await Promise.allSettled([
      fetchResetAt(),
      fetch(`${BACKEND_URL}/auth/me`, { credentials: 'include' }),
    ]);

    if (resetAtResult.status === 'fulfilled' && resetAtResult.value) {
      const resetAt = resetAtResult.value;
      localStorage.setItem(CACHE_KEY, resetAt);
      render(computeDays(resetAt));

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
              localStorage.setItem(CACHE_KEY, updated.resetAt);
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
