import { useContext, useEffect, useState } from 'react';
import { Context as TranslationContext } from './TranslationContext';

// Language mappings for DeepL API
const LANGUAGE_CODES = {
  'English': 'en',
  'Spanish': 'es',
  'Chinese': 'zh'
};

const LANGUAGE_DISPLAY_NAMES = {
  'en': 'English',
  'es': 'Spanish', 
  'zh': 'Chinese'
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
    
    // Check context translations first, then local cache
    return translations[currentLanguage]?.[text] || translatedTexts[text] || text;
  };

  const translateAndCache = async (texts) => {
    if (currentLanguage === 'en') {
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
