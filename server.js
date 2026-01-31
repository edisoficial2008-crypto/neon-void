const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 10000;

// База игроков (в памяти сервера)
let players = {};

// Регистрация игрока
app.post("/register", (req, res) => {
    const { userId, username } = req.body;

    if (!players[userId]) {
        players[userId] = {
            username: username || "Игрок",
            coins: 0,
            energy: 100,
            maxEnergy: 100,
            lastOnline: Date.now()
        };
    }

    res.json(players[userId]);
});

// Сохранение прогресса
app.post("/save", (req, res) => {
    const { userId, coins, energy } = req.body;

    if (players[userId]) {
        players[userId].coins = coins;
        players[userId].energy = energy;
        players[userId].lastOnline = Date.now();
    }

    res.json({ status: "saved" });
});

// Получение профиля
app.get("/profile/:userId", (req, res) => {
    const userId = req.params.userId;

    if (!players[userId]) {
        return res.json({ error: "Нет игрока" });
    }

    const p = players[userId];

    // офлайн-реген энергии
    const now = Date.now();
    const minutesOffline = Math.floor((now - p.lastOnline) / 60000);
    const restored = Math.min(p.maxEnergy, p.energy + minutesOffline * 2);

    p.energy = restored;
    p.lastOnline = now;

    res.json(p);
});

// Лидерборд
app.get("/leaderboard", (req, res) => {
    const top = Object.values(players)
        .sort((a, b) => b.coins - a.coins)
        .slice(0, 10);

    res.json(top);
});

app.listen(PORT, () => {
    console.log("Server running on port 10000");
});
