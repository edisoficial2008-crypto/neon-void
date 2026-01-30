let points = 124;
let energy = 3963;

const tapZone = document.getElementById("tapZone");

tapZone.addEventListener("click", (e) => {
  if (energy <= 0) return;

  points++;
  energy--;

  document.getElementById("points").innerText = points;
  document.getElementById("energy").innerText = energy;

  const num = document.createElement("div");
  num.className = "tap-number";
  num.innerText = "+1";
  num.style.left = e.clientX + "px";
  num.style.top = e.clientY + "px";

  document.body.appendChild(num);
  setTimeout(() => num.remove(), 1000);
});

function openModal(id) {
  document.getElementById(id).style.display = "flex";
}

function closeModal() {
  document.querySelectorAll(".modal").forEach(m => m.style.display = "none");
}
