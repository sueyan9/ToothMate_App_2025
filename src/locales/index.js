import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import ko from './ko.json'; // Add Korean import

// Language detector
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    AsyncStorage.getItem('user-language').then(language => {
      if (language) {
        callback(language);
      } else {
        callback('en');
      }
    });
  },
  init: () => {},
  cacheUserLanguage: (language) => {
    AsyncStorage.setItem('user-language', language);
  }
};

// Initialize i18next
i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
      fr: {
        translation: fr,
      },
      ko: { // Add Korean resource
        translation: ko,
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    compatibilityJSON: 'v3', // For React Native compatibility
  });

export { i18n };
export default i18n;