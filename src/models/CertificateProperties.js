class CertificateProperties {
  constructor({
    vaultUrl = null,
    version = null,
    name = null,
    enabled = null,
    notBefore = null,
    expiresOn = null,
    createdOn = null,
    updatedOn = null,
    recoveryLevel = null,
    id = null,
    tags = {},
    x509Thumbprint = null,
    recoverableDays = null,
  } = {}) {
    this.vaultUrl = vaultUrl;
    this.version = version;
    this.name = name;
    this.enabled = enabled;
    this.notBefore = notBefore ? new Date(notBefore) : null;
    this.expiresOn = expiresOn ? new Date(expiresOn) : null;
    this.createdOn = createdOn ? new Date(createdOn) : null;
    this.updatedOn = updatedOn ? new Date(updatedOn) : null;
    this.recoveryLevel = recoveryLevel;
    this.id = id;
    this.tags = tags;
    this.x509Thumbprint = x509Thumbprint; // Should be a base64url string
    this.recoverableDays = recoverableDays;
  }

  static fromJSON(json) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    return new CertificateProperties(json);
  }

  toJSON() {
    return {
      vaultUrl: this.vaultUrl,
      version: this.version,
      name: this.name,
      enabled: this.enabled,
      notBefore: this.notBefore ? this.notBefore.toISOString() : null,
      expiresOn: this.expiresOn ? this.expiresOn.toISOString() : null,
      createdOn: this.createdOn ? this.createdOn.toISOString() : null,
      updatedOn: this.updatedOn ? this.updatedOn.toISOString() : null,
      recoveryLevel: this.recoveryLevel,
      id: this.id,
      tags: this.tags,
      x509Thumbprint: this.x509Thumbprint,
      recoverableDays: this.recoverableDays,
    };
  }
}

module.exports = CertificateProperties;
