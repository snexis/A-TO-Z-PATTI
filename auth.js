<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <!-- ==========================================================================
       🔑 PROJECT: A-TO-Z BOMBAY PLAY ZONE (A-TO-Z-PATTI)
       📁 FILE: index.html
       📌 VERSION: v2.3.0 (Internationalization Standard)
       📡 FIREBASE VERSION: v10.12.0 (Modular CDN)
       
       📜 FILE DETAILS & CORE FEATURES:
       - এটি প্রজেক্টের মেইন সিকিউর লগইন গেটওয়ে।
       - i18n (Internationalization) স্ট্যান্ডার্ড মেনে সম্পূর্ণ পৃথক ভাষা ট্র্যাকিং।
       - রেসপন্সিভ এবং ক্লিন ইউজার ইন্টারফেস (UI)।
       
       🚀 FUTURE FEATURES TO INSERT IN THIS FILE:
       - আইডি ও পাসওয়ার্ড ফায়ারবেস অথেন্টিকেশনের সাথে কানেক্ট করা।
       - রোল (Role) অনুযায়ী নির্দিষ্ট ড্যাশবোর্ডে অটো-রিডাইরেক্ট মেকানিজম।
       ========================================================================== -->
import { auth, database } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

export async function handleLogin(username, password) {
    try {
        const cleanUsername = username.trim().toLowerCase();
        const secureEmail = `${cleanUsername}@atozpatti.com`;

        console.log("🔄 Attempting authentication for:", secureEmail);

        const userCredential = await signInWithEmailAndPassword(auth, secureEmail, password);
        const uid = userCredential.user.uid;

        console.log("✅ Auth Success! Fetching user role...");

        const userRef = ref(database, `users/${cleanUsername}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            console.log("🎯 User Data Found:", userData);
            
            // রোল অনুযায়ী রিডাইরেক্ট
            const userRole = userData.role;
            alert("Login Successful! Role: " + userRole);
            // window.location.href = userRole + "-dashboard.html"; 
        } else {
            console.error("❌ Database Error: User record not found in 'users/' node.");
        }
    } catch (error) {
        console.error("❌ Firebase Auth Error:", error.message);
        alert("Login Failed: " + error.message);
    }
}
