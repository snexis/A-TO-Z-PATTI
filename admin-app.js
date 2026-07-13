/**
 * A to Z Patti - Master Admin Application Engine
 * FULL AND COMPLETE CODE
 */

(function() {
    if (!window.firebaseConfig) return console.error("🔒 Security Core: Config Missing!");
    if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
    
    const db = firebase.database();
    const adminAuthGateway = document.getElementById('admin-auth-gateway');
    const adminMainDashboard = document.getElementById('admin-main-dashboard');

    // রিক্যাপচা ভেরিফায়ার (টেস্ট নম্বরের জন্য ইনভিজিবল মোড)
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('master-login-btn', {
        'size': 'invisible'
    });

    // লগইন লজিক
    if (document.getElementById('master-login-btn')) {
        document.getElementById('master-login-btn').addEventListener('click', () => {
            const rawPhone = document.getElementById('master-phone-input').value.trim();
            const code = document.getElementById('master-code-input').value.trim();

            if (!rawPhone || rawPhone.length !== 10) return alert("১০ ডিজিটের মোবাইল নম্বর দিন।");
            if (!code) return alert("পিন কোড দিন।");

            const fullPhoneNumber = "+91" + rawPhone;
            
            firebase.auth().signInWithPhoneNumber(fullPhoneNumber, window.recaptchaVerifier)
                .then((confirmationResult) => {
                    return confirmationResult.confirm(code);
                })
                .then((result) => {
                    enterDashboard();
                })
                .catch((error) => {
                    console.error("Login Engine Error:", error);
                    alert("লগইন ব্যর্থ! নম্বর বা কোড চেক করুন।");
                });
        });
    }

    function enterDashboard() {
        if (adminAuthGateway) adminAuthGateway.classList.add('hidden-section');
        if (adminMainDashboard) adminMainDashboard.classList.remove('hidden-section');
        alert("🔓 Master Admin Access Granted!");
        runMasterAdminEngine();
    }

    // ড্যাশবোর্ড ইঞ্জিন
    function runMasterAdminEngine() {
        // গেম সেটিংস লোড
        db.ref('game_settings').on('value', (snapshot) => {
            const settings = snapshot.val() || {};
            if (settings.mode && document.getElementById('game-mode-select')) {
                document.getElementById('game-mode-select').value = settings.mode;
            }
            if (settings.logo_url && document.getElementById('logo-url-input')) {
                document.getElementById('logo-url-input').value = settings.logo_url;
            }
        });

        // সেটিংস আপডেট বাটন
        if (document.getElementById('update-settings-btn')) {
            document.getElementById('update-settings-btn').addEventListener('click', () => {
                const selectMode = document.getElementById('game-mode-select').value;
                const logoUrl = document.getElementById('logo-url-input').value.trim();
                db.ref('game_settings').update({ mode: selectMode, logo_url: logoUrl })
                    .then(() => alert("সিস্টেম সেটিংস আপডেট হয়েছে!"));
            });
        }

        // বাজি তৈরি বাটন
        if (document.getElementById('create-bazi-btn')) {
            document.getElementById('create-bazi-btn').addEventListener('click', () => {
                const baziName = document.getElementById('new-bazi-name').value.trim();
                const baziTime = document.getElementById('new-bazi-time').value;
                if (!baziName || !baziTime) return alert("বাজির নাম ও সময় দিন।");
                
                const baziId = 'bazi_' + Date.now();
                db.ref('bazis/' + baziId).set({
                    name: baziName, time: baziTime, status: "open",
                    result_patti: "---", result_single: "-"
                }).then(() => alert("নতুন বাজি তৈরি হয়েছে!"));
            });
        }

        // বাজি লিস্ট লোড
        db.ref('bazis').on('value', (baziSnapshot) => {
            const tbody = document.getElementById('admin-bazi-list-body');
            if (!tbody) return;
            tbody.innerHTML = '';
            const bazis = baziSnapshot.val();
            if (bazis) {
                Object.keys(bazis).forEach((baziId) => {
                    const bazi = bazis[baziId];
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><b>${bazi.name}</b></td>
                        <td>${bazi.time}</td>
                        <td>${bazi.status.toUpperCase()}</td>
                        <td id="total-points-${baziId}">Calculating...</td>
                        <td>
                            <input type="text" id="patti-${baziId}" value="${bazi.result_patti}" style="width:60px">
                            <input type="text" id="single-${baziId}" value="${bazi.result_single}" style="width:30px">
                        </td>
                        <td>
                            <button class="cyber-btn" onclick="declareBaziResult('${baziId}')">Win</button>
                            <button class="cyber-btn" onclick="toggleBaziStatus('${baziId}', '${bazi.status}')">Lock</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        });

        // ইউজার লিস্ট লোড
        db.ref('users').on('value', (userSnapshot) => {
            const tbody = document.getElementById('admin-user-list-body');
            if (!tbody) return;
            tbody.innerHTML = '';
            const users = userSnapshot.val();
            if (users) {
                Object.keys(users).forEach((username) => {
                    const user = users[username];
                    if (user.role === 'admin') return;
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${user.username}</td>
                        <td>${user.pin}</td>
                        <td><input type="number" id="playpts-${username}" value="${user.play_points || 0}" style="width:50px"></td>
                        <td><input type="number" id="winpts-${username}" value="${user.win_points || 0}" style="width:50px"></td>
                        <td>${user.status}</td>
                        <td>
                            <button class="cyber-btn" onclick="approvePlayer('${username}')">Approve</button>
                            <button class="cyber-btn" onclick="updatePlayerPoints('${username}')">Save</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        });
    }

    // গ্লোবাল হেল্পার ফাংশন (উইন্ডো অবজেক্টে সেট করা যাতে HTML থেকে কল করা যায়)
    window.approvePlayer = function(username) {
        const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
        db.ref('users/' + username).update({ status: "approved", verification_code: generatedCode })
            .then(() => alert("এপ্রুভ হয়েছে!"));
    };

    window.updatePlayerPoints = function(username) {
        const playPts = parseInt(document.getElementById(`playpts-${username}`).value) || 0;
        const winPts = parseInt(document.getElementById(`winpts-${username}`).value) || 0;
        db.ref('users/' + username).update({ play_points: playPts, win_points: winPts })
            .then(() => alert("পয়েন্ট আপডেট সফল!"));
    };

    window.toggleBaziStatus = function(baziId, currentStatus) {
        const nextStatus = currentStatus === 'open' ? 'closed' : 'open';
        db.ref(`bazis/${baziId}`).update({ status: nextStatus });
    };

    window.declareBaziResult = function(baziId) {
        const patti = document.getElementById(`patti-${baziId}`).value.trim();
        const single = document.getElementById(`single-${baziId}`).value.trim();
        db.ref(`bazis/${baziId}`).update({ status: "closed", result_patti: patti, result_single: single })
            .then(() => alert("ফলাফল প্রকাশ হয়েছে!"));
    };
})();
