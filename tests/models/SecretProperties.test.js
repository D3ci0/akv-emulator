import { describe, it, expect } from 'vitest';
import SecretProperties from '../../src/models/SecretProperties';

describe('SecretProperties.fromJSON', () => {
  it('test_fromJSON_with_valid_object', () => {
    const input = {
      id: 'secret-id',
      version: 'v1',
      enabled: true,
      notBefore: '2023-01-01T00:00:00.000Z',
      expiresOn: '2024-01-01T00:00:00.000Z',
      createdOn: '2023-01-01T00:00:00.000Z',
      updatedOn: '2023-06-01T00:00:00.000Z',
      name: 'mySecret',
      recoveryLevel: 'Recoverable',
      contentType: 'text/plain',
      tags: { env: 'prod' },
      keyId: 'key-id',
      managed: false,
      recoverableDays: 30,
    };
    const result = SecretProperties.fromJSON(input);
    expect(result).toBeInstanceOf(SecretProperties);
    expect(result.id).toBe(input.id);
    expect(result.version).toBe(input.version);
    expect(result.enabled).toBe(input.enabled);
    expect(result.notBefore).toEqual(new Date(input.notBefore));
    expect(result.expiresOn).toEqual(new Date(input.expiresOn));
    expect(result.createdOn).toEqual(new Date(input.createdOn));
    expect(result.updatedOn).toEqual(new Date(input.updatedOn));
    expect(result.name).toBe(input.name);
    expect(result.recoveryLevel).toBe(input.recoveryLevel);
    expect(result.contentType).toBe(input.contentType);
    expect(result.tags).toEqual(input.tags);
    expect(result.keyId).toBe(input.keyId);
    expect(result.managed).toBe(input.managed);
    expect(result.recoverableDays).toBe(input.recoverableDays);
  });

  it('test_fromJSON_with_valid_json_string', () => {
    const inputObj = {
      id: 'secret-id',
      version: 'v2',
      enabled: false,
      notBefore: '2022-01-01T00:00:00.000Z',
      expiresOn: '2025-01-01T00:00:00.000Z',
      createdOn: '2022-01-01T00:00:00.000Z',
      updatedOn: '2022-06-01T00:00:00.000Z',
      name: 'anotherSecret',
      recoveryLevel: 'Purgeable',
      contentType: 'application/json',
      tags: { env: 'dev' },
      keyId: 'key-id-2',
      managed: true,
      recoverableDays: 90,
    };
    const input = JSON.stringify(inputObj);
    const result = SecretProperties.fromJSON(input);
    expect(result).toBeInstanceOf(SecretProperties);
    expect(result.id).toBe(inputObj.id);
    expect(result.version).toBe(inputObj.version);
    expect(result.enabled).toBe(inputObj.enabled);
    expect(result.notBefore).toEqual(new Date(inputObj.notBefore));
    expect(result.expiresOn).toEqual(new Date(inputObj.expiresOn));
    expect(result.createdOn).toEqual(new Date(inputObj.createdOn));
    expect(result.updatedOn).toEqual(new Date(inputObj.updatedOn));
    expect(result.name).toBe(inputObj.name);
    expect(result.recoveryLevel).toBe(inputObj.recoveryLevel);
    expect(result.contentType).toBe(inputObj.contentType);
    expect(result.tags).toEqual(inputObj.tags);
    expect(result.keyId).toBe(inputObj.keyId);
    expect(result.managed).toBe(inputObj.managed);
    expect(result.recoverableDays).toBe(inputObj.recoverableDays);
  });

  it('test_fromJSON_with_missing_optional_fields', () => {
    const input = {
      id: 'secret-id',
      name: 'minimalSecret',
    };
    const result = SecretProperties.fromJSON(input);
    expect(result).toBeInstanceOf(SecretProperties);
    expect(result.id).toBe(input.id);
    expect(result.name).toBe(input.name);
    expect(result.version).toBeNull();
    expect(result.enabled).toBeNull();
    expect(result.notBefore).toBeNull();
    expect(result.expiresOn).toBeNull();
    expect(result.createdOn).toBeNull();
    expect(result.updatedOn).toBeNull();
    expect(result.recoveryLevel).toBeNull();
    expect(result.contentType).toBeNull();
    expect(result.tags).toEqual({});
    expect(result.keyId).toBeNull();
    expect(result.managed).toBeNull();
    expect(result.recoverableDays).toBeNull();
  });

  it('test_fromJSON_with_invalid_json_string', () => {
    const invalidJson = '{"id": "secret-id", "name": "badSecret",'; // malformed JSON
    expect(() => SecretProperties.fromJSON(invalidJson)).toThrow(SyntaxError);
  });

  it('test_fromJSON_with_extra_fields', () => {
    const input = {
      id: 'secret-id',
      name: 'extraSecret',
      extraField1: 'shouldBeIgnored',
      extraField2: 12345,
    };
    const result = SecretProperties.fromJSON(input);
    expect(result).toBeInstanceOf(SecretProperties);
    expect(result.id).toBe(input.id);
    expect(result.name).toBe(input.name);
    expect(result).not.toHaveProperty('extraField1');
    expect(result).not.toHaveProperty('extraField2');
  });
});

describe('SecretProperties.toJSON', () => {
  it('should serialize date fields to ISO strings', () => {
    const notBefore = new Date('2023-01-01T00:00:00.000Z');
    const expiresOn = new Date('2024-01-01T00:00:00.000Z');
    const createdOn = new Date('2023-01-01T00:00:00.000Z');
    const updatedOn = new Date('2023-06-01T00:00:00.000Z');
    const props = new SecretProperties({
      notBefore,
      expiresOn,
      createdOn,
      updatedOn,
    });
    const json = props.toJSON();
    expect(json.notBefore).toBe(notBefore.toISOString());
    expect(json.expiresOn).toBe(expiresOn.toISOString());
    expect(json.createdOn).toBe(createdOn.toISOString());
    expect(json.updatedOn).toBe(updatedOn.toISOString());
  });

  it('should preserve nonDate field types in JSON output', () => {
    const tags = { env: 'prod', team: 'dev' };
    const props = new SecretProperties({
      id: 'abc',
      version: 'v1',
      enabled: true,
      name: 'secretName',
      recoveryLevel: 'Recoverable',
      contentType: 'text/plain',
      tags,
      keyId: 'key-123',
      managed: false,
      recoverableDays: 42,
    });
    const json = props.toJSON();
    expect(json.id).toBe('abc');
    expect(json.version).toBe('v1');
    expect(json.enabled).toBe(true);
    expect(json.name).toBe('secretName');
    expect(json.recoveryLevel).toBe('Recoverable');
    expect(json.contentType).toBe('text/plain');
    expect(json.tags).toEqual(tags);
    expect(json.keyId).toBe('key-123');
    expect(json.managed).toBe(false);
    expect(json.recoverableDays).toBe(42);
  });

  it('should serialize fully populated object', () => {
    const props = new SecretProperties({
      id: 'id1',
      version: 'v2',
      enabled: false,
      notBefore: '2022-01-01T00:00:00.000Z',
      expiresOn: '2023-01-01T00:00:00.000Z',
      createdOn: '2022-01-01T00:00:00.000Z',
      updatedOn: '2022-06-01T00:00:00.000Z',
      name: 'fullSecret',
      recoveryLevel: 'Purgeable',
      contentType: 'application/json',
      tags: { env: 'test', owner: 'qa' },
      keyId: 'key-xyz',
      managed: true,
      recoverableDays: 7,
    });
    const json = props.toJSON();
    expect(json).toEqual({
      id: 'id1',
      version: 'v2',
      enabled: false,
      notBefore: new Date('2022-01-01T00:00:00.000Z').toISOString(),
      expiresOn: new Date('2023-01-01T00:00:00.000Z').toISOString(),
      createdOn: new Date('2022-01-01T00:00:00.000Z').toISOString(),
      updatedOn: new Date('2022-06-01T00:00:00.000Z').toISOString(),
      name: 'fullSecret',
      recoveryLevel: 'Purgeable',
      contentType: 'application/json',
      tags: { env: 'test', owner: 'qa' },
      keyId: 'key-xyz',
      managed: true,
      recoverableDays: 7,
    });
  });

  it('should serialize empty tags object', () => {
    const props = new SecretProperties({
      tags: {},
    });
    const json = props.toJSON();
    expect(json.tags).toEqual({});
    expect(Object.prototype.hasOwnProperty.call(json, 'tags')).toBe(true);
  });

  it('should include explicit null fields in JSON output', () => {
    const props = new SecretProperties({
      id: null,
      version: null,
      enabled: null,
      notBefore: null,
      expiresOn: null,
      createdOn: null,
      updatedOn: null,
      name: null,
      recoveryLevel: null,
      contentType: null,
      tags: null,
      keyId: null,
      managed: null,
      recoverableDays: null,
    });
    const json = props.toJSON();
    expect(json).toHaveProperty('id', null);
    expect(json).toHaveProperty('version', null);
    expect(json).toHaveProperty('enabled', null);
    expect(json).toHaveProperty('notBefore', null);
    expect(json).toHaveProperty('expiresOn', null);
    expect(json).toHaveProperty('createdOn', null);
    expect(json).toHaveProperty('updatedOn', null);
    expect(json).toHaveProperty('name', null);
    expect(json).toHaveProperty('recoveryLevel', null);
    expect(json).toHaveProperty('contentType', null);
    expect(json).toHaveProperty('tags', null);
    expect(json).toHaveProperty('keyId', null);
    expect(json).toHaveProperty('managed', null);
    expect(json).toHaveProperty('recoverableDays', null);
  });
});
