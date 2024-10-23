'use strict';

const searchInput = document.getElementById('search-input');
const searchButton = document.querySelector('.search-button');

searchButton.addEventListener('click', (e) => {
  e.preventDefault();
  const ipAddress = searchInput.value;
  getIPData(ipAddress); 
})

async function getIPData(ip) {
  // Send request to Express server
  const response = await fetch(`/api/ipinfo?ip=${ip}`);
  const data = await response.json();
  console.log(data);

  // Update UI with the fetched IP data
  document.querySelector('.ip-address').textContent = data.ip;
  document.querySelector('.location').textContent = `${data.location.city}, ${data.location.country}, ${data.location.region}`;
  document.querySelector('.timezone').textContent = `UTC ${data.location.timezone}`;
  document.querySelector('.isp').textContent = data.isp;

  // update map with lat & lng
  map.setView([data.location.lat, data.location.lng], 13);
}

// create map and set view
var map = L.map('map').setView([51.505, -0.09], 13);
// #todo: set view to the user's location

// add openStreetMap tile layer to map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// #todo: set marker
