let score = 0;
let boost = 1;

const scoreEl = document.getElementById("score");
const tapBtn = document.getElementById("tap");

tapBtn.addEventListener("click", () => {
  score += boost;
  scoreEl.textContent = score;
});

function buyBoost() {
  if (score >= 10) {
    score -= 10;
    boost = 2;
    scoreEl.textContent = score;
    alert("Буст x2 активирован!");
  } else {
    alert("Не хватает очков");
  }
}
