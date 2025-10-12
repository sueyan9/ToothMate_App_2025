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

  // Helper method to detect if we're running in Expo Go
  isExpoGo() {
    try {
      // Multiple ways to detect Expo Go environment
      // Check for Expo Go specific environment variables and properties
      return (
        // Check if we're in development mode and not a standalone app
        global.__DEV__ && (
          // Check Expo Constants for app ownership
          global.expo?.modules?.ExpoConstants?.appOwnership === 'expo' ||
          global.expo?.modules?.ExpoConstants?.executionEnvironment === 'storeClient' ||
          // Check for Expo Go specific user agent
          global.navigator?.userAgent?.includes('Expo') ||
          // Check if we're not on a device (simulator in Expo Go)
          !Device.isDevice ||
          // Check for Expo Go specific global variables
          global.__expo ||
          // Additional check for Expo Go environment
          (typeof global.expo !== 'undefined' && !global.expo.modules?.ExpoConstants?.appOwnership)
        )
      );
    } catch (error) {
      console.log('Error detecting Expo Go environment:', error.message);
      // If we can't determine, assume we're in Expo Go to be safe
      return global.__DEV__ || false;
    }
  }

  // Check if push notifications are supported in current environment
  isPushNotificationSupported() {
    return Device.isDevice && !this.isExpoGo();
  }

  // Debug method to check environment details
  getEnvironmentInfo() {
    return {
      isExpoGo: this.isExpoGo(),
      isPushSupported: this.isPushNotificationSupported(),
      isDevice: Device.isDevice,
      isDev: global.__DEV__,
      appOwnership: global.expo?.modules?.ExpoConstants?.appOwnership,
      executionEnvironment: global.expo?.modules?.ExpoConstants?.executionEnvironment,
      userAgent: global.navigator?.userAgent,
      hasExpoGlobal: typeof global.__expo !== 'undefined',
      platform: Platform.OS
    };
  }

  // Register for push notifications and get token
  async registerForPushNotifications() {
    // First, check if we're in Expo Go and skip push notification registration entirely
    if (this.isExpoGo()) {
      console.log('🚨 Running in Expo Go - Using local notifications only');
      console.log('ℹ️  Local notifications will work perfectly for appointment reminders');
      console.log('ℹ️  For push notifications, use a development build');
      console.log('ℹ️  Read more: https://docs.expo.dev/develop/development-builds/introduction/');
      
      // Set up Android notification channel for local notifications
      if (Platform.OS === 'android') {
        try {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#78d0f5',
          });
        } catch (error) {
          console.log('Error setting up Android notification channel:', error.message);
        }
      }
      
      // Still request local notification permissions
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          console.log('⚠️  Local notification permissions not granted');
          return 'expo-go-no-permissions';
        }
      } catch (error) {
        console.log('Error requesting notification permissions:', error.message);
        return 'expo-go-permission-error';
      }
      
      const fallbackToken = 'expo-go-local-only';
      this.expoPushToken = fallbackToken;
      
      try {
        await AsyncStorage.setItem('expoPushToken', fallbackToken);
      } catch (error) {
        console.log('Error storing token:', error.message);
      }
      
      console.log('📱 Local notifications configured successfully in Expo Go');
      return fallbackToken;
    }

    // Regular push notification registration for development builds and production
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
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
        console.log('❌ Failed to get push token - permissions not granted');
        return 'no-permissions';
      }
      
      try {
        // Only try to get real push token in development builds or production
        token = await Notifications.getExpoPushTokenAsync({
          projectId: 'your-project-id', // Replace with your actual Expo project ID when deploying
        });
        console.log('✅ Push notification token obtained successfully');
        
        this.expoPushToken = token.data;
        
        // Store token locally
        await AsyncStorage.setItem('expoPushToken', token.data);
        
        console.log('📱 Push notification token:', token.data);
        return token.data;
      } catch (error) {
        console.log('❌ Error getting push token:', error.message);
        console.log('ℹ️  Falling back to local notifications only');
        
        // Fallback for other limitations
        const fallbackToken = 'local-notifications-only';
        this.expoPushToken = fallbackToken;
        await AsyncStorage.setItem('expoPushToken', fallbackToken);
        return fallbackToken;
      }
    } else {
      console.log('ℹ️  Must use physical device for Push Notifications');
      console.log('ℹ️  Using simulator - local notifications only');
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
  async scheduleAppointmentReminder(appointmentDate, appointmentTime, clinicName, appointmentId = null, patientInfo, userSettings = null) {
    try {
      console.log('🔔 Starting appointment reminder scheduling...');
      console.log('📅 Appointment details:', { appointmentDate, appointmentTime, clinicName, appointmentId, patientInfo });
      console.log('⚙️  User settings:', userSettings);
      
      const appointmentDateTime = new Date(appointmentDate + ' ' + appointmentTime);
      const now = new Date();
      
      console.log('⏰ Appointment datetime:', appointmentDateTime);
      console.log('⏰ Current time:', now);
      
      // Don't schedule notifications for past appointments
      if (appointmentDateTime <= now) {
        console.log('⚠️  Appointment is in the past, skipping reminder scheduling');
        return { success: false, message: 'Cannot schedule reminders for past appointments' };
      }
      
      const notifications = [];
      
      // Schedule 24 hours before (only if enabled in settings and appointment is more than 24 hours away)
      const reminderDate24h = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000);
      console.log('📋 24h reminder would be at:', reminderDate24h);
      if (reminderDate24h > now && (!userSettings || userSettings.reminderTime24h)) {
        console.log('✅ Scheduling 24h reminder...');
        const notification24h = await this.scheduleNotification(
          '🦷 Appointment Reminder',
          `You have a dental appointment tomorrow at ${appointmentTime} at ${clinicName}`,
          { 
            type: 'appointment_reminder', 
            appointmentDate, 
            appointmentTime, 
            clinicName, 
            appointmentId,
            patientInfo,
            reminderType: '24h'
          },
          { trigger: reminderDate24h }
        );
        if (notification24h) {
          notifications.push({ type: '24h', id: notification24h, scheduledFor: reminderDate24h });
          console.log('✅ 24h reminder scheduled with ID:', notification24h);
        }
      } else {
        console.log('❌ Skipping 24h reminder:', reminderDate24h <= now ? 'too late' : 'disabled in settings');
      }

      // Schedule 1 hour before (only if enabled in settings and appointment is more than 1 hour away)
      const reminderDate1h = new Date(appointmentDateTime.getTime() - 60 * 60 * 1000);
      console.log('📋 1h reminder would be at:', reminderDate1h);
      if (reminderDate1h > now && (!userSettings || userSettings.reminderTime1h)) {
        console.log('✅ Scheduling 1h reminder...');
        const notification1h = await this.scheduleNotification(
          '🦷 Appointment Soon',
          `Your dental appointment is in 1 hour at ${clinicName}`,
          { 
            type: 'appointment_reminder', 
            appointmentDate, 
            appointmentTime, 
            clinicName, 
            appointmentId,
            patientInfo,
            reminderType: '1h'
          },
          { trigger: reminderDate1h }
        );
        if (notification1h) {
          notifications.push({ type: '1h', id: notification1h, scheduledFor: reminderDate1h });
          console.log('✅ 1h reminder scheduled with ID:', notification1h);
        }
      } else {
        console.log('❌ Skipping 1h reminder:', reminderDate1h <= now ? 'too late' : 'disabled in settings');
      }

      // Schedule 15 minutes before (only if enabled in settings and appointment is more than 15 minutes away)
      const reminderDate15m = new Date(appointmentDateTime.getTime() - 15 * 60 * 1000);
      console.log('📋 15m reminder would be at:', reminderDate15m);
      if (reminderDate15m > now && (!userSettings || userSettings.reminderTime15m)) {
        console.log('✅ Scheduling 15m reminder...');
        const notification15m = await this.scheduleNotification(
          '🦷 Appointment Starting Soon',
          `Your dental appointment starts in 15 minutes at ${clinicName}`,
          { 
            type: 'appointment_reminder', 
            appointmentDate, 
            appointmentTime, 
            clinicName, 
            appointmentId,
            patientInfo,
            reminderType: '15m'
          },
          { trigger: reminderDate15m }
        );
        if (notification15m) {
          notifications.push({ type: '15m', id: notification15m, scheduledFor: reminderDate15m });
          console.log('✅ 15m reminder scheduled with ID:', notification15m);
        }
      } else {
        console.log('❌ Skipping 15m reminder:', reminderDate15m <= now ? 'too late' : 'disabled in settings');
      }

      console.log(`✅ Final result: Scheduled ${notifications.length} appointment reminders for ${appointmentDate} ${appointmentTime}`);
      console.log('📋 Scheduled notification details:', notifications);
      return { success: true, notifications };
    } catch (error) {
      console.error('Error scheduling appointment reminder:', error);
      return { success: false, error: error.message };
    }
  }

  // Schedule a specific reminder type for an appointment
  async scheduleSpecificAppointmentReminder(appointmentDate, appointmentTime, clinicName, reminderType, appointmentId = null, patientInfo) {
    try {
      console.log(`🔔 Scheduling specific ${reminderType} reminder for appointment...`);
      console.log('📅 Appointment details:', { appointmentDate, appointmentTime, clinicName, appointmentId, patientInfo });
      
      const appointmentDateTime = new Date(appointmentDate + ' ' + appointmentTime);
      const now = new Date();
      
      // Don't schedule notifications for past appointments
      if (appointmentDateTime <= now) {
        console.log('⚠️  Appointment is in the past, skipping reminder scheduling');
        return { success: false, message: 'Cannot schedule reminders for past appointments' };
      }
      
      let reminderDate;
      let title;
      let body;
      
      // Calculate reminder time based on type
      switch (reminderType) {
        case '24h':
          reminderDate = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000);
          title = '🦷 Appointment Reminder';
          body = `You have a dental appointment tomorrow at ${appointmentTime} at ${clinicName}`;
          break;
        case '1h':
          reminderDate = new Date(appointmentDateTime.getTime() - 60 * 60 * 1000);
          title = '🦷 Appointment Soon';
          body = `Your dental appointment is in 1 hour at ${clinicName}`;
          break;
        case '15m':
          reminderDate = new Date(appointmentDateTime.getTime() - 15 * 60 * 1000);
          title = '🦷 Appointment Starting Soon';
          body = `Your dental appointment starts in 15 minutes at ${clinicName}`;
          break;
        default:
          return { success: false, message: 'Invalid reminder type' };
      }
      
      // Check if reminder time is in the future
      if (reminderDate <= now) {
        console.log(`⚠️  ${reminderType} reminder time is in the past, skipping`);
        return { success: false, message: `${reminderType} reminder time has already passed` };
      }
      
      console.log(`✅ Scheduling ${reminderType} reminder for:`, reminderDate);
      const notificationId = await this.scheduleNotification(
        title,
        body,
        { 
          type: 'appointment_reminder', 
          appointmentDate, 
          appointmentTime, 
          clinicName, 
          appointmentId,
          patientInfo,
          reminderType
        },
        { trigger: reminderDate }
      );
      
      if (notificationId) {
        console.log(`✅ ${reminderType} reminder scheduled with ID:`, notificationId);
        return { success: true, notificationId, scheduledFor: reminderDate };
      } else {
        return { success: false, message: 'Failed to schedule notification' };
      }
    } catch (error) {
      console.error(`Error scheduling ${reminderType} reminder:`, error);
      return { success: false, error: error.message };
    }
  }

  // Cancel appointment reminders for a specific appointment
  async cancelAppointmentReminders(appointmentId = null, appointmentDate = null, appointmentTime = null) {
    try {
      const scheduledNotifications = await this.getAllScheduledNotifications();
      let cancelledCount = 0;
      
      for (const notification of scheduledNotifications) {
        const notificationData = notification.content?.data;
        
        // Check if this is an appointment reminder notification
        if (notificationData?.type === 'appointment_reminder') {
          let shouldCancel = false;
          
          // Cancel by appointment ID if provided
          if (appointmentId && notificationData.appointmentId === appointmentId) {
            shouldCancel = true;
          }
          // Cancel by date/time if appointment ID not available
          else if (!appointmentId && appointmentDate && appointmentTime) {
            if (notificationData.appointmentDate === appointmentDate && 
                notificationData.appointmentTime === appointmentTime) {
              shouldCancel = true;
            }
          }
          
          if (shouldCancel) {
            await this.cancelNotification(notification.identifier);
            cancelledCount++;
            console.log(`Cancelled appointment reminder: ${notification.identifier}`);
          }
        }
      }
      
      console.log(`Cancelled ${cancelledCount} appointment reminder(s)`);
      return { success: true, cancelledCount };
    } catch (error) {
      console.error('Error cancelling appointment reminders:', error);
      return { success: false, error: error.message };
    }
  }

  // Get scheduled appointment reminders
  async getAppointmentReminders(appointmentId = null) {
    try {
      const scheduledNotifications = await this.getAllScheduledNotifications();
      const appointmentReminders = [];
      
      for (const notification of scheduledNotifications) {
        const notificationData = notification.content?.data;
        
        if (notificationData?.type === 'appointment_reminder') {
          // Filter by appointment ID if provided
          if (!appointmentId || notificationData.appointmentId === appointmentId) {
            appointmentReminders.push({
              id: notification.identifier,
              title: notification.content.title,
              body: notification.content.body,
              appointmentDate: notificationData.appointmentDate,
              appointmentTime: notificationData.appointmentTime,
              clinicName: notificationData.clinicName,
              patientInfo: notificationData.patientInfo,
              reminderType: notificationData.reminderType,
              scheduledFor: notification.trigger?.date || notification.trigger
            });
          }
        }
      }
      
      return { success: true, reminders: appointmentReminders };
    } catch (error) {
      console.error('Error getting appointment reminders:', error);
      return { success: false, error: error.message };
    }
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