require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');
// En Node >= 18 puedes usar fetch sin instalar nada; en versiones anteriores instala node-fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const verifyTonContract = require('./verifyTonContract');

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

// Middleware para procesar JSON
app.use(express.json());

// Endpoint para recibir actualizaciones del webhook de Telegram
app.post('/bot', (req, res) => {
  bot.handleUpdate(req.body, res);
});

// Mensaje de bienvenida
bot.start((ctx) => ctx.reply('👋 ¡Hola! CryBot está activo.'));

// Comandos básicos con respuestas fijas
bot.command('tsal0', (ctx) => ctx.reply('💬 Escaneando wallets...'));
bot.command('tokens', (ctx) => ctx.reply('🪙 Listando tokens y NFTs...'));
bot.command('crear', (ctx) => ctx.reply('🔍 Buscando airdrops gratis...'));
bot.command('farm', (ctx) => ctx.reply('🧑‍🌾 Activando modo farming...'));
bot.command('vender', (ctx) => ctx.reply('💰 Vendiendo NFTs para generar ingresos...'));
bot.command('tareas', (ctx) => ctx.reply('📝 Ejecutando tareas de Zealy, Layer3 y similares...'));

// Nuevo comando: verifica el código de un contrato TON
bot.command('verificar', async (ctx) => {
  const [, address] = ctx.message.text.split(' ');
  if (!address) {
    return ctx.reply('Usa /verificar <direccion_wallet>');
  }
  try {
    const result = await verifyTonContract(address);
    if (result.verified) {
      return ctx.reply(`✅ El contrato está verificado. Hash: ${result.codeHash}`);
    }
    if (result.codeHash) {
      return ctx.reply(`⚠️ El contrato no está verificado. Hash calculado: ${result.codeHash}`);
    }
    return ctx.reply('⚠️ La cuenta no tiene código (¿quizá no está desplegada?).');
  } catch (err) {
    console.error(err);
    return ctx.reply('Error al verificar el contrato. Asegúrate de que la dirección es correcta.');
  }
});

// Función auxiliar para obtener la información de la cuenta via toncenter
async function getAccountInfo(address) {
  const apiKey = process.env.TONCENTER_API_KEY ? `&api_key=${process.env.TONCENTER_API_KEY}` : '';
  const url = `https://toncenter.com/api/v2/getExtendedAddressInformation?address=${encodeURIComponent(address)}${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.error || 'Error en la API de toncenter');
  }
  return data.result;
}

// Nuevo comando: devuelve el saldo en TON de una dirección
bot.command('saldo', async (ctx) => {
  const [, address] = ctx.message.text.split(' ');
  if (!address) {
    return ctx.reply('Usa /saldo <direccion_wallet>');
  }
  try {
    const account = await getAccountInfo(address);
    const balanceTon = parseFloat(account.balance) / 1e9;
    return ctx.reply(`💎 Saldo de la cuenta: ${balanceTon} TON`);
  } catch (err) {
    console.error(err);
    return ctx.reply('Error al obtener el saldo. Comprueba la dirección e intenta de nuevo.');
  }
});

// Endpoint de salud para monitorización
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', backend: 'crybot', timestamp: Date.now() });
});

// Endpoint raíz opcional
app.get('/', (req, res) => {
  res.send('CryBot Backend running ✅');
});

// Exportar la app para Vercel/Railway
module.exports = app;
