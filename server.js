const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 10000;

// ТВОЙ РЕНДЕР
const BASE_URL = "https://neon-void-2.onrender.com";

app.use(cors());
app.use(express.json());

// ======== БАЗА (НЕ СТИРАЕТ ВАШ ПРОГРЕСС) ========
const DB_FILE = "db.json";

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ players: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// ====== СОХРАНЕНИЕ ОЧКОВ ======
app.post("/submit", (req, res) => {
  const { userId, username, score, energy } = req.body;

  let db = loadDB();

  if (!db.players[userId]) {
    db.players[userId] = {
      username,
      score: 0,
      energy: 100,
      lastActive: Date.now()
    };
  }

  db.players[userId].username = username;
  db.players[userId].score = Math.max(
    db.players[userId].score,
    score
  );
  db.players[userId].energy = energy;
  db.players[userId].lastActive = Date.now();

  saveDB(db);

  res.json({ status: "ok" });
});

// ====== ЛИДЕРБОРД (ТОП-20) ======
app.get("/top", (req, res) => {
  let db = loadDB();

  const top = Object.entries(db.players)
    .map(([id, p]) => ({
      userId: id,
      username: p.username || "Player",
      score: p.score || 0
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  res.json(top);
});

// ====== ПРОФИЛЬ ======
app.get("/profile/:id", (req, res) => {
  let db = loadDB();
  const p = db.players[req.params.id];

  if (!p) {
    return res.json({
      username: "Новичок",
      score: 0,
      energy: 100,
      rank: "Bronze"
    });
  }

  const all = Object.values(db.players).sort((a,b)=>b.score-a.score);
  const rank = all.findIndex(x => x.username === p.username) + 1;

  res.json({
    username: p.username,
    score: p.score,
    energy: p.energy,
    rank
  });
});

app.get("/", (req, res) => {
  res.send("NEON VOID SERVER IS LIVE 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
