import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#516287',
        paddingTop: 96
    },
    headerContainer: {
        marginBottom: 30,
        alignItems: 'left',
        marginLeft: 32,
    },
    welcomeText: {
        fontSize: 24,
        color: '#fffdf6',
        marginBottom: 8,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    toothIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    appName: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fffdf6',
    },
    carouselContainer: {
        height: 300,
        marginVertical: 16,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
    },
    wavyBackground: {
        position: 'absolute',
        width: width,
        height: '110%',
        resizeMode: 'stretch',
    },
    carousel: {
        zIndex: 10,
    },
    carouselImage: {
        height: 300,
        width: width - 40,
        resizeMode: 'contain',
        justifyContent: 'center',
        alignItems: 'center',
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#fffdf6',
        textAlign: 'center',
        marginVertical: 20,
        marginHorizontal: 32,
        minHeight: 80,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginVertical: 20,
    },
    dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#eddfd3',
    },
    activeDot: {
        backgroundColor: '#875B51',
        width: 40,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginRight: 24,
        marginLeft: 24,
        marginTop: 8,
        flex: 1,
        justifyContent: 'center'
    },
    button: {
        backgroundColor: '#EDDFD3',
        borderColor: '#875B51',
        borderRadius: 30,
        height: 70,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
    },
    buttonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    }
});
