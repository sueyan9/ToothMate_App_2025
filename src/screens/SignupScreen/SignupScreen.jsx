import { useFocusEffect } from '@react-navigation/native'; // New import
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Button, Icon, Input, Text } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ToothLogo from '../../../assets/tooth_icon.png';
import axiosApi from "../../api/axios";
import Spacer from '../../components/Spacer';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
import styles from './styles';

const MIN_DATE = dayjs().subtract(100, 'years');
const MAX_DATE = dayjs();
const DEFAULT_DATE = dayjs('2000-01-01');

const SignupScreen = props => {
  const { navigation } = props;

  const { clearErrorMessage, completeRegistration } = useContext(AuthContext);
  const [patientInfo, setPatientInfo] = useState(null);
  const [signupCodeStatus, setSignupCodeStatus] = useState(null); // null | 'valid' | 'invalid'
  const [signupCode, setSignupCode] = useState('');
  
  const [nhiStatus, setNhiStatus] = useState(null); // null | 'valid' | 'invalid'
  const [emailStatus, setEmailStatus] = useState(null); // null | 'valid' | 'invalid' | 'exists'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nhi, setNhi] = useState('');

  const [nhiQ, setNhiQ] = useState(false);
  const [codeQ, setCodeQ] = useState(false);

  const [hidePassword, sethidePassword] = useState(true);
  const [hide2Password, sethide2Password] = useState(true);
  const [eyeStatus, setEyeStatus] = useState('eye');
  const [eye2Status, setEye2Status] = useState('eye');

  const setEye = (bool, eyeType) => {
    if (bool) {
      eyeType === 1 ? setEyeStatus("eye") : setEye2Status("eye");
    }
    else {
      eyeType === 1 ? setEyeStatus("eye-closed") : setEye2Status("eye-closed");
    }
  }

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkSignupCode = async () => {
      if (signupCode.trim() === '') {
        setPatientInfo(null);
        setSignupCodeStatus(null);
        return;
      }

      try {
        const response = await axiosApi.get(`/checkSignupCode/${signupCode.trim()}`);
        if (response.data.valid && response.data.patient) {
          setPatientInfo(response.data.patient);
          setSignupCodeStatus('valid');
        } else {
          setPatientInfo(null);
          setSignupCodeStatus('invalid');
        }
      } catch (err) {
        setPatientInfo(null);
        setSignupCodeStatus('invalid');
      }
    };

    checkSignupCode();
  }, [signupCode]);

  useEffect(() => {
    const checkNhi = async () => {
      if (nhi.trim() === '' || !patientInfo) {
        setNhiStatus(null);
        return;
      }

      // First check if NHI format is valid
      if (!/^[a-zA-Z]{3}[0-9]{4}$/.test(nhi.trim())) {
        setNhiStatus('invalid_format');
        return;
      }

      if (nhi.trim().toUpperCase() === patientInfo.nhi.toUpperCase()) {
        setNhiStatus('valid');
      } else {
        setNhiStatus('mismatch');
      }
    };

    checkNhi();
  }, [nhi, patientInfo]);

  useEffect(() => {
    const checkEmail = async () => {
      if (email.trim() === '') {
        setEmailStatus(null);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email.trim())) {
      setEmailStatus('valid');
    } else {
      setEmailStatus('invalid');
    }
  };

    checkEmail();
  }, [email]);

  // Replacing NavigationEvents with useFocusEffect
  useFocusEffect(
      React.useCallback(() => {
        clearErrorMessage();
      }, [])
  );

  const handleSubmit = async () => {
    if (signupCode === '') {
      setErrorMessage('Please enter your signup code');
    } else if (signupCodeStatus !== 'valid') {
      setErrorMessage('Invalid signup code');
    } else if (nhi === '') {
      setErrorMessage('Please enter your NHI');
    } else if (nhiStatus !== 'valid') {
      if (nhiStatus === 'mismatch') {
        setErrorMessage('NHI does not match our records');
      } else if (nhiStatus === 'invalid_format') {
        setErrorMessage('Please enter a valid NHI format (3 letters + 4 numbers)');
      } else {
        setErrorMessage('Please enter a valid NHI');
      }
    } else if (email === '') {
      setErrorMessage('Please enter your email');
    } else if (emailStatus !== 'valid') {
      setErrorMessage('Please enter a valid email format');
    } else if (password === '') {
      setErrorMessage('Please enter your password');
    } else if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
    } else if (password === password.toLowerCase()) {
      setErrorMessage('Please enter a password with at least one capital letter');
    } else if (!/\d/.test(password)) {
      setErrorMessage('Please enter a password with at least one number');
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
      setErrorMessage('Please enter a password with at least one special character');
    } else {
      try {
        await completeRegistration({
          signupCode: signupCode.trim(),
          nhi: nhi.toUpperCase(),
          email: email.trim().toLowerCase(),
          password,
          patientId: patientInfo._id
        });
      } catch (err) {
        console.log("Registration completion failed:", err.response?.data || err.message);
        setErrorMessage(err.response?.data?.error || 'Failed to complete registration');
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
            <Input
                label="Email"
                leftIcon={{ type: 'material-icons', name: 'email' }}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.textStyle}
                labelStyle={styles.labelStyle}
            />
            {emailStatus === 'valid' && (
                <Text style={{ color: 'green', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                  Email is available!
                </Text>
            )}
            {emailStatus === 'exists' && (
                <Text style={{ color: 'red', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                  Email already exists
                </Text>
            )}
            {emailStatus === 'invalid_format' && (
                <Text style={{ color: 'red', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                  Invalid email format
                </Text>
            )}
            {emailStatus === 'invalid' && (
                <Text style={{ color: 'red', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                  Error checking email
                </Text>
            )}

            <Input
                label="NHI Number"
                leftIcon={{ type: 'material-community', name: 'hospital-box' }}
                rightIcon={
                  <TouchableOpacity onPress={() => {
                    setNhiQ(!nhiQ)}}>
                    <Icon type='material-community' name={'help'} style={{marginRight: 8}}/>
                  </TouchableOpacity>
                }
                value={nhi.toUpperCase()}
                onChangeText={setNhi}
                autoCapitalize="characters"
                autoCorrect={false}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.textStyle}
                labelStyle={styles.labelStyle}
            />
            {nhiQ && (
              <Text style={{ color: '#656B69', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                  Your NHI number is on your prescriptions, lab results, or ask your GP/healthcare provider.
              </Text>
            )}
            {nhiStatus === 'valid' && (
                <Text style={{ color: 'green', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                  NHI confirmed!
                </Text>
            )}
            {nhiStatus === 'exists' && (
                <Text style={{ color: 'red', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                  NHI does not match our records.
                </Text>
            )}
            {nhiStatus === 'invalid_format' && (
                <Text style={{ color: 'red', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                  Invalid NHI format (should be 3 letters + 4 numbers)
                </Text>
            )}
            {nhiStatus === 'invalid' && (
                <Text style={{ color: 'red', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                  Error checking NHI
                </Text>
            )}

            <Input
                label="Signup Code"
                leftIcon={{ type: 'font-awesome', name: 'building' }}
                rightIcon={
                  <TouchableOpacity onPress={() => {
                    setCodeQ(!codeQ)}}>
                    <Icon type='material-community' name={'help'} style={{marginRight: 8}}/>
                  </TouchableOpacity>
                }
                value={signupCode.toUpperCase()}
                onChangeText={setSignupCode}
                autoCapitalize="characters"
                autoCorrect={false}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.textStyle}
                labelStyle={styles.labelStyle}
            />
            {codeQ && (
              <Text style={{ color: '#656B69', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                  This signup code is emailed or texted to you when you ask your dental clinic to join the ToothMate app.
              </Text>
            )}
            {signupCodeStatus === 'valid' && patientInfo && (
                <Text style={{ color: 'green', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                  Signin code found!
                </Text>
            )}

            {signupCodeStatus === 'invalid' && (
                <Text style={{ color: 'red', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>Invalid signin code</Text>
            )}

            <Input
                label="Password"
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
            {password !== confirmPassword && (
              <Text style={{ color: 'red', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                Passwords entered do not match.
              </Text>
            )}
            {errorMessage !== '' && password === confirmPassword && (
              <Text style={{ color: 'red', marginLeft: 24, marginBottom: 16, marginTop: -16 }}>
                {errorMessage}
              </Text>
            )}
              <Button
                  buttonStyle={styles.button}
                  containerStyle={styles.buttonContainer}
                  title="Next"
                  titleStyle={styles.buttonText}
                  onPress={handleSubmit}
              />
            <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
              <Spacer>
                <View style={styles.link}>
                  <Text style={styles.alreadyHaveAccountStyle}>
                    Already have an account?
                    <Text style={styles.link}> Sign in instead</Text>
                  </Text>
                </View>
              </Spacer>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
  );
};

export default SignupScreen;
