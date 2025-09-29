import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    animationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    sparkle: {
        position: 'absolute',
    },
    sparkleText: {
        fontSize: 24,
    },
    toothContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    toothEmoji: {
        fontSize: 120,
        textAlign: 'center',
    },
    toothFace: {
        position: 'absolute',
        top: 40,
    },
    toothEyes: {
        fontSize: 24,
    },
    encouragementContainer: {
        position: 'absolute',
        bottom: -50,
        paddingHorizontal: 20,
    },
    encouragementText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        marginBottom: 40,
    },
    timerContainer: {
        alignItems: 'center',
        marginVertical: 30,
    },
    timerText: {
        fontSize: 64,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    timerLabel: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 8,
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 40,
        marginBottom: 30,
    },
    controlButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    startButton: {
        backgroundColor: '#4CAF50',
    },
    resetButton: {
        backgroundColor: '#FF5722',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    tipsContainer: {
        marginHorizontal: 20,
        marginBottom: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        padding: 20,
    },
    tipsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    tipsText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 22,
    },
});

export default styles;
