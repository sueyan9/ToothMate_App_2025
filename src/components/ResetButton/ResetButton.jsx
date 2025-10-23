import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import axiosApi from '../../api/axios';
import { Context as AppointmentContext } from '../../context/AppointmentContext/AppointmentContext';
import { Context as TreatmentContext } from '../../context/TreatmentContext/TreatmentContext';
import styles from './styles';

const ResetButton = () => {
    const navigation = useNavigation();
    const {unconfirmAppointment} = useContext(AppointmentContext);
    const {deleteTestTreatment } = useContext(TreatmentContext);
    const [isLoading, setIsLoading] = useState(false);

    const deleteTestAppointments = async () => {
        try {
            const response = await axiosApi.delete('/Appointments/test-data/all');
            
            if (response.data.deletedCount > 0) {
                Alert.alert('Success', response.data.message);
            } else {
                Alert.alert('No Test Data', 'No test appointments found.');
            }
        } catch (error) {
            console.error('Failed to delete test appointments:', error);
            Alert.alert('Error', 'Failed to delete test appointments.');
        }
    };

    const handleUpdateInformation = async () => {
        setIsLoading(true);
        try {
            await deleteTestAppointments();
            await unconfirmAppointment();
            await deleteTestTreatment();

            const currentIndex = navigation.getState().index;
            navigation.reset({
            index: 2,
            routes: [
                    { name: 'DentalChart' }, // First screen in stack
                    { name: 'Bookings' }  ,
                    { name: 'Profile' }    // Second screen (currently visible)
                ],
            });
        } catch (error) {
            console.error('Confirmation Failed: ', error);
        } finally {
            setIsLoading(false);
            
        }
    };

    return (
        <>
            <View style={{alignItems: 'center', marginTop: 32}}>
                <TouchableOpacity onPress={() => handleUpdateInformation()}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Reset App</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default ResetButton;