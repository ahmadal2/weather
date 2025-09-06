<template>
  <div class="weather-dashboard">
    <!-- Loading Page -->
    <ModernLoadingPage v-if="showLoadingPage" />
    
    <header class="header">
      <div class="header-top">
        <h1 class="title">{{ $t('weatherDashboard') }}</h1>
        <div class="language-switcher">
          <select v-model="selectedLanguage" @change="changeLanguage" class="language-select">
            <option value="en">{{ $t('language', {}, { locale: 'en' }) }}</option>
            <option value="ar">{{ $t('language', {}, { locale: 'ar' }) }}</option>
            <option value="de">{{ $t('language', {}, { locale: 'de' }) }}</option>
          </select>
        </div>
      </div>
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchLocation" 
          :placeholder="$t('searchForCity')" 
          @keyup.enter="searchWeather"
          class="search-input"
        />
        <button @click="searchWeather" class="search-button">{{ $t('search') }}</button>
        <button 
          v-if="weatherStore.currentWeather && !isFavoriteLocation" 
          @click="addToFavorites" 
          class="favorite-button"
          :title="$t('addToFavorites')"
        >
          ♡
        </button>
        <button 
          v-else-if="isFavoriteLocation" 
          @click="removeFromFavorites" 
          class="favorite-button active"
          :title="$t('removeFromFavorites')"
        >
          ♥
        </button>
      </div>
    </header>

    <main class="main-content">
      <div v-if="weatherStore.isLoading && !showLoadingPage" class="loading">
        <div class="spinner"></div>
        <p>{{ $t('loading') }}</p>
      </div>
      
      <div v-else-if="weatherStore.error" class="error">
        <div class="error-icon">⚠️</div>
        <p>{{ weatherStore.error }}</p>
        <div v-if="apiKeyError" class="api-key-error">
          <p><strong>{{ $t('freeTierInfo') }}</strong></p>
          <p>{{ $t('freeApiKeyInfo') }}</p>
          <ol>
            <li>{{ $t('apiKeyNotConfigured') }} <a href="https://openweathermap.org/api" target="_blank">OpenWeatherMap</a> ({{ $t('freeTierInfo') }})</li>
            <li>{{ $t('invalidApiKey') }} <code>.env</code> {{ $t('invalidApiKey') }}</li>
            <li>{{ $t('resetToDefaults') }}</li>
          </ol>
          <p class="free-tier-note">{{ $t('freeTierInfo') }}</p>
        </div>
      </div>
      
      <div v-else-if="weatherStore.currentWeather" class="weather-container">
        <CurrentWeather :weather="weatherStore.currentWeather" />
        <DailyForecast 
          v-if="forecastData.length > 0" 
          :forecast-data="forecastData"
        />
        
        <div class="sidebar">
          <ForecastChart 
            v-if="forecastData.length > 0" 
            :forecast-data="forecastData"
          />
          <FavoriteLocations @selectFavorite="selectFavoriteLocation" />
          <SettingsPanel />
        </div>
        
        <div class="alerts-container" v-if="weatherStore.alerts.length > 0">
          <h3>{{ $t('weatherAlerts') }}</h3>
          <WeatherAlert 
            v-for="alert in weatherStore.alerts" 
            :key="alert.id" 
            :alert="alert"
          />
        </div>
        
        <!-- Weather Map Component -->
        <WeatherMap 
          v-if="weatherStore.currentWeather"
          :lat="weatherStore.currentWeather.coord.lat"
          :lon="weatherStore.currentWeather.coord.lon"
          :zoom="10"
        />
      </div>
      
      <div v-else class="welcome-message">
        <div class="welcome-icon">🌤️</div>
        <h2>{{ $t('welcomeMessage') }}</h2>
        <p>{{ $t('searchToGetStarted') }}</p>
        <div class="api-key-info" v-if="apiKeyError">
          <p><strong>{{ $t('freeApiKeyInfo') }}</strong></p>
          <p class="free-tier-info">{{ $t('freeTierInfo') }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useWeatherStore } from '../stores/weather'
import weatherService from '../services/weatherService'
import CurrentWeather from '../components/CurrentWeather.vue'
import ForecastChart from '../components/ForecastChart.vue'
import WeatherAlert from '../components/WeatherAlert.vue'
import FavoriteLocations from '../components/FavoriteLocations.vue'
import SettingsPanel from '../components/SettingsPanel.vue'
import ModernLoadingPage from '../components/ModernLoadingPage.vue'
import DailyForecast from '../components/DailyForecast.vue'
import { useI18n } from 'vue-i18n'
import WeatherMap from '../components/WeatherMap.vue'

const { t, locale } = useI18n()

const searchLocation = ref('')
const forecastData = ref([])
const weatherStore = useWeatherStore()
const showLoadingPage = ref(true)
const selectedLanguage = ref('en')

// Load saved language preference
onMounted(() => {
  // Load language preference from localStorage
  const savedSettings = localStorage.getItem('weatherSettings')
  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    if (settings.language) {
      selectedLanguage.value = settings.language
      locale.value = settings.language
    }
  } else {
    // Set default language based on browser
    selectedLanguage.value = locale.value
  }
  
  weatherStore.loadFavorites()
  searchLocation.value = defaultLocation
  searchWeather()
})

// Watch for locale changes and update selectedLanguage
watch(locale, (newLocale) => {
  selectedLanguage.value = newLocale
})

// Change language
const changeLanguage = () => {
  locale.value = selectedLanguage.value
  // Save to localStorage
  const savedSettings = localStorage.getItem('weatherSettings')
  const settings = savedSettings ? JSON.parse(savedSettings) : {}
  settings.language = selectedLanguage.value
  localStorage.setItem('weatherSettings', JSON.stringify(settings))
}

// Check if API key error
const apiKeyError = computed(() => {
  return weatherStore.error && (
    weatherStore.error.includes('API key') || 
    weatherStore.error.includes('appid') ||
    weatherStore.error.includes('401')
  )
})

// Default location (you can change this to your preferred default)
const defaultLocation = 'London'

// Check if current location is in favorites
const isFavoriteLocation = computed(() => {
  if (!weatherStore.currentWeather) return false
  return weatherStore.isFavorite(weatherStore.currentWeather.id)
})

// Add current location to favorites
const addToFavorites = () => {
  if (weatherStore.currentWeather) {
    const favorite = {
      id: weatherStore.currentWeather.id,
      name: weatherStore.currentWeather.name,
      country: weatherStore.currentWeather.sys.country
    }
    weatherStore.addFavorite(favorite)
  }
}

// Remove current location from favorites
const removeFromFavorites = () => {
  if (weatherStore.currentWeather) {
    weatherStore.removeFavorite(weatherStore.currentWeather.id)
  }
}

// Select a favorite location
const selectFavoriteLocation = (favorite) => {
  searchLocation.value = `${favorite.name}, ${favorite.country}`
  searchWeather()
}

// Search weather function
const searchWeather = async () => {
  if (!searchLocation.value.trim()) {
    weatherStore.setError(t('failedToFetchWeather'))
    return
  }
  
  weatherStore.setLoading(true)
  weatherStore.setError('')
  forecastData.value = []
  
  try {
    // Get current weather
    const weatherResponse = await weatherService.getCurrentWeather(searchLocation.value)
    weatherStore.setCurrentWeather(weatherResponse.data)
    
    // Get forecast data
    const forecastResponse = await weatherService.getForecast(searchLocation.value)
    forecastData.value = forecastResponse.data.list
    
    // Get weather alerts (if available)
    if (weatherResponse.data.alerts) {
      weatherStore.setAlerts(weatherResponse.data.alerts)
    } else {
      weatherStore.setAlerts([])
    }
  } catch (err) {
    console.error('Error fetching weather data:', err)
    let errorMessage = t('failedToFetchWeather')
    
    // Provide more specific error messages
    if (err.message && err.message.includes('API key')) {
      errorMessage = t('apiKeyNotConfigured')
    } else if (err.response && err.response.status === 401) {
      errorMessage = t('invalidApiKey')
    } else if (err.response && err.response.status === 404) {
      errorMessage = t('cityNotFound')
    } else if (err.code === 'ENOTFOUND' || err.message.includes('network')) {
      errorMessage = t('networkError')
    }
    
    weatherStore.setError(errorMessage)
    weatherStore.setCurrentWeather(null)
  } finally {
    weatherStore.setLoading(false)
  }
}

// Hide loading page after 4 seconds
setTimeout(() => {
  showLoadingPage.value = false
}, 4000)

// Load default weather and favorites on component mount
onMounted(() => {
  weatherStore.loadFavorites()
  searchLocation.value = defaultLocation
  searchWeather()
})
</script>

<style scoped>
.weather-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  z-index: 1;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  padding-top: 20px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto 20px;
  padding: 0 20px;
}

.title {
  color: #f8fafc;
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  background: linear-gradient(90deg, #60a5fa, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.language-switcher {
  position: relative;
  display: flex;
  align-items: center;
}

.language-select {
  padding: 8px 35px 8px 15px;
  border: none;
  border-radius: 20px;
  background: rgba(30, 41, 59, 0.8);
  color: #e2e8f0;
  font-size: 0.9rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  border: 1px solid #334155;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e2e8f0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 15px;
  width: 120px;
}

.language-select:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3);
}

.search-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input {
  padding: 12px 20px;
  border: none;
  border-radius: 30px;
  width: 300px;
  font-size: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  background: rgba(30, 41, 59, 0.8);
  color: #e2e8f0;
  border: 1px solid #334155;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-button, .favorite-button {
  padding: 12px 25px;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.favorite-button {
  padding: 12px 20px;
  background: linear-gradient(135deg, #ec4899, #f472b6);
}

.favorite-button.active {
  background: linear-gradient(135deg, #f43f5e, #fb7185);
}

.search-button:hover, .favorite-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.2);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.loading, .error, .welcome-message {
  text-align: center;
  padding: 40px;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(59, 130, 246, 0.3);
  border-top: 5px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.welcome-icon, .error-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.loading p, .error p, .welcome-message p {
  font-size: 1.2rem;
  color: #e2e8f0;
}

.error p {
  color: #f87171;
}

.api-key-error, .api-key-info {
  margin-top: 20px;
  padding: 15px;
  background: rgba(251, 191, 36, 0.1);
  border-radius: 8px;
  text-align: left;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.api-key-error p, .api-key-info p {
  font-size: 1rem;
  margin-bottom: 10px;
}

.free-tier-note, .free-tier-info {
  font-weight: bold;
  color: #34d399;
  margin: 10px 0;
}

.api-key-error ol {
  text-align: left;
  margin: 10px 0 10px 20px;
  color: #e2e8f0;
}

.api-key-error li {
  margin-bottom: 8px;
}

.api-key-error a {
  color: #60a5fa;
  text-decoration: none;
}

.api-key-error a:hover {
  text-decoration: underline;
}

.api-key-error code, .api-key-info code {
  background: rgba(30, 41, 59, 0.8);
  padding: 2px 5px;
  border-radius: 3px;
  font-family: monospace;
  border: 1px solid #334155;
}

.weather-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.forecast-container, .alerts-container {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.forecast-container h3, .alerts-container h3 {
  margin-top: 0;
  color: #e2e8f0;
  font-size: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

/* Responsive design */
@media (min-width: 768px) {
  .weather-container {
    grid-template-columns: 1fr 1fr;
  }
  
  .search-input {
    width: 400px;
  }
  
  .header-top {
    margin-bottom: 30px;
  }
}

@media (min-width: 1024px) {
  .weather-container {
    grid-template-columns: 2fr 1fr;
  }
  
  .sidebar {
    grid-column: 2;
    grid-row: 1 / span 2;
  }
}

@media (max-width: 767px) {
  .header-top {
    flex-direction: column;
    gap: 15px;
  }
  
  .title {
    font-size: 2rem;
  }
}
</style>
