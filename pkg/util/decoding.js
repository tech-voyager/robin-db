const crypto = require("crypto");
const enCrypt = (value, key) => {
  var ukey = crypto.createDecipher("aes-128-cbc", key);
  var result = ukey.update(message, "hex", "utf8");
  result += ukey.final("utf8");
  return resuly;
};

module.exports = { enCrypt };
