import { describe, it, expect } from 'vitest';
import CertificateProperties from '../../src/models/CertificateProperties';

describe('CertificateProperties.fromJSON', () => {
  it('test_fromJSON_with_valid_object', () => {
    const input = {
      vaultUrl: 'https://example.com',
      version: 'v1',
      name: 'cert1',
      enabled: true,
      notBefore: '2023-01-01T00:00:00.000Z',
      expiresOn: '2024-01-01T00:00:00.000Z',
      createdOn: '2023-01-01T00:00:00.000Z',
      updatedOn: '2023-06-01T00:00:00.000Z',
      recoveryLevel: 'Recoverable',
      id: '123',
      tags: { env: 'prod' },
      x509Thumbprint: 'abc123',
      recoverableDays: 90,
    };
    const result = CertificateProperties.fromJSON(input);
    expect(result).toBeInstanceOf(CertificateProperties);
    expect(result.vaultUrl).toBe(input.vaultUrl);
    expect(result.version).toBe(input.version);
    expect(result.name).toBe(input.name);
    expect(result.enabled).toBe(input.enabled);
    expect(result.notBefore).toEqual(new Date(input.notBefore));
    expect(result.expiresOn).toEqual(new Date(input.expiresOn));
    expect(result.createdOn).toEqual(new Date(input.createdOn));
    expect(result.updatedOn).toEqual(new Date(input.updatedOn));
    expect(result.recoveryLevel).toBe(input.recoveryLevel);
    expect(result.id).toBe(input.id);
    expect(result.tags).toEqual(input.tags);
    expect(result.x509Thumbprint).toBe(input.x509Thumbprint);
    expect(result.recoverableDays).toBe(input.recoverableDays);
  });

  it('test_fromJSON_with_valid_string', () => {
    const inputObj = {
      vaultUrl: 'https://example.com',
      version: 'v2',
      name: 'cert2',
      enabled: false,
      notBefore: '2022-01-01T00:00:00.000Z',
      expiresOn: '2023-01-01T00:00:00.000Z',
      createdOn: '2022-01-01T00:00:00.000Z',
      updatedOn: '2022-06-01T00:00:00.000Z',
      recoveryLevel: 'Purgeable',
      id: '456',
      tags: { env: 'dev' },
      x509Thumbprint: 'def456',
      recoverableDays: 30,
    };
    const inputStr = JSON.stringify(inputObj);
    const result = CertificateProperties.fromJSON(inputStr);
    expect(result).toBeInstanceOf(CertificateProperties);
    expect(result.vaultUrl).toBe(inputObj.vaultUrl);
    expect(result.version).toBe(inputObj.version);
    expect(result.name).toBe(inputObj.name);
    expect(result.enabled).toBe(inputObj.enabled);
    expect(result.notBefore).toEqual(new Date(inputObj.notBefore));
    expect(result.expiresOn).toEqual(new Date(inputObj.expiresOn));
    expect(result.createdOn).toEqual(new Date(inputObj.createdOn));
    expect(result.updatedOn).toEqual(new Date(inputObj.updatedOn));
    expect(result.recoveryLevel).toBe(inputObj.recoveryLevel);
    expect(result.id).toBe(inputObj.id);
    expect(result.tags).toEqual(inputObj.tags);
    expect(result.x509Thumbprint).toBe(inputObj.x509Thumbprint);
    expect(result.recoverableDays).toBe(inputObj.recoverableDays);
  });

  it('test_fromJSON_with_missing_properties', () => {
    const input = {
      name: 'cert3'
      // All other properties are missing
    };
    const result = CertificateProperties.fromJSON(input);
    expect(result).toBeInstanceOf(CertificateProperties);
    expect(result.name).toBe('cert3');
    expect(result.vaultUrl).toBeNull();
    expect(result.version).toBeNull();
    expect(result.enabled).toBeNull();
    expect(result.notBefore).toBeNull();
    expect(result.expiresOn).toBeNull();
    expect(result.createdOn).toBeNull();
    expect(result.updatedOn).toBeNull();
    expect(result.recoveryLevel).toBeNull();
    expect(result.id).toBeNull();
    expect(result.tags).toEqual({});
    expect(result.x509Thumbprint).toBeNull();
    expect(result.recoverableDays).toBeNull();
  });

  it('test_fromJSON_with_invalid_json_string', () => {
    const invalidJson = '{"name": "cert4", "enabled": true,'; // Malformed JSON
    expect(() => CertificateProperties.fromJSON(invalidJson)).toThrow(SyntaxError);
  });

  it('test_fromJSON_with_null_input', () => {
    expect(() => CertificateProperties.fromJSON(null)).toThrow();
  });

  it('test_fromJSON_with_extra_properties', () => {
    const input = {
      name: 'cert5',
      vaultUrl: 'https://example.com',
      extraField1: 'shouldBeIgnored',
      extraField2: 12345,
    };
    const result = CertificateProperties.fromJSON(input);
    expect(result).toBeInstanceOf(CertificateProperties);
    expect(result.name).toBe('cert5');
    expect(result.vaultUrl).toBe('https://example.com');
    expect(result).not.toHaveProperty('extraField1');
    expect(result).not.toHaveProperty('extraField2');
  });
});

describe('CertificateProperties.toJSON', () => {
  it('test_toJSON_serializes_all_fields_correctly', () => {
    const input = {
      vaultUrl: 'https://vault.example.com',
      version: 'v1.2.3',
      name: 'test-cert',
      enabled: true,
      notBefore: '2023-05-01T10:00:00.000Z',
      expiresOn: '2024-05-01T10:00:00.000Z',
      createdOn: '2023-04-01T09:00:00.000Z',
      updatedOn: '2023-06-01T11:00:00.000Z',
      recoveryLevel: 'Recoverable+Purgeable',
      id: 'cert-id-123',
      tags: { project: 'alpha', owner: 'devops' },
      x509Thumbprint: 'base64urlthumbprint',
      recoverableDays: 42,
    };
    const certProps = new CertificateProperties(input);
    const json = certProps.toJSON();

    expect(json).toEqual({
      vaultUrl: input.vaultUrl,
      version: input.version,
      name: input.name,
      enabled: input.enabled,
      notBefore: new Date(input.notBefore).toISOString(),
      expiresOn: new Date(input.expiresOn).toISOString(),
      createdOn: new Date(input.createdOn).toISOString(),
      updatedOn: new Date(input.updatedOn).toISOString(),
      recoveryLevel: input.recoveryLevel,
      id: input.id,
      tags: input.tags,
      x509Thumbprint: input.x509Thumbprint,
      recoverableDays: input.recoverableDays,
    });
  });

  it('should serialize date properties to ISOStrings', () => {
    const input = {
      notBefore: new Date('2022-01-01T00:00:00.000Z'),
      expiresOn: new Date('2023-01-01T00:00:00.000Z'),
      createdOn: new Date('2021-12-01T00:00:00.000Z'),
      updatedOn: new Date('2022-06-01T00:00:00.000Z'),
    };
    const certProps = new CertificateProperties(input);
    const json = certProps.toJSON();
    expect(json.notBefore).toBe('2022-01-01T00:00:00.000Z');
    expect(json.expiresOn).toBe('2023-01-01T00:00:00.000Z');
    expect(json.createdOn).toBe('2021-12-01T00:00:00.000Z');
    expect(json.updatedOn).toBe('2022-06-01T00:00:00.000Z');
  });

  it('should include all nonDate properties unchanged', () => {
    const input = {
      vaultUrl: 'https://vault.example.com',
      version: 'v1.0.0',
      name: 'my-cert',
      enabled: false,
      recoveryLevel: 'Recoverable',
      id: 'cert-001',
      tags: { foo: 'bar' },
      x509Thumbprint: 'thumbprint123',
      recoverableDays: 7,
    };
    const certProps = new CertificateProperties(input);
    const json = certProps.toJSON();
    expect(json.vaultUrl).toBe(input.vaultUrl);
    expect(json.version).toBe(input.version);
    expect(json.name).toBe(input.name);
    expect(json.enabled).toBe(input.enabled);
    expect(json.recoveryLevel).toBe(input.recoveryLevel);
    expect(json.id).toBe(input.id);
    expect(json.tags).toEqual(input.tags);
    expect(json.x509Thumbprint).toBe(input.x509Thumbprint);
    expect(json.recoverableDays).toBe(input.recoverableDays);
  });

  it('should preserve tags object structure', () => {
    const tags = { env: 'prod', owner: 'alice', nested: { key: 'value' } };
    const certProps = new CertificateProperties({ tags });
    const json = certProps.toJSON();
    expect(json.tags).toEqual(tags);
    expect(typeof json.tags).toBe('object');
    expect(json.tags.nested).toEqual({ key: 'value' });
  });

  it('should serialize empty tags object correctly', () => {
    const certProps = new CertificateProperties({ tags: {} });
    const json = certProps.toJSON();
    expect(json.tags).toEqual({});
  });

  it('should handle unexpected property types without error', () => {
    const input = {
      vaultUrl: 12345,
      version: ['v1', 'v2'],
      name: { first: 'cert' },
      enabled: 'yes',
      notBefore: 1672531200000, // timestamp
      tags: 'not-an-object',
      x509Thumbprint: ['array'],
      recoverableDays: 'thirty',
    };
    const certProps = new CertificateProperties(input);
    expect(() => certProps.toJSON()).not.toThrow();
    const json = certProps.toJSON();
    expect(json.vaultUrl).toBe(12345);
    expect(json.version).toEqual(['v1', 'v2']);
    expect(json.name).toEqual({ first: 'cert' });
    expect(json.enabled).toBe('yes');
    expect(json.notBefore).toBe(new Date(1672531200000).toISOString());
    expect(json.tags).toBe('not-an-object');
    expect(json.x509Thumbprint).toEqual(['array']);
    expect(json.recoverableDays).toBe('thirty');
  });

  it('test_toJSON_date_fields_are_ISO_strings', () => {
    const input = {
      notBefore: new Date('2020-01-01T00:00:00.000Z'),
      expiresOn: new Date('2021-01-01T00:00:00.000Z'),
      createdOn: new Date('2019-01-01T00:00:00.000Z'),
      updatedOn: new Date('2022-01-01T00:00:00.000Z'),
    };
    const certProps = new CertificateProperties(input);
    const json = certProps.toJSON();
    expect(json.notBefore).toBe('2020-01-01T00:00:00.000Z');
    expect(json.expiresOn).toBe('2021-01-01T00:00:00.000Z');
    expect(json.createdOn).toBe('2019-01-01T00:00:00.000Z');
    expect(json.updatedOn).toBe('2022-01-01T00:00:00.000Z');
  });

  it('test_toJSON_preserves_tags_object', () => {
    const tags = { a: 1, b: 2, c: { d: 3 } };
    const certProps = new CertificateProperties({ tags });
    const json = certProps.toJSON();
    expect(json.tags).toEqual(tags);
  });

  it('test_toJSON_null_date_fields', () => {
    const certProps = new CertificateProperties({
      notBefore: null,
      expiresOn: null,
      createdOn: null,
      updatedOn: null,
    });
    const json = certProps.toJSON();
    expect(json.notBefore).toBeNull();
    expect(json.expiresOn).toBeNull();
    expect(json.createdOn).toBeNull();
    expect(json.updatedOn).toBeNull();
  });

  it('test_toJSON_empty_tags_serialization', () => {
    const certProps1 = new CertificateProperties({});
    const certProps2 = new CertificateProperties({ tags: {} });
    expect(certProps1.toJSON().tags).toEqual({});
    expect(certProps2.toJSON().tags).toEqual({});
  });

  it('test_toJSON_undefined_or_null_properties', () => {
    const certProps = new CertificateProperties({
      vaultUrl: null,
      version: undefined,
      name: null,
      enabled: undefined,
      notBefore: null,
      expiresOn: undefined,
      createdOn: null,
      updatedOn: undefined,
      recoveryLevel: null,
      id: undefined,
      tags: undefined,
      x509Thumbprint: null,
      recoverableDays: undefined,
    });
    const json = certProps.toJSON();
    expect(json.vaultUrl).toBeNull();
    expect(json.version).toBeNull();
    expect(json.name).toBeNull();
    expect(json.enabled).toBeNull();
    expect(json.notBefore).toBeNull();
    expect(json.expiresOn).toBeNull();
    expect(json.createdOn).toBeNull();
    expect(json.updatedOn).toBeNull();
    expect(json.recoveryLevel).toBeNull();
    expect(json.id).toBeNull();
    expect(json.tags).toEqual({});
    expect(json.x509Thumbprint).toBeNull();
    expect(json.recoverableDays).toBeNull();
  });
});
