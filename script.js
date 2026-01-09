// 🔥 FIREBASE CONFIG (PASTE YOUR REAL VALUES)
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

/* =========================================================
   📥 LOAD CONTESTANTS (PUBLIC PAGE)
========================================================= */
function loadContestants() {
  const musicDiv = document.getElementById("musicContestants");
  const bibleDiv = document.getElementById("bibleContestants");

  if (!musicDiv || !bibleDiv) return;

  db.collection("contestants").onSnapshot(snapshot => {
    musicDiv.innerHTML = "";
    bibleDiv.innerHTML = "";

    snapshot.forEach(doc => {
      const d = doc.data();

      const card = `
        <div class="card">
          <img src="${d.photo}" class="photo">
          <h3>${d.name}</h3>
          <p>${d.bio || ""}</p>
          <button onclick="vote('${doc.id}')">Vote</button>
        </div>
      `;

      if (d.category === "music") {
        musicDiv.innerHTML += card;
      } else if (d.category === "bible") {
        bibleDiv.innerHTML += card;
      }
    });
  });
}

loadContestants();

/* =========================================================
   🗳️ FREE PUBLIC VOTING (ONE DEVICE)
========================================================= */
function vote(contestantId) {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = Date.now().toString();
    localStorage.setItem("deviceId", deviceId);
  }

  db.collection("votes")
    .where("deviceId", "==", deviceId)
    .where("contestantId", "==", contestantId)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        alert("⚠️ You have already voted 🙏");
        return;
      }

      db.collection("votes").add({
        contestantId,
        deviceId,
        time: new Date()
      });

      alert("✅ Vote successful! God bless you 🙏");
    });
}

/* =========================================================
   🏆 LIVE LEADERBOARD
========================================================= */
function loadLeaderboard() {
  const musicLeaders = document.getElementById("musicLeaders");
  const bibleLeaders = document.getElementById("bibleLeaders");

  if (!musicLeaders || !bibleLeaders) return;

  db.collection("votes").onSnapshot(voteSnap => {
    const count = {};

    voteSnap.forEach(v => {
      const id = v.data().contestantId;
      count[id] = (count[id] || 0) + 1;
    });

    db.collection("contestants").get().then(contSnap => {
      const music = [];
      const bible = [];

      contSnap.forEach(doc => {
        const d = doc.data();
        const votes = count[doc.id] || 0;

        if (d.category === "music") music.push({ name: d.name, votes });
        if (d.category === "bible") bible.push({ name: d.name, votes });
      });

      music.sort((a, b) => b.votes - a.votes);
      bible.sort((a, b) => b.votes - a.votes);

      musicLeaders.innerHTML = music.slice(0, 3)
        .map((c, i) => `#${i + 1} ${c.name} – ${c.votes} votes`)
        .join("<br>");

      bibleLeaders.innerHTML = bible.slice(0, 3)
        .map((c, i) => `#${i + 1} ${c.name} – ${c.votes} votes`)
        .join("<br>");
    });
  });
}

loadLeaderboard();

/* =========================================================
   🎯 FINAL RESULTS (PUBLIC + JUDGES)
========================================================= */
function loadFinalResults() {
  const musicFinal = document.getElementById("musicFinal");
  const bibleFinal = document.getElementById("bibleFinal");

  if (!musicFinal || !bibleFinal) return;

  db.collection("votes").onSnapshot(voteSnap => {
    const voteCount = {};

    voteSnap.forEach(v => {
      const id = v.data().contestantId;
      voteCount[id] = (voteCount[id] || 0) + 1;
    });

    db.collection("contestants").get().then(contSnap => {
      const music = [];
      const bible = [];

      contSnap.forEach(doc => {
        const d = doc.data();
        const publicVotes = voteCount[doc.id] || 0;
        const judgeScore = d.judgeScore || 0;

        const finalScore = (publicVotes * 0.5) + (judgeScore * 0.5);

        const row = {
          name: d.name,
          publicVotes,
          judgeScore,
          finalScore
        };

        if (d.category === "music") music.push(row);
        if (d.category === "bible") bible.push(row);
      });

      music.sort((a, b) => b.finalScore - a.finalScore);
      bible.sort((a, b) => b.finalScore - a.finalScore);

      musicFinal.innerHTML = music.map((c, i) => `
        <div>
          #${i + 1} ${c.name}<br>
          Public: ${c.publicVotes} | Judges: ${c.judgeScore}<br>
          <strong>Final: ${c.finalScore.toFixed(1)}</strong>
        </div><hr>
      `).join("");

      bibleFinal.innerHTML = bible.map((c, i) => `
        <div>
          #${i + 1} ${c.name}<br>
          Public: ${c.publicVotes} | Judges: ${c.judgeScore}<br>
          <strong>Final: ${c.finalScore.toFixed(1)}</strong>
        </div><hr>
      `).join("");
    });
  });
}

loadFinalResults();

/* =========================================================
   💳 PAYSTACK (PAID VOTING – FUTURE USE)
========================================================= */
function paidVote(contestantId) {
  const handler = PaystackPop.setup({
    key: "PAYSTACK_PUBLIC_KEY",
    email: "voter@email.com",
    amount: 500 * 100,
    currency: "NGN",
    ref: "KS_" + Math.floor(Math.random() * 1000000000),
    callback: function () {
      alert("Payment received – awaiting verification");
    }
  });
  handler.openIframe();
}

/* =========================================================
   📤 EXPORT RESULTS (ADMIN)
========================================================= */
async function exportExcel() {
  const contSnap = await db.collection("contestants").get();
  const voteSnap = await db.collection("votes").get();

  const voteCount = {};
  voteSnap.forEach(v => {
    const id = v.data().contestantId;
    voteCount[id] = (voteCount[id] || 0) + 1;
  });

  const rows = [];
  contSnap.forEach(doc => {
    const d = doc.data();
    rows.push({
      Name: d.name,
      Category: d.category,
      "Public Votes": voteCount[doc.id] || 0,
      "Judge Score": d.judgeScore || 0
    });
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Results");
  XLSX.writeFile(wb, "KingdomStarsResults.xlsx");
}
