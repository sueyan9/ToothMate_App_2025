import React from 'react';
import { Text, ImageBackground, View } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';
import styles from './styles';
import ToothLogo from '../../assets/t_logo_crop2.png';
import LoadingScreen from '../LoadingScreen';

const AccountScreen = props => {
  const { navigation } = props;

  const [fontsLoaded] = useFonts({
    Righteous_400Regular,
  });

  if (!fontsLoaded) {
    return <LoadingScreen showTooth />;
  }

  const handleBackToParentPress = async () => {
    try {
      const parentId = await AsyncStorage.getItem('parentId');

      if (parentId) {
        await AsyncStorage.setItem('id', parentId);
        await AsyncStorage.removeItem('parentId');
        navigation.navigate('mainFlow');
      } else {
        console.error("Parent ID not found");
      }
    } catch (error) {
      console.error("Error handling parent ID: ", error);
    }
  };

  return (
      <LinearGradient colors={['#7ad0f5', 'white', '#7ad0f5']} style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>ToothMate</Text>
          <ImageBackground source={ToothLogo} style={styles.imageBackgroundStyle}>
            <View style={styles.innerContainer}>
              <Button
                  buttonStyle={styles.backButton}
                  titleStyle={styles.backTitleContainer}
                  title="Back to Parent Account"
                  onPress={handleBackToParentPress}
              />
              <Button
                  buttonStyle={styles.button}
                  containerStyle={styles.buttonContainer}
                  titleStyle={styles.titleContainer}
                  title="Update Account Details"
                  onPress={() => navigation.navigate('UserAccount')}
              />
            </View>
          </ImageBackground>
        </View>
      </LinearGradient>
  );
};

// Header Options
AccountScreen.navigationOptions = {
  headerShown: false,
};

export default AccountScreen;
