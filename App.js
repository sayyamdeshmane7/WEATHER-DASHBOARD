import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [popularCities, setPopularCities] = useState([]);
  const [loading, setLoading] = useState(false);

  // API key for OpenWeatherMap (replace with your own key)
  const API_KEY = 'acb0cbbc3e7dc45a9938a6c05fb28ffd';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  // Popular cities to display
  const defaultCities = [
    { name: 'Mumbai', country: 'IN' },
    { name: 'Delhi', country: 'IN' },
    { name: 'Bangalore', country: 'IN' },
    { name: 'Pune', country: 'IN' },
    { name: 'Nagpur', country: 'IN' },
    { name: 'New York', country: 'US' },
    { name: 'London', country: 'GB' },
    { name: 'Tokyo', country: 'JP' },
    { name: 'Sydney', country: 'AU' },
    { name: 'Dubai', country: 'AE' }
  ];

  useEffect(() => {
    // Fetch weather for default cities on initial load
    fetchPopularCitiesWeather();
  }, []);

  const fetchPopularCitiesWeather = async () => {
    try {
      setLoading(true);
      const promises = defaultCities.map(city => 
        axios.get(`${BASE_URL}?q=${city.name},${city.country}&appid=${API_KEY}&units=metric`)
      );
      
      const results = await Promise.all(promises);
      const citiesData = results.map(res => res.data);
      setPopularCities(citiesData);
    } catch (err) {
      console.error('Error fetching popular cities:', err);
    } finally {
      setLoading(false);
    }
  };
const fetchWeatherData = async (e) => {
  e.preventDefault();
  console.log("Attempting to fetch weather for:", city); // Add this
  
  try {
    setLoading(true);
    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    console.log("API URL:", url); // Add this
    
    const response = await axios.get(url);
    console.log("API Response:", response.data); // Add this
    
    setWeatherData(response.data);
  } catch (err) {
    console.error("API Error:", err.response); // Add this
    setError('City not found. Please try another location.');
  } finally {
    setLoading(false);
  }
};

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="weather-app">
      <header className="app-header">
        <h1>Weather Dashboard</h1>
        <form onSubmit={fetchWeatherData} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search for a city..."
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </header>

      <main>
        {weatherData && (
          <div className="current-weather">
            <h2>
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <div className="weather-main">
              <div className="weather-icon">
                <img
                  src={getWeatherIcon(weatherData.weather[0].icon)}
                  alt={weatherData.weather[0].description}
                />
                <p>{weatherData.weather[0].main}</p>
              </div>
              <div className="weather-details">
                <p className="temperature">{Math.round(weatherData.main.temp)}°C</p>
                <p>Feels like: {Math.round(weatherData.main.feels_like)}°C</p>
                <p>Humidity: {weatherData.main.humidity}%</p>
                <p>Wind: {weatherData.wind.speed} m/s</p>
                <p>Sunrise: {formatDate(weatherData.sys.sunrise)}</p>
                <p>Sunset: {formatDate(weatherData.sys.sunset)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="popular-cities">
          <h2>Popular Cities</h2>
          {loading && !weatherData ? (
            <p>Loading...</p>
          ) : (
            <div className="city-grid">
              {popularCities.map((cityData) => (
                <div key={`${cityData.name}-${cityData.sys.country}`} className="city-card">
                  <h3>
                    {cityData.name}, {cityData.sys.country}
                  </h3>
                  <div className="city-weather">
                    <img
                      src={getWeatherIcon(cityData.weather[0].icon)}
                      alt={cityData.weather[0].description}
                    />
                    <p>{Math.round(cityData.main.temp)}°C</p>
                  </div>
                  <p>{cityData.weather[0].main}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Weather Dashboard</p>
      </footer>
    </div>
  );
};

export default WeatherApp;
