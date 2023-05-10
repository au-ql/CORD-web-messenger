// @param remoteUserId
// @param ciphertext
// @returns

const session = require("express-session");

async function decryptMessageAsync(remoteUserId, cipherText) {
  var sessionCipher = this.store.loadSessionCipher(remoteUserId);

  if (sessionCipher === null) {
    var address = new libsignal.SignalProtocolAddress(remoteUserId, 123);
    var sessionCipher = new libsignal.sessionCipher(this.store, address);
    this.store.storeSessionCipher(remoteUserId, sessionCipher);
  }

  var messageHasEmbeddedPreKeyBundle = cipherText.type === 3;
  if (messageHasEmbeddedPreKeyBundle) {
    var decryptedMessage = await sessionCipher.decryptPreKeyWhisperMessage(
      cipherText.body,
      "binary"
    );
    return Utils.toString(decryptedMessage);
  } else {
    var decryptedMessage = await sessionCipher.decryptWhisperMessage(
      cipherText.body,
      "binary"
    );
    return Utils.toString(decryptedMessage);
  }
}
