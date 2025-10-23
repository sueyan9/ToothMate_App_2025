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
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 32,
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
        color: '#875B51',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
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
        fontSize: 20,
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
        width: '100%',
        marginBottom: 20,
        alignSelf: 'center',
        resizeMode: 'contain',
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
    },
    
    // New styles for LocationFinder
    topCornerBackButton: {
        position: 'absolute',
        top: 52,
        left: 16,
        zIndex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        padding: 8,
    },
    headerContainer: {
        marginTop: 100,
        marginBottom: 20,
        alignItems: 'center',
    },
    headerTextContainer: {
        alignItems: 'center',
    },
    itemCountText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    searchContainer: {
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    searchInput: {
        backgroundColor: '#FFFDF6',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333333',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    contentList: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    contentCard: {
        backgroundColor: '#FFFDF6',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 8,
        position: 'relative',
    },
    absoluteArrow: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -15 }],
    },
    cardContent: {
        paddingRight: 40,
    },
    topicText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    contactText: {
        fontSize: 12,
        color: '#875B51',
        marginBottom: 2,
    },
});