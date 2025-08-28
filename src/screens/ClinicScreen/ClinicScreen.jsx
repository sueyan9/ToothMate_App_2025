import { MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import axiosApi from '../../api/axios';
import styles from './styles';

dayjs.extend(utc);
dayjs.extend(tz);

const NZ_TZ = 'Pacific/Auckland';

const ClinicScreen = ({navigation, route}) => {
    const nhi = route?.params?.nhi || 'CBD1234';
    const [selectedDate, setSelectedDate] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    useEffect(() => {
        setSelectedDate(dayjs().tz(NZ_TZ).format('YYYY-MM-DD'));
    }, []);
    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const res = await axiosApi.get(`/appointments/${nhi}?limit=400`);

                const appointments = Array.isArray(res.data)
                    ? res.data
                    : (res.data && Array.isArray(res.data.items) ? res.data.items : []);
                console.log("aa",appointments)

                const clinicIds = [
                    ...new Set(
                        appointments.map(a => (typeof a.clinic === 'object' ? a.clinic.id : a.clinic))
                    ),
                ].filter(Boolean);
                console.log("bb",clinicIds)

                let clinicsMap = {};
                if (clinicIds.length > 0) {
                    const clinicsRes = await axiosApi.get(`/getDentalClinics?ids=${clinicIds.join(',')}`);
                    clinicsMap = (clinicsRes.data || []).reduce((map, c) => {
                        map[c._id] = c;
                        return map;
                    }, {});
                }
                console.log("cc",clinicsMap)

                const normalized = appointments.map(a => {
                    const clinicId = typeof a.clinic === 'object' ? a.clinic.id : a.clinic;
                    return {
                        ...a,
                        startAt: a.startAt || a.date,
                        endAt: a.endAt || dayjs(a.date).add(30, 'minute').toISOString(),
                        clinic: clinicsMap[clinicId] || null, // 附加完整诊所数据
                    };
                });
                console.log("dd",normalized)

                if (mounted) setAppointments(normalized);

            } catch (e) {
                console.warn('Load appointments failed:', e?.message);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [nhi]);
    const apptDateKey = (iso) => (iso ? dayjs(iso).tz(NZ_TZ).format('YYYY-MM-DD') : '');
    const timeLabel = (iso) => (iso ? dayjs(iso).tz(NZ_TZ).format('h:mm A') : '--');

    const markedDates = useMemo(() => {
        const m = {};
        appointments.forEach(a => {
            const k = apptDateKey(a.startAt);
            m[k] = {marked: true, dotColor: '#00adf5'};
        });
        if (selectedDate) m[selectedDate] = {
            ...(m[selectedDate] || {}),
            selected: true,
            selectedColor: '#00adf5',
            selectedTextColor: '#fff'
        };
        return m;
    }, [appointments, selectedDate]);

    const dayList = useMemo(() => {
        if (!selectedDate) return [];
        return appointments
            .filter(a => apptDateKey(a.startAt) === selectedDate)
            .sort((a, b) => dayjs(a.startAt).valueOf() - dayjs(b.startAt).valueOf());
    }, [appointments, selectedDate]);

    const onDayPress = (day) => setSelectedDate(day.dateString);
    const formatDate = (d) => (d ? dayjs.tz(d, NZ_TZ).format('D MMMM YYYY') : '');

    // // Function to format date from YYYY-MM-DD to readable format
    // const formatDate = (dateString) => {
    //     if (!dateString) return '';
    //     const date = new Date(dateString);
    //     const options = {day: 'numeric', month: 'long', year: 'numeric'};
    //     return date.toLocaleDateString('en-GB', options);
    // };
    //
    // // Mock appointment data for August 14th, 15th, and 16th, 2025
    // const [appointmentData] = useState([
    //     {
    //         id: '1',
    //         date: '2025-08-14',
    //         time: '9:00 AM',
    //         location: 'AUT Dentist',
    //         dentist: 'Dr. Toothmate',
    //         type: 'Check-up'
    //     },
    //     {
    //         id: '2',
    //         date: '2025-08-14',
    //         time: '11:30 AM',
    //         location: 'AUT Dentist',
    //         dentist: 'Dr. Toothmate',
    //         type: 'Cleaning'
    //     },
    //     {
    //         id: '3',
    //         date: '2025-08-15',
    //         time: '10:00 AM',
    //         location: 'AUT Dentist',
    //         dentist: 'Dr. Toothmate',
    //         type: 'Consultation'
    //     },
    //     {
    //         id: '4',
    //         date: '2025-08-15',
    //         time: '2:00 PM',
    //         location: 'AUT Dentist',
    //         dentist: 'Dr. Toothmate',
    //         type: 'Filling'
    //     },
    //     {
    //         id: '5',
    //         date: '2025-08-15',
    //         time: '4:30 PM',
    //         location: 'AUT Dentist',
    //         dentist: 'Dr. Toothmate',
    //         type: 'Check-up'
    //     },
    //     {
    //         id: '6',
    //         date: '2025-08-16',
    //         time: '8:30 AM',
    //         location: 'AUT Dentist',
    //         dentist: 'Dr. Toothmate',
    //         type: 'Cleaning'
    //     },
    //     {
    //         id: '7',
    //         date: '2025-08-16',
    //         time: '1:00 PM',
    //         location: 'AUT Dentist',
    //         dentist: 'Dr. Toothmate',
    //         type: 'Root Canal'
    //     }
    // ]);

    // // Filter appointments based on selected date
    // const filteredAppointments = selectedDate
    //     ? appointmentData.filter(appointment => appointment.date === selectedDate)
    //     : [];
    //
    // // Create marked dates object for calendar with appointment indicators
    // const markedDates = {
    //     ...appointmentData.reduce((acc, appointment) => {
    //         acc[appointment.date] = {
    //             marked: true,
    //             dotColor: '#00adf5'
    //         };
    //         return acc;
    //     }, {}),
    //     [selectedDate]: {
    //         selected: true,
    //         marked: appointmentData.some(apt => apt.date === selectedDate),
    //         selectedColor: '#00adf5',
    //         selectedTextColor: '#ffffff'
    //     }
    // };
    //
    // const onDayPress = (day) => {
    //     setSelectedDate(day.dateString);
    // };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Calendar at the top */}
                <View style={styles.calendarContainer}>
                    <Calendar
                        onDayPress={onDayPress}
                        markedDates={markedDates}
                        theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#b6c1cd',
                            selectedDayBackgroundColor: '#00adf5',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#00adf5',
                            dayTextColor: '#2d4150',
                            textDisabledColor: '#d9e1e8',
                            dotColor: '#00adf5',
                            selectedDotColor: '#ffffff',
                            arrowColor: 'orange',
                            disabledArrowColor: '#d9e1e8',
                            monthTextColor: 'blue',
                            indicatorColor: 'blue',
                            textDayFontFamily: 'monospace',
                            textMonthFontFamily: 'monospace',
                            textDayHeaderFontFamily: 'monospace',
                            textDayFontWeight: '300',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '300',
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 13
                        }}
                    />
                </View>

                {/* Content area below calendar */}
                <View style={styles.contentContainer}>
                    <Text style={styles.selectedDateText}>
                        {selectedDate ? `Appointments for ${formatDate(selectedDate)}` : 'Select a date to view appointments'}
                    </Text>

                    {/* Appointment cards */}
                    {selectedDate && (
                        <ScrollView style={styles.appointmentsList}>
                            {dayList.length > 0 ? (
                                dayList.map((a) => (
                                    <TouchableOpacity key={a._id} style={styles.appointmentCard}
                                                      onPress={() => setSelectedAppointment(a)}>

                                        <View style={styles.cardContent}>
                                            <View style={styles.appointmentInfo}>
                                                <Text style={styles.timeText}>{timeLabel(a.startAt)}</Text>
                                                <Text
                                                    style={styles.locationText}>{a.clinic?.name || a.clinic?.location}</Text>
                                                <Text style={styles.dentistText}>{a.dentist?.name}</Text>
                                            </View>
                                            <MaterialIcons name="keyboard-arrow-right" size={30} color="#875B51"/>
                                        </View>
                                        <View style={styles.typeTag}>
                                            <Text style={styles.typeText}>{a.purpose|| a.notes}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View style={styles.noAppointments}>
                                    <Text style={styles.noAppointmentsText}>No appointments for this date</Text>
                                </View>
                            )}
                        </ScrollView>
                    )}
                </View>
            </ScrollView>
            {/* POP-up window for appointment info */}
            <Modal
                visible={!!selectedAppointment}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedAppointment(null)}
            >
                {/* half transparent cover,and close on left top corner */}
                <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setSelectedAppointment(null)}
                />
                {/* bottom POP-up window for appointment detail   */}
                <View
                    style={styles.modalContainer}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Appointment Details</Text>
                        <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedAppointment(null)}>
                            <Text style={styles.modalCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        {selectedAppointment && (

                            <View style={styles.modalContent}>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>Date:</Text>
                                    <Text
                                        style={styles.modalDetailValue}>{dayjs(selectedAppointment.startAt).tz(NZ_TZ).format('YYYY-MM-DD')}</Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>Time:</Text>
                                    <Text style={styles.modalDetailValue}>
                                        {timeLabel(selectedAppointment.startAt)} - {timeLabel(selectedAppointment.endAt)}
                                    </Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>Dentist:</Text>
                                    <Text style={styles.modalDetailValue}>{selectedAppointment.dentist?.name}</Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>Clinic:</Text>
                                    <Text style={styles.modalDetailValue}>
                                        {selectedAppointment.clinic?.name}
                                    </Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>Phone:</Text>
                                    <Text style={styles.modalDetailValue}>
                                        {selectedAppointment.clinic?.phone}
                                    </Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>Address:</Text>
                                    <Text style={styles.modalDetailValue}>
                                        {selectedAppointment.clinic?.address}
                                    </Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalDetailLabel}>Type:</Text>
                                    <Text style={styles.modalDetailValue}>{selectedAppointment.purpose}</Text>
                                </View>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </Modal>
            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    // Handle add appointment action
                    console.log('Add appointment pressed');
                }}
            >
                <MaterialIcons name="add" size={24} color="#ffffff"/>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ClinicScreen;
