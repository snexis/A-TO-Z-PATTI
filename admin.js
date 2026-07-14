// ==========================================
// ATOZ BOMBAY - ADVANCED ADMIN DASHBOARD LOGIC
// ==========================================

// ১. ফায়ারবেস সেকেন্ডারি অ্যাপ তৈরি (যাতে অ্যাডমিন সেশন লগআউট না হয়)
let secondaryApp;
if (window.firebase && firebase.apps.length) {
  // আগের কনফিগারেশন ব্যবহার করে সেকেন্ডারি অ্যাপ ইনিশিয়ালাইজ করা
  const config = firebase.app().options;
  secondaryApp = firebase.initializeApp(config, "SecondaryAuthApp");
}

// ২. বাটনের সেফটি সুইচ এনাবল-ডিজেবল লজিক
function toggleUserBtn() {
  const targetId = document.getElementById('targetUserId').value.trim();
  const check = document.getElementById('userSafetyCheck').checked;
  document.getElementById('userBtn').disabled = !(targetId && check);
}

function togglePointBtn() {
  const targetId = document.getElementById('pointUserId').value.trim();
  const amount = document.getElementById('pointAmount').value.trim();
  const check = document.getElementById('pointSafetyCheck').checked;
  document.getElementById('pointBtn').disabled = !(targetId && amount && check);
}

// ৩. ইউজার ক্রিয়েশন ও কন্ট্রোল লজিক (সেকেন্ডারি অ্যাপ সহ)
function handleUserControl() {
  const targetId = document.getElementById('targetUserId').value.trim();
  const action = document.getElementById('userAction').value;
  const pin = document.getElementById('userDefaultPin').value.trim();
  const viewMode = document.getElementById('playerViewMode').value;
  const advDraw = document.getElementById('advanceDrawPermission').checked;

  const virtualEmail = window.getVirtualEmail ? window.getVirtualEmail(targetId) : `${targetId}@atozbombay.com`;

  if (action === 'player' || action === 'subadmin') {
    if (!pin) {
      alert('নতুন আইডি তৈরি করতে পিন/পাসওয়ার্ড দেওয়া বাধ্যতামূলক!');
      return;
    }
    
    if (!secondaryApp) {
      alert('ফায়ারবেস সেকেন্ডারি অ্যাপ লোড হতে পারেনি!');
      return;
    }

    // সেকেন্ডারি অ্যাপ দিয়ে ইউজার তৈরি, তাই অ্যাডমিন লগআউট হবে না
    secondaryApp.auth().createUserWithEmailAndPassword(virtualEmail, pin)
      .then(cred => {
        const uid = cred.user.uid;
        const userData = {
          userId: targetId,
          role: action,
          status: 'approved',
          playPoints: 0,
          winningPoints: 0,
          viewMode: action === 'player' ? viewMode : 'none',
          advanceDraw: advDraw
        };
        
        window.db.ref('users/' + uid).set(userData).then(() => {
          alert(`সফলভাবে ${action.toUpperCase()} আইডি তৈরি হয়েছে!`);
          // সেকেন্ডারি অ্যাপ থেকে নতুন ইউজারকে সাথে সাথে সাইন আউট করে দেওয়া যেন মেমোরি ক্লিয়ার থাকে
          secondaryApp.auth().signOut();
          resetUserControlForm();
        });
      })
      .catch(err => alert('আইডি তৈরিতে ভুল হয়েছে: ' + err.message));
  } else {
    // Approve বা Block অ্যাকশন
    window.db.ref('users').orderByChild('userId').equalTo(targetId).once('value', snapshot => {
      if (snapshot.exists()) {
        snapshot.forEach(child => {
          const uid = child.key;
          window.db.ref(`users/${uid}/status`).set(action === 'approve' ? 'approved' : 'blocked')
            .then(() => alert(`ইউজারটি সফলভাবে ${action.toUpperCase()} করা হয়েছে।`));
        });
      } else {
        alert('এই আইডি বিশিষ্ট কোনো ইউজার খুঁজে পাওয়া যায়নি!');
      }
    });
  }
}

// ৪. টাইম সেটিংস (Routine) সেভ করা
function saveRoutine() {
  const name = document.getElementById('baziName').value.trim();
  const time = document.getElementById('lockTime').value;
  if (!name || !time) return alert('বাজির নাম এবং লক টাইম দিন!');

  const newBaziRef = window.db.ref('bazi_settings').push();
  newBaziRef.set({
    name: name,
    lockTime: time
  }).then(() => {
    alert('নতুন বাজি সফলভাবে রুটিনে যুক্ত হয়েছে!');
    document.getElementById('baziName').value = '';
    document.getElementById('lockTime').value = '';
  });
}

function deleteBazi(id) {
  if (confirm('আপনি কি নিশ্চিত যে এই বাজিটি রুটিন থেকে ডিলিট করতে চান?')) {
    window.db.ref(`bazi_settings/${id}`).remove();
  }
}

// ৫. ওয়ান-ক্লিক রেজাল্ট পাবলিশ মেকানিজম
function publishResult() {
  const baziId = document.getElementById('resultBaziSelect').value;
  const patti = document.getElementById('pattiResult').value.trim().toUpperCase();
  const single = document.getElementById('singleResult').value.trim().toUpperCase();

  if (!baziId || !patti || !single) return alert('দয়া করে বাজি সিলেক্ট করুন এবং পত্তি ও সিঙ্গেল টাইপ করুন!');

  window.db.ref(`results/${baziId}`).set({
    patti: patti,
    single: single,
    publishedAt: firebase.database.ServerValue.TIMESTAMP
  }).then(() => {
    alert('ফলাফল সফলভাবে প্রকাশিত হয়েছে!');
    document.getElementById('pattiResult').value = '';
    document.getElementById('singleResult').value = '';
  });
}

// ৬. পয়েন্ট মাস্টার রিচার্জ ও ডিডাক্ট
function handlePoints() {
  const targetId = document.getElementById('pointUserId').value.trim();
  const action = document.getElementById('pointAction').value;
  const amount = parseInt(document.getElementById('pointAmount').value.trim());

  if (isNaN(amount) || amount <= 0) return alert('দয়া করে সঠিক পয়েন্ট অ্যামাউন্ট লিখুন!');

  window.db.ref('users').orderByChild('userId').equalTo(targetId).once('value', snapshot => {
    if (snapshot.exists()) {
      snapshot.forEach(child => {
        const uid = child.key;
        const currentPoints = child.val().playPoints || 0;
        const newPoints = action === 'add' ? currentPoints + amount : currentPoints - amount;

        if (newPoints < 0) {
          alert('দুঃখিত! ইউজারের ব্যালেন্স মাইনাস হতে পারে না।');
          return;
        }

        window.db.ref(`users/${uid}/playPoints`).set(newPoints).then(() => {
          alert(`পয়েন্ট সফলভাবে আপডেট হয়েছে। নতুন ব্যালেন্স: ${newPoints}`);
          resetPointForm();
        });
      });
    } else {
      alert('ইউজার আইডিটি খুঁজে পাওয়া যায়নি!');
    }
  });
}

// ৭. উইд্রো ওটিপি প্রসেসিং (ডাটাবেস রিয়েল-টাইম আপডেট সহ)
function approveWithdraw() {
  const otp = document.getElementById('withdrawOtp').value.trim();
  if (!otp) return alert('দয়া করে ওটিপি কোডটি টাইপ করুন!');
  
  // পেন্ডিং রিকোয়েস্টের ভেতর ওটিপি ম্যাচিং করা হচ্ছে
  window.db.ref('withdraw_requests').orderByChild('status').equalTo('pending').once('value', snapshot => {
    let otpFound = false;
    if (snapshot.exists()) {
      snapshot.forEach(child => {
        const reqKey = child.key;
        const reqData = child.val();
        
        if (reqData.otp === otp) {
          otpFound = true;
          // ডাটাবেসে স্ট্যাটাস এপ্রুভ করা
          window.db.ref(`withdraw_requests/${reqKey}/status`).set('approved')
            .then(() => {
              alert(`ওটিপি সফলভাবে ভেরিফাই হয়েছে! ${reqData.amount}৳ রিলিজ করা হয়েছে।`);
              document.getElementById('withdrawOtp').value = '';
            });
        }
      });
      if (!otpFound) alert('দুঃখিত! ওটিপি কোডটি মেলেনি বা ভুল।');
    } else {
      alert('কোনো পেন্ডিং উইড্রো রিকোয়েস্ট খুঁজে পাওয়া যায়নি!');
    }
  });
}

// ৮. ডাইনামিক হিস্ট্রি বোর্ড ভিউ স্যুইচ এবং রেন্ডারিং
let currentHistoryView = 'word';

function setHistoryView(view) {
  currentHistoryView = view;
  document.querySelectorAll('.tab-small').forEach(btn => btn.classList.remove('active'));
  if (view === 'word') document.getElementById('tabWord').classList.add('active');
  if (view === 'digit') document.getElementById('tabDigit').classList.add('active');
  if (view === 'both') document.getElementById('tabBoth').classList.add('active');
  
  // মোড চেঞ্জ হলে হিস্ট্রি ডেটা রি-রেন্ডার করা
  renderHistoryBoard();
}

function renderHistoryBoard() {
  const historyList = document.getElementById('historyList');
  if (!historyList) return;

  // active_bets নোড থেকে আজকের সমস্ত সেলস লাইভ ট্র্যাক করা
  window.db.ref('active_bets').once('value', snapshot => {
    historyList.innerHTML = '';
    if (snapshot.exists()) {
      snapshot.forEach(child => {
        const bet = child.val();
        const div = document.createElement('div');
        div.className = 'data-item';
        div.style.padding = "8px 12px";
        div.style.fontSize = "12px";
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.borderBottom = "1px solid rgba(255,255,255,0.05)";

        let displayText = '';
        // মোড অনুযায়ী ডেটা সাজানো
        if (currentHistoryView === 'word') {
          displayText = `ID: ${bet.userId} | Word: ${bet.wordCode || 'N/A'}`;
        } else if (currentHistoryView === 'digit') {
          displayText = `ID: ${bet.userId} | Digit: ${bet.digitPatti || 'N/A'}`;
        } else {
          displayText = `ID: ${bet.userId} | W: ${bet.wordCode || '-'} | D: ${bet.digitPatti || '-'}`;
        }

        div.innerHTML = `<span>${displayText}</span> <span style="color:#00f2fe;">${bet.amount} Points</span>`;
        historyList.appendChild(div);
      });
    } else {
      historyList.innerHTML = '<div class="data-item" style="color: #636b7a; padding: 8px 12px;">আজকের কোনো বেটিং রেকর্ড নেই...</div>';
    }
  });
}

// ড্যাশবোর্ড লোড হওয়ার সাথে সাথে হিস্ট্রি রেন্ডার লিসেনার রান করানো
setTimeout(() => {
  if(window.db) {
    window.db.ref('active_bets').on('value', () => {
      renderHistoryBoard();
    });
  }
}, 2000);

// ৯. মিডনাইট ডেটা রিসেট বা পিউরিফাই মেকানিজম
function archiveDay() {
  if (confirm('সাবধান! এটি আজকের সমস্ত লাইভ বেটিং রেকর্ড সার্ভার থেকে ডিলিট করে রিসেট করে দেবে। আপনি কি নিশ্চিত?')) {
    window.db.ref('active_bets').remove().then(() => {
      alert('সার্ভার থেকে আজকের সমস্ত বেটিং সফলভাবে পুড়িয়ে পরিষ্কার (Cleaned) করা হয়েছে!');
    });
  }
}

// ১০. হেল্পার রিসেট ফাংশনসমূহ
function resetUserControlForm() {
  document.getElementById('targetUserId').value = '';
  document.getElementById('userDefaultPin').value = '';
  document.getElementById('userSafetyCheck').checked = false;
  toggleUserBtn();
}

function resetPointForm() {
  document.getElementById('pointUserId').value = '';
  document.getElementById('pointAmount').value = '';
  document.getElementById('pointSafetyCheck').checked = false;
  togglePointBtn();
}

// গ্লোবাল উইন্ডো ফাংশন ডিক্লেয়ারেশন (যাতে HTML ফাইলগুলো সরাসরি অ্যাক্সেস পায়)
window.toggleUserBtn = toggleUserBtn;
window.togglePointBtn = togglePointBtn;
window.handleUserControl = handleUserControl;
window.saveRoutine = saveRoutine;
window.deleteBazi = deleteBazi;
window.publishResult = publishResult;
window.handlePoints = handlePoints;
window.approveWithdraw = approveWithdraw;
window.setHistoryView = setHistoryView;
window.archiveDay = archiveDay;

window.logout = function() {
  window.auth.signOut().then(() => {
    window.location.href = 'index.html';
  });
};
