/* ==========================================
   ATOZ BOMBAY - FIREBASE CONFIGURATION (v10.0)
   ========================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ⚠️ আপনার আসল ফায়ারবেস প্রজেক্টের ক্রেডেনশিয়াল (Credentials) দিয়ে এই অংশটি পরিবর্তন করুন
const firebaseConfig = {
  apiKey: "AIzaSyB0HO_fnRt3FMjykq7Lo_Z0sAYy3kee2W4",
  authDomain: "a-toz-patti.firebaseapp.com",
  databaseURL: "https://a-toz-patti-default-rtdb.firebaseio.com",
  projectId: "a-toz-patti",
  storageBucket: "a-toz-patti.firebasestorage.app",
  messagingSenderId: "71546188781",
  appId: "1:71546188781:web:19bfea6537335132c86de4",
  measurementId: "G-8ENRFZRWLP"
};

// ফায়ারবেস ইনিশিয়ালাইজেশন
const app = initializeApp(firebaseConfig);

// মডিউল এক্সপোর্ট (সেন্ট্রাল ডাটাবেস ও অথ কানেকশন)
export const auth = getAuth(app);
export const db = getDatabase(app);

console.log("⚡ Firebase Central Engine Synced Successfully!");
