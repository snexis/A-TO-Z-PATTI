// ==========================================
// ATOZ BOMBAY - MAIN PORTAL & LOGIN LOGIC
// ==========================================

// ১. পেজ লোড হওয়ার সাথে সাথে চেক করা কোনো ইউজার অলরেডি লগইন আছে কিনা
window.auth.onAuthStateChanged(user => {
  if (user) {
    // ইউজার লগইন থাকলে তার রোল অনুযায়ী রিডাইরেক্ট করা হবে
    redirectUserBasedOnRole(user.uid);
  }
});

// ২. লগইন ফাংশন (index.html থেকে কল হবে)
function handleLogin(event) {
  if (event) event.preventDefault();

  const userId = document.getElementById('txtUserId').value.trim();
  const pin = document.getElementById('txtPin').value.trim();

  if (!userId || !pin) {
    alert('দয়া করে আইডি এবং পিন/পাসওয়ার্ড দিন!');
    return;
  }

  // আমাদের সিস্টেমের ভার্চুয়াল ইমেইল জেনারেট করা
  const virtualEmail = window.getVirtualEmail(userId);

  // ফায়ারবেস সাইন-ইন শুরু
  window.auth.signInWithEmailAndPassword(virtualEmail, pin)
    .then(cred => {
      // লগইন সফল হলে রোল চেক করে ড্যাশবোর্ডে পাঠানো হবে
      redirectUserBasedOnRole(cred.user.uid);
    })
    .catch(err => {
      alert('ভুল আইডি অথবা পিন! আবার চেষ্টা করুন।');
      console.error(err);
    });
}

// ৩. রোল ভিত্তিক রিডাইরেক্ট মেকানিজম
function redirectUserBasedOnRole(uid) {
  window.db.ref('users/' + uid).once('value')
    .then(snapshot => {
      const userData = snapshot.val();
      if (userData) {
        // ইউজারের অবস্থা চেক করা (ব্লকড কিনা)
        if (userData.status === 'blocked') {
          alert('আপনার আইডিটি সাময়িকভাবে ব্লক করা হয়েছে। অ্যাডমিনের সাথে যোগাযোগ করুন।');
          window.auth.signOut();
          return;
        }

        // রোল অনুযায়ী পেজ রিডাইরেকশন
        if (userData.role === 'admin') {
          window.location.href = 'admin.html';
        } else if (userData.role === 'player') {
          window.location.href = 'player.html';
        } else {
          alert('আপনার আইডিতে কোনো রোল সেট করা নেই!');
          window.auth.signOut();
        }
      } else {
        alert('ইউজার ডেটাবেস রেকর্ড পাওয়া যায়নি!');
        window.auth.signOut();
      }
    })
    .catch(err => {
      console.error("রিডাইরেক্ট করতে সমস্যা হয়েছে:", err);
    });
}

// গ্লোবাল অ্যাক্সেস দেওয়া
window.handleLogin = handleLogin;
