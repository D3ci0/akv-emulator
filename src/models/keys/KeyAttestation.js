/**
 * Represents key attestation data, adapted from Azure SDK's KeyAttestation class.
 */
class KeyAttestation {
    /**
     * @param {Object} [params={}] - Optional parameters to initialize the attestation.
     * @param {string} [params.certificatePemFile] - Base64url-encoded string containing certificates in PEM format.
     * @param {string} [params.privateKeyAttestation] - Base64url-encoded attestation blob for a private key.
     * @param {string} [params.publicKeyAttestation] - Base64url-encoded attestation blob for a public key.
     * @param {string} [params.version] - Version of the attestation.
     */
    constructor(params = {}) {
        this.certificatePemFile = params.certificatePemFile || undefined;
        this.privateKeyAttestation = params.privateKeyAttestation || undefined;
        this.publicKeyAttestation = params.publicKeyAttestation || undefined;
        this.version = params.version || undefined;
    }

    /**
     * Returns a plain object suitable for JSON serialization.
     * Omits undefined fields.
     */
    toJSON() {
        const obj = {};
        for (const key of Object.keys(this)) {
            if (this[key] !== undefined) {
                obj[key] = this[key];
            }
        }
        return obj;
    }

    /**
     * Creates a KeyAttestation instance from a plain object.
     * @param {Object} obj - The plain object.
     * @returns {KeyAttestation}
     */
    static fromJSON(obj) {
        return new KeyAttestation(obj);
    }
}

module.exports = KeyAttestation;