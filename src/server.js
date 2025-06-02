const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const app = require('./app');

// Configuration
const HTTP_PORT = process.env.HTTP_PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// Load SSL certificate and key
const certDir = process.env.SSL_CERT_DIR || path.join(__dirname, '../certs');
const sslKeyPath = process.env.SSL_KEY_PATH || path.join(certDir, 'key.pem');
const sslCertPath = process.env.SSL_CERT_PATH || path.join(certDir, 'cert.pem');

let httpsOptions;
try {
  httpsOptions = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath),
  };
  // Start HTTPS server
  https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
    console.log(`HTTPS server listening on port ${HTTPS_PORT}`);
  });
} catch (err) {
  console.error('Failed to load SSL key/certificate:', err.message);
}

// Start HTTP server
http.createServer(app).listen(HTTP_PORT, () => {
  console.log(`HTTP server listening on port ${HTTP_PORT}`);
});
