<template>
  <div class="weather-dashboard">
    <!-- Loading Page -->
    <ModernLoadingPage v-if="showLoadingPage" />
    
    <header class="header glass-card">
      <div class="header-top">
        <h1 class="title">{{ $t('weatherDashboard') }}</h1>
        <div class="header-controls">
          <select v-model="selectedLanguage" @change="changeLanguage" class="modern-select language-select">
            <option value="en">{{ $t('language', {}, { locale: 'en' }) }}</option>
            <option value="ar">{{ $t('language', {}, { locale: 'ar' }) }}</option>
            <option value="de">{{ $t('language', {}, { locale: 'de' }) }}</option>
          </select>
          <button class="modern-button icon-only" @click="toggleSettings">
            ⚙️
          </button>
        </div>
      </div>
      <div class="search-container">
        <div class="search-wrapper">
          <input 
            type="text" 
            v-model="searchLocation" 
            :placeholder="$t('searchForCity')" 
            @keyup.enter="searchWeather"
            class="modern-input search-input"
          />
          <button @click="searchWeather" class="modern-button search-button">{{ $t('search') }}</button>
        </div>
        <div class="favorite-controls">
          <button 
            v-if="weatherStore.currentWeather && !isFavoriteLocation" 
            @click="addToFavorites" 
            class="modern-button secondary favorite-button"
            :title="$t('addToFavorites')"
          >
            ♡
          </button>
          <button 
            v-else-if="isFavoriteLocation" 
            @click="removeFromFavorites" 
            class="modern-button favorite-button active"
            :title="$t('removeFromFavorites')"
          >
            ♥
          </button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div v-if="weatherStore.isLoading && !showLoadingPage" class="loading glass-card">
        <div class="spinner"></div>
        <p>{{ $t('loading') }}</p>
      </div>
      
      <div v-else-if="weatherStore.error" class="error glass-card">
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
        <CurrentWeather :weather="weatherStore.currentWeather" class="fade-in" />
        <DailyForecast 
          v-if="forecastData.length > 0" 
          :forecast-data="forecastData"
          class="slide-in"
        />
        
        <div class="alerts-container" v-if="weatherStore.alerts.length > 0">
          <h3 class="section-title">{{ $t('weatherAlerts') }}</h3>
          <WeatherAlert 
            v-for="alert in weatherStore.alerts" 
            :key="alert.id" 
            :alert="alert"
            class="scale-in"
          />
        </div>
        
        <!-- Weather Map Component -->
        <WeatherMap 
          v-if="weatherStore.currentWeather"
          :lat="weatherStore.currentWeather.coord.lat"
          :lon="weatherStore.currentWeather.coord.lon"
          :zoom="10"
          class="slide-in"
        />
      </div>
      
      <div v-else class="welcome-message glass-card">
        <div class="welcome-icon">🌤️</div>
        <h2>{{ $t('welcomeMessage') }}</h2>
        <p>{{ $t('searchToGetStarted') }}</p>
        <div class="api-key-info" v-if="apiKeyError">
          <p><strong>{{ $t('freeApiKeyInfo') }}</strong></p>
          <p class="free-tier-info">{{ $t('freeTierInfo') }}</p>
        </div>
      </div>
    </main>
    
    <!-- Settings Panel Overlay -->
    <div v-if="showSettings" class="settings-overlay" @click="toggleSettings">
      <div class="settings-content" @click.stop>
        <SettingsPanel />
        <button class="close-settings modern-button icon-only" @click="toggleSettings">✕</button>
      </div>
    </div>
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
const showSettings = ref(false)

// Toggle settings panel
const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

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
  background: var(--background-color);
  padding: 25px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  position: relative;
  z-index: 1;
}

.header {
  text-align: center;
  margin-bottom: 35px;
  padding: 30px;
  background: var(--glassmorphism-bg);
  border-radius: 24px;
  box-shadow: var(--glassmorphism-shadow);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glassmorphism-border);
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  z-index: -1;
  border-radius: 26px;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.header:hover::before {
  opacity: 0.1;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto 25px;
  padding: 0 25px;
}

.title {
  color: var(--text-color);
  font-size: 2.8rem;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  letter-spacing: -1px;
}

.header-controls {
  display: flex;
  gap: 18px;
  align-items: center;
}

.language-select {
  width: 160px;
}

.search-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
}

.search-wrapper {
  display: flex;
  gap: 15px;
  align-items: center;
  flex: 1;
  max-width: 600px;
}

.search-input {
  width: 100%;
  flex: 1;
}

.favorite-controls {
  display: flex;
  gap: 15px;
}

.favorite-button {
  font-size: 1.4rem;
  padding: 12px 18px;
}

.favorite-button.active {
  background: linear-gradient(135deg, var(--error-color), #ff4d4d);
  box-shadow: 0 6px 20px rgba(248, 113, 113, 0.3);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.loading, .error, .welcome-message {
  text-align: center;
  padding: 60px;
  background: var(--glassmorphism-bg);
  border-radius: 24px;
  box-shadow: var(--glassmorphism-shadow);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glassmorphism-border);
  margin-bottom: 35px;
  position: relative;
  overflow: hidden;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 6px solid rgba(59, 130, 246, 0.3);
  border-top: 6px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.welcome-icon, .error-icon {
  font-size: 4.5rem;
  margin-bottom: 25px;
  animation: pulseGlow 2s infinite alternate;
}

.loading p, .error p, .welcome-message p {
  font-size: 1.3rem;
  color: var(--text-color);
}

.error p {
  color: var(--error-color);
}

.api-key-error, .api-key-info {
  margin-top: 25px;
  padding: 25px;
  background: rgba(251, 191, 36, 0.1);
  border-radius: 16px;
  text-align: left;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.api-key-error p, .api-key-info p {
  font-size: 1.1rem;
  margin-bottom: 12px;
  color: var(--text-color);
}

.free-tier-note, .free-tier-info {
  font-weight: bold;
  color: var(--success-color);
  margin: 12px 0;
}

.api-key-error ol {
  text-align: left;
  margin: 12px 0 12px 25px;
  color: var(--text-color);
}

.api-key-error li {
  margin-bottom: 10px;
}

.api-key-error a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.api-key-error a:hover {
  text-decoration: underline;
}

.api-key-error code, .api-key-info code {
  background: var(--glassmorphism-bg);
  padding: 5px 10px;
  border-radius: 8px;
  font-family: monospace;
  border: 1px solid var(--glassmorphism-border);
}

.weather-container {
  display: flex;
  flex-direction: column;
  gap: 35px;
}

.alerts-container {
  background: var(--glassmorphism-bg);
  border-radius: 24px;
  padding: 30px;
  box-shadow: var(--glassmorphism-shadow);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glassmorphism-border);
  margin-top: 25px;
  position: relative;
  overflow: hidden;
}

.alerts-container::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--warning-color), #fcd34d);
  z-index: -1;
  border-radius: 26px;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.alerts-container:hover::before {
  opacity: 0.05;
}

.alerts-container h3 {
  margin-top: 0;
  color: var(--text-color);
  font-size: 1.7rem;
  border-bottom: 1px solid var(--glassmorphism-border);
  padding-bottom: 18px;
  font-weight: 800;
}

/* Settings Overlay */
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease forwards;
}

.settings-content {
  position: relative;
  max-width: 550px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--glassmorphism-bg);
  border-radius: 24px;
  box-shadow: var(--glassmorphism-shadow);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glassmorphism-border);
  padding: 30px;
  position: relative;
  overflow: hidden;
}

.settings-content::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  z-index: -1;
  border-radius: 26px;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.settings-content:hover::before {
  opacity: 0.1;
}

.close-settings {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--error-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  box-shadow: 0 4px 15px rgba(248, 113, 113, 0.4);
  transition: all 0.3s ease;
}

.close-settings:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(248, 113, 113, 0.6);
}

/* Responsive design */
@media (min-width: 768px) {
  .weather-container {
    grid-template-columns: 1fr;
  }
  
  .search-input {
    width: 400px;
  }
  
  .header-top {
    margin-bottom: 35px;
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

@media (max-width: 768px) {
  .weather-dashboard {
    padding: 20px;
  }
  
  .header {
    padding: 25px;
    margin-bottom: 25px;
  }
  
  .header-top {
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
    padding: 0 15px;
  }
  
  .header-controls {
    width: 100%;
    justify-content: center;
  }
  
  .title {
    font-size: 2.3rem;
    text-align: center;
  }
  
  .language-select {
    width: 100%;
    max-width: 160px;
  }
  
  .search-container {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 0 15px;
  }
  
  .search-wrapper {
    width: 100%;
    max-width: 100%;
  }
  
  .search-input {
    width: 100%;
    max-width: 100%;
  }
  
  .favorite-controls {
    width: 100%;
    justify-content: center;
  }
  
  .main-content {
    padding: 0 10px;
  }
  
  .loading, .error, .welcome-message {
    padding: 40px;
    margin: 15px;
  }
  
  .welcome-icon, .error-icon {
    font-size: 3.5rem;
    margin-bottom: 20px;
  }
  
  .loading p, .error p, .welcome-message p {
    font-size: 1.2rem;
  }
  
  .weather-container {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  
  .sidebar {
    grid-column: 1;
    grid-row: auto;
    gap: 25px;
  }
  
  .alerts-container {
    padding: 25px;
  }
  
  .alerts-container h3 {
    font-size: 1.5rem;
  }
  
  .settings-content {
    width: 95%;
    max-height: 85vh;
    padding: 25px;
  }
  
  .close-settings {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
    top: 15px;
    right: 15px;
  }
}

@media (max-width: 480px) {
  .weather-dashboard {
    padding: 15px;
  }
  
  .header {
    padding: 20px;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .search-input {
    padding: 14px 18px;
    font-size: 1rem;
  }
  
  .modern-button {
    padding: 12px 22px;
    font-size: 1rem;
  }
  
  .modern-button.icon-only {
    padding: 12px;
    width: 48px;
    height: 48px;
  }
  
  .loading, .error, .welcome-message {
    padding: 30px;
  }
  
  .welcome-icon, .error-icon {
    font-size: 3rem;
    margin-bottom: 15px;
  }
  
  .settings-content {
    padding: 20px;
  }
  
  .search-button {
    padding: 12px 20px;
  }
}
</style>