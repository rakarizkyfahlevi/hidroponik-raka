// firebase-config.js — konfigurasi proyek Firebase Anda.
// Ambil dari: Firebase Console → Project settings → General → Your apps → Web app → SDK setup and configuration.
// Nilai apiKey di sini BUKAN rahasia (memang untuk dipakai di browser); keamanan diatur lewat
// Authentication, Rules database, dan "Authorized domains" di Firebase Console.
const SG_FIREBASE_CONFIG = {
  apiKey: "AIzaSyB3gmwLVd6ASfCmoybXLW7WFGafZFMSkdI",
  authDomain: "hidroponik-skripsi-b82d7.firebaseapp.com",
  databaseURL:
    "https://hidroponik-skripsi-b82d7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hidroponik-skripsi-b82d7",
  storageBucket: "hidroponik-skripsi-b82d7.firebasestorage.app",
  messagingSenderId: "502838614791",
  appId: "1:502838614791:web:7d110285f8baf470fe83a2",
};


// Alamat backend Flask (sensor & push notification).
//  - Situs dibuka dari server yang sama dengan Flask  → biarkan "" (kosong).
//  - Situs di GitHub Pages → isi URL backend publik, tanpa garis miring di akhir,
//    contoh: "https://xxxx.ngrok-free.app"
const SG_API_BASE = "";
