import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import ToothLogo from '../../../assets/tooth_icon.png';
import Spacer from '../../components/Spacer';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
import styles from './styles';

const SigninScreen = props => {
  const navigation = useNavigation();

  const { state, signin, clearErrorMessage } = useContext(AuthContext);

  const [emailOrNhi, setEmailOrNhi] = useState('');
  const [password, setPassword] = useState('');

  const handleSignin = () => signin({ emailOrNhi, password });

  // 使用 useFocusEffect 来清除错误消息
  useFocusEffect(
      React.useCallback(() => {
        clearErrorMessage();
      }, [])
  );

  return (
      <View style={styles.container}>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '50%', marginBottom: 32}}>
            <Image source={ToothLogo} style={styles.icon}/>
            <Text style={styles.titleTextStyle}> ToothMate </Text>
          </View>
            <Input
                label="Email Address or NHI"
                leftIcon={{ type: 'material-icons', name: 'email' }}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyles}
                value={emailOrNhi}
                onChangeText={setEmailOrNhi}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <Input
                label="Password"
                inputContainerStyle={styles.inputContainer}
                leftIcon={{ type: 'font-awesome', name: 'lock' }}
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyles}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
            />
            {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}
          
          <Button
              buttonStyle={styles.button}
              containerStyle={styles.buttonContainer}
              title="Log In"
              onPress={handleSignin}
              titleStyle={styles.signinButtonTitleStyle}
          />
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Spacer>
              <View style={styles.link}>
                <Text style={styles.forgotPasswordStyle}>
                  Forgot Password?
                </Text>
              </View>
            </Spacer>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('loginFlow', { screen: 'Signup' })}>
            <Spacer>
              <View style={styles.link}>
                <Text style={styles.alreadyHaveAccountStyle}>
                    Don't have an account?
                <Text style={styles.link}> Create one here</Text>
                </Text>
              </View>
            </Spacer>
          </TouchableOpacity>
      </View>
  );
};

// Header Options
SigninScreen.navigationOptions = () => {
  return {
    headerShown: false,
  };
};

export default SigninScreen;