import { useEffect, useState } from "react";
import weatherService from "../services/weather";

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    weatherService
      .getWeather(
        country.capitalInfo.latlng[0],
        country.capitalInfo.latlng[1],
        "metric",
      )
      .then((data) => setWeather(data));
  }, [country]); // Runs after the first render and whenever the country prop changes

  return (
    <div>
      <h1>{country.name.common}</h1>
      <dl>
        <dt>Capital</dt>
        <dd>{country.capital}</dd>
        <dt>Area</dt>
        <dd>{country.area}</dd>
      </dl>
      <h2>Languages</h2>
      <ul>
        {Object.keys(country.languages).map((langCode) => (
          <li key={langCode}>{country.languages[langCode]}</li>
        ))}
      </ul>
      <img width={200} src={country.flags.svg} alt={country.flags.alt} />
      <h2>Weather in {country.capital}</h2>
      {weather && (
        <>
          <img
            src={`https://openweathermap.org/payload/api/media/file/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
          />
          <dl>
            <dt>Temperature</dt>
            <dd>{weather.main.temp} Celsius</dd>
            <dt>Wind</dt>
            <dd>{weather.wind.speed} m/s</dd>
          </dl>
        </>
      )}
    </div>
  );
};

export default Country;
