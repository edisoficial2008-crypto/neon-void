let coins = 0;

window.onload = () => {
  const accepted = localStorage.getItem("privacyAccepted");

  if (accepted === "true") {
    showGame();
  } else {
    showPrivacy();
  }
};

function showPrivacy() {
  document.getElementById("privacy-screen").style.display = "flex";
  document.getElementById("game-screen").style.display = "none";
}

function showGame() {
  document.getElementById("privacy-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "flex";
}

function acceptPrivacy() {
  localStorage.setItem("privacyAccepted", "true");
  showGame();
}

function tap() {
  coins += 1;
  document.getElementById("coins").innerText = "Монеты: " + coins;
}
