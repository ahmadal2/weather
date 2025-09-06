<template>
  <div class="current-weather-card">
    <div class="location-info">
      <h2>{{ weather.name }}, {{ weather.sys.country }}</h2>
      <p>{{ formattedDate }}</p>
    </div>
    
    <div class="temperature-info">
      <div class="temperature">{{ Math.round(weather.main.temp) }}°C</div>
      <div class="weather-description">
        <img 
          :src="weatherIcon" 
          :alt="weather.weather[0].description"
          class="weather-icon"
        >
        <span>{{ weather.weather[0].description }}</span>
      </div>
    </div>
    
    <div class="weather-details">
      <div class="detail-item">
        <span class="detail-label">{{ $t('feelsLike') }}</span>
        <span class="detail-value">{{ Math.round(weather.main.feels_like) }}°C</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">{{ $t('humidity') }}</span>
        <span class="detail-value">{{ weather.main.humidity }}%</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">{{ $t('wind') }}</span>
        <span class="detail-value">{{ weather.wind.speed }} m/s</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">{{ $t('pressure') }}</span>
        <span class="detail-value">{{ weather.main.pressure }} hPa</span>
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
</script>

<style scoped>
.current-weather-card {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.location-info h2 {
  margin: 0 0 10px 0;
  color: #e2e8f0;
  font-size: 2rem;
}

.location-info p {
  margin: 0;
  color: #94a3b8;
  font-size: 1.1rem;
}

.temperature-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0;
  flex-wrap: wrap;
}

.temperature {
  font-size: 4rem;
  font-weight: bold;
  color: #e2e8f0;
  background: linear-gradient(135deg, #60a5fa, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.weather-description {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.weather-icon {
  width: 100px;
  height: 100px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

.weather-description span {
  font-size: 1.3rem;
  color: #e2e8f0;
  text-transform: capitalize;
  text-align: center;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.detail-item {
  background: rgba(15, 23, 42, 0.5);
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease;
}

.detail-item:hover {
  transform: translateY(-5px);
  background: rgba(15, 23, 42, 0.7);
}

.detail-label {
  display: block;
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 5px;
}

.detail-value {
  font-size: 1.3rem;
  font-weight: bold;
  color: #e2e8f0;
}

/* Responsive design */
@media (min-width: 768px) {
  .temperature-info {
    justify-content: center;
    gap: 50px;
  }
}
</style>