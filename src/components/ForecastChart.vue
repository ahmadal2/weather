<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  forecastData: {
    type: Array,
    required: true
  }
})

const chartCanvas = ref(null)
let chartInstance = null

// Create or update the chart
const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  if (!chartCanvas.value || !props.forecastData.length) return
  
  // Process forecast data for chart
  const labels = []
  const temperatures = []
  const feelsLike = []
  const precipitation = []
  
  // Take one data point per day (every 8th item in the 3-hour forecast data)
  for (let i = 0; i < props.forecastData.length; i += 8) {
    const point = props.forecastData[i]
    const date = new Date(point.dt * 1000)
    labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }))
    temperatures.push(Math.round(point.main.temp))
    feelsLike.push(Math.round(point.main.feels_like))
    
    // Get precipitation data if available
    const rain = point.rain ? point.rain['3h'] || 0 : 0
    const snow = point.snow ? point.snow['3h'] || 0 : 0
    precipitation.push(Math.round((rain + snow) * 10) / 10)
  }
  
  // Create chart
  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperatures,
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96, 165, 250, 0.2)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y'
        },
        {
          label: 'Feels Like (°C)',
          data: feelsLike,
          borderColor: '#f87171',
          backgroundColor: 'rgba(248, 113, 113, 0.2)',
          borderDash: [5, 5],
          tension: 0.4,
          fill: false,
          yAxisID: 'y'
        },
        {
          label: 'Precipitation (mm)',
          data: precipitation,
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.2)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#e2e8f0'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(30, 41, 59, 0.9)',
          titleColor: '#e2e8f0',
          bodyColor: '#e2e8f0',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              if (context.parsed.y !== null) {
                if (context.datasetIndex === 2) {
                  label += context.parsed.y + ' mm'
                } else {
                  label += context.parsed.y + '°C'
                }
              }
              return label
            }
          }
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Temperature (°C)',
            color: '#e2e8f0'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#94a3b8'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Precipitation (mm)',
            color: '#e2e8f0'
          },
          grid: {
            drawOnChartArea: false,
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#94a3b8'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#94a3b8'
          }
        }
      }
    }
  })
}

// Watch for forecast data changes
watch(() => props.forecastData, () => {
  createChart()
}, { deep: true })

// Create chart on mount
onMounted(() => {
  createChart()
})
</script>

<style scoped>
.chart-container {
  height: 350px;
  position: relative;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
