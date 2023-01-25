require('dotenv').config();

const { getUpdates } = require('./channels/telegram');
const { propagateToChannels } = require('./helpers/propagator');
const { loadQuerySelector,} = require('./helpers/crawler');
const { log } = require('./helpers/log');
const {disconnect} = require("./db");

/**
 * Parse URL
 */
(async () => {
  const $ = await loadQuerySelector();

  const textTitleList = [];
  const htmlTitleList = [];
  $('#layer-product-list > div.regi-list > div').each((i, section) => {
    const $section = $(section);
    const titleAndInfo = $section.find('h4').text().replace(/\r?\n|\r|\t/gm, "").trim().split("  ");
    const mainTitle = titleAndInfo[0];

    titleAndInfo.splice(0, 1)
    const des = titleAndInfo.filter(n => n.trim()).join(" , ");

    const features = []
    $section.find("ul.regi-acm > li").each((i, li) => features.push($(li).text()));

    textTitleList.push(`${mainTitle}\n
${$section.find(".price").text()}\n
\n
[${des}]\n
\n
${$section.attr('data-url')}
    `);
    htmlTitleList.push(`
${mainTitle}<br/>
<strong>${$section.find(".price").text()}</strong><br/>
${features.join("<br/>")}<br/>
<br/>
[${des}]<br/>
<br/>
<a href="${$section.attr('data-url')}" target="_blank">Link</a>
    `);
  });

  log("Grabbed " + textTitleList.length + " Items!");
  for(let i = 0; i < textTitleList.length; i++) {
    const title = textTitleList[i];
    await propagateToChannels({ text: title, html: htmlTitleList[i] });
  }

  /**
   * Check current telegram bot messages
   */
  try {
    const {ok, result} = await getUpdates();
    if (ok && result.length) {
      for(let j = 0; j < result.length; j++) {
        const chat = result[j];
        await propagateToChannels(
          { text: `Hi ${chat?.message?.from?.first_name}, Your ChatID is: [${chat?.message?.chat?.id}]`},
          ['TELEGRAM'],
          { chat_ids: [chat?.message?.chat?.id] }
        );
      }
    }
  } catch (e) {
    log("error getting bot updates!", e.message)
  }

  disconnect();
})();
