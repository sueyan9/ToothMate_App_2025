import React, {useState, useContext, useEffect} from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useFocusEffect } from '@react-navigation/native'; // 使用新的 hook
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';
import dayjs from 'dayjs';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
import Spacer from '../../components/Spacer';
import styles from './styles';
import LoadingScreen from '../LoadingScreen';
import axiosApi from "../../api/axios";

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

  // 使用 useFocusEffect 来清除错误消息
  useFocusEffect(
      React.useCallback(() => {
        clearErrorMessage();
      }, [])
  );

  useEffect(() => {
    const checkClinicCode = async () => {
      if (clinicCode.trim() === '') {
        setClinicInfo(null);
        setClinicCodeStatus(null);
        return;
      }

      try {
        const response = await axiosApi.get(`/checkClinicCode/${clinicCode.trim()}`);
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
    };

    checkClinicCode();
  }, [clinicCode]);

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
