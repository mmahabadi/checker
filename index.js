require('dotenv').config();

const { getUpdates, sendMessage } = require('./telegram');
const { loadQuerySelector, log } = require('./helpers');

/**
 * Parse URL
 */
(async () => {
  const $ = await loadQuerySelector();

  const titleList = [];
  $('#layer-product-list > div.regi-list > div > div.regi-center > div > h4').each((i, title) => {
    const titleAndInfo = $(title).text().replace(/\r?\n|\r|\t/gm, "").trim().split("  ");
    const mainTitle = titleAndInfo[0];

    titleAndInfo.splice(0, 1)
    const des = titleAndInfo.filter(n => n.trim()).join(" , ");

    titleList.push(`${mainTitle} [${des}]`);
  });

  titleList.forEach(title => {
    sendMessage(title);
  })
})();

/**
 * Check current messages
 */
(async () => {
  try {
    const {ok, result} = await getUpdates();
    if (ok && result.length) {
      result.map(chat => {
        sendMessage(`Hi ${chat?.message?.from?.first_name}, Your ChatID is: [${chat?.message?.chat?.id}]`, [chat?.message?.chat?.id])
      });
    }
  } catch (e) {
    log("error getting bot updates!", e.message)
  }
})();