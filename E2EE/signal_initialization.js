
//Initialize the manager when user logs on

async function initializeAsync() {
  await this._generateIdentifyAsync();
  var preKeyBundle = await this._generatePreKeyBundleAsync();
  this.signalServerStore.registerNewPreKeyBundle(this.userId, preKeyBundle);
}

async function _generateIdentifyAsync() {
  var results = await Promise.all([
    libsignal.keyHelper.generateIdentityKeyPair(),
    libsignal.keyHelper.generateRegistrationId(),
  ]);
  this.store.put("identityKey", results[0]);
  this.store.put("registrationId", results[1]);
}
//generate a new prekey bundle for the local user

async function _generatePreKeyBundleAsync() {
  var result = await Promise.all([
    this.store.getIdentityKeyPair(),
    this.store.getLocalRegistrationId(),
  ]);

  let identity = result[0];
  let registrationId = result[1];

  var keys = await Promise.all([
    libsignal.keyHelper.generatePreKey(registrationId + 1),
    libsignal.keyHelper.generateSignedPreKey(identity, registrationId + 1),
  ]);

  let preKey = keys[0];
  let signedPreKey = keys[1];

  this.store.storePreKey(preKey.keyId, preKey.keyPair);
  this.store.storeSignedPreKey(signedPreKey.keyId, signedPreKey.keyPair);

  return {
    identityKey: identity.pubKey,
    registrationId: registrationId,
    preKey: {
      keyId: preKey.keyId,
      publicKey: preKey.keyPair.pubKey,
    },
    signedPreKey: {
      keyId: signedPreKey.keyId,
      publicKey: signedPreKey.keyPair.pubKey,
      signature: signedPreKey.signature,
    },
  };
}
