'use strict';

// Import express and dotenv
const express = require('express');
require('dotenv').config();

const apiKey = process.env.API_KEY;

// create express app
const app = express();

// use the express.static middleware function to serve static files from '/public'
app.use(express.static('public'));

// Create a route for IP data fetching
app.get('/api/ipinfo', async (req, res) => {
  const ip = req.query.ip; // Get the IP address from the client request
  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ip}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data); // Send the API response back to the client
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch IP data' });
  }
});

// Listen on port 3000
app.listen(3000, () => console.log('listening at 3000'));
