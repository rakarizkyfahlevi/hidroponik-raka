// auth.js — Autentikasi SmartGarden memakai Firebase Authentication (Email/Password).
// Menggantikan login manual sebelumnya (username/password yang tertulis di file JS).
//
// Syarat: halaman harus memuat (berurutan) sebelum file ini:
//   firebase-app-compat.js, firebase-auth-compat.js, firebase-config.js

firebase.initializeApp(SG_FIREBASE_CONFIG);
const sgDb = firebase.database ? firebase.database() : null; // hanya ada di halaman yang memuat firebase-database-compat.js
const sgAuth = firebase.auth(); // sesi disimpan Firebase (persistence LOCAL) → tetap login setelah browser ditutup

// Terjemahkan kode error Firebase ke pesan yang ramah.
function sgAuthErrorMessage(err) {
  switch (err && err.code) {
    case 'auth/invalid-email':
      return '⚠️ Format email tidak valid.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return '⚠️ Email atau password salah. Coba lagi.';
    case 'auth/user-disabled':
      return '⚠️ Akun ini dinonaktifkan.';
    case 'auth/too-many-requests':
      return '⚠️ Terlalu banyak percobaan. Tunggu beberapa saat lalu coba lagi.';
    case 'auth/network-request-failed':
      return '⚠️ Gagal terhubung ke server. Periksa koneksi internet Anda.';
    default:
      return '⚠️ Gagal masuk. Coba lagi.';
  }
}

// Login. Resolve kalau berhasil, reject (Error Firebase) kalau gagal.
function sgLogin(email, password) {
  return sgAuth.signInWithEmailAndPassword(email, password);
}

// Logout lalu kembali ke halaman login.
async function sgLogout() {
  try { await sgAuth.signOut(); } catch (e) { console.warn('Logout gagal:', e); }
  window.location.href = 'login.html?logged_out=1';
}

// Penjaga halaman: panggil di halaman yang butuh login (dashboard).
// Halaman disembunyikan (class sg-auth-pending di <html>) sampai status login pasti.
function sgRequireAuth(loginUrl) {
  sgAuth.onAuthStateChanged((user) => {
    if (user) {
      document.documentElement.classList.remove('sg-auth-pending');
    } else {
      window.location.replace(loginUrl || 'login.html');
    }
  });
}

// Kebalikannya: kalau sudah login, lempar ke tujuan (dipakai di login.html).
function sgRedirectIfLoggedIn(target) {
  sgAuth.onAuthStateChanged((user) => {
    if (user) window.location.replace(target || 'dashboard.html');
  });
}

// Pasang tombol logout otomatis kalau ada elemen #logoutBtn di halaman.
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('logoutBtn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      sgLogout();
    });
  }
});
