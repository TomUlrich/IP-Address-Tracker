'use strict';

// 1. Map Initialization
var map = L.map('map');
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// 2. Core Function: Create IP Data Updater with Encapsulated Marker State
function createMapAndIPDataUpdater(map) {
  let currentMarker = null;

  return async function updateMapAndIPData(ip) {
    try {
      const response = await fetch(`/api/ipinfo?ip=${ip}`);
      if (!response.ok) throw new Error(`Failed to fetch IP data: ${response.statusText}`);
      const data = await response.json();

      // Update UI with IP data
      document.querySelector('.ip-address').textContent = data.ip;
      document.querySelector('.location').textContent = `${data.city}, ${data.region} (${data.country})`;
      document.querySelector('.timezone').textContent = `UTC ${data.timezone}`;
      document.querySelector('.isp').textContent = data.org;

      // Update map view and marker
      const [lat, lng] = data.loc.split(',');
      map.setView([lat, lng], 13);

      if (currentMarker) currentMarker.remove();
      currentMarker = L.marker([lat, lng]).addTo(map);
    } catch (error) {
      console.error('Error fetching IP data:', error);
      alert('Failed to fetch IP data. Check for correct input or try again later.');
    }
  };
}

// ## Initialize updateMapAndIPData function with access to encapsulated currentMarker
const updateMapAndIPData = createMapAndIPDataUpdater(map);

// 3. Helper Function: Handles the IP search functionality
function handleIPSearch() {
  const ipAddress = searchInput.value;
  updateMapAndIPData(ipAddress);
}

// 4. Event Listeners
const searchInput = document.getElementById('search-input');
const searchButton = document.querySelector('.search-button');

searchButton.addEventListener('click', (e) => {
  e.preventDefault();
  handleIPSearch();
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleIPSearch();
  }
});

// 5. Automatically fetch and display the user's IP data on page load
document.addEventListener('DOMContentLoaded', () => {
  fetch('https://ipinfo.io/json')
    .then((response) => response.json())
    .then((data) => {
      const userIP = data.ip;
      updateMapAndIPData(userIP);
    })
    .catch((error) => {
      console.error('Error fetching user IP:', error);
      alert('Failed to get your IP address.');
      map.setView([51.505, -0.09], 13); // Default fallback view
    });
});
