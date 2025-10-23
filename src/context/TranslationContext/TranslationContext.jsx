import { DEEPL_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import createDataContext from '../createDataContext';

const translationReducer = (state, action) => {
  switch (action.type) {
    case 'set_language':
      return { ...state, currentLanguage: action.payload };
    case 'set_translations':
      return { 
        ...state, 
        translations: { 
          ...state.translations, 
          [action.payload.language]: action.payload.translations 
        } 
      };
    case 'set_loading':
      return { ...state, isLoading: action.payload };
    case 'set_error':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const setLanguage = (dispatch) => async (language) => {
  try {
    await AsyncStorage.setItem('selectedLanguage', language);
    dispatch({ type: 'set_language', payload: language });
  } catch (error) {
    console.error('Error saving language preference:', error);
  }
};

const translateText = (dispatch) => async (texts, targetLanguage) => {
  if (targetLanguage === 'en') {
    // No translation needed for English
    return texts;
  }

  try {
  //  dispatch({ type: 'set_loading', payload: true });
    dispatch({ type: 'set_error', payload: null });

    // Convert language code to DeepL format
    let deeplLangCode = targetLanguage.toUpperCase();
    if (targetLanguage === 'es') {
      deeplLangCode = 'ES'; // Spanish
    } else if (targetLanguage === 'zh') {
      deeplLangCode = 'ZH'; // Chinese (simplified)
    } else if (targetLanguage === 'nl') {
      deeplLangCode = 'NL'; // Dutch
    } else if (targetLanguage === 'mi') {
      // Maori is not supported by DeepL, return original texts
      console.log('Maori language not supported by DeepL API, returning original texts');
      return texts;
    }

    console.log('Translating to:', deeplLangCode);
    console.log('API Key exists:', !!DEEPL_API_KEY);
    console.log('Texts to translate:', texts);

    // Create form data for the request
    const params = new URLSearchParams();
    
    // Filter out empty or invalid texts
    const validTexts = texts.filter(text => text && text.trim().length > 0);
    if (validTexts.length === 0) {
      console.warn('No valid texts to translate');
      return texts;
    }
    
    validTexts.forEach(text => {
      params.append('text', text.trim());
    });
    params.append('target_lang', deeplLangCode);
    params.append('source_lang', 'EN');

    const response = await axios.post(
      'https://api-free.deepl.com/v2/translate',
      params.toString(),
      {
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log('Translation response:', response.data);

    const translations = response.data.translations.map(t => t.text);
    
    dispatch({ 
      type: 'set_translations', 
      payload: { 
        language: targetLanguage, 
        translations: texts.reduce((acc, text, index) => {
          acc[text] = translations[index];
          return acc;
        }, {})
      }
    });

    return translations;
  } catch (error) {
    console.error('Translation error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    // Provide more specific error messages
    let errorMessage = error.message;
    if (error.response?.status === 400) {
      errorMessage = 'Translation request failed: Invalid parameters or unsupported language';
    } else if (error.response?.status === 403) {
      errorMessage = 'Translation failed: API key is invalid or expired';
    } else if (error.response?.status === 456) {
      errorMessage = 'Translation failed: Usage limit reached';
    }
    
    dispatch({ type: 'set_error', payload: errorMessage });
    return texts; // Return original texts if translation fails
  } finally {
   // dispatch({ type: 'set_loading', payload: false });
  }
};

const loadLanguagePreference = (dispatch) => async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      dispatch({ type: 'set_language', payload: savedLanguage });
    }
  } catch (error) {
    console.error('Error loading language preference:', error);
  }
};

export const { Context, Provider } = createDataContext(
  translationReducer,
  { setLanguage, translateText, loadLanguagePreference },
  {
    currentLanguage: 'en', // Default to English
    translations: {},
    isLoading: false,
    error: null
  }
);
