import requests
from aiogram import Bot, Dispatcher, executor, types

BOT_TOKEN = "8485189326:AAEezz5u6ktCSQw4i1jVcPKCzHnPCnmcBMo"
API_URL = "https://neon-void-1.onrender.com"

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(bot)

# /start
@dp.message_handler(commands=["start"])
async def start(message: types.Message):
    tg_id = message.from_user.id
    name = message.from_user.first_name

    data = {
        "tg_id": tg_id,
        "name": name,
        "data": {
            "coins": 0
        }
    }

    requests.post(f"{API_URL}/save", json=data)

    await message.answer(
        "🎮 Добро пожаловать!\n\n"
        "Команды:\n"
        "/profile — профиль\n"
        "/leaderboard — топ игроков"
    )

# /profile
@dp.message_handler(commands=["profile"])
async def profile(message: types.Message):
    tg_id = message.from_user.id

    r = requests.get(f"{API_URL}/load/{tg_id}")
    player = r.json()

    if not player:
        await message.answer("❌ Профиль не найден")
        return

    coins = player["data"].get("coins", 0)

    await message.answer(
        f"👤 Профиль\n"
        f"💰 Монеты: {coins}"
    )

# /leaderboard
@dp.message_handler(commands=["leaderboard"])
async def leaderboard(message: types.Message):
    r = requests.get(f"{API_URL}/leaderboard")
    top = r.json()

    if not top:
        await message.answer("Топ пуст 😴")
        return

    text = "🏆 ТОП ИГРОКОВ:\n\n"
    for i, p in enumerate(top, 1):
        text += f"{i}. {p['name']} — {p['coins']} 💰\n"

    await message.answer(text)

if __name__ == "__main__":
    executor.start_polling(dp)
