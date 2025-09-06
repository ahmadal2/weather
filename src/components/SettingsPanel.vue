<template>
  <div class="settings-panel">
    <h3>Settings</h3>
    <div class="setting-group">
      <label for="default-location">{{ $t('defaultLocation') }}</label>
      <input 
        id="default-location"
        type="text" 
        v-model="defaultLocation"
        :placeholder="$t('defaultLocation')"
        @change="saveSettings"
      >
    </div>
    
    <div class="setting-group">
      <label for="temperature-unit">{{ $t('temperatureUnit') }}</label>
      <select 
        id="temperature-unit"
        v-model="temperatureUnit"
        @change="saveSettings"
      >
        <option value="celsius">{{ $t('celsius') }}</option>
        <option value="fahrenheit">{{ $t('fahrenheit') }}</option>
        <option value="kelvin">{{ $t('kelvin') }}</option>
      </select>
    </div>
    
    <div class="setting-group">
      <label for="language">{{ $t('language') }}</label>
      <select 
        id="language"
        v-model="selectedLanguage"
        @change="changeLanguage"
      >
        <option value="en">{{ $t('language', {}, { locale: 'en' }) }}</option>
        <option value="ar">{{ $t('language', {}, { locale: 'ar' }) }}</option>
        <option value="de">{{ $t('language', {}, { locale: 'de' }) }}</option>
      </select>
    </div>
    
    <div class="setting-group">
      <label class="checkbox-label">
        <input 
          type="checkbox" 
          v-model="enableNotifications"
          @change="saveSettings"
        >
        <span>{{ $t('enableWeatherAlerts') }}</span>
      </label>
    </div>
    
    <div class="setting-group">
      <label class="checkbox-label">
        <input 
          type="checkbox" 
          v-model="darkMode"
          @change="saveSettings"
        >
        <span>{{ $t('darkMode') }}</span>
      </label>
    </div>
    
    <button @click="resetSettings" class="reset-button">{{ $t('resetToDefaults') }}</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

// Settings state
const defaultLocation = ref('London')
const temperatureUnit = ref('celsius')
const enableNotifications = ref(true)
const darkMode = ref(false)
const selectedLanguage = ref('en')

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
    // Set the app language
    locale.value = selectedLanguage.value
  } else {
    // Set default language based on browser
    selectedLanguage.value = locale.value
  }
}

// Save settings to localStorage
const saveSettings = () => {
  const settings = {
    defaultLocation: defaultLocation.value,
    temperatureUnit: temperatureUnit.value,
    enableNotifications: enableNotifications.value,
    darkMode: darkMode.value,
    language: selectedLanguage.value
  }
  localStorage.setItem('weatherSettings', JSON.stringify(settings))
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
  background: rgba(30, 41, 59, 0.8);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.settings-panel h3 {
  margin: 0 0 15px 0;
  color: #e2e8f0;
  font-size: 1.3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.setting-group {
  margin-bottom: 15px;
}

.setting-group label {
  display: block;
  margin-bottom: 5px;
  color: #e2e8f0;
  font-weight: 500;
}

.setting-group input[type="text"],
.setting-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  font-size: 1rem;
  background: rgba(15, 23, 42, 0.5);
  color: #e2e8f0;
}

.setting-group input[type="text"]:focus,
.setting-group select:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3);
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #e2e8f0;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 10px;
  transform: scale(1.2);
  accent-color: #60a5fa;
}

.reset-button {
  background: linear-gradient(135deg, #f87171, #fb7185);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  font-weight: bold;
  transition: all 0.3s ease;
}

.reset-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>