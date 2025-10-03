import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Linking, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Context as UserContext } from '../../context/UserContext/UserContext';
import styles from './styles';

const Contact = () => {

    const {
        state: {clinic},
        getDentalClinic
    } = useContext(UserContext);

    useFocusEffect(
            React.useCallback(() => {
                const fetchUserData = async () => {
                    try {
                        await getDentalClinic();
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                    } finally {
                    }
                };
                fetchUserData();
            }, [])
        );

    const [modalShown, setModalShown] = useState(false);

    return (
        <>
        <TouchableOpacity style={styles.button} onPress={() => setModalShown(true)}>
            <MaterialCommunityIcons name='phone' size={24} color={'#E9F1F8'} style={styles.phone}/>
        </TouchableOpacity>

        <Modal animationType='slide' transparent={true} visible={modalShown} onRequestClose={() => setModalShown(false)}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{clinic?.name} Contact Details</Text>
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={() => setModalShown(false)}>
                            <Ionicons name="close" size={24} color="#333333" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.detailType}>Phone:</Text>
                        <Text style={styles.detailInfo} onPress={() => Linking.openURL(`tel:${clinic?.phone}`)}>{clinic?.phone}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.detailType}>Email:</Text>
                        <Text style={styles.detailInfo} onPress={() => Linking.openURL(`mailto:${clinic?.email}`)}>{clinic?.email}</Text>
                    </View>
                </View>
            </View>
        </Modal>
        </>
    );
};

export default Contact;