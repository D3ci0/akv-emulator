const SecretProperties = require('./SecretProperties');

class KeyVaultSecret {
  constructor({
    value = null,
    name = null,
    id = null,
    kid = null,
    managed = null,
    contentType = null,
    tags = {},
    attributes = null,
  } = {}) {
    this.value = value;
    this.name = name;
    this.id = id;
    this.kid = kid;
    this.managed = managed;
    this.contentType = contentType;
    this.tags = tags && typeof tags === 'object' ? tags : {};

    this.attributes =
      attributes instanceof SecretProperties
        ? attributes
        : attributes
          ? new SecretProperties(attributes)
          : null;
  }

  static fromJSON(json) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    return new KeyVaultSecret({
      value: json.value,
      name: json.name,
      id: json.id,
      kid: json.kid,
      managed: json.managed,
      contentType: json.contentType,
      tags: json.tags,
      attributes: json.attributes,
    });
  }

  toJSON() {
    return {
      attributes: this.attributes ? this.attributes.toJSON() : null,
      contentType: this.contentType,
      id: this.id,
      kid: this.kid,
      managed: this.managed,
      name: this.name,
      tags: this.tags,
      value: this.value,
    };
  }
}

module.exports = KeyVaultSecret;
