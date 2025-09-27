import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'; //deopdown list
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
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
        state: {details, clinic},
        getUser,
        getDentalClinic
    } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(false);
// Fetch user and clinic details when screen is focused
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
    const [showDentistSheet, setShowDentistSheet] = useState(false);
    const [showPurposeSheet, setShowPurposeSheet] = useState(false);

    const DENTIST_NAMES = [
        'Dr. Toothmate',
        'Dr. Williams',
        'Dr. Chen',
        'Dr. Patel',
        'Dr. Singh',
    ];
    const PURPOSES = ['Check-up', 'Consoltation'];

// Appointment slot constants
    const SLOT_MINUTES = 30;
    const OPEN_MINUTES = 9 * 60;           // 09:00
    const CLOSE_MINUTES = 17 * 60;         // 17:00
    const LAST_START_MINUTES = CLOSE_MINUTES - SLOT_MINUTES; // no later than 16:30
    // Round to nearest 30 minutes
    const roundTo30 = (date) => {
        const d = new Date(date);
        const m = d.getMinutes();
        const rounded = Math.round(m / 30) * 30;
        d.setMinutes(rounded, 0, 0);
        return d;
    };
    // Ceil up to next 30 minutes
    const ceilTo30 = (date) => {
        const d = new Date(date);
        const m = d.getMinutes();
        const ceil = Math.ceil(m / 30) * 30;
        if (ceil === 60) {
            d.setHours(d.getHours() + 1, 0, 0, 0);
        } else {
            d.setMinutes(ceil, 0, 0);
        }
        return d;
    };
// Get the next valid slot considering business hours（9am-5pm）
    const nextValidSlotFromNow = () => {
        const now = nzNow();
        const todayOpen = now.hour(9).minute(0).second(0).millisecond(0);
        const todayLast = now.hour(16).minute(30).second(0).millisecond(0);

        if (now.isBefore(todayOpen)) return todayOpen.toDate();
        if (now.isAfter(todayLast)) {
            return now.add(1, 'day').hour(9).minute(0).second(0).millisecond(0).toDate();
        }
        // Inside business hours → round up to nearest 30 mins
        return ceilTo30(now.toDate());
    };
    const addMinutes = (date, mins) => new Date(date.getTime() + mins * 60000);
    const nzNow = () => dayjs().tz(NZ_TZ);

    const [lastAppointmentTime, setLastAppointmentTime] = useState(null);
    const [cooldownRemaining, setCooldownRemaining] = useState(0);
    const COOLDOWN_MINUTES = 2;

    const minutesOfDay = (d) => d.getHours() * 60 + d.getMinutes();

    const clampToBusinessStart = (dateObj) => {
        // Clamp time within business hours (09:00–16:30)
        const h = dateObj.getHours();
        const m = dateObj.getMinutes();
        let mins = h * 60 + m;
        if (mins < OPEN_MINUTES) mins = OPEN_MINUTES;
        if (mins > LAST_START_MINUTES) mins = LAST_START_MINUTES;
        const d = new Date(dateObj);
        d.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
        return d;
    };

    const [selectedDentistName, setSelectedDentistName] = useState(DENTIST_NAMES[0]);//default select the first one

    //appointment form state
    const [newAppt, setNewAppt] = useState({
        startDate: new Date(),
        startTime: roundTo30(new Date()),
        endTime: addMinutes(roundTo30(new Date()), SLOT_MINUTES),
        purpose: '',
        notes: '',
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);

// Default selected date = today
    useEffect(() => {
        setSelectedDate(dayjs().tz(NZ_TZ).format('YYYY-MM-DD'));
    }, []);
    // Load appointments when NHI changes
    useEffect(() => {
        if (nhi) loadAppointments();
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

    //cooldown func on appts
    useEffect(() => {
    let interval;
    if (cooldownRemaining > 0) {
        interval = setInterval(() => {
            setCooldownRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }
    return () => {
        if (interval) clearInterval(interval);
    };
    }, [cooldownRemaining]);

    const logReq = (label, url, cfgOrBody) => {
        const base = axiosApi?.defaults?.baseURL;
        console.log(`[REQ] ${label}`, {baseURL: base, url, cfgOrBody});
    };
    // Fetch appointments from API
    const loadAppointments = async () => {
        if (!nhi) return;
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
// Submit a new appointment
    const handleNewAppt = async () => {

        if (cooldownRemaining > 0) {
        Alert.alert(
            'Please Wait', 
            `You can create another appointment in ${Math.ceil(cooldownRemaining / 60)} minute(s) and ${cooldownRemaining % 60} second(s).`
        );
        return;
        }

        if (!newAppt.purpose) {
            Alert.alert('Validation Error', 'Purpose is required.');
            return;
        }
        if (!clinicId) {
            Alert.alert('No Clinic', 'No clinic is linked to this user. Please set a clinic first.');
            return;
        }
        if (!selectedDentistName) {
            Alert.alert('Validation Error', 'Please select a dentist.');
            return;
        }

        setIsSubmitting(true);
        const startNZ = dayjs(newAppt.startDate)
            .tz(NZ_TZ)
            .hour(newAppt.startTime.getHours())
            .minute(newAppt.startTime.getMinutes())
            .second(0).millisecond(0);
// Validate time is not in the past
        const nowNZ = nzNow();
        if (startNZ.isBefore(nowNZ)) {
            Alert.alert('Invalid Time', 'Cannot book past times');
            setIsSubmitting(false);
            return;
        }
        // Validate business hours
        const startMins = startNZ.hour() * 60 + startNZ.minute();
        if (startMins < OPEN_MINUTES || startMins > LAST_START_MINUTES) {
            Alert.alert('Invalid Time', 'Appointments allowed only between 09:00–17:00 (last start 16:30).');
            setIsSubmitting(false);
            return;
        }
        try {
            const startNZ = dayjs(newAppt.startDate)
                .tz(NZ_TZ)
                .hour(newAppt.startTime.getHours())
                .minute(newAppt.startTime.getMinutes())
                .second(0)
                .millisecond(0);
            const endNZ = startNZ.add(SLOT_MINUTES, 'minute');

            const startWithOffset = startNZ.format('YYYY-MM-DDTHH:mm:ssZ'); // e.g. 2025-09-19T09:00:00+12:00
            const endWithOffset   = endNZ.format('YYYY-MM-DDTHH:mm:ssZ');

            const appointmentData = {
                nhi,
                purpose: newAppt.purpose,
                dentist: {name: selectedDentistName},
                notes: newAppt.notes || '',
                startLocal: startWithOffset,
                endLocal: endWithOffset,
                timezone: NZ_TZ,
                clinic: clinicId,
            };
            const urlPost = '/Appointments';
            logReq('POST appointments', urlPost, appointmentData);
            const response = await axiosApi.post('/Appointments', appointmentData);

            if (response.status === 201 || response.status === 200) {
                Alert.alert('Success', 'Appointment added successfully.');

                setLastAppointmentTime(Date.now());
                setCooldownRemaining(COOLDOWN_MINUTES * 60);

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
// Reset appointment form
    const resetForm = () => {
        const start = roundTo30(new Date());
        setNewAppt({
            startDate: new Date(),
            startTime: start,
            endTime: addMinutes(start, SLOT_MINUTES),
            purpose: '',
            notes: ''
        });
    }

    const apptDateKey = (iso) => (iso ? dayjs(iso).tz(NZ_TZ).format('YYYY-MM-DD') : '');
    const timeLabel = (iso) => (iso ? dayjs(iso).tz(NZ_TZ).format('h:mm A') : '--');
// Marked dates for calendar
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
// Filter appointment list for selected date
    const dayList = useMemo(() => {
        if (!selectedDate) return [];
        return appointments
            .filter(a => apptDateKey(a.startAt) === selectedDate)
            .sort((a, b) => dayjs(a.startAt).valueOf() - dayjs(b.startAt).valueOf());
    }, [appointments, selectedDate]);

    const onDayPress = (day) => {
        const pressed = dayjs.tz(day.dateString, NZ_TZ);
        if (pressed.isBefore(nzNow(), 'day')) return; // ignore the click on passed time
        setSelectedDate(day.dateString);
    }
    const formatDate = (d) => (d ? dayjs.tz(d, NZ_TZ).format('D MMMM YYYY') : '');

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Calendar at the top */}
                <View style={styles.calendarContainer}>
                    <Calendar
                        onDayPress={onDayPress}
                        markedDates={markedDates}
                        minDate={dayjs().tz(NZ_TZ).format('YYYY-MM-DD')}//passed time unavailable
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
                                        <View style={{display: 'flex', flexDirection: 'row'}}>
                                            <View style={styles.typeTag}>
                                                <Text style={styles.typeText}>{a.purpose || a.notes}</Text>
                                            </View>
                                            <View style={[styles.confirmedTag, a.confirmed ? styles.confirmed : styles.unconfirmed]}>
                                                <Text style={a.confirmed ? styles.confirmedText : styles.unconfirmedText}>{a.confirmed ? "Confirmed" : "Unconfirmed"}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.typeTag}>
                                                <Text style={styles.typeText}>Patient: {details.firstname} {details.lastname}</Text>
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
                                <View style={styles.modalDetailCancel}>
                                    <Text style={styles.modalDetailValueCancel}>If you wish to cancel this appointment,</Text>
                                    <Text style={styles.modalDetailValueCancel}>please call {selectedAppointment.clinic?.phone}</Text>
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
                {/* translucent backdrop, tap to close */}
                <Pressable style={styles.modalBackdrop} onPress={() => setShowAddModal(false)}/>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add New Appointment</Text>
                        <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowAddModal(false)}>
                            <Text style={styles.modalCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        {/* Date */}
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
                                    minimumDate={nzNow().startOf('day').toDate()}//passed time unavilable
                                    onChange={(event, date) => {
                                        setShowDatePicker(false);
                                        if (!date || !(date instanceof Date)) return;

                                        const selectedDateNZ = dayjs(date).tz(NZ_TZ);
                                        const isToday = selectedDateNZ.isSame(nzNow(), 'day');

                                        const currentTimeNZ = dayjs(newAppt.startTime).tz(NZ_TZ);

                                        // compose a datetime on the chosen day using existing hour/minute
                                        const base = selectedDateNZ
                                        .hour(currentTimeNZ.hour())
                                        .minute(currentTimeNZ.minute())
                                        .second(0)
                                        .millisecond(0)
                                        .toDate();

                                        // snap to :00/:30 and clamp to 09:00–16:30
                                        let rounded = roundTo30(base);
                                        rounded = clampToBusinessStart(rounded);

                                        // if today, do not allow earlier than the next valid slot from now
                                        if (isToday) {
                                            const nowSlot = nextValidSlotFromNow();
                                            if (dayjs(rounded).isBefore(nowSlot)) {
                                                rounded = clampToBusinessStart(roundTo30(nowSlot));
                                            }
                                        }

                                        setNewAppt({
                                            ...newAppt,
                                            startDate: date,
                                            startTime: rounded,
                                            endTime: addMinutes(rounded, SLOT_MINUTES),
                                        });
                                    }}
                                />
                            )}
                        </View>
                        {/* Start Time */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Start Time:</Text>
                            <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.input}>
                                <Text>{dayjs(newAppt.startTime).format('h:mm A')}</Text>
                            </TouchableOpacity>
                            {showStartTimePicker && (() => {
                                const isToday = dayjs(newAppt.startDate).tz(NZ_TZ).isSame(nzNow(), 'day');
                                const minTime = isToday
                                    ? nextValidSlotFromNow()// today: start at the next valid slot from now
                                    : dayjs(newAppt.startDate).hour(9).minute(0).second(0).millisecond(0).toDate();
                                const maxTime = dayjs(newAppt.startDate).hour(16).minute(30).second(0).millisecond(0).toDate();

                                return (
                                    <DateTimePicker
                                        value={newAppt.startTime}
                                        mode="time"
                                        display="spinner"       // iOS respects min/max better with spinner
                                        minuteInterval={30}     // effective on iOS; Android still has fallback logic
                                        minimumDate={minTime}   // show only >= 09:00 (or >= next valid slot for today)
                                        maximumDate={maxTime}   // lastest 16:30
                                        onChange={(event, time) => {
                                            setShowStartTimePicker(false);
                                            if (!time || !(time instanceof Date)) return;

                                            // snap to half-hour and clamp into business window
                                            let rounded = roundTo30(time);
                                            rounded = clampToBusinessStart(rounded);

                                            // if today and still before nowSlot, bump to nowSlot
                                            if (isToday) {
                                                const nowSlot = nextValidSlotFromNow();
                                                if (dayjs(rounded).isBefore(nowSlot)) {
                                                    rounded = clampToBusinessStart(roundTo30(nowSlot));
                                                }
                                            }

                                            setNewAppt({
                                                ...newAppt,
                                                startTime: rounded,
                                                endTime: addMinutes(rounded, SLOT_MINUTES),
                                            });
                                        }}
                                    />
                                );
                            })()}
                        </View>
                        {/* End Time (auto) */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>End Time (auto):</Text>
                            <View style={styles.input}>
                                <Text>{dayjs(newAppt.endTime).format('h:mm A')}</Text>
                            </View>
                        </View>
                        {/* Dentist */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Dentist:</Text>

                            {/* iOS: custom lightweight “dropdown” (Modal + list) to avoid tall wheel picker */}
                            {Platform.OS === 'ios' ? (
                                <>
                                    <TouchableOpacity
                                        style={styles.input}
                                        onPress={() => setShowDentistSheet(true)}
                                        activeOpacity={0.7}
                                    >
                                        <Text>{selectedDentistName || 'Select dentist'}</Text>
                                    </TouchableOpacity>

                                    <Modal
                                        visible={showDentistSheet}
                                        transparent
                                        animationType="fade"
                                        onRequestClose={() => setShowDentistSheet(false)}
                                    >
                                        {/* dimmed backdrop; tap to close */}
                                        <Pressable style={{
                                            flex: 1,
                                            backgroundColor: 'rgba(0,0,0,0.25)',
                                            justifyContent: 'center',
                                            padding: 24
                                        }} onPress={() => setShowDentistSheet(false)}>
                                            {/* card container (limited height, scrollable) */}
                                            <Pressable
                                                onPress={(e) => e.stopPropagation()}
                                                style={{
                                                    backgroundColor: '#fff',
                                                    borderRadius: 12,
                                                    paddingVertical: 8,
                                                    maxHeight: 280,      // prevent filling the whole screen
                                                    overflow: 'hidden',
                                                    shadowColor: '#000',
                                                    shadowOpacity: 0.15,
                                                    shadowRadius: 12,
                                                    elevation: 4
                                                }}
                                            >
                                                <ScrollView
                                                    contentContainerStyle={{paddingVertical: 4}}
                                                    showsVerticalScrollIndicator={false}
                                                >
                                                    {DENTIST_NAMES.map((name) => (
                                                        <TouchableOpacity
                                                            key={name}
                                                            onPress={() => {
                                                                setSelectedDentistName(name);
                                                                setShowDentistSheet(false);
                                                            }}
                                                            style={{
                                                                paddingVertical: 12,
                                                                paddingHorizontal: 16,
                                                                backgroundColor: name === selectedDentistName ? '#f1f5f9' : 'transparent'
                                                            }}
                                                        >
                                                            <Text style={{fontSize: 16}}>{name}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </Pressable>
                                        </Pressable>
                                    </Modal>
                                </>
                            ) : (
                                // Android: keep native dropdown Picker (doesn't take vertical space)
                                <View style={[styles.input, {paddingHorizontal: 0}]}>
                                    <Picker
                                        mode="dropdown"
                                        selectedValue={selectedDentistName}
                                        onValueChange={(val) => setSelectedDentistName(val)}
                                    >
                                        {DENTIST_NAMES.map((n) => (
                                            <Picker.Item key={n} label={n} value={n}/>
                                        ))}
                                    </Picker>
                                </View>
                            )}
                        </View>

                        {/* Purpose */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Purpose:</Text>

                            {Platform.OS === 'ios' ? (
                                <>
                                    {/* trigger styled as an input */}
                                    <TouchableOpacity
                                        style={styles.input}
                                        onPress={() => setShowPurposeSheet(true)}
                                        activeOpacity={0.7}
                                    >
                                        <Text>{newAppt.purpose || 'Select purpose'}</Text>
                                    </TouchableOpacity>

                                    {/* lightweight dropdown modal  */}
                                    <Modal
                                        visible={showPurposeSheet}
                                        transparent
                                        animationType="fade"
                                        onRequestClose={() => setShowPurposeSheet(false)}
                                    >
                                        {/* dimmed backdrop  */}
                                        <Pressable
                                            style={{
                                                flex: 1,
                                                backgroundColor: 'rgba(0,0,0,0.25)',
                                                justifyContent: 'center',
                                                padding: 24,
                                            }}
                                            onPress={() => setShowPurposeSheet(false)}
                                        >
                                            {/* card container (limited height) */}
                                            <Pressable
                                                onPress={(e) => e.stopPropagation()}
                                                style={{
                                                    backgroundColor: '#fff',
                                                    borderRadius: 12,
                                                    paddingVertical: 8,
                                                    maxHeight: 280,
                                                    overflow: 'hidden',
                                                    shadowColor: '#000',
                                                    shadowOpacity: 0.15,
                                                    shadowRadius: 12,
                                                    elevation: 4,
                                                }}
                                            >
                                                <ScrollView contentContainerStyle={{paddingVertical: 4}}
                                                            showsVerticalScrollIndicator={false}>
                                                    {PURPOSES.map((p) => (
                                                        <TouchableOpacity
                                                            key={p}
                                                            onPress={() => {
                                                                setNewAppt({...newAppt, purpose: p});
                                                                setShowPurposeSheet(false);
                                                            }}
                                                            style={{
                                                                paddingVertical: 12,
                                                                paddingHorizontal: 16,
                                                                backgroundColor: p === newAppt.purpose ? '#f1f5f9' : 'transparent',
                                                            }}
                                                        >
                                                            <Text style={{fontSize: 16}}>{p}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </Pressable>
                                        </Pressable>
                                    </Modal>
                                </>
                            ) : (
                                // Android：native dropdown Picker
                                <View style={[styles.input, {paddingHorizontal: 0}]}>
                                    <Picker
                                        mode="dropdown"
                                        selectedValue={newAppt.purpose}
                                        onValueChange={(val) => setNewAppt({...newAppt, purpose: val})}
                                    >
                                        <Picker.Item label="Select purpose..." value=""/>
                                        {PURPOSES.map((p) => (
                                            <Picker.Item key={p} label={p} value={p}/>
                                        ))}
                                    </Picker>
                                </View>
                            )}
                        </View>
                        {/* Submit */}
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
                    // preset form when opening the modal
                    const baseDate = selectedDate
                        ? dayjs.tz(selectedDate, NZ_TZ).toDate()
                        : nzNow().startOf('day').toDate();

                    // today → next valid slot from now; other days → 09:00
                    const isToday = dayjs(baseDate).tz(NZ_TZ).isSame(nzNow(), 'day');
                    const start = isToday
                        ? nextValidSlotFromNow()
                        : dayjs(baseDate).hour(9).minute(0).second(0).millisecond(0).toDate();

                    const startRounded = clampToBusinessStart(roundTo30(start));

                    setNewAppt({
                        startDate: baseDate,
                        startTime: startRounded,
                        endTime: addMinutes(startRounded, SLOT_MINUTES),
                        purpose: '',
                        notes: '',
                    });
                    setShowAddModal(true);
                }}
            >
                <MaterialIcons name="add" size={24} color="#ffffff"/>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ClinicScreen;
