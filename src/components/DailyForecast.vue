<template>
  <div class="daily-forecast glass-card">
    <h3 class="section-title">{{ $t('forecast') }}</h3>
    <div class="forecast-container">
      <div 
        v-for="(day, index) in dailyForecast" 
        :key="index"
        class="forecast-day modern-card"
        :class="{ 'today': index === 0 }"
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
        <div class="forecast-bar">
          <div class="temp-bar" :style="{ 
            width: tempBarWidth(day.low, day.high) + '%',
            background: `linear-gradient(90deg, ${getTempColor(day.low)}, ${getTempColor(day.high)})`
          }"></div>
        </div>
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

// Calculate temperature bar width
const tempBarWidth = (low, high) => {
  const range = high - low
  // Normalize to a percentage (0-100%)
  return Math.min(100, Math.max(20, (range / 20) * 100))
}

// Get temperature color based on value
const getTempColor = (temp) => {
  if (temp < 0) return '#3b82f6' // Blue for cold
  if (temp < 10) return '#60a5fa'
  if (temp < 20) return '#10b981' // Green for mild
  if (temp < 30) return '#fbbf24' // Yellow for warm
  return '#f97316' // Orange/Red for hot
}
</script>

<style scoped>
.daily-forecast {
  background: var(--glassmorphism-bg);
  border-radius: 24px;
  padding: 30px;
  box-shadow: var(--glassmorphism-shadow);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glassmorphism-border);
  margin-top: 30px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.daily-forecast::before {
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

.daily-forecast:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
}

.daily-forecast:hover::before {
  opacity: 0.1;
}

.section-title {
  margin: 0 0 25px 0;
  color: var(--text-color);
  font-size: 1.8rem;
  font-weight: 800;
  position: relative;
  padding-bottom: 15px;
  letter-spacing: -0.5px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: 4px;
  box-shadow: var(--neon-glow);
}

.forecast-container {
  display: flex;
  gap: 25px;
  overflow-x: auto;
  padding: 15px 0;
}

.forecast-container::-webkit-scrollbar {
  height: 10px;
}

.forecast-container::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 5px;
}

.forecast-container::-webkit-scrollbar-thumb {
  background: var(--text-secondary);
  border-radius: 5px;
}

.forecast-container::-webkit-scrollbar-thumb:hover {
  background: var(--text-color);
}

.forecast-day {
  flex: 0 0 auto;
  width: 120px;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 20px;
  padding: 25px 20px;
  text-align: center;
  border: 1px solid var(--glassmorphism-border);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.forecast-day::before {
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

.forecast-day:hover {
  background: rgba(15, 23, 42, 0.6);
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.forecast-day:hover::before {
  opacity: 1;
}

.forecast-day.today {
  background: rgba(59, 130, 246, 0.2);
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-color), 0 8px 20px rgba(59, 130, 246, 0.3);
}

.forecast-day.today:hover {
  background: rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 0 2px var(--primary-color), 0 12px 30px rgba(59, 130, 246, 0.4);
}

.day-header {
  margin-bottom: 20px;
}

.day-name {
  display: block;
  font-weight: 700;
  color: var(--text-color);
  font-size: 1.2rem;
  letter-spacing: -0.3px;
}

.date {
  display: block;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 5px;
  font-weight: 500;
}

.weather-icon-container {
  margin: 20px 0;
}

.weather-icon {
  width: 70px;
  height: 70px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
}

.weather-icon:hover {
  transform: scale(1.1);
}

.temperature {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.high-temp {
  font-weight: 800;
  color: var(--text-color);
  font-size: 1.4rem;
  letter-spacing: -0.5px;
}

.low-temp {
  color: var(--text-secondary);
  font-size: 1.2rem;
  font-weight: 600;
}

.description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-transform: capitalize;
  margin-top: 10px;
  font-weight: 500;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Temperature bar visualization */
.forecast-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 15px;
  position: relative;
}

.temp-bar {
  height: 100%;
  border-radius: 4px;
  transition: all 0.5s ease;
}

/* Responsive design */
@media (max-width: 768px) {
  .daily-forecast {
    padding: 25px;
    margin-top: 25px;
  }
  
  .section-title {
    font-size: 1.6rem;
    margin-bottom: 20px;
  }
  
  .forecast-container {
    gap: 20px;
    padding: 10px 0;
  }
  
  .forecast-day {
    width: 100px;
    padding: 20px 15px;
  }
  
  .day-name {
    font-size: 1.1rem;
  }
  
  .date {
    font-size: 0.8rem;
  }
  
  .weather-icon {
    width: 60px;
    height: 60px;
  }
  
  .high-temp {
    font-size: 1.2rem;
  }
  
  .low-temp {
    font-size: 1.1rem;
  }
  
  .description {
    font-size: 0.85rem;
    min-height: 32px;
  }
  
  .forecast-bar {
    height: 6px;
    margin-top: 12px;
  }
}

@media (max-width: 480px) {
  .daily-forecast {
    padding: 20px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .forecast-container {
    gap: 15px;
  }
  
  .forecast-day {
    width: 85px;
    padding: 18px 12px;
  }
  
  .day-name {
    font-size: 1rem;
  }
  
  .date {
    font-size: 0.75rem;
  }
  
  .weather-icon {
    width: 50px;
    height: 50px;
  }
  
  .high-temp {
    font-size: 1.1rem;
  }
  
  .low-temp {
    font-size: 1rem;
  }
  
  .description {
    font-size: 0.8rem;
    min-height: 28px;
  }
  
  .forecast-bar {
    height: 5px;
    margin-top: 10px;
  }
}
</style>