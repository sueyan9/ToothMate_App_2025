import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import axiosApi from '../../api/axios';
import { Context as UserContext } from '../../context/UserContext/UserContext';
import styles from './styles';

dayjs.extend(utc);
dayjs.extend(tz);

const NZ_TZ = 'Pacific/Auckland';



const ClinicScreen = ({navigation, route}) => {
    const { 
        state: { details, clinic}, 
        getUser, 
        getDentalClinic
    } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(false);

    useFocusEffect(
            React.useCallback(() => {
            const fetchUserData = async () => {
                setIsLoading(true);
                try {
                await getUser();
                await getDentalClinic();
                } catch (error) {
                console.error('Error fetching user data:', error);
                } finally {
                setIsLoading(false);
                }
            };
        
            fetchUserData();
            }, [])
        );

    const nhi = details.nhi;
    const [selectedDate, setSelectedDate] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clinicId, setClinicId] = useState(null);
    const [clinicInfo, setClinicInfo] = useState(null);
    

    //appointment form state
    const [newAppt, setNewAppt] = useState({
        startDate: new Date(),
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 30 * 60000), // Default to 30 minutes later
        purpose: '',
        notes: ''
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    useEffect(() => {
        setSelectedDate(dayjs().tz(NZ_TZ).format('YYYY-MM-DD'));
    }, []);

    useEffect(() => {
        loadAppointments();
    }, [nhi]);

    // Fetch the user's clinic (one clinic per user)
    useEffect(() => {
        const userId = details?._id;
        console.log('nhi: ', nhi);
        console.log('userId: ', userId);
        console.log('Clinic data from context:', clinic);
    
    if (clinic && clinic._id) {
        setClinicId(clinic._id);
        setClinicInfo(clinic);
        console.log('[Clinic] Using clinic from context:', clinic._id, clinic?.name);
    } else {
        console.log('No clinic data in context yet');
        setClinicId(null);
        setClinicInfo(null);
    }
    }, [clinic]);

    const logReq = (label, url, cfgOrBody) => {
        const base = axiosApi?.defaults?.baseURL;
        console.log(`[REQ] ${label}`, {baseURL: base, url, cfgOrBody});
    };
    const loadAppointments = async () => {
        let mounted = true;
        setLoading(true);
        try {
            const urlGet = `/Appointments/${nhi}`;
            logReq('GET appointments', urlGet, {params: {limit: 400}});
            const res = await axiosApi.get(`Appointments/${nhi}`, {
                params: {limit: 400}
            });
            console.log('Appointments response:', res?.data);

            const appointments = Array.isArray(res.data)
                ? res.data
                : (res.data && Array.isArray(res.data.items) ? res.data.items : []);
            console.log("aa", appointments)
       // Collect unique clinic IDs from appointments
            const clinicIds = [
                ...new Set(
                    appointments.map(a => (typeof a.clinic === 'object' ? a.clinic.id : a.clinic))
                ),
            ].filter(Boolean);
            console.log("bb", clinicIds)

      // Fetch clinic details by IDs
            let clinicsMap = {};
            if (clinicIds.length > 0) {
                try {
                    const clinicsRes = await axiosApi.get(`/getDentalClinics`, {
                        params: {ids: clinicIds.join(',')}
                    });
                    clinicsMap = (clinicsRes.data || []).reduce((map, c) => {
                        map[c._id] = c;
                        return map;
                    }, {});
                } catch (e) {
                    console.warn('Fetch clinics failed:', e?.message);
                }
            }
            console.log("cc", clinicsMap)
            // Normalize appointments shape
            const normalized = appointments.map(a => {
                const clinicId = typeof a.clinic === 'object' ? a.clinic.id : a.clinic;
                return {
                    ...a,
                    startAt: a.startAt || a.date,
                    endAt: a.endAt || dayjs(a.date).add(30, 'minute').toISOString(),
                    clinic: clinicsMap[clinicId] || (typeof a.clinic === 'object' ? a.clinic : null),
                };
            });
            console.log("dd", normalized)

            if (mounted) setAppointments(normalized);

        } catch (e) {
            console.warn('Load appointments failed:', e?.message);
        } finally {
            if (mounted) setLoading(false);
        }
    };

    const handleNewAppt = async () => {
        if (!newAppt.purpose) {
            Alert.alert('Validation Error', 'Purpose is required.');
            return;
        }
        if (!clinicId) {
            Alert.alert('No Clinic', 'No clinic is linked to this user. Please set a clinic first.');
            return;
        }
        setIsSubmitting(true);

        try {
            const startLocal = dayjs(newAppt.startDate)
                .hour(newAppt.startTime.getHours())
                .minute(newAppt.startTime.getMinutes())
                .toISOString();
            const endLocal = dayjs(newAppt.startDate)
                .hour(newAppt.endTime.getHours())
                .minute(newAppt.endTime.getMinutes())
                .toISOString();
// Allow user-friendly inputs and normalize to expected values if backend uses enums
            const normalizePurpose = (v) => {
                const s = (v || '').trim().toLowerCase();
                if (['check up','checkup','check-up'].includes(s)) return 'Check-up';
                if (['clean','cleaning','cleanup'].includes(s)) return 'Cleaning';
                if (['root canal','rootcanal'].includes(s)) return 'Root canal';
                if (['crown','cap'].includes(s)) return 'Crown';
                return v;
            };
            const appointmentData = {
                nhi,
                purpose: normalizePurpose(newAppt.purpose),
                notes: newAppt.notes || '',
                startLocal,
                endLocal,
                timezone: NZ_TZ,
                clinic: clinicId,
            };
            const urlPost = '/Appointments';

            logReq('POST appointments', urlPost, appointmentData);
            const response = await axiosApi.get(`/Appointments/${encodeURIComponent(nhi)}`, {
                params: { limit: 400 }
            });
            if (response.status === 201 || response.status === 200) {
                Alert.alert('Success', 'Appointment added successfully.');
                setShowAddModal(false);
                resetForm();
                loadAppointments(); // Refresh the appointment list
            }
        } catch (error) {
            console.error('Full error object:', error);
        console.error('Error response:', error?.response);
        console.error('Error response data:', error?.response?.data);
        console.error('Error response status:', error?.response?.status);
        
        // More detailed error message
        let errorMessage = 'Failed to add appointment.';
        if (error?.response?.data) {
            if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.response.data.error) {
                errorMessage = error.response.data.error;
            } else {
                errorMessage = JSON.stringify(error.response.data);
            }
        }
        
        Alert.alert('Error', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setNewAppt({
            startDate: new Date(),
            startTime: new Date(),
            endTime: new Date(new Date().getTime() + 30 * 60000),
            purpose: '',
            notes: ''
        });
    }

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
              arrowColor: '#875B51',
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
              textDayHeaderFontSize: 13,
            }}
          />
        </View>

                {/* Content area below calendar */}
                <View style={styles.contentContainer}>
                    <Text style={styles.selectedDateText}>
                        {selectedDate
                            ? `Appointments for ${formatDate(selectedDate)}`
                            : 'Select a date to view appointments'}
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
                                            <Text style={styles.typeText}>{a.purpose || a.notes}</Text>
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

            {/* POP-up window for adding new appointment */}
            
            <Modal
                visible={showAddModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowAddModal(false)}>
                <Pressable style={styles.modalBackdrop} onPress={() => setShowAddModal(false)}/>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add New Appointment</Text>
                        <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowAddModal(false)}>
                            <Text style={styles.modalCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Date:</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                                <Text>{dayjs(newAppt.startDate).format('YYYY-MM-DD')}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={newAppt.startDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) {
                                            setNewAppt({...newAppt, startDate: selectedDate});
                                        }
                                    }}
                                />
                            )}
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Start Time:</Text>
                            <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.input}>
                                <Text>{dayjs(newAppt.startTime).format('h:mm A')}</Text>
                            </TouchableOpacity>
                            {showStartTimePicker && (
                                <DateTimePicker
                                    value={newAppt.startTime}
                                    mode="time"
                                    display="default"
                                    onChange={(event, selectedTime) => {
                                        setShowStartTimePicker(false);
                                        if (selectedTime) {
                                            setNewAppt({...newAppt, startTime: selectedTime});
                                        }
                                    }}
                                />
                            )}
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>End Time:</Text>
                            <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.input}>
                                <Text>{dayjs(newAppt.endTime).format('h:mm A')}</Text>
                            </TouchableOpacity>
                            {showEndTimePicker && (
                                <DateTimePicker
                                    value={newAppt.endTime}
                                    mode="time"
                                    display="default"
                                    onChange={(event, selectedTime) => {
                                        setShowEndTimePicker(false);
                                        if (selectedTime) {
                                            setNewAppt({...newAppt, endTime: selectedTime});
                                        }
                                    }}
                                />
                            )}
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Purpose:</Text>
                            <TextInput
                                style={styles.input}
                                value={newAppt.purpose}
                                onChangeText={(text) => setNewAppt({...newAppt, purpose: text})}
                                placeholder="Enter appointment purpose"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                            onPress={handleNewAppt}
                            disabled={isSubmitting}>
                            {isSubmitting ? (
                                <ActivityIndicator color="#fff"/>
                            ) : (
                                <Text style={styles.submitButtonText}>Submit</Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>
            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    // Handle add appointment action
                    // handleNewAppt();
                    setShowAddModal(true);
                }}
            >
                <MaterialIcons name="add" size={24} color="#ffffff"/>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ClinicScreen;
