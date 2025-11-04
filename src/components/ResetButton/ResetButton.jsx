import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native';
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
                console.log('Success', response.data.message);
            } else {
                console.log('No Test Data', 'No test appointments found.');
            }
        } catch (error) {
            console.error('Failed to delete test appointments:', error);
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
            <Modal
                transparent={true}
                visible={isLoading}
                animationType="fade"
            >
                <View style={{ 
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <ActivityIndicator size="large" color="#516287" />
                    <Text style={{ marginTop: 16, fontSize: 16, color: '#516287' }}>
                        Resetting app...
                    </Text>
                </View>
            </Modal>
        
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