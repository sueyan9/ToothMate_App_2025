import React from 'react';
import { useTranslation } from '../context/TranslationContext/useTranslation';
import HomeScreen from '../screens/HomeScreen';

const HomeScreenWrapper = ({ navigation, route }) => {
  const { t } = useTranslation();
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: t('Home'),
      tabBarLabel: t('Home'),
    });
  }, [navigation, t]);
  
  return <HomeScreen navigation={navigation} route={route} />;
};

export default HomeScreenWrapper;