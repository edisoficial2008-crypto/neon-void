let score = 124;
let energy = 3963;
const maxEnergy = 4000;

const scoreEl = document.getElementById("score");
const energyEl = document.getElementById("energy");
const tapZone = document.getElementById("tapZone");

tapZone.addEventListener("click", (e) => {
  if (energy <= 0) return;

  score++;
  energy--;

  scoreEl.textContent = score;
  energyEl.textContent = energy;

  showTapNumber(e.clientX, e.clientY);
});

function showTapNumber(x, y) {
  const num = document.createElement("div");
  num.className = "tap-number";
  num.textContent = "+1";
  num.style.left = x + "px";
  num.style.top = y + "px";
  document.body.appendChild(num);

  setTimeout(() => num.remove(), 1000);
}

/* КНОПКИ */
function openShop() {
  alert("🛒 Магазин (дальше добавим)");
}

function openProfile() {
  alert("👤 Профиль");
}

function openLeaderboard() {
  alert("🏆 Лидерборд");
}
