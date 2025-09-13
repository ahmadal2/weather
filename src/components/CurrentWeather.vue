<template>
  <div class="current-weather-card glass-card">
    <div class="location-info">
      <h2>{{ weather.name }}, {{ weather.sys.country }}</h2>
      <p>{{ formattedDate }}</p>
    </div>
    
    <div class="temperature-info">
      <div class="temperature-display">
        <div class="temperature">{{ Math.round(weather.main.temp) }}°C</div>
        <div class="feels-like">{{ $t('feelsLike') }} {{ Math.round(weather.main.feels_like) }}°C</div>
      </div>
      <div class="weather-description">
        <img 
          :src="weatherIcon" 
          :alt="weather.weather[0].description"
          class="weather-icon"
        >
        <span>{{ weather.weather[0].description }}</span>
      </div>
    </div>
    
    <div class="weather-details data-grid">
      <div class="data-item">
        <div class="data-label">{{ $t('humidity') }}</div>
        <div class="data-value">{{ weather.main.humidity }}%</div>
        <div class="data-bar">
          <div class="data-fill" :style="{ width: weather.main.humidity + '%' }"></div>
        </div>
      </div>
      <div class="data-item">
        <div class="data-label">{{ $t('wind') }}</div>
        <div class="data-value">{{ weather.wind.speed }} m/s</div>
        <div class="wind-direction" :style="{ transform: 'rotate(' + (weather.wind.deg || 0) + 'deg)' }">↑</div>
      </div>
      <div class="data-item">
        <div class="data-label">{{ $t('pressure') }}</div>
        <div class="data-value">{{ weather.main.pressure }} hPa</div>
        <div class="pressure-trend" :class="pressureTrendClass">
          {{ pressureTrend }}
        </div>
      </div>
      <div class="data-item">
        <div class="data-label">{{ $t('visibility') }}</div>
        <div class="data-value">{{ (weather.visibility / 1000).toFixed(1) }} km</div>
        <div class="visibility-indicator">
          <div class="visibility-bar" :style="{ width: visibilityPercentage + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import weatherService from '../services/weatherService'

const props = defineProps({
  weather: {
    type: Object,
    required: true
  }
})

// Format date
const formattedDate = computed(() => {
  const timestamp = props.weather.dt
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Get weather icon
const weatherIcon = computed(() => {
  const iconCode = props.weather.weather[0].icon
  return weatherService.getWeatherIcon(iconCode)
})

// Calculate visibility percentage (0-10km range)
const visibilityPercentage = computed(() => {
  const visibilityKm = (props.weather.visibility || 10000) / 1000
  return Math.min(100, (visibilityKm / 10) * 100)
})

// Pressure trend calculation (simplified)
const pressureTrend = computed(() => {
  // In a real app, you would compare with previous pressure readings
  const pressure = props.weather.main.pressure
  if (pressure > 1020) return '↗'
  if (pressure < 1000) return '↘'
  return '→'
})

const pressureTrendClass = computed(() => {
  const pressure = props.weather.main.pressure
  if (pressure > 1020) return 'rising'
  if (pressure < 1000) return 'falling'
  return 'steady'
})
</script>

<style scoped>
.current-weather-card {
  background: var(--glassmorphism-bg);
  border-radius: 24px;
  padding: 35px;
  box-shadow: var(--glassmorphism-shadow);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glassmorphism-border);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.current-weather-card::before {
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

.current-weather-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
}

.current-weather-card:hover::before {
  opacity: 0.1;
}

.location-info h2 {
  margin: 0 0 12px 0;
  color: var(--text-color);
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: -1px;
}

.location-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1.2rem;
  font-weight: 500;
}

.temperature-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 45px 0;
  flex-wrap: wrap;
  gap: 30px;
}

.temperature-display {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.temperature {
  font-size: 5rem;
  font-weight: 800;
  color: var(--text-color);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  letter-spacing: -2px;
}

.feels-like {
  font-size: 1.3rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.weather-description {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.weather-icon {
  width: 130px;
  height: 130px;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.weather-icon:hover {
  transform: scale(1.1);
}

.weather-description span {
  font-size: 1.5rem;
  color: var(--text-color);
  text-transform: capitalize;
  text-align: center;
  font-weight: 600;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 25px;
  margin-top: 35px;
}

.data-item {
  text-align: center;
  padding: 25px 20px;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.data-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.data-item:hover {
  background: rgba(15, 23, 42, 0.6);
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.data-item:hover::before {
  opacity: 1;
}

.data-label {
  font-size: 1.05rem;
  color: var(--text-secondary);
  margin-bottom: 10px;
  font-weight: 500;
}

.data-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-color);
  letter-spacing: -0.5px;
  margin-bottom: 15px;
}

/* Data visualization elements */
.data-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 10px;
}

.data-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: 3px;
  transition: width 1s ease;
}

.wind-direction {
  font-size: 1.8rem;
  color: var(--primary-color);
  transition: transform 0.5s ease;
  margin: 0 auto;
}

.pressure-trend {
  font-size: 1.8rem;
  font-weight: bold;
}

.pressure-trend.rising {
  color: var(--success-color);
}

.pressure-trend.falling {
  color: var(--error-color);
}

.pressure-trend.steady {
  color: var(--warning-color);
}

.visibility-indicator {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 10px;
}

.visibility-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: 3px;
  transition: width 1s ease;
}

/* Responsive design */
@media (min-width: 768px) {
  .temperature-info {
    justify-content: center;
    gap: 70px;
  }
}

/* Enhanced responsive design */
@media (max-width: 768px) {
  .current-weather-card {
    padding: 30px;
  }
  
  .location-info h2 {
    font-size: 2rem;
    text-align: center;
  }
  
  .location-info p {
    font-size: 1.1rem;
    text-align: center;
  }
  
  .temperature-info {
    flex-direction: column;
    gap: 30px;
    margin: 35px 0;
  }
  
  .temperature {
    font-size: 4rem;
  }
  
  .feels-like {
    font-size: 1.2rem;
  }
  
  .weather-icon {
    width: 110px;
    height: 110px;
  }
  
  .weather-description span {
    font-size: 1.3rem;
  }
  
  .weather-details {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 30px;
  }
  
  .data-item {
    padding: 20px 15px;
  }
  
  .data-label {
    font-size: 0.95rem;
  }
  
  .data-value {
    font-size: 1.3rem;
  }
  
  .temperature-display {
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .current-weather-card {
    padding: 25px;
  }
  
  .location-info h2 {
    font-size: 1.7rem;
  }
  
  .location-info p {
    font-size: 1rem;
  }
  
  .temperature {
    font-size: 3.5rem;
  }
  
  .feels-like {
    font-size: 1.1rem;
  }
  
  .weather-icon {
    width: 90px;
    height: 90px;
  }
  
  .weather-description span {
    font-size: 1.2rem;
  }
  
  .weather-details {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .data-item {
    padding: 18px 12px;
  }
  
  .data-label {
    font-size: 0.9rem;
  }
  
  .data-value {
    font-size: 1.2rem;
  }
  
  .temperature-info {
    gap: 25px;
    margin: 30px 0;
  }
}
</style>