// লগইন ফাংশন: মাস্টার ইঞ্জিনের getEmailFromId ব্যবহার করে
async function handleLogin() {
    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!userId || !password) {
        alert("আইডি এবং পাসওয়ার্ড দিন!");
        return;
    }

    // রোল ডিটেকশন লজিক
    let role = 'player';
    if (userId === "atoz") {
        role = 'master_admin';
    } else {
        // ডেটাবেস থেকে চেক করে দেখা রোল প্লেয়ার নাকি সাব-অ্যাডমিন
        // আপাতত ডিফল্ট প্লেয়ার হিসেবেই সেট করা আছে
    }
    
    // App.js-এ থাকা মাস্টার ফাংশন ব্যবহার করছি
    const email = App.getEmailFromId(userId, role);

    try {
        await auth.signInWithEmailAndPassword(email, password);
        console.log("লগইন সফল: " + role);
        window.location.href = "admin-dashboard.html"; 
    } catch (error) {
        console.error("লগইন ব্যর্থ:", error.message);
        alert("ভুল আইডি বা পাসওয়ার্ড!");
    }
}

// অটো-লক এবং রিসেট লজিক
function runSystemAutomation() {
    // App.js এর মাস্টার রিসেট ফাংশন কল করা
    App.runMidnightReset();
    
    // যদি রাত ১২টা বেজে যায়, গেম স্ট্যাটাস ক্লোজ করা
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        database.ref('game_settings/status').set('closed');
    }
}
setInterval(runSystemAutomation, 60000); // প্রতি ১ মিনিটে চেক করবে

// সাব-অ্যাডমিন এপ্রুভ করার জন্য অ্যাডমিন ড্যাশবোর্ড বাটন ফাংশন
function approveSubAdminButton(subAdminId) {
    App.handleSubAdmin(subAdminId, 'approved');
    alert("সাব-অ্যাডমিন এপ্রুভ হয়েছে!");
}
