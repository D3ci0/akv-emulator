const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Placeholder for additional routes
// app.use('/api/your-resource', require('./routes/yourResourceRoute'));

module.exports = app;