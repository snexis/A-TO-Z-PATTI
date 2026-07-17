/* ==========================================================================
   🔑 PROJECT: A-TO-Z BOMBAY PLAY ZONE (A-TO-Z-PATTI)
   📁 FILE: auth.js
   📌 VERSION: v2.5.5 (Strict Path Integrity Patch)
   📡 FIREBASE VERSION: v10.12.0 (Modular CDN)
   
   📜 CHANGES MADE IN THIS VERSION:
   - গিটহাব পেজে 'Unexpected token <' এরর দূর করতে ডাটা পাথ এক্সপোজিশন ফিক্স।
   - i18n গাইডলাইন মেনে কোনো ল্যাঙ্গুয়েজ মিক্সিং ছাড়াই পিওর জাভাস্ক্রিপ্ট আর্কিটেকচার।
   - ডাইনামিক ইউজার আইডি (যেমন: a01)-কে অটো সিকিউর ডামি মেইলে রূপান্তর করার লজিক।
   
   🚀 FUTURE ROADMAP:
   - সফল লগইনের পর ইউজার রোল ভেরিফাই করে নির্দিষ্ট ড্যাশবোর্ড ফাইলে অটো-রিডাইরেক্ট।
   ========================================================================== */

import { auth, database } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// লগইন হ্যান্ডলার এবং রোল ভেরিফিকেশন ফাংশন
export async function handleLogin(username, password) {
    try {
        const cleanUsername = username.trim().toLowerCase();
        
        // আন্তর্জাতিক সিকিউরিটি রুলস: আইডি ম্যাপড টু ডামি ডোমেইন
        const secureEmail = `${cleanUsername}@atozpatti.com`;

        console.log("🔄 Initiating secure link to Firebase for:", secureEmail);

        // ফায়ারবেস অথেন্টিকেশন
        const userCredential = await signInWithEmailAndPassword(auth, secureEmail, password);
        const uid = userCredential.user.uid;

        console.log("✅ Connection Established! Accessing Realtime Database...");

        // ডাটাবেস থেকে রোল চেক
        const userRef = ref(database, `users/${cleanUsername}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            const userRole = userData.role;
            
            console.log(`🎯 Role Authenticated: ${userRole}`);
            alert(`লগইন সফল হয়েছে! আপনার রোল: ${userRole}`);
            
            // রোল অনুযায়ী রিডাইরেকশন লজিক
            if (userRole === "master_admin") {
                window.location.href = "master-admin.html";
            } else if (userRole === "player") {
                window.location.href = "player-dashboard.html";
            } else {
                window.location.href = "dashboard.html";
            }
        } else {
            console.error("❌ Database Mismatch: Role configuration missing.");
            alert("Error: User role not defined in database.");
        }
    } catch (error) {
        console.error("❌ Firebase Protocol Failure:", error.message);
        alert("ভুল আইডি অথবা পাসওয়ার্ড! আবার চেষ্টা করুন।");
    }
}
