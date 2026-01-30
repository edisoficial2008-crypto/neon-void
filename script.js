const tg = window.Telegram.WebApp;
tg.expand();

let data = JSON.parse(localStorage.getItem("game")) || {
  coins:0,power:1,taps:0,auto:false,
  buff:1,buffEnd:0,start:Date.now(),
  uid:Math.floor(Math.random()*1e9)
};

function save(){localStorage.setItem("game",JSON.stringify(data))}

function acceptPrivacy(){
  localStorage.setItem("privacy","1");
  document.getElementById("privacy").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
}
if(localStorage.getItem("privacy"))acceptPrivacy();

function tap(){
  let m=data.power;
  if(Date.now()<data.buffEnd)m*=data.buff;
  data.coins+=m;
  data.taps++;
  update();
}

function buy(t,p){
  if(data.coins<p)return alert("Мало монет");
  data.coins-=p;
  if(t==="p1")data.power+=1;
  if(t==="p2")data.power+=2;
  if(t==="p5")data.power+=5;
  if(t==="x2")data.power*=2;
  if(t==="x5")data.power*=5;
  if(t==="auto")data.auto=true;
  update();
}

function buyTemp(m,p,s){
  if(data.coins<p)return alert("Мало монет");
  data.coins-=p;
  data.buff=m;
  data.buffEnd=Date.now()+s*1000;
  update();
}

function openTab(id){
  ["shop","profile","leader"].forEach(p=>
    document.getElementById(p).classList.add("hidden"));
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
  pBuff.textContent=Date.now()<data.buffEnd?"Активен":"Нет";
  pTime.textContent=Math.floor((Date.now()-data.start)/1000)+" сек";

  save();
}

setInterval(()=>{
  if(data.auto){data.coins+=data.power;update()}
},1000);

update();
