import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';


const SplashScreen = props => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/tooth_icon.png')}
                style={styles.icon}
            />
            <Text style={styles.titleText}>Welcome to ToothMate!</Text>

            <View style={{display: 'flex', flexDirection: 'row'}}>
            
            <Button
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer}
            title="Log In"
            onPress={() => navigation.navigate('loginFlow', { screen: 'Welcome' })}
            titleStyle={styles.signinButtonTitleStyle}/>

            <Button
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer}
            title="Find Locations"
            onPress={() => navigation.navigate('LocationFinder')}
            titleStyle={styles.signinButtonTitleStyle}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFDF6',
    },
    icon: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 64,
    },
    titleText: {
        fontSize: 24,
        color: '#333333',
        marginBottom: 24,
        fontWeight: 'bold',
    },
    mainText: {
        fontSize: 16,
        color: '#333333',
    },
    button: {
        paddingVertical: 8,
        backgroundColor: '#EDDFD3',
        borderRadius: 28,
        borderWidth: 2.5,
        borderColor: '#875B51',
    },
    buttonContainer: {
        borderRadius: 20,
        width: '49%',
        alignSelf: 'center',
        paddingHorizontal: 8,
    },
    signinButtonTitleStyle: {
        color: '#333333',
        fontWeight: 'bold',
    },
});

export default SplashScreen;