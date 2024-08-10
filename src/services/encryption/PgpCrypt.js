import { JSEncrypt } from "jsencrypt";

const forge = require("node-forge"); // Changed import statement

class PGPCrypto {
  generatePairKeys() {
    var encrypt = new JSEncrypt();

    const publicKey = encrypt.getPublicKey();
    const privateKey = encrypt.getPrivateKey();
    return {
      publicKey,
      privateKey,
    };
  }
  encrypt(text) {
    const publicKey = JSON.parse(localStorage.getItem("publicKey"));
    try {
      const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
      const encrypted = publicKeyObj.encrypt(forge.util.encodeUtf8(text));
      return forge.util.encode64(encrypted);
    } catch (e) {
      console.log(e);
    }
  }
}

export default new PGPCrypto();
// module.exports = new PGPCrypto();
