<template>
  <div class="forecast-chart glass-card">
    <h3 class="section-title">{{ $t('temperatureForecast') }}</h3>
    <div class="chart-container">
      <div class="chart-wrapper" ref="chartWrapper">
        <svg :width="chartWidth" :height="chartHeight" class="chart-svg">
          <!-- Grid lines -->
          <g v-for="line in gridLines" :key="line.y" class="grid-line">
            <line 
              :x1="padding.left" 
              :y1="line.y" 
              :x2="chartWidth - padding.right" 
              :y2="line.y" 
              stroke="var(--text-secondary)" 
              stroke-opacity="0.2" 
              stroke-width="1"
            />
            <text 
              :x="padding.left - 10" 
              :y="line.y + 4" 
              text-anchor="end" 
              fill="var(--text-secondary)" 
              font-size="12"
            >
              {{ line.label }}°
            </text>
          </g>
          
          <!-- Temperature path -->
          <path 
            :d="temperaturePath" 
            fill="none" 
            stroke="url(#tempGradient)" 
            stroke-width="3" 
            class="temperature-line"
          />
          
          <!-- Data points -->
          <circle 
            v-for="(point, index) in chartData" 
            :key="index"
            :cx="point.x" 
            :cy="point.y" 
            r="6" 
            fill="var(--background-color)" 
            stroke="url(#tempGradient)" 
            stroke-width="3"
            class="data-point"
          />
          
          <!-- Gradient definition -->
          <defs>
            <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" :stop-color="getThemeColor('primary')" />
              <stop offset="100%" :stop-color="getThemeColor('secondary')" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <!-- Time labels -->
      <div class="time-labels">
        <div 
          v-for="(point, index) in chartData" 
          :key="index"
          class="time-label"
          :style="{ left: point.x + 'px' }"
        >
          {{ point.time }}
        </div>
      </div>
    </div>
    
    <!-- Chart legend -->
    <div class="chart-legend">
      <div class="legend-item">
        <div class="legend-color" :style="{ background: `linear-gradient(90deg, ${getThemeColor('primary')}, ${getThemeColor('secondary')})` }"></div>
        <span class="legend-label">{{ $t('temperature') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  forecastData: {
    type: Array,
    required: true
  }
})

// Chart dimensions and padding
const chartWidth = ref(600)
const chartHeight = ref(300)
const padding = {
  top: 40,
  right: 40,
  bottom: 60,
  left: 60
}

const chartWrapper = ref(null)

// Process forecast data for chart
const chartData = computed(() => {
  if (!props.forecastData || props.forecastData.length === 0) return []
  
  // Take every 4th data point to reduce clutter (every 12 hours)
  const filteredData = props.forecastData.filter((_, index) => index % 4 === 0).slice(0, 8)
  
  // Find min and max temperatures for scaling
  const temps = filteredData.map(d => d.main.temp)
  const minTemp = Math.min(...temps)
  const maxTemp = Math.max(...temps)
  const tempRange = maxTemp - minTemp || 1 // Avoid division by zero
  
  // Calculate chart dimensions
  const chartWidth = chartWidth.value - padding.left - padding.right
  const chartHeight = chartHeight.value - padding.top - padding.bottom
  
  // Map data to chart coordinates
  return filteredData.map((data, index) => {
    const x = padding.left + (index / (filteredData.length - 1)) * chartWidth
    const y = padding.top + chartHeight - ((data.main.temp - minTemp) / tempRange) * chartHeight
    const time = new Date(data.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    
    return {
      x,
      y,
      time,
      temp: data.main.temp
    }
  })
})

// Generate temperature path for SVG
const temperaturePath = computed(() => {
  if (chartData.value.length === 0) return ''
  
  const points = chartData.value.map(point => `${point.x},${point.y}`).join(' L ')
  return `M ${points}`
})

// Generate grid lines
const gridLines = computed(() => {
  if (chartData.value.length === 0) return []
  
  const temps = chartData.value.map(d => d.temp)
  const minTemp = Math.min(...temps)
  const maxTemp = Math.max(...temps)
  
  // Create 5 grid lines
  const lines = []
  for (let i = 0; i <= 4; i++) {
    const temp = minTemp + (maxTemp - minTemp) * (i / 4)
    const y = padding.top + (chartHeight.value - padding.top - padding.bottom) * (1 - (i / 4))
    lines.push({
      y,
      label: Math.round(temp)
    })
  }
  
  return lines
})

// Get theme color
const getThemeColor = (colorType) => {
  const root = document.documentElement
  const color = getComputedStyle(root).getPropertyValue(`--${colorType}-color`).trim()
  return color || '#3b82f6'
}

// Handle window resize
const handleResize = () => {
  if (chartWrapper.value) {
    chartWidth.value = Math.min(800, chartWrapper.value.clientWidth)
  }
}

// Initialize and add event listeners
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.forecast-chart {
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

.forecast-chart::before {
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

.forecast-chart:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
}

.forecast-chart:hover::before {
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

.chart-container {
  position: relative;
}

.chart-wrapper {
  width: 100%;
  overflow-x: auto;
  padding: 10px 0;
}

.chart-svg {
  min-width: 100%;
  display: block;
}

.temperature-line {
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
}

.data-point {
  cursor: pointer;
  transition: all 0.3s ease;
}

.data-point:hover {
  r: 8;
  filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.8));
}

.time-labels {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  position: relative;
  height: 40px;
}

.time-label {
  position: absolute;
  transform: translateX(-50%);
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  width: 60px;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 25px;
  padding: 20px;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 18px;
  border: 1px solid var(--glassmorphism-border);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-color {
  width: 30px;
  height: 6px;
  border-radius: 3px;
}

.legend-label {
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 500;
}

/* Responsive design */
@media (max-width: 768px) {
  .forecast-chart {
    padding: 25px;
    margin-top: 25px;
  }
  
  .section-title {
    font-size: 1.6rem;
    margin-bottom: 20px;
  }
  
  .chart-height {
    height: 250px;
  }
  
  .time-label {
    font-size: 0.8rem;
    width: 50px;
  }
  
  .chart-legend {
    gap: 15px;
    padding: 15px;
    margin-top: 20px;
  }
  
  .legend-color {
    width: 25px;
    height: 5px;
  }
  
  .legend-label {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .forecast-chart {
    padding: 20px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .chart-height {
    height: 200px;
  }
  
  .time-label {
    font-size: 0.75rem;
    width: 45px;
  }
  
  .chart-legend {
    gap: 12px;
    padding: 12px;
    margin-top: 15px;
    flex-direction: column;
  }
  
  .legend-label {
    font-size: 0.9rem;
  }
}
</style>