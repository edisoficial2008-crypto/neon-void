const tg = window.Telegram.WebApp;
tg.expand();

const userId = tg.initDataUnsafe.user.id;
const coinsEl = document.getElementById("coins");

document.getElementById("tap").onclick = async () => {
    const res = await fetch("https://YOUR_SERVER_URL/tap", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({user_id: userId})
    });
    const data = await res.json();
    coinsEl.innerText = data.coins;
};
