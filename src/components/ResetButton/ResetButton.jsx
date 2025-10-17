import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Context as AppointmentContext } from '../../context/AppointmentContext/AppointmentContext';
import { Context as TreatmentContext } from '../../context/TreatmentContext/TreatmentContext';
import styles from './styles';

const ResetButton = () => {
    const navigation = useNavigation();
    const {unconfirmAppointment} = useContext(AppointmentContext);
    const {deleteTestTreatment } = useContext(TreatmentContext);
    const [isLoading, setIsLoading] = useState(false);

    const appointmentId = "68ec66f6f1371a38fc91fee4";

    const handleUpdateInformation = async () => {
        if (!appointmentId) {
            Alert.alert('Error', 'AppointmentID is missing!');
            return;
        }
        setIsLoading(true);
        try {
            await unconfirmAppointment(appointmentId);
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