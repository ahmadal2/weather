<template>
  <div class="weather-map-container">
    <h3 class="map-title">{{ $t('weatherMaps') }}</h3>
    <div class="map-controls">
      <div class="map-type-selector">
        <button 
          v-for="type in mapTypes" 
          :key="type.value"
          :class="{ active: selectedMapType === type.value }"
          @click="changeMapType(type.value)"
          class="map-type-button"
        >
          {{ type.label }}
        </button>
      </div>
      <div class="map-layer-selector">
        <label for="map-layer">{{ $t('mapLayer') }}:</label>
        <select 
          id="map-layer"
          v-model="selectedLayer" 
          @change="updateMap"
          class="layer-select"
        >
          <option value="temperature">{{ $t('temperature') }}</option>
          <option value="precipitation">{{ $t('precipitation') }}</option>
          <option value="wind">{{ $t('wind') }}</option>
          <option value="pressure">{{ $t('pressure') }}</option>
          <option value="clouds">{{ $t('clouds') }}</option>
        </select>
      </div>
    </div>
    <div class="map-wrapper">
      <iframe
        :src="mapUrl"
        class="weather-map"
        frameborder="0"
        scrolling="no"
      ></iframe>
      <div v-if="loading" class="map-loading">
        <div class="spinner"></div>
        <p>{{ $t('loadingMap') }}</p>
      </div>
    </div>
    <div class="map-legend" v-if="showLegend">
      <div class="legend-item" v-for="item in legendItems" :key="item.label">
        <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
        <span class="legend-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  lat: {
    type: Number,
    required: true
  },
  lon: {
    type: Number,
    required: true
  },
  zoom: {
    type: Number,
    default: 10
  }
})

// Map state
const selectedMapType = ref('weathermap')
const selectedLayer = ref('temperature')
const loading = ref(false)
const showLegend = ref(true)

// Map types
const mapTypes = [
  { value: 'weathermap', label: 'OpenWeatherMap' },
  { value: 'satellite', label: 'Satellite' },
  { value: 'precipitation', label: 'Precipitation' }
]

// Legend items for different layers
const legendItems = computed(() => {
  switch (selectedLayer.value) {
    case 'temperature':
      return [
        { color: '#0000ff', label: '-20°C' },
        { color: '#0064ff', label: '-10°C' },
        { color: '#00ffff', label: '0°C' },
        { color: '#00ff00', label: '10°C' },
        { color: '#ffff00', label: '20°C' },
        { color: '#ffa500', label: '30°C' },
        { color: '#ff0000', label: '40°C' }
      ]
    case 'precipitation':
      return [
        { color: '#808080', label: '0 mm' },
        { color: '#0096ff', label: '1 mm' },
        { color: '#0000ff', label: '5 mm' },
        { color: '#00ffff', label: '10 mm' },
        { color: '#00ff00', label: '25 mm' },
        { color: '#ffff00', label: '50 mm' },
        { color: '#ffa500', label: '100 mm' },
        { color: '#ff0000', label: '200 mm' }
      ]
    case 'wind':
      return [
        { color: '#0000ff', label: '0 m/s' },
        { color: '#0064ff', label: '2 m/s' },
        { color: '#00ffff', label: '4 m/s' },
        { color: '#00ff00', label: '6 m/s' },
        { color: '#ffff00', label: '8 m/s' },
        { color: '#ffa500', label: '10 m/s' },
        { color: '#ff0000', label: '12+ m/s' }
      ]
    case 'pressure':
      return [
        { color: '#0000ff', label: '950 hPa' },
        { color: '#0064ff', label: '970 hPa' },
        { color: '#00ffff', label: '990 hPa' },
        { color: '#00ff00', label: '1010 hPa' },
        { color: '#ffff00', label: '1030 hPa' },
        { color: '#ffa500', label: '1050 hPa' },
        { color: '#ff0000', label: '1070 hPa' }
      ]
    default:
      return []
  }
})

// Map URL
const mapUrl = computed(() => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY || 'YOUR_API_KEY'
  if (apiKey === 'YOUR_API_KEY' || !apiKey) {
    return ''
  }
  
  // Different URLs for different map types
  switch (selectedMapType.value) {
    case 'satellite':
      return `https://api.openweathermap.org/map/satellite?lat=${props.lat}&lon=${props.lon}&zoom=${props.zoom}&appid=${apiKey}`
    case 'precipitation':
      return `https://api.openweathermap.org/map/precipitation?lat=${props.lat}&lon=${props.lon}&zoom=${props.zoom}&appid=${apiKey}`
    default:
      // For weathermap, we use the layer parameter
      return `https://openweathermap.org/weathermap?basemap=map&cities=false&layer=${selectedLayer.value}&lat=${props.lat}&lon=${props.lon}&zoom=${props.zoom}`
  }
})

// Change map type
const changeMapType = (type) => {
  selectedMapType.value = type
  updateMap()
}

// Update map
const updateMap = () => {
  loading.value = true
  // Simulate loading time
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// Watch for changes in coordinates
watch(() => [props.lat, props.lon], () => {
  updateMap()
})

// Initialize
onMounted(() => {
  updateMap()
})
</script>

<style scoped>
.weather-map-container {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 20px;
}

.map-title {
  margin: 0 0 15px 0;
  color: #e2e8f0;
  font-size: 1.3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.map-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
  align-items: center;
  justify-content: space-between;
}

.map-type-selector {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.map-type-button {
  padding: 8px 15px;
  background: rgba(15, 23, 42, 0.5);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.map-type-button:hover {
  background: rgba(15, 23, 42, 0.7);
  color: #e2e8f0;
}

.map-type-button.active {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
  border-color: #3b82f6;
}

.map-layer-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.map-layer-selector label {
  color: #e2e8f0;
  font-weight: 500;
}

.layer-select {
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  background: rgba(15, 23, 42, 0.5);
  color: #e2e8f0;
  font-size: 0.9rem;
}

.layer-select:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3);
}

.map-wrapper {
  position: relative;
  height: 400px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.weather-map {
  width: 100%;
  height: 100%;
  background: #0f172a;
}

.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  z-index: 10;
}

.map-loading .spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(59, 130, 246, 0.3);
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.map-loading p {
  color: #e2e8f0;
  font-size: 1rem;
  margin: 0;
}

.map-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
  padding: 10px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.legend-label {
  color: #e2e8f0;
  font-size: 0.85rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive design */
@media (max-width: 768px) {
  .map-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .map-wrapper {
    height: 300px;
  }
  
  .map-type-selector {
    width: 100%;
  }
  
  .map-type-button {
    flex: 1;
  }
}
</style>