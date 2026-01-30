let coins = 0;
let level = 1;

window.onload = () => {
  const accepted = localStorage.getItem("privacy");
  coins = Number(localStorage.getItem("coins")) || 0;
  level = Number(localStorage.getItem("level")) || 1;

  if (accepted === "true") {
    showGame();
  } else {
    showPrivacy();
  }
};

function showPrivacy() {
  document.getElementById("privacy").classList.remove("hidden");
  document.getElementById("game").classList.add("hidden");
}

function showGame() {
  document.getElementById("privacy").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  updateUI();
}

function accept() {
  localStorage.setItem("privacy", "true");
  showGame();
}

function tap() {
  coins += 1;

  if (coins >= level * 50) {
    level += 1;
  }

  localStorage.setItem("coins", coins);
  localStorage.setItem("level", level);
  updateUI();
}

function updateUI() {
  document.getElementById("coins").innerText = "Монеты: " + coins;
  document.getElementById("level").innerText = "Уровень: " + level;
}
