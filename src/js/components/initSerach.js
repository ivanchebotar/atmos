export default function initSearch () {

  const DEFAULT_LOCATION = {
    name: "New York City",
    lat: 40.7128,
    lon: -74.0060,
  };
  
  const weatherIcons = {
    0: '☀️', // Clear sky
    1: '🌤️', // Mainly clear
    2: '⛅', // Partly cloudy
    3: '☁️', // Overcast
    45: '🌫️', // Fog
    48: '🌫️', // Depositing rime fog
    51: '🌦️', // Drizzle
    61: '🌧️', // Rain
    71: '❄️', // Snow
    // Add more mappings based on Open-Meteo weather codes
  };
  
  const searchInput = document.getElementById('search-field');
  const searchResults = document.getElementById('search-results');
  const weatherInfo = document.getElementById('weather-info');
  
  // Open-Meteo API Base URL
  const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
  
  // Geocoding API for getting latitude and longitude (e.g., Nominatim OpenStreetMap)
  const GEOCODING_URL = 'https://nominatim.openstreetmap.org/search';
  
  // Fetch location coordinates
  async function fetchCoordinates(location) {
    try {
      const response = await fetch(`${GEOCODING_URL}?q=${location}&format=json&limit=5`);
      const data = await response.json();
      return data.map(item => ({
        name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      }));
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return [];
    }
  }
  
  // Fetch weather data
  async function fetchWeather(lat, lon) {
    const url = `${API_BASE_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm&timezone=auto`;
    console.log("Request URL:", url); // Log the URL being requested
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      if (!data.current_weather) {
        throw new Error('Weather data is incomplete');
      }
      return data.current_weather;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Sorry, we couldn't fetch weather data at this time.");
    }
  }
  
  // Get user location
  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          displayWeatherByCoordinates(lat, lon);
        },
        error => {
          console.error("Geolocation error:", error.message);
          loadDefaultWeather();
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      loadDefaultWeather();
    }
  }
  
  // Display weather information by coordinates
  async function displayWeatherByCoordinates(lat, lon) {
    try {
      const weather = await fetchWeather(lat, lon);
      const locationName = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
      const icon = weatherIcons[weather.weathercode] || '❓';
  
      weatherInfo.innerHTML = `
        <h2 class="weather__title">${locationName}</h2>
        <div class="weather__img">
          <span>${icon}</span>
        </div>
        <div class="weather__description">
          <p class="weather__description-temp"> ${weather.temperature} °C</p>
          <p class="weather__description-txt"><strong>Wind Speed:</strong> ${weather.windspeed} km/h</p>
          <p class="weather__description-txt"><strong>Wind Direction:</strong> ${weather.winddirection}°</p>
          <p class="weather__description-txt"><strong>Precipitation:</strong> ${weather.precipitation} mm</p>
          <p class="weather__description-txt"><strong>Humidity:</strong> ${weather.humidity || 'N/A'}%</p>
          <p class="weather__description-txt"><strong>Pressure:</strong> ${weather.pressure || 'N/A'} hPa</p>
          <p class="weather__description-txt"><strong>Time:</strong> ${weather.time}</p>
        </div>
      `;
    } catch (error) {
      console.error("Error fetching or displaying weather:", error);
      alert("Sorry, we couldn't display the weather data.");
    }
  }
  
  // Render search results
  function renderSearchResults(locations) {
    searchResults.innerHTML = ''; // Clear previous results
  
    if (locations.length === 0) {
      const noResults = document.createElement('li');
      noResults.textContent = 'No Results';
      noResults.classList.add('search-block__list-item', 'no-results');
      searchResults.appendChild(noResults);
      return;
    }
  
    locations.forEach(location => {
      const li = document.createElement('li');
      li.textContent = location.name;
      li.classList.add('search-block__list-item');
      li.addEventListener('click', () => {
        displayWeather(location);
        searchResults.innerHTML = ''; // Hide the list after selection
      });
      searchResults.appendChild(li);
    });
  }
  
  // Display weather for selected location
  async function displayWeather(location) {
    try {
      const weather = await fetchWeather(location.lat, location.lon);
      weatherInfo.innerHTML = `
        <h2 class="weather__title">${location.name}</h2>
        <div class="weather__img">
          <span>${weatherIcons[weather.weathercode] || '❓'}</span>
        </div>
        <div class="weather__description">
          <p class="weather__description-temp"> ${weather.temperature} °C</p>
          <p class="weather__description-txt"><strong>Wind Speed:</strong> ${weather.windspeed} km/h</p>
          <p class="weather__description-txt"><strong>Wind Direction:</strong> ${weather.winddirection}°</p>
          <p class="weather__description-txt"><strong>Precipitation:</strong> ${weather.precipitation} mm</p>
          <p class="weather__description-txt"><strong>Humidity:</strong> ${weather.humidity || 'N/A'}%</p>
          <p class="weather__description-txt"><strong>Pressure:</strong> ${weather.pressure || 'N/A'} hPa</p>
          <p class="weather__description-txt"><strong>Time:</strong> ${weather.time}</p>
        </div>
      `;
    } catch (error) {
      console.error("Error fetching weather data for selected location:", error);
      alert("Sorry, we couldn't fetch weather data for this location.");
    }
  }

// Fetch weather data for the current weather and next three days
async function fetchWeather(lat, lon) {
  const url = `${API_BASE_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&temperature_unit=celsius&timezone=auto`;
  console.log("Request URL:", url); // Log the URL being requested

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();
    if (!data.current_weather || !data.daily) {
      throw new Error('Weather data is incomplete');
    }
    return {
      current: data.current_weather,
      daily: data.daily,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Sorry, we couldn't fetch weather data at this time.");
  }
}

  // Display weather information by coordinates with a 3-day forecast
  async function displayWeatherByCoordinates(lat, lon) {
    try {
      const { current, daily } = await fetchWeather(lat, lon);
      const locationName = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
      const icon = weatherIcons[current.weathercode] || '❓';

      // Display current weather
      weatherInfo.innerHTML = `
        <h2 class="weather__title">${locationName}</h2>
        <div class="weather__img">
          <span>${icon}</span>
        </div>
        <div class="weather__description">
          <p class="weather__description-temp"> ${current.temperature} °C</p>
          <p class="weather__description-txt"><strong>Wind Speed:</strong> ${current.windspeed} km/h</p>
          <p class="weather__description-txt"><strong>Wind Direction:</strong> ${current.winddirection}°</p>
          <p class="weather__description-txt"><strong>Precipitation:</strong> ${current.precipitation} mm</p>
          <p class="weather__description-txt"><strong>Time:</strong> ${current.time}</p>
        </div>
        <h3>3-Day Forecast</h3>
        <div class="weather__forecast">
          ${daily.time.slice(1, 4).map((date, index) => `
            <div class="weather__forecast-day">
              <p><strong>${date}</strong></p>
              <p>Max Temp: ${daily.temperature_2m_max[index + 1]} °C</p>
              <p>Min Temp: ${daily.temperature_2m_min[index + 1]} °C</p>
              <p>Precipitation: ${daily.precipitation_sum[index + 1]} mm</p>
            </div>
          `).join('')}
        </div>
      `;
    } catch (error) {
      console.error("Error fetching or displaying weather:", error);
      alert("Sorry, we couldn't display the weather data.");
    }
  }

  
  // Search for locations
  searchInput.addEventListener('input', async (event) => {
    const query = event.target.value.trim();
    if (query.length > 2) {
      const locations = await fetchCoordinates(query);
      renderSearchResults(locations);
    } else {
      searchResults.innerHTML = ''; // Clear results if input is short
    }
  });
  
  // Hide results when clicking outside the search area
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-block')) {
      searchResults.innerHTML = ''; // Clear results when clicking outside
    }
  });
  
  // Load weather for the default location
  function loadDefaultWeather() {
    displayWeatherByCoordinates(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
  }
  
  // Load weather on page load
  window.onload = function () {
    getUserLocation(); // Try to fetch the user's location
  };
};