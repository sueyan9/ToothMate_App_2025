import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
    Modal,
  Pressable,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import styles from './styles';

const ClinicScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Function to format date from YYYY-MM-DD to readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  // Mock appointment data for August 14th, 15th, and 16th, 2025
  const [appointmentData] = useState([
    {
      id: '1',
      date: '2025-08-14',
      time: '9:00 AM',
      location: 'AUT Dentist',
      dentist: 'Dr. Toothmate',
      type: 'Check-up'
    },
    {
      id: '2',
      date: '2025-08-14',
      time: '11:30 AM',
      location: 'AUT Dentist',
      dentist: 'Dr. Toothmate',
      type: 'Cleaning'
    },
    {
      id: '3',
      date: '2025-08-15',
      time: '10:00 AM',
      location: 'AUT Dentist',
      dentist: 'Dr. Toothmate',
      type: 'Consultation'
    },
    {
      id: '4',
      date: '2025-08-15',
      time: '2:00 PM',
      location: 'AUT Dentist',
      dentist: 'Dr. Toothmate',
      type: 'Filling'
    },
    {
      id: '5',
      date: '2025-08-15',
      time: '4:30 PM',
      location: 'AUT Dentist',
      dentist: 'Dr. Toothmate',
      type: 'Check-up'
    },
    {
      id: '6',
      date: '2025-08-16',
      time: '8:30 AM',
      location: 'AUT Dentist',
      dentist: 'Dr. Toothmate',
      type: 'Cleaning'
    },
    {
      id: '7',
      date: '2025-08-16',
      time: '1:00 PM',
      location: 'AUT Dentist',
      dentist: 'Dr. Toothmate',
      type: 'Root Canal'
    }
  ]);

  // Filter appointments based on selected date
  const filteredAppointments = selectedDate 
    ? appointmentData.filter(appointment => appointment.date === selectedDate)
    : [];

  // Create marked dates object for calendar with appointment indicators
  const markedDates = {
    ...appointmentData.reduce((acc, appointment) => {
      acc[appointment.date] = {
        marked: true,
        dotColor: '#00adf5'
      };
      return acc;
    }, {}),
    [selectedDate]: {
      selected: true,
      marked: appointmentData.some(apt => apt.date === selectedDate),
      selectedColor: '#00adf5',
      selectedTextColor: '#ffffff'
    }
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

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
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <TouchableOpacity 
                    key={appointment.id} 
                    style={styles.appointmentCard}
                    onPress={() => setSelectedAppointment(appointment)}
                  >
                    <View style={styles.cardContent}>
                      <View style={styles.appointmentInfo}>
                        <Text style={styles.timeText}>{appointment.time}</Text>
                        <Text style={styles.locationText}>{appointment.location}</Text>
                        <Text style={styles.dentistText}>{appointment.dentist}</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={30} color="#875B51"/>
                    </View>
                    <View style={styles.typeTag}>
                      <Text style={styles.typeText}>{appointment.type}</Text>
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
                style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.35)' }}
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
                         <Text style={styles.modalDetailValue}>{selectedAppointment.date}</Text>
                       </View>
                       <View style={styles.modalDetailRow}>
                         <Text style={styles.modalDetailLabel}>Time:</Text>
                         <Text style={styles.modalDetailValue}>{selectedAppointment.time}</Text>
                       </View>
                       <View style={styles.modalDetailRow}>
                         <Text style={styles.modalDetailLabel}>Dentist:</Text>
                         <Text style={styles.modalDetailValue}>{selectedAppointment.dentist}</Text>
                       </View>
                       <View style={styles.modalDetailRow}>
                         <Text style={styles.modalDetailLabel}>Clinic:</Text>
                         <Text style={styles.modalDetailValue}>{selectedAppointment.location}</Text>
                       </View>
                       <View style={styles.modalDetailRow}>
                         <Text style={styles.modalDetailLabel}>Type:</Text>
                         <Text style={styles.modalDetailValue}>{selectedAppointment.type}</Text>
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
        <MaterialIcons name="add" size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ClinicScreen;
