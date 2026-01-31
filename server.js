const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 10000;
app.use(cors());
app.use(express.json());

const DB_FILE = "db.json";

// ---------- БАЗА ----------
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify({ players: {} }, null, 2)
    );
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// ---------- ОТПРАВКА ПРОГРЕССА + ОФЛАЙН РЕГЕН ----------
app.post("/submit", (req, res) => {
  const { userId, username, score, energy } = req.body;
  let db = loadDB();

  if (!db.players[userId]) {
    db.players[userId] = {
      username,
      score: 0,
      energy: 100,
      maxEnergy: 100,
      lastActive: Date.now(),
      boosts: [],
      tempBoosts: {},
      tapsToday: 0
    };
  }

  const p = db.players[userId];

  // офлайн-реген: +1 энергии каждые 30 сек
  const now = Date.now();
  const diff = Math.floor((now - p.lastActive) / 30000);
  p.energy = Math.min(p.maxEnergy, p.energy + diff);

  p.username = username;
  p.score = Math.max(p.score, score);
  p.energy = Math.min(4000, energy);   // ЖЁСТКИЙ ЛИМИТ 4000
  p.lastActive = now;

  saveDB(db);
  res.json({ status: "ok" });
});

// ---------- ПОКУПКИ ----------
app.post("/buy", (req, res) => {
  const { userId, item, price, bonus, tempMinutes } = req.body;
  let db = loadDB();

  const p = db.players[userId];
  if (!p) return res.status(400).json({ error: "Нет игрока" });

  if (p.score < price) {
    return res.json({ ok: false, msg: "Недостаточно монет" });
  }

  p.score -= price;

  if (bonus) {
    p.maxEnergy = Math.min(4000, p.maxEnergy + bonus);
  }

  if (tempMinutes) {
    p.tempBoosts[item] = Date.now() + tempMinutes * 60 * 1000;
  } else {
    p.boosts.push(item);
  }

  saveDB(db);
  res.json({
    ok: true,
    newScore: p.score,
    newMax: p.maxEnergy
  });
});

// ---------- ПРОФИЛЬ ----------
app.get("/profile/:id", (req, res) => {
  let db = loadDB();
  const p = db.players[req.params.id];

  if (!p) return res.json({ error: "Нет профиля" });

  const all = Object.values(db.players).sort((a,b)=>b.score-a.score);
  const rank = all.findIndex(x => x.username === p.username) + 1;

  res.json({
    username: p.username,
    score: p.score,
    energy: p.energy,
    maxEnergy: p.maxEnergy,
    boosts: p.boosts,
    tempBoosts: p.tempBoosts,
    rank,
    lastActive: p.lastActive
  });
});

// ---------- ЛИДЕРБОРД ----------
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

app.get("/", (req, res) => {
  res.send("NEON VOID SERVER LIVE 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
