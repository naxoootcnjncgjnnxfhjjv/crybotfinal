require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🤖 Bienvenido a CryBot. Escribe /saldo para ver tu wallet.");
});

bot.onText(/\/saldo/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "🔍 Consultando tu saldo... (simulado)");
});