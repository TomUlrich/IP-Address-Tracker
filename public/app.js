'use strict';

async function getIPData(ip) {
  // Send request to Express server
  const response = await fetch(`/api/ipinfo?ip=${ip}`);  
  const data = await response.json();  
  console.log(data);  

  // Update UI with the fetched IP data
  document.querySelector('.ip-address').textContent = data.ip;
  document.querySelector('.location').textContent = `${data.location.city}, ${data.location.country}`;
  document.querySelector('.timezone').textContent = `UTC ${data.location.timezone}`;
  document.querySelector('.isp').textContent = data.isp;
}

// Call this function when user submits the form
getIPData('2003:f1:1710:559f:f8bd:5ac6:1290:398');  // #todo: Should be replaced with the user input value


// create map and set view
var map = L.map('map').setView([51.505, -0.09], 13);

// add openStreetMap tile layer to map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// #todo: set marker