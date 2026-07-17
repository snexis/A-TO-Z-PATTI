/* ==========================================================================
   🔑 PROJECT: A-TO-Z BOMBAY PLAY ZONE (A-TO-Z-PATTI)
   📁 FILE: firebase-config.js
   📌 VERSION: v2.2.0 (Fresh Architecture Start)
   📡 FIREBASE VERSION: v10.12.0 (Latest Stable Modular CDN)
   
   📜 FILE DETAILS & CORE FEATURES:
   - এটি প্রজেক্টের কেন্দ্রীয় ফায়ারবেস কানেকশন এবং ইনিশিয়ালাইজেশন ফাইল।
   - ফায়ারবেস অথেন্টিকেশন (Auth) এবং রিয়েল-টাইম ডাটাবেস (Database) লিংক করে।
   
   🚀 FUTURE FEATURES TO INSERT IN THIS FILE:
   - গ্লোবাল ইউজার রোল ভেরিফিকেশন (Role Checking) মেথড।
   - অটোমেটিক রাউট প্রটেকশন (Unauthorized পেজ এক্সেস ব্লক করা)।
   - প্লেয়ারের কাস্টম আইডি-কে ব্যাকএন্ডে ডামি মেইলে কনভর্ট করার কোর ফাংশন।
   ========================================================================== */

// ১. লেটেস্ট ফায়ারবেস মডুলার SDK স্ক্রিপ্ট ইমপোর্ট করা (CDN মেথড)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ২. আপনার ফায়ারবেস প্রজেক্টের অফিশিয়াল কনফিগারেশন অবজেক্ট
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

// ৩. ফায়ারবেস অ্যাপ ইনিশিয়ালাইজ করা
const app = initializeApp(firebaseConfig);

// ৪. সার্ভিসসমূহ গ্লোবালি এক্সপোর্ট করা যাতে অন্য ফাইল থেকে সরাসরি ব্যবহার করা যায়
export const auth = getAuth(app);
export const database = getDatabase(app);

console.log("🚀 [Play Zone Security]: Firebase Configured Successfully with v10 CDN!");
