
/**
 * Represents properties of a Key Vault Key.
 * This model is adapted from the Azure SDK's KeyProperties class.
 */
class KeyProperties {
    /**
     * @param {Object} [params={}] - Optional parameters to initialize the properties.
     * @param {string} [params.kid] - Key identifier.
     * @param {Date|string} [params.createdOn] - Creation time.
     * @param {Date|string} [params.updatedOn] - Last updated time.
     * @param {Date|string} [params.notBefore] - Not before time.
     * @param {Date|string} [params.expiresOn] - Expiry time.
     * @param {boolean} [params.enabled] - Whether the key is enabled.
     * @param {Object} [params.tags] - Tags as key-value pairs.
     * @param {string} [params.vaultUrl] - Vault URL.
     * @param {string} [params.name] - Key name.
     * @param {string} [params.version] - Key version.
     * @param {boolean} [params.exportable] - Whether the key is exportable.
     * @param {boolean} [params.releasePolicy] - Release policy.
     */
    constructor(params = {}) {
        this.kid = params.kid || undefined;
        this.createdOn = params.createdOn ? new Date(params.createdOn) : undefined;
        this.updatedOn = params.updatedOn ? new Date(params.updatedOn) : undefined;
        this.notBefore = params.notBefore ? new Date(params.notBefore) : undefined;
        this.expiresOn = params.expiresOn ? new Date(params.expiresOn) : undefined;
        this.enabled = typeof params.enabled === 'boolean' ? params.enabled : undefined;
        this.tags = params.tags || undefined;
        this.vaultUrl = params.vaultUrl || undefined;
        this.name = params.name || undefined;
        this.version = params.version || undefined;
        this.exportable = typeof params.exportable === 'boolean' ? params.exportable : undefined;
        this.releasePolicy = params.releasePolicy || undefined;
    }

    /**
     * Returns a plain object suitable for JSON serialization.
     * Omits undefined fields.
     */
    toJSON() {
        const obj = {};
        for (const key of Object.keys(this)) {
            if (this[key] !== undefined) {
                // Dates are serialized as ISO strings
                if (this[key] instanceof Date) {
                    obj[key] = this[key].toISOString();
                } else {
                    obj[key] = this[key];
                }
            }
        }
        return obj;
    }

    /**
     * Creates a KeyProperties instance from a plain object.
     * @param {Object} obj - The plain object.
     * @returns {KeyProperties}
     */
    static fromJSON(obj) {
        return new KeyProperties(obj);
    }
}

module.exports = KeyProperties;