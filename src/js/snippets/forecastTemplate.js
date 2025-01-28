import { formatDateToDay } from "../plugins/formatDateToDay";

export function createForecastHTML(forecast, weatherIcons) {
  if (!forecast.time || !forecast.temperature_2m_min || !forecast.temperature_2m_max || forecast.time.length < 7) {
    console.error("Invalid forecast data");
    return '<p>Error loading forecast data.</p>';
  }

  let forecastHTML = '<div class="card card--strip bg--primary"><h3>7-Day Forecast</h3><ul>';

  for (let i = 0; i < 7; i++) {
    try {
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
    } catch (error) {
      console.error("Error processing forecast data:", error);
      forecastHTML += '<li>Error loading data for this day</li>';
    }
  }

  forecastHTML += '</ul></div>';
  return forecastHTML;
}
