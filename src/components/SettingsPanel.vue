<template>
  <div class="settings-panel glass-card">
    <h3 class="section-title">{{ $t('settings') }}</h3>
    
    <!-- Theme Selection -->
    <div class="setting-group">
      <label class="setting-label">{{ $t('theme') }}</label>
      <div class="theme-options">
        <button 
          v-for="theme in themes" 
          :key="theme.value"
          :class="['theme-button', { active: selectedTheme === theme.value }]"
          :style="{ backgroundColor: theme.color }"
          @click="selectTheme(theme.value)"
          :title="theme.name"
        >
          {{ theme.name.charAt(0) }}
        </button>
      </div>
      <div class="theme-preview">
        <div 
          class="preview-card" 
          :style="{ 
            background: `linear-gradient(135deg, ${getThemeColor(selectedTheme, 'primary')}, ${getThemeColor(selectedTheme, 'secondary')})`
          }"
        >
          <span>{{ $t('themePreview') }}</span>
        </div>
      </div>
    </div>
    
    <div class="setting-group">
      <label for="default-location" class="setting-label">{{ $t('defaultLocation') }}</label>
      <input 
        id="default-location"
        type="text" 
        v-model="defaultLocation"
        :placeholder="$t('defaultLocation')"
        @change="saveSettings"
        class="modern-input"
      >
    </div>
    
    <div class="setting-group">
      <label for="temperature-unit" class="setting-label">{{ $t('temperatureUnit') }}</label>
      <select 
        id="temperature-unit"
        v-model="temperatureUnit"
        @change="saveSettings"
        class="modern-select"
      >
        <option value="celsius">{{ $t('celsius') }}</option>
        <option value="fahrenheit">{{ $t('fahrenheit') }}</option>
        <option value="kelvin">{{ $t('kelvin') }}</option>
      </select>
    </div>
    
    <div class="setting-group">
      <label for="language" class="setting-label">{{ $t('language') }}</label>
      <select 
        id="language"
        v-model="selectedLanguage"
        @change="changeLanguage"
        class="modern-select"
      >
        <option value="en">{{ $t('language', {}, { locale: 'en' }) }}</option>
        <option value="ar">{{ $t('language', {}, { locale: 'ar' }) }}</option>
        <option value="de">{{ $t('language', {}, { locale: 'de' }) }}</option>
      </select>
    </div>
    
    <div class="setting-group checkbox-group">
      <label class="checkbox-label">
        <input 
          type="checkbox" 
          v-model="enableNotifications"
          @change="saveSettings"
        >
        <span>{{ $t('enableWeatherAlerts') }}</span>
      </label>
    </div>
    
    <div class="setting-group checkbox-group">
      <label class="checkbox-label">
        <input 
          type="checkbox" 
          v-model="darkMode"
          @change="saveSettings"
        >
        <span>{{ $t('darkMode') }}</span>
      </label>
    </div>
    
    <div class="setting-group checkbox-group">
      <label class="checkbox-label">
        <input 
          type="checkbox" 
          v-model="animationsEnabled"
          @change="saveSettings"
        >
        <span>{{ $t('enableAnimations') }}</span>
      </label>
    </div>
    
    <button @click="resetSettings" class="modern-button secondary" style="width: 100%; margin-top: 25px;">{{ $t('resetToDefaults') }}</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

// Theme options with enhanced colors for 2026
const themes = [
  { name: 'Black', value: 'black', color: '#000000', primary: '#000000', secondary: '#333333' },
  { name: 'White', value: 'white', color: '#ffffff', primary: '#ffffff', secondary: '#f0f0f0' },
  { name: 'Blue', value: 'blue', color: '#3b82f6', primary: '#3b82f6', secondary: '#60a5fa' },
  { name: 'Orange', value: 'orange', color: '#f97316', primary: '#f97316', secondary: '#fb923c' },
  { name: 'Green', value: 'green', color: '#10b981', primary: '#10b981', secondary: '#34d399' },
  { name: 'Purple', value: 'purple', color: '#8b5cf6', primary: '#8b5cf6', secondary: '#a78bfa' },
  { name: 'Pink', value: 'pink', color: '#ec4899', primary: '#ec4899', secondary: '#f472b6' }
]

// Settings state
const defaultLocation = ref('London')
const temperatureUnit = ref('celsius')
const enableNotifications = ref(true)
const darkMode = ref(false)
const selectedLanguage = ref('en')
const selectedTheme = ref('blue')
const animationsEnabled = ref(true)

// Get theme color
const getThemeColor = (themeValue, colorType) => {
  const theme = themes.find(t => t.value === themeValue)
  return theme ? theme[colorType] : '#3b82f6'
}

// Load settings from localStorage
const loadSettings = () => {
  const savedSettings = localStorage.getItem('weatherSettings')
  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    defaultLocation.value = settings.defaultLocation || 'London'
    temperatureUnit.value = settings.temperatureUnit || 'celsius'
    enableNotifications.value = settings.enableNotifications !== false
    darkMode.value = settings.darkMode || false
    selectedLanguage.value = settings.language || 'en'
    selectedTheme.value = settings.theme || 'blue'
    animationsEnabled.value = settings.animationsEnabled !== false
    // Apply theme
    applyTheme(selectedTheme.value)
    // Set the app language
    locale.value = selectedLanguage.value
  } else {
    // Set default language based on browser
    selectedLanguage.value = locale.value
    // Apply default theme
    applyTheme(selectedTheme.value)
  }
}

// Save settings to localStorage
const saveSettings = () => {
  const settings = {
    defaultLocation: defaultLocation.value,
    temperatureUnit: temperatureUnit.value,
    enableNotifications: enableNotifications.value,
    darkMode: darkMode.value,
    language: selectedLanguage.value,
    theme: selectedTheme.value,
    animationsEnabled: animationsEnabled.value
  }
  localStorage.setItem('weatherSettings', JSON.stringify(settings))
  applyTheme(selectedTheme.value)
}

// Apply theme to the document
const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
}

// Select theme
const selectTheme = (theme) => {
  selectedTheme.value = theme
  saveSettings()
}

// Change language
const changeLanguage = () => {
  locale.value = selectedLanguage.value
  saveSettings()
}

// Reset settings to defaults
const resetSettings = () => {
  defaultLocation.value = 'London'
  temperatureUnit.value = 'celsius'
  enableNotifications.value = true
  darkMode.value = false
  selectedLanguage.value = 'en'
  selectedTheme.value = 'blue'
  animationsEnabled.value = true
  locale.value = 'en'
  saveSettings()
}

// Load settings on component mount
onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.settings-panel {
  background: var(--glassmorphism-bg);
  border-radius: 24px;
  padding: 35px;
  box-shadow: var(--glassmorphism-shadow);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glassmorphism-border);
  position: relative;
  overflow: hidden;
}

.settings-panel::before {
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

.settings-panel:hover::before {
  opacity: 0.1;
}

.section-title {
  margin: 0 0 30px 0;
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

.setting-group {
  margin-bottom: 25px;
}

.setting-label {
  display: block;
  margin-bottom: 12px;
  color: var(--text-color);
  font-weight: 600;
  font-size: 1.1rem;
}

.modern-input,
.modern-select {
  width: 100%;
  padding: 16px 20px;
  border-radius: 18px;
  border: 1px solid var(--glassmorphism-border);
  background: rgba(15, 23, 42, 0.4);
  color: var(--text-color);
  font-size: 1.05rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modern-input:focus,
.modern-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.modern-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 18px center;
  background-size: 22px;
}

.checkbox-group {
  margin: 30px 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--text-color);
  font-weight: 500;
  font-size: 1.05rem;
  gap: 15px;
  position: relative;
  padding-left: 35px;
}

.checkbox-label input[type="checkbox"] {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  accent-color: var(--primary-color);
  cursor: pointer;
  border-radius: 6px;
}

/* Theme options styling */
.theme-options {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 25px;
}

.theme-button {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: 2px solid var(--glassmorphism-border);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.3rem;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
}

.theme-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.theme-button:hover {
  transform: scale(1.15);
  border-color: var(--text-color);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.theme-button:hover::before {
  opacity: 1;
}

.theme-button.active {
  border-color: var(--text-color);
  box-shadow: 0 0 0 4px var(--primary-color), 0 8px 25px rgba(0, 0, 0, 0.4);
  transform: scale(1.15);
}

/* Theme preview */
.theme-preview {
  margin-top: 15px;
}

.preview-card {
  width: 100%;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.preview-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preview-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
}

.preview-card:hover::before {
  opacity: 1;
}

/* Enhanced responsive design */
@media (max-width: 768px) {
  .settings-panel {
    padding: 30px;
  }
  
  .section-title {
    font-size: 1.6rem;
    margin-bottom: 25px;
  }
  
  .setting-group {
    margin-bottom: 22px;
  }
  
  .setting-label {
    font-size: 1rem;
    margin-bottom: 10px;
  }
  
  .modern-input,
  .modern-select {
    padding: 14px 18px;
    font-size: 1rem;
  }
  
  .checkbox-label {
    font-size: 1rem;
    gap: 12px;
  }
  
  .theme-button {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .preview-card {
    height: 70px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .settings-panel {
    padding: 25px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .setting-group {
    margin-bottom: 20px;
  }
  
  .setting-label {
    font-size: 0.95rem;
  }
  
  .modern-input,
  .modern-select {
    padding: 12px 16px;
    font-size: 0.95rem;
  }
  
  .checkbox-label {
    font-size: 0.95rem;
    gap: 10px;
  }
  
  .theme-button {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
  
  .preview-card {
    height: 60px;
    font-size: 0.95rem;
  }
}
</style>