<template>
  <div class="loading-page">
    <div class="animation-container">
      <!-- Sun Animation (0-20%) -->
      <transition name="fade" mode="out-in">
        <div v-if="progress < 20" key="sun" class="stage sun-stage">
          <div class="sun">
            <div class="sun-core"></div>
            <div class="sun-rays"></div>
          </div>
        </div>
        
        <!-- Clouds Animation (20-40%) -->
        <div v-else-if="progress < 40" key="clouds" class="stage clouds-stage">
          <div class="cloud big"></div>
          <div class="cloud medium"></div>
          <div class="cloud small"></div>
        </div>
        
        <!-- Wind Animation (40-60%) -->
        <div v-else-if="progress < 60" key="wind" class="stage wind-stage">
          <div class="wind-element">
            <div class="wind-line line-1"></div>
            <div class="wind-line line-2"></div>
            <div class="wind-line line-3"></div>
            <div class="wind-swirl"></div>
          </div>
        </div>
        
        <!-- Rain Animation (60-80%) -->
        <div v-else-if="progress < 80" key="rain" class="stage rain-stage">
          <div class="rain-cloud"></div>
          <div class="raindrops">
            <div class="raindrop drop-1"></div>
            <div class="raindrop drop-2"></div>
            <div class="raindrop drop-3"></div>
            <div class="raindrop drop-4"></div>
            <div class="raindrop drop-5"></div>
            <div class="raindrop drop-6"></div>
          </div>
        </div>
        
        <!-- Lightning Animation (80-100%) -->
        <div v-else key="lightning" class="stage lightning-stage">
          <div class="storm-cloud"></div>
          <div class="lightning-bolt"></div>
          <div class="lightning-flash"></div>
        </div>
      </transition>
    </div>
    
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="loading-text">{{ currentText }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const progress = ref(0)
const currentText = ref(t('loadingWeatherData'))

// Stage texts based on progress
const currentTextComputed = computed(() => {
  if (progress.value < 20) {
    return t('warmingUpSun')
  } else if (progress.value < 40) {
    return t('gatheringClouds')
  } else if (progress.value < 60) {
    return t('collectingWind')
  } else if (progress.value < 80) {
    return t('collectingRaindrops')
  } else {
    return t('chargingLightning')
  }
})

// Update progress
const updateProgress = () => {
  if (progress.value < 100) {
    progress.value += 1
    currentText.value = currentTextComputed.value
  }
}

// Set up interval for continuous progress
onMounted(() => {
  // Set interval for progress updates (40ms per increment for 4 seconds total)
  const interval = setInterval(() => {
    updateProgress()
    if (progress.value >= 100) {
      clearInterval(interval)
    }
  }, 40)
})
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, #1e293b 0%, #0f172a 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  gap: 40px;
  padding: 20px;
}

.animation-container {
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.stage {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Sun Stage - 0-20% */
.sun-stage {
  display: flex;
  justify-content: center;
  align-items: center;
}

.sun {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sun-core {
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #ffeb3b 0%, #ff9800 100%);
  border-radius: 50%;
  box-shadow: 0 0 40px #ffeb3b, 0 0 80px #ff9800;
  z-index: 3;
  animation: pulse 2s infinite ease-in-out;
}

.sun-rays {
  position: absolute;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(255, 235, 59, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  animation: rotate 20s linear infinite;
  z-index: 2;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 40px #ffeb3b, 0 0 80px #ff9800;
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 50px #ffeb3b, 0 0 100px #ff9800;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Clouds Stage - 20-40% */
.clouds-stage {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cloud {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  position: absolute;
  filter: blur(2px);
}

.big {
  width: 100px;
  height: 40px;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: float 4s ease-in-out infinite;
}

.medium {
  width: 70px;
  height: 30px;
  top: 35%;
  left: 30%;
  animation: float 5s ease-in-out infinite 0.5s;
}

.small {
  width: 50px;
  height: 20px;
  top: 60%;
  left: 70%;
  animation: float 6s ease-in-out infinite 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Wind Stage - 40-60% */
.wind-stage {
  display: flex;
  justify-content: center;
  align-items: center;
}

.wind-element {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.wind-line {
  width: 150px;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  border-radius: 2px;
  animation: windFlow 2s linear infinite;
}

.line-1 {
  animation-delay: 0s;
}

.line-2 {
  animation-delay: 0.3s;
}

.line-3 {
  animation-delay: 0.6s;
}

.wind-swirl {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  border-top-color: transparent;
  border-left-color: transparent;
  animation: swirl 1.5s linear infinite;
}

@keyframes windFlow {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes swirl {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Rain Stage - 60-80% */
.rain-stage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.rain-cloud {
  width: 120px;
  height: 50px;
  background: rgba(150, 150, 150, 0.9);
  border-radius: 50%;
  position: relative;
  top: 20px;
  filter: blur(2px);
}

.raindrops {
  position: relative;
  top: 0;
  display: flex;
  justify-content: space-around;
  width: 100px;
  margin-top: 30px;
}

.raindrop {
  width: 4px;
  height: 15px;
  background: linear-gradient(to bottom, #64b5f6, #1976d2);
  border-radius: 0 0 50% 50%;
  animation: fall 1.5s linear infinite;
  position: absolute;
}

.drop-1 {
  left: 10px;
  animation-delay: 0s;
}

.drop-2 {
  left: 25px;
  animation-delay: 0.2s;
}

.drop-3 {
  left: 40px;
  animation-delay: 0.4s;
}

.drop-4 {
  left: 55px;
  animation-delay: 0.6s;
}

.drop-5 {
  left: 70px;
  animation-delay: 0.8s;
}

.drop-6 {
  left: 85px;
  animation-delay: 1s;
}

@keyframes fall {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(100px);
    opacity: 0;
  }
}

/* Lightning Stage - 80-100% */
.lightning-stage {
  display: flex;
  justify-content: center;
  align-items: center;
}

.storm-cloud {
  width: 150px;
  height: 70px;
  background: rgba(50, 50, 70, 0.9);
  border-radius: 50%;
  filter: blur(3px);
}

.lightning-bolt {
  position: absolute;
  width: 20px;
  height: 60px;
  background: linear-gradient(to bottom, #ffeb3b, #ff9800);
  clip-path: polygon(50% 0%, 0% 100%, 30% 60%, 100% 100%, 70% 60%);
  opacity: 0;
  animation: lightning 0.5s linear infinite;
  z-index: 2;
}

.lightning-flash {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  opacity: 0;
  animation: flash 0.3s ease-out;
  z-index: 1;
}

@keyframes lightning {
  0%, 100% {
    opacity: 0;
  }
  10%, 30%, 50%, 70%, 90% {
    opacity: 1;
  }
  20%, 40%, 60%, 80% {
    opacity: 0;
  }
}

@keyframes flash {
  0% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
  }
}

/* Progress Bar */
.progress-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa, #38bdf8);
  border-radius: 10px;
  transition: width 0.1s ease;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.loading-text {
  color: #e2e8f0;
  font-size: 1.2rem;
  font-weight: 500;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

/* Responsive design */
@media (max-width: 768px) {
  .animation-container {
    width: 250px;
    height: 250px;
  }
  
  .sun {
    width: 100px;
    height: 100px;
  }
  
  .sun-core {
    width: 60px;
    height: 60px;
  }
  
  .sun-rays {
    width: 100px;
    height: 100px;
  }
  
  .loading-text {
    font-size: 1rem;
  }
}
</style>