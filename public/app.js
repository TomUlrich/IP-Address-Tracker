'use strict';

// Create map and set default view
var map = L.map('map');

// #todo: If user's IP can't be fetched when DOMContentLoaded, set Initial view to a default location
// map.setView([51.505, -0.09], 13); 

// Add OpenStreetMap tile layer to the map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Encapsulate currentMarker in the createMapMarkerUpdater function
function createMapMarkerUpdater(map) {
  let currentMarker = null; // Private variable inside the closure

  // Return a function (getIPData) that has access to currentMarker
  return async function updateMapWithIPData(ip) {
    try {
      const response = await fetch(`/api/ipinfo?ip=${ip}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch IP data: ${response.statusText}`);
      }
      const data = await response.json();

      // Update UI with fetched IP data
      document.querySelector('.ip-address').textContent = data.ip;
      document.querySelector('.location').textContent = `${data.location.city}, ${data.location.region} (${data.location.country})`;
      document.querySelector('.timezone').textContent = `UTC ${data.location.timezone}`;
      document.querySelector('.isp').textContent = data.isp;

      // Update map with lat & lng
      map.setView([data.location.lat, data.location.lng], 13);

      // Clear the previous marker if it exists
      if (currentMarker) {
        currentMarker.remove(); // Safely remove the old marker
      }

      // Add a new marker for the IP address location
      currentMarker = L.marker([data.location.lat, data.location.lng]).addTo(map);
    } catch (error) {
      console.error('Error fetching IP data:', error);
      alert('Failed to fetch IP data. Please try again later.');
    }
  };
}

// Create the updateMapWithIPData function with encapsulated currentMarker
const updateMapWithIPData = createMapMarkerUpdater(map);

// Add event listener for search button to call updateMapWithIPData
const searchInput = document.getElementById('search-input');
const searchButton = document.querySelector('.search-button');

searchButton.addEventListener('click', (e) => {
  e.preventDefault(); // Prevent form submission
  const ipAddress = searchInput.value; // Get the entered IP address
  updateMapWithIPData(ipAddress); // Call the encapsulated updateMapWithIPData function
});

// Automatically fetch and display the user's IP on page load
document.addEventListener('DOMContentLoaded', () => {
  fetch('https://api.ipify.org?format=json')
    .then((response) => response.json())
    .then((data) => {
      const userIP = data.ip; // Get the user's IP address
      updateMapWithIPData(userIP); // Call updateMapWithIPData to update the map and UI
    })
// #todo: If user's IP can't be fetched when DOMContentLoaded, set Initial view to a default location
    .catch((error) => {
// #todo: How can I test for error cases?
      console.error('Error fetching user IP:', error);
      alert('Failed to get your IP address.');
    });
});
