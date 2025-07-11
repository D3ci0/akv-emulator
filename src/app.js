const express = require('express');
const fs = require('fs');
const path = require('path');
const KeyVaultSecret = require('./models/KeyVaultSecret');
const KeyVaultCertificate = require('./models/KeyVaultCertificate');
const KeyVaultKey = require('./models/keys/KeyVaultKey');
const secretsRouter = require('./routes/secrets');
const certificatesRouter = require('./routes/certificates');
const keysRouter = require('./routes/keys');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory storage for the list of KeyVaultSecrets
let keyVaultSecrets = [];
// In-memory storage for the list of KeyVaultCertificates
let keyVaultCertificates = [];
// In-memory storage for the list of KeyVaultKeys
let keyVaultKeys = [];

// Load KeyVaultKeys from example JSON file at boot time
const keyJsonPath = path.join(__dirname, '../data/example-keys.json');
try {
  const keyJson = fs.readFileSync(keyJsonPath, 'utf-8');
  const keyArray = JSON.parse(keyJson);
  if (Array.isArray(keyArray)) {
    keyVaultKeys = keyArray.map(KeyVaultKey.fromJSON);
    console.log(
        `Loaded KeyVaultKeys at startup from example json file. KeyVaultKey list new size: ${keyVaultKeys.length}.`
    );
  } else {
    console.error('Key JSON is not an array.');
  }
} catch (err) {
  console.error('Failed to load KeyVaultKeys:', err.message);
}

// Load KeyVaultKeys from external JSON file at boot time
// Allow keys file path to be set via environment variable
try {
  const externalKeyJson = fs.readFileSync(
      path.join(process.env.KEYS_DIR, 'test-keys.json'),
      'utf-8'
  );
  const keyArray = JSON.parse(externalKeyJson);
  if (Array.isArray(keyArray)) {
    keyVaultKeys = [...keyVaultKeys, ...keyArray.map(KeyVaultKey.fromJSON)];
    console.log(
        `Loaded KeyVaultKeys at startup from external json file. KeyVaultKey list new size: ${keyVaultKeys.length}.`
    );
  } else {
    console.error('Key JSON is not an array.');
  }
} catch (err) {
  console.error('Failed to load KeyVaultKeys from external json file:', err.message);
}

// Load KeyVaultSecrets from example JSON file at boot time
const secretJsonPath = path.join(__dirname, '../data/example-secrets.json');
try {
  const secretJson = fs.readFileSync(secretJsonPath, 'utf-8');
  const secretArray = JSON.parse(secretJson);
  if (Array.isArray(secretArray)) {
    keyVaultSecrets = secretArray.map(KeyVaultSecret.fromJSON);
    console.log(
      `Loaded KeyVaultSecrets at startup from example json file. KeyVaultSecret list new size: ${keyVaultSecrets.length}.`
    );
  } else {
    console.error('Secret JSON is not an array.');
  }
} catch (err) {
  console.error('Failed to load KeyVaultSecrets:', err.message);
}

// Load KeyVaultSecrets from external JSON file at boot time
// Allow secrets file path to be set via environment variable
try {
  const externalSecretJson = fs.readFileSync(
    path.join(process.env.SECRETS_DIR, 'test-secrets.json'),
    'utf-8'
  );
  const secretArray = JSON.parse(externalSecretJson);
  if (Array.isArray(secretArray)) {
    keyVaultSecrets = [...keyVaultSecrets, ...secretArray.map(KeyVaultSecret.fromJSON)];
    console.log(
      `Loaded KeyVaultSecrets at startup from external json file. KeyVaultSecret list new size: ${keyVaultSecrets.length}.`
    );
  } else {
    console.error('Secret JSON is not an array.');
  }
} catch (err) {
  console.error('Failed to load KeyVaultSecrets from external json file:', err.message);
}

// Load KeyVaultCertificates from JSON file at boot time
const certificateJsonPath = path.join(__dirname, '../data/example-certificates.json');
try {
  const certificatePropertiesJson = fs.readFileSync(certificateJsonPath, 'utf-8');
  const certificateArray = JSON.parse(certificatePropertiesJson);
  if (Array.isArray(certificateArray)) {
    keyVaultCertificates = certificateArray.map(KeyVaultCertificate.fromJSON);
    console.log(
      `Loaded KeyVaultCertificates at startup. KeyVaultCertificates list new size: ${keyVaultCertificates.length}.`
    );
  } else {
    console.error('Certificate JSON is not an array.');
  }
} catch (err) {
  console.error('Failed to load KeyVaultCertificates:', err.message);
}

// Load KeyVaultCertificates from external JSON file at boot time
// Allow certificate file path to be set via environment variable
try {
  const certificatePropertiesJson = fs.readFileSync(
    path.join(process.env.CERTIFICATES_DIR, 'test-certificates.json'),
    'utf-8'
  );
  const certificateArray = JSON.parse(certificatePropertiesJson);
  if (Array.isArray(certificateArray)) {
    keyVaultCertificates = [
      ...keyVaultCertificates,
      ...certificateArray.map(KeyVaultCertificate.fromJSON),
    ];
    console.log(
      `Loaded KeyVaultCertificates at startup from external json file. KeyVaultCertificates list new size: ${keyVaultCertificates.length}.`
    );
  } else {
    console.error('Certificate JSON is not an array.');
  }
} catch (err) {
  console.error('Failed to load KeyVaultCertificates from external json file:', err.message);
}

// Store in app.locals for router access
app.locals.keyVaultSecrets = keyVaultSecrets;
app.locals.keyVaultCertificates = keyVaultCertificates;
app.locals.keyVaultKeys = keyVaultKeys;

// Mount routers
app.use('/secrets', secretsRouter);
app.use('/certificates', certificatesRouter);
app.use('/keys', keysRouter);

module.exports = app;
