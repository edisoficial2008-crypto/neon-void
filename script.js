const tg = window.Telegram.WebApp;
tg.expand();

let data = JSON.parse(localStorage.getItem("game")) || {
  coins:0,
  power:1,
  taps:0,
  auto:false,
  buff:1,
  buffEnd:0,
  start:Date.now(),
  uid:Math.floor(Math.random()*1e9)
};

function save(){
  localStorage.setItem("game",JSON.stringify(data));
}

function acceptPrivacy(){
  localStorage.setItem("privacy","1");
  document.getElementById("privacy").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
}

if(localStorage.getItem("privacy")) acceptPrivacy();

function tap(){
  let gain=data.power;
  if(Date.now()<data.buffEnd) gain*=data.buff;
  data.coins+=gain;
  data.taps++;
  update();
}

function buy(type,price){
  if(data.coins<price) return alert("Мало монет");
  data.coins-=price;
  if(type==="p1") data.power+=1;
  if(type==="p2") data.power+=2;
  update();
}

function buyTemp(mult,price,sec){
  if(data.coins<price) return alert("Мало монет");
  data.coins-=price;
  data.buff=mult;
  data.buffEnd=Date.now()+sec*1000;
  update();
}

function openTab(id){
  ["shop","profile","leader"].forEach(p=>{
    document.getElementById(p).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
  update();
}

function update(){
  coins.textContent=data.coins;
  power.textContent=data.power;
  buff.textContent=Date.now()<data.buffEnd?"x"+data.buff:"—";

  pid.textContent=data.uid;
  pCoins.textContent=data.coins;
  pPower.textContent=data.power;
  pTaps.textContent=data.taps;
  pAuto.textContent=data.auto?"Да":"Нет";
  pTime.textContent=Math.floor((Date.now()-data.start)/1000)+" сек";

  save();
}

setInterval(()=>{
  if(data.auto){
    data.coins+=data.power;
    update();
  }
},1000);

update();
