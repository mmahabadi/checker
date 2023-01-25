const log = (...params) => {
  if(process.env.DEBUG !== '1') return;
  console.log(...params);
}

module.exports = {
  log
}
