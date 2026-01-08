// 🔥 PASTE YOUR FIREBASE CONFIG BELOW
const firebaseConfig = {
  apiKey: "PASTE_HERE",
  authDomain: "PASTE_HERE",
  projectId: "PASTE_HERE",
  storageBucket: "PASTE_HERE",
  messagingSenderId: "PASTE_HERE",
  appId: "PASTE_HERE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Voting function
function vote(contestantId) {
  const deviceId = localStorage.getItem("deviceId") || Date.now().toString();
  localStorage.setItem("deviceId", deviceId);

  db.collection("votes")
    .where("deviceId", "==", deviceId)
    .where("contestantId", "==", contestantId)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        alert("You have already voted 🙏");
      } else {
        db.collection("votes").add({
          contestantId: contestantId,
          deviceId: deviceId,
          time: new Date()
        });
        alert("Vote successful! God bless you 🙏");
      }
    });
}
