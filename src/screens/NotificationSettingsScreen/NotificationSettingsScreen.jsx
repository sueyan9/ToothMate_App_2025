import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Context as NotificationContext } from '../../context/NotificationContext/NotificationContext';
import { useTranslation } from '../../context/TranslationContext/useTranslation';
import styles from './styles';

const NotificationSettingsScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  const {
    state: { settings, permissions, loading, error },
    updateNotificationSettings,
    requestNotificationPermissions,
    getScheduledNotifications,
    cancelAllNotifications,
    sendImmediateNotification,
    clearError,
  } = useContext(NotificationContext);

  const [localSettings, setLocalSettings] = useState(settings);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error]);

  const handleSettingChange = async (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    
    setIsUpdating(true);
    try {
      await updateNotificationSettings(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRequestPermissions = async () => {
    const result = await requestNotificationPermissions();
    if (result.success) {
      Alert.alert(
        'Permissions Updated',
        'Notification permissions have been updated successfully!',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Permission Error',
        'Failed to update notification permissions. Please check your device settings.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleClearAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to cancel all scheduled notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const result = await cancelAllNotifications();
            if (result.success) {
              Alert.alert('Success', 'All notifications have been cleared!');
            }
          },
        },
      ]
    );
  };

  const getPermissionStatusText = () => {
    if (!permissions) return 'Unknown';
    switch (permissions.status) {
      case 'granted':
        return 'Allowed';
      case 'denied':
        return 'Denied';
      case 'undetermined':
        return 'Not Set';
      default:
        return permissions.status;
    }
  };

  const getPermissionStatusColor = () => {
    if (!permissions) return '#666';
    switch (permissions.status) {
      case 'granted':
        return '#4CAF50';
      case 'denied':
        return '#F44336';
      case 'undetermined':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>Loading notification settings...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#875B51" />
          </TouchableOpacity>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Permission Status */}
          <View style={styles.section}>
            <View style={styles.titleRow}>
              <MaterialIcons name="lock-open" size={24} color="#516287"/>
            <Text style={styles.sectionTitle}>Permission Status</Text>
            </View>
            <View style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionLabel}>Notifications</Text>
                <Text style={[styles.permissionStatus, { color: getPermissionStatusColor() }]}>
                  {getPermissionStatusText()}
                </Text>
              </View>
              {permissions?.status !== 'granted' && (
                <TouchableOpacity style={styles.button} onPress={handleRequestPermissions}>
                  <Text style={styles.buttonText}>Enable</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Notification Settings */}
          <View style={styles.section}>
            <View style={styles.titleRow}>
              <MaterialIcons name="alarm" size={24} color="#516287"/>
            <Text style={styles.sectionTitle}>Notification Preferences</Text>
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Appointment Reminders</Text>
                <Text style={styles.settingDescription}>
                  Get notified about upcoming dental appointments
                </Text>
              </View>
              <Switch
                value={localSettings.appointmentReminders}
                onValueChange={(value) => handleSettingChange('appointmentReminders', value)}
                trackColor={{ false: '#ddd', true: '#EDDFD3' }}
                thumbColor={localSettings.appointmentReminders ? '#875B51' : '#f4f3f4'}
                disabled={isUpdating}
              />
            </View>

            {localSettings.appointmentReminders && (
              <View style={styles.subSettings}>
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>24 Hours Before</Text>
                  <Switch
                    value={localSettings.reminderTime24h}
                    onValueChange={(value) => handleSettingChange('reminderTime24h', value)}
                    trackColor={{ false: '#ddd', true: '#EDDFD3' }}
                    thumbColor={localSettings.reminderTime24h ? '#875B51' : '#f4f3f4'}
                    disabled={isUpdating}
                  />
                </View>
                
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>1 Hour Before</Text>
                  <Switch
                    value={localSettings.reminderTime1h}
                    onValueChange={(value) => handleSettingChange('reminderTime1h', value)}
                    trackColor={{ false: '#ddd', true: '#EDDFD3' }}
                    thumbColor={localSettings.reminderTime1h ? '#875B51' : '#f4f3f4'}
                    disabled={isUpdating}
                  />
                </View>
                
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>15 Minutes Before</Text>
                  <Switch
                    value={localSettings.reminderTime15m}
                    onValueChange={(value) => handleSettingChange('reminderTime15m', value)}
                    trackColor={{ false: '#ddd', true: '#EDDFD3' }}
                    thumbColor={localSettings.reminderTime15m ? '#875B51' : '#f4f3f4'}
                    disabled={isUpdating}
                  />
                </View>
              </View>
            )}

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Daily Dental Tips</Text>
                <Text style={styles.settingDescription}>
                  Receive helpful daily tips for oral health
                </Text>
              </View>
              <Switch
                value={localSettings.dailyTips}
                onValueChange={(value) => handleSettingChange('dailyTips', value)}
                trackColor={{ false: '#ddd', true: '#EDDFD3' }}
                thumbColor={localSettings.dailyTips ? '#875B51' : '#f4f3f4'}
                disabled={isUpdating}
              />
            </View>
          </View>

          {/* Management Section */}
          <View style={styles.section}>
            <View style={styles.titleRow}>
              <MaterialIcons name="settings" size={24} color="#516287"/>
            <Text style={styles.sectionTitle}>Manage Notifications</Text>
            </View>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={async () => {
                const result = await sendImmediateNotification(
                  '🦷 Test Notification',
                  'This is a test notification from ToothMate!'
                );
                if (result.success) {
                  Alert.alert('Success', 'Test notification sent!');
                } else {
                  Alert.alert('Error', result.error || 'Failed to send notification');
                }
              }}
            >
              <MaterialIcons name="notification-add" size={24} color="#516287" />
              <Text style={styles.actionButtonText}>Send Test Notification</Text>
              <MaterialIcons name="chevron-right" size={24} color="#875B51" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('ViewScheduledNotifications')}
            >
              <MaterialIcons name="schedule" size={24} color="#516287" />
              <Text style={styles.actionButtonText}>View Scheduled Notifications</Text>
              <MaterialIcons name="chevron-right" size={24} color="#875B51" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.destructiveButton]}
              onPress={handleClearAllNotifications}
            >
              <MaterialIcons name="clear-all" size={24} color="#F44336" />
              <Text style={[styles.actionButtonText, styles.destructiveText]}>
                Clear All Notifications
              </Text>
              <MaterialIcons name="chevron-right" size={24} color="#875B51" />
            </TouchableOpacity>
          </View>

          {/* Info Section */}
          <View style={styles.section}>
            <View style={styles.titleRow}>
              <MaterialIcons name="info" size={24} color="#516287"/>
            <Text style={styles.sectionTitle}>About Notifications</Text>
            </View>
            <Text style={styles.infoText}>
              ToothMate uses notifications to help you maintain good oral health by reminding you of appointments and providing helpful tips. 
              You can customize these settings at any time.
            </Text>
            <Text style={styles.infoText}>
              For notifications to work properly, please ensure that ToothMate has notification permissions enabled in your device settings.
            </Text>
            <Text style={styles.warningText}>
              ⚠️ Note: Expo Go limits notifications to local only. Use a development build of the app for full push notification functionality.
            </Text>
          </View>
        </ScrollView>

        {isUpdating && (
          <View style={styles.updatingOverlay}>
            <ActivityIndicator size="small" color="#0066cc" />
            <Text style={styles.updatingText}>Updating settings...</Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default NotificationSettingsScreen;