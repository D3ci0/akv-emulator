const express = require('express');
const fs = require('fs');
const path = require('path');
const KeyVaultSecret = require('./models/KeyVaultSecret');
const KeyVaultCertificate = require('./models/KeyVaultCertificate');
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
  // Optionally, you could exit the process or handle as needed
}

/**
 * GET /secrets/:name
 * GET /secrets/:name/:version
 * Mimics Azure Key Vault Get Secret API
 */
app.get('/secrets/:name/:version?', (req, res) => {
  const { name, version } = req.params;
  let foundSecret = null;

  if (version) {
    foundSecret = keyVaultSecrets.find(
        s => s.properties && s.properties.name === name && s.properties.version === version
    );
  } else {
    // If version not specified, return the latest (by createdOn or updatedOn)
    const secrets = keyVaultSecrets.filter(
        s => s.properties && s.properties.name === name
    );
    if (secrets.length > 0) {
      // Sort by createdOn or updatedOn descending
      secrets.sort((a, b) => {
        const aDate = new Date(a.properties.updatedOn || a.properties.createdOn || 0);
        const bDate = new Date(b.properties.updatedOn || b.properties.createdOn || 0);
        return bDate - aDate;
      });
      foundSecret = secrets[0];
    }
  }

  if (!foundSecret) {
    return res.status(404).json({ error: 'Secret not found' });
  }

  res.json(foundSecret);
});

/**
 * GET /certificates/:name/versions
 * Mimics Azure Key Vault's listPropertiesOfCertificateVersions API
 * Returns an array of CertificateProperties for all versions of the given certificate name,
 * formatted to match Azure Key Vault's REST API structure.
 */
app.get('/certificates/:name/versions', (req, res) => {
  const { name } = req.params;
  // Filter all versions for the given certificate name
  const versions = keyVaultCertificates
      .filter(certProperties => certProperties.properties.name === name)
      .map(cert => {
        // Convert ISO date strings to Unix timestamps (seconds)
        const toUnix = (d) => d ? Math.floor(new Date(d).getTime() / 1000) : undefined;
        return {
          id: cert.properties.id,
          attributes: {
            enabled: cert.properties.enabled,
            nbf: toUnix(cert.properties.notBefore),
            exp: toUnix(cert.properties.expiresOn),
            created: toUnix(cert.properties.createdOn),
            updated: toUnix(cert.properties.updatedOn),
            recoveryLevel: cert.properties.recoveryLevel,
            recoverableDays: cert.properties.recoverableDays
          },
          tags: cert.properties.tags || {},
          x5t: cert.properties.x509Thumbprint
        };
      });

  if (versions.length === 0) {
    return res.status(404).json({ error: 'Certificate not found' });
  }

  // Optionally, implement paging here if needed
  res.json({
    value: versions
  });
});

/**
 * GET /certificates/:name/:version
 * Mimics Azure Key Vault's getCertificateVersion API.
 * Returns a single certificate version with the correct structure.
 */
app.get('/certificates/:name/:version', (req, res) => {
  const { name, version } = req.params;

  // Find the certificate with the given name and version
  const cert = keyVaultCertificates.find(
      c =>
          c.properties &&
          c.properties.name === name &&
          c.properties.version === version
  );

  if (!cert) {
    return res.status(404).json({ error: 'Certificate version not found' });
  }

  // Convert ISO date strings to Unix timestamps (seconds)
  const toUnix = (d) => d ? Math.floor(new Date(d).getTime() / 1000) : undefined;

  // Build the Azure-compatible response
  const response = {
    id: cert.properties.id,
    kid: cert.properties.x509Thumbprint,
    sid: cert.secretId,
    cer: cert.cer,
    attributes: {
      enabled: cert.properties.enabled,
      nbf: toUnix(cert.properties.notBefore),
      exp: toUnix(cert.properties.expiresOn),
      created: toUnix(cert.properties.createdOn),
      updated: toUnix(cert.properties.updatedOn),
      recoveryLevel: cert.properties.recoveryLevel,
      recoverableDays: cert.properties.recoverableDays
    },
    tags: cert.properties.tags || {},
    x5t: cert.properties.x509Thumbprint
  };

  res.json(response);
});

module.exports = app;