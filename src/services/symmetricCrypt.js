// crypto module
const crypto = require("crypto");
// const Hash = require('../hash');

// generate 16 bytes of random data
const initVector = "1234567812345678"; /*crypto.randomBytes(16)*/

const algorithm = "aes-256-cbc"; // You may choose the appropriate algorithm

class Sym_Alg {
  EncryptData(info) {
    const Securitykey = JSON.parse(localStorage.getItem("user")).nationalID;
    // Ensure the key is of the correct length (256 bits for aes-256-cbc)
    const keyBuffer = Buffer.from(Securitykey, "utf-8");
    const key = crypto
      .createHash("sha256")
      .update(keyBuffer)
      .digest("base64")
      .substr(0, 32);
    // /AuthService.getCurrentUser().nationalID/* crypto.createHash('md5').update(secret).digest('hex');*/// 16 Bytes and IV is 16 Bytes

    const encryptalgo = crypto.createCipheriv(algorithm, key, initVector);
    let encrypted = encryptalgo.update(info, "utf8", "hex");
    encrypted += encryptalgo.final("hex");
    return encrypted;
  }

  DycryptData(message) {
    const Securitykey = JSON.parse(localStorage.getItem("user"));
    // Ensure the key is of the correct length (256 bits for aes-256-cbc)
    const keyBuffer = Buffer.from(Securitykey.nationalID, "utf8");
    const key = crypto
      .createHash("sha256")
      .update(keyBuffer)
      .digest("base64")
      .substr(0, 32);
    // /AuthService.getCurrentUser().nationalID/* crypto.createHash('md5').update(secret).digest('hex');*/// 16 Bytes and IV is 16 Bytes

    const decryptalgo = crypto.createDecipheriv(algorithm, key, initVector);

    let decrypted = decryptalgo.update(message, "hex", "utf8");
    decrypted += decryptalgo.final("utf8");
    return decrypted;
  }
  generateMac(data) {
    const Securitykey = JSON.parse(localStorage.getItem("user"));

    return crypto
      .createHmac("sha1", "62608e08adc29a8d6dbc9754e659f125")
      .update(`${data}`)
      .digest("hex");
  }

  SymettricAlgrothim(data, socket) {
    const originalMac = data.mac;
    data.mac = undefined;
    const currentMac = this.generateMac(data);

    if (originalMac !== currentMac) {
      socket.emit("err", "Data Is Hacked");
    }

    const dycreptMsg = this.DycryptData(data.message);

    this.EncryptData(dycreptMsg);
  }
  async checkMac(data, socket) {
    const originalMac = data.mac;
    data.mac = undefined;
    const currentMac = await this.generateMac(
      JSON.stringify(data.containt),
      socket
    );
    if (originalMac != currentMac) {
console.log("data is hacked");      return false;
    }
    return true;
  }
}
export default new Sym_Alg();
