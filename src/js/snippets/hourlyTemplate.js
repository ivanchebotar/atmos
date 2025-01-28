export function createHourlyHTML(weatherData, weatherIcons) {
  let hourlyHTML = '<div class="card card--grid card--grid-alt bg--primary"><h3>24-Hour Forecast</h3><ul class="card__content card__content--alt">';
  const hourlyData = weatherData.hourly;
  
  for (let i = 0; i < 6; i++) {
    const time = hourlyData.time[i];
    const temperature = hourlyData.temperature_2m[i];
    const iconCode = hourlyData.weathercode[i];
    const icon = weatherIcons[iconCode] || '❓';
  
    hourlyHTML += `
      <li>
        <p>${time.split('T')[1]}</p>
        <img src="${icon}" alt="Weather icon" />
        <p>${temperature}°</p>
      </li>`;
  }

  hourlyHTML += '</ul></div>';
  return hourlyHTML;
}
