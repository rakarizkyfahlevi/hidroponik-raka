// firebase-config.js — konfigurasi proyek Firebase Anda.
// Ambil dari: Firebase Console → Project settings → General → Your apps → Web app → SDK setup and configuration.
// Nilai apiKey di sini BUKAN rahasia (memang untuk dipakai di browser); keamanan diatur lewat
// Authentication, Rules database, dan "Authorized domains" di Firebase Console.
const SG_FIREBASE_CONFIG = {
  apiKey: "GANTI_DENGAN_API_KEY",
  authDomain: "hidroponik-skripsi-b82d7.firebaseapp.com",
  projectId: "hidroponik-skripsi-b82d7",
  databaseURL: "https://hidroponik-skripsi-b82d7-default-rtdb.asia-southeast1.firebasedatabase.app",
  appId: "GANTI_DENGAN_APP_ID",
};

// Alamat backend Flask (sensor & push notification).
//  - Situs dibuka dari server yang sama dengan Flask  → biarkan "" (kosong).
//  - Situs di GitHub Pages → isi URL backend publik, tanpa garis miring di akhir,
//    contoh: "https://xxxx.ngrok-free.app"
const SG_API_BASE = "";
