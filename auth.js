/* ==========================================================================
   🔑 PROJECT: A-TO-Z BOMBAY PLAY ZONE (A-TO-Z-PATTI)
   📁 FILE: auth.js
   📌 VERSION: v2.7.0 (Cross-Repo Security Isolation)
   
   📜 CHANGES MADE IN THIS VERSION:
   - প্লেয়ার এবং অ্যাডমিন প্যানেলকে দুটি আলাদা রিপোজিটরিতে সম্পূর্ণ আইসোলেট করা হয়েছে।
   - লগইন সফল হওয়ার পর প্লেয়ারকে 'ATOZBOMBAY' রিপোজিটরির লিঙ্কে পাঠানো হবে।
   - প্লেয়ার কোনোভাবেই অ্যাডমিন ফাইলের পাথ বা ইউআরএল ট্রেস করতে পারবে না।
   ========================================================================== */

import { auth, database } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

export async function handleLogin(username, password) {
    try {
        const cleanUsername = username.trim().toLowerCase();
        const secureEmail = `${cleanUsername}@atozpatti.com`;

        console.log("🔄 Initiating secure link to Firebase...");

        // ফায়ারবেস লগইন প্রোটোকল
        const userCredential = await signInWithEmailAndPassword(auth, secureEmail, password);
        
        // ডাটাবেস থেকে ইউজারের রোল চেক
        const userRef = ref(database, `users/${cleanUsername}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            const userRole = userData.role;
            
            console.log("🎯 Role Authenticated successfully.");
            
            // 🔒 সিকিউরিটি রাউটিং লক:
            if (userRole === "player") {
                // প্লেয়ারকে সরাসরি আলাদা রিপোজিটরির সুরক্ষিত ড্যাশবোর্ডে পাঠানো হচ্ছে
                window.location.href = "https://snexis.github.io/ATOZBOMBAY/player-dashboard.html";
            } 
            else if (userRole === "master_admin") {
                // অ্যাডমিন তার নিজস্ব সুরক্ষিত ড্যাশবোর্ডে প্রবেশ করবে
                window.location.href = "master-admin.html"; 
            } 
            else {
                alert("Error: Unauthorized Access Role.");
            }
        } else {
            alert("Error: User configuration missing in database.");
        }
    } catch (error) {
        console.error("❌ Auth Failure:", error.message);
        alert("ভুল আইডি অথবা পাসওয়ার্ড! আবার চেষ্টা করুন।");
    }
}
