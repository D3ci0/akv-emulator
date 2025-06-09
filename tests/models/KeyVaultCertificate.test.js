import { describe, it, expect } from 'vitest';
const KeyVaultCertificate = require('../../src/models/KeyVaultCertificate');
const CertificateProperties = require('../../src/models/CertificateProperties');

describe('KeyVaultCertificate.fromJSON', () => {
  it('test_fromJSON_deserializes_full_object', () => {
    const input = {
      cer: 'base64cer',
      keyId: 'key-id-123',
      secretId: 'secret-id-456',
      properties: {
        vaultUrl: 'https://vault.example.com',
        version: 'v1',
        name: 'certName',
        enabled: true,
        notBefore: '2023-01-01T00:00:00.000Z',
        expiresOn: '2024-01-01T00:00:00.000Z',
        createdOn: '2023-01-01T00:00:00.000Z',
        updatedOn: '2023-06-01T00:00:00.000Z',
        recoveryLevel: 'Recoverable',
        id: 'prop-id-789',
        tags: { env: 'prod' },
        x509Thumbprint: 'thumbprint',
        recoverableDays: 90,
      },
    };
    const cert = KeyVaultCertificate.fromJSON(input);
    expect(cert).toBeInstanceOf(KeyVaultCertificate);
    expect(cert.cer).toBe('base64cer');
    expect(cert.keyId).toBe('key-id-123');
    expect(cert.secretId).toBe('secret-id-456');
    expect(cert.properties).toBeInstanceOf(CertificateProperties);
    expect(cert.properties.vaultUrl).toBe('https://vault.example.com');
    expect(cert.properties.version).toBe('v1');
    expect(cert.properties.name).toBe('certName');
    expect(cert.properties.enabled).toBe(true);
    expect(cert.properties.notBefore).toEqual(new Date('2023-01-01T00:00:00.000Z'));
    expect(cert.properties.expiresOn).toEqual(new Date('2024-01-01T00:00:00.000Z'));
    expect(cert.properties.createdOn).toEqual(new Date('2023-01-01T00:00:00.000Z'));
    expect(cert.properties.updatedOn).toEqual(new Date('2023-06-01T00:00:00.000Z'));
    expect(cert.properties.recoveryLevel).toBe('Recoverable');
    expect(cert.properties.id).toBe('prop-id-789');
    expect(cert.properties.tags).toEqual({ env: 'prod' });
    expect(cert.properties.x509Thumbprint).toBe('thumbprint');
    expect(cert.properties.recoverableDays).toBe(90);
  });

  it('test_fromJSON_deserializes_full_json_string', () => {
    const inputObj = {
      cer: 'base64cer',
      keyId: 'key-id-123',
      secretId: 'secret-id-456',
      properties: {
        vaultUrl: 'https://vault.example.com',
        version: 'v1',
        name: 'certName',
        enabled: true,
        notBefore: '2023-01-01T00:00:00.000Z',
        expiresOn: '2024-01-01T00:00:00.000Z',
        createdOn: '2023-01-01T00:00:00.000Z',
        updatedOn: '2023-06-01T00:00:00.000Z',
        recoveryLevel: 'Recoverable',
        id: 'prop-id-789',
        tags: { env: 'prod' },
        x509Thumbprint: 'thumbprint',
        recoverableDays: 90,
      },
    };
    const input = JSON.stringify(inputObj);
    const cert = KeyVaultCertificate.fromJSON(input);
    expect(cert).toBeInstanceOf(KeyVaultCertificate);
    expect(cert.cer).toBe('base64cer');
    expect(cert.keyId).toBe('key-id-123');
    expect(cert.secretId).toBe('secret-id-456');
    expect(cert.properties).toBeInstanceOf(CertificateProperties);
    expect(cert.properties.vaultUrl).toBe('https://vault.example.com');
    expect(cert.properties.version).toBe('v1');
    expect(cert.properties.name).toBe('certName');
    expect(cert.properties.enabled).toBe(true);
    expect(cert.properties.notBefore).toEqual(new Date('2023-01-01T00:00:00.000Z'));
    expect(cert.properties.expiresOn).toEqual(new Date('2024-01-01T00:00:00.000Z'));
    expect(cert.properties.createdOn).toEqual(new Date('2023-01-01T00:00:00.000Z'));
    expect(cert.properties.updatedOn).toEqual(new Date('2023-06-01T00:00:00.000Z'));
    expect(cert.properties.recoveryLevel).toBe('Recoverable');
    expect(cert.properties.id).toBe('prop-id-789');
    expect(cert.properties.tags).toEqual({ env: 'prod' });
    expect(cert.properties.x509Thumbprint).toBe('thumbprint');
    expect(cert.properties.recoverableDays).toBe(90);
  });

  it('test_fromJSON_handles_missing_optional_fields', () => {
    const input = {
      cer: 'base64cer',
      keyId: 'key-id-123',
      // secretId and properties are missing
    };
    const cert = KeyVaultCertificate.fromJSON(input);
    expect(cert).toBeInstanceOf(KeyVaultCertificate);
    expect(cert.cer).toBe('base64cer');
    expect(cert.keyId).toBe('key-id-123');
    expect(cert.secretId).toBeNull();
    expect(cert.properties).toBeNull();
  });

  it('test_fromJSON_throws_on_invalid_json_string', () => {
    const invalidJson = '{"cer": "base64cer", "keyId": "key-id-123",'; // malformed JSON
    expect(() => KeyVaultCertificate.fromJSON(invalidJson)).toThrow(SyntaxError);
  });

  it('test_fromJSON_handles_empty_object', () => {
    const cert = KeyVaultCertificate.fromJSON({});
    expect(cert).toBeInstanceOf(KeyVaultCertificate);
    expect(cert.cer).toBeNull();
    expect(cert.keyId).toBeNull();
    expect(cert.secretId).toBeNull();
    expect(cert.properties).toBeNull();
  });

  it("test_fromJSON_handles_invalid_properties_field", () => {
    const input = {
      cer: 'base64cer',
      keyId: 'key-id-123',
      secretId: 'secret-id-456',
      properties: 12345, // not an object
    };
    const cert = KeyVaultCertificate.fromJSON(input);
    expect(cert).toBeInstanceOf(KeyVaultCertificate);
    expect(cert.cer).toBe('base64cer');
    expect(cert.keyId).toBe('key-id-123');
    expect(cert.secretId).toBe('secret-id-456');
    // CertificateProperties.fromJSON(12345) will create a CertificateProperties with all fields null/default
    expect(cert.properties).toBeInstanceOf(CertificateProperties);
    expect(cert.properties.vaultUrl).toBeNull();
    expect(cert.properties.version).toBeNull();
    expect(cert.properties.name).toBeNull();
    expect(cert.properties.enabled).toBeNull();
    expect(cert.properties.notBefore).toBeNull();
    expect(cert.properties.expiresOn).toBeNull();
    expect(cert.properties.createdOn).toBeNull();
    expect(cert.properties.updatedOn).toBeNull();
    expect(cert.properties.recoveryLevel).toBeNull();
    expect(cert.properties.id).toBeNull();
    expect(cert.properties.tags).toEqual({});
    expect(cert.properties.x509Thumbprint).toBeNull();
    expect(cert.properties.recoverableDays).toBeNull();
  });
});