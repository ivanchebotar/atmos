import { API_BASE_URL, GEOCODING_URL, REVERSE_GEOCODING_URL, DEFAULT_LOCATION } from "./../configs/origins";
import { weatherIcons } from "./../configs/icons";
import { createForecastHTML } from "../snippets/forecastTemplate";
import { createHourlyHTML } from "../snippets/hourlyTemplate";
// import { renderSearchResults } from "../plugins/serachResult";
import { initLoader } from './initLoader';


export default function initSearch () {
  const searchInput = document.getElementById('search-field');
  const searchResults = document.getElementById('search-results');
  const weatherInfo = document.getElementById('weather-info');
  const { showLoader, hideLoader } = initLoader();
  
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
    showLoader();
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

      const forecastHTML = createForecastHTML(forecast, weatherIcons);
      const hourlyHTML = createHourlyHTML(weatherData, weatherIcons);

      weatherInfo.innerHTML = `
        <div class="cards-holder">
          <div class="card card--flex">
            <div class="card__header-description">
              <h1 class="card__header-title">${cityName}</h1>
              <h2 class="card__header-txt">${currentWeather.temperature}°</h2>
            </div>
            <div class="card__header-img">
              <img src="${currentIcon}" alt="Weather icon" />
            </div>
          </div>
          ${hourlyHTML}
          <div class="card card--grid bg--primary">
            <h3>Air condition</h3>
            <ul class="card__content">
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
    } finally {
      hideLoader(); // Hide loader after data fetching
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