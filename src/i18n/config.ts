import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Importar traduções
import translationPT from './locales/pt-BR.json'
import translationEN from './locales/en.json'
import translationES from './locales/es.json'
import translationFR from './locales/fr.json'
import translationTR from './locales/tr.json'
import translationAR from './locales/ar.json'

const resources = {
  'pt-BR': {
    translation: translationPT
  },
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  },
  fr: {
    translation: translationFR
  },
  tr: {
    translation: translationTR
  },
  ar: {
    translation: translationAR
  }
}

i18n
  .use(LanguageDetector) // Detecta idioma do navegador
  .use(initReactI18next) // Passa i18n para react-i18next
  .init({
    resources,
    fallbackLng: 'pt-BR', // Idioma padrão
    lng: 'pt-BR', // Idioma inicial
    debug: false,

    interpolation: {
      escapeValue: false // React já faz escape
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  })

export default i18n
