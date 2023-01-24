const fetch = require("node-fetch");
const { log } = require("./helpers");

const sendMessage = async (text, chat_ids = ['']) => {
  if(!chat_ids.length) process.env.CHAT_IDS.split(',');

  log(`Sending message to: ${chat_ids.join(",")}`)
  for (const chat_id of chat_ids) {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${chat_id}&text=${text}`, {
      method: 'GET',
    });
  }
}

const getUpdates = async () => {
  log(`Getting updates`)
  const updates = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getUpdates`, {
    method: 'GET',
  });
  const res =  await updates.json();

  log(`Got update: ${JSON.stringify(res)}`)

  return res;
}

module.exports = {
  sendMessage,
  getUpdates
}