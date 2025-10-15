import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    titleText: {
        fontSize: 24,
        color: '#333333',
        marginBottom: 16,
        marginLeft: 16,
        flexWrap: 'wrap',
        width: 260,
        overflow: 'hidden'
    },
    container: {
        flex: 1,
        backgroundColor: '#E9F1F8',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 64,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    profile: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    helloContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'left',
        marginTop: 108,
        marginBottom: 16,
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
        color: '#875B51',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    appointmentTextName: {
        color: '#875B51',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        flexWrap: 'wrap',
        width: 260,
        overflow: 'hidden'
    },
    noteText: {
        marginTop: 16,
        color: '#656B69',
        lineHeight: 18,
    },
    checkupText: {
        fontSize: 18,
        color: '#333333',
        marginTop: 16,
    },
    bookNowText: {
        fontSize: 16,
        color: '#875B51',
        textDecorationLine: 'underline',
        marginTop: 16,
        fontWeight: 'bold',
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
        width: '90%',
        marginBottom: 8,
        marginTop: -8,
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
    },
    boldText: {
        color: '#333333',
        fontWeight: 'bold',
    },
    profileInitials: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#516287',
    },
    profileContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 40,
        width: 80,
        height: 80,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#333333',
    }
});
