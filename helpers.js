const fetch = require("node-fetch");
const cheerio = require("cheerio");

const log = (...params) => {
  if(process.env.DEBUG !== 1) return;
  console.log(...params);
}

const loadQuerySelector = async () => {
  const response = await fetch(process.env.CHECK_URL, {
    method: 'GET',
  });
  log(`Loaded URL: ${process.env.CHECK_URL}`);

  const body = await response.text();
  return cheerio.load(body);
}

module.exports = {
  log,
  loadQuerySelector
}