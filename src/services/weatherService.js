import axios from 'axios'

// Use environment variable for API key
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'YOUR_API_KEY'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Debug logging for API key
console.log('API Key:', API_KEY)
console.log('Environment variables:', import.meta.env)

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    appid: API_KEY,
    units: 'metric'
  }
})

// Check if API key is set
if (API_KEY === 'YOUR_API_KEY' || !API_KEY) {
  console.warn('Weather API key not set. Please add VITE_WEATHER_API_KEY to your .env file.')
}

export default {
  // Get current weather by city name
  getCurrentWeather(city) {
    // Check if API key is valid before making request
    if (API_KEY === 'YOUR_API_KEY' || !API_KEY) {
      return Promise.reject(new Error('API key not configured. Please add your FREE OpenWeatherMap API key to your .env file. Get it at https://openweathermap.org/api - no credit card required.'))
    }
    
    return apiClient.get('/weather', {
      params: {
        q: city
      }
    })
  },
  
  // Get current weather by coordinates
  getCurrentWeatherByCoords(lat, lon) {
    // Check if API key is valid before making request
    if (API_KEY === 'YOUR_API_KEY' || !API_KEY) {
      return Promise.reject(new Error('API key not configured. Please add your FREE OpenWeatherMap API key to your .env file. Get it at https://openweathermap.org/api - no credit card required.'))
    }
    
    return apiClient.get('/weather', {
      params: {
        lat,
        lon
      }
    })
  },
  
  // Get 5-day forecast
  getForecast(city) {
    // Check if API key is valid before making request
    if (API_KEY === 'YOUR_API_KEY' || !API_KEY) {
      return Promise.reject(new Error('API key not configured. Please add your FREE OpenWeatherMap API key to your .env file. Get it at https://openweathermap.org/api - no credit card required.'))
    }
    
    return apiClient.get('/forecast', {
      params: {
        q: city
      }
    })
  },
  
  // Get forecast by coordinates
  getForecastByCoords(lat, lon) {
    // Check if API key is valid before making request
    if (API_KEY === 'YOUR_API_KEY' || !API_KEY) {
      return Promise.reject(new Error('API key not configured. Please add your FREE OpenWeatherMap API key to your .env file. Get it at https://openweathermap.org/api - no credit card required.'))
    }
    
    return apiClient.get('/forecast', {
      params: {
        lat,
        lon
      }
    })
  },
  
  // Get weather data by city ID
  getWeatherById(id) {
    // Check if API key is valid before making request
    if (API_KEY === 'YOUR_API_KEY' || !API_KEY) {
      return Promise.reject(new Error('API key not configured. Please add your FREE OpenWeatherMap API key to your .env file. Get it at https://openweathermap.org/api - no credit card required.'))
    }
    
    return apiClient.get('/weather', {
      params: {
        id
      }
    })
  },
  
  // Get weather icons
  getWeatherIcon(iconCode, size = '2x') {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`
  }
}