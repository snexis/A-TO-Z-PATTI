/**
 * A to Z Patti - Master Admin Application Engine
 * Clean Single Form Submission with Fixed Country Code Verification
 */

(function() {
    if (!window.firebaseConfig) return console.error("🔒 Security Core: Config Missing!");
    if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
    
    const db = firebase.database();

    const adminAuthGateway = document.getElementById('admin-auth-gateway');
    const adminMainDashboard = document.getElementById('admin-main-dashboard');

    // 🛡️ রিক্যাপচা অদৃশ্য কনফিগারেশন
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible'
    });

    // ==========================================================================
    // 🔑 সিঙ্গেল ইন্টারফেস লগইন লজিক (আপনার নোট অনুসারে)
    // ==========================================================================
    if (document.getElementById('master-login-btn')) {
        document.getElementById('master-login-btn').addEventListener('click', () => {
            const rawPhone = document.getElementById('master-phone-input').value.trim();
            const code = document.getElementById('master-code-input').value.trim();

            if (!rawPhone || rawPhone.length !== 10) {
                return alert("অনুগ্রহ করে আপনার ১০ ডিজিটের মোবাইল নম্বরটি সঠিকভাবে দিন।");
            }
            if (!code) {
                return alert("দয়া করে পিন বা কোডটি ইনপুট করুন।");
            }

            // ফিক্সড কান্ট্রি কোড +91 যুক্ত করে পূর্ণ নম্বর তৈরি
            const fullPhoneNumber = "+91" + rawPhone;
            const appVerifier = window.recaptchaVerifier;

            // ফায়ারবেস অথেনটিকেশন সাবমিশন
            firebase.auth().signInWithPhoneNumber(fullPhoneNumber, appVerifier)
                .then((confirmationResult) => {
                    return confirmationResult.confirm(code);
                })
                .then((result) => {
                    enterDashboard();
                })
                .catch((error) => {
                    console.error("Login Engine Error:", error);
                    if(error.code === "auth/too-many-requests") {
                        alert("ফায়ারবেস সিকিউরিটি ব্লক! অতিরিক্ত চেষ্টার কারণে সাময়িক ব্লক করা হয়েছে। অনুগ্রহ করে কিছু সময় পর চেষ্টা করুন অথবা অন্য কোনো টেস্ট নম্বর ফায়ারবেস কনসোলে যোগ করে ট্রাই করুন।");
                    } else {
                        alert("লগইন ব্যর্থ! আপনার দেওয়া নম্বর অথবা কোডটি ফায়ারবেসের 'Test numbers' এ যুক্ত করা আছে তো?");
                    }
                });
        });
    }

    function enterDashboard() {
        if (adminAuthGateway) adminAuthGateway.classList.add('hidden-section');
        if (adminMainDashboard) adminMainDashboard.classList.remove('hidden-section');
        alert("🔓 Master Admin Access Granted!");
        runMasterAdminEngine();
    }

    // ==========================================================================
    // 🎛️ মূল ড্যাশবোর্ড ডেটা লুপ ও কন্ট্রোল
    // ==========================================================================
    function runMasterAdminEngine() {
        db.ref('game_settings').on('value', (snapshot) => {
            const settings = snapshot.val() || {};
            if (settings.mode && document.getElementById('game-mode-select')) {
                document.getElementById('game-mode-select').value = settings.mode;
            }
            if (settings.logo_url && document.getElementById('logo-url-input')) {
                document.getElementById('logo-url-input').value = settings.logo_url;
            }
        });

        if (document.getElementById('update-settings-btn')) {
            document.getElementById('update-settings-btn').addEventListener('click', () => {
                const selectMode = document.getElementById('game-mode-select').value;
                const logoUrl = document.getElementById('logo-url-input').value.trim();
                db.ref('game_settings').update({ mode: selectMode, logo_url: logoUrl })
                    .then(() => alert("সিস্টেম সেটিংস সফলভাবে আপডেট হয়েছে!"));
            });
        }

        if (document.getElementById('create-bazi-btn')) {
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
        }

        db.ref('bazis').on('value', (baziSnapshot) => {
            const tbody = document.getElementById('admin-bazi-list-body');
            if (!tbody) return;
            tbody.innerHTML = '';
            const bazis = baziSnapshot.val();

            if (!bazis) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">কোনো সচল বাজি নেই।</td></tr>';
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
                        <input type="text" id="patti-${baziId}" style="width:70px; padding:5px; margin:0;" value="${bazi.result_patti}">
                        <input type="text" id="single-${baziId}" style="width:40px; padding:5px; margin:0;" value="${bazi.result_single}">
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
                    const pointsField = document.getElementById(`total-points-${baziId}`);
                    if (pointsField) pointsField.innerText = totalPoints + " Pts";
                });
            });
        });

        db.ref('users').on('value', (userSnapshot) => {
            const tbody = document.getElementById('admin-user-list-body');
            if (!tbody) return;
            tbody.innerHTML = '';
            const users = userSnapshot.val();

            if (!users) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center">কোনো প্লেয়ার অ্যাকাউন্ট নেই।</td></tr>';
                return;
            }

            Object.keys(users).forEach((username) => {
                const user = users[username];
                if (user.role === 'admin') return;
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.pin}</td>
                    <td><input type="number" id="playpts-${username}" value="${user.play_points || 0}" style="width:65px; padding:5px; margin:0;"></td>
                    <td><input type="number" id="winpts-${username}" value="${user.win_points || 0}" style="width:65px; padding:5px; margin:0;"></td>
                    <td><span style="color:${user.status === 'approved' ? 'var(--neon-green)' : 'var(--neon-gold)'}">${user.status}</span></td>
                    <td><b style="color:var(--neon-cyan)">${user.verification_code || '---'}</b></td>
                    <td>
                        <button class="cyber-btn success-btn" onclick="approvePlayer('${username}')" style="padding:5px 8px; width:auto; font-size:0.8rem;">Approve</button>
                        <button class="cyber-btn" onclick="updatePlayerPoints('${username}')" style="padding:5px 8px; width:auto; font-size:0.8rem; background:linear-gradient(135deg, #7928CA, #FF0080);">Save</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        });
    }

    window.approvePlayer = function(username) {
        const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
        db.ref('users/' + username).update({ status: "approved", verification_code: generatedCode })
            .then(() => alert(`${username} অ্যাকাউন্টটি এপ্রুভ হয়েছে!`));
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
        db.ref(`bazis/${baziId}`).update({ status: "closed", result_patti: patti, result_single: single });
        db.ref('game_settings/live_result').set({
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            patti: patti,
            single: single
        }).then(() => alert("ফলাফল প্রকাশ হয়েছে!"));
    };
})();
