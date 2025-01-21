// CSS imports
import '../styles/style.scss';

// JS imports
import $ from 'jquery';
import ready, { HTML } from './utils';
import initTabs from './components/initTabs';

ready(() => {
  HTML.classList.add('is-loaded');

  initTabs();
});


$(document).ready(function () {
  const apiBase = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m";

  // Predefined locations
  const locations = [
    { name: "Berlin", latitude: 52.52, longitude: 13.41 },
    { name: "London", latitude: 51.51, longitude: -0.13 },
    { name: "New York", latitude: 40.71, longitude: -74.01 },
    { name: "Tokyo", latitude: 35.68, longitude: 139.76 },
    { name: "Paris", latitude: 48.86, longitude: 2.35 },
    { name: "Sydney", latitude: -33.87, longitude: 151.21 },
  ];

  // Handle input in search field
  $("#search-field").on("input", function () {
    const query = $(this).val().toLowerCase();
    const resultList = $("#search-results");
    const weatherInfo = $("#weather-info");

    if (query === "") {
      resultList.empty(); // Clear results if input is empty
      weatherInfo.empty();
      return;
    }

    const matches = locations.filter(loc => loc.name.toLowerCase().includes(query));
    resultList.empty();
    matches.forEach(match => {
      resultList.append(`<li data-lat="${match.latitude}" data-lon="${match.longitude}">${match.name}</li>`);
    });
  });

  // Handle location click from search results
  $("#search-results").on("click", "li", function () {
    const latitude = $(this).data("lat");
    const longitude = $(this).data("lon");
    const locationName = $(this).text();
    console.log(`Location selected: ${locationName}`);
    fetchWeather(latitude, longitude, locationName); // Fetch weather on click
  });

  // Fetch weather data from API
  function fetchWeather(lat, lon, locationName) {
    const weatherApi = "https://api.open-meteo.com/v1/forecast";
    $.getJSON(`${weatherApi}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,humidity_2m,windspeed_10m,weathercode`)
      .done(function (data) {
        // Fetch additional weather data
        const temperature = data.hourly.temperature_2m[0];
        const humidity = data.hourly.humidity_2m[0];
        const windSpeed = data.hourly.windspeed_10m[0];
        const weatherCode = data.hourly.weathercode[0]; // Weather condition code

        // Translate weather code to a readable condition
        const weatherCondition = translateWeatherCode(weatherCode);

        // Display the weather info
        displayWeather(locationName, temperature, humidity, windSpeed, weatherCondition);
      })
      .fail(function (error) {
        console.error("Error fetching weather data:", error);
      });
  }

  // Display weather info
  function displayWeather(locationName, temperature, humidity, windSpeed, weatherCondition) {
    // Debugging step: Check what's being passed
    console.log(`Displaying weather for ${locationName}: Temperature: ${temperature}°C, Humidity: ${humidity}%, Wind Speed: ${windSpeed} km/h, Condition: ${weatherCondition}`);
    
    // Check if the #weather-info element exists and is available to update
    if ($("#weather-info").length) {
      $("#weather-info").html(`
        <h2>${locationName}</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} km/h</p>
        <p>Condition: ${weatherCondition}</p>
        <img src="https://via.placeholder.com/100" alt="Weather Icon" />
      `);
    } else {
      console.error("Error: #weather-info element not found.");
    }
  }

  // Weather codes translation
  function translateWeatherCode(code) {
    const conditions = {
      0: "Clear",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Heavy drizzle",
      56: "Freezing drizzle",
      57: "Heavy freezing drizzle",
      61: "Light rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Freezing rain",
      67: "Heavy freezing rain",
      71: "Light snow",
      73: "Moderate snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Light rain showers",
      81: "Moderate rain showers",
      82: "Heavy rain showers",
      85: "Light snow showers",
      86: "Heavy snow showers",
    };
    return conditions[code] || "Unknown";
  }
});

