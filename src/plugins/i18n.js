import { createI18n } from 'vue-i18n'
import ar from '../locales/ar.js'
import en from '../locales/en.js'
import de from '../locales/de.js'

const messages = {
  ar,
  en,
  de
}

// Determine default locale from browser or fallback to English
const getBrowserLocale = () => {
  const locale = navigator.language || navigator.userLanguage || 'en'
  // Extract language code (e.g., 'en' from 'en-US')
  const langCode = locale.split('-')[0].toLowerCase()
  
  // Check if we support this language, otherwise default to English
  return ['ar', 'en', 'de'].includes(langCode) ? langCode : 'en'
}

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: getBrowserLocale(), // Set locale based on browser
  fallbackLocale: 'en', // Set fallback locale
  messages, // Set locale messages
  globalInjection: true // Enable global injection
})

export default i18n