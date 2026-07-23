(function() {
  // Theme Management
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  function toggleTheme() {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  }

  function updateThemeIcon(theme) {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;
    if (theme === 'dark') {
      themeBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
        </svg>
      `;
    } else {
      themeBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
      `;
    }
  }

  // Helper to compute SHA-256 hash in browser
  async function computeSha256(text) {
    const msgUint8 = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Optional Password Protection Gate (SHA-256 Hash & Obfuscated srgz Key Protected)
  function checkPasswordProtection() {
    const siteConfig = window.not || window.siteConfig || {};
    let rawTarget = String(siteConfig.srgz || siteConfig.systemToken || siteConfig.sitePasswordHash || siteConfig.sitePassword || '').trim();

    if (!rawTarget) return; // Disabled if no key is configured

    if (rawTarget.startsWith('*')) {
      rawTarget = rawTarget.substring(1).trim();
    }

    // Exempt Büyükçekmece Siteleri & Public Portal from password protection
    const currentPath = window.location.pathname.toLowerCase();
    if (currentPath.includes('buyukcekmecebilgiislem') || currentPath.includes('bcekmecesiteleri') || currentPath.includes('bcekmece-siteleri')) {
      return;
    }

    const isAuth = sessionStorage.getItem('site_authenticated') === 'true';
    if (isAuth) return; // User is authenticated for this session

    // Create Password Protection Overlay
    const overlay = document.createElement('div');
    overlay.id = 'login-gate-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;

    overlay.innerHTML = `
      <div style="
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-xl);
        padding: 32px 28px;
        max-width: 400px;
        width: 100%;
        box-shadow: var(--shadow-lg);
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 20px;
      ">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
          <div style="
            width: 56px; height: 56px; border-radius: 16px;
            background: var(--primary-light); color: var(--primary);
            display: flex; align-items: center; justify-content: center;
            border: 1px solid var(--primary-border);
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin: 0;">
            Büyükçekmece Bilgi İşlem
          </h2>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0; line-height: 1.4;">
            Sisteme erişmek için lütfen giriş şifrenizi girin.
          </p>
        </div>

        <form id="login-gate-form" style="display: flex; flex-direction: column; gap: 14px;">
          <div style="position: relative;">
            <input type="password" id="login-gate-pass" class="input-control" placeholder="Giriş Şifresi..." required autofocus style="padding-left: 40px;" />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-tertiary);">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>

          <div id="login-gate-error" style="display:none; color: var(--danger); font-size: 0.82rem; font-weight: 600;">
            Hatalı şifre! Lütfen tekrar deneyin.
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; height: 46px; font-size: 0.95rem;">
            Giriş Yap
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    const form = document.getElementById('login-gate-form');
    const input = document.getElementById('login-gate-pass');
    const errorEl = document.getElementById('login-gate-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = input.value.trim();
      const valHash = await computeSha256(val);

      let targetKey = String(siteConfig.srgz || siteConfig.systemToken || siteConfig.sitePasswordHash || siteConfig.sitePassword || '').trim();
      if (targetKey.startsWith('*')) {
        targetKey = targetKey.substring(1).trim();
      }

      const targetHash = /^[a-fA-F0-9]{64}$/.test(targetKey) ? targetKey : await computeSha256(targetKey);

      if (val === targetKey || valHash.toLowerCase() === targetHash.toLowerCase()) {
        sessionStorage.setItem('site_authenticated', 'true');
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
      } else {
        errorEl.style.display = 'block';
        input.value = '';
        input.focus();
      }
    });
  }

  // Dynamic & Extensible Navigation Rendering with Scope Isolation
  document.addEventListener('DOMContentLoaded', () => {
    checkPasswordProtection();
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;

    const currentPath = window.location.pathname.toLowerCase();

    // Determine current page context scope
    let pageContext = 'index';
    if (currentPath.includes('buyukcekmecebilgiislem')) {
      pageContext = 'publicportal';
    } else if (currentPath.includes('zapp.html') || currentPath.includes('z-app.html')) {
      pageContext = 'zapp';
    } else if (currentPath.includes('bcekmecesiteleri.html') || currentPath.includes('bcekmece-siteleri.html')) {
      pageContext = 'bcekmece';
    } else if (currentPath.includes('ulakbelform.html') || currentPath.includes('ulakbelform-detail.html')) {
      pageContext = 'ulakbel';
    } else if (currentPath.includes('sablonolusturucu.html')) {
      pageContext = 'sablon';
    } else if (currentPath.includes('sekmeler.html')) {
      pageContext = 'sekmeler';
    }

    // Allow page-specific override if window.pageNavbarScope is set
    const currentScope = window.pageNavbarScope || pageContext;

    // Master Navigation Registry:
    // `scopes` specifies which page contexts are allowed to see each button.
    const navRegistry = [
      {
        id: 'siteler',
        label: 'Siteler',
        href: 'index.html',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
        scopes: ['index']
      },
      {
        id: 'publicportal',
        label: 'Büyükçekmece Bilgi İşlem',
        href: 'buyukcekmecebilgiislem.html',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
        scopes: ['index', 'bcekmece', 'zapp', 'publicportal']
      },
      {
        id: 'ulakbel',
        label: 'Gönderi Önizleme',
        href: 'ulakbelForm.html',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M7 8h10M7 12h10M7 16h10"></path></svg>`,
        scopes: ['index', 'ulakbel']
      }
    ];

    // Merge any custom buttons declared by the page via window.customNavButtons
    const pageCustomButtons = window.customNavButtons || [];
    const allButtons = [...navRegistry, ...pageCustomButtons];

    // Filter buttons permitted for the active scope
    const visibleButtons = allButtons.filter(btn => {
      if (!btn.scopes) return true;
      return btn.scopes.includes(currentScope);
    });

    // Render navigation links HTML
    const navLinksHtml = visibleButtons.map(btn => {
      const isActive = (btn.id === currentScope) || (btn.href && currentPath.includes(btn.href.toLowerCase()));
      return `
        <a href="${btn.href}" class="nav-link ${isActive ? 'active' : ''}">
          ${btn.icon || ''}
          ${btn.label}
        </a>
      `;
    }).join('');

    // Determine Logo Brand destination URL
    let brandHref = 'index.html';
    if (currentScope === 'zapp') brandHref = 'zapp.html';
    else if (currentScope === 'bcekmece') brandHref = 'bcekmeceSiteleri.html';
    else if (currentScope === 'publicportal') brandHref = 'buyukcekmecebilgiislem.html';
    else if (currentScope === 'ulakbel') brandHref = 'ulakbelForm.html';

    navbarContainer.innerHTML = `
      <nav class="navbar">
        <a href="${brandHref}" class="nav-brand">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; color: var(--primary);">
            <rect width="16" height="16" x="4" y="4" rx="2"></rect>
            <rect width="6" height="6" x="9" y="9"></rect>
            <path d="M15 2v2M9 2v2M15 20v2M9 20v2M20 15h2M20 9h2M2 15h2M2 9h2"></path>
          </svg>
          Büyükçekmece Bilgi İşlem
        </a>
        
        <button class="menu-toggle" id="menu-toggle" aria-label="Menüyü Aç" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </button>

        <div class="nav-links" id="nav-links">
          ${navLinksHtml}
        </div>

        <div class="nav-actions">
          <button class="theme-toggle-btn" id="theme-toggle" type="button" aria-label="Temayı Değiştir"></button>
        </div>
      </nav>
    `;

    // Event listeners
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      updateThemeIcon(document.documentElement.getAttribute('data-theme'));
      themeBtn.addEventListener('click', toggleTheme);
    }

    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
      });
      document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
          navLinks.classList.remove('show');
        }
      });
    }
  });

  // Global Password Gate Modal for "Deneme" Tab
  window.promptDenemePassword = function(onSuccess, onCancel) {
    if (sessionStorage.getItem('deneme_authenticated') === 'true') {
      if (typeof onSuccess === 'function') onSuccess();
      return;
    }

    let overlay = document.getElementById('deneme-gate-overlay');
    if (overlay) overlay.remove();

    overlay = document.createElement('div');
    overlay.id = 'deneme-gate-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;

    overlay.innerHTML = `
      <div style="
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-xl);
        padding: 32px 28px;
        max-width: 400px;
        width: 100%;
        box-shadow: var(--shadow-lg);
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 20px;
        position: relative;
      ">
        <button id="deneme-gate-close" type="button" aria-label="Kapat" style="
          position: absolute; right: 16px; top: 16px;
          background: transparent; border: none; font-size: 1.5rem;
          color: var(--text-tertiary); cursor: pointer; line-height: 1;
        ">&times;</button>

        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
          <div style="
            width: 56px; height: 56px; border-radius: 16px;
            background: rgba(168, 85, 247, 0.12); color: #9333ea;
            display: flex; align-items: center; justify-content: center;
            border: 1px solid rgba(168, 85, 247, 0.3);
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin: 0;">
            Deneme Sekmesi Şifresi
          </h2>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0; line-height: 1.4;">
            Deneme grubundaki içeriklere ulaşmak için şifrenizi girin.
          </p>
        </div>

        <form id="deneme-gate-form" style="display: flex; flex-direction: column; gap: 14px;">
          <div style="position: relative;">
            <input type="password" id="deneme-gate-pass" class="input-control" placeholder="Özel Şifre..." required autofocus style="padding-left: 40px;" />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-tertiary);">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>

          <div id="deneme-gate-error" style="display:none; color: var(--danger); font-size: 0.82rem; font-weight: 600;">
            Hatalı şifre! Lütfen tekrar deneyin.
          </div>

          <div style="display: flex; gap: 10px;">
            <button type="button" id="deneme-gate-cancel" class="btn btn-outline" style="flex: 1; height: 44px; font-size: 0.9rem;">
              İptal
            </button>
            <button type="submit" class="btn btn-primary" style="flex: 1; height: 44px; font-size: 0.9rem; background: #9333ea; border-color: #9333ea;">
              Giriş Yap
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    const form = document.getElementById('deneme-gate-form');
    const input = document.getElementById('deneme-gate-pass');
    const errorEl = document.getElementById('deneme-gate-error');
    const closeBtn = document.getElementById('deneme-gate-close');
    const cancelBtn = document.getElementById('deneme-gate-cancel');

    function cleanupAndCancel() {
      overlay.remove();
      if (typeof onCancel === 'function') onCancel();
    }

    closeBtn.onclick = cleanupAndCancel;
    cancelBtn.onclick = cleanupAndCancel;
    overlay.onclick = (e) => {
      if (e.target === overlay) cleanupAndCancel();
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = input.value.trim();
      const siteConfig = window.not || window.siteConfig || {};
      let targetKey = String(siteConfig.gzsr || '').trim();
      if (targetKey.startsWith('*')) {
        targetKey = targetKey.substring(1).trim();
      }

      const valHash = typeof computeSha256 === 'function' ? await computeSha256(val) : '';
      const targetHash = /^[a-fA-F0-9]{64}$/.test(targetKey) ? targetKey : (typeof computeSha256 === 'function' ? await computeSha256(targetKey) : '');

      if (val === targetKey || (valHash && valHash.toLowerCase() === targetHash.toLowerCase())) {
        sessionStorage.setItem('deneme_authenticated', 'true');
        overlay.style.transition = 'opacity 0.25s ease';
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          if (typeof onSuccess === 'function') onSuccess();
        }, 250);
      } else {
        errorEl.style.display = 'block';
        input.value = '';
        input.focus();
      }
    });
  };
})();
