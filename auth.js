/* ==========================================
   ATOZ BOMBAY - ADMIN AUTHENTICATION ENGINE
   ========================================== */
import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// অ্যাডমিন লগইন ফাংশন
export async function handleAdminLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // ডাটাবেস থেকে ইউজারের রোল (Role) চেক করা
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists() && snapshot.val().role === "admin") {
            console.log("🔒 Admin Authenticated Successfully!");
            window.location.href = "admin.html"; // সঠিক হলে অ্যাডমিন ড্যাশবোর্ডে পাঠাবে
        } else {
            // যদি প্লেয়ার আইডি দিয়ে অ্যাডমিন প্যানেলে ঢোকার চেষ্টা করে
            await signOut(auth);
            alert("❌ অ্যাক্সেস প্রত্যাখ্যান! আপনি এই প্যানেলের অ্যাডমিন নন।");
        }
    } catch (error) {
        console.error("Login Error:", error.message);
        alert("❌ ভুল ইমেইল অথবা পাসওয়ার্ড! আবার চেষ্টা করুন।");
    }
}

// অ্যাডমিন পেজ প্রোটেকশন লক (admin.html এর সুরক্ষার জন্য)
export function protectAdminPage() {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = "index.html"; // লগইন না থাকলে তাড়িয়ে দেবে
        } else {
            const userRef = ref(db, `users/${user.uid}`);
            const snapshot = await get(userRef);
            if (!snapshot.exists() || snapshot.val().role !== "admin") {
                await signOut(auth);
                window.location.href = "index.html"; // অ্যাডমিন না হলে তাড়িয়ে দেবে
            }
        }
    });
}

// লগআউট ফাংশন
export async function handleAdminLogout() {
    await signOut(auth);
    window.location.href = "index.html";
}
