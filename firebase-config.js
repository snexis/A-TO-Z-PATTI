/**
 * A to Z Patti - Firebase Configuration & Security Core
 * ⚠️ সিকিউরিটি অ্যালার্ট: এই ফাইলটি আপনার .gitignore ফাইলে যুক্ত থাকবে।
 * এটি ভুলেও গিটহাবে (GitHub) পুশ বা আপলোড করবেন না।
 */

const firebaseConfig = {
  apiKey: "AIzaSyBOHO_fnREBfPjykd7Lo_ZBsAXy3keoZW4",
  authDomain: "a-toz-patti.firebaseapp.com",
  databaseURL: "https://a-toz-patti-default-rtdb.firebaseio.com",
  projectId: "a-toz-patti",
  storageBucket: "a-toz-patti.firebasestorage.app",
  messagingSenderId: "71546188781",
  appId: "1:71546188781:web:d9bfea657335132c66de4"
};

// গ্লোবাল উইন্ডো অবজেক্টে কনফিগারেশন এক্সপোজ করা
// এর ফলে আমাদের প্রোজেক্টের app.js বা অন্য যেকোনো স্ক্রিপ্ট সরাসরি এই কানেকশনটি ব্যবহার করতে পারবে
window.firebaseConfig = firebaseConfig;

console.log("🔒 [Security Mode]: Firebase Config securely initialized locally.");
