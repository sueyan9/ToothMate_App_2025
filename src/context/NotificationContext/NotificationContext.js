import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from '../../services/NotificationService';
import createDataContext from '../createDataContext';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PUSH_TOKEN':
      return { ...state, pushToken: action.payload };
    case 'SET_PERMISSIONS':
      return { ...state, permissions: action.payload };
    case 'SET_NOTIFICATION_SETTINGS':
      return { ...state, settings: action.payload };
    case 'SET_SCHEDULED_NOTIFICATIONS':
      return { ...state, scheduledNotifications: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Initialize notification service
const initializeNotifications = (dispatch) => {
  return async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Try to register for push notifications with error handling
      try {
        const token = await notificationService.registerForPushNotifications();
        const expoGoTokens = [
          'local-notifications-only', 
          'expo-go-mock-token', 
          'expo-go-local-only', 
          'simulator-local-only',
          'expo-go-no-permissions',
          'expo-go-permission-error',
          'no-permissions'
        ];
        
        if (token && !expoGoTokens.includes(token)) {
          dispatch({ type: 'SET_PUSH_TOKEN', payload: token });
          console.log('✅ Push notification token registered successfully');
        } else {
          console.log('ℹ️  Using local notifications only - push notifications not available');
          dispatch({ type: 'SET_PUSH_TOKEN', payload: null });
        }
      } catch (tokenError) {
        console.log('⚠️  Push notification registration failed (this is normal in Expo Go):', tokenError.message);
        dispatch({ type: 'SET_PUSH_TOKEN', payload: null });
        // Continue without push token - local notifications will still work
      }
      
      // Get current permissions
      try {
        const permissions = await notificationService.getPermissionsStatus();
        dispatch({ type: 'SET_PERMISSIONS', payload: permissions });
      } catch (permError) {
        console.log('Error getting permissions status:', permError.message);
        // Set default permissions state
        dispatch({ type: 'SET_PERMISSIONS', payload: { status: 'undetermined' } });
      }
      
      // Load saved notification settings
      const savedSettings = await AsyncStorage.getItem('notificationSettings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {
        appointmentReminders: true,
        dailyTips: true,
        reminderTime24h: true,
        reminderTime1h: true,
        reminderTime15m: true,
        dailyTipTime: '09:00',
      };
      dispatch({ type: 'SET_NOTIFICATION_SETTINGS', payload: settings });
      
      // Setup notification listeners with error handling
      try {
        notificationService.setupNotificationListeners(
          (notification) => {
            console.log('Notification received in context:', notification);
          },
          (response) => {
            console.log('Notification response in context:', response);
            // Handle notification tap here
          }
        );
      } catch (listenerError) {
        console.log('Error setting up notification listeners:', listenerError.message);
        // Continue without listeners - basic functionality will still work
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error initializing notifications:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
};

// Update notification settings
const updateNotificationSettings = (dispatch) => {
  return async (newSettings) => {
    try {
      // Save settings to AsyncStorage
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
      dispatch({ type: 'SET_NOTIFICATION_SETTINGS', payload: newSettings });
      
      // Update scheduled notifications based on new settings
      if (newSettings.dailyTips) {
        await notificationService.scheduleDailyDentalTip();
      } else {
        // Cancel daily tips if disabled
        const scheduled = await notificationService.getAllScheduledNotifications();
        const dailyTipNotifications = scheduled.filter(n => n.content.data.type === 'dental_tip');
        for (const notification of dailyTipNotifications) {
          await notificationService.cancelNotification(notification.identifier);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating notification settings:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

// Schedule appointment reminder
const scheduleAppointmentReminder = (dispatch) => {
  return async (appointmentDate, appointmentTime, clinicName, appointmentId = null) => {
    try {
      // Get settings from AsyncStorage with proper defaults
      const state = await AsyncStorage.getItem('notificationSettings');
      const defaultSettings = {
        appointmentReminders: true,
        dailyTips: true,
        reminderTime24h: true,
        reminderTime1h: true,
        reminderTime15m: true,
        dailyTipTime: '09:00',
      };
      const settings = state ? { ...defaultSettings, ...JSON.parse(state) } : defaultSettings;
      
      console.log('📋 Scheduling appointment reminder with settings:', settings);
      
      if (!settings.appointmentReminders) {
        console.log('⚠️  Appointment reminders are disabled in settings');
        return { success: false, message: 'Appointment reminders are disabled' };
      }
      
      const result = await notificationService.scheduleAppointmentReminder(
        appointmentDate,
        appointmentTime,
        clinicName,
        appointmentId,
        settings // Pass user settings to the service
      );
      
      console.log('📋 Appointment reminder result:', result);
      
      // Update scheduled notifications list
      const scheduled = await notificationService.getAllScheduledNotifications();
      console.log('📋 Updated scheduled notifications count:', scheduled.length);
      dispatch({ type: 'SET_SCHEDULED_NOTIFICATIONS', payload: scheduled });
      
      return result;
    } catch (error) {
      console.error('Error scheduling appointment reminder:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

// Cancel appointment reminders
const cancelAppointmentReminders = (dispatch) => {
  return async (appointmentId = null, appointmentDate = null, appointmentTime = null) => {
    try {
      const result = await notificationService.cancelAppointmentReminders(
        appointmentId,
        appointmentDate,
        appointmentTime
      );
      
      // Update scheduled notifications list
      const scheduled = await notificationService.getAllScheduledNotifications();
      dispatch({ type: 'SET_SCHEDULED_NOTIFICATIONS', payload: scheduled });
      
      return result;
    } catch (error) {
      console.error('Error cancelling appointment reminders:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

// Get appointment reminders
const getAppointmentReminders = (dispatch) => {
  return async (appointmentId = null) => {
    try {
      const result = await notificationService.getAppointmentReminders(appointmentId);
      return result;
    } catch (error) {
      console.error('Error getting appointment reminders:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

// Send immediate notification
const sendImmediateNotification = (dispatch) => {
  return async (title, body, data = {}) => {
    try {
      const notificationId = await notificationService.scheduleNotification(
        title,
        body,
        data,
        { trigger: null } // Send immediately
      );
      
      return { success: true, notificationId };
    } catch (error) {
      console.error('Error sending immediate notification:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

// Get scheduled notifications
const getScheduledNotifications = (dispatch) => {
  return async () => {
    try {
      const scheduled = await notificationService.getAllScheduledNotifications();
      dispatch({ type: 'SET_SCHEDULED_NOTIFICATIONS', payload: scheduled });
      return { success: true, notifications: scheduled };
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

// Cancel notification
const cancelNotification = (dispatch) => {
  return async (notificationId) => {
    try {
      await notificationService.cancelNotification(notificationId);
      
      // Update scheduled notifications list
      const scheduled = await notificationService.getAllScheduledNotifications();
      dispatch({ type: 'SET_SCHEDULED_NOTIFICATIONS', payload: scheduled });
      
      return { success: true };
    } catch (error) {
      console.error('Error cancelling notification:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

// Cancel all notifications
const cancelAllNotifications = (dispatch) => {
  return async () => {
    try {
      await notificationService.cancelAllNotifications();
      dispatch({ type: 'SET_SCHEDULED_NOTIFICATIONS', payload: [] });
      return { success: true };
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

// Request notification permissions
const requestNotificationPermissions = (dispatch) => {
  return async () => {
    try {
      const permissions = await notificationService.requestPermissions();
      dispatch({ type: 'SET_PERMISSIONS', payload: permissions });
      
      // If permissions granted, register for push notifications
      if (permissions.status === 'granted') {
        const token = await notificationService.registerForPushNotifications();
        if (token) {
          dispatch({ type: 'SET_PUSH_TOKEN', payload: token });
        }
      }
      
      return { success: true, permissions };
    } catch (error) {
      console.error('Error requesting permissions:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };
};

// Clear error
const clearError = (dispatch) => {
  return () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };
};

export const { Provider, Context } = createDataContext(
  notificationReducer,
  {
    initializeNotifications,
    updateNotificationSettings,
    scheduleAppointmentReminder,
    cancelAppointmentReminders,
    getAppointmentReminders,
    sendImmediateNotification,
    getScheduledNotifications,
    cancelNotification,
    cancelAllNotifications,
    requestNotificationPermissions,
    clearError,
  },
  {
    pushToken: null,
    permissions: null,
    settings: {
      appointmentReminders: true,
      dailyTips: true,
      reminderTime24h: true,
      reminderTime1h: true,
      reminderTime15m: true,
      dailyTipTime: '09:00',
    },
    scheduledNotifications: [],
    loading: false,
    error: null,
  }
);