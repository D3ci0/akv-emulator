import { describe, it, expect } from 'vitest';
const KeyVaultSecret = require('../../src/models/KeyVaultSecret');
const SecretProperties = require('../../src/models/SecretProperties');

describe('KeyVaultSecret.fromJSON', () => {
  it('test_fromJSON_with_object_input', () => {
    const attributesObj = { version: 'v1' };
    const input = { value: 'secretValue', name: 'mySecret', attributes: attributesObj };
    const result = KeyVaultSecret.fromJSON(input);

    expect(result).toBeInstanceOf(KeyVaultSecret);
    expect(result.value).toBe('secretValue');
    expect(result.name).toBe('mySecret');
    expect(result.attributes).toBeInstanceOf(SecretProperties);
    expect(result.attributes.version).toBe('v1');
  });

  it('test_fromJSON_with_json_string_input', () => {
    const attributesObj = { version: 'v2' };
    const input = JSON.stringify({ value: 'anotherSecret', name: 'mySecret', attributes: attributesObj });
    const result = KeyVaultSecret.fromJSON(input);

    expect(result).toBeInstanceOf(KeyVaultSecret);
    expect(result.value).toBe('anotherSecret');
    expect(result.name).toBe('mySecret');
    expect(result.attributes).toBeInstanceOf(SecretProperties);
    expect(result.attributes.version).toBe('v2');
  });

  it('test_fromJSON_without_attributes_field', () => {
    const input = { value: 'noPropsSecret' };
    const result = KeyVaultSecret.fromJSON(input);

    expect(result).toBeInstanceOf(KeyVaultSecret);
    expect(result.value).toBe('noPropsSecret');
    expect(result.attributes).toBeNull();
  });

  it('test_fromJSON_with_invalid_json_string', () => {
    const invalidJson = '{"value": "badSecret", "attributes": { version: "oops" }';
    expect(() => KeyVaultSecret.fromJSON(invalidJson)).toThrow(SyntaxError);
  });

  it('test_fromJSON_with_empty_object', () => {
    const input = {};
    const result = KeyVaultSecret.fromJSON(input);

    expect(result).toBeInstanceOf(KeyVaultSecret);
    expect(result.value).toBeNull();
    expect(result.attributes).toBeNull();
  });

  it('test_fromJSON_with_null_attributes_field', () => {
    const input = { value: 'nullPropsSecret', attributes: null };
    const result = KeyVaultSecret.fromJSON(input);

    expect(result).toBeInstanceOf(KeyVaultSecret);
    expect(result.value).toBe('nullPropsSecret');
    expect(result.attributes).toBeNull();
  });
});

describe('KeyVaultSecret.toJSON', () => {
  it('should serialize with nested attributes objects', () => {
    const attributesObj = {
      enabled: true,
      version: 'v1',
      created: '2023-01-01T00:00:00.000Z',
    };
    const secret = new KeyVaultSecret({ value: 12345, name: 'nestedSecret', attributes: attributesObj });
    const json = secret.toJSON();

    expect(json.value).toBe(12345);
    expect(json.name).toBe('nestedSecret');
    expect(json.attributes).toMatchObject({
      enabled: true,
      version: 'v1',
      created: '2023-01-01T00:00:00.000Z',
    });
  });

  it('should serialize when attributes is SecretProperties instance', () => {
    const props = new SecretProperties({ enabled: true, version: 'v2' });
    const secret = new KeyVaultSecret({ value: 'abc', attributes: props });
    const json = secret.toJSON();

    expect(json.value).toBe('abc');
    expect(json.attributes).toMatchObject({
      enabled: true,
      version: 'v2',
      created: null,
      expires: null,
      notBefore: null,
      recoverableDays: null,
      recoveryLevel: null,
      updated: null,
    });
  });

  it('should serialize with undefined value and valid attributes', () => {
    const secret = new KeyVaultSecret({ name: 'undefValueSecret', attributes: { version: 'v3' } });
    const json = secret.toJSON();

    expect(json.value).toBeNull();
    expect(json.name).toBe('undefValueSecret');
    expect(json.attributes).toMatchObject({
      version: 'v3',
      enabled: null,
      created: null,
      expires: null,
      notBefore: null,
      recoverableDays: null,
      recoveryLevel: null,
      updated: null,
    });
  });

  it('should serialize with both value and attributes as null', () => {
    const secret = new KeyVaultSecret();
    const json = secret.toJSON();

    expect(json.value).toBeNull();
    expect(json.attributes).toBeNull();
  });
});
