from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

DB_FILE = "leaderboard.json"

# Создаём файл базы, если его нет
if not os.path.exists(DB_FILE):
    with open(DB_FILE, "w") as f:
        json.dump({}, f)

def load_db():
    with open(DB_FILE, "r") as f:
        return json.load(f)

def save_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f)

@app.route("/")
def home():
    return "Neon Void Server Online"

@app.route("/save_score", methods=["POST"])
def save_score():
    data = request.json
    user_id = str(data["user_id"])
    username = data.get("username", "Игрок")
    score = data["score"]

    db = load_db()
    db[user_id] = {"name": username, "score": score}
    save_db(db)

    return {"status": "ok"}

@app.route("/leaderboard")
def leaderboard():
    db = load_db()

    # Сортируем по очкам
    top = sorted(db.items(), key=lambda x: x[1]["score"], reverse=True)[:10]

    result = []
    place = 1
    for uid, info in top:
        result.append({
            "place": place,
            "name": info["name"],
            "score": info["score"]
        })
        place += 1

    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
