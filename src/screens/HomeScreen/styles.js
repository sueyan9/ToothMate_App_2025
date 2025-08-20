import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    titleText: {
        fontSize: 24,
        color: '#333333',
        marginBottom: 16,
        marginLeft: 16,
    },
    container: {
        flex: 1,
        backgroundColor: '#E9F1F8',
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    profile: {
        width: 60,
        height: 60,
        borderRadius: 40,
        marginBottom: 20,
    },
    helloContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'left',
        marginTop: 96,
        marginBottom: 28,
    },
    updateContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        alignSelf: 'center',
        gap: 16,
        marginBottom: 16,
    },
    updateBox: {
        backgroundColor: '#FFFDF6',
        borderRadius: 16,
        padding: 16,
        flex: 1,
    },
    dateCircle: {
        backgroundColor: '#516287',
        borderRadius: 20,
        marginHorizontal: 8,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dateCircleText: {
        color: '#FFFDF6',
        fontWeight: 'bold',
    },
    appointmentText: {
        color: '#875B51'
    },
    noteText: {
        marginTop: 16,
        color: '#656B69',
        lineHeight: 18,
    },
    checkupText: {
        fontSize: 24,
        color: '#875B51',
        marginTop: 32,
    },
    mouthButton: {
        backgroundColor: '#EDDFD3',
        borderColor: '#875B51',
        borderRadius: 20,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2.5,
    },
    mouthImage: {
        height: 80,
        width: '100%',
        marginBottom: 20,
        alignSelf: 'center',
    },
    logout: {
        position: 'absolute',
        marginTop: 52,
        alignSelf: 'flex-end',
        marginRight: 32,
    },
    basicText: {
        color: '#333333'
    }
});
