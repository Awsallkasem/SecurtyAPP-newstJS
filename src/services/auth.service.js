import socket from "../socketInit";
import symatric from "./symmetricCrypt";
import Pgp from "./encryption/level3";
const forge = require("node-forge");
const crypto = require("crypto");

class AuthService {
  async login(email, password) {
    socket.emit("login", { email, password });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.setItem(
      "phoneNumber",
      JSON.stringify({ phoneNumber: "00000000" })
    );
  }

  async register(username, email, password, nationalID, isDocotor) {
    const user = {
      username,
      email,
      password,
      nationalID,
      isDocotor,
    };
    socket.emit("createUser", user);
  }
  completeInfo(phoneNumber, location) {
    const encrebtedPoneNumber = symatric.EncryptData(phoneNumber);
    const encrebtedLocation = symatric.EncryptData(location);
    const containt = {
      encrebtedPoneNumber,
      encrebtedLocation,
    };
    const mac = symatric.generateMac(JSON.stringify(containt));

    socket.emit("extraInfo", { containt, mac });
    socket.on("done", async (data) => {
      if(!await symatric.checkMac(data, socket)){
       
        return;
      }

      const { encrebtedPoneNumber, encrebtedLocation } = data.containt;
      const dycryptedPhone = await symatric.DycryptData(
        encrebtedPoneNumber,
        socket
      );
      const dycryptedLocation = await symatric.DycryptData(
        encrebtedLocation,
        socket
      );
      localStorage.setItem(
        "phoneNumer",
        JSON.stringify({ phoneNumber: dycryptedPhone })
      );
      localStorage.setItem(
        "location",
        JSON.stringify({ location: dycryptedLocation })
      );
      window.location.href = "/csr";
    });
  }

  discription(discription) {
    const encrebtedDiscription = Pgp.EncryptData(
      discription,
      JSON.parse(localStorage.getItem("sessionKey"))
    );

    const mac = Pgp.generateMac(`${encrebtedDiscription}`);
    const from = JSON.parse(localStorage.getItem("user"))._id;
    socket.emit("addDiscription", {
      containt: encrebtedDiscription,
      from,
      mac,
    });
  }

  addMarkswithSignture(marks) {
    const privateKey = forge.pki.privateKeyFromPem(
      JSON.parse(localStorage.getItem("privateKey"))
    );
    const encrebtedData = Pgp.EncryptData(
      JSON.stringify(marks),
      JSON.parse(localStorage.getItem("sessionKey"))
    );

    const md = forge.md.sha256.create();
    md.update(encrebtedData, "utf8");
    const hash = md.digest();

    // Sign the hash using the private key
    const signature = privateKey.sign(md);

    // Convert the signature to a Base64-encoded string
    const signatureBase64 = forge.util.encode64(signature);
    socket.emit("sign", { containt: encrebtedData, signatureBase64 });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
