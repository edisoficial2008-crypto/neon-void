from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "NEON VOID SERVER LIVE"

@app.route("/tap", methods=["POST"])
def tap():
    return jsonify({"status": "ok", "reward": 1})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
