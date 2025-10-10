import { Righteous_400Regular } from '@expo-google-fonts/righteous';
import { useFonts, VarelaRound_400Regular } from '@expo-google-fonts/varela-round';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, View } from 'react-native';


// import all screens
import Contact from './src/components/ContactButton';
import LanguageSelector from './src/components/LanguageSelector';
import AllImagesScreen from './src/screens/AllImagesScreen';
import AppointmentScreen from './src/screens/AppointmentScreen';
import ChildAccountScreen from './src/screens/ChildAccountScreen';
import ChildEducationScreen from './src/screens/ChildEducationScreen/ChildEducationScreen';
import ClinicScreen from './src/screens/ClinicScreen';
import DentalChartScreen from './src/screens/DentalChartScreen';
import DisconnectChildScreen from './src/screens/DisconnectChildScreen';
import EducationContentScreen from './src/screens/EducationContentScreen';
import EducationScreen from './src/screens/EducationScreen';
import GameScreen from './src/screens/GameScreen/GameScreen';
import HomeScreen from './src/screens/HomeScreen';
import ImagesScreen from './src/screens/ImagesScreen';
import InvoiceScreen from './src/screens/InvoiceScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import PasswordChangeScreen from './src/screens/PasswordChangeScreen';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';
import SelectClinicScreen from './src/screens/SelectClinicScreen';
import SigninScreen from './src/screens/SigninScreen';
import SignupChildScreen from './src/screens/SignupChildScreen';
import SignupScreen from './src/screens/SignupScreen';
import UpdateClinicScreen from './src/screens/UpdateClinicScreen';
import UserAccountScreen from './src/screens/UserAccountScreen';
import UserScreen from './src/screens/UserScreen';

// Import new game screens
import BrushingTimerScreen from './src/screens/BrushingTimerScreen/BrushingTimerScreen';
import LearnTeethScreen from './src/screens/LearnTeethScreen/LearnTeethScreen';
import ToothHeroScreen from './src/screens/ToothHeroScreen/ToothHeroScreen';
import ToothMazeAdventure from './src/screens/ToothMazeAdventure/ToothMazeAdventure';
import ViewScheduledNotificationsScreen from './src/screens/ViewScheduledNotificationsScreen';

// import all Provider
import { Provider as AppointmentProvider } from './src/context/AppointmentContext/AppointmentContext';
import { Provider as AuthProvider } from './src/context/AuthContext/AuthContext';
import { Provider as ClinicProvider } from './src/context/ClinicContext/ClinicContext';
import { Provider as EducationProvider } from './src/context/EducationContext/EducationContext';
import { Provider as NotificationProvider } from './src/context/NotificationContext/NotificationContext';
import { ProgressProvider } from './src/context/ProgressContext/ProgressContext';
import { Provider as TranslationProvider } from './src/context/TranslationContext/TranslationContext';
import { useTranslation } from './src/context/TranslationContext/useTranslation';
import { Provider as UserProvider } from './src/context/UserContext/UserContext';
import { navigationRef } from './src/navigationRef';

//splash screen
import { ActivityIndicator } from 'react-native';
import GameIcon from './assets/game_icon.png';
import ToothIcon from './src/assets/ToothIcon';
import Icon from './src/assets/icons';
import SplashScreen from './src/screens/SplashScreen/SplashScreen';


//  Create stack and tab navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HeaderLogo = () => (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Image
        source={require('./assets/tooth_icon.png')}
        style={{width: 100, height: 35, resizeMode: 'contain'}}/>
    </View>
);


// Account flow navigation - FIXED: Using UserAccountScreen instead of missing AccountScreen
const AccountStack = () => (
    <Stack.Navigator initialRouteName="Account">
        <Stack.Screen name="Account" component={UserAccountScreen} />
        <Stack.Screen name="User" component={UserScreen} />
        <Stack.Screen name="DisconnectChild" component={DisconnectChildScreen} />
        <Stack.Screen name="UpdateClinic" component={UpdateClinicScreen} />
        <Stack.Screen name="Password" component={PasswordChangeScreen} />
        <Stack.Screen name="UserAccount" component={UserAccountScreen} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ViewScheduledNotifications" component={ViewScheduledNotificationsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
);

// Education flow navigation
const EducationStack = () => (
    <Stack.Navigator initialRouteName="Library">
        <Stack.Screen name="Library" component={EducationScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="content" component={EducationContentScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="game" component={GameScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
);

// Clinic flow navigation
const ClinicStack = () => (
    <Stack.Navigator initialRouteName="clinic">
        <Stack.Screen name="clinic" component={ClinicScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="chart"  component={DentalChartScreen} options={{ title: '' }} />
        <Stack.Screen name="appointment" component={AppointmentScreen} options={{ title: '' }}/>
        <Stack.Screen name="invoice" component={InvoiceScreen} options={{ title: '' }}/>
        <Stack.Screen name="images" component={ImagesScreen} options={{ title: '' }}/>
        <Stack.Screen name="allimages" component={AllImagesScreen} options={{ title: '' }}/>
    </Stack.Navigator>
);

// Child clinic flow
const ChildClinicStack = () => (
    <Stack.Navigator initialRouteName="Chart">
        <Stack.Screen name="Chart" component={DentalChartScreen} options={{ title: '' }}/>
        <Stack.Screen name="Education" component={ChildEducationScreen} options={{ title: '' }}/>
        <Stack.Screen name="Profile" component={UserAccountScreen} options={{ title: '' }}/>
    </Stack.Navigator>
);

// Child education flow - UPDATED: Now includes all the new game screens
const ChildEducationStack = () => (
    <Stack.Navigator initialRouteName="Library">
        <Stack.Screen name="Library" component={ChildEducationScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="content" component={EducationContentScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="game" component={GameScreen} options={{ headerShown: false }} />
        
        {/* New Game Screens */}
        <Stack.Screen name="BrushingTimer" component={BrushingTimerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LearnTeeth" component={LearnTeethScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ToothHero" component={ToothHeroScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ToothMazeAdventure" component={ToothMazeAdventure} options={{ headerShown: false }} />
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
        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ViewScheduledNotifications" component={ViewScheduledNotificationsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
);

// Profile flow navigation
const ProfileStack = () => {
    const { t, currentLanguage } = useTranslation();
    
    return (
        <Stack.Navigator 
            key={`profile-${currentLanguage}`}
            initialRouteName="UserAccount"
        >
            <Stack.Screen name="UserAccount" component={UserAccountScreen} options={{headerShown: false}}/>
            <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ViewScheduledNotifications" component={ViewScheduledNotificationsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Password" component={PasswordChangeScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

//  Main flow with bottom tab navigation
//  Main flow with bottom tab navigation
const MainFlow = () => {
    const { t, currentLanguage } = useTranslation();
    
    return (
        <Tab.Navigator 
            key={`main-${currentLanguage}`}
            screenOptions={({ route, navigation }) => {
                const state = navigation.getState();
                const currentTab = state.routes[state.index];
                const nestedState = currentTab.state;
                const currentNestedRoute = nestedState?.routes?.[nestedState.index];

                const isViewingIndividualContent = currentTab.name === 'Education' && currentNestedRoute?.name === 'content' &&
                currentNestedRoute?.params?.isModal === true;

                const isContentPage = currentTab.name === 'Education' && currentNestedRoute?.name === 'content' && currentNestedRoute?.params?.id && !currentNestedRoute?.params?.selectedFilter;
                const isProfileInner =
                    currentTab.name === 'Profile' &&
                    ['images', 'allimages', 'invoice'].includes(currentNestedRoute?.name);
                
                return {
                    headerShown: !isProfileInner,
                    ...( !isProfileInner ? {
                        headerLeft: () => <HeaderLogo />,
                        headerTitle: 'ToothMate',
                        headerStyle: {
                            backgroundColor: !isViewingIndividualContent ? '#E9F1F8' : '#FFFDF6',
                            borderBottomWidth: 0,
                            elevation: 0,
                            shadowOpacity: 0,
                        },
                        headerTitleAlign: 'left',
                        headerTransparent: !isViewingIndividualContent,
                    } : {}),
                    tabBarActiveTintColor: '#875B51',
                    tabBarInactiveTintColor: '#333333',
                    tabBarStyle: {
                        backgroundColor: '#FFFDF6',
                        borderTopWidth: 0,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        height: 68,
                        position: 'absolute',
                        elevation: 5,
                        shadowColor: '#333333',
                        shadowOffset: {width: 0, height: -3},
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                    }
                };
            }}
        >
            <Tab.Screen
                name="AccountFlow"
                component={HomeScreen}
                options={{
                    title: t('Home'),
                    headerRight: () => <Contact/>,
                    tabBarIcon: ({color, size}) => (<Icon name="home" color={color} size={size}/>)
                }}
            />
            <Tab.Screen
                name="Education"
                component={EducationStack}
                options={{
                    title: t('Library'),
                    headerRight: () => <Contact/>,
                    tabBarIcon: ({color, size}) => (<Icon name="education" color={color} size={size}/>)
                }}
            />
            <Tab.Screen
                name="DentalChart"
                component={DentalChartScreen}
                options={{
                    title: t('Dental Chart'),
                    headerRight: () => <Contact/>,
                    tabBarIcon: ({color, size}) => (<ToothIcon color={color} size={size}/>)
                }}
            />
            <Tab.Screen
                name="Bookings"
                component={ClinicStack}
                options={{
                    title: t('Bookings'),
                    headerTransparent: false,
                    headerRight: () => <Contact/>,
                    tabBarIcon: ({color, size}) => (<Icon name="calendar" color={color} size={size}/>)
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileStack}
                options={{
                    title: t('Profile'),
                    headerRight: () => <LanguageSelector/>,
                    tabBarIcon: ({color, size}) => (<Icon name="profile" color={color} size={size}/>)
                }}
            />
        </Tab.Navigator>
    );
};
// Child flow with bottom tab navigation
const ChildFlow = () => (
    <Tab.Navigator 
        screenOptions={({ route, navigation }) => {
            const state = navigation.getState();
            const currentTab = state.routes[state.index];
            const nestedState = currentTab.state;
            const currentNestedRoute = nestedState?.routes?.[nestedState.index];

            const isViewingIndividualContent = currentTab.name === 'ChildEducation' && currentNestedRoute?.name === 'content' &&
            currentNestedRoute?.params?.isModal === true;

            // Hide tab bar for game screens
            const isGameScreen = currentTab.name === 'ChildEducation' && 
            ['BrushingTimer', 'LearnTeeth', 'ToothHero', 'ToothMazeAdventure'].includes(currentNestedRoute?.name);

            return {
            headerShown: !isGameScreen, // Hide header for game screens
            headerLeft: () => <HeaderLogo/>,
            headerTitle: '',
            headerStyle: {backgroundColor: !isViewingIndividualContent ? '#E9F1F8' : '#FFFDF6',borderBottomWidth: 0, elevation: 0, shadowOpacity: 0,},
            headerTitleAlign: 'left',
            headerTransparent: !isViewingIndividualContent,
            tabBarActiveTintColor: '#875B51',
            tabBarInactiveTintColor: '#333333',
            tabBarStyle: {
                backgroundColor: '#FFFDF6',
                borderTopWidth: 0,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                height: 68,
                position: 'absolute',
                elevation: 5,
                shadowColor: '#333333',
                shadowOffset: {width: 0, height: -3},
                shadowOpacity: 0.1,
                shadowRadius: 5,
                display: isGameScreen ? 'none' : 'flex', // Hide tab bar for game screens
            }
        }
        }}
    >
        <Tab.Screen
        name="ChildEducation"
        component={ChildEducationStack}
        options={{
            title: 'Fun Zone',
            tabBarIcon: ({ color, size }) => (
            <Image 
    source={GameIcon} 
    style={{ width: size, height: size, tintColor: color }} 
    />

            ),
        }}
        />

        <Tab.Screen
        name="DentalChart"
        component={DentalChartScreen}
        options={{
            title: 'Dental Chart',
            tabBarIcon: ({ color, size }) => (
            <ToothIcon color={color} size={size} />
            ),
        }}
        />

        <Tab.Screen
        name="Account"
        component={ChildAccountScreen}
        options={{
            title: 'Profile',
            headerRight: () => <LanguageSelector />,
            tabBarIcon: ({ color, size }) => (
            <Icon name="profile" color={color} size={size} />
            ),
        }}
        />
    </Tab.Navigator>
);

// Main app navigator
const AppNavigator = () => {
    const { currentLanguage } = useTranslation();
    
    return (
        <NavigationContainer ref={navigationRef} key={currentLanguage}>
            <Stack.Navigator
                initialRouteName="ResolveAuth"
                screenOptions={{ headerShown: false }}
            >
                
                <Stack.Screen name="ResolveAuth" component={ResolveAuthScreen} />
                <Stack.Screen name="SplashScreen" component={SplashScreen}/>


                {/* Login flow  */}
                <Stack.Screen name="loginFlow" options={{ headerShown: false }}>
                    {() => (
                        <Stack.Navigator>
                            <Stack.Screen name="Signin" component={SigninScreen} options={{ headerShown: false }}/>
                            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="SelectClinic" component={SelectClinicScreen} />
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

// Wrap the app with all providers - MOVED useFonts HERE!
export default function App() {
    // ADDED: Load fonts inside the component
    const [fontsLoaded] = useFonts({
        Righteous_400Regular,
        VarelaRound_400Regular,
    });

    // Show loading screen while fonts load
    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#875B51" />
            </View>
        );
    }

    return (
        <AuthProvider>
            <ClinicProvider>
                <EducationProvider>
                    <AppointmentProvider>
                        <UserProvider>
                            <NotificationProvider>
                                <TranslationProvider>
                                <ProgressProvider>
                                        <AppNavigator />
                                </ProgressProvider>
                                </TranslationProvider>
                            </NotificationProvider>
                        </UserProvider>
                    </AppointmentProvider>
                </EducationProvider>
            </ClinicProvider>
        </AuthProvider>
    );
}