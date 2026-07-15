// ==========================================
// ATOZ BOMBAY - ADMIN CONTROL LOGIC (v4.9)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // সেশন চেক: লগইন ছাড়া কেউ ঢুকতে পারবে না
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "subadmin")) {
        alert("অননুমোদিত প্রবেশ! লগইন পেজে রিডাইরেক্ট করা হচ্ছে।");
        window.location.href = "index.html";
        return;
    }

    // অ্যাডমিনের নাম ডিসপ্লে করা
    document.getElementById("adminNameDisplay").innerText = `${currentUser.username} (${currentUser.role.toUpperCase()})`;

    // DOM এলিমেন্টসমূহ
    const submitCreateUserBtn = document.getElementById("submitCreateUserBtn");
    const updateChartBtn = document.getElementById("updateChartBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const playerTableBody = document.getElementById("playerTableBody");

    // লাইভ কাউন্টার এলিমেন্টসমূহ
    const totalPlayersCount = document.getElementById("totalPlayersCount");
    const activePlayersCount = document.getElementById("activePlayersCount");
    const blockedPlayersCount = document.getElementById("blockedPlayersCount");

    // ==========================================
    // ১. রিয়েল-টাইম প্লেয়ার লিস্ট ও কাউন্টার (No Refresh)
    // ==========================================
    window.db.ref("users").on("value", (snapshot) => {
        playerTableBody.innerHTML = ""; // টেবিল ক্লিয়ার করা (ডুপ্লিকেট এড়াতে)
        
        let total = 0;
        let active = 0;
        let blocked = 0;

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const username = childSnapshot.key;
                const user = childSnapshot.val();

                // কাউন্টার হিসাব
                if (user.role === "player") {
                    total++;
                    if (user.status === "active") active++;
                    if (user.status === "blocked") blocked++;

                    // টেবিলে রো (Row) তৈরি করা
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td><strong>${username}</strong></td>
                        <td>${user.role}</td>
                        <td><span class="code-badge">${user.secretKey || 'N/A'}</span></td>
                        <td><span class="lang-badge">${user.language === 'en' ? 'English' : 'বাংলা'}</span></td>
                        <td>
                            <span class="status-tag ${user.approved ? 'status-approved' : 'status-pending'}">
                                ${user.approved ? 'অনুমোদিত' : 'অপেক্ষমাণ'}
                            </span>
                        </td>
                        <td>
                            <button class="btn-action btn-approve" data-id="${username}" ${user.approved ? 'disabled' : ''}>এপ্রুভ</button>
                            <button class="btn-action ${user.status === 'active' ? 'btn-block' : 'btn-unblock'}" data-id="${username}">
                                ${user.status === 'active' ? 'ব্লক' : 'আনব্লক'}
                            </button>
                            <button class="btn-action btn-delete" data-id="${username}">ডিলিট</button>
                        </td>
                    `;
                    playerTableBody.appendChild(row);
                }
            });
        }

        // কাউন্টার আপডেট
        totalPlayersCount.innerText = total;
        activePlayersCount.innerText = active;
        blockedPlayersCount.innerText = blocked;

        // টেবিলের অ্যাকশন বাটনগুলোতে ইভেন্ট লিসেনার সেট করা
        attachTableButtonListeners();
    });

    // ==========================================
    // ২. নতুন ইউজার/প্লেয়ার আইডি তৈরি (Language Bypass Logic)
    // ==========================================
    submitCreateUserBtn.addEventListener("click", () => {
        const username = document.getElementById("newUsername").value.trim();
        const password = document.getElementById("newPassword").value.trim();
        const role = document.getElementById("userRole").value;
        const language = document.getElementById("userLanguage").value; // [নতুন ভাষা ইনপুট]

        if (!username || !password) {
            alert("সবগুলো ফিল্ড সঠিকভাবে পূরণ করুন।");
            return;
        }

        submitCreateUserBtn.disabled = true;

        // ৪ ডিজিটের ইউনিক সিক্রেট ভেরিফিকেশন কোড জেনারেট করা
        const generatedSecretKey = Math.floor(1000 + Math.random() * 9000).toString();

        // ফায়ারবেস ডেটাবেসে পাঠানো (ভাষা অপশনসহ)
        const newUserData = {
            password: password,
            role: role,
            status: "active",
            approved: role === "subadmin", // সাব-অ্যাডমিন হলে অটো এপ্রুভড, প্লেয়ার হলে ফলস
            secretKey: generatedSecretKey,
            language: language // [ফায়ারবেসে সেভ হওয়ার জন্য ভাষা যুক্ত করা হলো]
        };

        window.db.ref("users/" + username).set(newUserData)
            .then(() => {
                alert(`আইডি সফলভাবে তৈরি হয়েছে!\nভাষা: ${language === 'en' ? 'English' : 'Bengali'}\nকোড: ${generatedSecretKey}`);
                document.getElementById("createUserForm").reset();
                submitCreateUserBtn.disabled = false;
            })
            .catch((err) => {
                console.error(err);
                alert("আইডি তৈরিতে সমস্যা হয়েছে।");
                submitCreateUserBtn.disabled = false;
            });
    });

    // ==========================================
    // ৩. লাইভ গেম চার্ট ও রেজাল্ট আপডেট
    // ==========================================
    updateChartBtn.addEventListener("click", () => {
        const timeSlot = document.getElementById("gameTimeSlot").value.trim();
        const winningNumber = document.getElementById("winningNumber").value.trim();

        if (!timeSlot || !winningNumber) {
            alert("সময় এবং উইনিং নাম্বার দুটিই দিন।");
            return;
        }

        updateChartBtn.disabled = true;

        window.db.ref("gameChart/" + timeSlot).set({
            result: winningNumber,
            timestamp: Date.now()
        })
        .then(() => {
            alert("গেম চার্ট সফলভাবে আপডেট হয়েছে!");
            document.getElementById("gameDataForm").reset();
            updateChartBtn.disabled = false;
        })
        .catch((err) => {
            alert("চার্ট আপডেটে ত্রুটি!");
            updateChartBtn.disabled = false;
        });
    });

    // ==========================================
    // ৪. টেবিল অ্যাকশন ফাংশনালিটি (Approve, Block, Delete)
    // ==========================================
    function attachTableButtonListeners() {
        document.querySelectorAll(".btn-approve").forEach(btn => {
            btn.onclick = (e) => {
                const id = e.target.getAttribute("data-id");
                window.db.ref("users/" + id).update({ approved: true });
            };
        });

        document.querySelectorAll(".btn-block, .btn-unblock").forEach(btn => {
            btn.onclick = (e) => {
                const id = e.target.getAttribute("data-id");
                const currentStatus = e.target.classList.contains("btn-block") ? "active" : "blocked";
                const nextStatus = currentStatus === "active" ? "blocked" : "active";
                window.db.ref("users/" + id).update({ status: nextStatus });
            };
        });

        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.onclick = (e) => {
                const id = e.target.getAttribute("data-id");
                if (confirm(`আপনি কি নিশ্চিতভাবে ${id} আইডিটি ডিলিট করতে চান?`)) {
                    window.db.ref("users/" + id).remove();
                }
            };
        });
    }

    // লগআউট লজিক
    logoutBtn.addEventListener("click", () => {
        sessionStorage.clear();
        window.location.href = "index.html";
    });
});
