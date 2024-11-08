'use strict';

// 1. Dependencies
const express = require('express');
require('dotenv').config();

// 2. Configuration
const apiKey = process.env.IPINFO_API_TOKEN;
const port = process.env.PORT || 3000;

// 3. Create Express App
const app = express();

// 4. Middleware for Static Files
app.use(express.static('public'));

// 5. Route for IP Data Fetching
app.get('/api/ipinfo', async (req, res) => {
  const ip = req.query.ip;
  const url = `https://ipinfo.io/${ip}?token=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching IP data:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch IP data. Please check the IP format and try again.' });
  }
});

// 6. Start Server
app.listen(port, () => console.log(`Server is running on port ${port}`));
