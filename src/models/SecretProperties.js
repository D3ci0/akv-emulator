class SecretProperties {
  constructor({
    id = null,
    version = null,
    enabled = null,
    notBefore = null,
    expiresOn = null,
    createdOn = null,
    updatedOn = null,
    name = null,
    recoveryLevel = null,
    contentType = null,
    tags = {},
    keyId = null,
    managed = null,
    recoverableDays = null
  } = {}) {
    this.id = id;
    this.version = version;
    this.enabled = enabled;
    this.notBefore = notBefore ? new Date(notBefore) : null;
    this.expiresOn = expiresOn ? new Date(expiresOn) : null;
    this.createdOn = createdOn ? new Date(createdOn) : null;
    this.updatedOn = updatedOn ? new Date(updatedOn) : null;
    this.name = name;
    this.recoveryLevel = recoveryLevel;
    this.contentType = contentType;
    this.tags = tags;
    this.keyId = keyId;
    this.managed = managed;
    this.recoverableDays = recoverableDays;
  }

  static fromJSON(json) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    return new SecretProperties(json);
  }

  toJSON() {
    return {
      id: this.id,
      version: this.version,
      enabled: this.enabled,
      notBefore: this.notBefore ? this.notBefore.toISOString() : null,
      expiresOn: this.expiresOn ? this.expiresOn.toISOString() : null,
      createdOn: this.createdOn ? this.createdOn.toISOString() : null,
      updatedOn: this.updatedOn ? this.updatedOn.toISOString() : null,
      name: this.name,
      recoveryLevel: this.recoveryLevel,
      contentType: this.contentType,
      tags: this.tags,
      keyId: this.keyId,
      managed: this.managed,
      recoverableDays: this.recoverableDays
    };
  }
}

module.exports = SecretProperties;