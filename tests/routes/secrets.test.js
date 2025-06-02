import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import secretsRouter from '../../src/routes/secrets';

function makeSecret({ name, version, createdOn, updatedOn, value = 'secret-value' }) {
  return {
    value,
    properties: {
      name,
      version,
      createdOn,
      updatedOn,
    },
  };
}

describe('GET /secrets/:name/:version?', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.locals = {};
    app.use('/secrets', secretsRouter);
  });

  it('shouldReturnLatestSecretVersionWhenVersionNotSpecified', async () => {
    const now = new Date();
    const earlier = new Date(now.getTime() - 10000);
    app.locals.keyVaultSecrets = [
      makeSecret({ name: 'foo', version: 'v1', createdOn: earlier.toISOString(), updatedOn: earlier.toISOString() }),
      makeSecret({ name: 'foo', version: 'v2', createdOn: now.toISOString(), updatedOn: now.toISOString() }),
    ];
    const res = await request(app).get('/secrets/foo');
    expect(res.status).toBe(200);
    expect(res.body.properties.version).toBe('v2');
  });

  it('shouldReturnSpecificSecretVersionWhenNameAndVersionProvided', async () => {
    app.locals.keyVaultSecrets = [
      makeSecret({ name: 'bar', version: 'v1', createdOn: '2023-01-01T00:00:00Z' }),
      makeSecret({ name: 'bar', version: 'v2', createdOn: '2023-02-01T00:00:00Z' }),
    ];
    const res = await request(app).get('/secrets/bar/v1');
    expect(res.status).toBe(200);
    expect(res.body.properties.version).toBe('v1');
    expect(res.body.properties.name).toBe('bar');
  });

  it('shouldReturnSecretWhenOnlyOneVersionExists', async () => {
    app.locals.keyVaultSecrets = [
      makeSecret({ name: 'baz', version: 'only', createdOn: '2023-03-01T00:00:00Z' }),
    ];
    const res = await request(app).get('/secrets/baz');
    expect(res.status).toBe(200);
    expect(res.body.properties.version).toBe('only');
    expect(res.body.properties.name).toBe('baz');
  });

  it('shouldReturn404WhenSecretNameDoesNotExist', async () => {
    app.locals.keyVaultSecrets = [
      makeSecret({ name: 'exists', version: 'v1', createdOn: '2023-01-01T00:00:00Z' }),
    ];
    const res = await request(app).get('/secrets/doesnotexist');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Secret not found');
  });

  it('shouldReturn404WhenSecretVersionDoesNotExist', async () => {
    app.locals.keyVaultSecrets = [
      makeSecret({ name: 'alpha', version: 'v1', createdOn: '2023-01-01T00:00:00Z' }),
    ];
    const res = await request(app).get('/secrets/alpha/v2');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Secret not found');
  });

  it('shouldReturn404WhenKeyVaultSecretsIsEmptyOrMissing', async () => {
    // Case 1: keyVaultSecrets is undefined
    let res = await request(app).get('/secrets/anything');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Secret not found');

    // Case 2: keyVaultSecrets is empty array
    app.locals.keyVaultSecrets = [];
    res = await request(app).get('/secrets/anything');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Secret not found');
  });
});