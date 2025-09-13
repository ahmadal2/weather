<template>
  <div class="weather-alert glass-card" :class="alertClass">
    <div class="alert-header">
      <div class="alert-icon">{{ alertIcon }}</div>
      <div class="alert-title">
        <h4>{{ alert.event }}</h4>
        <p class="alert-dates">
          {{ formatDate(alert.start) }} - {{ formatDate(alert.end) }}
        </p>
      </div>
    </div>
    <div class="alert-content">
      <p class="alert-description">{{ alert.description }}</p>
      <div class="alert-tags">
        <span class="tag severity">{{ alert.severity }}</span>
        <span class="tag category">{{ alert.category }}</span>
      </div>
    </div>
    <div class="alert-footer">
      <div class="sender">{{ alert.sender_name }}</div>
      <button class="modern-button secondary dismiss-button" @click="dismissAlert">
        {{ $t('dismiss') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  alert: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['dismiss'])

// Alert icon based on severity
const alertIcon = computed(() => {
  switch (props.alert.severity.toLowerCase()) {
    case 'extreme':
      return '🔴'
    case 'severe':
      return '🟠'
    case 'moderate':
      return '🟡'
    case 'minor':
      return '🟢'
    default:
      return '🔵'
  }
})

// Alert class based on severity
const alertClass = computed(() => {
  return `alert-${props.alert.severity.toLowerCase()}`
})

// Format date
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString()
}

// Dismiss alert
const dismissAlert = () => {
  emit('dismiss', props.alert)
}
</script>

<style scoped>
.weather-alert {
  background: var(--glassmorphism-bg);
  border-radius: 24px;
  padding: 30px;
  box-shadow: var(--glassmorphism-shadow);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glassmorphism-border);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  margin-bottom: 25px;
}

.weather-alert::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  z-index: -1;
  border-radius: 26px;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.weather-alert:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
}

.weather-alert:hover::before {
  opacity: 0.1;
}

/* Severity-based styling */
.alert-extreme {
  border-color: rgba(239, 68, 68, 0.5);
}

.alert-extreme::before {
  background: linear-gradient(45deg, #ef4444, #f87171);
}

.alert-severe {
  border-color: rgba(249, 115, 22, 0.5);
}

.alert-severe::before {
  background: linear-gradient(45deg, #f97316, #fb923c);
}

.alert-moderate {
  border-color: rgba(234, 179, 8, 0.5);
}

.alert-moderate::before {
  background: linear-gradient(45deg, #eab308, #facc15);
}

.alert-minor {
  border-color: rgba(34, 197, 94, 0.5);
}

.alert-minor::before {
  background: linear-gradient(45deg, #22c55e, #4ade80);
}

.alert-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: flex-start;
}

.alert-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
  animation: pulseGlow 2s infinite alternate;
}

.alert-title h4 {
  color: var(--text-color);
  font-size: 1.5rem;
  margin: 0 0 8px 0;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.alert-dates {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: 0;
  font-weight: 500;
}

.alert-content {
  margin-bottom: 25px;
}

.alert-description {
  color: var(--text-color);
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 0 20px 0;
  font-weight: 400;
}

.alert-tags {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.tag {
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.severity {
  background: rgba(239, 68, 68, 0.2);
  color: #fecaca;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.category {
  background: rgba(59, 130, 246, 0.2);
  color: #bfdbfe;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.alert-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--glassmorphism-border);
  padding-top: 20px;
}

.sender {
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
}

.dismiss-button {
  padding: 10px 20px;
  font-size: 0.95rem;
}

@keyframes pulseGlow {
  0% {
    filter: drop-shadow(0 0 5px currentColor);
  }
  100% {
    filter: drop-shadow(0 0 15px currentColor);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .weather-alert {
    padding: 25px;
    margin-bottom: 20px;
  }
  
  .alert-header {
    gap: 15px;
  }
  
  .alert-icon {
    font-size: 2rem;
  }
  
  .alert-title h4 {
    font-size: 1.3rem;
  }
  
  .alert-dates {
    font-size: 0.9rem;
  }
  
  .alert-description {
    font-size: 1rem;
    margin-bottom: 15px;
  }
  
  .alert-tags {
    gap: 12px;
  }
  
  .tag {
    padding: 6px 14px;
    font-size: 0.85rem;
  }
  
  .alert-footer {
    padding-top: 15px;
  }
  
  .sender {
    font-size: 0.95rem;
  }
  
  .dismiss-button {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .weather-alert {
    padding: 20px;
  }
  
  .alert-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .alert-icon {
    font-size: 1.8rem;
    margin: 0 auto;
  }
  
  .alert-title h4 {
    font-size: 1.2rem;
  }
  
  .alert-dates {
    font-size: 0.85rem;
  }
  
  .alert-description {
    font-size: 0.95rem;
  }
  
  .alert-tags {
    justify-content: center;
  }
  
  .tag {
    padding: 5px 12px;
    font-size: 0.8rem;
  }
  
  .alert-footer {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .sender {
    font-size: 0.9rem;
  }
}
</style>