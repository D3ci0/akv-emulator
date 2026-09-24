const express = require('express');
const router = express.Router();

/**
 * GET /secrets/:name
 * GET /secrets/:name/:version
 * Mimics Azure Key Vault Get Secret API
 */
router.get('/:name/:version?', (req, res) => {
  const { name, version } = req.params;
  const keyVaultSecrets = req.app.locals.keyVaultSecrets || [];
  let foundSecret = null;

  if (version) {
    foundSecret = keyVaultSecrets.find(
      (s) => s.name === name && s.attributes.version === version
    );
  } else {
    // If version not specified, return the latest (by created or updated)
    const secrets = keyVaultSecrets.filter((s) => s.name === name);
    if (secrets.length > 0) {
      // Sort by created or updated descending
      secrets.sort((a, b) => {
        const aDate = new Date(a.attributes.updated || a.attributes.created || 0);
        const bDate = new Date(b.attributes.updated || b.attributes.created || 0);
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

module.exports = router;
