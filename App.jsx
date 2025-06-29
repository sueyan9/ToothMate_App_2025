import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 导入所有screens
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
import SignupChildScreen from './src/screens/SignupChildScreen';
import UpdateClinicScreen from './src/screens/UpdateClinicScreen';
import UserAccountScreen from './src/screens/UserAccountScreen';
import UserScreen from './src/screens/UserScreen';

// import all Provider
import { Provider as AppointmentProvider } from './src/context/AppointmentContext/AppointmentContext';
import { Provider as AuthProvider } from './src/context/AuthContext/AuthContext';
import { Provider as ClinicProvider } from './src/context/ClinicContext/ClinicContext';
import { Provider as EducationProvider } from './src/context/EducationContext/EducationContext';
import { Provider as UserProvider } from './src/context/UserContext/UserContext';
import { navigationRef } from './src/navigationRef'; // 需要更新这个文件

// 创建堆栈导航器
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 账户流程导航
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

// 教育流程导航
const EducationStack = () => (
    <Stack.Navigator initialRouteName="list">
        <Stack.Screen name="list" component={EducationScreen} />
        <Stack.Screen name="content" component={EducationContentScreen} />
    </Stack.Navigator>
);

// 诊所流程导航
const ClinicStack = () => (
    <Stack.Navigator initialRouteName="clinic">
        <Stack.Screen name="clinic" component={ClinicScreen} />
        <Stack.Screen name="chart" component={DentalChartScreen} />
        <Stack.Screen name="appointment" component={AppointmentScreen} />
        <Stack.Screen name="invoice" component={InvoiceScreen} />
        <Stack.Screen name="images" component={ImagesScreen} />
        <Stack.Screen name="allimages" component={AllImagesScreen} />
    </Stack.Navigator>
);

// 儿童诊所流程
const ChildClinicStack = () => (
    <Stack.Navigator initialRouteName="list">
        <Stack.Screen name="list" component={ClinicScreen} />
        <Stack.Screen name="chart" component={DentalChartScreen} />
        <Stack.Screen name="content" component={AppointmentScreen} />
    </Stack.Navigator>
);

// 儿童账户流程
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

// 主要流程底部导航
const MainFlow = () => (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
            name="AccountFlow"
            component={AccountStack}
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
            name="ClinicFlow"
            component={ClinicStack}
            options={{
                title: 'Clinic',
                tabBarIcon: ({color, size}) => <MaterialCommunityIcons name="toothbrush-paste" size={size} color={color} />
            }}
        />
    </Tab.Navigator>
);

// 儿童流程底部导航
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

// 主应用导航
const AppNavigator = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                initialRouteName="ResolveAuth"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="ResolveAuth" component={ResolveAuthScreen} />

                {/* 登录流程 */}
                <Stack.Screen name="loginFlow" options={{ headerShown: false }}>
                    {() => (
                        <Stack.Navigator>
                            {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
                            {/* <Stack.Screen name="SelectClinic" component={SelectClinicScreen} /> */}
                            {/* <Stack.Screen name="Signin" component={SigninScreen} /> */}
                            <Stack.Screen name="chart" component={DentalChartScreen} />
                        </Stack.Navigator>
                    )}
                </Stack.Screen>

                {/* 主要流程 */}
                <Stack.Screen name="mainFlow" component={MainFlow} />

                {/* 儿童流程 */}
                <Stack.Screen name="childFlow" component={ChildFlow} />

                {/* 注册儿童流程 */}
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

// 包装应用程序与所有提供者
export default function App() {
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
