const SecretProperties = require('./SecretProperties');

class KeyVaultSecret {
  constructor({ value = null, properties = null } = {}) {
    this.value = value;
    this.properties =
      properties instanceof SecretProperties
        ? properties
        : properties
          ? new SecretProperties(properties)
          : null;
  }

  static fromJSON(json) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    return new KeyVaultSecret({
      value: json.value,
      properties: json.properties ? SecretProperties.fromJSON(json.properties) : null,
    });
  }

  toJSON() {
    return {
      value: this.value,
      properties: this.properties ? this.properties.toJSON() : null,
    };
  }
}

module.exports = KeyVaultSecret;
