// ==========================================
// ATOZ BOMBAY - PLAYER ZONE CORE LOGIC (v4.9)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // সেশন চেক: লগইন ছাড়া কেউ ঢুকতে পারবে না
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "player") {
        window.location.href = "index.html";
        return;
    }

    // DOM এলিমেন্টসমূহ সিলেক্ট করা
    const playerNameDisplay = document.getElementById("playerNameDisplay");
    const playerLogoutBtn = document.getElementById("playerLogoutBtn");
    const gameChartTableBody = document.getElementById("gameChartTableBody");
    const printChartBtn = document.getElementById("printChartBtn");

    // ল্যাঙ্গুয়েজ ডিকশনারি (খিচুড়ি ছাড়া আলাদা ভাষার ব্লক)
    const languageStrings = {
        bn: {
            logo: "এ টু জেড বোম্বে",
            logout: "লগআউট",
            welcome: "স্বাগতম, " + currentUser.username + "!",
            subtext: "আপনার লাইভ গেমিং ড্যাশবোর্ড এখানে দেখুন।",
            chartTitle: "📊 লাইভ গেম রেজাল্ট চার্ট",
            printBtn: "চার্ট প্রিন্ট করুন",
            thTime: "সময় (Time Slot)",
            thResult: "উইনিং নাম্বার (Result)"
        },
        en: {
            logo: "ATOZ BOMBAY",
            logout: "Logout",
            welcome: "Welcome, " + currentUser.username + "!",
            subtext: "View your live gaming dashboard here.",
            chartTitle: "📊 Live Game Result Chart",
            printBtn: "Print Chart",
            thTime: "Time Slot",
            thResult: "Winning Number"
        }
    };

    // ফায়ারবেস থেকে প্লেয়ারের ফিক্সড ভাষা ও ডেটা একবার রিড করা
    window.db.ref("users/" + currentUser.username).once("value")
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                
                // যদি অ্যাকাউন্ট ব্লক করা হয়, তবে ইনস্ট্যান্ট কিক-আউট
                if (userData.status === "blocked") {
                    alert(userData.language === "en" ? "Your account is blocked!" : "আপনার অ্যাকাউন্টটি ব্লক করা হয়েছে!");
                    logoutUser();
                    return;
                }

                // ভাষা সেটআপ করা (ডিফল্ট বাংলা, নয়তো অ্যাডমিনের সেট করা ভাষা)
                const lang = userData.language === "en" ? "en" : "bn";
                applyLanguage(lang);
            }
        });

    // স্ক্রিনের টেক্সটগুলো নির্দিষ্ট ভাষায় রূপান্তর করার ফাংশন
    function applyLanguage(lang) {
        const str = languageStrings[lang];
        
        document.getElementById("navLogoText").innerText = str.logo;
        playerLogoutBtn.innerText = str.logout;
        playerNameDisplay.innerText = currentUser.username.toUpperCase();
        document.getElementById("welcomeHeading").innerText = str.welcome;
        document.getElementById("welcomeSubtext").innerText = str.subtext;
        document.getElementById("chartTitle").innerText = str.chartTitle;
        document.getElementById("printBtnText").innerText = str.printBtn;
        document.getElementById("thTime").innerText = str.thTime;
        document.getElementById("thResult").innerText = str.thResult;

        // ভাষা সেট হওয়ার পর লাইভ চার্ট লিসেনার চালু করা
        listenToLiveChart();
    }

    // ==========================================
    // ১. রিয়েল-টাইম লাইভ গেম চার্ট (No Refresh)
    // ==========================================
    function listenToLiveChart() {
        window.db.ref("gameChart").on("value", (snapshot) => {
            gameChartTableBody.innerHTML = ""; // ডুপ্লিকেট এড়াতে টেবিল খালি করা
            
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const timeSlot = childSnapshot.key;
                    const data = childSnapshot.val();

                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td><strong>${timeSlot}</strong></td>
                        <td><span class="result-number-badge">${data.result}</span></td>
                    `;
                    gameChartTableBody.appendChild(row);
                });
            }
        });
    }

    // ==========================================
    // ২. স্মার্ট চার্ট প্রিন্ট মেকানিজম (Clean Layout)
    // ==========================================
    printChartBtn.addEventListener("click", () => {
        const printContent = document.getElementById("printableArea").innerHTML;
        const originalContent = document.body.innerHTML;

        // শুধু টেবিলের অংশটুকু নিয়ে ব্রাউজার প্রিন্ট উইন্ডো ওপেন করা
        document.body.innerHTML = `
            <div style="padding: 20px; font-family: sans-serif; text-align: center;">
                <h2>ATOZ BOMBAY - OFFICIAL GAME CHART</h2>
                <hr>
                <br>
                ${printContent}
            </div>
        `;
        
        window.print();
        
        // প্রিন্ট শেষ হলে পেজ আবার আগের অবস্থায় ফেরত আনা (কোনো রিলোড ছাড়া)
        document.body.innerHTML = originalContent;
        
        // রিলোড ছাড়া কন্টেন্ট ব্যাক করার পর ইভেন্ট লিসেনারগুলো পুনরায় রি-বাইন্ড করা
        window.location.reload(); // রেন্ডারিং ঠিক রাখতে জাস্ট লাইভ সেশন অ্যাক্টিভ থাকবে
    });

    // লগআউট ফাংশন
    playerLogoutBtn.addEventListener("click", logoutUser);

    function logoutUser() {
        sessionStorage.clear();
        window.location.href = "index.html";
    }
});
