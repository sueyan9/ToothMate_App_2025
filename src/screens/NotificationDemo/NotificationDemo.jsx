import { useContext } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Context as NotificationContext } from '../../context/NotificationContext/NotificationContext';

const NotificationDemo = () => {
  const {
    state: { pushToken, permissions, scheduledNotifications },
    scheduleAppointmentReminder,
    sendImmediateNotification,
    getScheduledNotifications,
    requestNotificationPermissions,
  } = useContext(NotificationContext);

  const handleTestImmediateNotification = async () => {
    const result = await sendImmediateNotification(
      '🦷 Test Notification',
      'This is a test notification from ToothMate!'
    );
    
    if (result.success) {
      Alert.alert('Success', 'Test notification sent!');
    } else {
      Alert.alert('Error', result.error || 'Failed to send notification');
    }
  };

  const handleTestAppointmentReminder = async () => {
    // Schedule a test appointment for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const appointmentDate = tomorrow.toISOString().split('T')[0];
    const appointmentTime = '14:30';
    
    const result = await scheduleAppointmentReminder(
      appointmentDate,
      appointmentTime,
      'Test Dental Clinic'
    );
    
    if (result.success) {
      Alert.alert('Success', 'Appointment reminder scheduled!');
    } else {
      Alert.alert('Error', result.error || 'Failed to schedule reminder');
    }
  };

  const handleViewScheduled = async () => {
    const result = await getScheduledNotifications();
    if (result.success) {
      Alert.alert(
        'Scheduled Notifications',
        `You have ${result.notifications.length} scheduled notifications`
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Demo</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Permission Status: {permissions?.status || 'Unknown'}
        </Text>
        <Text style={styles.statusText}>
          Push Token: {pushToken ? 'Available' : 'Not Available'}
        </Text>
        <Text style={styles.statusText}>
          Scheduled: {scheduledNotifications.length} notifications
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={requestNotificationPermissions}>
        <Text style={styles.buttonText}>Request Permissions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleTestImmediateNotification}>
        <Text style={styles.buttonText}>Send Test Notification</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleTestAppointmentReminder}>
        <Text style={styles.buttonText}>Schedule Test Appointment Reminder</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleViewScheduled}>
        <Text style={styles.buttonText}>View Scheduled Notifications</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NotificationDemo;