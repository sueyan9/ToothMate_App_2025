import React, { useState, useContext, useEffect } from 'react';
import { View, Image, Platform } from 'react-native';
import { Text, Button } from 'react-native-elements';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';
import Spacer from '../../components/Spacer';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
import { Context as ClinicContext } from '../../context/ClinicContext/ClinicContext';
import ToothLogo from '../../assets/t_logo1.png';
import styles from './styles';
import LoadingScreen from '../LoadingScreen';

const SelectClinicScreen = ({ route, navigation }) => {
  const {
    state: { errorMessage },
    signup,
  } = useContext(AuthContext);

  // 使用 route.params 获取传递的参数
  const { firstname, lastname, email, nhi, password, dob } = route.params;

  const { state: clinicState, getClinicNames } = useContext(ClinicContext);
  const [clinic, setClinic] = useState({ name: 'Clinic' });

  const [fontsLoaded] = useFonts({
    Righteous_400Regular,
  });

  useEffect(() => {
    getClinicNames();
  }, []);

  const searchableDropdownTextInputProps = React.useMemo(() => {
    return {
      placeholder: clinic.name,
      style: styles.searchableDropdownTextStyle,
    };
  }, [clinic.name]);

  const handleItemSelect = item => {
    setClinic({ id: item._id, name: item.name });
  };

  const handleSignUp = () => {
    signup({
      firstname,
      lastname,
      email,
      nhi,
      password,
      dob,
      clinic: clinic.id,
    });
  };

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
      <LinearGradient colors={['#78d0f5', 'white', '#78d0f5']} style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.titleTextStyle}> ToothMate </Text>
          <Image source={ToothLogo} style={styles.imageStyle} />
          <Text style={styles.clinicTextStyle}>Select Your Clinic</Text>
          <SearchableDropdown
              items={clinicState}
              onItemSelect={handleItemSelect}
              textInputProps={searchableDropdownTextInputProps}
              placeholderTextColor="#888"
              containerStyle={styles.dropdownContainer}
              itemStyle={styles.searchableDropdownItemStyle}
              itemTextStyle={styles.searchableDropdownItemTextStyle}
          />
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : <Text style={styles.errorMessage} />}
          <Spacer>
            <Button
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                title="Sign Up"
                titleStyle={styles.buttonText}
                onPress={handleSignUp}
            />
          </Spacer>
        </View>
      </LinearGradient>
  );
};

// Header Options
SelectClinicScreen.navigationOptions = () => {
  return {
    headerTitle: '',
    headerTintColor: 'black',
    headerBackTitle: 'Sign Up',
    safeAreaInsets: Platform.OS === 'ios' ? { top: 45 } : { top: 30 },
    headerStyle: {
      backgroundColor: '#78d0f5',
      borderBottomWidth: 0,
      shadowOpacity: 0,
      elevation: 0,
    },
  };
};

export default SelectClinicScreen;
