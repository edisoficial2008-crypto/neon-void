import os
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

TOKEN = os.getenv("BOT_TOKEN", "8485189326:AAE1VrVkjmyzJQvUGLuMx0I8OPa72fIBg6A")
bot = telebot.TeleBot(TOKEN)

WEBAPP_URL = "https://neon-void-4.onrender.com/index.html"

@bot.message_handler(commands=["start"])
def start(message):
    keyboard = InlineKeyboardMarkup()
    btn = InlineKeyboardButton(
        text="🎮 Играть",
        web_app=WebAppInfo(url=WEBAPP_URL)
    )
    keyboard.add(btn)

    bot.send_message(
        message.chat.id,
        "⚡ Добро пожаловать в NEON VOID!\nНажми кнопку ниже 👇",
        reply_markup=keyboard
    )

print("Bot is running...")
bot.infinity_polling()
