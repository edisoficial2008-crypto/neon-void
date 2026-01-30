from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/save")
async def save_game(data: dict):
    print("SAVE:", data)
    return {"status": "ok"}

@app.get("/")
def root():
    return {"Neon Void": "Backend Online"}
