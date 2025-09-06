<template>
  <div class="loading-page">
    <div class="loading-container">
      <div class="animation-stage">
        <!-- Sun Animation -->
        <transition name="fade" mode="out-in">
          <div v-if="currentStage === 1" key="sun" class="sun-stage">
            <div class="sun">
              <div class="sun-core"></div>
              <div class="sun-rays"></div>
            </div>
          </div>
          
          <!-- Clouds Animation -->
          <div v-else-if="currentStage === 2" key="clouds" class="clouds-stage">
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
            <div class="cloud cloud-3"></div>
          </div>
          
          <!-- Wind Animation -->
          <div v-else-if="currentStage === 3" key="wind" class="wind-stage">
            <div class="wind-lines">
              <div class="wind-line wind-line-1"></div>
              <div class="wind-line wind-line-2"></div>
              <div class="wind-line wind-line-3"></div>
            </div>
            <div class="wind-swirl"></div>
          </div>
          
          <!-- Rain Animation -->
          <div v-else-if="currentStage === 4" key="rain" class="rain-stage">
            <div class="rain-cloud"></div>
            <div class="raindrops">
              <div class="raindrop raindrop-1"></div>
              <div class="raindrop raindrop-2"></div>
              <div class="raindrop raindrop-3"></div>
              <div class="raindrop raindrop-4"></div>
              <div class="raindrop raindrop-5"></div>
            </div>
          </div>
          
          <!-- Lightning Animation -->
          <div v-else-if="currentStage === 5" key="lightning" class="lightning-stage">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentStage = ref(1)
const progress = ref(0)
const currentText = ref(t('warmingUpSun'))

// Stage texts
const stageTexts = {
  1: 'warmingUpSun',
  2: 'gatheringClouds',
  3: 'collectingWind',
  4: 'collectingRaindrops',
  5: 'chargingLightning'
}

// Update progress and text
const updateStage = () => {
  if (currentStage.value < 5) {
    currentStage.value++
    progress.value = currentStage.value * 20
    currentText.value = t(stageTexts[currentStage.value])
  } else {
    // Reset to beginning if needed
    currentStage.value = 1
    progress.value = 20
    currentText.value = t(stageTexts[1])
  }
}

// Set up interval for stage transitions
onMounted(() => {
  // Initialize progress
  progress.value = 20
  
  // Set interval for stage transitions (2 seconds per stage)
  setInterval(updateStage, 2000)
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
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  width: 100%;
  max-width: 500px;
  padding: 20px;
}

.animation-stage {
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Sun Stage */
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
  z-index: 2;
  animation: pulse 2s infinite ease-in-out;
}

.sun-rays {
  position: absolute;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(255, 235, 59, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  animation: rotate 20s linear infinite;
  z-index: 1;
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

/* Clouds Stage */
.clouds-stage {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.cloud {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  position: absolute;
  filter: blur(2px);
}

.cloud-1 {
  width: 70px;
  height: 30px;
  top: 40%;
  left: 30%;
  animation: float 4s ease-in-out infinite;
}

.cloud-2 {
  width: 100px;
  height: 40px;
  top: 50%;
  left: 50%;
  animation: float 5s ease-in-out infinite 0.5s;
}

.cloud-3 {
  width: 80px;
  height: 35px;
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

/* Wind Stage */
.wind-stage {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.wind-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0 20px;
}

.wind-line {
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
  border-radius: 2px;
}

.wind-line-1 {
  animation: windFlow 3s linear infinite 0s;
}

.wind-line-2 {
  animation: windFlow 3s linear infinite 0.5s;
}

.wind-line-3 {
  animation: windFlow 3s linear infinite 1s;
}

.wind-swirl {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  border-top-color: transparent;
  border-left-color: transparent;
  animation: swirl 2s linear infinite;
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

/* Rain Stage */
.rain-stage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.rain-cloud {
  width: 120px;
  height: 50px;
  background: rgba(100, 100, 100, 0.8);
  border-radius: 50%;
  position: relative;
  top: 30px;
  filter: blur(2px);
}

.raindrops {
  position: relative;
  top: -20px;
  display: flex;
  justify-content: space-around;
  width: 120px;
}

.raindrop {
  width: 4px;
  height: 15px;
  background: linear-gradient(to bottom, #64b5f6, #1976d2);
  border-radius: 0 0 50% 50%;
  animation: fall 1.5s linear infinite;
}

.raindrop-1 {
  animation-delay: 0s;
}

.raindrop-2 {
  animation-delay: 0.2s;
}

.raindrop-3 {
  animation-delay: 0.4s;
}

.raindrop-4 {
  animation-delay: 0.6s;
}

.raindrop-5 {
  animation-delay: 0.8s;
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

/* Lightning Stage */
.lightning-stage {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.storm-cloud {
  width: 150px;
  height: 70px;
  background: rgba(30, 30, 40, 0.9);
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
}

.lightning-flash {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  opacity: 0;
  animation: flash 0.3s ease-out;
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
  transition: width 0.5s ease;
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
  .animation-stage {
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