const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { log } = require("./log");

const loadQuerySelector = async () => {
  try {
    const response = await fetch(process.env.CHECK_URL, {
      method: 'GET',
    });
    log(`Loaded URL: ${process.env.CHECK_URL}`);

    const body = await response.text();
    return cheerio.load(body);
  } catch (e) {
    log("Error loading page:", e.message)
  }
}

module.exports = {
  loadQuerySelector,
}
