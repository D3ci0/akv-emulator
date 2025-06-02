import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import certificatesRouter from '../../src/routes/certificates';

function makeCertificate({
  name,
  version,
  id = `https://vault/certificates/${name}/${version}`,
  enabled = true,
  notBefore = '2023-01-01T00:00:00Z',
  expiresOn = '2024-01-01T00:00:00Z',
  createdOn = '2023-01-01T00:00:00Z',
  updatedOn = '2023-06-01T00:00:00Z',
  recoveryLevel = 'Recoverable+Purgeable',
  recoverableDays = 90,
  tags = undefined,
  x509Thumbprint = 'abc123',
  cer = 'base64cer',
  keyId = 'keyid',
  secretId = 'secretid',
} = {}) {
  return {
    cer,
    keyId,
    secretId,
    properties: {
      name,
      version,
      id,
      enabled,
      notBefore,
      expiresOn,
      createdOn,
      updatedOn,
      recoveryLevel,
      recoverableDays,
      tags,
      x509Thumbprint,
    },
  };
}

describe('certificatesRouter', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.locals = {};
    app.use('/certificates', certificatesRouter);
  });

  it('should_return_all_versions_for_certificate_name', async () => {
    app.locals.keyVaultCertificates = [
      makeCertificate({
        name: 'foo',
        version: 'v1',
        createdOn: '2023-01-01T00:00:00Z',
        updatedOn: '2023-01-02T00:00:00Z',
      }),
      makeCertificate({
        name: 'foo',
        version: 'v2',
        createdOn: '2023-02-01T00:00:00Z',
        updatedOn: '2023-02-02T00:00:00Z',
      }),
      makeCertificate({ name: 'bar', version: 'v1' }),
    ];
    const res = await request(app).get('/certificates/foo/versions');
    expect(res.status).toBe(200);
    expect(res.body.value).toHaveLength(2);
    expect(res.body.value[0]).toHaveProperty('id');
    expect(res.body.value[0]).toHaveProperty('attributes');
    expect(res.body.value[0]).toHaveProperty('tags');
    expect(res.body.value[0]).toHaveProperty('x5t');
    expect(res.body.value[1].id).toContain('foo');
  });

  it('should_return_specific_certificate_version_by_name_and_version', async () => {
    app.locals.keyVaultCertificates = [
      makeCertificate({
        name: 'baz',
        version: 'v1',
        cer: 'bazcer',
        keyId: 'bazkey',
        secretId: 'bazsecret',
        x509Thumbprint: 'bazthumb',
      }),
      makeCertificate({ name: 'baz', version: 'v2' }),
    ];
    const res = await request(app).get('/certificates/baz/v1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('kid', 'bazthumb');
    expect(res.body).toHaveProperty('sid', 'bazsecret');
    expect(res.body).toHaveProperty('cer', 'bazcer');
    expect(res.body).toHaveProperty('attributes');
    expect(res.body).toHaveProperty('tags');
    expect(res.body).toHaveProperty('x5t', 'bazthumb');
    expect(res.body.id).toContain('baz');
  });

  it('should_format_date_attributes_as_unix_timestamps', async () => {
    const notBefore = '2023-01-01T00:00:00Z';
    const expiresOn = '2024-01-01T00:00:00Z';
    const createdOn = '2023-01-01T00:00:00Z';
    const updatedOn = '2023-06-01T00:00:00Z';
    app.locals.keyVaultCertificates = [
      makeCertificate({
        name: 'timed',
        version: 'v1',
        notBefore,
        expiresOn,
        createdOn,
        updatedOn,
      }),
    ];
    const res = await request(app).get('/certificates/timed/versions');
    expect(res.status).toBe(200);
    const attrs = res.body.value[0].attributes;
    expect(attrs.nbf).toBe(Math.floor(new Date(notBefore).getTime() / 1000));
    expect(attrs.exp).toBe(Math.floor(new Date(expiresOn).getTime() / 1000));
    expect(attrs.created).toBe(Math.floor(new Date(createdOn).getTime() / 1000));
    expect(attrs.updated).toBe(Math.floor(new Date(updatedOn).getTime() / 1000));
  });

  it('should_return_404_for_nonexistent_certificate_name_on_versions', async () => {
    app.locals.keyVaultCertificates = [makeCertificate({ name: 'exists', version: 'v1' })];
    const res = await request(app).get('/certificates/doesnotexist/versions');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Certificate not found');
  });

  it('should_return_404_for_nonexistent_certificate_version', async () => {
    app.locals.keyVaultCertificates = [makeCertificate({ name: 'alpha', version: 'v1' })];
    const res = await request(app).get('/certificates/alpha/v2');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Certificate version not found');
  });

  it('should_return_empty_tags_object_when_no_tags_defined', async () => {
    app.locals.keyVaultCertificates = [
      makeCertificate({ name: 'notags', version: 'v1', tags: undefined }),
    ];
    const res = await request(app).get('/certificates/notags/versions');
    expect(res.status).toBe(200);
    expect(res.body.value[0].tags).toEqual({});
  });

  it('should_handle_missing_or_invalid_keyVaultCertificates_in_app_locals', async () => {
    // Case 1: keyVaultCertificates is undefined
    let res = await request(app).get('/certificates/anything/versions');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Certificate not found');

    // Case 2: keyVaultCertificates is not an array
    app.locals.keyVaultCertificates = null;
    res = await request(app).get('/certificates/anything/versions');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Certificate not found');
  });
});
