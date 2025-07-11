const KeyProperties = require('./KeyProperties');
const JsonWebKey = require("./JsonWebKey");

class KeyVaultKey {
    constructor({ key = null, properties = null } = {}) {
        this.key = key;
        this.properties = properties;
    }

    static fromJSON(json) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        return new KeyVaultKey({
            key: json.key,
            properties: json.properties ? KeyProperties.fromJSON(json.properties) : null,
        });
    }

    toJSON() {
        return {
            key: this.key,
            properties: this.properties ? this.properties.toJSON() : null,
        };
    }
}

module.exports = KeyVaultKey;