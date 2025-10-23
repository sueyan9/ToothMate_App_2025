import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Collapsible from 'react-native-collapsible';
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
    scheduleSpecificAppointmentReminder,
    clearError,
  } = useContext(NotificationContext);

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [collapsedSections, setCollapsedSections] = useState({});
  const savedCollapsedState = useRef({});

  useEffect(() => {
    if (Object.keys(savedCollapsedState.current).length > 0) {
      setCollapsedSections(savedCollapsedState.current);
    }
  }, [scheduledNotifications.length]);


  useEffect(() => {
    //loadNotifications();
    // Test bell colors to verify the logic works
    testBellColors();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      await getScheduledNotifications();
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setCollapsedSections(savedCollapsedState.current);
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setCollapsedSections(savedCollapsedState.current);
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

  const handleReminderToggle = async (appointment, reminderType, isEnabled) => {
    const { appointmentDate, appointmentTime, clinicName, reminders, patientInfo } = appointment;

    const currentCollapsedState = { ...collapsedSections };
    savedCollapsedState.current = currentCollapsedState;
    
    if (isEnabled) {
      // User wants to enable this reminder type - schedule it
      const result = await scheduleSpecificAppointmentReminder(
        appointmentDate,
        appointmentTime,
        clinicName,
        reminderType,
        `${appointmentDate}-${appointmentTime}-${clinicName}`,
        patientInfo
      );
      
      if (result.success) {
      } else {
        Alert.alert('Error', `Failed to schedule ${reminderType} reminder: ${result.message || result.error}`);
      }
    } else {
      // User wants to disable this reminder type - cancel it
      const reminder = reminders[reminderType];
      if (reminder) {
        const result = await cancelNotification(reminder.identifier);
        if (result.success) {
          //await loadNotifications(); // Refresh the list
        } else {
          Alert.alert('Error', `Failed to cancel ${reminderType} reminder`);
        }
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown time';
    
    try {
      // Enhanced debug logging
      console.log('formatDate input:', {
        date,
        type: typeof date,
        isArray: Array.isArray(date),
        isObject: typeof date === 'object',
        keys: typeof date === 'object' ? Object.keys(date) : null
      });
      
      // Handle different date formats
      let dateObj;
      if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === 'string' || typeof date === 'number') {
        dateObj = new Date(date);
      } else if (typeof date === 'object') {
        // Handle various object formats
        if (date.dateTime) {
          dateObj = new Date(date.dateTime);
        } else if (date.date) {
          dateObj = new Date(date.date);
        } else if (date.timestamp) {
          dateObj = new Date(date.timestamp);
        } else if (date.seconds) {
          // Unix timestamp in seconds
          dateObj = new Date(date.seconds * 1000);
        } else if (date.value) {
          dateObj = new Date(date.value);
        } else {
          // Try to convert the object itself
          console.warn('Trying to convert object directly:', date);
          dateObj = new Date(date);
        }
      } else {
        console.warn('Unhandled date format:', date);
        return 'Invalid date format';
      }
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date created from:', date);
        return 'Invalid date';
      }
      
      return dateObj.toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', error, 'Date value:', date);
      return 'Invalid date';
    }
  };

  const getBellColorAndIcon = (scheduledDate) => {
    if (!scheduledDate) return { color: '#999', icon: 'notifications' };
    
    try {
      const now = new Date();
      let scheduled;
      
      // Handle different date formats (same logic as formatDate)
      if (scheduledDate instanceof Date) {
        scheduled = scheduledDate;
      } else if (typeof scheduledDate === 'string' || typeof scheduledDate === 'number') {
        scheduled = new Date(scheduledDate);
      } else if (typeof scheduledDate === 'object') {
        if (scheduledDate.dateTime) {
          scheduled = new Date(scheduledDate.dateTime);
        } else if (scheduledDate.date) {
          scheduled = new Date(scheduledDate.date);
        } else if (scheduledDate.timestamp) {
          scheduled = new Date(scheduledDate.timestamp);
        } else if (scheduledDate.seconds) {
          scheduled = new Date(scheduledDate.seconds * 1000);
        } else if (scheduledDate.value) {
          scheduled = new Date(scheduledDate.value);
        } else {
          scheduled = new Date(scheduledDate);
        }
      } else {
        return { color: '#999', icon: 'notifications' };
      }
      
      if (isNaN(scheduled.getTime())) {
        console.warn('Invalid scheduled date for bell color:', scheduledDate);
        return { color: '#999', icon: 'notifications' };
      }
      
      const timeDiff = scheduled.getTime() - now.getTime();
      const hoursUntil = timeDiff / (1000 * 60 * 60);
      const minutesUntil = timeDiff / (1000 * 60);
      
      console.log('Bell color calculation:', {
        now: now.toISOString(),
        scheduled: scheduled.toISOString(),
        timeDiff,
        hoursUntil,
        minutesUntil,
        scheduledDate: scheduledDate
      });
      
      if (hoursUntil <= 1) {
        // Red bell - very close (1 hour or less)
        console.log('Returning RED bell - hoursUntil:', hoursUntil);
        return { color: '#F44336', icon: 'notifications-active' };
      } else if (hoursUntil <= 6) {
        // Yellow bell - moderately close (1-6 hours)
        console.log('Returning YELLOW bell - hoursUntil:', hoursUntil);
        return { color: '#FF9800', icon: 'notifications' };
      } else {
        // Green bell - far away (more than 6 hours)
        console.log('Returning GREEN bell - hoursUntil:', hoursUntil);
        return { color: '#4CAF50', icon: 'notifications' };
      }
    } catch (error) {
      console.error('Error calculating bell color:', error);
      return { color: '#999', icon: 'notifications' };
    }
  };

  // Test function to verify bell colors
  const testBellColors = () => {
    const now = new Date();
    const testDates = [
      new Date(now.getTime() + 30 * 60 * 1000), // 30 minutes from now (RED)
      new Date(now.getTime() + 3 * 60 * 60 * 1000), // 3 hours from now (YELLOW)
      new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours from now (GREEN)
    ];
    
    testDates.forEach((date, index) => {
      const { color, icon } = getBellColorAndIcon(date);
      console.log(`Test ${index + 1}:`, {
        date: date.toISOString(),
        color,
        icon,
        expected: index === 0 ? 'RED' : index === 1 ? 'YELLOW' : 'GREEN'
      });
    });
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

  // Group appointment reminders by appointment (same date, time, clinic)
  const groupAppointmentsByDetails = (reminders) => {
    const groups = {};
    
    reminders.forEach(notification => {
      const data = notification.content.data;
      const key = `${data.appointmentDate}-${data.appointmentTime}-${data.clinicName}`;
      
      if (!groups[key]) {
        groups[key] = {
          appointmentDate: data.appointmentDate,
          appointmentTime: data.appointmentTime,
          clinicName: data.clinicName,
          patientInfo: data.patientInfo,
          reminders: {
            '24h': null,
            '1h': null, 
            '15m': null
          }
        };
      }
      
      groups[key].reminders[data.reminderType] = notification;
      console.log('Notification data:', data);
      console.log('PatientInfo value:', data.patientInfo, 'Type:', typeof data.patientInfo);
    });
    
    return Object.values(groups);
  };

  // Group notifications by type
  const appointmentReminders = scheduledNotifications?.filter(n => 
    n.content?.data?.type === 'appointment_reminder'
  ) || [];

  const toggleSection = (key) => {
    setCollapsedSections(prev => {
      const newState = {
        ...prev,
        [key]: !prev[key]
      };
      savedCollapsedState.current = newState;
      return newState;
    });
  };
  
  const groupedAppointments = groupAppointmentsByDetails(appointmentReminders);
  
  const dailyTips = scheduledNotifications?.filter(n => 
    n.content?.data?.type === 'dental_tip'
  ) || [];
  
  const otherNotifications = scheduledNotifications?.filter(n => 
    n.content?.data?.type !== 'appointment_reminder' && 
    n.content?.data?.type !== 'dental_tip'
  ) || [];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#516287" />
            <Text style={styles.loadingText}>Loading scheduled notifications...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#875B51" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <MaterialIcons name="refresh" size={24} color="#875B51" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {scheduledNotifications?.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="notifications-off" size={48} color="#516287" />
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
              {/* Appointment Reminders */}
              {groupedAppointments.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.titleText}>Scheduled Appointment Notifications: {groupedAppointments.length}</Text>
                  {groupedAppointments.map((appointment, index) => {
                    const { appointmentDate, appointmentTime, clinicName, reminders, patientInfo } = appointment;
                    const sectionKey = `${appointmentDate}-${appointmentTime}-${clinicName}-${index}`;
                    
                    return (
                      <View key={sectionKey} style={styles.appointmentCard}>
                        <View style={styles.separator}>
                        <View style={styles.appointmentHeader}>
                          <MaterialIcons name='local-hospital' size={24} color='#516287'/>
                          <Text style={styles.nameText}>{patientInfo}</Text>
                          <Text style={styles.timeText}>{appointmentDate} | {appointmentTime}</Text>
                        </View>
                          <Text style={styles.locationText}>{clinicName}</Text>
                        </View>
                        
                        {/* Reminder Controls */}
                        <TouchableOpacity onPress={() => toggleSection(sectionKey)} style={styles.appointmentHeader}>
                          <MaterialIcons name='settings' size={24} color='#516287'/>
                          <Text style={styles.reminderControlsTitle}>Reminder Settings:</Text>
                          <MaterialIcons 
                            name={!collapsedSections[sectionKey] ? 'expand-more' : 'expand-less'} 
                            size={24} 
                            color='#516287'
                            style={styles.expandButton}
                          />
                          </TouchableOpacity>
                        <Collapsible collapsed={!collapsedSections[sectionKey]} defaultOpen={false}>
                          
                          {/* 24 Hour Reminder */}
                          <Text style={styles.notificationTitle}>Remind At:</Text>
                          <View style={styles.reminderRow}>
                            <Text style={styles.reminderLabel}>24 Hours Before: </Text>
                            <Switch
                              value={!!reminders['24h']}
                              onValueChange={(value) => handleReminderToggle(appointment, '24h', value)}
                              trackColor={{ false: '#ddd', true: '#EDDFD3' }}
                              thumbColor={reminders['24h'] ? '#875B51' : '#f4f3f4'}
                            />
                          </View>
                          
                          {/* 1 Hour Reminder */}
                          <View style={styles.reminderRow}>
                            <Text style={styles.reminderLabel}>1 Hour: </Text>
                            <Switch
                              value={!!reminders['1h']}
                              onValueChange={(value) => handleReminderToggle(appointment, '1h', value)}
                              trackColor={{ false: '#ddd', true: '#EDDFD3' }}
                              thumbColor={reminders['1h'] ? '#875B51' : '#f4f3f4'}
                            />
                          </View>
                          
                          {/* 15 Minute Reminder */}
                          <View style={styles.reminderRow}>
                            <Text style={styles.reminderLabel}>15 Min: </Text>
                            <Switch
                              value={!!reminders['15m']}
                              onValueChange={(value) => handleReminderToggle(appointment, '15m', value)}
                              trackColor={{ false: '#ddd', true: '#EDDFD3' }}
                              thumbColor={reminders['15m'] ? '#875B51' : '#f4f3f4'}
                            />
                          </View>
                          </Collapsible>
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
    </View>
  );
};

export default ViewScheduledNotificationsScreen;