from flask import Flask, send_from_directory, jsonify
import json, os

app = Flask(__name__)

DATA_FILE = "players.json"

def load_data():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w") as f:
            json.dump({}, f)
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f)

@app.route("/")
def home():
    return "NEON VOID SERVER ONLINE"

@app.route("/index.html")
def webapp():
    return send_from_directory(".", "index.html")

@app.route("/save/<user_id>/<points>/<energy>")
def save_user(user_id, points, energy):
    data = load_data()
    data[user_id] = {
        "points": int(points),
        "energy": int(energy)
    }
    save_data(data)
    return jsonify({"status": "saved"})

@app.route("/get/<user_id>")
def get_user(user_id):
    data = load_data()
    if user_id in data:
        return jsonify(data[user_id])
    else:
        return jsonify({"points": 0, "energy": 4000})

@app.route("/leaders")
def leaders():
    data = load_data()

    sorted_players = sorted(
        data.items(),
        key=lambda x: x[1]["points"],
        reverse=True
    )

    top20 = []
    rank = 1
    for uid, info in sorted_players[:20]:
        top20.append({
            "rank": rank,
            "user_id": uid,
            "points": info["points"]
        })
        rank += 1

    return jsonify(top20)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
