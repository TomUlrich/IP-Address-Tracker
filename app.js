'use strict';

require('dotenv').config();

const apiKey = process.env.API_KEY;
console.log(apiKey);


// create map and set view
var map = L.map('map').setView([51.505, -0.09], 13);

// add openStreetMap tile layer to map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);