const tg = window.Telegram.WebApp;
tg.expand();

let data = JSON.parse(localStorage.getItem("game")) || {
  coins: 0,
  power: 1,
  taps: 0,
  auto: false,
  buff: 1,
  buffEnd: 0,
  start: Date.now(),
  uid: Math.floor(Math.random() * 1e9)
};

function save() {
  localStorage.setItem("game", JSON.stringify(data));
}

function acceptPrivacy() {
  localStorage.setItem("privacy", "1");
  document.getElementById("privacy").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
}

if (localStorage.getItem("privacy")) acceptPrivacy();

function tap() {
  let mult = data.power;
  if (Date.now() < data.buffEnd) mult *= data.buff;
  data.coins += mult;
  data.taps++;
  update();
}

function buy(type, price) {
  if (data.coins < price) return alert("Мало монет");
  data.coins -= price;
  if (type === "x2") data.power *= 2;
  if (type === "x5") data.power *= 5;
  if (type === "auto") data.auto = true;
  update();
}

function buyTemp(mult, price, sec) {
  if (data.coins < price) return alert("Мало монет");
  data.coins -= price;
  data.buff = mult;
  data.buffEnd = Date.now() + sec * 1000;
  update();
}

function openTab(id) {
  ["shop","profile","leader"].forEach(p =>
    document.getElementById(p).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
  update();
}

function update() {
  document.getElementById("coins").textContent = data.coins;
  document.getElementById("power").textContent = data.power;
  document.getElementById("buff").textContent =
    Date.now() < data.buffEnd ? `x${data.buff}` : "—";

  document.getElementById("pid").textContent = data.uid;
  document.getElementById("pCoins").textContent = data.coins;
  document.getElementById("pPower").textContent = data.power;
  document.getElementById("pTaps").textContent = data.taps;
  document.getElementById("pAuto").textContent = data.auto ? "Да" : "Нет";
  document.getElementById("pBuff").textContent =
    Date.now() < data.buffEnd ? `x${data.buff}` : "Нет";

  const playTime = Math.floor((Date.now() - data.start) / 1000);
  document.getElementById("pTime").textContent = playTime + " сек";
  document.getElementById("pStart").textContent =
    new Date(data.start).toLocaleString();

  save();
}

setInterval(() => {
  if (data.auto) {
    data.coins += data.power;
    update();
  }
}, 1000);

update();
