import { defineStore } from 'pinia'

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    currentWeather: null,
    forecast: null,
    alerts: [],
    favorites: [],
    isLoading: false,
    error: null
  }),
  
  actions: {
    setCurrentWeather(weather) {
      this.currentWeather = weather
    },
    
    setForecast(forecast) {
      this.forecast = forecast
    },
    
    setAlerts(alerts) {
      this.alerts = alerts
    },
    
    addFavorite(location) {
      // Check if location already exists in favorites
      const exists = this.favorites.some(fav => fav.id === location.id)
      if (!exists) {
        this.favorites.push(location)
        // Save to localStorage
        this.saveFavorites()
      }
    },
    
    removeFavorite(locationId) {
      this.favorites = this.favorites.filter(fav => fav.id !== locationId)
      // Save to localStorage
      this.saveFavorites()
    },
    
    // Load favorites from localStorage
    loadFavorites() {
      const savedFavorites = localStorage.getItem('weatherFavorites')
      if (savedFavorites) {
        this.favorites = JSON.parse(savedFavorites)
      }
    },
    
    // Save favorites to localStorage
    saveFavorites() {
      localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites))
    },
    
    setLoading(loading) {
      this.isLoading = loading
    },
    
    setError(error) {
      this.error = error
    }
  },
  
  getters: {
    getCurrentWeather: (state) => state.currentWeather,
    getForecast: (state) => state.forecast,
    getAlerts: (state) => state.alerts,
    getFavorites: (state) => state.favorites,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
    
    // Check if a location is in favorites
    isFavorite: (state) => (locationId) => {
      return state.favorites.some(fav => fav.id === locationId)
    }
  }
})