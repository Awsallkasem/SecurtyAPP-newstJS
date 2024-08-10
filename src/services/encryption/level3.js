// crypto module
const crypto = require("crypto");

const algorithm = "aes-256-cbc";

// generate 16 bytes of random data
const initVector = "1234567812345678"; /*crypto.randomBytes(16)*/

//const Securitykey =process.env.sessionKey/* crypto.createHash('md5').update(secret).digest('hex');*/// 16 Bytes and IV is 16 Bytes

class PgbAlg {
  EncryptData(message, Securitykey) {
    const encryptalgo = crypto.createCipheriv(
      algorithm,
      Securitykey,
      initVector
    );
    let encrypted = encryptalgo.update(message, "utf8", "hex");
    encrypted += encryptalgo.final("hex");
    return encrypted;
  }

  DycryptData(message, Securitykey) {
    const decryptalgo = crypto.createDecipheriv(
      algorithm,
      Securitykey,
      initVector
    );

    let decrypted = decryptalgo.update(message, "hex", "utf8");

    decrypted += decryptalgo.final("utf8");

    return decrypted;
  }
  generateMac(data) {
    return crypto
      .createHmac("sha1", "62608e08adc29a8d6dbc9754e659f125")
      .update(`${data}`)
      .digest("hex");
  }

  checkMac(data, socket) {
    const originalMac = data.mac;
    data.mac = undefined;
    const currentMac = this.generateMac(data.containt);
    console.log(currentMac);
    console.log(originalMac);
    if (originalMac !== currentMac) {
      console.log("Data Is Hacked");
      return false;
    }
    return true;
  }
}
module.exports = new PgbAlg();
