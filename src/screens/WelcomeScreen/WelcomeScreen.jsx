import { useNavigation } from '@react-navigation/native';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';


const WelcomeScreen = props => {
    const navigation = useNavigation();


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.welcomeText}>Welcome To</Text>
                    <View style={styles.logoRow}>
                        <Image
                            source={require('../../../assets/tooth_icon_white.png')}
                            style={styles.toothIcon}
                        />
                    <Text style={styles.appName}>ToothMate</Text>
                </View>
            </View>

            <View style={styles.carouselContainer}>
                <Image
                    source={require('../../../assets/wavy_vector.png')}
                    style={styles.wavyBackground}
                />
                
                <Image
                    source={require('../../../assets/tooth_icon.png')}
                    style={styles.carouselImage}
                />
            </View>

            <Text style={styles.descriptionText}>
                See your complete mouth history - past treatments, current status, and upcoming appointments all in one place.
            </Text>

            <View style={styles.buttonContainer}>
            <TouchableOpacity style={{flex: 1}} onPress={() => navigation.navigate('loginFlow', { screen: 'Signup' })}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}} onPress={() => navigation.navigate('LocationFinder')}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Find A <Text style={{color: '#516287'}}>ToothMate</Text></Text>
                </View>
            </TouchableOpacity>
            </View>
        </View>
    );
};

export default WelcomeScreen;