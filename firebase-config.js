// ==========================================
// ATOZ BOMBAY - FIREBASE CONFIGURATION & CORE LOGIC (SYNCHRONIZED)
// Firebase SDK Version: 8.10.0 (Namespaced API)
// ==========================================

// ১. ফায়ারবেস কনসোলের নিজস্ব ক্রেডেনশিয়াল
const firebaseConfig = {
  apiKey: "AIzaSyB0HO_fnRt3FMjykq7Lo_Z0sAYy3kee2W4",
  authDomain: "a-toz-patti.firebaseapp.com",
  databaseURL: "https://a-toz-patti-default-rtdb.firebaseio.com",
  projectId: "a-toz-patti",
  storageBucket: "a-toz-patti.firebasestorage.app",
  messagingSenderId: "71546188781",
  appId: "1:71546188781:web:19bfea6537335132c86de4",
  measurementId: "G-8ENRFZRWLP"
};

// ফায়ারবেস ইনিশিয়ালাইজেশন
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.database();

// ২. সিক্রেট "হজবরল" কোড ও ডিজিট ম্যাপিং টেবিল (Secret Matrix)
const SECRET_MATRIX = {
  "A": {
    digit: "1",
    patti_map: {
      "ZQR": "100", "BFT": "678", "XMK": "777", "TGB": "560", "MJU": "470",
      "ASD": "380", "GHJ": "290", "UJM": "119", "RPA": "137", "RVT": "236",
      "TJU": "146", "KLZ": "669", "ZXC": "579", "BNM": "399", "SDF": "588",
      "HJK": "489", "VBN": "245", "QWE": "155", "ERT": "227", "UIO": "344",
      "OPA": "335", "DFG": "128"
    }
  },
  "B": {
    digit: "2",
    patti_map: {
      "KPW": "200", "ZLM": "345", "VND": "444", "YHN": "570", "KIOP": "480",
      "FGH": "390", "KLZ": "660", "IKL": "129", "TZS": "237", "TBY": "336",
      "YKI": "246", "XCV": "679", "VBN": "255", "ASD": "147", "GHJ": "228",
      "LMN": "499", "MQW": "688", "RTY": "778", "YUI": "138", "PAS": "156",
      "SDF": "110", "HJK": "569"
    }
  },
  "C": {
    digit: "3",
    patti_map: {
      "MXV": "300", "QDK": "120", "LRT": "111", "UJM": "580", "LOZ": "490",
      "JKL": "670", "XCV": "238", "OPW": "139", "YXD": "337", "UNU": "157",
      "ULO": "346", "BNM": "689", "MQW": "355", "FGH": "247", "KLZ": "256",
      "QWE": "166", "ERT": "599", "UIO": "148", "OPA": "788", "DFG": "445",
      "GHJ": "229", "LMN": "779"
    }
  },
  "D": {
    digit: "4",
    patti_map: {
      "LBN": "400", "WXP": "789", "CJG": "888", "IKOL": "590", "PAS": "130",
      "ZXC": "680", "BNM": "248", "ASE": "149", "UCF": "347", "IIM": "158",
      "GHJ": "167", "QWE": "446", "ERT": "699", "JKL": "455", "XCV": "266",
      "RTY": "112", "YUI": "356", "PAS": "239", "SDF": "338", "HJK": "257",
      "KLZ": "220", "ZXC": "770"
    }
  },
  "E": {
    digit: "5",
    patti_map: {
      "TSF": "500", "RVC": "456", "PWB": "555", "ZAQ": "140", "DFG": "230",
      "VBN": "690", "QAZ": "258", "DFR": "159", "IVG": "357", "OAQ": "799",
      "KLZ": "168", "RTY": "267", "YUI": "780", "ZXC": "447", "BNM": "366",
      "UIO": "113", "OPA": "122", "DFG": "177", "GHJ": "249", "LMN": "339",
      "XCV": "889", "VBN": "348"
    }
  },
  "F": {
    digit: "6",
    patti_map: {
      "HJD": "600", "NGB": "123", "QAZ": "222", "XSW": "150", "HJK": "330",
      "MQW": "240", "WSX": "268", "HGT": "169", "OBH": "367", "PSW": "448",
      "XCV": "277", "UIO": "899", "OPA": "178", "VBN": "790", "QWE": "466",
      "PAS": "358", "SDF": "880", "HJK": "114", "KLZ": "556", "ZXC": "259",
      "BNM": "349", "MQW": "457"
    }
  },
  "G": {
    digit: "7",
    patti_map: {
      "VGC": "700", "KLS": "890", "MNE": "999", "CDE": "160", "LMN": "340",
      "ERT": "250", "EDC": "278", "LHY": "179", "PNJ": "377", "QDE": "467",
      "BNM": "458", "PAS": "115", "SDF": "124", "MQW": "223", "RTY": "566",
      "DFG": "557", "GHJ": "368", "LMN": "359", "XCV": "449", "VBN": "269",
      "QWE": "133", "ERT": "188"
    }
  },
  "H": {
    digit: "8",
    patti_map: {
      "YRE": "800", "JHF": "567", "WSX": "666", "VFR": "170", "QWE": "350",
      "YUI": "260", "RFV": "288", "QJU": "189", "QMK": "116", "WFR": "233",
      "OPA": "459", "DFG": "125", "GHJ": "224", "ERT": "477", "UIO": "990",
      "HJK": "134", "KLZ": "558", "ZXC": "369", "BNM": "378", "MQW": "440",
      "RTY": "279", "YUI": "468"
    }
  },
  "I": {
    digit: "9",
    patti_map: {
      "OWQ": "900", "PTZ": "234", "EDC": "333", "BGT": "180", "RTY": "360",
      "OPA": "270", "TGB": "450", "WKI": "199", "WLZ": "117", "EGT": "469",
      "SDF": "126", "HJK": "667", "KLZ": "478", "YUI": "135", "PAS": "225",
      "LMN": "144", "XCV": "379", "VBN": "559", "QWE": "289", "ERT": "388",
      "UIO": "577", "OPA": "568"
    }
  },
  "J": {
    digit: "0",
    patti_map: {
      "NMK": "000", "CVD": "127", "RFV": "190", "NHY": "280", "UIO": "370",
      "SDF": "460", "YHN": "550", "ELO": "235", "EXC": "118", "RHY": "578",
      "GHJ": "145", "LMN": "479", "XCV": "668", "OPA": "299", "DFG": "334",
      "ZXC": "488", "BNM": "389", "MQW": "226", "RTY": "569", "YUI": "677",
      "PAS": "136", "SDF": "244"
    }
  }
};

// ৩. সিকিউর ভার্চুয়াল ইমেইল লজিক (ডোমেন কনফ্লিক্ট ঠিক করা হয়েছে)
function getVirtualEmail(userId) {
  const cleanId = userId.trim().toLowerCase();
  return `${cleanId}@atozbombay.com`; // app.js এর সাথে সিঙ্কড ডোমেন
}

// ৪. গ্লোবাল অথেন্টিকেশন হেল্পার
function loginWithUserId(userId, pin, callback) {
  const secureEmail = getVirtualEmail(userId);
  auth.signInWithEmailAndPassword(secureEmail, pin)
    .then((userCredential) => {
      const uid = userCredential.user.uid;
      db.ref('users/' + uid).once('value')
        .then((snapshot) => {
          if (snapshot.exists()) {
            callback(null, snapshot.val());
          } else {
            callback("ইউজার ডাটাবেস রেকর্ড খুঁজে পাওয়া যায়নি।", null);
          }
        });
    })
    .catch((error) => {
      let errorMessage = "লগইন ব্যর্থ হয়েছে। আইডি বা পাসওয়ার্ড ভুল।";
      if (error.code === "auth/user-not-found") {
        errorMessage = "এই আইডিটি সিস্টেমে নিবন্ধিত নেই।";
      }
      callback(errorMessage, null);
    });
}

// ৫. ডুয়াল মোড কনভার্সন ফাংশন (Case-insensitive সার্চ এনাবল করা হয়েছে)
function convertCodeToDigit(wordCode) {
  if (!wordCode) return null;
  const upperCode = wordCode.trim().toUpperCase();
  for (const col in SECRET_MATRIX) {
    if (SECRET_MATRIX[col].patti_map[upperCode]) {
      return {
        columnDigit: SECRET_MATRIX[col].digit,
        pattiDigit: SECRET_MATRIX[col].patti_map[upperCode]
      };
    }
  }
  return null; 
}

function convertDigitToCode(digitPatti) {
  if (!digitPatti) return null;
  const cleanPatti = digitPatti.trim();
  for (const col in SECRET_MATRIX) {
    const map = SECRET_MATRIX[col].patti_map;
    for (const code in map) {
      if (map[code] === cleanPatti) {
        return {
          columnLetter: col,
          wordCode: code
        };
      }
    }
  }
  return null;
}

// গ্লোবাল ডিক্লেয়ারেশন
window.db = db;
window.auth = auth;
window.SECRET_MATRIX = SECRET_MATRIX;
window.getVirtualEmail = getVirtualEmail;
window.loginWithUserId = loginWithUserId;
window.convertCodeToDigit = convertCodeToDigit;
window.convertDigitToCode = convertDigitToCode;
