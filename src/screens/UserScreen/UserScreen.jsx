import React, { useState, useContext, useEffect } from 'react';  // 确保正确导入 useMemo
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Input, Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import Spacer from '../../components/Spacer';
import { Context as userContext } from '../../context/UserContext/UserContext';
import { Context as authContext } from '../../context/AuthContext/AuthContext';
import styles from './styles';
import LoadingScreen from '../LoadingScreen';
import { useFocusEffect } from '@react-navigation/native';

const MIN_DATE = dayjs().subtract(100, 'years');
const MAX_DATE = dayjs();

const UserScreen = () => {
  const { state } = useContext(userContext);
  const { updateUser } = useContext(authContext);
  const { state: { errorMessage } } = useContext(authContext);

  const [firstname, setFirstName] = useState(state.details.firstname);
  const [lastname, setLastName] = useState(state.details.lastname);
  const [email, setEmail] = useState(state.details.email);
  const [mobile, setMobile] = useState(state.details.mobile);
  const [dob, setDob] = useState(new Date(state.details.dob));

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fontsLoaded] = useFonts({
    Righteous_400Regular,
  });

  // 不使用 useMemo，而是直接赋值
  const modalDate = dob ? dayjs(dob).toDate() : '';
  const displayDate = dob ? dayjs(dob).format('DD/MM/YYYY') : '';

  useFocusEffect(
      React.useCallback(() => {
        // This is the equivalent of NavigationEvents' onWillFocus
        console.log('UserScreen is focused');
        return () => {
          // This is the equivalent of NavigationEvents' onWillBlur
          console.log('UserScreen is blurred');
        };
      }, [])
  );

  const handleDateChange = (newDate) => {
    const currentDate = newDate ?? dob;
    setShowDatePicker(false);
    setDob(currentDate);
  };

  const handleUpdateDetails = async () => {
    try {
      await updateUser({ firstname, lastname, email, mobile, dob });
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
      <LinearGradient colors={['#78d0f5', 'white', '#78d0f5']} style={styles.container}>
        <View style={styles.container}>
          <KeyboardAwareScrollView>
            <Text style={styles.titleTextStyle}> ToothMate </Text>
            <Spacer />

            {/* First Name */}
            <Input
                label="First Name"
                value={firstname}
                onChangeText={setFirstName}
                autoCapitalize="none"
                leftIcon={{ type: 'feather', name: 'user' }}
                autoCorrect={false}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.textStyle}
                labelStyle={styles.labelStyle}
            />

            {/* Last Name */}
            <Input
                label="Last Name"
                value={lastname}
                onChangeText={setLastName}
                autoCapitalize="none"
                leftIcon={{ type: 'feather', name: 'user' }}
                autoCorrect={false}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.textStyle}
                labelStyle={styles.labelStyle}
            />

            {/* Email */}
            <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                leftIcon={{ type: 'material-icons', name: 'email' }}
                autoCorrect={false}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.textStyle}
                labelStyle={styles.labelStyle}
                keyboardType="email-address"
            />

            {/* Mobile */}
            <Input
                label="Mobile"
                value={mobile}
                onChangeText={setMobile}
                autoCapitalize="none"
                leftIcon={{ type: 'feather', name: 'phone' }}
                autoCorrect={false}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.textStyle}
                labelStyle={styles.labelStyle}
                keyboardType="phone-pad"
            />

            {/* Date of Birth */}
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
            </View>
            <Spacer />

            {/* Error Message */}
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

            <Spacer>
              {/* Update Button */}
              <Button
                  title="Update Details"
                  buttonStyle={styles.button}
                  containerStyle={styles.buttonContainer}
                  titleStyle={styles.buttonText}
                  onPress={handleUpdateDetails}
              />
            </Spacer>
          </KeyboardAwareScrollView>
        </View>
      </LinearGradient>
  );
};

UserScreen.navigationOptions = () => {
  return {
    title: '',
    headerTintColor: 'black',
    safeAreaInsets: Platform.OS === 'ios' ? { top: 45 } : { top: 30 },
    headerBackTitleVisible: false,
    headerStyle: {
      backgroundColor: '#78d0f5',
      borderBottomWidth: 0,
      shadowOpacity: 0,
      elevation: 0,
    },
    cardStyle: {
      backgroundColor: 'white',
    },
  };
};

export default UserScreen;
