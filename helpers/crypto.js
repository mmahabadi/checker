const crypto = require("crypto");

const makeHash = (data) => crypto.createHash('md5').update(data).digest("hex")

module.exports = {
  makeHash
}