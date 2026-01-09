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
       // Load contestants with photos
db.collection("contestants").onSnapshot(snapshot => {
  document.getElementById("musicContestants").innerHTML = "";
  document.getElementById("bibleContestants").innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();

    const card = `
      <div class="card">
        <img src="${data.photo}" alt="${data.name}" class="photo">
        <h3>${data.name}</h3>
        <p class="bio">${data.bio || ""}</p>
        <button onclick="vote('${doc.id}')">Vote</button>
      </div>
    `;
// Live Leaderboard
function loadLeaderboard() {
  const musicLeaders = {};
  const bibleLeaders = {};

  db.collection("votes").onSnapshot(voteSnap => {
    musicLeaders.clear;
    bibleLeaders.clear;

    voteSnap.forEach(vote => {
      const id = vote.data().contestantId;

      if (!musicLeaders[id]) musicLeaders[id] = 0;
      if (!bibleLeaders[id]) bibleLeaders[id] = 0;

      musicLeaders[id]++;
      bibleLeaders[id]++;
    });

    db.collection("contestants").get().then(contSnap => {
      const music = [];
      const bible = [];

      contSnap.forEach(doc => {
        const data = doc.data();
        const votes = musicLeaders[doc.id] || 0;

        if (data.category === "music") {
          music.push({ name: data.name, votes });
        } else if (data.category === "bible") {
          bible.push({ name: data.name, votes });
        }
      });

      music.sort((a, b) => b.votes - a.votes);
      bible.sort((a, b) => b.votes - a.votes);

      document.getElementById("musicLeaders").innerHTML =
        music.slice(0, 3).map((c, i) =>
          `<div class="leader">#${i + 1} ${c.name} – ${c.votes} votes</div>`
        ).join("");

      document.getElementById("bibleLeaders").innerHTML =
        bible.slice(0, 3).map((c, i) =>
          `<div class="leader">#${i + 1} ${c.name} – ${c.votes} votes</div>`
        ).join("");
    });
  });
}

loadLeaderboard();

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
