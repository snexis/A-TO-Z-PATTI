<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Atoz Bombay - Admin Command Center</title>
  
  <link rel="stylesheet" href="style.css">
  
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js"></script>
  
  <script src="firebase-config.js"></script>
  <script src="app.js"></script>
  <script src="admin.js"></script>
</head>
<body class="admin-panel-body">

  <header class="dashboard-container dashboard-wide" style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center; padding: 15px 25px;">
    <h1 style="font-size: 22px; text-transform: uppercase; margin: 0;">Atoz Bombay <span style="color: #00f2fe;">Command Center</span></h1>
    <button class="btn-danger" onclick="logout()" style="width: auto; padding: 8px 16px; margin: 0;">লগআউট</button>
  </header>

  <div class="dashboard-grid dashboard-wide" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-top: 20px; width: 100%;">

    <div class="dashboard-container" id="box-user-control" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <div>
        <h3 style="color: #00f2fe; text-transform: uppercase; border-bottom: 2px solid rgba(0,242,254,0.2); padding-bottom: 8px; margin-bottom: 15px; font-size: 16px;">1. User Control</h3>
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="display: block; color: #8f9cae; font-size: 12px; margin-bottom: 5px;">প্লেয়ার বা সাব-অ্যাডমিন আইডি</label>
          <input type="text" id="targetUserId" placeholder="যেমন: player101" oninput="toggleUserBtn()" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: white;">
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="display: block; color: #8f9cae; font-size: 12px; margin-bottom: 5px;">অ্যাকশন টাইপ</label>
          <select id="userAction" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: white;">
            <option value="player">নতুন প্লেয়ার আইডি তৈরি করুন</option>
            <option value="subadmin">নতুন সাব-অ্যাডমিন তৈরি করুন</option>
            <option value="approve">ইউজার আইডি Approve করুন</option>
            <option value="block">ইউজার আইডি Block করুন</option>
          </select>
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="display: block; color: #8f9cae; font-size: 12px; margin-bottom: 5px;">ডিফল্ট পাসওয়ার্ড / পিন</label>
          <input type="password" id="userDefaultPin" placeholder="••••••" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: white;">
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="display: block; color: #8f9cae; font-size: 12px; margin-bottom: 5px;">প্লে মোড পারমিশন</label>
          <select id="playerViewMode" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: white;">
            <option value="word">Word Mode (হজবরল কোড)</option>
            <option value="digit">Digit Mode (সংখ্যার পত্তি)</option>
          </select>
        </div>
        <div class="checkbox-group" style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <input type="checkbox" id="advanceDrawPermission" style="accent-color: #00f2fe;">
          <label for="advanceDrawPermission" style="color: #8f9cae; font-size: 12px; cursor: pointer;">অ্যাডভান্স ড্র পারমিশন দিন (Advance Draw)</label>
        </div>
        <div class="checkbox-group" style="display: flex; align-items: center; gap: 8px; margin-bottom: 15px;">
          <input type="checkbox" id="userSafetyCheck" onchange="toggleUserBtn()" style="accent-color: #00f2fe;">
          <label for="userSafetyCheck" style="color: #8f9cae; font-size: 12px; cursor: pointer;">আমি এই ইউজার সেটিংস পরিবর্তন করতে রাজি আছি।</label>
        </div>
      </div>
      <button class="btn-primary" id="userBtn" disabled onclick="handleUserControl()">সাবমিট একশন</button>
    </div>

    <div class="dashboard-container" id="box-routine" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <div>
        <h3 style="color: #00f2fe; text-transform: uppercase; border-bottom: 2px solid rgba(0,242,254,0.2); padding-bottom: 8px; margin-bottom: 15px; font-size: 16px;">2. 24H Routine</h3>
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="display: block; color: #8f9cae; font-size: 12px; margin-bottom: 5px;">নতুন বাজির নাম (যেমন: Bazi 1)</label>
          <input type="text" id="baziName" placeholder="বাজির নাম লিখুন" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: white;">
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="display: block; color: #8f9cae; font-size: 12px; margin-bottom: 5px;">লক করার সময় (Lock Time - HH:MM)</label>
          <input type="time" id="lockTime" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: white;">
        </div>
        <label style="font-size: 12px; color: #8f9cae; display: block; margin-top: 15px; margin-bottom: 5px;">সক্রিয় বাজির রুটিন লিস্ট:</label>
        <div class="data-list" id="routineList" style="max-height: 140px; overflow-y: auto; background: rgba(0,0,0,0.2); border-radius: 6px; border: 1px solid rgba(255,255,255,0.05);">
          <div class="data-item" style="color: #636b7a; padding: 8px 12px; font-size: 12px; display: flex; justify-content: space-between;">কোনো সক্রিয় বাজি সেট করা নেই...</div>
        </div>
      </div>
      <button class="btn-primary" onclick="saveRoutine()" style="margin-top: 15px;">নতুন বাজি যুক্ত করুন</button>
    </div>

    <div class="dashboard-container" id="box-result" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <div>
        <h3 style="color: #00f2fe; text-transform: uppercase; border-bottom: 2px solid rgba(0,242,254,0.2); padding-bottom: 8px; margin-bottom: 15px; font-size: 16px;">3. Result Box</h3>
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="display: block; color: #8f9cae; font-size: 12px; margin-bottom: 5px;">একটি সক্রিয় বাজি সিলেক্ট করুন</label>
          <select id="resultBaziSelect" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: white;">
            <option value="">লোডিং হচ্ছে...</option>
          </select>
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="display: block; color: #8f9cae; font-size: 12px; margin-bottom: 5px;">পত্তির কোড বা সংখ্যা (৩-অক্ষর / ৩-ডিজিট)</label>
          <input type="text" id="pattiResult" placeholder="যেমন: ZQR অথবা 100" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: white;">
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="display: block; color: #8f9cae; font-size: 12px; margin-bottom: 5px;">সিঙ্গেল কোড বা সংখ্যা (১-অক্ষর / ১-ডিজিট)</label>
          <input type="text" id="singleResult" placeholder="যেমন: A অথবা 1" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: white;">
        </div>
      </div>
      <button class="btn-primary" onclick="publishResult()" style="margin-top: 15px;">ফলাফল প্রকাশ করুন</button>
    </div>

    <div class="dashboard-container" id="box-point" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <div>
        <h3 style="color: #00f2fe; text-transform: uppercase; border-bottom: 2px solid rgba(0,242,254,0.2); padding-bottom: 8px; margin-bottom: 15px; font-size: 16px;">4. Point Master</h3>
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="display: block; color: #8f9cae; font-size: 12px; margin-bottom: 5px;">টার্গেট প্লেয়ার আইডি</label>
          <input type="text" id="pointUserId" placeholder="যেমন: player101" oninput="togglePointBtn()" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: white;">
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="display: block; color: #8f9cae; font-size: 12px; margin-bottom: 5px;">অ্যাকশন টাইপ</label>
          <select id="pointAction" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: white;">
            <option value="add">পয়েন্ট রিচার্জ করুন (Add Points)</option>
            <option value="deduct">পয়েন্ট কেটে নিন (Deduct Points)</option>
          </select>
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="display: block; color: #8f9cae; font-size: 12px; margin-bottom: 5px;">পয়েন্ট পরিমাণ</label>
          <input type="number" id="pointAmount" placeholder="পয়েন্টের সংখ্যা লিখুন" oninput="togglePointBtn()" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: white;">
        </div>
        <div class="checkbox-group" style="display: flex; align-items: center; gap: 8px; margin-bottom: 15px;">
          <input type="checkbox" id="pointSafetyCheck" onchange="togglePointBtn()" style="accent-color: #00f2fe;">
          <label for="pointSafetyCheck" style="color: #8f9cae; font-size: 12px; cursor: pointer;">আমি ভুল এড়াতে সঠিক আইডি ও অ্যামাউন্ট চেক করেছি।</label>
        </div>
      </div>
      <button class="btn-primary" id="pointBtn" disabled onclick="handlePoints()">পয়েন্ট আপডেট করুন</button>
    </div>

    <div class="dashboard-container" id="box-withdraw" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <div>
        <h3 style="color: #00f2fe; text-transform: uppercase; border-bottom: 2px solid rgba(0,242,254,0.2); padding-bottom: 8px; margin-bottom: 15px; font-size: 16px;">5. Withdraw OTP</h3>
        <label style="font-size: 12px; color: #8f9cae; display: block; margin-bottom: 5px;">পেন্ডিং ক্যাশ-আউট রিকোয়েস্ট:</label>
        <div class="data-list" id="withdrawList" style="max-height: 120px; overflow-y: auto; background: rgba(0,0,0,0.2); border-radius: 6px; border: 1px solid rgba(255,255,255,0.05);">
          <div class="data-item" style="color: #636b7a; padding: 8px 12px; font-size: 12px; display: flex; justify-content: space-between;">কোনো পেন্ডিং উইড্রো রিকোয়েস্ট নেই...</div>
        </div>
        <div class="form-group" style="margin-top: 15px;">
          <label style="display: block; color: #8f9cae; font-size: 12px; margin-bottom: 5px;">সিকিউর ওটিপি কোড (OTP)</label>
          <input type="text" id="withdrawOtp" placeholder="৬-ডিজিট কোড লিখুন" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: white;">
        </div>
      </div>
      <button class="btn-primary" onclick="approveWithdraw()" style="margin-top: 15px;">ওটিপি মিলিয়ে রিলিজ করুন</button>
    </div>

    <div class="dashboard-container" id="box-history" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <div>
        <h3 style="color: #00f2fe; text-transform: uppercase; border-bottom: 2px solid rgba(0,242,254,0.2); padding-bottom: 8px; margin-bottom: 15px; font-size: 16px;">6. History Board</h3>
        <div class="history-tabs" style="display: flex; gap: 5px; margin-bottom: 12px;">
          <button class="tab-small active" id="tabWord" onclick="setHistoryView('word')" style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); color: #8f9cae; font-size: 10px; text-transform: uppercase; cursor: pointer; border-radius: 4px;">Word View</button>
          <button class="tab-small" id="tabDigit" onclick="setHistoryView('digit')" style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); color: #8f9cae; font-size: 10px; text-transform: uppercase; cursor: pointer; border-radius: 4px;">Digit View</button>
          <button class="tab-small" id="tabBoth" onclick="setHistoryView('both')" style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); color: #8f9cae; font-size: 10px; text-transform: uppercase; cursor: pointer; border-radius: 4px;">Both View</button>
        </div>
        <label style="font-size: 11px; color: #8f9cae; display: block; margin-bottom: 5px;">আজকের টোটাল সেলস এবং রেজাল্ট হিস্ট্রি:</label>
        <div class="data-list" id="historyList" style="max-height: 140px; overflow-y: auto; background: rgba(0,0,0,0.2); border-radius: 6px; border: 1px solid rgba(255,255,255,0.05);">
          <div class="data-item" style="color: #636b7a; padding: 8px 12px; font-size: 12px; display: flex; justify-content: space-between;">হিস্ট্রি লোড হচ্ছে...</div>
        </div>
      </div>
      <button class="btn-danger" onclick="archiveDay()" style="margin-top: 15px;">আজকের বেট ডিলিট/রিসেট করুন (Midnight)</button>
    </div>

  </div>

  <script>
    // ড্যাশবোর্ড সিকিউরিটি প্রটেকশন চেক
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
            // রিয়াল-টাইম ডেটা লিসেনার ও রেন্ডারিং রান করানো
            listenToDatabase();
          }
        });
      }
    });

    // ডেটাবেস লিসেনার এবং লাইভ রেন্ডারিং লজিক
    function listenToDatabase() {
      // ১. রুটিন লিসেনার (বাজি সেটিংস এবং ড্রপডাউন আপডেট)
      window.db.ref('bazi_settings').on('value', snapshot => {
        const listDiv = document.getElementById('routineList');
        const select = document.getElementById('resultBaziSelect');
        listDiv.innerHTML = '';
        select.innerHTML = '<option value="">একটি বাজি বেছে নিন</option>';
        
        if (snapshot.exists()) {
          snapshot.forEach(child => {
            const id = child.key;
            const item = child.val();
            
            // রুটিন লিস্টে বাজি যুক্ত করা
            const div = document.createElement('div');
            div.className = 'data-item';
            div.style.padding = "8px 12px";
            div.style.fontSize = "12px";
            div.style.display = "flex";
            div.style.justifyContent = "space-between";
            div.style.borderBottom = "1px solid rgba(255,255,255,0.05)";
            div.innerHTML = `<span><strong>${item.name}</strong> (লক: ${item.lockTime})</span>
                             <button onclick="deleteBazi('${id}')" style="background:none; border:none; color:#ff4b4b; cursor:pointer;">মুছুন</button>`;
            listDiv.appendChild(div);

            // রেজাল্ট পাবলিশ ড্রপডাউনে বাজি যুক্ত করা
            const opt = document.createElement('option');
            opt.value = id;
            opt.innerText = `${item.name} (${item.lockTime})`;
            select.appendChild(opt);
          });
        } else {
          listDiv.innerHTML = '<div class="data-item" style="color: #636b7a; padding: 8px 12px;">কোনো সক্রিয় বাজি নেই...</div>';
        }
      });

      // ২. ক্যাশ-আউট রিকোয়েস্ট লিসেনার
      window.db.ref('withdraw_requests').orderByChild('status').equalTo('pending').on('value', snapshot => {
        const listDiv = document.getElementById('withdrawList');
        listDiv.innerHTML = '';
        if (snapshot.exists()) {
          snapshot.forEach(child => {
            const req = child.val();
            const div = document.createElement('div');
            div.className = 'data-item';
            div.style.padding = "8px 12px";
            div.style.fontSize = "12px";
            div.style.display = "flex";
            div.style.justifyContent = "space-between";
            div.style.borderBottom = "1px solid rgba(255,255,255,0.05)";
            div.innerHTML = `<span>ID: ${req.userId.substring(0,6)}.. | Amount: ${req.amount}৳</span>
                             <span style="color:#00f2fe; font-weight:bold;">Pending OTP</span>`;
            listDiv.appendChild(div);
          });
        } else {
          listDiv.innerHTML = '<div class="data-item" style="color: #636b7a; padding: 8px 12px;">কোনো পেন্ডিং রিকোয়েস্ট নেই...</div>';
        }
      });
    }
  </script>
</body>
</html>
