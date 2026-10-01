import { describe, it, expect } from 'vitest';
import SecretProperties from '../../src/models/SecretProperties';

describe('SecretProperties.fromJSON', () => {
  it('test_fromJSON_with_valid_object', () => {
    const input = {
      version: 'v1',
      enabled: true,
      notBefore: '2023-01-01T00:00:00.000Z',
      expires: '2024-01-01T00:00:00.000Z',
      created: '2023-01-01T00:00:00.000Z',
      updated: '2023-06-01T00:00:00.000Z',
      recoveryLevel: 'Recoverable',
      recoverableDays: 30,
    };
    const result = SecretProperties.fromJSON(input);
    expect(result).toBeInstanceOf(SecretProperties);
    expect(result.version).toBe(input.version);
    expect(result.enabled).toBe(input.enabled);
    expect(result.notBefore).toEqual(new Date(input.notBefore));
    expect(result.expires).toEqual(new Date(input.expires));
    expect(result.created).toEqual(new Date(input.created));
    expect(result.updated).toEqual(new Date(input.updated));
    expect(result.recoveryLevel).toBe(input.recoveryLevel);
    expect(result.contentType).toBe(input.contentType);
    expect(result.managed).toBe(input.managed);
    expect(result.recoverableDays).toBe(input.recoverableDays);
  });

  it('test_fromJSON_with_valid_json_string', () => {
    const inputObj = {
      version: 'v2',
      enabled: false,
      notBefore: '2022-01-01T00:00:00.000Z',
      expires: '2025-01-01T00:00:00.000Z',
      created: '2022-01-01T00:00:00.000Z',
      updated: '2022-06-01T00:00:00.000Z',
      recoveryLevel: 'Purgeable',
      recoverableDays: 90,
    };
    const input = JSON.stringify(inputObj);
    const result = SecretProperties.fromJSON(input);
    expect(result).toBeInstanceOf(SecretProperties);
    expect(result.version).toBe(inputObj.version);
    expect(result.enabled).toBe(inputObj.enabled);
    expect(result.notBefore).toEqual(new Date(inputObj.notBefore));
    expect(result.expires).toEqual(new Date(inputObj.expires));
    expect(result.created).toEqual(new Date(inputObj.created));
    expect(result.updated).toEqual(new Date(inputObj.updated));
    expect(result.recoveryLevel).toBe(inputObj.recoveryLevel);
    expect(result.recoverableDays).toBe(inputObj.recoverableDays);
  });

  it('test_fromJSON_with_missing_optional_fields', () => {
    const input = {
      version: 'version-1',
      name: 'minimalSecret',
    };
    const result = SecretProperties.fromJSON(input);
    expect(result).toBeInstanceOf(SecretProperties);
    expect(result.version).toBe(input.version);
    expect(result.enabled).toBeNull();
    expect(result.notBefore).toBeNull();
    expect(result.expires).toBeNull();
    expect(result.created).toBeNull();
    expect(result.updated).toBeNull();
    expect(result.recoveryLevel).toBeNull();
    expect(result.recoverableDays).toBeNull();
  });

  it('test_fromJSON_with_invalid_json_string', () => {
    const invalidJson = '{"id": "secret-id", "name": "badSecret",'; // malformed JSON
    expect(() => SecretProperties.fromJSON(invalidJson)).toThrow(SyntaxError);
  });

  it('test_fromJSON_with_extra_fields', () => {
    const input = {
      extraField1: 'shouldBeIgnored',
      extraField2: 12345,
    };
    const result = SecretProperties.fromJSON(input);
    expect(result).toBeInstanceOf(SecretProperties);
    expect(result).not.toHaveProperty('extraField1');
    expect(result).not.toHaveProperty('extraField2');
  });
});

describe('SecretProperties.toJSON', () => {
  it('should preserve nonDate field types in JSON output', () => {
    const props = new SecretProperties({
      version: 'v1',
      enabled: true,
      recoveryLevel: 'Recoverable',
      recoverableDays: 42,
    });
    const json = props.toJSON();
    expect(json.version).toBe('v1');
    expect(json.enabled).toBe(true);
    expect(json.recoveryLevel).toBe('Recoverable');
    expect(json.recoverableDays).toBe(42);
  });

  it('should serialize fully populated object', () => {
    const props = new SecretProperties({
      version: 'v2',
      enabled: false,
      notBefore: '2022-01-01T00:00:00.000Z',
      expires: '2023-01-01T00:00:00.000Z',
      created: '2022-01-01T00:00:00.000Z',
      updated: '2022-06-01T00:00:00.000Z',
      recoveryLevel: 'Purgeable',
      recoverableDays: 7,
    });
    const json = props.toJSON();
    expect(json).toEqual({
      version: 'v2',
      enabled: false,
      nbf: 1640995200,
      exp: 1672531200,
      created: 1640995200,
      updated: 1654041600,
      recoveryLevel: 'Purgeable',
      recoverableDays: 7,
    });
  });

  it('should include explicit null fields in JSON output', () => {
    const props = new SecretProperties({
      version: null,
      enabled: null,
      notBefore: null,
      expires: null,
      created: null,
      updated: null,
      recoveryLevel: null,
      recoverableDays: null,
    });
    const json = props.toJSON();
    expect(json).toHaveProperty('version', null);
    expect(json).toHaveProperty('enabled', null);
    expect(json).toHaveProperty('nbf', null);
    expect(json).toHaveProperty('exp', null);
    expect(json).toHaveProperty('created', null);
    expect(json).toHaveProperty('updated', null);
    expect(json).toHaveProperty('recoveryLevel', null);
    expect(json).toHaveProperty('recoverableDays', null);
  });
});
