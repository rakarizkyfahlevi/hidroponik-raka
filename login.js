// login.js — form login memakai Firebase Authentication (lihat auth.js).

// ══════════════════════════════════════════════════════
// PWA: daftarkan service worker sejak halaman LOGIN (titik
// masuk pertama aplikasi), bukan cuma di dashboard. Ini yang
// membuat browser mendeteksi aplikasi sebagai "installable"
// sejak awal, dan mengaktifkan sw.js lebih dini.
// ══════════════════════════════════════════════════════
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./sw.js');
      console.log('[SmartGarden] Service worker terdaftar dari halaman login.');
    } catch (err) {
      console.warn('[SmartGarden] Gagal mendaftarkan service worker:', err);
    }
  });
}

// ══════════════════════════════════════════════════════
// PWA: tombol Install / Download aplikasi (mulai dari login)
// ══════════════════════════════════════════════════════
let deferredInstallPrompt = null;
const installAppBtn = document.getElementById('install-app-btn');

function isRunningStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true; // iOS Safari
}

function hideInstallButton() {
  if (installAppBtn) installAppBtn.style.display = 'none';
}

function showInstallButton() {
  if (installAppBtn && !isRunningStandalone()) installAppBtn.style.display = 'flex';
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  showInstallButton();
});

if (installAppBtn) {
  installAppBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) {
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      alert(isIOS
        ? 'Ketuk tombol Bagikan (Share) di Safari, lalu pilih "Add to Home Screen".'
        : 'Buka menu (⋮) browser, lalu pilih "Install app" / "Tambahkan ke layar utama".');
      return;
    }
    installAppBtn.disabled = true;
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installAppBtn.disabled = false;
    if (choice.outcome === 'accepted') hideInstallButton();
  });
}

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  hideInstallButton();
});

if (isRunningStandalone()) hideInstallButton();

function togglePw(id, btn) {
  const el = document.getElementById(id);
  el.type = el.type === 'password' ? 'text' : 'password';
  btn.textContent = el.type === 'password' ? 'Lihat' : 'Sembunyikan';
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const alertBox = document.getElementById('alertBox');
  const redirectField = document.getElementById('redirectField');

  // Set nilai redirect dari query string (?redirect=...), default ke dashboard.html.
  // Hanya izinkan halaman di situs ini (cegah open-redirect) dan ubah .php lama ke .html.
  let redirect = params.get('redirect') || 'dashboard.html';
  redirect = redirect.replace(/\.php(?=$|[?#])/i, '.html');
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(redirect) || /^javascript:/i.test(redirect)) {
    redirect = 'dashboard.html';
  }
  redirect = redirect.replace(/^\/+/, '');
  if (!redirect) redirect = 'dashboard.html';
  redirectField.value = redirect;

  // Tampilkan pesan alert sesuai query string, meniru switch di login.php
  const errorCode = params.get('error');
  let message = '';
  let isSuccess = false;

  if (errorCode === '1') {
    message = '⚠️ Email atau password salah. Coba lagi.';
  } else if (errorCode === '2') {
    message = '⚠️ Email dan password wajib diisi.';
  } else if (params.has('registered')) {
    message = '✅ Akun berhasil dibuat. Silakan masuk.';
    isSuccess = true;
  } else if (params.has('logged_out')) {
    message = '✅ Anda berhasil keluar (logout).';
    isSuccess = true;
  }

  if (message) {
    alertBox.textContent = message;
    alertBox.classList.toggle('success', isSuccess);
    alertBox.style.display = 'block';
  }

  // ══════════════════════════════════════════════════════
  // Proses login — lewat Firebase Authentication (auth.js)
  // ══════════════════════════════════════════════════════
  const loginForm = document.getElementById('loginForm');
  const emailField = document.getElementById('email');
  const passwordField = document.getElementById('password');

  function showAlert(text, success) {
    alertBox.textContent = text;
    alertBox.classList.toggle('success', success);
    alertBox.style.display = 'block';
  }

  if (loginForm) {
    const submitBtn = loginForm.querySelector('.btn-submit');

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = emailField.value.trim();
      const password = passwordField.value;

      if (!email || !password) {
        showAlert('⚠️ Email dan password wajib diisi.', false);
        return;
      }

      submitBtn.disabled = true;
      try {
        await sgLogin(email, password);
        window.location.href = redirectField.value || 'dashboard.html';
      } catch (err) {
        console.warn('[SmartGarden] Login gagal:', err.code);
        showAlert(sgAuthErrorMessage(err), false);
        submitBtn.disabled = false;
      }
    });
  }
});
