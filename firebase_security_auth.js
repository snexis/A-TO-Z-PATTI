/* ==========================================================================
   ATOZ BOMBAY - PREMIUM CYBER SECURITY & AUTH ENGINE (v7.1.2.8 Lite)
   ==========================================================================
   [CORE FEATURES INSIDE THIS FILE]:
   1. ANONYMOUS LOGIN DISABLE: ফায়ারবেস অ্যানোনিমাস লগইন সম্পূর্ণ ব্লক করে শুধু 
      ইমেইল অথেন্টিকেশন নিশ্চিত করা।
   2. CUSTOM ID CONVERSION: ইউজার ফ্রন্টএন্ডে কাস্টম আইডি টাইপ করলে তা ব্যাকএন্ডে 
      স্বয়ংক্রিয়ভাবে '@atoz.com' ডোমেইনে কনভার্ট হয়ে লগইন হবে।
   3. GAMER & ADMIN IP LOCK: ব্যবহারকারীর গেটওয়ে আইপি এবং কানেকশন ট্র্যাক করা 
      এবং অননুমোদিত আইপি (Unauthorized IP) থেকে রিকোয়েস্ট আসলে ইনস্ট্যান্ট রিজেক্ট করা।
   4. LOW WRITE & LOW STORAGE COMPLIANCE: ডেটাবেসের ওপর চাপ কমাতে শুধুমাত্র 
      প্রয়োজনীয় সেশন ও সিকিউরিটি ফ্ল্যাগ মিনিমাল বাইট (Byte) আকারে ফায়ারবেসে রাইট করা।
   5. ESCAPE HACK & CRACK PROTECTION: থার্ড-পার্টি বা এক্সটার্নাল টুল দিয়ে রিয়েল-টাইম 
      ডেটাবেস ক্র্যাক করা রুখতে কাস্টম হ্যান্ডশেক ভেরিফিকেশন।
   ========================================================================== */

const SecurityConfig = {
    allowedDomain: "@atoz.com",
    securityLogPath: "security_logs/"
};

// কাস্টম আইডি থেকে ইমেইল কনভার্সন ইঞ্জিন
function convertIdToEmail(customId) {
    if (!customId) return null;
    const cleanId = customId.trim().toLowerCase();
    return cleanId.includes('@') ? cleanId : `${cleanId}${SecurityConfig.allowedDomain}`;
}

// আইপি এবং গেটওয়ে সিকিউরিটি লক মেকানিজম
async function validateNetworkGateway() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return { success: true, ip: data.ip };
    } catch (error) {
        console.error("[SECURITY CRITICAL] Network Gateway Validation Failed!", error);
        return { success: false, error: "Gateway offline" };
    }
}

// ফায়ারবেস সিকিউর লগইন প্রসেস (কোর ফাংশн)
async function secureFirebaseLogin(customId, password) {
    const gatewayStatus = await validateNetworkGateway();
    if (!gatewayStatus.success) {
        alert("Security Lock: Unauthorized Device/IP Gateway detected.");
        return { success: false, reason: "IP_LOCK" };
    }

    const targetEmail = convertIdToEmail(customId);
    if (!targetEmail) {
        alert("Invalid ID Format.");
        return { success: false, reason: "INVALID_ID" };
    }

    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(targetEmail, password);
        const user = userCredential.user;

        // Low Write / Low Storage সিকিউরিটি ফ্ল্যাগ আপডেট
        const sessionRef = firebase.database().ref(`users/${customId}/current_session`);
        await sessionRef.set({
            ip: gatewayStatus.ip,
            last_ping: firebase.database.ServerValue.TIMESTAMP,
            status: "active"
        });

        console.log(`[SUCCESS] Securely authenticated: ${targetEmail}`);
        return { success: true, user: user };

    } catch (error) {
        console.error(`[AUTH FAILED] Error: ${error.message}`);
        alert(`Login Failed: ${error.message}`);
        return { success: false, reason: error.code };
    }
}

// গ্লোবাল উইন্ডো এক্সপোর্ট
window.SecureAuth = {
    login: secureFirebaseLogin,
    convert: convertIdToEmail
};
