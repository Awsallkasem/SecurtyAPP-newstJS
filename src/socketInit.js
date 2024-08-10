import PGPCrypto from "./services/encryption/PgpCrypt";

// const PgpCrypt = require("./services/encryption/PgpCrypt");
const { io } = require("socket.io-client");
const crypto = require("crypto");

let socket;

socket = io.connect(`http://localhost:8081`);
export function reconnect() {
  socket.disconnect();

  socket.io.opts.extraHeaders = {
    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
  };

  socket.connect(`http://localhost:8081`);
  const user = JSON.parse(localStorage.getItem("user"));
  socket.emit("new user", user);

  socket.on("user-in", () => {
    const certificat = JSON.parse(localStorage.getItem("sendcertificat"));
    const publicKey = JSON.parse(localStorage.getItem("publicClientKey"));
    if (publicKey && certificat)
      socket.emit("RequestHandshaking", { publicKey, certificat });
    socket.on("handshaking", async (data) => {
      localStorage.setItem("publicKey", JSON.stringify(data.publicKey));

      const sessionKey = crypto.randomBytes(16).toString("hex");

      const encrybtedSessionKey = PGPCrypto.encrypt(sessionKey);
      socket.emit("newSessionKey", { SessionKey: encrybtedSessionKey });
      socket.on("Acceptance-session-key", (data) => {
        localStorage.setItem("sessionKey", JSON.stringify(sessionKey));
      });
    });
  });
}
export default socket;
