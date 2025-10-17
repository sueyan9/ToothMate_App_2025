import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import { Alert, Image, TouchableOpacity, View } from 'react-native';
import { Context as AppointmentContext } from '../../context/AppointmentContext/AppointmentContext';
import { Context as TreatmentContext } from '../../context/TreatmentContext/TreatmentContext';

const UpdateButton = () => {
    const navigation = useNavigation();
    const {confirmAppointment, unconfirmAppointment} = useContext(AppointmentContext);
    const { createTreatment, deleteTestTreatment } = useContext(TreatmentContext);
    const [isLoading, setIsLoading] = useState(false);

    const appointmentId = "68ec66f6f1371a38fc91fee4";

    const handleUpdateInformation = async () => {
        if (!appointmentId) {
            Alert.alert('Error', 'AppointmentID is missing!');
            return;
        }
        setIsLoading(true);
        try {
            await confirmAppointment(appointmentId);

            await createTreatment(
                'ABY0987',           // userNhi
                '11',                 // toothNumber
                'Filling',           // treatmentType
                new Date('2023-10-21'),          // date
                'Root canal notes',
                true   // notes
            );

            //await deleteTestTreatment();
            //await unconfirmAppointment(appointmentId);

            const currentIndex = navigation.getState().index;
            navigation.reset({
            index: 0,
            routes: [{ name: navigation.getState().routes[currentIndex].name }],
            });
        } catch (error) {
            console.error('Confirmation Failed: ', error);
        } finally {
            setIsLoading(false);
            
        }
    };

    return (
        <>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => handleUpdateInformation()}>
                    <Image
                    source={require('../../../assets/tooth_icon.png')}
                    style={{width: 100, height: 35, resizeMode: 'contain'}}/>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default UpdateButton;