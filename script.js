const tg = window.Telegram.WebApp;
tg.expand();

let state = JSON.parse(localStorage.getItem("neon_void")) || {
  energy: 0,
  coins: 0,
  power: 1,
  taps: 0,
  time: 0,
  boost: false
};

const energy = document.getElementById("energy");
const coins = document.getElementById("coins");
const power = document.getElementById("power");
const taps = document.getElementById("taps");
const time = document.getElementById("time");

function save() {
  localStorage.setItem("neon_void", JSON.stringify(state));
}

function update() {
  energy.textContent = state.energy;
  coins.textContent = state.coins;
  power.textContent = state.power;
  taps.textContent = state.taps;
  time.textContent = state.time;
}

/* TAP */
document.getElementById("tapCircle").addEventListener("click", () => {
  const gain = state.power * (state.boost ? 2 : 1);
  state.energy += gain;
  state.coins += 1;
  state.taps += 1;
  save();
  update();
});

/* МАГАЗИН */
document.getElementById("buyPower").onclick = () => {
  if (state.coins >= 20) {
    state.coins -= 20;
    state.power += 1;
    save();
    update();
  }
};

/* БУСТ */
document.getElementById("boostBtn").onclick = () => {
  if (state.coins >= 30 && !state.boost) {
    state.coins -= 30;
    state.boost = true;
    let t = 30;
    const timer = setInterval(() => {
      document.getElementById("boostTimer").textContent = `⏳ ${t--} сек`;
      if (t < 0) {
        state.boost = false;
        document.getElementById("boostTimer").textContent = "";
        clearInterval(timer);
      }
    }, 1000);
    save();
    update();
  }
};

/* ТАБЫ */
document.querySelectorAll(".tabs button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".panel").forEach(p => p.style.display = "none");
    document.getElementById(btn.dataset.tab).style.display = "block";
  });
});

/* ТАЙМЕР */
setInterval(() => {
  state.time++;
  save();
  update();
}, 1000);

update();
