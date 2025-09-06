<template>
  <div class="alert-card" :class="alertClass">
    <div class="alert-header">
      <h3 class="alert-title">{{ alert.event }}</h3>
      <span class="alert-severity" :class="severityClass">{{ severityLabel }}</span>
    </div>
    <div class="alert-body">
      <p class="alert-description">{{ alert.description }}</p>
      <div class="alert-meta">
        <span class="alert-date">
          <i class="icon-calendar"></i>
          {{ formatDate(alert.start) }} - {{ formatDate(alert.end) }}
        </span>
        <span class="alert-source">
          <i class="icon-source"></i>
          {{ alert.sender_name || 'Weather Authority' }}
        </span>
      </div>
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

// Format date function
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Determine alert class based on severity
const severityClass = computed(() => {
  const severity = props.alert.tags?.[0] || 'warning'
  return `severity-${severity.toLowerCase()}`
})

// Determine alert class based on severity
const alertClass = computed(() => {
  const severity = props.alert.tags?.[0] || 'warning'
  return `alert-${severity.toLowerCase()}`
})

// Get severity label
const severityLabel = computed(() => {
  const severity = props.alert.tags?.[0] || 'Warning'
  return severity.charAt(0).toUpperCase() + severity.slice(1)
})
</script>

<style scoped>
.alert-card {
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-left: 4px solid;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.alert-warning {
  border-left-color: #fbbf24;
}

.alert-watch {
  border-left-color: #60a5fa;
}

.alert-advisory {
  border-left-color: #a78bfa;
}

.alert-statement {
  border-left-color: #34d399;
}

.alert-alert {
  border-left-color: #f87171;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.alert-title {
  margin: 0;
  font-size: 1.2rem;
  color: #e2e8f0;
}

.alert-severity {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.severity-warning {
  background-color: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.severity-watch {
  background-color: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.3);
}

.severity-advisory {
  background-color: rgba(167, 139, 250, 0.2);
  color: #a78bfa;
  border: 1px solid rgba(167, 139, 250, 0.3);
}

.severity-statement {
  background-color: rgba(52, 211, 153, 0.2);
  color: #34d399;
  border: 1px solid rgba(52, 211, 153, 0.3);
}

.severity-alert {
  background-color: rgba(248, 113, 113, 0.2);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.alert-body {
  margin-top: 10px;
}

.alert-description {
  margin: 0 0 15px 0;
  color: #cbd5e1;
  line-height: 1.5;
}

.alert-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #94a3b8;
}

.alert-date, .alert-source {
  display: flex;
  align-items: center;
  gap: 5px;
}

.icon-calendar, .icon-source {
  font-size: 1.2em;
}
</style>
