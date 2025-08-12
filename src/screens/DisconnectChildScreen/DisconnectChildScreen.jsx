import React, { useContext } from 'react';
import { Text, View, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';
import { Context as UserContext } from '../../context/UserContext/UserContext';
import styles from './styles';
import LoadingScreen from '../LoadingScreen';

const DisconnectChildScreen = props => {
  const { navigation } = props;

  const { disconnectChild } = useContext(UserContext);

  const [fontsLoaded] = useFonts({
    Righteous_400Regular,
  });

  const handleDisconnect = async () => {
    disconnectChild();
    const parentid = await AsyncStorage.getItem('parentid');
    if (parentid) {
      await AsyncStorage.setItem('id', parentid);
      navigation.navigate('mainFlow');
    } else {
      navigation.popToTop();
    }
  };

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <LinearGradient colors={['#78d0f5', '#fff', '#78d0f5']} style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.header}> ToothMate </Text>
        <View style={{ justifyContent: 'center', marginTop: '30%', borderWidth: 1, backgroundColor: '#fff' }}>
          <Text style={{ alignSelf: 'center', fontSize: 24, paddingTop: '5%', fontWeight: 'bold' }}>
            Are you sure you want to do this?
          </Text>
          <Text style={{ alignSelf: 'center', fontSize: 20 }}> This action cannot be undone.</Text>
          <Button
            title="Disconnect from Parent"
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer}
            titleStyle={styles.buttonText}
            onPress={handleDisconnect}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

DisconnectChildScreen.navigationOptions = () => {
  return {
    headerTitle: '',
    headerTintColor: 'black',
    headerBackTitleVisible: false,
    safeAreaInsets: Platform.OS === 'ios' ? { top: 45 } : { top: 30 },
    headerStyle: {
      backgroundColor: '#78d0f5',
      borderBottomWidth: 0,
      shadowOpacity: 0,
      elevation: 0,
    },
  };
};

export default DisconnectChildScreen;
