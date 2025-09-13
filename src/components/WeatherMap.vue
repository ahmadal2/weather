<template>
  <div class="weather-map-container glass-card">
    <h3 class="section-title">{{ $t('weatherMaps') }}</h3>
    <div class="map-controls">
      <div class="map-type-selector">
        <button 
          v-for="type in mapTypes" 
          :key="type.value"
          :class="{ active: selectedMapType === type.value, 'modern-button': true, 'secondary': selectedMapType !== type.value }"
          @click="changeMapType(type.value)"
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
          class="modern-select"
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
    <div class="map-info">
      <div class="info-item">
        <span class="info-label">{{ $t('coordinates') }}:</span>
        <span class="info-value">{{ props.lat.toFixed(4) }}, {{ props.lon.toFixed(4) }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">{{ $t('zoomLevel') }}:</span>
        <span class="info-value">{{ props.zoom }}</span>
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

.weather-map-container::before {
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

.weather-map-container:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
}

.weather-map-container:hover::before {
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

.map-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 25px;
  align-items: center;
  justify-content: space-between;
}

.map-type-selector {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.map-type-selector .modern-button {
  padding: 12px 20px;
  font-size: 0.95rem;
}

.map-layer-selector {
  display: flex;
  align-items: center;
  gap: 15px;
}

.map-layer-selector label {
  color: var(--text-color);
  font-weight: 600;
  font-size: 1.05rem;
  white-space: nowrap;
}

.map-layer-selector .modern-select {
  min-width: 180px;
}

.map-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--glassmorphism-border);
}

.weather-map {
  width: 100%;
  height: 100%;
  border: none;
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
  gap: 20px;
  z-index: 10;
  border-radius: 20px;
}

.map-loading .spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(59, 130, 246, 0.3);
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

.map-loading p {
  color: var(--text-color);
  font-size: 1.2rem;
  font-weight: 500;
}

.map-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 25px;
  padding: 20px;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 18px;
  border: 1px solid var(--glassmorphism-border);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 25px;
  height: 25px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.legend-label {
  color: var(--text-color);
  font-size: 0.95rem;
  font-weight: 500;
}

.map-info {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin-top: 25px;
  padding: 20px;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 18px;
  border: 1px solid var(--glassmorphism-border);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.info-value {
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 600;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive design */
@media (max-width: 768px) {
  .weather-map-container {
    padding: 25px;
    margin-top: 25px;
  }
  
  .section-title {
    font-size: 1.6rem;
    margin-bottom: 20px;
  }
  
  .map-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .map-type-selector {
    width: 100%;
    justify-content: center;
  }
  
  .map-layer-selector {
    width: 100%;
    justify-content: center;
  }
  
  .map-layer-selector .modern-select {
    min-width: 100%;
  }
  
  .map-wrapper {
    height: 350px;
  }
  
  .map-legend {
    gap: 12px;
    padding: 15px;
    margin-top: 20px;
  }
  
  .legend-item {
    gap: 6px;
  }
  
  .legend-color {
    width: 20px;
    height: 20px;
  }
  
  .legend-label {
    font-size: 0.85rem;
  }
  
  .map-info {
    gap: 20px;
    padding: 15px;
    margin-top: 20px;
  }
  
  .info-label {
    font-size: 0.85rem;
  }
  
  .info-value {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .weather-map-container {
    padding: 20px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .map-type-selector .modern-button {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  .map-layer-selector label {
    font-size: 0.95rem;
  }
  
  .map-wrapper {
    height: 300px;
  }
  
  .map-loading .spinner {
    width: 40px;
    height: 40px;
  }
  
  .map-loading p {
    font-size: 1.1rem;
  }
  
  .map-legend {
    gap: 10px;
    padding: 12px;
  }
  
  .legend-color {
    width: 18px;
    height: 18px;
  }
  
  .legend-label {
    font-size: 0.8rem;
  }
  
  .map-info {
    gap: 15px;
    padding: 12px;
  }
  
  .info-label {
    font-size: 0.8rem;
  }
  
  .info-value {
    font-size: 0.95rem;
  }
}
</style>