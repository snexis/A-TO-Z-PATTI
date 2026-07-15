// ==========================================
// ATOZ BOMBAY - FIREBASE CONFIGURATION & SECURITY GATE (v4.9)
// ==========================================

// ফায়ারবেস কনফিগারেশন অবজেক্ট (আপনার ফায়ারবেস কনসোল থেকে পাওয়া ডেটা)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// ফায়ারবেস ইনিশিয়ালাইজ করা
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// গ্লোবাল উইন্ডো অবজেক্টে অথ ও ডেটাবেস সেট করা যাতে অন্য ফাইল সহজে পায়
window.auth = firebase.auth();
window.db = firebase.database();

// সিকিউরিটি গেটওয়ে: অনুমোদিত ডোমেন চেক (snexis.github.io অথবা local development)
const allowedDomains = ["snexis.github.io", "localhost", "127.0.0.1"];
const currentHostname = window.location.hostname;

if (!allowedDomains.includes(currentHostname)) {
  alert("সিকিউরিটি অ্যালার্ট: অননুমোদিত ডোমেন থেকে গেম রান করার চেষ্টা করা হয়েছে! সিস্টেম লক করা হলো।");
  // কানেকশন ডিসকানেক্ট করে দেওয়া
  window.auth = null;
  window.db = null;
  document.body.innerHTML = "<h1 style='color:red; text-align:center; margin-top:20%;'>Unauthorized Domain! Access Denied.</h1>";
}
