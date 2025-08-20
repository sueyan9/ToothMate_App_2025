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
import { useEffect, useState } from 'react';
import ToothIcon from './src/assets/ToothIcon';
import Icon from './src/assets/icons';
import SplashScreen from './src/screens/SplashScreen/SplashScreen';


//  Create stack and tab navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Account flow navigation
const AccountStack = () => (
    <Stack.Navigator initialRouteName="Account">
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="User" component={UserScreen} />
        <Stack.Screen name="DisconnectChild" component={DisconnectChildScreen} />
        <Stack.Screen name="UpdateClinic" component={UpdateClinicScreen} />
        <Stack.Screen name="Password" component={PasswordChangeScreen} />
        <Stack.Screen name="UserAccount" component={UserAccountScreen} />
    </Stack.Navigator>
);

// Education flow navigation
const EducationStack = () => (
    <Stack.Navigator initialRouteName="list">
        <Stack.Screen name="list" component={EducationScreen}/>
        <Stack.Screen name="content" component={EducationContentScreen}/>
    </Stack.Navigator>
);

// Clinic flow navigation
const ClinicStack = () => (
    <Stack.Navigator initialRouteName="clinic" >
        <Stack.Screen name="clinic" component={ClinicScreen} options={{ title: '' }}/>
        <Stack.Screen name="chart"  component={DentalChartScreen}options={{ title: '' }} />
        <Stack.Screen name="appointment" component={AppointmentScreen} options={{ title: '' }}/>
        <Stack.Screen name="invoice" component={InvoiceScreen} options={{ title: '' }}/>
        <Stack.Screen name="images" component={ImagesScreen} options={{ title: '' }}/>
        <Stack.Screen name="allimages" component={AllImagesScreen} options={{ title: '' }}/>
    </Stack.Navigator>
);

// Child clinic flow
const ChildClinicStack = () => (
    <Stack.Navigator initialRouteName="list">
        <Stack.Screen name="list" component={ClinicScreen} options={{ title: '' }}/>
        <Stack.Screen name="chart" component={DentalChartScreen} options={{ title: '' }}/>
        <Stack.Screen name="content" component={AppointmentScreen} options={{ title: '' }}/>
    </Stack.Navigator>
);

// Child account flow
const ChildAccountStack = () => (
    <Stack.Navigator initialRouteName="Account">
        <Stack.Screen name="Account" component={ChildAccountScreen} />
        <Stack.Screen name="User" component={UserScreen} />
        <Stack.Screen name="DisconnectChild" component={DisconnectChildScreen} />
        <Stack.Screen name="UpdateClinic" component={UpdateClinicScreen} />
        <Stack.Screen name="Password" component={PasswordChangeScreen} />
        <Stack.Screen name="UserAccount" component={UserAccountScreen} />
    </Stack.Navigator>
);

//  Main flow with bottom tab navigation
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
            component={HomeScreen}
            options={{
                title: 'Home',
                tabBarIcon: ({color, size}) => (<Icon name="home" color={color} size={size}/>)
            }}
        />
        <Tab.Screen
            name="Education"
            component={EducationScreen}
            options={{
                title: 'Library',
                tabBarIcon: ({color, size}) => (<Icon name="education" color={color} size={size}/>)
            }}
        />
        <Tab.Screen
            name="DentalChart"
            component={DentalChartScreen}
            options={{
                title: 'Dental Chart',
                tabBarIcon: ({color, size}) => (<ToothIcon color={color} size={size}/>)
            }}
        />
        <Tab.Screen
            // NEED TO REFACTOR TO APPOINTMENTS :)
            name="Bookings"
            component={ClinicStack}
            options={{
                title: 'Bookings',
                tabBarIcon: ({color, size}) => (<Icon name="calendar" color={color} size={size}/>)
            }}

        />
        <Tab.Screen
            name="Profile"
            component={EducationScreen}
            options={{
                title: 'Profile',
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
                title: 'Home',
                tabBarIcon: ({color, size}) => <Entypo name="home" size={size} color={color} />
            }}
        />
        <Tab.Screen
            name="Education"
            component={EducationStack}
            options={{
                title: 'Education',
                tabBarIcon: ({color, size}) => <Entypo name="open-book" size={size} color={color} />
            }}
        />
        <Tab.Screen
            name="Clinic"
            component={ChildClinicStack}
            options={{
                title: 'Clinic',
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
                             <Stack.Screen name="Signup" component={SignupScreen} />
                             <Stack.Screen name="SelectClinic" component={SelectClinicScreen} />
                             <Stack.Screen name="Signin" component={SigninScreen} />
                            <Stack.Screen name="DentalChart" component={DentalChartScreen} />
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
                            <Stack.Screen name="Signupchild" component={SignupChildScreen} />
                            <Stack.Screen name="SelectClinic" component={SelectClinicScreen} />
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

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 2 seconds delay
    }, []);

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <AuthProvider>
            <ClinicProvider>
                <EducationProvider>
                    <AppointmentProvider>
                        <UserProvider>
                            <AppNavigator />
                        </UserProvider>
                    </AppointmentProvider>
                </EducationProvider>
            </ClinicProvider>
        </AuthProvider>
    );
}
