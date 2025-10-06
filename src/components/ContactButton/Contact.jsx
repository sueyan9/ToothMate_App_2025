import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Linking, TouchableOpacity } from 'react-native';
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

    return (
        <>
            <TouchableOpacity style={styles.buttonPhone} onPress={() => Linking.openURL(`tel:${clinic?.phone}`)}>
                <MaterialCommunityIcons name='phone' size={24} color={'#E9F1F8'} style={styles.phone}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonMail} onPress={() => Linking.openURL(`mailto:${clinic?.email}`)}>
                <MaterialCommunityIcons name='mail' size={24} color={'#E9F1F8'} style={styles.phone}/>
            </TouchableOpacity>
        </>
    );
};

export default Contact;