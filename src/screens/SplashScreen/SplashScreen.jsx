import { Image, StyleSheet, View } from 'react-native';


const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/tooth_icon.png')}
                style={styles.icon}
            />
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
    },
});

export default SplashScreen;