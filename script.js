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
    // Final Results Leaderboard
function loadFinalResults() {
  db.collection("votes").onSnapshot(voteSnap => {
    const voteCount = {};

    voteSnap.forEach(vote => {
      const id = vote.data().contestantId;
      voteCount[id] = (voteCount[id] || 0) + 1;
    });

    db.collection("contestants").get().then(contSnap => {
      const music = [];
      const bible = [];

      contSnap.forEach(doc => {
        const data = doc.data();
        const publicVotes = voteCount[doc.id] || 0;
        const judgeScore = data.judgeScore || 0;

        const finalScore =
          (publicVotes * 0.5) + (judgeScore * 0.5);

        const item = {
          name: data.name,
          publicVotes,
          judgeScore,
          finalScore
        };

        if (data.category === "music") {
          music.push(item);
        } else if (data.category === "bible") {
          bible.push(item);
        }
      });

      music.sort((a, b) => b.finalScore - a.finalScore);
      bible.sort((a, b) => b.finalScore - a.finalScore);

      document.getElementById("musicFinal").innerHTML =
        music.map((c, i) =>
          `<div class="final">
            #${i + 1} ${c.name}<br>
            Public: ${c.publicVotes} | Judges: ${c.judgeScore}<br>
            <strong>Final Score: ${c.finalScore.toFixed(1)}</strong>
          </div>`
        ).join("");

      document.getElementById("bibleFinal").innerHTML =
        bible.map((c, i) =>
          `<div class="final">
            #${i + 1} ${c.name}<br>
            Public: ${c.publicVotes} | Judges: ${c.judgeScore}<br>
            <strong>Final Score: ${c.finalScore.toFixed(1)}</strong>
          </div>`
        ).join("");
    });
  });
}

loadFinalResults();

  });
});

        alert("Vote successful! God bless you 🙏");
      }
      function calculateFinalScore(publicVotes, judgeScore) {
  return (publicVotes * 0.5) + (judgeScore * 0.5);
}

    });
}
function paidVote(contestantId) {
  const handler = PaystackPop.setup({
    key: "PAYSTACK_PUBLIC_KEY",
    email: "voter@email.com",
    amount: 500 * 100, // 500 = ₦500 per vote
    currency: "NGN",
    ref: "KS_" + Math.floor(Math.random() * 1000000000),
    callback: function(response) {
      verifyPayment(response.reference, contestantId);
    },
    onClose: function() {
      alert("Payment cancelled");
    }
  });
  handler.openIframe();
}
// Export results to Excel
async function exportExcel() {
  const contSnap = await db.collection("contestants").get();
  const voteSnap = await db.collection("votes").get();

  const voteCount = {};
  voteSnap.forEach(vote => {
    const id = vote.data().contestantId;
    voteCount[id] = (voteCount[id] || 0) + 1;
  });

  const data = [];
  contSnap.forEach(doc => {
    const d = doc.data();
    const publicVotes = voteCount[doc.id] || 0;
    const judgeScore = d.judgeScore || 0;
    const finalScore = (publicVotes * 0.5) + (judgeScore * 0.5);

    data.push({
      Name: d.name,
      Category: d.category,
      "Public Votes": publicVotes,
      "Judge Score": judgeScore,
      "Final Score": finalScore.toFixed(1)
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "KingdomStarsResults");
  XLSX.writeFile(workbook, "KingdomStarsResults.xlsx");
}

// Export results to PDF
async function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const contSnap = await db.collection("contestants").get();
  const voteSnap = await db.collection("votes").get();

  const voteCount = {};
  voteSnap.forEach(vote => {
    const id = vote.data().contestantId;
    voteCount[id] = (voteCount[id] || 0) + 1;
  });

  const rows = [];
  contSnap.forEach(doc => {
    const d = doc.data();
    const publicVotes = voteCount[doc.id] || 0;
    const judgeScore = d.judgeScore || 0;
    const finalScore = (publicVotes * 0.5) + (judgeScore * 0.5);

    rows.push([
      d.name,
      d.category,
      publicVotes,
      judgeScore,
      finalScore.toFixed(1)
    ]);
  });

  doc.text("Kingdom Stars Results", 14, 15);
  doc.autoTable({
    head: [["Name", "Category", "Public Votes", "Judge Score", "Final Score"]],
    body: rows,
    startY: 20
  });

  doc.save("KingdomStarsResults.pdf");
}
