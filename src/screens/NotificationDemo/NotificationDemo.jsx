import { useContext } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Context as NotificationContext } from '../../context/NotificationContext/NotificationContext';

const NotificationDemo = () => {
  const {
    state: { pushToken, permissions, scheduledNotifications },
    scheduleAppointmentReminder,
    cancelAppointmentReminders,
    getAppointmentReminders,
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
      'Test Dental Clinic',
      'test-appointment-123'
    );
    
    if (result.success) {
      const reminderDetails = result.notifications?.map(n => {
        const scheduledDate = new Date(n.scheduledFor);
        const timeUntil = Math.round((scheduledDate - new Date()) / (1000 * 60)); // minutes until
        return `• ${n.type} reminder: ${scheduledDate.toLocaleString()}\n  (in ${timeUntil} minutes)`;
      }).join('\n');
      
      Alert.alert(
        'Success! 🎉', 
        `Scheduled ${result.notifications?.length || 0} appointment reminders for tomorrow at ${appointmentTime}!\n\nYour reminders:\n${reminderDetails}\n\nThis is how appointment reminders work when you book real appointments through the clinic screen.`
      );
    } else {
      Alert.alert('Error', result.error || 'Failed to schedule reminder');
    }
  };

  const handleTestNearTermReminder = async () => {
    // Schedule a test appointment in 2 hours to test the 1h and 15m reminders
    const nearTerm = new Date();
    nearTerm.setHours(nearTerm.getHours() + 2);
    const appointmentDate = nearTerm.toISOString().split('T')[0];
    const appointmentTime = nearTerm.toTimeString().split(' ')[0].substring(0, 5);
    
    const result = await scheduleAppointmentReminder(
      appointmentDate,
      appointmentTime,
      'Test Dental Clinic - Near Term',
      'test-appointment-near-term'
    );
    
    if (result.success) {
      Alert.alert(
        'Success', 
        `Scheduled ${result.notifications?.length || 0} reminders for appointment in 2 hours!\n\nReminders will be sent at:\n` +
        result.notifications?.map(n => `• ${n.type}: ${new Date(n.scheduledFor).toLocaleString()}`).join('\n')
      );
    } else {
      Alert.alert('Error', result.error || 'Failed to schedule reminder');
    }
  };

  const handleViewScheduled = async () => {
    const result = await getScheduledNotifications();
    if (result.success) {
      if (result.notifications.length === 0) {
        Alert.alert(
          'Scheduled Notifications',
          'No notifications are currently scheduled.\n\nTo test:\n• Book an appointment to automatically schedule reminders\n• Use the test buttons above'
        );
        return;
      }

      // Group notifications by type for better display
      const appointmentReminders = result.notifications.filter(n => 
        n.content?.data?.type === 'appointment_reminder'
      );
      const dailyTips = result.notifications.filter(n => 
        n.content?.data?.type === 'dental_tip'
      );
      const other = result.notifications.filter(n => 
        n.content?.data?.type !== 'appointment_reminder' && 
        n.content?.data?.type !== 'dental_tip'
      );

      let message = `You have ${result.notifications.length} scheduled notifications:\n\n`;

      // Show appointment reminders
      if (appointmentReminders.length > 0) {
        message += `📅 APPOINTMENT REMINDERS (${appointmentReminders.length}):\n`;
        appointmentReminders.forEach(notification => {
          const data = notification.content.data;
          const scheduledDate = notification.trigger?.date ? 
            new Date(notification.trigger.date).toLocaleString() : 
            'Unknown time';
          message += `• ${data.reminderType} reminder for ${data.appointmentDate} ${data.appointmentTime}\n  at ${data.clinicName}\n  Scheduled: ${scheduledDate}\n\n`;
        });
      }

      // Show daily tips
      if (dailyTips.length > 0) {
        message += `💡 DAILY TIPS (${dailyTips.length}):\n`;
        dailyTips.forEach(notification => {
          message += `• "${notification.content.title}"\n`;
        });
        message += '\n';
      }

      // Show other notifications
      if (other.length > 0) {
        message += `📋 OTHER (${other.length}):\n`;
        other.forEach(notification => {
          const scheduledDate = notification.trigger?.date ? 
            new Date(notification.trigger.date).toLocaleString() : 
            'Recurring';
          message += `• ${notification.content.title}\n  Scheduled: ${scheduledDate}\n\n`;
        });
      }

      Alert.alert('Scheduled Notifications', message);
    } else {
      Alert.alert('Error', result.error || 'Failed to get scheduled notifications');
    }
  };

  const handleViewAppointmentReminders = async () => {
    const result = await getAppointmentReminders();
    if (result.success) {
      const reminderText = result.reminders.length > 0 
        ? result.reminders.map(r => 
            `• ${r.reminderType} reminder for ${r.appointmentDate} ${r.appointmentTime} at ${r.clinicName}`
          ).join('\n')
        : 'No appointment reminders scheduled';
      
      Alert.alert(
        'Appointment Reminders',
        `Found ${result.reminders.length} appointment reminders:\n\n${reminderText}`
      );
    } else {
      Alert.alert('Error', result.error || 'Failed to get appointment reminders');
    }
  };

  const handleCancelTestReminders = async () => {
    const result = await cancelAppointmentReminders('test-appointment-123');
    if (result.success) {
      Alert.alert('Success', `Cancelled ${result.cancelledCount} test appointment reminders`);
    } else {
      Alert.alert('Error', result.error || 'Failed to cancel reminders');
    }
  };

  const handleShowEnvironmentInfo = async () => {
    // Import the service directly to access debug method
    const notificationService = (await import('../../services/NotificationService')).default;
    const envInfo = notificationService.getEnvironmentInfo();
    
    // Also get current scheduled notifications for debugging
    const scheduledNotifications = await notificationService.getAllScheduledNotifications();
    
    const infoText = `Environment Information:
    
• Is Expo Go: ${envInfo.isExpoGo}
• Push Supported: ${envInfo.isPushSupported}
• Is Device: ${envInfo.isDevice}
• Is Development: ${envInfo.isDev}
• App Ownership: ${envInfo.appOwnership || 'undefined'}
• Execution Environment: ${envInfo.executionEnvironment || 'undefined'}
• Platform: ${envInfo.platform}
• Has Expo Global: ${envInfo.hasExpoGlobal}
• User Agent: ${envInfo.userAgent ? envInfo.userAgent.substring(0, 50) + '...' : 'undefined'}

Scheduled Notifications:
• Total count: ${scheduledNotifications.length}
• Appointment reminders: ${scheduledNotifications.filter(n => n.content?.data?.type === 'appointment_reminder').length}`;

    Alert.alert('Environment & Notifications Debug', infoText);
  };

  const getPushTokenStatus = () => {
    if (!pushToken) {
      return 'Local Only (Expo Go)';
    }
    if (pushToken.includes('expo-go')) {
      return 'Local Only (Expo Go)';
    }
    if (pushToken.includes('local-notifications-only')) {
      return 'Local Only';
    }
    return 'Available';
  };

  const isExpoGo = () => {
    return !pushToken || pushToken.includes('expo-go') || pushToken.includes('local-notifications-only');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Notification Demo</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Permission Status: {permissions?.status || 'Unknown'}
        </Text>
        <Text style={styles.statusText}>
          Push Token: {getPushTokenStatus()}
        </Text>
        <Text style={styles.statusText}>
          Scheduled: {scheduledNotifications.length} notifications
        </Text>
        {isExpoGo() && (
          <View style={styles.expoGoWarning}>
            <Text style={styles.warningText}>
              ⚠️ Running in Expo Go - Push notifications not supported
            </Text>
            <Text style={styles.warningSubtext}>
              Local notifications work perfectly for appointment reminders!
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Basic Tests</Text>
      
      <TouchableOpacity style={styles.button} onPress={requestNotificationPermissions}>
        <Text style={styles.buttonText}>Request Permissions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleTestImmediateNotification}>
        <Text style={styles.buttonText}>Send Test Notification</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Appointment Reminder Tests</Text>

      <TouchableOpacity style={styles.button} onPress={handleTestAppointmentReminder}>
        <Text style={styles.buttonText}>Schedule Test Appointment (Tomorrow)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleTestNearTermReminder}>
        <Text style={styles.buttonText}>Schedule Near-Term Appointment (2 hours)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleViewAppointmentReminders}>
        <Text style={styles.buttonText}>View Appointment Reminders</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.warningButton]} onPress={handleCancelTestReminders}>
        <Text style={styles.buttonText}>Cancel Test Reminders</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>General</Text>

      <TouchableOpacity style={styles.button} onPress={handleViewScheduled}>
        <Text style={styles.buttonText}>View All Scheduled Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.debugButton]} onPress={handleShowEnvironmentInfo}>
        <Text style={styles.buttonText}>Show Environment Info (Debug)</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How Appointment Reminders Work:</Text>
        <Text style={styles.infoText}>
          📋 When you book an appointment through the clinic screen, reminders are automatically scheduled:{'\n'}
          • 24 hours before: "You have a dental appointment tomorrow..."{'\n'}
          • 1 hour before: "Your dental appointment is in 1 hour..."{'\n'}
          • 15 minutes before: "Your appointment starts in 15 minutes..."{'\n'}{'\n'}
          🔧 Testing Options:{'\n'}
          • Use "Test Tomorrow Appointment" to see how it works{'\n'}
          • Use "View All Scheduled Notifications" to see your reminders{'\n'}
          • Use "View Appointment Reminders" for appointment-specific details{'\n'}
          • Use "Cancel Test Reminders" to clean up test notifications{'\n'}
          {isExpoGo() ? 
            '• Running in Expo Go: Local notifications work perfectly for testing!' :
            '• Full push notification support available in this build'
          }
        </Text>
        {isExpoGo() && (
          <View style={styles.expoGoInfo}>
            <Text style={styles.infoText}>
              {'\n'}ℹ️ Expo Go Limitations (SDK 53+):{'\n'}
              • Push notifications are not supported{'\n'}
              • Local notifications work perfectly{'\n'}
              • All appointment reminder features work normally{'\n'}
              • Use a development build for push notifications
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
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
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  expoGoWarning: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  warningText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 4,
  },
  warningSubtext: {
    fontSize: 12,
    color: '#856404',
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  warningButton: {
    backgroundColor: '#FF6B35',
  },
  debugButton: {
    backgroundColor: '#6C757D',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  expoGoInfo: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
});

export default NotificationDemo;