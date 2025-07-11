/**
 * Represents a JSON Web Key (JWK) as per RFC 7517.
 * This model is adapted from the Azure SDK's JsonWebKey class.
 */
class JsonWebKey {
    /**
     * @param {Object} [params={}] - Optional parameters to initialize the key.
     * @param {string} [params.kty] - Key Type (e.g., "RSA", "EC", "oct").
     * @param {string[]} [params.key_ops] - Allowed key operations.
     * @param {string} [params.alg] - Algorithm intended for use with the key.
     * @param {string} [params.kid] - Key ID.
     * @param {string} [params.n] - RSA modulus.
     * @param {string} [params.e] - RSA public exponent.
     * @param {string} [params.d] - RSA private exponent.
     * @param {string} [params.p] - RSA secret prime factor.
     * @param {string} [params.q] - RSA secret prime factor.
     * @param {string} [params.dp] - RSA secret exponent.
     * @param {string} [params.dq] - RSA secret exponent.
     * @param {string} [params.qi] - RSA secret coefficient.
     * @param {string} [params.k] - Symmetric key.
     * @param {string} [params.x] - EC public key X coordinate.
     * @param {string} [params.y] - EC public key Y coordinate.
     * @param {string} [params.crv] - EC curve name.
     */
    constructor(params = {}) {
        this.kty = params.kty || undefined;
        this.key_ops = params.key_ops || undefined;
        this.kid = params.kid || undefined;
        this.n = params.n || undefined;
        this.e = params.e || undefined;
        this.d = params.d || undefined;
        this.p = params.p || undefined;
        this.q = params.q || undefined;
        this.dp = params.dp || undefined;
        this.dq = params.dq || undefined;
        this.qi = params.qi || undefined;
        this.k = params.k || undefined;
        this.x = params.x || undefined;
        this.y = params.y || undefined;
        this.crv = params.crv || undefined;
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
     * Creates a JsonWebKey instance from a plain object.
     * @param {Object} obj - The plain object.
     * @returns {JsonWebKey}
     */
    static fromJSON(obj) {
        return new JsonWebKey(obj);
    }
}

module.exports = JsonWebKey;