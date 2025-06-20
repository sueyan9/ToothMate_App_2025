import { Righteous_400Regular, useFonts } from '@expo-google-fonts/righteous';
import { useFocusEffect } from '@react-navigation/native'; // New import
import dayjs from 'dayjs';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Spacer from '../../components/Spacer';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
import styles from './styles';

const MIN_DATE = dayjs().subtract(100, 'years');
const MAX_DATE = dayjs();
const DEFAULT_DATE = dayjs('2000-01-01');

const SignupScreen = props => {
  const { navigation } = props;

  const { clearErrorMessage } = useContext(AuthContext);

  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clinicCode, setClinicCode] = useState('');
  const [nhi, setNhi] = useState('');
  const [dob, setDob] = useState(DEFAULT_DATE.toDate());
  const modalDate = React.useMemo(() => (dob ? dayjs(dob).toDate() : ''), [dob]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [fontsLoaded] = useFonts({
    Righteous_400Regular,
  });

  // Replacing NavigationEvents with useFocusEffect
  useFocusEffect(
      React.useCallback(() => {
        clearErrorMessage();
      }, [])
  );

  const handleDateChange = newDate => {
    const currentDate = newDate ?? dob;
    setShowDatePicker(false);
    setDob(currentDate);
  };

  const handleSubmit = () => {
    if (firstname === '') {
      setErrorMessage('Please enter your first name');
    } else if (lastname === '') {
      setErrorMessage('Please enter your last name');
    } else if (email === '') {
      setErrorMessage('Please enter your email');
    } else if (email.includes('@') === false) {
      setErrorMessage('Please enter a valid email');
    } else if (nhi === '') {
      setErrorMessage('Please enter your NHI');
    } else if (/^[a-zA-Z]{3}[0-9]{4}$/.test(nhi) === false) {
      setErrorMessage('Please enter a valid NHI');
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
    } else if (clinicCode.trim() === '') {
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
      navigation.navigate('loginFlow', {
        screen: 'DentalChart',
        params: {
            firstname,
            lastname,
            email,
            nhi,
            password,
            dob: dob.toISOString() ,
            clinicCode: clinicCode.trim(),
        },
      });
    }
  };

  if (!fontsLoaded) {
    return (
        <View style={styles.activityIndicatorViewStyle}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
  }

  return (
      <LinearGradient colors={['#78d0f5', 'white', '#78d0f5']} style={styles.container}>
        <View style={styles.container}>
          <KeyboardAwareScrollView>
            <Text style={styles.titleTextStyle}> ToothMate </Text>
            <Spacer />
            <Input
                label="First Name"
                leftIcon={{ type: 'feather', name: 'user' }}
                value={firstname}
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
            <Input
                label="NHI Number"
                leftIcon={{ type: 'material-community', name: 'hospital-box' }}
                value={nhi.toUpperCase()}
                onChangeText={setNhi}
                autoCapitalize="characters"
                autoCorrect={false}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.textStyle}
                labelStyle={styles.labelStyle}
            />
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
            <Text style={styles.clinicTextStyle}>Date of Birth</Text>
            <View>
              <View style={styles.androidModalViewStyle}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.dateStyle}>{dayjs(dob).format('DD/MM/YYYY')}</Text>
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
            <Spacer>
              <Spacer />
              <Button
                  buttonStyle={styles.button}
                  containerStyle={styles.buttonContainer}
                  title="Next"
                  titleStyle={styles.buttonText}
                  onPress={handleSubmit}
              />
            </Spacer>
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
      </LinearGradient>
  );
};

export default SignupScreen;
