const express = require('express');
const router = express.Router();

/**
 * GET /certificates/:name/versions
 * Mimics Azure Key Vault's listPropertiesOfCertificateVersions API
 */
router.get('/:name/versions', (req, res) => {
    const { name } = req.params;
    const keyVaultCertificates = req.app.locals.keyVaultCertificates || [];
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

    res.json({
        value: versions
    });
});

/**
 * GET /certificates/:name/:version
 * Mimics Azure Key Vault's getCertificateVersion API.
 */
router.get('/:name/:version', (req, res) => {
    const { name, version } = req.params;
    const keyVaultCertificates = req.app.locals.keyVaultCertificates || [];

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

module.exports = router;