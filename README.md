# akv-emulator
A lightweight **Node.js emulator** for Azure Key Vault that supports a limited set of APIs for secrets and certificates. Designed for local development and testing of client applications that integrate with Azure Key Vault.

## Features

- ✅ `GET /secrets/:name`
- ✅ `GET /secrets/:name/:version`
- ✅ `GET /certificates/:name/versions`
- ✅ `GET /certificates/:name/:version`

Supports both **HTTP** and **HTTPS** endpoints.

## 🔧 Configuration

| Env Variable       | Description                                            | Default |
|--------------------|--------------------------------------------------------|---------|
| `HTTP_PORT`        | Port for HTTP server                                   | `3000`  |
| `HTTPS_PORT`       | Port for HTTPS server                                  | `3443`  |
| `SSL_CERT_DIR`     | Path to directory containing `cert.pem` and `key.pem`  |         |
| `SECRETS_DIR`      | Directory with secret data (optional)                  |         |
| `CERTIFICATES_DIR` | Directory with certificate data (optional)             |         |

> ⚠️ HTTPS will only be enabled if both `cert.pem` and `key.pem` are present in the specified `SSL_CERT_DIR`.

## ⚠️ Notes

- This emulator does **not implement authentication** — it's intended for **development/testing only**.
- The data returned is **mocked or static**.
- When using HTTPS, make sure your **client trusts the self-signed certificate**.

## 🧪 Injecting Mock Data

You can provide test secrets and certificates by placing the following files inside the directory specified by `CERTIFICATES_DIR` (or `SECRETS_DIR`, if set differently):

- `test-secrets.json` — defines mock secrets
- `test-certificates.json` — defines mock certificates

These files should be valid JSON and are automatically loaded at startup. 

### Example `test-certificates.json`
```json
[
   {
      "cer": "MIIFDzCCAvegAwIBAgIUDFJ5...",
      "keyId": "https://myvault.vault.azure.net/keys/my-cert/v1",
      "secretId": "https://myvault.vault.azure.net/secrets/my-cert/v1",
      "properties": {
         "vaultUrl": "https://myvault.vault.azure.net/",
         "version": "v1",
         "name": "my-cert",
         "enabled": true,
         "notBefore": "2023-01-01T00:00:00Z",
         "expiresOn": "2024-01-01T00:00:00Z",
         "createdOn": "2023-01-01T00:00:00Z",
         "updatedOn": "2023-06-01T00:00:00Z",
         "recoveryLevel": "Recoverable+Purgeable",
         "id": "my-cert-v1",
         "tags": { "env": "prod" },
         "x509Thumbprint": "abc123",
         "recoverableDays": 90
      }
   }
]
```
### Example `test-secrets.json`

```json
[
   {
      "value": "mySecretValue",
      "properties": {
         "id": "123",
         "version": "1",
         "enabled": true,
         "notBefore": "2024-06-01T00:00:00Z",
         "expiresOn": "2025-06-01T00:00:00Z",
         "createdOn": "2024-06-01T00:00:00Z",
         "updatedOn": "2024-06-01T00:00:00Z",
         "name": "mySecret",
         "recoveryLevel": "Recoverable",
         "contentType": "text/plain",
         "tags": { "env": "prod" },
         "keyId": "key-abc",
         "managed": false,
         "recoverableDays": 30
      }
   }
]
```

## 🛠️ Generate `key.pem`, `cert.pem`, and `keystore.jks`

You can generate your development TLS certificates and keystore using OpenSSL and Java `keytool`.

### 1. Generate a self-signed certificate

```bash
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout key.pem -out cert.pem \
  -days 365 -subj "/CN=akv-emulator"
```

This creates:

- key.pem — private key

- cert.pem — self-signed certificate
### 2. Convert PEM to PKCS12 format
```bash
openssl pkcs12 -export \
-in cert.pem -inkey key.pem \
-out keystore.p12 \
-name akv-emulator \
-password pass:changeit
```
### 3. Import into a Java Keystore (.jks)
```bash
keytool -importkeystore \
  -deststorepass changeit \
  -destkeypass changeit \
  -destkeystore keystore.jks \
  -srckeystore keystore.p12 \
  -srcstoretype PKCS12 \
  -srcstorepass changeit \
  -alias akv-emulator

```

## 🐳 Docker Compose

This application is designed to be used as part of a Docker Compose setup, 
the emulator is available as a Docker image: [`decioc/akv-emulator`](https://hub.docker.com/r/decioc/akv-emulator)

You can use it directly in your `docker-compose.yml`. Example:
```yaml
version: '3.8'

services:
  akv-client:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: akv-client
    ports:
      - "8080:8080"
    volumes:
      - ./certs:/certs:ro
    entrypoint:
      - java
      - -Djavax.net.ssl.trustStore=/certs/keystore.jks
      - -Djavax.net.ssl.trustStorePassword=changeit
      - -cp
      - target/classes:target/dependency/*
      - org.akv.emulator.Main

  akv-emulator:
    image: decioc/akv-emulator
    container_name: akv-emulator
    expose:
      - 3000
      - 3443
    volumes:
      - ./certs:/certs:ro
      - ./data:/data:ro
    environment:
      - SSL_CERT_DIR=/certs
      - HTTP_PORT=3000
      - HTTPS_PORT=3443
      - SECRETS_DIR=/data
      - CERTIFICATES_DIR=/data
    ports:
      - "3000:3000"
      - "3443:3443"
```
The client in this example is a Java application.