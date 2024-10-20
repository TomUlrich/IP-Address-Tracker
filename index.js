'use strict';

// import express module
const express = require('express');

// import dotenv module
require('dotenv').config();

const apiKey = process.env.API_KEY;
console.log(apiKey);

// create web app
const app = express();

// listen to port 3000
app.listen(3000, () => console.log('listening at 3000'));

// use the express.static middleware function to serve static files located in '/public'
app.use(express.static('public'));

