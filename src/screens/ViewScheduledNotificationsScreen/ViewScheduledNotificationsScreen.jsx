import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Context as NotificationContext } from '../../context/NotificationContext/NotificationContext';
import { useTranslation } from '../../context/TranslationContext/useTranslation';
import styles from './styles';

const ViewScheduledNotificationsScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  const {
    state: { scheduledNotifications, loading },
    getScheduledNotifications,
    cancelNotification,
    clearError,
  } = useContext(NotificationContext);

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      await getScheduledNotifications();
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleCancelNotification = (notificationId, notificationTitle) => {
    Alert.alert(
      'Cancel Notification',
      `Are you sure you want to cancel "${notificationTitle}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            const result = await cancelNotification(notificationId);
            if (result.success) {
              Alert.alert('Success', 'Notification cancelled successfully!');
            } else {
              Alert.alert('Error', 'Failed to cancel notification');
            }
          },
        },
      ]
    );
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown time';
    return new Date(date).toLocaleString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment_reminder':
        return 'event';
      case 'dental_tip':
        return 'lightbulb-outline';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'appointment_reminder':
        return '#0066cc';
      case 'dental_tip':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  const getReminderTypeLabel = (reminderType) => {
    switch (reminderType) {
      case '24h':
        return '24 hours before';
      case '1h':
        return '1 hour before';
      case '15m':
        return '15 minutes before';
      default:
        return reminderType;
    }
  };

  // Group notifications by type
  const appointmentReminders = scheduledNotifications?.filter(n => 
    n.content?.data?.type === 'appointment_reminder'
  ) || [];
  
  const dailyTips = scheduledNotifications?.filter(n => 
    n.content?.data?.type === 'dental_tip'
  ) || [];
  
  const otherNotifications = scheduledNotifications?.filter(n => 
    n.content?.data?.type !== 'appointment_reminder' && 
    n.content?.data?.type !== 'dental_tip'
  ) || [];

  if (isLoading) {
    return (
      <LinearGradient colors={['#78d0f5', 'white', '#78d0f5']} style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>Loading scheduled notifications...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#78d0f5', 'white', '#78d0f5']} style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scheduled Notifications</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <MaterialIcons name="refresh" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {scheduledNotifications?.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="notifications-off" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No Scheduled Notifications</Text>
              <Text style={styles.emptySubtitle}>
                Schedule appointment reminders or enable daily tips to see notifications here.
              </Text>
              <TouchableOpacity 
                style={styles.settingsButton}
                onPress={() => navigation.navigate('NotificationSettings')}
              >
                <Text style={styles.settingsButtonText}>Go to Notification Settings</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Summary */}
              <View style={styles.summarySection}>
                <Text style={styles.summaryText}>
                  You have {scheduledNotifications?.length || 0} scheduled notifications
                </Text>
              </View>

              {/* Appointment Reminders */}
              {appointmentReminders.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    📅 Appointment Reminders ({appointmentReminders.length})
                  </Text>
                  {appointmentReminders.map((notification, index) => {
                    const data = notification.content.data;
                    const scheduledDate = notification.trigger?.date || notification.trigger;
                    
                    return (
                      <View key={notification.identifier || index} style={styles.notificationCard}>
                        <View style={styles.notificationHeader}>
                          <View style={styles.notificationIconContainer}>
                            <MaterialIcons 
                              name={getNotificationIcon(data.type)} 
                              size={24} 
                              color={getNotificationColor(data.type)} 
                            />
                          </View>
                          <View style={styles.notificationContent}>
                            <Text style={styles.notificationTitle}>
                              {notification.content.title}
                            </Text>
                            <Text style={styles.notificationBody}>
                              {notification.content.body}
                            </Text>
                            <View style={styles.notificationDetails}>
                              <Text style={styles.detailText}>
                                Appointment: {data.appointmentDate} at {data.appointmentTime}
                              </Text>
                              <Text style={styles.detailText}>
                                Clinic: {data.clinicName}
                              </Text>
                              <Text style={styles.detailText}>
                                Reminder: {getReminderTypeLabel(data.reminderType)}
                              </Text>
                              <Text style={styles.scheduleText}>
                                Scheduled for: {formatDate(scheduledDate)}
                              </Text>
                            </View>
                          </View>
                          <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => handleCancelNotification(
                              notification.identifier, 
                              notification.content.title
                            )}
                          >
                            <MaterialIcons name="close" size={20} color="#F44336" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Daily Tips */}
              {dailyTips.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    💡 Daily Tips ({dailyTips.length})
                  </Text>
                  {dailyTips.map((notification, index) => (
                    <View key={notification.identifier || index} style={styles.notificationCard}>
                      <View style={styles.notificationHeader}>
                        <View style={styles.notificationIconContainer}>
                          <MaterialIcons 
                            name={getNotificationIcon('dental_tip')} 
                            size={24} 
                            color={getNotificationColor('dental_tip')} 
                          />
                        </View>
                        <View style={styles.notificationContent}>
                          <Text style={styles.notificationTitle}>
                            {notification.content.title}
                          </Text>
                          <Text style={styles.notificationBody}>
                            {notification.content.body}
                          </Text>
                          <Text style={styles.scheduleText}>
                            Recurring daily at 9:00 AM
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() => handleCancelNotification(
                            notification.identifier, 
                            notification.content.title
                          )}
                        >
                          <MaterialIcons name="close" size={20} color="#F44336" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Other Notifications */}
              {otherNotifications.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    📋 Other Notifications ({otherNotifications.length})
                  </Text>
                  {otherNotifications.map((notification, index) => {
                    const scheduledDate = notification.trigger?.date || notification.trigger;
                    
                    return (
                      <View key={notification.identifier || index} style={styles.notificationCard}>
                        <View style={styles.notificationHeader}>
                          <View style={styles.notificationIconContainer}>
                            <MaterialIcons 
                              name={getNotificationIcon('other')} 
                              size={24} 
                              color={getNotificationColor('other')} 
                            />
                          </View>
                          <View style={styles.notificationContent}>
                            <Text style={styles.notificationTitle}>
                              {notification.content.title}
                            </Text>
                            <Text style={styles.notificationBody}>
                              {notification.content.body}
                            </Text>
                            <Text style={styles.scheduleText}>
                              Scheduled for: {formatDate(scheduledDate)}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => handleCancelNotification(
                              notification.identifier, 
                              notification.content.title
                            )}
                          >
                            <MaterialIcons name="close" size={20} color="#F44336" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ViewScheduledNotificationsScreen;