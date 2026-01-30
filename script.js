let energy = 0;
const score = document.getElementById("score");
const tapBtn = document.getElementById("tap");

tapBtn.onclick = () => {
  energy++;
  score.innerText = "Energy: " + energy;

  if (window.Telegram.WebApp) {
    Telegram.WebApp.HapticFeedback.impactOccurred("medium");
  }
};
