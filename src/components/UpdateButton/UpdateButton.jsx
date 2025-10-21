import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useContext, useState } from 'react';
import { Alert, Image, TouchableOpacity, View } from 'react-native';
import axiosApi from '../../api/axios';
import { Context as AppointmentContext } from '../../context/AppointmentContext/AppointmentContext';
import { Context as TreatmentContext } from '../../context/TreatmentContext/TreatmentContext';

dayjs.extend(utc);
dayjs.extend(timezone);

const UpdateButton = () => {
    const navigation = useNavigation();
    const {confirmAppointment} = useContext(AppointmentContext);
    const { createTreatment} = useContext(TreatmentContext);
    const [isLoading, setIsLoading] = useState(false);

    const nz = (datetime) => {
            return dayjs(datetime)
                .utcOffset(12 * 30) // Force UTC+12 offset (720 minutes)
                .toISOString();
        };


    const logReq = (label, url, cfgOrBody) => {
            const base = axiosApi?.defaults?.baseURL;
            console.log(`[REQ] ${label}`, {baseURL: base, url, cfgOrBody});
        };

    const appointmentId = "68e300017e788723fccaa7d2";

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

            const appointmentData = {
                nhi: "ABY0987",
                purpose: "Root Canal",
                dentist: "Dr. Chen", //not workin
                notes: "First appointment for root canal treatment.",
                startLocal: '2025-12-29T09:30:00.000Z',
                endLocal: '2025-12-29T10:00:00.000Z',
                timezone: 'Pacific/Auckland',
                clinic: '67fa2286e8aa598431bff1f1',
                test_data: true,
                confirmed: true
            };
            const urlPost = '/Appointments';
            logReq('POST appointments', urlPost, appointmentData);
            await axiosApi.post('/Appointments', appointmentData);

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