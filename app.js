/**
 * A to Z Patti - Core Player Application Engine
 * FEATURES: Dynamic 22-Row Matrix, Midnight Auto-Lock, Anti-Tamper Sync
 */

(function() {
    // ফায়ারবেস কনফিগারেশন চেক
    if (!window.firebaseConfig) {
        console.error("🔒 Security Core: Configuration missing!");
        return;
    }

    // ফায়ারবেস ইনিশিয়ালাইজেশন (CDN মোডের জন্য ব্যাকআপ ভেরিফিকেশনসহ)
    if (!firebase.apps.length) {
        firebase.initializeApp(window.firebaseConfig);
    }
    
    const db = firebase.database();
    let currentBaziId = null;
    let selectedCell = null;
    let localPlayerId = null;

    // DOM এলিমেন্টস (স্ক্রিন কন্ট্রোল করার চাবি)
    const authGateway = document.getElementById('auth-gateway');
    const loginFields = document.getElementById('login-fields');
    const verificationFields = document.getElementById('verification-fields');
    const midnightLockNotice = document.getElementById('midnight-lock-notice');
    const mainGameDashboard = document.getElementById('main-game-dashboard');
    
    // ইনপুট ও বাটনসমূহ
    const usernameInput = document.getElementById('login-username');
    const pinInput = document.getElementById('login-pin');
    const dailyAuthCodeInput = document.getElementById('daily-auth-code');
    const loginBtn = document.getElementById('action-login-btn');
    const verifyBtn = document.getElementById('action-verify-btn');

    // --- 🔑 পার্ট ১: কাস্টম লগইন এবং ডেইলি ভেরিফিকেশন লজিক ---
    
    loginBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim().toLowerCase();
        const pin = pinInput.value.trim();

        if (!username || pin.length !== 4) {
            alert("অনুগ্রহ করে সঠিক ইউজার নাম এবং ৪ ডিজিটের পিন দিন।");
            return;
        }

        // ফায়ারবেস ডাটাবেসে প্লেয়ার অ্যাকাউন্ট চেক বা নতুন রিকোয়েস্ট পাঠানো
        const userRef = db.ref('users/' + username);
        userRef.once('value').then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData.pin === pin) {
                    localPlayerId = username;
                    processUserStatus(userData.status);
                } else {
                    alert("ভুল পিন নম্বর! আবার চেষ্টা করুন।");
                }
            } else {
                // নতুন প্লেয়ার হলে ফায়ারবেসে রিকোয়েস্ট টেবিলে ডেটা পাঠানো
                localPlayerId = username;
                userRef.set({
                    username: username,
                    pin: pin,
                    status: "pending",
                    verification_code: "",
                    play_points: 0,
                    win_points: 0,
                    role: "player"
                }).then(() => {
                    processUserStatus("pending");
                });
            }
        });
    });

    function processUserStatus(status) {
        // রাত ১২টার সময় চেক করা
        const currentHour = new Date().getHours();
        if (currentHour === 0) { // 0 মানে রাত ১২টা থেকে ১টা
            loginFields.classList.add('hidden-section');
            verificationFields.classList.add('hidden-section');
            midnightLockNotice.classList.remove('hidden-section');
            return;
        }

        if (status === "approved") {
            // যদি আগে থেকেই এপ্রুভ থাকে, তবে সরাসরি ওটিপি/কোড বক্সে নিয়ে যাওয়া
            loginFields.classList.add('hidden-section');
            verificationFields.classList.remove('hidden-section');
        } else {
            loginFields.classList.add('hidden-section');
            verificationFields.classList.remove('hidden-section');
        }
    }

    verifyBtn.addEventListener('click', () => {
        const inputCode = dailyAuthCodeInput.value.trim();
        if (!inputCode) return alert("ভেরিফিকেশন কোডটি লিখুন।");

        db.ref('users/' + localPlayerId).once('value').then((snapshot) => {
            const userData = snapshot.val();
            // এডমিনের জেনারেট করা কোডের সাথে মিললে গেম বোর্ড আনলক হবে
            if (userData.verification_code === inputCode && userData.status === "approved") {
                authGateway.classList.add('hidden-section');
                mainGameDashboard.classList.remove('hidden-section');
                initializeGameBoard();
            } else {
                alert("ভেরিফিকেশন কোড মেলেনি অথবা এডমিন এখনো এপ্রুভ করেনি।");
            }
        });
    });

    // --- 🎮 পার্ট ২: ডাইনামিক গেম বোর্ড ও ২২ লাইনের চার্ট মেকার ---
    
    function initializeGameBoard() {
        document.getElementById('display-player-name').innerText = localPlayerId.toUpperCase();
        
        // প্লেয়ারের লাইভ পয়েন্ট ট্র্যাকিং (রিয়েল-টাইম সিঙ্ক)
        db.ref('users/' + localPlayerId).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                document.getElementById('points-play').innerText = data.play_points || 0;
                document.getElementById('points-win').innerText = data.win_points || 0;
            }
        });

        // লাইভ বাজি লিস্ট লোড করা
        db.ref('bazis').on('value', (snapshot) => {
            const baziWrapper = document.getElementById('dynamic-bazi-wrapper');
            baziWrapper.innerHTML = '';
            const bazis = snapshot.val();
            
            if (!bazis) {
                baziWrapper.innerHTML = '<p class="info-text">No active bazi right now.</p>';
                return;
            }

            Object.keys(bazis).forEach((key) => {
                const bazi = bazis[key];
                const btn = document.createElement('div');
                btn.className = `bazi-btn ${currentBaziId === key ? 'active' : ''}`;
                btn.innerText = `${bazi.name}\n(${bazi.time})`;
                btn.addEventListener('click', () => {
                    currentBaziId = key;
                    document.querySelectorAll('.bazi-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
                baziWrapper.appendChild(btn);
            });
        });

        // লাইভ বোর্ড রেজাল্ট সিঙ্ক
        db.ref('game_settings/live_result').on('value', (snapshot) => {
            const result = snapshot.val() || { time: "--:--", patti: "---", single: "-" };
            document.getElementById('board-time').innerText = result.time;
            document.getElementById('board-patti').innerText = result.patti;
            document.getElementById('board-single').innerText = result.single;
        });

        buildMatrix22Rows();
    }

    // রহস্যময় ২২ লাইনের ডাইনামিক চার্ট তৈরির ফাংশন
    function buildMatrix22Rows() {
        const tableBody = document.getElementById('game-matrix-body');
        tableBody.innerHTML = '';
        
        // ২২টি লাইনের জন্য ইউনিক অ্যালফাবেট বা নাম জেনারেটর
        const rowLabels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V"];
        
        rowLabels.forEach((label) => {
            const tr = document.createElement('tr');
            for (let col = 1; col <= 10; col++) {
                const td = document.createElement('td');
                td.className = "clickable-cell";
                const cellId = `${label}-${col === 10 ? 0 : col}`;
                td.innerText = cellId;
                
                td.addEventListener('click', () => {
                    document.querySelectorAll('.clickable-cell').forEach(c => c.classList.remove('selected-target'));
                    td.classList.add('selected-target');
                    selectedCell = cellId;
                    document.getElementById('current-selected-cell').innerText = selectedCell;
                });
                tr.appendChild(td);
            }
            tableBody.appendChild(tr);
        });
    }

    // --- 🪙 পার্ট ৩: বাজি সাবমিট করা ---
    
    document.getElementById('submit-bet-btn').addEventListener('click', () => {
        const amount = parseInt(document.getElementById('bet-amount-input').value);
        if (!currentBaziId) return alert("অনুগ্রহ করে প্রথমে একটি সচল বাজি সিলেক্ট করুন।");
        if (!selectedCell) return alert("বোর্ড থেকে আপনার টার্গেট ঘরটি সিলেক্ট করুন।");
        if (isNaN(amount) || amount <= 0) return alert("সঠিক পয়েন্টের পরিমাণ লিখুন।");

        // সিকিউর ডাটাবেস রাইটিং (ফায়ারবেস রুলস এটি ভেরিফাই করবে)
        const betRef = db.ref(`bets/${currentBaziId}/${selectedCell}/${localPlayerId}`);
        betRef.set({
            player: localPlayerId,
            points: amount,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            alert(`সফলভাবে ${amount} পয়েন্ট বাজি ধরা হয়েছে ${selectedCell} এ!`);
            document.getElementById('bet-amount-input').value = '';
        }).catch((error) => {
            alert("বাজি ধরা যায়নি! সম্ভবত বাজিটি ক্লোজড বা আপনার আইডি লকড।");
        });
    });

})();
