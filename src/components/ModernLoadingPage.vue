<template>
  <div class="loading-page">
    <div class="loading-content">
      <div class="logo-container">
        <div class="logo">
          <div class="sun-icon"></div>
          <div class="cloud-icon"></div>
        </div>
      </div>
      <h1 class="app-title">{{ $t('weatherDashboard') }}</h1>
      <div class="loading-indicator">
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <p class="loading-text">{{ $t('loading') }}...</p>
      </div>
      <div class="weather-icons">
        <div class="icon sun"></div>
        <div class="icon cloud"></div>
        <div class="icon rain"></div>
        <div class="icon snow"></div>
      </div>
    </div>
    <div class="particles-container"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

onMounted(() => {
  // Create particles for background effect
  createParticles()
})

const createParticles = () => {
  const container = document.querySelector('.particles-container')
  if (!container) return
  
  // Clear existing particles
  container.innerHTML = ''
  
  // Create new particles
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div')
    particle.classList.add('particle')
    
    // Random position
    const left = Math.random() * 100
    const top = Math.random() * 100
    particle.style.left = `${left}%`
    particle.style.top = `${top}%`
    
    // Random size
    const size = Math.random() * 4 + 1
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    
    // Random animation duration
    const duration = Math.random() * 10 + 5
    particle.style.animationDuration = `${duration}s`
    
    // Random delay
    const delay = Math.random() * 5
    particle.style.animationDelay = `${delay}s`
    
    container.appendChild(particle)
  }
}
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--background-color);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
}

.loading-content {
  text-align: center;
  z-index: 2;
  max-width: 500px;
  padding: 30px;
  background: var(--glassmorphism-bg);
  border-radius: 30px;
  box-shadow: var(--glassmorphism-shadow);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glassmorphism-border);
  position: relative;
  overflow: hidden;
}

.loading-content::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  z-index: -1;
  border-radius: 33px;
  opacity: 0;
  transition: opacity 0.5s ease;
  animation: glowPulse 3s infinite alternate;
}

@keyframes glowPulse {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.15;
  }
}

.logo-container {
  margin-bottom: 30px;
}

.logo {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.sun-icon {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, var(--secondary-color), var(--primary-color));
  border-radius: 50%;
  filter: blur(10px);
  animation: sunPulse 2s infinite alternate;
}

.cloud-icon {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 70px;
  height: 30px;
  background: var(--border-color);
  border-radius: 50%;
  filter: blur(8px);
}

.app-title {
  color: var(--text-color);
  font-size: 2.5rem;
  margin: 0 0 40px 0;
  font-weight: 800;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
}

.loading-indicator {
  margin-bottom: 40px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.progress-fill {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: 6px;
  animation: progressFill 3s infinite ease-in-out;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
}

.loading-text {
  color: var(--text-secondary);
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
}

.weather-icons {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-top: 30px;
}

.icon {
  width: 40px;
  height: 40px;
  position: relative;
  opacity: 0.7;
  animation: float 3s infinite ease-in-out;
}

.icon.sun {
  background: radial-gradient(circle, #fbbf24, #f59e0b);
  border-radius: 50%;
  filter: blur(5px);
  animation-delay: 0s;
}

.icon.cloud {
  background: #94a3b8;
  border-radius: 50%;
  filter: blur(8px);
  animation-delay: 0.5s;
}

.icon.rain {
  background: #38bdf8;
  border-radius: 50%;
  filter: blur(6px);
  animation-delay: 1s;
}

.icon.snow {
  background: #ffffff;
  border-radius: 50%;
  filter: blur(7px);
  animation-delay: 1.5s;
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  background: var(--primary-color);
  border-radius: 50%;
  opacity: 0.3;
  animation: particleFloat linear infinite;
}

@keyframes sunPulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}

@keyframes progressFill {
  0% {
    width: 0%;
  }
  50% {
    width: 70%;
  }
  100% {
    width: 100%;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-100px) translateX(20px);
    opacity: 0;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .loading-content {
    padding: 25px;
    margin: 20px;
    border-radius: 25px;
  }
  
  .logo {
    width: 100px;
    height: 100px;
  }
  
  .sun-icon {
    top: 15px;
    left: 15px;
    width: 50px;
    height: 50px;
  }
  
  .cloud-icon {
    bottom: 15px;
    right: 15px;
    width: 60px;
    height: 25px;
  }
  
  .app-title {
    font-size: 2rem;
    margin-bottom: 30px;
  }
  
  .progress-bar {
    height: 10px;
    margin-bottom: 15px;
  }
  
  .loading-text {
    font-size: 1.1rem;
  }
  
  .weather-icons {
    gap: 20px;
    margin-top: 25px;
  }
  
  .icon {
    width: 35px;
    height: 35px;
  }
}

@media (max-width: 480px) {
  .loading-content {
    padding: 20px;
    border-radius: 20px;
  }
  
  .logo {
    width: 80px;
    height: 80px;
  }
  
  .sun-icon {
    top: 12px;
    left: 12px;
    width: 40px;
    height: 40px;
  }
  
  .cloud-icon {
    bottom: 12px;
    right: 12px;
    width: 50px;
    height: 20px;
  }
  
  .app-title {
    font-size: 1.8rem;
    margin-bottom: 25px;
  }
  
  .progress-bar {
    height: 8px;
    margin-bottom: 12px;
  }
  
  .loading-text {
    font-size: 1rem;
  }
  
  .weather-icons {
    gap: 15px;
    margin-top: 20px;
  }
  
  .icon {
    width: 30px;
    height: 30px;
  }
}
</style>