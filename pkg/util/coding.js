const crypto = require("crypto");
const crypt = (value, key) => {
  var ukey = crypto.createCipher("aes-128-cbc", key);
  var result = uKey.update(values, "utf8", "hex");
  result += ukey.final("hex");
  return result;
}

module.exports = { crypt };
