import React, { useState, useContext, useEffect } from 'react';
import { View, Image, Platform, ActivityIndicator } from 'react-native';
import { Text, Button } from 'react-native-elements';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';
import Spacer from '../../components/Spacer';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
import { Context as ClinicContext } from '../../context/ClinicContext/ClinicContext';
import { Context as UserContext } from '../../context/UserContext/UserContext';
import ToothLogo from '../../assets/t_logo1.png';
import styles from './styles';
import LoadingScreen from '../LoadingScreen';

const UpdateClinicScreen = () => {
  const {
    state: { errorMessage },
    updateUserClinic,
  } = useContext(AuthContext);
  const { state: clinicState, getClinicNames } = useContext(ClinicContext);
  const {
    state: {
      clinic: { _id, name },
    },
  } = useContext(UserContext);

  const [clinic, setClinic] = useState({ id: _id, name });
  const [isLoading, setIsLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    Righteous_400Regular,
  });

  // Fetch clinic names asynchronously
  useEffect(() => {
    const fetchClinicNames = async () => {
      try {
        await getClinicNames();
      } catch (error) {
        console.error('Failed to fetch clinic names:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinicNames();
  }, [getClinicNames]);

  const searchableDropdownTextInputProps = React.useMemo(() => {
    return {
      placeholder: clinic.name || "Select Clinic", // Default placeholder text
      style: styles.searchableDropdownTextInputPropsStyle,
    };
  }, [clinic.name]);

  const handleItemSelect = item => {
    setClinic({ id: item._id, name: item.name });
  };

  const handleUpdateClinic = async () => {
    try {
      await updateUserClinic({ clinic: clinic.id });
    } catch (error) {
      console.error('Failed to update clinic:', error);
    }
  };

  if (isLoading || !fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
      <LinearGradient colors={['#78d0f5', 'white', '#78d0f5']} style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.titleTextStyle}> ToothMate </Text>
          <Image source={ToothLogo} style={styles.logoStyle} />
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
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
          <Spacer>
            <Button
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                titleStyle={styles.buttonText}
                title="Change Clinic"
                onPress={handleUpdateClinic}
            />
          </Spacer>
        </View>
      </LinearGradient>
  );
};

// Header options
UpdateClinicScreen.navigationOptions = () => {
  return {
    title: '',
    headerBackTitleVisible: false,
    headerTintColor: 'black',
    safeAreaInsets: Platform.OS === 'ios' ? { top: 45 } : { top: 30 },
    headerStyle: {
      backgroundColor: '#78d0f5',
      borderBottomWidth: 0,
      shadowOpacity: 0,
      elevation: 0,
    },
  };
};

export default UpdateClinicScreen;
