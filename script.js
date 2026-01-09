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
        // Load contestants
db.collection("contestants").onSnapshot(snapshot => {
  document.getElementById("musicContestants").innerHTML = "";
  document.getElementById("bibleContestants").innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    const card = `
      <div class="card">
        <h3>${data.name}</h3>
        <button onclick="vote('${doc.id}')">Vote</button>
      </div>
    `;

    if (data.category === "music") {
      document.getElementById("musicContestants").innerHTML += card;
    } else if (data.category === "bible") {
      document.getElementById("bibleContestants").innerHTML += card;
    }
  });
});

        alert("Vote successful! God bless you 🙏");
      }
    });
}
