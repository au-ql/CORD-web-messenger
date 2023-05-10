// @param remoteUserId
// @param message

async function encryptMessageAsync(remoteUserId, message) {
  var sessionCipher = this.store.loadSessionCipher(remoteUserId);

  if (sessionCipher == null) {
    var address = new libsignal.SignalProtocolAddress(remoteUserId, 123);
    var sessionBuilder = new libsignal.sessionBuilder(this.store, address);

    var remoteUserPreKey = this.signalServerStore.getPreKeyBundle(remoteUserId);
    await sessionBuilder.processPreKey(remoteUserPreKey);
    var sessionCipher = new libsignal.sessionCipher(this.store, address);
    this.store.storeSessionCipher(remoteUserId, sessionCipher);
  }

  let cipherText = await sessionCipher.encrypt(util.toArrayBuffer(message));
  return cipherText;
}
