import { describe, test, expect } from 'vitest';
const KeyVaultKey = require('../../../src/models/keys/KeyVaultKey');
const KeyProperties = require('../../../src/models/keys/KeyProperties');

describe('KeyVaultKey', () => {
    test('test_fromJSON_with_valid_object', () => {
        const keyObj = { kty: 'RSA', n: 'modulus', e: 'AQAB' };
        const propertiesObj = {
            kid: 'key-id',
            createdOn: '2023-01-01T00:00:00.000Z',
            enabled: true,
            tags: { env: 'test' }
        };
        const input = {
            key: keyObj,
            properties: propertiesObj
        };

        const kvk = KeyVaultKey.fromJSON(input);

        expect(kvk).toBeInstanceOf(KeyVaultKey);
        expect(kvk.key).toEqual(keyObj);
        expect(kvk.properties).toBeInstanceOf(KeyProperties);
        expect(kvk.properties.kid).toBe('key-id');
        expect(kvk.properties.enabled).toBe(true);
        expect(kvk.properties.tags).toEqual({ env: 'test' });
        expect(kvk.properties.createdOn).toBeInstanceOf(Date);
        expect(kvk.properties.createdOn.toISOString()).toBe('2023-01-01T00:00:00.000Z');
    });

    test('test_toJSON_serialization', () => {
        const keyObj = { kty: 'RSA', n: 'modulus', e: 'AQAB' };
        const properties = new KeyProperties({
            kid: 'key-id',
            createdOn: new Date('2023-01-01T00:00:00.000Z'),
            enabled: false,
            tags: { env: 'prod' }
        });
        const kvk = new KeyVaultKey({ key: keyObj, properties });

        const json = kvk.toJSON();

        expect(json.key).toEqual(keyObj);
        expect(json.properties).toEqual({
            kid: 'key-id',
            createdOn: '2023-01-01T00:00:00.000Z',
            enabled: false,
            tags: { env: 'prod' }
        });
    });

    test('test_fromJSON_without_properties', () => {
        const keyObj = { kty: 'EC', x: 'abc', y: 'def' };
        const input = { key: keyObj };

        const kvk = KeyVaultKey.fromJSON(input);

        expect(kvk).toBeInstanceOf(KeyVaultKey);
        expect(kvk.key).toEqual(keyObj);
        expect(kvk.properties).toBeNull();
    });
});