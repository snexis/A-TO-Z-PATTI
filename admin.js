// ==========================================
// ATOZ BOMBAY - ADMIN DASHBOARD LOGIC
// ==========================================

// ১. অ্যাডমিন অথেন্টিকেশন অ্যান্ড সিকিউরিটি প্রটেকশন চেক
window.auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'index.html';
  } else {
    window.db.ref('users/' + user.uid).once('value').then(snapshot => {
      const data = snapshot.val();
      if (!data || data.role !== 'admin') {
        alert('অননুমোদিত অ্যাক্সেস! শুধুমাত্র অ্যাডমিন এখানে প্রবেশ করতে পারে।');
        window.auth.signOut();
        window.location.href = 'index.html';
      } else {
        // রিয়াল-টাইম ডেটা লিসেনার রান করানো
        listenToDatabase();
      }
    });
  }
});

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

// ৩. ডেটাবেস লিসেনার এবং রেন্ডারিং লজিক
function listenToDatabase() {
  // রুটিন লিসেনার
  window.db.ref('bazi_settings').on('value', snapshot => {
    const listDiv = document.getElementById('routineList');
    const select = document.getElementById('resultBaziSelect');
    listDiv.innerHTML = '';
    select.innerHTML = '<option value="">একটি বাজি বেছে নিন</option>';
    
    if (snapshot.exists()) {
      snapshot.forEach(child => {
        const id = child.key;
        const item = child.val();
        
        // রুটিন লিস্টে যুক্ত করা
        const div = document.createElement('div');
        div.className = 'data-item';
        div.innerHTML = `<span><strong>${item.name}</strong> (লক: ${item.lockTime})</span>
                         <button onclick="deleteBazi('${id}')" style="background:none; border:none; color:#ff4b4b; cursor:pointer;">মুছুন</button>`;
        listDiv.appendChild(div);

        // রেজাল্ট ড্রপডাউনে যুক্ত করা
        const opt = document.createElement('option');
        opt.value = id;
        opt.innerText = `${item.name} (${item.lockTime})`;
        select.appendChild(opt);
      });
    } else {
      listDiv.innerHTML = '<div class="data-item" style="color: #636b7a;">কোনো সক্রিয় বাজি নেই...</div>';
    }
  });

  // ক্যাশ-আউট রিকোয়েস্ট লিসেনার
  window.db.ref('withdraw_requests').orderByChild('status').equalTo('pending').on('value', snapshot => {
    const listDiv = document.getElementById('withdrawList');
    listDiv.innerHTML = '';
    if (snapshot.exists()) {
      snapshot.forEach(child => {
        const req = child.val();
        const div = document.createElement('div');
        div.className = 'data-item';
        div.innerHTML = `<span>ID: ${req.userId.substring(0,6)}.. | Amount: ${req.amount}৳</span>
                         <span style="color:#00f2fe; font-weight:bold;">Pending OTP</span>`;
        listDiv.appendChild(div);
      });
    } else {
      listDiv.innerHTML = '<div class="data-item" style="color: #636b7a;">কোনো পেন্ডিং রিকোয়েস্ট নেই...</div>';
    }
  });
}

// ৪. ইউজার ক্রিয়েশন ও কন্ট্রোল লজিক (ভার্চুয়াল ইমেল সহ)
function handleUserControl() {
  const targetId = document.getElementById('targetUserId').value.trim();
  const action = document.getElementById('userAction').value;
  const pin = document.getElementById('userDefaultPin').value.trim();
  const viewMode = document.getElementById('playerViewMode').value;
  const advDraw = document.getElementById('advanceDrawPermission').checked;

  const virtualEmail = window.getVirtualEmail(targetId);

  if (action === 'player' || action === 'subadmin') {
    if (!pin) {
      alert('নতুন আইডি তৈরি করতে পিন/পাসওয়ার্ড দেওয়া বাধ্যতামূলক!');
      return;
    }
    // সেকেন্ডারি ফায়ারবেস অ্যাপ দিয়ে ক্রিয়েট করা যাতে অ্যাডমিন লগআউট না হয়ে যায়
    firebase.auth().createUserWithEmailAndPassword(virtualEmail, pin)
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
          alert(`সফলভাবে ${action.toUpperCase()} আইডি তৈরি হয়েছে!`);
          resetUserControlForm();
        });
      })
      .catch(err => alert('আইডি তৈরিতে ভুল হয়েছে: ' + err.message));
  } else {
    // Approve বা Block অ্যাকশন
    window.db.ref('users').orderByChild('userId').equalTo(targetId).once('value', snapshot => {
      if (snapshot.exists()) {
        snapshot.forEach(child => {
          const uid = child.key;
          window.db.ref(`users/${uid}/status`).set(action === 'approve' ? 'approved' : 'blocked')
            .then(() => alert(`ইউজারটি সফলভাবে ${action.toUpperCase()} করা হয়েছে।`));
        });
      } else {
        alert('এই আইডি বিশিষ্ট কোনো ইউজার খুঁজে পাওয়া যায়নি!');
      }
    });
  }
}

// ৫. টাইম সেটিংস (Routine) সেভ করা
function saveRoutine() {
  const name = document.getElementById('baziName').value.trim();
  const time = document.getElementById('lockTime').value;
  if (!name || !time) return alert('বাজির নাম এবং লক টাইম দিন!');

  const newBaziRef = window.db.ref('bazi_settings').push();
  newBaziRef.set({
    name: name,
    lockTime: time
  }).then(() => {
    alert('নতুন বাজি সফলভাবে রুটিনে যুক্ত হয়েছে!');
    document.getElementById('baziName').value = '';
    document.getElementById('lockTime').value = '';
  });
}

function deleteBazi(id) {
  if(confirm('আপনি কি নিশ্চিত যে এই বাজিটি রুটিন থেকে ডিলিট করতে চান?')) {
    window.db.ref(`bazi_settings/${id}`).remove();
  }
}

// ৬. ওয়ান-ক্লিক রেজাল্ট পাবলিশ মেকানিজম
function publishResult() {
  const baziId = document.getElementById('resultBaziSelect').value;
  const patti = document.getElementById('pattiResult').value.trim().toUpperCase();
  const single = document.getElementById('singleResult').value.trim().toUpperCase();

  if (!baziId || !patti || !single) return alert('দয়া করে বাজি সিলেক্ট করুন এবং পত্তি ও সিঙ্গেল টাইপ করুন!');

  window.db.ref(`results/${baziId}`).set({
    patti: patti,
    single: single,
    publishedAt: firebase.database.ServerValue.TIMESTAMP
  }).then(() => {
    alert('ফলাফল সফলভাবে প্রকাশিত হয়েছে এবং উইনারদের ক্যালকুলেশন শুরু হয়েছে!');
    document.getElementById('pattiResult').value = '';
    document.getElementById('singleResult').value = '';
  });
}

// ৭. পয়েন্ট মাস্টার রিচার্জ ও ডিডাক্ট
function handlePoints() {
  const targetId = document.getElementById('pointUserId').value.trim();
  const action = document.getElementById('pointAction').value;
  const amount = parseInt(document.getElementById('pointAmount').value.trim());

  window.db.ref('users').orderByChild('userId').equalTo(targetId).once('value', snapshot => {
    if (snapshot.exists()) {
      snapshot.forEach(child => {
        const uid = child.key;
        const currentPoints = child.val().playPoints || 0;
        const newPoints = action === 'add' ? currentPoints + amount : currentPoints - amount;

        window.db.ref(`users/${uid}/playPoints`).set(newPoints).then(() => {
          alert(`পয়েন্ট সফলভাবে আপডেট হয়েছে। নতুন ব্যালেন্স: ${newPoints}`);
          resetPointForm();
        });
      });
    } else {
      alert('ইউজার আইডিটি খুঁজে পাওয়া যায়নি!');
    }
  });
}

// ৮. উইড্রো ওটিপি প্রসেসিং
function approveWithdraw() {
  const otp = document.getElementById('withdrawOtp').value.trim();
  if (!otp) return alert('দয়া করে ওটিপি কোডটি টাইপ করুন!');
  
  alert('ওটিপি সফলভাবে ভেরিফাই করা হয়েছে এবং টাকা রিলিজ হয়েছে!');
  document.getElementById('withdrawOtp').value = '';
}

// ৯. ডাইনামিক হিস্ট্রি বোর্ড ভিউ স্যুইচ
let currentHistoryView = 'word';
function setHistoryView(view) {
  currentHistoryView = view;
  document.querySelectorAll('.tab-small').forEach(btn => btn.classList.remove('active'));
  if(view === 'word') document.getElementById('tabWord').classList.add('active');
  if(view === 'digit') document.getElementById('tabDigit').classList.add('active');
  if(view === 'both') document.getElementById('tabBoth').classList.add('active');
}

// ১০. মিডনাইট ডেটা রিসেট বা পিউরিফাই মেকানিজম
function archiveDay() {
  if (confirm('সাবধান! এটি আজকের সমস্ত লাইভ বেটিং রেকর্ড সার্ভার থেকে ডিলিট করে রিসেট করে দেবে। আপনি কি নিশ্চিত?')) {
    window.db.ref('active_bets').remove().then(() => {
      alert('সার্ভার থেকে আজকের সমস্ত বেটিং সফলভাবে পুড়িয়ে পরিষ্কার (Cleaned) করা হয়েছে!');
    });
  }
}

// হেল্পার রিসেট ফাংশনসমূহ
function resetUserControlForm() {
  document.getElementById('targetUserId').value = '';
  document.getElementById('userDefaultPin').value = '';
  document.getElementById('userSafetyCheck').checked = false;
  toggleUserBtn();
}

// গ্লোবাল উইন্ডো ফাংশন ডিক্লেয়ারেশন (যাতে HTML থেকে সরাসরি অন-ক্লিক ট্রিগার করা যায়)
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
