// গেমের মেইন কন্ট্রোল সিস্টেম
const App = {
    // বাজির রেজাল্ট আপডেট করার ফাংশন
    updateBaziResult: function(baziId, result) {
        database.ref('bazis/' + baziId).update({
            result: result,
            status: 'closed'
        })
        .then(() => alert("রেজাল্ট আপডেট সফল!"))
        .catch((e) => console.error("ভুল হয়েছে:", e));
    },

    // প্লেয়ারের বাজি চেক করার লজিক
    checkPlayerBets: function(baziId) {
        database.ref('bets/' + baziId).once('value', (snapshot) => {
            const bets = snapshot.val();
            console.log("বাজি লিস্ট:", bets);
        });
    }
};

// গেম চলাকালীন বাজি ওপেন করার ফাংশন
function openBazi(baziId) {
    database.ref('bazis/' + baziId).update({
        status: 'open'
    });
}
