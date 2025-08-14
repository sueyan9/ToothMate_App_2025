import { Righteous_400Regular, useFonts } from '@expo-google-fonts/righteous';
import { useFocusEffect } from '@react-navigation/native'; // use new hook
import dayjs from 'dayjs';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axiosApi from "../../api/axios";
import Spacer from '../../components/Spacer';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
import LoadingScreen from '../LoadingScreen';
import styles from './styles';
import debounce from 'lodash/debounce';
import axios from 'axios';

const MIN_DATE = dayjs().subtract(100, 'years');
const MAX_DATE = dayjs();
const DEFAULT_DATE = dayjs('2000-01-01');

const SignupChildScreen = props => {
  const { navigation } = props;
  const { clearErrorMessage, signUp} = useContext(AuthContext);

  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nhi, setNhi] = useState('');
  const [dob, setDob] = useState(DEFAULT_DATE.toDate());
  const [clinicInfo, setClinicInfo] = useState(null);
  const [clinicCodeStatus, setClinicCodeStatus] = useState(null); // null | 'valid' | 'invalid'
  const [clinicCode, setClinicCode] = useState('');
  const [nhiStatus, setNhiStatus] = useState(null); // null | 'valid' | 'invalid'
  const [emailStatus, setEmailStatus] = useState(null); // null | 'valid' | 'invalid' | 'exists'

  const modalDate = React.useMemo(() => (dob ? dayjs(dob).toDate() : ''), [dob]);
  const displayDate = React.useMemo(() => (dob ? dayjs(dob).format('DD/MM/YYYY') : ''), [dob]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fontsLoaded] = useFonts({
    Righteous_400Regular,
  });

  const handleDateChange = newDate => {
    const currentDate = newDate ?? dob;
    setShowDatePicker(false);
    setDob(currentDate);
  };

  const handleSubmit = async () => {
    if (firstname === '') {
      setErrorMessage('Please enter your first name');
    } else if (lastname === '') {
      setErrorMessage('Please enter your last name');
    } else if (email === '') {
      setErrorMessage('Please enter your email');
    } else if (emailStatus !== 'valid') {
      if (emailStatus === 'exists') {
        setErrorMessage('Email already exists');
      } else if (emailStatus === 'invalid_format') {
        setErrorMessage('Please enter a valid email format');
      } else {
        setErrorMessage('Please enter a valid email');
      }
    } else if (nhi === '') {
      setErrorMessage('Please enter your NHI');
    } else if (nhiStatus !== 'valid') {
      if (nhiStatus === 'exists') {
        setErrorMessage('NHI already exists');
      } else if (nhiStatus === 'invalid_format') {
        setErrorMessage('Please enter a valid NHI format (3 letters + 4 numbers)');
      } else {
        setErrorMessage('Please enter a valid NHI');
      }
    } else if (password === '') {
      setErrorMessage('Please enter your password');
    } else if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
    } else if (password === password.toLowerCase()) {
      setErrorMessage('Please enter a password with at least one capital letter');
    } else if (/\d/.test(password) === false) {
      setErrorMessage('Please enter a password with at least one number');
    } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password) === false) {
      setErrorMessage('Please enter a password with at least one special character');
    }else if (clinicInfo === null) {
      setErrorMessage('Please enter your clinic code');
    } else {
      // navigation.navigate('SelectClinic', {
      //   firstname,
      //   lastname,
      //   email,
      //   nhi,
      //   password,
      //   dob,
      // });
      try {
        await signUp({
          firstname,
          lastname,
          email,
          nhi: nhi.toUpperCase(),
          password,
          dob: dob.toISOString(),
          clinic: clinicInfo.id,
        });
      } catch (err) {
        console.log("Signup failed:", err.response?.data || err.message);
        setErrorMessage(err.response?.data?.error || 'Failed to register');
      }
    }
  };

  // use  useFocusEffect to clean err message
  useFocusEffect(
      React.useCallback(() => {
        clearErrorMessage();
      }, [])
  );

  // Debounced function to reduce API flood when user is typing clinic code
  const debouncedCheckClinicCode = useMemo(() => debounce(async (code) => {
    if (code.trim() === '') {
      setClinicInfo(null);
      setClinicCodeStatus(null);
      return;
    }
    try {
      const response = await axiosApi.get(`/checkClinicCode/${code.trim()}`);
      if (response.data.valid) {
        setClinicInfo(response.data);
        setClinicCodeStatus('valid');
      } else {
        setClinicInfo(null);
        setClinicCodeStatus('invalid');
      }
    } catch (err) {
      setClinicInfo(null);
      setClinicCodeStatus('invalid');
    }
  }, 500), []
  );

// Trigger the debounced API call whenever clinicCode changes
  useEffect(() => {
    debouncedCheckClinicCode(clinicCode);
  }, [clinicCode]);
  useEffect(() => {
    return () => {
      debouncedCheckClinicCode.cancel();
    };
  }, []);

  useEffect(() => {
    const checkNhi = async () => {
      if (nhi.trim() === '') {
        setNhiStatus(null);
        return;
      }

      // First check if NHI format is valid
      if (!/^[a-zA-Z]{3}[0-9]{4}$/.test(nhi.trim())) {
        setNhiStatus('invalid_format');
        return;
      }

      try {
        const response = await axiosApi.get(`/checkNhi/${nhi.trim().toUpperCase()}`);
        if (response.data.exists) {
          setNhiStatus('exists');
        } else {
          setNhiStatus('valid');
        }
      } catch (err) {
        setNhiStatus('invalid');
      }
    };

    checkNhi();
  }, [nhi]);

  useEffect(() => {
    const checkEmail = async () => {
      if (email.trim() === '') {
        setEmailStatus(null);
        return;
      }

      // First check if email format is valid
      if (!email.includes('@') || !email.includes('.')) {
        setEmailStatus('invalid_format');
        return;
      }

      try {
        const response = await axiosApi.get(`/checkEmail/${email.trim().toLowerCase()}`);
        if (response.data.exists) {
          setEmailStatus('exists');
        } else {
          setEmailStatus('valid');
        }
      } catch (err) {
        setEmailStatus('invalid');
      }
    };

    checkEmail();
  }, [email]);

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
      <LinearGradient colors={['#78d0f5', 'white', '#78d0f5']} style={styles.container}>
        <View style={styles.container}>
          <KeyboardAwareScrollView>
            <Text style={styles.titleTextStyle}> ToothMate </Text>
            <Spacer />
            <Input
                label="First Name"
                value={firstname}
                leftIcon={{ type: 'feather', name: 'user' }}
                onChangeText={setFirstName}
                autoCapitalize="none"
                autoCorrect={false}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.textStyle}
                labelStyle={styles.labelStyle}
            />
            <Input
                label="Last Name"
                leftIcon={{ type: 'feather', name: 'user' }}
                value={lastname}
                onChangeText={setLastName}
                autoCapitalize="none"
                autoCorrect={false}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.textStyle}
                labelStyle={styles.labelStyle}
            />
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
                <Text style={{ color: 'green', marginLeft: 10 }}>
                  Email is available!
                </Text>
            )}
            {emailStatus === 'exists' && (
                <Text style={{ color: 'red', marginLeft: 10 }}>
                  Email already exists
                </Text>
            )}
            {emailStatus === 'invalid_format' && (
                <Text style={{ color: 'red', marginLeft: 10 }}>
                  Invalid email format
                </Text>
            )}
            {emailStatus === 'invalid' && (
                <Text style={{ color: 'red', marginLeft: 10 }}>
                  Error checking email
                </Text>
            )}
            <Input
                label="NHI Number"
                leftIcon={{ type: 'material-community', name: 'hospital-box' }}
                value={nhi}
                onChangeText={setNhi}
                autoCapitalize="none"
                autoCorrect={false}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.textStyle}
                labelStyle={styles.labelStyle}
            />
            {nhiStatus === 'valid' && (
                <Text style={{ color: 'green', marginLeft: 10 }}>
                  NHI found!
                </Text>
            )}
            {nhiStatus === 'exists' && (
                <Text style={{ color: 'red', marginLeft: 10 }}>
                  NHI already exists
                </Text>
            )}
            {nhiStatus === 'invalid_format' && (
                <Text style={{ color: 'red', marginLeft: 10 }}>
                  Invalid NHI format (should be 3 letters + 4 numbers)
                </Text>
            )}
            {nhiStatus === 'invalid' && (
                <Text style={{ color: 'red', marginLeft: 10 }}>
                  Error checking NHI
                </Text>
            )}
            <Input
                label="Password"
                leftIcon={{ type: 'fontawesome5', name: 'lock' }}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.textStyle}
                labelStyle={styles.labelStyle}
            />
            <Input
                label="Clinic Code"
                leftIcon={{ type: 'font-awesome', name: 'building' }}
                value={clinicCode}
                onChangeText={setClinicCode}
                autoCapitalize="characters"
                autoCorrect={false}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.textStyle}
                labelStyle={styles.labelStyle}
            />
            {clinicCodeStatus === 'valid' && clinicInfo && (
                <Text style={{ color: 'green', marginLeft: 10 }}>
                  Clinic found: {clinicInfo.name}
                </Text>
            )}

            {clinicCodeStatus === 'invalid' && (
                <Text style={{ color: 'red', marginLeft: 10 }}>Invalid clinic code</Text>
            )}
            <Text style={styles.clinicTextStyle}>Date of Birth</Text>
            <View>
              <View style={styles.androidModalViewStyle}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.dateStyle}>{displayDate}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={showDatePicker}
                    mode="date"
                    date={modalDate}
                    minimumDate={MIN_DATE.toDate()}
                    maximumDate={MAX_DATE.toDate()}
                    onCancel={() => setShowDatePicker(false)}
                    onConfirm={handleDateChange}
                />
              </View>
              <Spacer />
            </View>
            {errorMessage ? (
                <View style={styles.link}>
                  <Text style={styles.errorMessage}>{errorMessage}</Text>
                </View>
            ) : null}
            <Spacer />
            <Spacer>
              <Button
                  buttonStyle={styles.button}
                  containerStyle={styles.buttonContainer}
                  title="Next"
                  titleStyle={styles.buttonText}
                  onPress={handleSubmit}
              />
            </Spacer>
          </KeyboardAwareScrollView>
        </View>
      </LinearGradient>
  );
};

SignupChildScreen.navigationOptions = ({ navigation }) => {
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
    headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: 'black', marginLeft: 10 }}>Back</Text>
        </TouchableOpacity>
    ),
  };
};

export default SignupChildScreen;
