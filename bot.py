import asyncio
import sqlite3
import time
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

TOKEN = "ТВОЙ_ТОКЕН_БОТА_СЮДА"

bot = Bot(token=TOKEN)
dp = Dispatcher()

# ======== БАЗА ДАННЫХ ========
db = sqlite3.connect("game.db", check_same_thread=False)
cur = db.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    username TEXT,
    points INTEGER DEFAULT 0,
    energy INTEGER DEFAULT 4000,
    last_regen INTEGER,
    level INTEGER DEFAULT 1,
    boosts INTEGER DEFAULT 0
)
""")
db.commit()

MAX_ENERGY = 4000
REGEN_INTERVAL = 1800   # 30 минут
REGEN_AMOUNT = 200      # +200 энергии каждые 30 минут

# ======== КЛАВИАТУРЫ ========

def main_menu():
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🎮 Играть", callback_data="tap")],
        [
            InlineKeyboardButton(text="🛒 Магазин", callback_data="shop"),
            InlineKeyboardButton(text="👤 Профиль", callback_data="profile")
        ],
        [InlineKeyboardButton(text="🏆 Лидерборд", callback_data="leaderboard")]
    ])

def shop_menu():
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="⚡ +500 энергии (5 000 очков)", callback_data="buy_energy")],
        [InlineKeyboardButton(text="🚀 Буст x2 (50 000 очков)", callback_data="buy_boost")],
        [InlineKeyboardButton(text="💎 Премиум (300 000 очков)", callback_data="buy_premium")],
        [InlineKeyboardButton(text="🌌 Легенда (1 500 000 очков)", callback_data="buy_legend")],
        [InlineKeyboardButton(text="⬅ Назад", callback_data="back")]
    ])

# ======== ФУНКЦИИ ИГРЫ ========

def get_user(uid, username):
    cur.execute("SELECT * FROM users WHERE user_id=?", (uid,))
    user = cur.fetchone()
    if not user:
        cur.execute(
            "INSERT INTO users (user_id, username, last_regen) VALUES (?, ?, ?)",
            (uid, username, int(time.time()))
        )
        db.commit()
        return get_user(uid, username)
    return user

def regen_energy(uid):
    cur.execute("SELECT energy, last_regen FROM users WHERE user_id=?", (uid,))
    energy, last = cur.fetchone()
    now = int(time.time())

    passed = now - last
    steps = passed // REGEN_INTERVAL

    if steps > 0 and energy < MAX_ENERGY:
        new_energy = min(MAX_ENERGY, energy + steps * REGEN_AMOUNT)
        cur.execute(
            "UPDATE users SET energy=?, last_regen=? WHERE user_id=?",
            (new_energy, now, uid)
        )
        db.commit()

# ======== ХЕНДЛЕРЫ ========

@dp.message(Command("start"))
async def start(msg: types.Message):
    get_user(msg.from_user.id, msg.from_user.username or "Player")
    await msg.answer(
        "🔥 **NEON VOID BOT** 🔥\n"
        "Тапай, качайся, соревнуйся!\n",
        reply_markup=main_menu(),
        parse_mode="Markdown"
    )

@dp.callback_query()
async def callbacks(call: types.CallbackQuery):
    uid = call.from_user.id
    uname = call.from_user.username or "Player"

    get_user(uid, uname)
    regen_energy(uid)

    cur.execute("SELECT points, energy, level, boosts FROM users WHERE user_id=?", (uid,))
    points, energy, level, boosts = cur.fetchone()

    # ===== ТАП =====
    if call.data == "tap":
        if energy >= 10:
            cur.execute(
                "UPDATE users SET points = points + 10, energy = energy - 10 WHERE user_id=?",
                (uid,)
            )
            db.commit()
            await call.answer("💥 +10 очков!")
        else:
            await call.answer("⚠ Нет энергии!")

        await call.message.edit_text(
            f"🎮 **Игра**\n"
            f"⚡ Энергия: {energy}/4000\n"
            f"💰 Очки: {points}\n"
            f"⭐ Уровень: {level}",
            reply_markup=main_menu(),
            parse_mode="Markdown"
        )

    # ===== МАГАЗИН =====
    elif call.data == "shop":
        await call.message.edit_text("🛒 **Магазин** — покупки рассчитаны на долгую игру:", 
                                     reply_markup=shop_menu())

    elif call.data == "buy_energy":
        if points >= 5000:
            cur.execute(
                "UPDATE users SET points = points - 5000, energy = MIN(4000, energy + 500) WHERE user_id=?",
                (uid,)
            )
            db.commit()
            await call.answer("⚡ +500 энергии!")
        else:
            await call.answer("❌ Не хватает очков!")

    elif call.data == "buy_boost":
        if points >= 50000:
            cur.execute(
                "UPDATE users SET points = points - 50000, boosts = boosts + 1 WHERE user_id=?",
                (uid,)
            )
            db.commit()
            await call.answer("🚀 Куплен буст x2!")
        else:
            await call.answer("❌ Не хватает очков!")

    elif call.data == "buy_premium":
        if points >= 300000:
            cur.execute(
                "UPDATE users SET points = points - 300000, level = level + 5 WHERE user_id=?",
                (uid,)
            )
            db.commit()
            await call.answer("💎 Премиум активирован!")
        else:
            await call.answer("❌ Не хватает очков!")

    elif call.data == "buy_legend":
        if points >= 1500000:
            cur.execute(
                "UPDATE users SET points = points - 1500000, level = level + 20 WHERE user_id=?",
                (uid,)
            )
            db.commit()
            await call.answer("🌌 Ты легенда игры!")
        else:
            await call.answer("❌ Не хватает очков!")

    # ===== ПРОФИЛЬ =====
    elif call.data == "profile":
        await call.message.edit_text(
            f"👤 **ТВОЙ ПРОФИЛЬ**\n"
            f"Имя: @{uname}\n"
            f"⭐ Уровень: {level}\n"
            f"💰 Очки: {points}\n"
            f"⚡ Энергия: {energy}/4000\n"
            f"🚀 Бусты: {boosts}\n"
            f"🎯 Прогресс сохраняется автоматически!\n",
            reply_markup=main_menu(),
            parse_mode="Markdown"
        )

    # ===== ЛИДЕРБОРД =====
    elif call.data == "leaderboard":
        cur.execute("SELECT username, points FROM users ORDER BY points DESC LIMIT 10")
        top = cur.fetchall()

        text = "🏆 **ТОП-10 ИГРОКОВ** 🏆\n\n"
        for i, (name, pts) in enumerate(top, 1):
            text += f"{i}. @{name} — {pts} очков\n"

        await call.message.edit_text(text, reply_markup=main_menu())

    elif call.data == "back":
        await call.message.edit_text(
            "🔥 **NEON VOID BOT** 🔥",
            reply_markup=main_menu()
        )

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
