import { useContext, useEffect, useState } from 'react';
import { Context as TranslationContext } from './TranslationContext';

// Import local translation files
import enTranslations from '../../locales/en.json';
import esTranslations from '../../locales/es.json';
import miTranslations from '../../locales/mi.json';
import nlTranslations from '../../locales/nl.json';
import zhTranslations from '../../locales/zh.json';

// Language mappings for DeepL API
const LANGUAGE_CODES = {
  'English': 'en',
  'Spanish': 'es',
  'Chinese': 'zh',
  'Dutch': 'nl',
  'Maori': 'mi'
};

const LANGUAGE_DISPLAY_NAMES = {
  'en': 'English',
  'es': 'Spanish', 
  'zh': 'Chinese',
  'nl': 'Dutch',
  'mi': 'Maori'
};

// Local translations for all supported languages
const LOCAL_TRANSLATIONS = {
  'en': enTranslations,
  'es': esTranslations,
  'zh': zhTranslations,
  'nl': nlTranslations,
  'mi': miTranslations
};

export const useTranslation = () => {
  const { 
    state: { currentLanguage, translations, isLoading, error }, 
    translateText, 
    setLanguage, 
    loadLanguagePreference 
  } = useContext(TranslationContext);

  const [translatedTexts, setTranslatedTexts] = useState({});

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  // Clear local translations when language changes
  useEffect(() => {
    setTranslatedTexts({});
  }, [currentLanguage]);

  const t = (text) => {
    if (currentLanguage === 'en') {
      return text;
    }
    
    // Check local translations first (for languages like Maori)
    if (LOCAL_TRANSLATIONS[currentLanguage] && LOCAL_TRANSLATIONS[currentLanguage][text]) {
      return LOCAL_TRANSLATIONS[currentLanguage][text];
    }
    
    // Check context translations (from DeepL), then local cache
    return translations[currentLanguage]?.[text] || translatedTexts[text] || text;
  };

  const translateAndCache = async (texts) => {
    if (currentLanguage === 'en') {
      return;
    }

    // If local translations are available (like for Maori), don't use API translation
    if (LOCAL_TRANSLATIONS[currentLanguage]) {
      console.log(`Using local translations for ${currentLanguage}`);
      return;
    }

    try {
      const translatedResults = await translateText(texts, currentLanguage);
      const newTranslations = {};
      texts.forEach((text, index) => {
        newTranslations[text] = translatedResults[index];
      });
      
      // Update local state immediately for faster UI updates
      setTranslatedTexts(prev => ({ ...prev, ...newTranslations }));
    } catch (error) {
      console.error('Translation failed:', error);
    }
  };

  const changeLanguage = async (language) => {
    await setLanguage(language);
  };

  const getAvailableLanguages = () => {
    return Object.keys(LANGUAGE_CODES);
  };

  const getCurrentLanguageDisplay = () => {
    return LANGUAGE_DISPLAY_NAMES[currentLanguage] || 'English';
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    translateAndCache,
    getAvailableLanguages,
    getCurrentLanguageDisplay,
    isLoading,
    error,
    LANGUAGE_CODES
  };
};
