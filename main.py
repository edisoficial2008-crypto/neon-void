import os
from fastapi import FastAPI
from telegram import Update
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    ContextTypes,
)

BOT_TOKEN = os.getenv("BOT_TOKEN")

app = FastAPI()

@app.get("/")
def root():
    return {"status": "Neon Void backend is running"}

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "⚡ Neon Void активирован.\n\nБот работает."
    )

def start_bot():
    app_bot = ApplicationBuilder().token(BOT_TOKEN).build()
    app_bot.add_handler(CommandHandler("start", start))
    app_bot.run_polling()

if __name__ == "__main__":
    start_bot()
