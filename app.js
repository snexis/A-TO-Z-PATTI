// মাস্টার সিস্টেম ইঞ্জিন - সব লজিক এখানে ইনবিল্ড
const App = {
    // ১. সিকিউর রোল-বেসড ইমেইল কনভার্টার
    getEmailFromId: function(userId, role) {
        const roles = { 'master_admin': 'master.admin', 'sub_admin': 'sub.admin', 'player': 'game.player' };
        return userId + "@" + (roles[role] || "game.player");
    },

    // ২. ডাইনামিক টাইম-লক (অ্যাডমিনের সেট করা টাইম অনুযায়ী)
    checkBettingStatus: function(gameId, callback) {
        database.ref('admin_settings/games/' + gameId).once('value', (snapshot) => {
            const settings = snapshot.val();
            if (!settings) return callback(false);
            
            const now = Date.now();
            const closingTime = new Date(settings.closingTime).getTime();
            // অ্যাডমিন যদি 'open' রাখে এবং টাইম না পার হয় তবেই বেট সম্ভব
            const isAllowed = settings.status === 'open' && now < closingTime;
            callback(isAllowed);
        });
    },

    // ৩. রেশিও ক্যালকুলেটর (১ টাকায় ৯ বা ১১.৫০)
    calculateWinnings: function(amount, type, adminConfig) {
        const rate = (type === 'patti') ? adminConfig.pattiRate : adminConfig.singleRate;
        return amount * rate;
    },

    // ৪. অ্যাডমিন ড্যাশবোর্ড রিপোর্ট ক্যালকুলেশন
    generateAdminReport: function(bets, adminConfig) {
        let totalBet = 0;
        bets.forEach(bet => totalBet += bet.amount);
        return {
            totalBet: totalBet,
            netProfit: totalBet - (totalBet * adminConfig.payoutPercentage)
        };
    },

    // ৫. রাত ১২টার অটো-রিসেট (ব্যালেন্স বাদে বাকি সব ক্লিন)
    runMidnightReset: function() {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            database.ref('bets').remove();
            database.ref('bazis').remove();
            console.log("সিস্টেম রিসেট সম্পন্ন হয়েছে।");
        }
    },

    // ৬. সাব-অ্যাডমিন ম্যানেজমেন্ট
    handleSubAdmin: function(subAdminId, action) {
        // action হতে পারে 'approved' বা 'blocked'
        database.ref('users/' + subAdminId + '/status').set(action);
    }
};

// সিস্টেম অটোমেশন (প্রতি ১ মিনিট অন্তর চেক করবে)
setInterval(() => {
    App.runMidnightReset();
}, 60000);
