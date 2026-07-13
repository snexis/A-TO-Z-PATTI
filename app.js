const App = {
    // ১. আইডি থেকে ইমেইল কনভার্ট (সিকিউরিটি লেয়ার)
    getEmailFromId: function(userId, role) {
        const roles = { 'master_admin': 'master.admin', 'sub_admin': 'sub.admin', 'player': 'game.player' };
        return userId + "@" + (roles[role] || "game.player");
    },

    // ২. ডেটাবেস থেকে অ্যাডমিনের সেট করা টাইম চেক করা
    checkBettingStatus: function(gameId, callback) {
        database.ref('admin_settings/games/' + gameId).once('value', (snapshot) => {
            const settings = snapshot.val();
            const now = Date.now();
            const isAllowed = settings.status === 'open' && now < new Date(settings.closingTime).getTime();
            callback(isAllowed);
        });
    },

    // ৩. রাত ১২টার অটো-রিসেট লজিক (ব্যালেন্স বাদে বাকি সব ক্লিন হবে)
    runMidnightReset: function() {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            // বাজি এবং রেজাল্ট হিস্ট্রি ক্লিয়ার করা
            database.ref('bets').remove();
            database.ref('bazis').remove();
            console.log("সিস্টেম রিসেট সম্পন্ন হয়েছে। শুধু ব্যালেন্স অক্ষত আছে।");
        }
    },

    // ৪. প্রফিট এবং উইনিং ক্যালকুলেটর (অ্যাডমিনের রেশিও অনুযায়ী)
    calculateResult: function(betAmount, type, adminConfig) {
        const rate = (type === 'patti') ? adminConfig.pattiRate : adminConfig.singleRate;
        const payout = betAmount * rate;
        return {
            payout: payout,
            adminProfit: betAmount - (betAmount * adminConfig.payoutPercentage)
        };
    },

    // ৫. লগইন লজিক
    handleLogin: function(userId, password) {
        let role = (userId === 'atoz') ? 'master_admin' : 'player';
        const email = this.getEmailFromId(userId, role);
        
        auth.signInWithEmailAndPassword(email, password)
        .then(() => alert("লগইন সফল!"))
        .catch((e) => alert("ভুল আইডি বা পাসওয়ার্ড!"));
    }
};

// সিস্টেম অটোমেশন (প্রতি ১ মিনিট অন্তর চেক করবে)
setInterval(() => {
    App.runMidnightReset();
}, 60000);
