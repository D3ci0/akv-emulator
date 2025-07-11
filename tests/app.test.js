import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import app from "../src/app";

// Helper to clear require cache for app.js and its dependencies
function clearAppRequireCache() {
  Object.keys(require.cache).forEach((key) => {
    if (
      key.includes('app.js') ||
      key.includes('KeyVaultSecret') ||
      key.includes('KeyVaultCertificate') ||
      key.includes('KeyVaultKey')
    ) {
      delete require.cache[key];
    }
  });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('KeyVault App Startup', () => {
  const dataDir = path.join(__dirname, './data');
  const tempSecretsDir = path.join(__dirname, 'temp_secrets');
  const tempCertsDir = path.join(__dirname, 'temp_certs');
  const tempKeysDir = path.join(__dirname, 'temp_keys');
  const externalSecretsPath = path.join(tempSecretsDir, 'test-secrets.json');
  const externalCertsPath = path.join(tempCertsDir, 'test-certificates.json');
  const externalKeysPath = path.join(tempCertsDir, 'test-keys.json');

  // Helper to write JSON files
  function writeJson(filePath, data) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Helper to remove files/directories
  function cleanup(paths) {
    for (const p of paths) {
      if (fs.existsSync(p)) {
        if (fs.lstatSync(p).isDirectory()) {
          fs.rmSync(p, { recursive: true, force: true });
        } else {
          fs.unlinkSync(p);
        }
      }
    }
  }

  beforeEach(() => {
    cleanup([
      tempSecretsDir,
      tempCertsDir,
      tempKeysDir
    ]);
    clearAppRequireCache();
    delete process.env.SECRETS_DIR;
    delete process.env.CERTIFICATES_DIR;
    delete process.env.KEYS_DIR;
  });

  afterEach(() => {
    cleanup([
      tempSecretsDir,
      tempCertsDir,
      tempKeysDir
    ]);
    clearAppRequireCache();
    delete process.env.SECRETS_DIR;
    delete process.env.CERTIFICATES_DIR;
    delete process.env.KEYS_DIR;
  });

  it('test_load_keyvaultkeys_from_example_json_success', () => {

    const app = require('../src/app');
    expect(app.locals.keyVaultKeys).toBeDefined();
    expect(Array.isArray(app.locals.keyVaultKeys)).toBe(true);
    expect(app.locals.keyVaultKeys.length).toBe(3);
    expect(app.locals.keyVaultKeys[0].properties.name).toBe('my-key');
  });

  it('test_load_keyvaultsecrets_from_example_json_success', () => {

    const app = require('../src/app');
    expect(app.locals.keyVaultSecrets).toBeDefined();
    expect(Array.isArray(app.locals.keyVaultSecrets)).toBe(true);
    expect(app.locals.keyVaultSecrets.length).toBe(2);
    expect(app.locals.keyVaultSecrets[0].value).toBe('mySecretValue');
    expect(app.locals.keyVaultSecrets[1].properties.name).toBe('mySecret');
  });

  it('test_load_keyvaultcertificates_from_example_json_success', () => {

    const app = require('../src/app');
    expect(app.locals.keyVaultCertificates).toBeDefined();
    expect(Array.isArray(app.locals.keyVaultCertificates)).toBe(true);
    expect(app.locals.keyVaultCertificates.length).toBe(3);
    expect(app.locals.keyVaultCertificates[0].properties.name).toBe('my-cert');
  });

  it('test_merge_secrets_and_certificates_from_multiple_sources', () => {

    process.env.SECRETS_DIR = dataDir;
    process.env.CERTIFICATES_DIR = dataDir;
    process.env.KEYS_DIR = dataDir;

    const app = require('../src/app');
    expect(app.locals.keyVaultSecrets.length).toBe(4);
    expect(app.locals.keyVaultSecrets.some(s => s.value === 'mySecretValueTest')).toBe(true);
    expect(app.locals.keyVaultSecrets.some(s => s.value === 'mySecretValue')).toBe(true);

    expect(app.locals.keyVaultCertificates.length).toBe(6);
    expect(app.locals.keyVaultCertificates.some(c => c.cer === 'MIIFDzCCA...')).toBe(true);


    expect(app.locals.keyVaultKeys.length).toBe(6);
  });


  it('test_invalid_external_json_file_content', () => {
    // Write invalid external secrets/certs (not an array)
    fs.mkdirSync(tempSecretsDir, { recursive: true });
    fs.mkdirSync(tempCertsDir, { recursive: true });
    fs.mkdirSync(tempKeysDir, { recursive: true });
    fs.writeFileSync(externalSecretsPath, '{"not":"an array"}', 'utf-8');
    fs.writeFileSync(externalCertsPath, '{"not":"an array"}', 'utf-8');
    fs.writeFileSync(externalKeysPath, '{"not":"an array"}', 'utf-8');
    process.env.SECRETS_DIR = tempSecretsDir;
    process.env.CERTIFICATES_DIR = tempCertsDir;
    process.env.KEYS_DIR = tempKeysDir;

    const app = require('../src/app');
    // Should not throw, should log error, and not add to arrays
    expect(app.locals.keyVaultSecrets.length).toBe(2);
    expect(app.locals.keyVaultCertificates.length).toBe(3);
    expect(app.locals.keyVaultKeys.length).toBe(3);
  });

  it('test_missing_environment_variables_for_external_files', () => {
    // Do not set process.env.SECRETS_DIR or CERTIFICATES_DIR
    delete process.env.SECRETS_DIR;
    delete process.env.CERTIFICATES_DIR;

    const app = require('../src/app');
    expect(app.locals.keyVaultSecrets.length).toBe(2);
    expect(app.locals.keyVaultSecrets[0].value).toBe('mySecretValue');
    expect(app.locals.keyVaultCertificates.length).toBe(3);
    expect(app.locals.keyVaultCertificates[0].properties.name).toBe('my-cert');
  });
});