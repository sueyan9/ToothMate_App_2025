import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginRight: 24,
        backgroundColor: '#875B51',
        justifyContent: 'center'
    },
    phone: {
        alignSelf: 'center',
        justifyContent: 'center'
    },
    modalContainer: {
        backgroundColor: '#FFFDF6',
        borderRadius: 16,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EDDFD3',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        flexWrap: 'wrap',
        maxWidth: '90%',
        flexShrink: 1,
        textAlign: 'center'
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 8,
        paddingRight: 8,
        flexWrap: 'wrap',
        rowGap: 20,
    },
    detailInfo: {
        fontSize: 16,
        color: '#875B51',
        textAlign: 'right',
        maxWidth: '80%',
        flex: 2,
        flexShrink: 1,
        textDecorationLine: 'underline'
    },
    detailType: {
        fontSize: 16,
        color: '#333333',
        textAlign: 'left',
        flex: 1,
        flexShrink: 0
    }
});