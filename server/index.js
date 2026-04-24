const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple health check - FIRST thing
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'OK' });
});

// Start immediately
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
