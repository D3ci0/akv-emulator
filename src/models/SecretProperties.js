class SecretProperties {
  constructor({
    created = null,
    enabled = null,
    expires = null,
    notBefore = null,
    recoverableDays = null,
    recoveryLevel = null,
    version = null,
    updated = null,
  } = {}) {
    const parseDateValue = (value) => {
      if (value === undefined || value === null || value === '') return null;
      const date = new Date(typeof value === 'number' && value < 1e11 ? value * 1000 : value);
      return isNaN(date.getTime()) ? null : date;
    };

    this.enabled = enabled;
    this.recoverableDays = recoverableDays;
    this.recoveryLevel = recoveryLevel;
    this.version = version;
    this.notBefore = parseDateValue(notBefore);
    this.expires = parseDateValue(expires);
    this.created = parseDateValue(created);
    this.updated = parseDateValue(updated);
  }

  static fromJSON(json) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    return new SecretProperties(json);
  }

  toJSON() {
    const toTimestamp = (date) => (date ? Math.floor(date.getTime() / 1000) : null);

    return {
      created: toTimestamp(this.created),
      enabled: this.enabled,
      exp: toTimestamp(this.expires),
      nbf: toTimestamp(this.notBefore),
      recoverableDays: this.recoverableDays,
      version: this.version,
      recoveryLevel: this.recoveryLevel,
      updated: toTimestamp(this.updated),
    };
  }
}

module.exports = SecretProperties;
