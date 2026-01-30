const tg = window.Telegram.WebApp;
tg.expand();

let state = JSON.parse(localStorage.getItem("neon_void")) || {
  energy: 0,
  coins: 0,
  power: 1,
  taps: 0,
  time: 0,
  earned: 0,
  offline: 0,
  boost: 1,
  autoTap: false
};

const $ = id => document.getElementById(id);

function save() {
  localStorage.setItem("neon_void", JSON.stringify(state));
}

function update() {
  $("energy").textContent = state.energy;
  $("coins").textContent = state.coins;
  $("power").textContent = state.power;
  $("taps").textContent = state.taps;
  $("time").textContent = state.time;
  $("earned").textContent = state.earned;
  $("powerLvl").textContent = state.power;
  $("offline").textContent = state.offline;
}

/* TAP */
$("tapCircle").onclick = () => {
  const gain = state.power * state.boost;
  state.energy += gain;
  state.coins += 1;
  state.earned += 1;
  state.taps++;
  save(); update();
};

/* МАГАЗИН */
$("buyPower").onclick = () => {
  if (state.coins >= 50) {
    state.coins -= 50;
    state.power += 1;
    save(); update();
  }
};

$("buyPower5").onclick = () => {
  if (state.coins >= 220) {
    state.coins -= 220;
    state.power += 5;
    save(); update();
  }
};

$("buyEnergy").onclick = () => {
  if (state.coins >= 150) {
    state.coins -= 150;
    state.energy += 50;
    save(); update();
  }
};

$("buyOffline").onclick = () => {
  if (state.coins >= 300) {
    state.coins -= 300;
    state.offline += 1;
    save(); update();
  }
};

/* БУСТЫ */
function activateBoost(mult, sec) {
  state.boost = mult;
  let t = sec;
  const timer = setInterval(() => {
    $("boostTimer").textContent = `🔥 x${mult} — ${t--} сек`;
    if (t < 0) {
      state.boost = 1;
      $("boostTimer").textContent = "";
      clearInterval(timer);
    }
  }, 1000);
}

$("boost2x").onclick = () => {
  if (state.coins >= 100) {
    state.coins -= 100;
    activateBoost(2, 30);
    save(); update();
  }
};

$("boost3x").onclick = () => {
  if (state.coins >= 180) {
    state.coins -= 180;
    activateBoost(3, 20);
    save(); update();
  }
};

$("boostAuto").onclick = () => {
  if (state.coins >= 250 && !state.autoTap) {
    state.coins -= 250;
    state.autoTap = true;
    let t = 20;
    const auto = setInterval(() => {
      if (t-- <= 0) {
        state.autoTap = false;
        clearInterval(auto);
      } else {
        $("tapCircle").click();
      }
    }, 500);
    save(); update();
  }
};

/* ТАБЫ */
document.querySelectorAll(".tabs button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".panel").forEach(p => p.style.display = "none");
    $(btn.dataset.tab).style.display = "block";
  };
});

/* ПАССИВНЫЙ ДОХОД + ВРЕМЯ */
setInterval(() => {
  state.time++;
  if (state.offline > 0) {
    state.coins += state.offline;
    state.earned += state.offline;
  }
  save(); update();
}, 1000);

update();
