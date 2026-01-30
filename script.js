let data = JSON.parse(localStorage.getItem("game")) || {
  coins: 0,
  power: 1,
  auto: false,
  temp: null,
  tempEnd: 0
};

function save() {
  localStorage.setItem("game", JSON.stringify(data));
}

function acceptPrivacy() {
  localStorage.setItem("privacy", "1");
  document.getElementById("privacy").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
}

if (localStorage.getItem("privacy")) acceptPrivacy();

function tap() {
  let mult = data.power;
  if (data.temp && Date.now() < data.tempEnd) mult *= data.temp;
  data.coins += mult;
  update();
}

function buy(type, price) {
  if (data.coins < price) return alert("Мало монет");
  data.coins -= price;

  if (type === "x2") data.power *= 2;
  if (type === "auto") data.auto = true;

  update();
}

function buyTemp(mult, price, sec) {
  if (data.coins < price) return alert("Мало монет");
  data.coins -= price;
  data.temp = mult === "x5" ? 5 : 10;
  data.tempEnd = Date.now() + sec * 1000;
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
  document.getElementById("pCoins").textContent = data.coins;
  document.getElementById("pPower").textContent = data.power;
  document.getElementById("pAuto").textContent = data.auto ? "Да" : "Нет";
  save();
}

setInterval(() => {
  if (data.auto) {
    data.coins += data.power;
    update();
  }
}, 1000);

update();
