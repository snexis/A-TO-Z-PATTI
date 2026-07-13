// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// আমাদের সেই স্পেশাল আইডি-টু-ইমেইল কনভার্টার লজিক
function getEmailFromId(userId, role) {
    if (role === 'master_admin') return userId + "@master.admin";
    if (role === 'sub_admin') return userId + "@sub.admin";
    return userId + "@game.player";
}
