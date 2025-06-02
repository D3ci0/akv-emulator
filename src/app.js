const express = require('express');
const fs = require('fs');
const path = require('path');
const KeyVaultSecret = require('./models/KeyVaultSecret');
const KeyVaultCertificate = require('./models/KeyVaultCertificate');
const secretsRouter = require('./routes/secrets');
const certificatesRouter = require('./routes/certificates');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory storage for the list of KeyVaultSecrets
let keyVaultSecrets = [];
// In-memory storage for the list of KeyVaultCertificates
let keyVaultCertificates = [];

// Load KeyVaultSecrets from JSON file at boot time
const secretJsonPath = path.join(__dirname, '../data/example-secrets.json');
try {
  const secretJson = fs.readFileSync(secretJsonPath, 'utf-8');
  const secretArray = JSON.parse(secretJson);
  if (Array.isArray(secretArray)) {
    keyVaultSecrets = secretArray.map(KeyVaultSecret.fromJSON);
    console.log(`Loaded ${keyVaultSecrets.length} KeyVaultSecrets at startup.`);
  } else {
    console.error('Secret JSON is not an array.');
  }
} catch (err) {
  console.error('Failed to load KeyVaultSecrets:', err.message);
}

// Load KeyVaultCertificates from JSON file at boot time
const certificateJsonPath = path.join(__dirname, '../data/example-certificates.json');
try {
  const certificatePropertiesJson = fs.readFileSync(certificateJsonPath, 'utf-8');
  const certificateArray = JSON.parse(certificatePropertiesJson);
  if (Array.isArray(certificateArray)) {
    keyVaultCertificates = certificateArray.map(KeyVaultCertificate.fromJSON);
    console.log(`Loaded ${keyVaultCertificates.length} KeyVaultCertificates at startup.`);
  } else {
    console.error('Certificate JSON is not an array.');
  }
} catch (err) {
  console.error('Failed to load KeyVaultCertificates:', err.message);
}

// Store in app.locals for router access
app.locals.keyVaultSecrets = keyVaultSecrets;
app.locals.keyVaultCertificates = keyVaultCertificates;

// Mount routers
app.use('/secrets', secretsRouter);
app.use('/certificates', certificatesRouter);

module.exports = app;