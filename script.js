let data = JSON.parse(localStorage.getItem("neonVoid")) || {
  coins: 0,
  energy: 4000,
  maxEnergy: 4000,
  tapPower: 1,
  taps: 0
};

// ЖЁСТКО ЧИНИМ ЭНЕРГИЮ
if (data.energy > data.maxEnergy) {
  data.energy = data.maxEnergy;
}

const coinsEl = document.getElementById("coins");
const energyEl = document.getElementById("energy");
const maxEnergyEl = document.getElementById("maxEnergy");
const tapsEl = document.getElementById("taps");
const tapPowerEl = document.getElementById("tapPower");

function save() {
  localStorage.setItem("neonVoid", JSON.stringify(data));
}

function updateUI() {
  coinsEl.textContent = data.coins;
  energyEl.textContent = data.energy;
  maxEnergyEl.textContent = data.maxEnergy;
  tapsEl.textContent = data.taps;
  tapPowerEl.textContent = data.tapPower;
}

document.getElementById("tapCircle").onclick = () => {
  if (data.energy <= 0) return;

  data.coins += data.tapPower;
  data.energy -= 1;
  data.taps++;

  save();
  updateUI();
};

function buyUpgrade() {
  if (data.coins >= 1000) {
    data.coins -= 1000;
    data.tapPower += 1;
    save();
    updateUI();
  }
}

function openWindow(id) {
  document.getElementById(id).style.display = "block";
}

function closeWindow() {
  document.querySelectorAll(".window").forEach(w => w.style.display = "none");
}

// РЕГЕН ЭНЕРГИИ
setInterval(() => {
  if (data.energy < data.maxEnergy) {
    data.energy++;
    save();
    updateUI();
  }
}, 1000);

updateUI();
// ===== ПРОКАЧКА =====
let tapPower = parseInt(localStorage.getItem("tapPower")) || 1;
let energyMax = parseInt(localStorage.getItem("energyMax")) || 4000;

let upgradeTapPrice = parseInt(localStorage.getItem("upgradeTapPrice")) || 50;
let upgradeEnergyPrice = parseInt(localStorage.getItem("upgradeEnergyPrice")) || 150;

function saveUpgrades() {
  localStorage.setItem("tapPower", tapPower);
  localStorage.setItem("energyMax", energyMax);
  localStorage.setItem("upgradeTapPrice", upgradeTapPrice);
  localStorage.setItem("upgradeEnergyPrice", upgradeEnergyPrice);
}
