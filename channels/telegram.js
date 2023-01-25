const fetch = require("node-fetch");
const { log } = require("../helpers/log");
const {insertMessage, increaseMessageHit} = require("../db");

const sendTelegramMessage = async ({ text, html },  hits = 0, options = {}) => {
  if (!options.chat_ids || !options.chat_ids.length) options.chat_ids = process.env.TELEGRAM_RECEIVERS_CHAT_IDS.split(',');

  log(`Sending message to telegram: ${options.chat_ids.join(",")}`);
  try {
    for (const chat_id of options.chat_ids) {
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${chat_id}&text=${text}`, {
        method: 'GET',
      });

      // increase hits or add
      if (hits === -1) {
        await insertMessage(text, 'TELEGRAM');
      } else {
        await increaseMessageHit(text, hits + 1, 'TELEGRAM')
      }
    }
  } catch (e) {
    log("====Error sending Telegram message: ", e.message)
  }
}

const getUpdates = async () => {
  log(`Getting updates`)
  const updates = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getUpdates`, {
    method: 'GET',
  });
  const res = await updates.json();

  log(`Got telegram update: ${JSON.stringify(res.ok)}`)

  return res;
}

module.exports = {
  sendTelegramMessage,
  getUpdates
}
