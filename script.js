let state = {
  energy: 0,
  coins: 0,
  power: 1
};

// загрузка
function load() {
  const saved = localStorage.getItem("neonVoid");
  if (saved) state = JSON.parse(saved);
  updateUI();
}

// сохранение
function save() {
  localStorage.setItem("neonVoid", JSON.stringify(state));
  fetch("/save", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(state)
  });
}

function tap() {
  state.energy += state.power;
  state.coins += 1;
  save();
  updateUI();
}

function buyUpgrade() {
  if (state.coins >= 10) {
    state.coins -= 10;
    state.power += 1;
    save();
    updateUI();
  }
}

function updateUI() {
  document.getElementById("energy").innerText = state.energy;
  document.getElementById("coins").innerText = state.coins;
}

document.getElementById("tap").onclick = tap;

load();
