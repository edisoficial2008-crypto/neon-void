const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

let data = [];
if (fs.existsSync("db.json")) {
  data = JSON.parse(fs.readFileSync("db.json"));
}

app.post("/submit", (req,res) => {
  const {name, score} = req.body;
  const user = data.find(u => u.name === name);
  if (user) {
    if (score > user.score) user.score = score;
  } else {
    data.push({name, score});
  }
  fs.writeFileSync("db.json", JSON.stringify(data));
  res.sendStatus(200);
});

app.get("/top", (req,res) => {
  res.json(
    data.sort((a,b)=>b.score-a.score).slice(0,10)
  );
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running"));
