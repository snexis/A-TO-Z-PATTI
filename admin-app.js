/**
 * A to Z Patti - Master Admin Application Engine
 * FEATURES: Dual Login System (SMS + Direct Bypass), Hidden Password Fields, Real-time Dashboard
 */

(function() {
    if (!window.firebaseConfig) return console.error("🔒 Security Core: Config Missing!");
    if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
    
    const db = firebase.database();
    let authConfirmationResult = null;

    const adminAuthGateway = document.getElementById('admin-auth-gateway');
    const adminPhoneSection = document.getElementById('admin-phone-section');
    const adminOtpSection = document.getElementById('admin-otp-section');
    const adminMainDashboard = document.getElementById('admin-main-dashboard');

    // 🛡️ ফায়ারবেস রিক্যাপচা ইনিশিয়ালাইজেশন (ক্যাপচা মুক্ত ইনভিসিবল সেটিংস)
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible'
    });

    // ==========================================================================
    // 🔑 লগইন মেকানিজম (অপশন ১: লাইভ এসএমএস ওটিপি)
    // ==========================================================================
    document.getElementById('send-otp-btn').addEventListener('click', () => {
        const phoneNumber = document.getElementById('admin-phone-input').value.trim();
        if (!phoneNumber) return alert("অনুগ্রহ করে কান্ট্রি কোডসহ মোবাইল নম্বর দিন (+91...)");

        const appVerifier = window.recaptchaVerifier;
        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
                authConfirmationResult = confirmationResult;
                adminPhoneSection.classList.add('hidden-section');
                adminOtpSection.classList.remove('hidden-section');
                alert("আপনার মোবাইলে ওটিপি পাঠানো হয়েছে!");
            }).catch((error) => {
                console.error("SMS Error:", error);
                alert("ওটিপি পাঠানো যায়নি। ফায়ারবেস সেটিংস চেক করুন।");
            });
    });

    document.getElementById('verify-otp-btn').addEventListener('click', () => {
        const code = document.getElementById('admin-otp-input').value.trim();
        if (code.length !== 6) return alert("৬ ডিজিটের ওটিপি কোডটি দিন।");

        authConfirmationResult.confirm(code).then((result) => {
            enterDashboard();
        }).catch((error) => {
            alert("ভুল ওটিপি কোড! আবার চেষ্টা করুন।");
        });
    });

    // ==========================================================================
    // 🔑 লগইন মেকানিজম (অপশন ২: ডিরেক্ট ফিক্সড কোড বাইপাস)
    // ==========================================================================
    document.getElementById('direct-login-btn').addEventListener('click', () => {
        const phone = document.getElementById('direct-phone-input').value.trim();
        const code = document.getElementById('direct-code-input').value.trim();

        if (!phone || !code) return alert("ফোন নম্বর এবং ফিক্সড টেস্ট কোড দুটিই দিন।");

        const appVerifier = window.recaptchaVerifier;

        // ফায়ারবেসের অফিশিয়াল সাইন-ইন ফাংশন যা ফিক্সড টেস্ট নাম্বার রিড করে বাইপাস করবে
        firebase.auth().signInWithPhoneNumber(phone, appVerifier)
            .then((confirmationResult) => {
                return confirmationResult.confirm(code);
            })
            .then((result) => {
                enterDashboard();
            })
            .catch((error) => {
                console.error("Direct Login Error:", error);
                alert("লগইন ব্যর্থ! ফায়ারবেসে এই নম্বর ও কোডটি 'Test numbers' হিসেবে যুক্ত করা আছে তো?");
            });
    });

    function enterDashboard() {
        adminAuthGateway.classList.add('hidden-section');
        adminMainDashboard.classList.remove('hidden-section');
        alert("🔓 Master Admin Access Granted!");
        runMasterAdminEngine();
    }

    // ==========================================================================
    // 🎛️ মূল এডমিন ড্যাশবোর্ড লজিক
    // ==========================================================================
    function runMasterAdminEngine() {
        // ১. সিস্টেম সেটিংস রিড ও আপডেট
        db.ref('game_settings').on('value', (snapshot) => {
            const settings = snapshot.val() || {};
            if (settings.mode) document.getElementById('game-mode-select').value = settings.mode;
            if (settings.logo_url) document.getElementById('logo-url-input').value = settings.logo_url;
        });

        document.getElementById('update-settings-btn').addEventListener('click', () => {
            const selectMode = document.getElementById('game-mode-select').value;
            const logoUrl = document.getElementById('logo-url-input').value.trim();
            db.ref('game_settings').update({
                mode: selectMode,
                logo_url: logoUrl
            }).then(() => alert("সিস্টেম সেটিংস সফলভাবে আপডেট হয়েছে!"));
        });

        // ২. নতুন বাজি রাউন্ড তৈরি
        document.getElementById('create-bazi-btn').addEventListener('click', () => {
            const baziName = document.getElementById('new-bazi-name').value.trim();
            const baziTime = document.getElementById('new-bazi-time').value;

            if (!baziName || !baziTime) return alert("বাজির নাম এবং সময় দুটিই দিন।");
            
            const baziId = 'bazi_' + Date.now();
            db.ref('bazis/' + baziId).set({
                name: baziName,
                time: baziTime,
                status: "open",
                result_patti: "---",
                result_single: "-"
            }).then(() => {
                alert("নতুন বাজি সফলভাবে যোগ হয়েছে!");
                document.getElementById('new-bazi-name').value = '';
            });
        });

        // ৩. লাইভ বাজি ও পয়েন্ট মনিটরিং
        db.ref('bazis').on('value', (baziSnapshot) => {
            const tbody = document.getElementById('admin-bazi-list-body');
            tbody.innerHTML = '';
            const bazis = baziSnapshot.val();

            if (!bazis) {
                tbody.innerHTML = '<tr><td colspan="6">কোনো সচল বাজি নেই।</td></tr>';
                return;
            }

            Object.keys(bazis).forEach((baziId) => {
                const bazi = bazis[baziId];
                const tr = document.createElement('tr');
                const statusColor = bazi.status === 'open' ? 'var(--neon-green)' : 'var(--neon-red)';
                
                tr.innerHTML = `
                    <td><b>${bazi.name}</b></td>
                    <td>${bazi.time}</td>
                    <td style="color: ${statusColor}; font-weight:bold;">${bazi.status.toUpperCase()}</td>
                    <td id="total-points-${baziId}">Calculating...</td>
                    <td>
                        <input type="text" id="patti-${baziId}" placeholder="Patti" style="width:70px; margin-bottom:0; padding:5px;" value="${bazi.result_patti}">
                        <input type="text" id="single-${baziId}" placeholder="S" style="width:40px; margin-bottom:0; padding:5px;" value="${bazi.result_single}">
                    </td>
                    <td>
                        <button class="cyber-btn small-btn success-btn" onclick="declareBaziResult('${baziId}')" style="padding:6px 10px; width:auto; font-size:0.8rem;">Win</button>
                        <button class="cyber-btn small-btn" onclick="toggleBaziStatus('${baziId}', '${bazi.status}')" style="padding:6px 10px; width:auto; font-size:0.8rem; background:#64748b;">Lock</button>
                    </td>
                `;
                tbody.appendChild(tr);

                db.ref(`bets/${baziId}`).on('value', (betSnapshot) => {
                    let totalPoints = 0;
                    const bets = betSnapshot.val();
                    if (bets) {
                        Object.keys(bets).forEach(cell => {
                            Object.keys(bets[cell]).forEach(player => {
                                totalPoints += parseInt(bets[cell][player].points || 0);
                            });
                        });
                    }
                    document.getElementById(`total-points-${baziId}`).innerText = totalPoints + " Pts";
                });
            });
        });

        // ৪. ইউজার এপ্রুভাল এবং পয়েন্ট ম্যানেজার
        db.ref('users').on('value', (userSnapshot) => {
            const tbody = document.getElementById('admin-user-list-body');
            tbody.innerHTML = '';
            const users = userSnapshot.val();

            if (!users) {
                tbody.innerHTML = '<tr><td colspan="7">কোনো প্লেয়ার অ্যাকাউন্ট নেই।</td></tr>';
                return;
            }

            Object.keys(users).forEach((username) => {
                const user = users[username];
                if (user.role === 'admin') return;
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.pin}</td>
                    <td><input type="number" id="playpts-${username}" value="${user.play_points || 0}" style="width:75px; padding:5px; margin:0;"></td>
                    <td><input type="number" id="winpts-${username}" value="${user.win_points || 0}" style="width:75px; padding:5px; margin:0;"></td>
                    <td><span style="color:${user.status === 'approved' ? 'var(--neon-green)' : 'var(--neon-gold)'}">${user.status}</span></td>
                    <td><b style="color:var(--neon-cyan)">${user.verification_code || '---'}</b></td>
                    <td>
                        <button class="cyber-btn success-btn" onclick="approvePlayer('${username}')" style="padding:5px 8px; width:auto; font-size:0.8rem;">Approve</button>
                        <button class="cyber-btn" onclick="updatePlayerPoints('${username}')" style="padding:5px 8px; width:auto; font-size:0.8rem; background:linear-gradient(135deg, #7928CA, #FF0080);">Save Pts</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        });
    }

    window.approvePlayer = function(username) {
        const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
        db.ref('users/' + username).update({
            status: "approved",
            verification_code: generatedCode
        }).then(() => alert(`${username} অ্যাকাউন্টটি এপ্রুভ হয়েছে! কোড: ${generatedCode}`));
    };

    window.updatePlayerPoints = function(username) {
        const playPts = parseInt(document.getElementById(`playpts-${username}`).value) || 0;
        const winPts = parseInt(document.getElementById(`winpts-${username}`).value) || 0;
        db.ref('users/' + username).update({ play_points: playPts, win_points: winPts })
            .then(() => alert(`${username} এর পয়েন্ট আপডেট সফল!`));
    };

    window.toggleBaziStatus = function(baziId, currentStatus) {
        const nextStatus = currentStatus === 'open' ? 'closed' : 'open';
        db.ref(`bazis/${baziId}`).update({ status: nextStatus });
    };

    window.declareBaziResult = function(baziId) {
        db.ref('game_settings/mode').once('value').then((modeSnapshot) => {
            const currentMode = modeSnapshot.val() || 'manual';
            if (currentMode === 'manual') {
                const patti = document.getElementById(`patti-${baziId}`).value.trim();
                const single = document.getElementById(`single-${baziId}`).value.trim();
                executeResultPublish(baziId, patti, single);
            } else {
                db.ref(`bets/${baziId}`).once('value').then((betSnapshot) => {
                    const bets = betSnapshot.val();
                    let winPatti = "123", winSingle = "6";
                    if (bets) {
                        let minPoints = Infinity;
                        Object.keys(bets).forEach(cellId => {
                            let cellTotal = 0;
                            Object.keys(bets[cellId]).forEach(p => { cellTotal += parseInt(bets[cellId][p].points || 0); });
                            if (cellTotal < minPoints) {
                                minPoints = cellTotal;
                                winPatti = "ABC-" + cellId; 
                                winSingle = cellId.split('-')[1] || "0";
                            }
                        });
                    }
                    executeResultPublish(baziId, winPatti, winSingle);
                });
            }
        });
    };

    function executeResultPublish(baziId, patti, single) {
        db.ref(`bazis/${baziId}`).update({ status: "closed", result_patti: patti, result_single: single });
        db.ref('game_settings/live_result').set({
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            patti: patti,
            single: single
        }).then(() => alert(`ফলাফল প্রকাশ হয়েছে! পাত্তি: ${patti}, সিঙ্গেল: ${single}`));
    }
})();
