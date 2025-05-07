import React, { useState, useContext } from 'react';
import { View, ImageBackground, Platform } from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
import styles from './styles';
import ToothLogo from '../../assets/t_logo_crop2.png';
import LoadingScreen from '../LoadingScreen';

const passwordIcon = { type: 'fontawesome5', name: 'lock' };

const PasswordChangeScreen = () => {
  const {
    state: { errorMessage, loading },
    changePassword,
  } = useContext(AuthContext);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [fontsLoaded] = useFonts({
    Righteous_400Regular,
  });

  if (!fontsLoaded || loading) {
    return <LoadingScreen showTooth />;
  }

  const isSubmitDisabled = !oldPassword || !newPassword;

  return (
      <LinearGradient colors={['#78d0f5', 'white', '#78d0f5']} style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.header}> ToothMate </Text>
          <ImageBackground source={ToothLogo} style={styles.imageBackgroundStyle}>
            <View style={styles.inputView}>
              <Input
                  label="Current Password"
                  leftIcon={passwordIcon}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.textStyle}
                  labelStyle={styles.labelStyles}
              />
              <Input
                  label="New Password"
                  leftIcon={passwordIcon}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.textStyle}
                  labelStyle={styles.labelStyles}
              />
            </View>
            {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
          </ImageBackground>
          <Button
              buttonStyle={styles.button}
              containerStyle={styles.buttonContainer}
              title="Change Password"
              titleStyle={styles.buttonText}
              onPress={() => {
                changePassword({ oldPassword, newPassword });
              }}
              disabled={isSubmitDisabled} // Disable button if fields are empty
          />
        </View>
      </LinearGradient>
  );
};

// Header Options
PasswordChangeScreen.navigationOptions = () => {
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

export default PasswordChangeScreen;
