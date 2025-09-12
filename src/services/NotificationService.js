import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications should be handled when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Register for push notifications and get token
  async registerForPushNotifications() {
    let token;

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#78d0f5',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }
      
      try {
        // Check if we're in Expo Go - push notifications don't work there in SDK 53+
        // Use a more reliable check for Expo Go
        const isExpoGo = global.__DEV__ && !Device.isDevice;
        
        if (isExpoGo) {
          console.log('Running in Expo Go - Push notifications limited to local notifications only');
          console.log('For full push notification functionality, use a development build');
          // Return a mock token for development
          token = { data: 'expo-go-mock-token' };
        } else {
          // Only try to get real push token in development builds or production
          try {
            token = await Notifications.getExpoPushTokenAsync({
              projectId: 'your-project-id', // Replace with your actual Expo project ID
            });
          } catch (pushTokenError) {
            console.log('Could not get push token (this is normal in Expo Go):', pushTokenError.message);
            token = { data: 'local-notifications-only' };
          }
        }
        
        this.expoPushToken = token.data;
        
        // Store token locally
        await AsyncStorage.setItem('expoPushToken', token.data);
        
        console.log('Push token:', token.data);
        return token.data;
      } catch (error) {
        console.log('Error getting push token:', error);
        console.log('Falling back to local notifications only');
        // Fallback for Expo Go or other limitations
        const fallbackToken = 'local-notifications-only';
        this.expoPushToken = fallbackToken;
        await AsyncStorage.setItem('expoPushToken', fallbackToken);
        return fallbackToken;
      }
    } else {
      console.log('Must use physical device for Push Notifications');
      console.log('Using simulator - local notifications only');
      return 'simulator-local-only';
    }
  }

  // Get stored push token
  async getStoredPushToken() {
    try {
      const token = await AsyncStorage.getItem('expoPushToken');
      this.expoPushToken = token;
      return token;
    } catch (error) {
      console.log('Error getting stored push token:', error);
      return null;
    }
  }

  // Schedule local notification
  async scheduleNotification(title, body, data = {}, schedulingOptions = {}) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: schedulingOptions.trigger || null,
      });
      
      console.log('Notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.log('Error scheduling notification:', error);
      return null;
    }
  }

  // Schedule appointment reminder
  async scheduleAppointmentReminder(appointmentDate, appointmentTime, clinicName) {
    const appointmentDateTime = new Date(appointmentDate + ' ' + appointmentTime);
    
    // Schedule 24 hours before
    const reminderDate24h = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000);
    const notification24h = await this.scheduleNotification(
      '🦷 Appointment Reminder',
      `You have a dental appointment tomorrow at ${appointmentTime} at ${clinicName}`,
      { type: 'appointment', appointmentDate, appointmentTime, clinicName },
      { trigger: reminderDate24h }
    );

    // Schedule 1 hour before
    const reminderDate1h = new Date(appointmentDateTime.getTime() - 60 * 60 * 1000);
    const notification1h = await this.scheduleNotification(
      '🦷 Appointment Soon',
      `Your dental appointment is in 1 hour at ${clinicName}`,
      { type: 'appointment', appointmentDate, appointmentTime, clinicName },
      { trigger: reminderDate1h }
    );

    return { notification24h, notification1h };
  }

  // Schedule daily dental tip
  async scheduleDailyDentalTip() {
    const dentalTips = [
      'Remember to brush your teeth twice a day! 🦷',
      'Don\'t forget to floss daily for healthy gums! 🧵',
      'Rinse with mouthwash for extra protection! 💧',
      'Replace your toothbrush every 3-4 months! 🪥',
      'Limit sugary snacks to protect your teeth! 🍬',
      'Drink plenty of water for good oral health! 💧',
      'Visit your dentist regularly for checkups! 👨‍⚕️',
    ];

    const randomTip = dentalTips[Math.floor(Math.random() * dentalTips.length)];
    
    return await this.scheduleNotification(
      '🦷 Daily Dental Tip',
      randomTip,
      { type: 'dental_tip' },
      {
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true,
        },
      }
    );
  }

  // Cancel notification
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Notification cancelled:', notificationId);
    } catch (error) {
      console.log('Error cancelling notification:', error);
    }
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.log('Error cancelling all notifications:', error);
    }
  }

  // Get all scheduled notifications
  async getAllScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.log('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Setup notification listeners
  setupNotificationListeners(onNotificationReceived, onNotificationResponse) {
    this.notificationListener = Notifications.addNotificationReceivedListener(
      onNotificationReceived || ((notification) => {
        console.log('Notification received:', notification);
      })
    );

    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      onNotificationResponse || ((response) => {
        console.log('Notification response:', response);
      })
    );
  }

  // Clean up listeners
  removeNotificationListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
      this.notificationListener = null;
    }
    
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
      this.responseListener = null;
    }
  }

  // Send push notification (for backend integration)
  async sendPushNotification(expoPushToken, title, body, data = {}) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
    };

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      
      const result = await response.json();
      console.log('Push notification sent:', result);
      return result;
    } catch (error) {
      console.log('Error sending push notification:', error);
      return null;
    }
  }

  // Get notification permissions status
  async getPermissionsStatus() {
    try {
      const permissions = await Notifications.getPermissionsAsync();
      return permissions;
    } catch (error) {
      console.log('Error getting permissions:', error);
      return null;
    }
  }

  // Request notification permissions
  async requestPermissions() {
    try {
      const permissions = await Notifications.requestPermissionsAsync();
      return permissions;
    } catch (error) {
      console.log('Error requesting permissions:', error);
      return null;
    }
  }
}

export default new NotificationService();