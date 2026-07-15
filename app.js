// ==========================================
// ATOZ BOMBAY - CORE SESSION & LOGIN ENGINE (v4.9)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // DOM এলিমেন্টসমূহ সিলেক্ট করা
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const savePasswordBtn = document.getElementById("savePasswordBtn");
    const loginSubmitBtn = document.getElementById("loginSubmitBtn");
    
    const approvalNoticeBox = document.getElementById("approvalNoticeBox");
    const noticeText = document.getElementById("noticeText");
    const verificationGate = document.getElementById("verificationGate");
    const adminApprovalCode = document.getElementById("adminApprovalCode");
    const verifyCodeBtn = document.getElementById("verifyCodeBtn");

    // [পাসওয়ার্ড সেভ মেকানিজম]: পেজ লোড হলে লোকাল স্টোরেজ চেক করা
    if (localStorage.getItem("rememberMe") === "true") {
        usernameInput.value = localStorage.getItem("savedUsername") || "";
        passwordInput.value = localStorage.getItem("savedPassword") || "";
        savePasswordBtn.checked = true;
    }

    // লগইন বাটন ক্লিক অ্যাকশন
    loginSubmitBtn.addEventListener("click", handleLogin);

    // [কিবোর্ড এন্টার লজিক]: ইনপুট ফিল্ডে এন্টার চাপলে লগইন হবে
    usernameInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleLogin();
    });
    passwordInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleLogin();
    });

    // কোর লগইন ফাংশন (লুপ-ফ্রি সিঙ্গেল থ্রেড লজিক)
    function handleLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert("অনুগ্রহ করে ইউজার আইডি এবং পাসওয়ার্ড দুটিই লিখুন।");
            return;
        }

        // পাসওয়ার্ড সেভ করার টিক চিহ্ন চেক করা
        if (savePasswordBtn.checked) {
            localStorage.setItem("savedUsername", username);
            localStorage.setItem("savedPassword", password);
            localStorage.setItem("rememberMe", "true");
        } else {
            localStorage.removeItem("savedUsername");
            localStorage.removeItem("savedPassword");
            localStorage.setItem("rememberMe", "false");
        }

        // বাটন ডিজেবল করা যাতে বারবার ক্লিক করে লুপ তৈরি না হয়
        loginSubmitBtn.disabled = true;
        loginSubmitBtn.innerText = "ভেরিফাই হচ্ছে...";

        // ফায়ারবেস ডেটাবেস থেকে ইউজার চেক করা
        const userRef = window.db.ref("users/" + username);
        userRef.once("value")
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    alert("ভুল ইউজার আইডি! আবার চেষ্টা করুন।");
                    resetLoginButton();
                    return;
                }

                const userData = snapshot.val();

                // পাসওয়ার্ড/পিন ম্যাচিং
                if (userData.password !== password) {
                    alert("ভুল সিকিউরিটি পিন! সঠিক পিন দিন।");
                    resetLoginButton();
                    return;
                }

                // অ্যাকাউন্ট স্ট্যাটাস চেক (Active/Blocked)
                if (userData.status === "blocked") {
                    alert("আপনার অ্যাকাউন্টটি ব্লক করা আছে। অ্যাডমিনের সাথে যোগাযোগ করুন।");
                    resetLoginButton();
                    return;
                }

                // রোল (Role) অনুযায়ী ড্যাশবোর্ডে পাঠানো (লুপ ছাড়া ডাইরেক্ট রাউটিং)
                processUserRole(username, userData);
            })
            .catch((error) => {
                console.error("Database Error:", error);
                alert("সার্ভার কানেকশন ত্রুটি! পরে চেষ্টা করুন।");
                resetLoginButton();
            });
    }

    // রোল প্রসেসিং ও টু-স্টেপ ভেরিফিকেশন গেট
    function processUserRole(username, userData) {
        // যদি অ্যাডমিন বা সাব-অ্যাডমিন হয়, সরাসরি রিডাইরেক্ট
        if (userData.role === "admin" || userData.role === "subadmin") {
            sessionStorage.setItem("currentUser", JSON.stringify({ username, role: userData.role }));
            window.location.href = "admin.html";
        } 
        // যদি সাধারণ প্লেয়ার হয়, তবে অ্যাডমিন এপ্রুভাল নোটিশ জোন অ্যাক্টিভ হবে
        else if (userData.role === "player") {
            approvalNoticeBox.classList.remove("hidden");
            
            // রিয়েল-টাইম লিসেনার (অ্যাডমিন এপ্রুভ করলে অটো গেম ওপেন হবে)
            window.db.ref("users/" + username + "/approved").on("value", (statusSnapshot) => {
                if (statusSnapshot.val() === true) {
                    sessionStorage.setItem("currentUser", JSON.stringify({ username, role: "player" }));
                    window.location.href = "player.html";
                } else {
                    noticeText.innerText = "অ্যাডমিনের অনুমোদনের জন্য অপেক্ষা করা হচ্ছে...";
                    verificationGate.classList.remove("hidden");
                }
            });

            // কোড ভেরিফিকেশন বাটন অ্যাকশন (ম্যানুয়াল কোড এন্ট্রি)
            verifyCodeBtn.onclick = () => {
                const inputCode = adminApprovalCode.value.trim();
                if (inputCode === userData.secretKey) {
                    // কোড মিলে গেলে এপ্রুভাল ট্রু করে দেওয়া
                    window.db.ref("users/" + username).update({ approved: true })
                        .then(() => {
                            sessionStorage.setItem("currentUser", JSON.stringify({ username, role: "player" }));
                            window.location.href = "player.html";
                        });
                } else {
                    alert("ভুল সিকিউরিটি কোড!");
                }
            };
        }
    }

    // বাটন রিসেট ফাংশন
    function resetLoginButton() {
        loginSubmitBtn.disabled = false;
        loginSubmitBtn.innerText = "লগইন করুন";
    }
});
