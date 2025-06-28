/**
 * Simple enum for supported elliptic key curve names.
 */
const KeyCurveName = Object.freeze({
    P_256: "P-256",   // The NIST P-256 elliptic curve, AKA SECG curve SECP256R1.
    P_384: "P-384",   // The NIST P-384 elliptic curve, AKA SECG curve SECP384R1.
    P_521: "P-521",   // The NIST P-521 elliptic curve, AKA SECG curve SECP521R1.
    P_256K: "P-256K", // The SECG SECP256K1 elliptic curve.
});

module.exports = KeyCurveName;