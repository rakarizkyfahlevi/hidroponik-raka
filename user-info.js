// user-info.js — isi nama & handle user di sidebar dari akun Firebase yang sedang login.
document.addEventListener('DOMContentLoaded', () => {
  if (typeof sgAuth === 'undefined') return;
  sgAuth.onAuthStateChanged((user) => {
    if (!user) return;
    const nameEl = document.getElementById('sidebarUserName');
    const handleEl = document.getElementById('sidebarUserHandle');
    const emailName = (user.email || '').split('@')[0];
    if (nameEl) nameEl.textContent = user.displayName || emailName || 'Pengguna';
    if (handleEl) handleEl.textContent = '@' + (emailName || 'pengguna');
  });
});
