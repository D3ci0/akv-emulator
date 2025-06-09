import { describe, it, expect } from 'vitest';
const KeyVaultSecret = require('../../src/models/KeyVaultSecret');
const SecretProperties = require('../../src/models/SecretProperties');

describe('KeyVaultSecret.fromJSON', () => {
  it('test_fromJSON_with_object_input', () => {
    const propertiesObj = { name: 'mySecret', version: 'v1' };
    const input = { value: 'secretValue', properties: propertiesObj };
    const result = KeyVaultSecret.fromJSON(input);
    expect(result).toBeInstanceOf(KeyVaultSecret);
    expect(result.value).toBe('secretValue');
    expect(result.properties).toBeInstanceOf(SecretProperties);
    expect(result.properties.name).toBe('mySecret');
    expect(result.properties.version).toBe('v1');
  });

  it('test_fromJSON_with_json_string_input', () => {
    const propertiesObj = { name: 'mySecret', version: 'v2' };
    const input = JSON.stringify({ value: 'anotherSecret', properties: propertiesObj });
    const result = KeyVaultSecret.fromJSON(input);
    expect(result).toBeInstanceOf(KeyVaultSecret);
    expect(result.value).toBe('anotherSecret');
    expect(result.properties).toBeInstanceOf(SecretProperties);
    expect(result.properties.name).toBe('mySecret');
    expect(result.properties.version).toBe('v2');
  });

  it('test_fromJSON_without_properties_field', () => {
    const input = { value: 'noPropsSecret' };
    const result = KeyVaultSecret.fromJSON(input);
    expect(result).toBeInstanceOf(KeyVaultSecret);
    expect(result.value).toBe('noPropsSecret');
    expect(result.properties).toBeNull();
  });

  it('test_fromJSON_with_invalid_json_string', () => {
    const invalidJson = '{"value": "badSecret", "properties": { name: "oops" }'; // missing closing }
    expect(() => KeyVaultSecret.fromJSON(invalidJson)).toThrow(SyntaxError);
  });

  it('test_fromJSON_with_empty_object', () => {
    const input = {};
    const result = KeyVaultSecret.fromJSON(input);
    expect(result).toBeInstanceOf(KeyVaultSecret);
    expect(result.value).toBeNull();
    expect(result.properties).toBeNull();
  });

  it('test_fromJSON_with_null_properties_field', () => {
    const input = { value: 'nullPropsSecret', properties: null };
    const result = KeyVaultSecret.fromJSON(input);
    expect(result).toBeInstanceOf(KeyVaultSecret);
    expect(result.value).toBe('nullPropsSecret');
    expect(result.properties).toBeNull();
  });
});

describe('KeyVaultSecret.toJSON', () => {
  it('should serialize with nested properties objects', () => {
    const propertiesObj = {
      name: 'nestedSecret',
      tags: { env: 'prod', meta: { owner: 'alice', team: ['dev', 'ops'] } },
      createdOn: '2023-01-01T00:00:00.000Z'
    };
    const secret = new KeyVaultSecret({ value: 12345, properties: propertiesObj });
    const json = secret.toJSON();
    expect(json.value).toBe(12345);
    expect(json.properties).toMatchObject({
      name: 'nestedSecret',
      tags: { env: 'prod', meta: { owner: 'alice', team: ['dev', 'ops'] } },
      createdOn: '2023-01-01T00:00:00.000Z'
    });
  });

  it('should serialize when properties is SecretProperties instance', () => {
    const props = new SecretProperties({ name: 'instanceSecret', enabled: true });
    const secret = new KeyVaultSecret({ value: 'abc', properties: props });
    const json = secret.toJSON();
    expect(json.value).toBe('abc');
    expect(json.properties).toMatchObject({
      name: 'instanceSecret',
      enabled: true,
      id: null,
      version: null,
      notBefore: null,
      expiresOn: null,
      createdOn: null,
      updatedOn: null,
      recoveryLevel: null,
      contentType: null,
      tags: {},
      keyId: null,
      managed: null,
      recoverableDays: null
    });
  });

  it('should serialize with undefined value and valid properties', () => {
    const propertiesObj = { name: 'undefValueSecret', version: 'v3' };
    const secret = new KeyVaultSecret({ properties: propertiesObj });
    const json = secret.toJSON();
    expect(json.value).toBeNull();
    expect(json.properties).toMatchObject({
      name: 'undefValueSecret',
      version: 'v3'
    });
  });

  it('should serialize with both value and properties as null', () => {
    const secret = new KeyVaultSecret();
    const json = secret.toJSON();
    expect(json.value).toBeNull();
    expect(json.properties).toBeNull();
  });

});
