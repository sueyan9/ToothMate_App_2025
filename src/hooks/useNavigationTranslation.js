import { useFocusEffect } from '@react-navigation/native';
import { useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext/useTranslation';

export const useNavigationTranslation = (navigation, screenOptions) => {
  const { currentLanguage, t } = useTranslation();
  
  useEffect(() => {
    if (navigation && screenOptions) {
      navigation.setOptions(screenOptions(t));
    }
  }, [currentLanguage, navigation, screenOptions, t]);
  
  useFocusEffect(() => {
    if (navigation && screenOptions) {
      navigation.setOptions(screenOptions(t));
    }
  });
};