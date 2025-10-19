import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Button, Icon, Input, Text } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ToothLogo from '../../../assets/tooth_icon.png';
import axiosApi from "../../api/axios";
import Spacer from '../../components/Spacer';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
import styles from './styles';

const ForgotPasswordScreen = props => {
  const { navigation } = props;

  const { clearErrorMessage } = useContext(AuthContext);

  const [stage, setStage] = useState('identify'); // 'identify' | 'verify' | 'reset'
  const [emailOrNhi, setEmailOrNhi] = useState('');
  const [signupCode, setSignupCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [hidePassword, sethidePassword] = useState(true);
  const [hide2Password, sethide2Password] = useState(true);
  const [eyeStatus, setEyeStatus] = useState('eye');
  const [eye2Status, setEye2Status] = useState('eye');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userFound, setUserFound] = useState(null);

  const setEye = (bool, eyeType) => {
    if (bool) {
      eyeType === 1 ? setEyeStatus("eye") : setEye2Status("eye");
    }
    else {
      eyeType === 1 ? setEyeStatus("eye-closed") : setEye2Status("eye-closed");
    }
  }

  useFocusEffect(
      React.useCallback(() => {
        clearErrorMessage();
      }, [])
  );

  const handleIdentifyUser = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (emailOrNhi.trim() === '') {
      setErrorMessage('Please enter your email or NHI');
      return;
    }

    try {
      const response = await axiosApi.post('/findUserByEmailOrNhi', {
        emailOrNhi: emailOrNhi.trim().toLowerCase()
      });

      if (response.data.user) {
        setUserFound(response.data.user);
        setStage('verify');
        setSuccessMessage('User found! Please enter your signup code.');
      } else {
        setErrorMessage('User not found');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Error finding user');
    }
  };

  const handleVerifyCode = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (signupCode.trim() === '') {
      setErrorMessage('Please enter your signup code');
      return;
    }

    try {
      const response = await axiosApi.post('/verifySignupCodeForReset', {
        userId: userFound._id,
        signupCode: signupCode.trim()
      });

      if (response.data.valid) {
        setStage('reset');
        setSuccessMessage('Signup code verified! Please enter your new password.');
      } else {
        setErrorMessage('Invalid signup code');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Error verifying code');
    }
  };

  const handleResetPassword = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (password === '') {
      setErrorMessage('Please enter your new password');
    } else if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
    } else if (password === password.toLowerCase()) {
      setErrorMessage('Please enter a password with at least one capital letter');
    } else if (!/\d/.test(password)) {
      setErrorMessage('Please enter a password with at least one number');
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
      setErrorMessage('Please enter a password with at least one special character');
    } else if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
    } else {
      try {
        await axiosApi.post('/resetPassword', {
          userId: userFound._id,
          newPassword: password
        });

        setSuccessMessage('Password reset successfully!');
        setTimeout(() => {
          navigation.navigate('Signin');
        }, 2000);
      } catch (err) {
        setErrorMessage(err.response?.data?.error || 'Error resetting password');
      }
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '30%', marginBottom: 32}}>
          <Image source={ToothLogo} style={styles.icon}/>
          <Text style={styles.titleTextStyle}> ToothMate </Text>
        </View>

        {stage === 'identify' && (
          <>
            <Text style={styles.stageTitle}>Reset Your Password</Text>
            <Input
                label="Email Address or NHI"
                leftIcon={{ type: 'material-icons', name: 'email' }}
                value={emailOrNhi}
                onChangeText={setEmailOrNhi}
                autoCapitalize="none"
                autoCorrect={false}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.textStyle}
                labelStyle={styles.labelStyle}
            />
            {errorMessage !== '' && (
              <Text style={{ color: 'red', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                {errorMessage}
              </Text>
            )}
            {successMessage !== '' && (
              <Text style={{ color: 'green', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                {successMessage}
              </Text>
            )}
            <Button
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                title="Continue"
                titleStyle={styles.buttonText}
                onPress={handleIdentifyUser}
            />
          </>
        )}

        {stage === 'verify' && (
          <>
            <Text style={styles.stageTitle}>Verify Your Signup Code</Text>
            <Text style={{ marginLeft: 24, marginRight: 24, marginBottom: 16, color: '#656B69', textAlign: 'justify' }}>
              Please enter the signup code that was provided when you joined ToothMate.
            </Text>
            <Input
                label="Signup Code"
                leftIcon={{ type: 'font-awesome', name: 'building' }}
                value={signupCode.toUpperCase()}
                onChangeText={setSignupCode}
                autoCapitalize="characters"
                autoCorrect={false}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.textStyle}
                labelStyle={styles.labelStyle}
            />
            {errorMessage !== '' && (
              <Text style={{ color: 'red', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                {errorMessage}
              </Text>
            )}
            {successMessage !== '' && (
              <Text style={{ color: 'green', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                {successMessage}
              </Text>
            )}
            <Button
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                title="Verify Code"
                titleStyle={styles.buttonText}
                onPress={handleVerifyCode}
            />
            <Button
                buttonStyle={styles.secondaryButton}
                containerStyle={styles.buttonContainer}
                title="Back"
                titleStyle={styles.secondaryButtonText}
                onPress={() => {
                  setStage('identify');
                  setSignupCode('');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
            />
          </>
        )}

        {stage === 'reset' && (
          <>
            <Text style={styles.stageTitle}>Create New Password</Text>
            <Input
                label="New Password"
                leftIcon={{ type: 'fontawesome5', name: 'lock' }}
                rightIcon={
                  <TouchableOpacity onPress={() => {
                    sethidePassword(!hidePassword)
                    setEye(!hidePassword, 1)}}>
                    <Icon type='material-community' name={eyeStatus} style={{marginRight: 8}}/>
                  </TouchableOpacity>
                }
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={hidePassword}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.textStyle}
                labelStyle={styles.labelStyle}
            />
            <Input
                label="Confirm Password"
                leftIcon={{ type: 'fontawesome5', name: 'lock' }}
                rightIcon={
                  <TouchableOpacity onPress={() => {
                    sethide2Password(!hide2Password)
                    setEye(!hide2Password, 2)}}>
                    <Icon type='material-community' name={eye2Status} style={{marginRight: 8}}/>
                  </TouchableOpacity>
                }
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={hide2Password}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.textStyle}
                labelStyle={styles.labelStyle}
            />
            {errorMessage !== '' && (
              <Text style={{ color: 'red', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                {errorMessage}
              </Text>
            )}
            {successMessage !== '' && (
              <Text style={{ color: 'green', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                {successMessage}
              </Text>
            )}
            <Button
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                title="Reset Password"
                titleStyle={styles.buttonText}
                onPress={handleResetPassword}
            />
            <Button
                buttonStyle={styles.secondaryButton}
                containerStyle={styles.buttonContainer}
                title="Back"
                titleStyle={styles.secondaryButtonText}
                onPress={() => {
                  setStage('verify');
                  setPassword('');
                  setConfirmPassword('');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
            />
          </>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
          <Spacer>
            <View style={styles.link}>
              <Text style={styles.alreadyHaveAccountStyle}>
                Back to Sign In
              </Text>
            </View>
          </Spacer>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ForgotPasswordScreen;