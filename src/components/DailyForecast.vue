<template>
  <div class="daily-forecast">
    <h3 class="forecast-title">{{ $t('forecast') }}</h3>
    <div class="forecast-container">
      <div 
        v-for="(day, index) in dailyForecast" 
        :key="index"
        class="forecast-day"
      >
        <div class="day-header">
          <span class="day-name">{{ day.day }}</span>
          <span class="date">{{ day.date }}</span>
        </div>
        <div class="weather-icon-container">
          <img 
            :src="getWeatherIcon(day.icon)" 
            :alt="day.description"
            class="weather-icon"
          >
        </div>
        <div class="temperature">
          <span class="high-temp">{{ Math.round(day.high) }}°</span>
          <span class="low-temp">{{ Math.round(day.low) }}°</span>
        </div>
        <div class="description">{{ day.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import weatherService from '../services/weatherService'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  forecastData: {
    type: Array,
    required: true
  }
})

// Process forecast data to get daily forecasts
const dailyForecast = computed(() => {
  if (!props.forecastData || props.forecastData.length === 0) return []
  
  // Group forecast data by day
  const dailyData = {}
  
  // Take one data point per day (every 8th item in the 3-hour forecast data)
  for (let i = 0; i < props.forecastData.length; i += 8) {
    const point = props.forecastData[i]
    const date = new Date(point.dt * 1000)
    const dayKey = date.toDateString()
    
    if (!dailyData[dayKey]) {
      dailyData[dayKey] = {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        high: point.main.temp_max,
        low: point.main.temp_min,
        description: point.weather[0].description,
        icon: point.weather[0].icon
      }
    } else {
      // Update high/low temps
      dailyData[dayKey].high = Math.max(dailyData[dayKey].high, point.main.temp_max)
      dailyData[dayKey].low = Math.min(dailyData[dayKey].low, point.main.temp_min)
    }
  }
  
  // Convert to array and limit to 5 days
  return Object.values(dailyData).slice(0, 5)
})

// Get weather icon
const getWeatherIcon = (iconCode) => {
  return weatherService.getWeatherIcon(iconCode)
}
</script>

<style scoped>
.daily-forecast {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 20px;
}

.forecast-title {
  margin: 0 0 15px 0;
  color: #e2e8f0;
  font-size: 1.3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.forecast-container {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 10px 0;
}

.forecast-container::-webkit-scrollbar {
  height: 6px;
}

.forecast-container::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 3px;
}

.forecast-container::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

.forecast-container::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

.forecast-day {
  flex: 0 0 auto;
  width: 100px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.day-header {
  margin-bottom: 10px;
}

.day-name {
  display: block;
  font-weight: bold;
  color: #e2e8f0;
  font-size: 1rem;
}

.date {
  display: block;
  color: #94a3b8;
  font-size: 0.8rem;
  margin-top: 3px;
}

.weather-icon-container {
  margin: 10px 0;
}

.weather-icon {
  width: 50px;
  height: 50px;
}

.temperature {
  margin: 10px 0;
}

.high-temp {
  font-weight: bold;
  color: #e2e8f0;
  font-size: 1.2rem;
  margin-right: 5px;
}

.low-temp {
  color: #94a3b8;
  font-size: 1rem;
}

.description {
  color: #94a3b8;
  font-size: 0.8rem;
  text-transform: capitalize;
  margin-top: 5px;
}

/* Responsive design */
@media (max-width: 768px) {
  .forecast-day {
    width: 80px;
    padding: 10px;
  }
  
  .day-name {
    font-size: 0.9rem;
  }
  
  .weather-icon {
    width: 40px;
    height: 40px;
  }
  
  .high-temp {
    font-size: 1rem;
  }
  
  .low-temp {
    font-size: 0.9rem;
  }
}
</style>