module.exports = {
  generateCSR: (privateKey, publicKey, user,isDoctor) => {
    const forge = require("node-forge");
    const pki = forge.pki;

    const prKey = pki.privateKeyFromPem(privateKey);
    const pubKey = pki.publicKeyFromPem(publicKey);
    const csr = forge.pki.createCertificationRequest();
    csr.publicKey = pubKey;
const name=isDoctor?`Dr ${user.username}`:user.username
    csr.setSubject([
      {
        name: "commonName",
        value:name,
      },
      {
        name: "organizationName",
        value: "Damascuse University",
      },
      {
        name: "countryName",
        value: "syria",
      },
      {
        name: "serialNumber",
        value: user._id,
      },
    ]);

    csr.sign(prKey);

    const pem = forge.pki.certificationRequestToPem(csr);

    // Return the PEM-formatted CSR
    return pem;
  },
};
