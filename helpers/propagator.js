const { sendEmail } = require("../channels/email");
const { sendTelegramMessage } = require("../channels/telegram");
const { fetchSentMessageByHash } = require("../db");

const propagateToChannels = async ({ text, html = '' }, channels = ['TELEGRAM', 'EMAIL'], options = {}) => {
  const message = await fetchSentMessageByHash(text);
  if(!message) {
    const hits = -1;
    const availableChannelsPromise = [];
    const sendData = {text, html: html || text};

    if(channels.includes('TELEGRAM'))
      availableChannelsPromise.push(sendTelegramMessage(sendData, hits, options));
    if (channels.includes('EMAIL'))
      availableChannelsPromise.push(sendEmail(sendData, hits, options));

    await Promise.all(availableChannelsPromise);
  } else if (message?.hits < 4) {
    const hits = message?.hits || 0;
    const availableChannelsPromise = [];
    const sendData = {text, html: html || text};

    if(message.channel === 'TELEGRAM')
      availableChannelsPromise.push(sendTelegramMessage(sendData, hits, options));
    else if(message.channel === 'EMAIL')
      availableChannelsPromise.push(sendEmail(sendData, hits, options));

    await Promise.all(availableChannelsPromise);
  }
}

module.exports = {
  propagateToChannels
}
