const express = require('express');
const router = express.Router();

/**
 * GET /keys/:name
 * Mimics the API called by KeyClient.getKey(name) - returns the latest version of the key with the given name.
 */
router.get('/:name', (req, res) => {
    const keys = req.app.locals.keyVaultKeys || [];
    // Find all keys with the given name
    const matchingKeys = keys.filter(
        k => k.properties && k.properties.name === req.params.name
    );
    if (matchingKeys.length === 0) {
        return res.status(404).json({ error: 'Key not found' });
    }
    // Return the key with the most recent createdOn date
    const latestKey = matchingKeys.reduce((prev, curr) => {
        const prevDate = prev.properties && prev.properties.createdOn ? new Date(prev.properties.createdOn) : new Date(0);
        const currDate = curr.properties && curr.properties.createdOn ? new Date(curr.properties.createdOn) : new Date(0);
        return currDate > prevDate ? curr : prev;
    });
    res.json(latestKey.toJSON ? latestKey.toJSON() : latestKey);
});

/**
 * GET /keys/:name/:version
 * Mimics the API called by KeyClient.getKey(name, version) - returns the key with the given name and version.
 */
router.get('/:name/:version', (req, res) => {
    const keys = req.app.locals.keyVaultKeys || [];
    const key = keys.find(
        k =>
            k.properties &&
            k.properties.name === req.params.name &&
            k.properties.version === req.params.version
    );
    if (!key) {
        return res.status(404).json({ error: 'Key not found' });
    }
    res.json(key.toJSON ? key.toJSON() : key);
});

module.exports = router;