from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# временное хранилище (позже БД)
players = {}

class Player(BaseModel):
    tg_id: int
    name: str
    data: dict

@app.post("/save")
def save_player(player: Player):
    players[player.tg_id] = {
        "name": player.name,
        "data": player.data
    }
    return {"status": "saved"}

@app.get("/load/{tg_id}")
def load_player(tg_id: int):
    return players.get(tg_id, None)

@app.get("/leaderboard")
def leaderboard():
    top = sorted(
        players.values(),
        key=lambda x: x["data"].get("coins", 0),
        reverse=True
    )[:10]

    return [
        {
            "name": p["name"],
            "coins": p["data"].get("coins", 0)
        }
        for p in top
]
