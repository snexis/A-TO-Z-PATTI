// লগইন ফাংশন: আইডি থেকে ইমেইল কনভার্ট করে ফায়ারবেসে লগইন করবে
async function handleLogin() {
    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!userId || !password) {
        alert("আইডি এবং পাসওয়ার্ড দিন!");
        return;
    }

    // মাস্টার অ্যাডমিন চেক (সিস্টেমের চাবিকাঠি)
    let role = (userId === "atoz") ? "master_admin" : "player"; 
    
    // আমাদের সেই গোপন ছদ্মবেশী ইমেইল তৈরি
    const email = getEmailFromId(userId, role);

    try {
        await auth.signInWithEmailAndPassword(email, password);
        
        // লগইন সফল হলে ড্যাশবোর্ডে রিডাইরেক্ট
        console.log("লগইন সফল: " + role);
        window.location.href = "admin-dashboard.html"; 
    } catch (error) {
        console.error("লগইন ব্যর্থ:", error.message);
        alert("ভুল আইডি বা পাসওয়ার্ড! ৩ বারের বেশি ভুল করলে আইডি ব্লক হয়ে যাবে।");
    }
}

// রাত ১২টার অটো-লক লজিক (ভবিষ্যতের গেমের জন্য)
function checkMidnightLock() {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        // ডেটাবেসে গেম স্ট্যাটাস 'closed' করে দেওয়া
        database.ref('game_settings/status').set('closed');
        alert("সিস্টেম রিস্টার্ট মোডে আছে!");
    }
}
setInterval(checkMidnightLock, 60000); // প্রতি ১ মিনিট অন্তর চেক করবে
