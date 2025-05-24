# akv-emulator
An Azure Key Vault emulator for local development

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

### Get Secret

#### Get the latest version of a secret by name

```
GET /secrets/:name
```

**Example:**
```
GET /secrets/mySecret
```

#### Get a specific version of a secret

```
GET /secrets/:name/:version
```

**Example:**
```
GET /secrets/mySecret/1
```

**Response:**
Returns the secret object as stored in memory (structure matches your JSON file).  
If not found, returns:
```json
{ "error": "Secret not found" }
```

---

## Structure

- `src/app.js` - Express app definition and secret API
- `src/server.js` - Server startup script
- `data/example-secrets.json` - Example secrets data file
- `package.json` - Project metadata and dependencies