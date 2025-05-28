const CertificateProperties = require('./CertificateProperties');

class KeyVaultCertificate {
    /**
     * @param {Object} options
     * @param {string|Buffer|null} [options.cer=null] - The certificate bytes (base64 string or Buffer)
     * @param {string|null} [options.keyId=null] - The key identifier
     * @param {string|null} [options.secretId=null] - The secret identifier
     * @param {CertificateProperties|null} [options.properties=null] - The certificate properties
     */
    constructor({
                    cer = null,
                    keyId = null,
                    secretId = null,
                    properties = null
                } = {}) {
        this.cer = cer;
        this.keyId = keyId;
        this.secretId = secretId;
        this.properties = properties instanceof CertificateProperties
            ? properties
            : properties
                ? new CertificateProperties(properties)
                : null;
    }

    static fromJSON(json) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        return new KeyVaultCertificate({
            cer: json.cer,
            keyId: json.keyId,
            secretId: json.secretId,
            properties: json.properties ? CertificateProperties.fromJSON(json.properties) : null
        });
    }

    toJSON() {
        return {
            cer: this.cer,
            keyId: this.keyId,
            secretId: this.secretId,
            properties: this.properties ? this.properties.toJSON() : null
        };
    }
}

module.exports = KeyVaultCertificate;