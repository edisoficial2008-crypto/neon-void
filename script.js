let coins = 0;

// Проверка согласия
window.onload = () => {
  const accepted = localStorage.getItem("privacyAccepted");

  if (accepted === "true") {
    showGame();
  } else {
    showPrivacy();
  }
};

function showPrivacy() {
  document.getElementById("privacy-screen").style.display = "block";
  document.getElementById("game-screen").style.display = "none";
}

function showGame() {
  document.getElementById("privacy-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
}

function acceptPrivacy() {
  localStorage.setItem("privacyAccepted", "true");
  showGame();
}

// ТАП
function tap() {
  coins += 1;
  document.getElementById("coins").innerText = "Монеты: " + coins;
}
