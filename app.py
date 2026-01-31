from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

leaderboard = {}

@app.route("/")
def home():
    return "NEON VOID SERVER ONLINE"

@app.route("/submit", methods=["POST"])
def submit():
    data = request.json
    name = data.get("name")
    score = int(data.get("score", 0))

    if not name:
        return jsonify({"error": "no name"}), 400

    if name not in leaderboard or leaderboard[name] < score:
        leaderboard[name] = score

    return jsonify({"ok": True})

@app.route("/top")
def top():
    top_players = sorted(
        leaderboard.items(),
        key=lambda x: x[1],
        reverse=True
    )[:10]

    return jsonify([
        {"name": n, "score": s}
        for n, s in top_players
    ])

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
