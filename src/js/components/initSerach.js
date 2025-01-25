import icon0 from '../../assets/images/icon-00.svg';
import icon1 from '../../assets/images/icon-01.svg';
import icon2 from '../../assets/images/icon-02.svg';
import icon3 from '../../assets/images/icon-03.svg';
import icon45 from '../../assets/images/icon-45.svg';
import icon48 from '../../assets/images/icon-48.svg';
import icon53 from '../../assets/images/icon-53.svg';
import icon55 from '../../assets/images/icon-55.svg';
import icon56 from '../../assets/images/icon-56.svg';
import icon61 from '../../assets/images/icon-61.svg';
import icon65 from '../../assets/images/icon-65.svg';
import icon71 from '../../assets/images/icon-71.svg';
import icon73 from '../../assets/images/icon-73.svg';
import icon75 from '../../assets/images/icon-75.svg';
import icon95 from '../../assets/images/icon-95.svg';


export default function initSearch () {

  const DEFAULT_LOCATION = {
    name: "New York City",
    lat: 40.7128,
    lon: -74.0060,
  };
  
  const weatherIcons = {
    0: icon0, // Clear sky
    1: icon1, // Mainly clear
    2: icon2, // Partly cloudy
    3: icon3, // Overcast
    45: icon45, // Fog
    48: icon48, // Depositing rime fog
    51: icon48, // Drizzle
    53: icon53, // Light rain
    55: icon55, // Moderate rain
    56: icon56, // Freezing drizzle
    57: icon56, // Freezing rain
    61: icon61, // Showers of rain
    63: icon61, // Heavy showers of rain
    65: icon65, // Thunderstorms
    66: icon65, // Freezing thunderstorms
    67: icon65, // Heavy freezing thunderstorms
    71: icon71, // Snow
    73: icon73, // Light snow showers
    75: icon75, // Moderate snow showers
    77: icon75, // Snow grains
    80: icon75, // Showers of snow
    81: icon75, // Heavy snow showers
    82: icon75, // Snow storms
    85: icon75, // Ice pellets
    86: icon75, // Heavy ice pellets
    95: icon95, // Thunderstorms with light rain
    96: icon95, // Thunderstorms with heavy rain
    99: icon95, // Thunderstorms with hail
  };
  
  
  const searchInput = document.getElementById('search-field');
  const searchResults = document.getElementById('search-results');
  const weatherInfo = document.getElementById('weather-info');
  
  const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
  const GEOCODING_URL = 'https://nominatim.openstreetmap.org/search';
  const REVERSE_GEOCODING_URL = 'https://nominatim.openstreetmap.org/reverse';

  // Date format
  function formatDateToDay(dateString) {
    const date = new Date(dateString);
    const today = new Date();
  
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    // Если дата — это сегодняшний день
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
  
    // Если дата — завтрашний день
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
  
    // Возвращаем название дня недели
    return dayNames[date.getDay()];
  }
  
  // Fetch city name by coordinates
  async function fetchCityName(lat, lon) {
    try {
      const response = await fetch(`${REVERSE_GEOCODING_URL}?lat=${lat}&lon=${lon}&format=json`);
      const data = await response.json();
      return data.address.city || data.address.town || data.address.village || 'Unknown Location';
    } catch (error) {
      console.error("Error fetching city name:", error);
      return "Unknown Location";
    }
  }
  
  // Fetch weather data (current and 3-day forecast)
  async function fetchWeather(lat, lon) {
    const url = `${API_BASE_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_min,temperature_2m_max,weathercode,precipitation_sum,sunrise,sunset&hourly=temperature_2m,weathercode,relative_humidity_2m,pressure_msl,uv_index&temperature_unit=celsius&timezone=auto`;


    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch weather data');
      return await response.json();
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null;
    }
  }
  
  // Display weather information
  async function displayWeatherByCoordinates(lat, lon) {
    try {
      const cityName = await fetchCityName(lat, lon);
      const weatherData = await fetchWeather(lat, lon);
      if (!weatherData) throw new Error('Weather data not available');
  
      const currentWeather = weatherData.current_weather;
      const forecast = weatherData.daily;
      const forecastHourly = weatherData.hourly;
  
      const currentIcon = weatherIcons[currentWeather.weathercode] || 'assets/icons/icon-00.svg';
      const humidity = weatherData.hourly.relative_humidity_2m[0];
      const uvIndex = weatherData.hourly.uv_index[0];
      const sunrise = forecast.sunrise[0];
      const sunset = forecast.sunset[0];
  
      let forecastHTML = '<div class="card card--strip bg--primary"><h4>7-Day Forecast</h4><ul>';
      for (let i = 0; i < 7; i++) {
        const date = forecast.time[i];
        const minTemp = forecast.temperature_2m_min[i];
        const maxTemp = forecast.temperature_2m_max[i];
        const icon = weatherIcons[forecast.weathercode[i]] || '❓';
        const dayName = formatDateToDay(date);
        forecastHTML += `
          <li>
            <p>${dayName}</p>
            <img src="${icon}" alt="Weather icon" />
            <p><strong>${maxTemp}</strong>/${minTemp}</p>
          </li>`;
      }
      forecastHTML += '</ul></div>';

      let hourlyHTML = '<div class="card bg--primary"><h4>24-Hour Forecast</h4>';
      const hourlyData = weatherData.hourly;

      for (let i = 0; i < 6; i++) { // Прогноз на 24 часа
        const time = hourlyData.time[i];
        const temperature = hourlyData.temperature_2m[i];
        const iconCode = hourlyData.weathercode[i];
        const icon = weatherIcons[iconCode] || '❓';

        hourlyHTML += `
          <div class="hourly-forecast">
            <p>${time.split('T')[1]}</p>
            <img src="${icon}" alt="Weather icon" />
            <p>${temperature}°</p>
          </div>`;
      }

      hourlyHTML += '</div>';
  
      weatherInfo.innerHTML = `
        <div class="card">
          <div class="card__header">
            <div class="card__header-description">
              <h1 class="card__header-title">${cityName}</h1>
              <h2 class="card__header-txt">${currentWeather.temperature}°</h2>
            </div>
            <div class="card__header-img">
              <img src="${currentIcon}" alt="Weather icon" />
            </div>
          </div>
          ${hourlyHTML}
          <div class="card__description bg--primary">
            <h4>Air condition</h4>
            <ul>
              <li><p class="card__description-txt">humidity <strong>${humidity}%</strong></p></li>
              <li><p class="card__description-txt">uv <strong>${uvIndex}</strong></p></li>
              <li><p class="card__description-txt">sunrise <strong>${sunrise.split("T")[1]}</strong></p></li>
              <li><p class="card__description-txt">sunset <strong>${sunset.split("T")[1]}</strong></p></li>
              <li><p class="card__description-txt">wind speed <strong>${currentWeather.windspeed} km/h</strong></p></li>
              <li><p class="card__description-txt">wind direction <strong>${currentWeather.winddirection}°</strong></p></li>
            </ul>
          </div>
        </div>
          ${forecastHTML}
      `;
    } catch (error) {
      console.error("Error displaying weather data:", error);
      alert("Unable to display weather data.");
    }
  }
  
  // Display weather for searched location
  async function displayWeather(location) {
    await displayWeatherByCoordinates(location.lat, location.lon);
  }
  
  // Handle user location
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
      console.error("Geolocation not supported.");
      loadDefaultWeather();
    }
  }
  
  // Load weather for default location
  function loadDefaultWeather() {
    displayWeatherByCoordinates(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
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
  
  // Hide search results on outside click
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-block')) {
      searchResults.innerHTML = '';
    }
  });
  
  // Initialize weather on page load
  window.onload = function () {
    getUserLocation();
  };

  // Fetch coordinates for a given query (Geocoding)
  async function fetchCoordinates(query) {
    try {
      const response = await fetch(`${GEOCODING_URL}?q=${encodeURIComponent(query)}&format=json&limit=5`);
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

  // Render search results in the dropdown
  function renderSearchResults(locations) {
    searchResults.innerHTML = ''; // Clear previous results

    if (locations.length === 0) {
      searchResults.innerHTML = '<li class="search-block__item">No results found</li>';
      return;
    }

    locations.forEach(location => {
      const li = document.createElement('li');
      li.classList.add('search-block__item');
      li.textContent = location.name;
      li.addEventListener('click', () => {
        displayWeather(location); // Display weather for selected location
        searchResults.innerHTML = ''; // Clear search results
        searchInput.value = ''; // Clear search input
      });
      searchResults.appendChild(li);
    });
  }

};