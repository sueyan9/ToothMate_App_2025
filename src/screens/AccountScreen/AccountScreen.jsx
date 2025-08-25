import React, { useContext, useState, useEffect } from 'react';
import { Text, View, FlatList, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import ToothLogo from '../../assets/t_logo_crop2.png';
import LoadingScreen from '../LoadingScreen';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const AccountScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const {
    state: { children, errorMessage },
    signout,
    getChildAccounts,
  } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Righteous_400Regular,
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        await getChildAccounts();
        setLoading(false);
      };

      fetchData();

      return () => {
      };
    }, [])
  );

  const renderChildButton = child => (
    <Button
      title={child.item.firstname}
      buttonStyle={styles.childButtonStyle}
      titleStyle={styles.childTextStyle}
      onPress={async () => {
        const parentId = await AsyncStorage.getItem('id');
        await AsyncStorage.setItem('parentId', await AsyncStorage.getItem('id'));
        await AsyncStorage.setItem('id', child.item._id);
        if (global.webViewRef && global.webViewRef.current) {
          global.webViewRef.current.postMessage('childMode');
        }

        navigation.navigate('childFlow');
      }}
    />
  );

  // Child Account Buttons that appear on Screen
  const childButtons = !errorMessage ? (
    <FlatList data={children} keyExtractor={child => child._id} renderItem={renderChildButton} />
  ) : null;

  if (loading || !fontsLoaded) {
    return <LoadingScreen showTooth />;
  }

  return (
    <LinearGradient colors={['#7ad0f5', 'white', '#7ad0f5']} style={styles.container}>
      {/* Add this view for the language switcher */}
      <View style={{ position: 'absolute', top: 40, right: 20, zIndex: 10 }}>
        <LanguageSwitcher />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.header}>ToothMate</Text>
        <ImageBackground source={ToothLogo} style={styles.imageBackgroundStyle}>
          <View style={styles.topButtonViewStyle}>
            <Button
              buttonStyle={styles.button}
              title={t('account.settings')}
              onPress={() => navigation.navigate('UserAccount')}
              titleStyle={styles.titleContainer}
            />
            <Button
              buttonStyle={styles.button}
              title={t('account.signupChild')}
              onPress={() => navigation.navigate('signUpChildFlow')}
              titleStyle={styles.titleContainer}
            />
          </View>
        </ImageBackground>
        <View style={{ flex: 3, borderBottomWidth: 3, marginTop: '0%' }}>
          {children && children.length > 0 ? <Text style={styles.yourAccountStyle}>{t('account.yourAccounts')}</Text> : null}
          <View style={{ marginBottom: 10 }}>{childButtons}</View>
        </View>
        <View style={{ height: 150, justifyContent: 'center' }}>
          <Button
            buttonStyle={styles.signOutButton}
            containerStyle={styles.signOutContainer}
            title={t('account.signOut')}
            onPress={signout}
            titleStyle={styles.signOutTextStyle}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

export default AccountScreen;
