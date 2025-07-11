import { describe, it, expect } from 'vitest';
const JsonWebKey = require('../../../src/models/keys/JsonWebKey');

describe('JsonWebKey', () => {
    it('test_full_initialization_and_serialization', () => {
        const params = {
            kty: 'RSA',
            key_ops: ['sign', 'verify'],
            kid: 'key-id-123',
            n: 'modulus',
            e: 'exponent',
            d: 'private-exponent',
            p: 'prime-p',
            q: 'prime-q',
            dp: 'dp',
            dq: 'dq',
            qi: 'qi',
            k: 'symmetric-key',
            x: 'ec-x',
            y: 'ec-y',
            crv: 'P-256'
        };
        const jwk = new JsonWebKey(params);
        // All properties should be set correctly
        for (const key of Object.keys(params)) {
            expect(jwk[key]).toEqual(params[key]);
        }
        // toJSON should return only defined fields
        const json = jwk.toJSON();
        expect(json).toEqual(params);
    });

    it('test_empty_initialization_and_serialization', () => {
        const jwk = new JsonWebKey();
        // All properties should be undefined
        expect(jwk.kty).toBeUndefined();
        expect(jwk.key_ops).toBeUndefined();
        expect(jwk.alg).toBeUndefined();
        expect(jwk.kid).toBeUndefined();
        expect(jwk.n).toBeUndefined();
        expect(jwk.e).toBeUndefined();
        expect(jwk.d).toBeUndefined();
        expect(jwk.p).toBeUndefined();
        expect(jwk.q).toBeUndefined();
        expect(jwk.dp).toBeUndefined();
        expect(jwk.dq).toBeUndefined();
        expect(jwk.qi).toBeUndefined();
        expect(jwk.k).toBeUndefined();
        expect(jwk.x).toBeUndefined();
        expect(jwk.y).toBeUndefined();
        expect(jwk.crv).toBeUndefined();
        // toJSON should return an empty object
        expect(jwk.toJSON()).toEqual({});
    });
});