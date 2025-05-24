const express = require('express');
const fs = require('fs');
const path = require('path');
const KeyVaultSecret = require('./models/KeyVaultSecret');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory storage for the list of KeyVaultSecrets
let keyVaultSecrets = [];


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

// Placeholder for additional routes
// app.use('/api/your-resource', require('./routes/yourResourceRoute'));

module.exports = app;