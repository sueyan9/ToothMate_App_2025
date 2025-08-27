import React, { useEffect, useState } from 'react';
import './src/locales';

// Import I18nextProvider and the i18n instance
import { I18nextProvider } from 'react-i18next';
import i18n from './src/locales';

import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import all screens
import AccountScreen from './src/screens/AccountScreen';
import AllImagesScreen from './src/screens/AllImagesScreen';
import AppointmentScreen from './src/screens/AppointmentScreen';
import ChildAccountScreen from './src/screens/ChildAccountScreen';
import ClinicScreen from './src/screens/ClinicScreen';
import DentalChartScreen from './src/screens/DentalChartScreen';
import DisconnectChildScreen from './src/screens/DisconnectChildScreen';
import EducationContentScreen from './src/screens/EducationContentScreen';
import EducationScreen from './src/screens/EducationScreen';
import ImagesScreen from './src/screens/ImagesScreen';
import InvoiceScreen from './src/screens/InvoiceScreen';
import PasswordChangeScreen from './src/screens/PasswordChangeScreen';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';
import SelectClinicScreen from './src/screens/SelectClinicScreen';
import SigninScreen from './src/screens/SigninScreen';
import SignupChildScreen from './src/screens/SignupChildScreen';
import SignupScreen from './src/screens/SignupScreen';
import UpdateClinicScreen from './src/screens/UpdateClinicScreen';
import UserAccountScreen from './src/screens/UserAccountScreen';
import UserScreen from './src/screens/UserScreen';

import HomeScreen from './src/screens/HomeScreen';

// import all Provider
import { Provider as AppointmentProvider } from './src/context/AppointmentContext/AppointmentContext';
import { Provider as AuthProvider } from './src/context/AuthContext/AuthContext';
import { Provider as ClinicProvider } from './src/context/ClinicContext/ClinicContext';
import { Provider as EducationProvider } from './src/context/EducationContext/EducationContext';
import { Provider as UserProvider } from './src/context/UserContext/UserContext';
import { navigationRef } from './src/navigationRef';

//splash screen
import SplashScreen from './src/screens/SplashScreen/SplashScreen';
import ToothIcon from './src/assets/ToothIcon';
import Icon from './src/assets/icons';

// Create stack and tab navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Helper function to get translations
const getTranslation = (key) => {
  return i18n.t(key);
};

// Account flow navigation
const AccountStack = () => (
  <Stack.Navigator initialRouteName="Account">
    <Stack.Screen 
      name="Account" 
      component={AccountScreen} 
      options={{ title: getTranslation('navigation.account') }}
    />
    <Stack.Screen 
      name="User" 
      component={UserScreen} 
      options={{ title: getTranslation('navigation.user') }}
    />
    <Stack.Screen 
      name="DisconnectChild" 
      component={DisconnectChildScreen} 
      options={{ title: getTranslation('navigation.disconnectChild') }}
    />
    <Stack.Screen 
      name="UpdateClinic" 
      component={UpdateClinicScreen} 
      options={{ title: getTranslation('navigation.updateClinic') }}
    />
    <Stack.Screen 
      name="Password" 
      component={PasswordChangeScreen} 
      options={{ title: getTranslation('navigation.password') }}
    />
    <Stack.Screen 
      name="UserAccount" 
      component={UserAccountScreen} 
      options={{ title: getTranslation('navigation.userAccount') }}
    />
  </Stack.Navigator>
);

// Education flow navigation
const EducationStack = () => (
  <Stack.Navigator initialRouteName="Library">
    <Stack.Screen 
      name="Library" 
      component={EducationScreen}
      options={{ title: getTranslation('navigation.educationList') }}
    />
    <Stack.Screen 
      name="content" 
      component={EducationContentScreen}
      options={{ title: getTranslation('navigation.educationContent') }}
    />
  </Stack.Navigator>
);

// Clinic flow navigation
const ClinicStack = () => (
  <Stack.Navigator initialRouteName="clinic">
    <Stack.Screen 
      name="clinic" 
      component={ClinicScreen} 
      options={{ title: getTranslation('navigation.clinic') }}
    />
    <Stack.Screen 
      name="chart"  
      component={DentalChartScreen}
      options={{ title: getTranslation('navigation.chart') }}
    />
    <Stack.Screen 
      name="appointment" 
      component={AppointmentScreen} 
      options={{ title: getTranslation('navigation.appointment') }}
    />
    <Stack.Screen 
      name="invoice" 
      component={InvoiceScreen} 
      options={{ title: getTranslation('navigation.invoice') }}
    />
    <Stack.Screen 
      name="images" 
      component={ImagesScreen} 
      options={{ title: getTranslation('navigation.images') }}
    />
    <Stack.Screen 
      name="allimages" 
      component={AllImagesScreen} 
      options={{ title: getTranslation('navigation.allImages') }}
    />
  </Stack.Navigator>
);

// Child clinic flow
const ChildClinicStack = () => (
  <Stack.Navigator initialRouteName="list">
    <Stack.Screen 
      name="list" 
      component={ClinicScreen} 
      options={{ title: getTranslation('navigation.clinic') }}
    />
    <Stack.Screen 
      name="chart" 
      component={DentalChartScreen} 
      options={{ title: getTranslation('navigation.chart') }}
    />
    <Stack.Screen 
      name="content" 
      component={AppointmentScreen} 
      options={{ title: getTranslation('navigation.appointment') }}
    />
  </Stack.Navigator>
);

// Child account flow
const ChildAccountStack = () => (
  <Stack.Navigator initialRouteName="Account">
    <Stack.Screen 
      name="Account" 
      component={ChildAccountScreen} 
      options={{ title: getTranslation('navigation.account') }}
    />
    <Stack.Screen 
      name="User" 
      component={UserScreen} 
      options={{ title: getTranslation('navigation.user') }}
    />
    <Stack.Screen 
      name="DisconnectChild" 
      component={DisconnectChildScreen} 
      options={{ title: getTranslation('navigation.disconnectChild') }}
    />
    <Stack.Screen 
      name="UpdateClinic" 
      component={UpdateClinicScreen} 
      options={{ title: getTranslation('navigation.updateClinic') }}
    />
    <Stack.Screen 
      name="Password" 
      component={PasswordChangeScreen} 
      options={{ title: getTranslation('navigation.password') }}
    />
    <Stack.Screen 
      name="UserAccount" 
      component={UserAccountScreen} 
      options={{ title: getTranslation('navigation.userAccount') }}
    />
  </Stack.Navigator>
);

// Main flow with bottom tab navigation
const MainFlow = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: '#875B51',
    tabBarInactiveTintColor: '#333333',
    tabBarStyle: {
      backgroundColor: '#FFFDF6',
      borderTopWidth: 0,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: 68,
      position: 'absolute',
      overflow: 'hidden',
      elevation: 5,
      shadowColor: '#333333',
      shadowOffset: {width: 0, height: -3},
      shadowOpacity: 0.1,
      shadowRadius: 5,
    }
  })}>
    <Tab.Screen
      name="AccountFlow"
      component={AccountStack}
      options={{
        title: getTranslation('tabs.home'),
        tabBarIcon: ({color, size}) => (<Icon name="home" color={color} size={size}/>)
      }}
    />
    <Tab.Screen
      name="Education"
      component={EducationScreen}
      options={{
        title: getTranslation('tabs.education'),
        tabBarIcon: ({color, size}) => (<Icon name="education" color={color} size={size}/>)
      }}
    />
    <Tab.Screen
      name="DentalChartFlow"
      component={DentalChartScreen}
      options={{
        title: getTranslation('tabs.dentalChart'),
        tabBarIcon: ({color, size}) => (<ToothIcon color={color} size={size}/>)
      }}
    />
    <Tab.Screen
      name="ClinicFlow"
      component={ClinicStack}
      options={{
        title: getTranslation('tabs.calendar'),
        tabBarIcon: ({color, size}) => (<Icon name="calendar" color={color} size={size}/>)
      }}
    />
    <Tab.Screen
      name="Profile"
      component={EducationScreen}
      options={{
        title: getTranslation('tabs.profile'),
        tabBarIcon: ({color, size}) => (<Icon name="profile" color={color} size={size}/>)
      }}
    />
  </Tab.Navigator>
);

// Child flow with bottom tab navigation
const ChildFlow = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="AccountFlow"
      component={ChildAccountStack}
      options={{
        title: getTranslation('tabs.home'),
        tabBarIcon: ({color, size}) => <Entypo name="home" size={size} color={color} />
      }}
    />
    <Tab.Screen
      name="Education"
      component={EducationStack}
      options={{
        title: getTranslation('tabs.education'),
        tabBarIcon: ({color, size}) => <Entypo name="open-book" size={size} color={color} />
      }}
    />
    <Tab.Screen
      name="Clinic"
      component={ChildClinicStack}
      options={{
        title: getTranslation('tabs.clinic'),
        tabBarIcon: ({color, size}) => <MaterialCommunityIcons name="toothbrush-paste" size={size} color={color} />
      }}
    />
  </Tab.Navigator>
);

// Main app navigator
const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="ResolveAuth"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="ResolveAuth" component={ResolveAuthScreen} />

        {/* Login flow  */}
        <Stack.Screen name="loginFlow" options={{ headerShown: false }}>
          {() => (
            <Stack.Navigator>
              <Stack.Screen 
                name="Signup" 
                component={SignupScreen} 
                options={{ title: getTranslation('navigation.signup') }}
              />
              <Stack.Screen 
                name="SelectClinic" 
                component={SelectClinicScreen} 
                options={{ title: getTranslation('navigation.selectClinic') }}
              />
              <Stack.Screen 
                name="Signin" 
                component={SigninScreen} 
                options={{ title: getTranslation('navigation.signin') }}
              />
              <Stack.Screen 
                name="DentalChart" 
                component={DentalChartScreen} 
                options={{ title: getTranslation('navigation.dentalChart') }}
              />
            </Stack.Navigator>
          )}
        </Stack.Screen>

        {/* main flow */}
        <Stack.Screen name="mainFlow" component={MainFlow} />
        
        {/* child flow */}
        <Stack.Screen name="childFlow" component={ChildFlow} />

        {/* Sign up child flow */}
        <Stack.Screen name="signUpChildFlow" options={{ headerShown: false }}>
          {() => (
            <Stack.Navigator>
              <Stack.Screen 
                name="Signupchild" 
                component={SignupChildScreen} 
                options={{ title: getTranslation('navigation.signupChild') }}
              />
              <Stack.Screen 
                name="SelectClinic" 
                component={SelectClinicScreen} 
                options={{ title: getTranslation('navigation.selectClinic') }}
              />
            </Stack.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Wrap the app with all providers
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  // Add this effect to force re-render on language change
  useEffect(() => {
    const handleLanguageChange = () => {
      setRefreshKey(prevKey => prevKey + 1);
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <ClinicProvider>
          <EducationProvider>
            <AppointmentProvider>
              <UserProvider>
                <AppNavigator key={refreshKey} />
              </UserProvider>
            </AppointmentProvider>
          </EducationProvider>
        </ClinicProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}