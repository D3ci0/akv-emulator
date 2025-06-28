/**
 * Simple enum for supported key operations.
 */
const KeyOperation = Object.freeze({
    ENCRYPT: "encrypt",   // Encrypt operation
    DECRYPT: "decrypt",   // Decrypt operation
    SIGN: "sign",         // Sign operation
    VERIFY: "verify",     // Verify operation
    WRAP_KEY: "wrapKey",  // Wrap key operation
    UNWRAP_KEY: "unwrapKey", // Unwrap key operation
    IMPORT: "import",     // Import key operation
    EXPORT: "export"      // Export key operation
});

module.exports = KeyOperation;