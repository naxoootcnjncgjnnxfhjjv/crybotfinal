require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

app.use(express.json());

app.post('/bot', (req, res) => {
  bot.handleUpdate(req.body, res);
});

bot.start((ctx) => ctx.reply("👋 ¡Hola! CryBot está activo."));
bot.command("saldo", (ctx) => ctx.reply("💰 Escaneando tus wallets..."));
bot.command("tokens", (ctx) => ctx.reply("🪙 Listando tokens y NFTs..."));
bot.command("reclamar", (ctx) => ctx.reply("🎁 Buscando airdrops disponibles..."));
bot.command("farm", (ctx) => ctx.reply("🌾 Activando modo farming..."));
bot.command("vender", (ctx) => ctx.reply("📤 Listando NFTs para venta..."));
bot.command("tareas", (ctx) => ctx.reply("📋 Ejecutando tareas Galxe, Zealy y Layer3..."));

// Endpoint de salud para monitorización
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", backend: "crybot", timestamp: Date.now() });
});

app.get("/", (req, res) => {
  res.send("CryBot Backend Running ✅");
});

// 👇️ Exporta el handler para Vercel serverless
module.exports = app;
