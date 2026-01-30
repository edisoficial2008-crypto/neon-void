let state = {
  energy: 0,
  coins: 0,
  power: 1,
  taps: 0,
  playTime: 0,
  offline: 0,
  boost: false
};

function load() {
  const s = localStorage.getItem("neonVoid");
  if (s) state = JSON.parse(s);
  updateUI();
}
function save() {
  localStorage.setItem("neonVoid", JSON.stringify(state));
}

document.getElementById("tapBtn").onclick = () => {
  let gain = state.power * (state.boost ? 2 : 1);
  state.energy += gain;
  state.coins += 1;
  state.taps++;
  save();
  updateUI();
};

function buyPower() {
  if (state.coins >= 20) {
    state.coins -= 20;
    state.power++;
    save(); updateUI();
  }
}

function buyOffline() {
  if (state.coins >= 50) {
    state.coins -= 50;
    state.offline += 1;
    save(); updateUI();
  }
}

function activateBoost() {
  if (state.coins >= 30 && !state.boost) {
    state.coins -= 30;
    state.boost = true;
    setTimeout(() => state.boost = false, 30000);
    save(); updateUI();
  }
}

function openTab(id) {
  document.querySelectorAll(".panel").forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
}

function resetGame() {
  localStorage.clear();
  location.reload();
}

function updateUI() {
  energy.textContent = state.energy;
  coins.textContent = state.coins;
  power.textContent = state.power;
  taps.textContent = state.taps;
  time.textContent = state.playTime;
}

setInterval(() => {
  state.playTime++;
  if (state.offline > 0) {
    state.coins += state.offline;
  }
  save(); updateUI();
}, 1000);

load();
