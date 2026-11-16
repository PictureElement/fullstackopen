import axios from "axios";
const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const getWeather = (lat, lon, units) => {
  const request = axios.get(BASE_URL, {
    params: {
      lat,
      lon,
      units,
      appid: API_KEY,
    },
  });
  return request.then((response) => response.data);
};

export default {
  getWeather,
};
