import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useContext, useState } from 'react';
import { ActivityIndicator, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import axiosApi from '../../api/axios';
import { Context as AccessContext } from '../../context/AccessContext/AccessContext';
import { Context as AppointmentContext } from '../../context/AppointmentContext/AppointmentContext';
import { Context as TreatmentContext } from '../../context/TreatmentContext/TreatmentContext';

dayjs.extend(utc);
dayjs.extend(timezone);

const UpdateButton = () => {
    const navigation = useNavigation();
    const {confirmAppointment} = useContext(AppointmentContext);
    const { createTreatment} = useContext(TreatmentContext);
    const [isLoading, setIsLoading] = useState(false);

    const accessContext = useContext(AccessContext);
    const { 
    state: accessState = { isMasterAdmin: false}
    } = accessContext || {};

    const { isMasterAdmin } = accessState;

    const nz = (datetime) => {
            return dayjs(datetime)
                .utcOffset(12 * 30) // Force UTC+12 offset (720 minutes)
                .toISOString();
        };


    const logReq = (label, url, cfgOrBody) => {
            const base = axiosApi?.defaults?.baseURL;
            console.log(`[REQ] ${label}`, {baseURL: base, url, cfgOrBody});
        };

    const handleUpdateInformation = async () => {
        if (isMasterAdmin) {
        setIsLoading(true);
        try {
            await confirmAppointment();

            await createTreatment(
                'ABE8011',           // userNhi
                '16',                 // toothNumber
                'Implant',           // treatmentType
                new Date('2025-10-23'),          // date
                'Removed affected tooth and placed endosteal implant.',
                true   // notes
            );

            const appointmentData = {
                nhi: "ABE8011",
                purpose: "Root Canal",
                dentist: "Dr. Sarah Michael", //not workin
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
                        Updating app...
                    </Text>
                </View>
            </Modal>

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