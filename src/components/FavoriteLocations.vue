<template>
  <div class="favorite-locations glass-card">
    <h3 class="section-title">{{ $t('favoriteLocations') }}</h3>
    <div class="favorites-container">
      <div 
        v-for="favorite in favorites" 
        :key="favorite.id"
        class="favorite-item modern-card"
        @click="$emit('select', favorite)"
      >
        <div class="favorite-content">
          <div class="location-info">
            <h4>{{ favorite.name }}</h4>
            <p>{{ favorite.country }}</p>
          </div>
          <button 
            class="remove-button modern-button icon-only secondary" 
            @click.stop="$emit('remove', favorite)"
            :title="$t('removeFromFavorites')"
          >
            ✕
          </button>
        </div>
        <div class="location-weather" v-if="favorite.weather">
          <div class="temperature">{{ Math.round(favorite.weather.main.temp) }}°C</div>
          <img 
            :src="getWeatherIcon(favorite.weather.weather[0].icon)" 
            :alt="favorite.weather.weather[0].description"
            class="weather-icon"
          >
        </div>
      </div>
    </div>
    <div v-if="favorites.length === 0" class="no-favorites">
      <p>{{ $t('noFavoriteLocations') }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import weatherService from '../services/weatherService'
import { useWeatherStore } from '../stores/weather'

const weatherStore = useWeatherStore()

defineProps({
  favorites: {
    type: Array,
    required: true
  }
})

defineEmits(['select', 'remove'])

// Get weather icon
const getWeatherIcon = (iconCode) => {
  return weatherService.getWeatherIcon(iconCode)
}

// Get favorite locations with weather data
const favoritesWithWeather = computed(() => {
  return weatherStore.favorites.map(favorite => {
    const weather = weatherStore.getFavoriteWeather(favorite.id)
    return {
      ...favorite,
      weather
    }
  })
})
</script>

<style scoped>
.favorite-locations {
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

.favorite-locations::before {
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

.favorite-locations:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
}

.favorite-locations:hover::before {
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

.favorites-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.favorite-item {
  background: rgba(15, 23, 42, 0.4);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid var(--glassmorphism-border);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.favorite-item::before {
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

.favorite-item:hover {
  background: rgba(15, 23, 42, 0.6);
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.favorite-item:hover::before {
  opacity: 1;
}

.favorite-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.location-info h4 {
  color: var(--text-color);
  font-size: 1.3rem;
  margin: 0 0 5px 0;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.location-info p {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
}

.remove-button {
  padding: 8px;
  width: 36px;
  height: 36px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-weather {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid var(--glassmorphism-border);
}

.temperature {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-color);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
}

.weather-icon {
  width: 50px;
  height: 50px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
}

.weather-icon:hover {
  transform: scale(1.1);
}

.no-favorites {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-weight: 500;
}

.no-favorites p {
  margin: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .favorite-locations {
    padding: 25px;
    margin-top: 25px;
  }
  
  .section-title {
    font-size: 1.6rem;
    margin-bottom: 20px;
  }
  
  .favorites-container {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .favorite-item {
    padding: 18px;
  }
  
  .location-info h4 {
    font-size: 1.2rem;
  }
  
  .location-info p {
    font-size: 0.95rem;
  }
  
  .remove-button {
    width: 32px;
    height: 32px;
    font-size: 1.1rem;
  }
  
  .location-weather {
    padding-top: 12px;
  }
  
  .temperature {
    font-size: 1.6rem;
  }
  
  .weather-icon {
    width: 45px;
    height: 45px;
  }
  
  .no-favorites {
    padding: 30px 15px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .favorite-locations {
    padding: 20px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .favorite-item {
    padding: 15px;
  }
  
  .location-info h4 {
    font-size: 1.1rem;
  }
  
  .location-info p {
    font-size: 0.9rem;
  }
  
  .remove-button {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }
  
  .location-weather {
    padding-top: 10px;
  }
  
  .temperature {
    font-size: 1.4rem;
  }
  
  .weather-icon {
    width: 40px;
    height: 40px;
  }
  
  .no-favorites {
    padding: 25px 10px;
    font-size: 0.95rem;
  }
}
</style>