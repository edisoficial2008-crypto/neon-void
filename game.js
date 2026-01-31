const tg = window.Telegram?.WebApp;
if (tg) tg.expand();

/* ---------- СОСТОЯНИЕ ИГРЫ ---------- */
let game = {
  coins: 0,
  energy: 100,
  maxEnergy: 100,
  tapPower: 1
};

/* ---------- ЗАГРУЗКА ---------- */
function loadGame() {
  const saved = localStorage.getItem("neon_void_save");
  if (saved) {
    game = JSON.parse(saved);
  }
  updateUI();
}

/* ---------- СОХРАНЕНИЕ ---------- */
function saveGame() {
  localStorage.setItem("neon_void_save", JSON.stringify(game));
}

/* ---------- UI ---------- */
function updateUI() {
  document.getElementById("coins").textContent = game.coins;
  document.getElementById("energy").textContent = Math.floor(game.energy);
  document.getElementById("maxEnergy").textContent = game.maxEnergy;
}

/* ---------- ТАП ---------- */
const orb = document.getElementById("orb");

orb.addEventListener("click", () => {
  if (game.energy <= 0) return;

  game.coins += game.tapPower;
  game.energy -= 1;

  saveGame();
  updateUI();
});

/* ---------- РЕГЕН ЭНЕРГИИ ---------- */
setInterval(() => {
  if (game.energy < game.maxEnergy) {
    game.energy += 0.5;
    if (game.energy > game.maxEnergy)
      game.energy = game.maxEnergy;

    saveGame();
    updateUI();
  }
}, 1000);

/* ---------- КНОПКИ ---------- */
function openShop() {
  alert(
    "МАГАЗИН:\n\n" +
    "⚡ +50 энергии — 5000 💰\n" +
    "💥 +1 сила тапа — 15000 💰\n\n" +
    "(скоро сделаем UI)"
  );
}

function openProfile() {
  alert(
    "ПРОФИЛЬ:\n\n" +
    "Монеты: " + game.coins + "\n" +
    "Сила тапа: " + game.tapPower
  );
}

function openLeaderboard() {
  alert("Лидерборд скоро 🔥");
}

/* ---------- СТАРТ ---------- */
loadGame();
