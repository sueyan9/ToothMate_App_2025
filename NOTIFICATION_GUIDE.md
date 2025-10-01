# ToothMate Appointment Reminders - Complete Guide

## Overview

ToothMate now includes a comprehensive appointment reminder system that automatically sends notifications to users before their dental appointments. The system supports multiple reminder times and respects user preferences.

## Features

### ✅ Implemented Features

1. **Multiple Reminder Types**
   - 24 hours before appointment
   - 1 hour before appointment  
   - 15 minutes before appointment

2. **Smart Scheduling**
   - Only schedules reminders for future appointments
   - Respects user preferences for which reminders to enable
   - Automatically calculates reminder times based on appointment date/time

3. **User Preferences**
   - Enable/disable appointment reminders entirely
   - Individual control over each reminder type (24h, 1h, 15m)
   - Daily dental tips (separate from appointment reminders)

4. **Reminder Management**
   - Automatic scheduling when appointments are created
   - Ability to cancel reminders for specific appointments
   - View all scheduled appointment reminders

5. **Cross-Platform Support**
   - Works on both iOS and Android
   - Local notifications (always work)
   - Push notifications (when available in production builds)

## How It Works

### 1. Automatic Reminder Scheduling

When a user creates an appointment in the `ClinicScreen`, the system automatically:

1. Checks if appointment reminders are enabled in user settings
2. Calculates reminder times based on the appointment date/time
3. Schedules notifications for 24h, 1h, and 15m before (based on user preferences)
4. Stores reminder metadata for future management

### 2. User Settings Integration

The `NotificationSettingsScreen` allows users to:

- Enable/disable appointment reminders globally
- Control individual reminder times (24h, 1h, 15m)
- Manage daily dental tips
- Test notification functionality

### 3. Smart Reminder Logic

The system intelligently handles various scenarios:

- **Past Appointments**: No reminders scheduled for appointments in the past
- **Near-term Appointments**: Only relevant reminders scheduled (e.g., no 24h reminder for an appointment in 2 hours)
- **User Preferences**: Respects individual settings for each reminder type

## File Structure

### Core Notification Files

```
src/
├── services/
│   └── NotificationService.js          # Core notification logic
├── context/
│   └── NotificationContext/
│       └── NotificationContext.js      # React context for notifications
├── screens/
│   ├── NotificationSettingsScreen/    # User preference settings
│   ├── NotificationDemo/               # Testing interface
│   └── ClinicScreen/                   # Appointment creation (with auto-reminders)
└── app.json                            # Expo notification configuration
```

### Key Components

1. **NotificationService.js**
   - `scheduleAppointmentReminder()` - Schedules multiple reminders for an appointment
   - `cancelAppointmentReminders()` - Cancels reminders for a specific appointment
   - `getAppointmentReminders()` - Retrieves scheduled appointment reminders

2. **NotificationContext.js**
   - Manages notification state and user preferences
   - Provides React hooks for scheduling and managing reminders
   - Handles permission requests and settings persistence

3. **ClinicScreen.jsx**
   - Automatically schedules reminders when appointments are created
   - Passes appointment ID and clinic information to reminder system

## Testing

### Using the Notification Demo Screen

The `NotificationDemo` screen provides comprehensive testing tools:

1. **Basic Tests**
   - Request notification permissions
   - Send immediate test notifications

2. **Appointment Reminder Tests**
   - Schedule test appointment for tomorrow (tests all reminder types)
   - Schedule near-term appointment (tests 1h and 15m reminders only)
   - View scheduled appointment reminders
   - Cancel test reminders

### Manual Testing Steps

1. **Permission Setup**
   ```javascript
   // Go to NotificationDemo screen
   // Tap "Request Permissions"
   // Ensure permission is "granted"
   ```

2. **Test Full Reminder Cycle**
   ```javascript
   // Tap "Schedule Test Appointment (Tomorrow)"
   // Check notification is scheduled for 24h, 1h, and 15m before
   // Go to NotificationSettingsScreen to verify settings
   ```

3. **Test Near-term Reminders**
   ```javascript
   // Tap "Schedule Near-Term Appointment (2 hours)"
   // Verify only 1h and 15m reminders are scheduled
   ```

4. **Test User Preferences**
   ```javascript
   // Go to NotificationSettingsScreen
   // Disable "1 Hour Before" reminder
   // Create new appointment
   // Verify only 24h and 15m reminders are scheduled
   ```

## Development Notes

### Expo Go Limitations

- **Push Notifications**: Not available in Expo Go for SDK 49+
- **Local Notifications**: Work perfectly in Expo Go
- **Production**: Full push notification support available in production builds

### Platform Differences

- **iOS**: Requires explicit permission request, supports rich notifications
- **Android**: Notification channels configured automatically, supports custom sounds

### Error Handling

The system includes comprehensive error handling:
- Graceful degradation when permissions are denied
- Fallback to local notifications when push notifications fail
- User-friendly error messages in the UI

## Configuration

### app.json Configuration

```json
{
  "notification": {
    "icon": "./assets/tooth_icon.png",
    "color": "#78d0f5",
    "sounds": ["./assets/notification.wav"],
    "androidMode": "default",
    "androidCollapsedTitle": "ToothMate"
  },
  "plugins": [
    [
      "expo-notifications",
      {
        "icon": "./assets/tooth_icon.png",
        "color": "#78d0f5",
        "defaultChannel": "default"
      }
    ]
  ]
}
```

### Default User Settings

```javascript
{
  appointmentReminders: true,    // Enable appointment reminders
  dailyTips: true,              // Enable daily dental tips
  reminderTime24h: true,        // 24-hour reminder enabled
  reminderTime1h: true,         // 1-hour reminder enabled
  reminderTime15m: true,        // 15-minute reminder enabled
  dailyTipTime: '09:00'         // Daily tip time
}
```

## API Reference

### NotificationService Methods

```javascript
// Schedule appointment reminders
await notificationService.scheduleAppointmentReminder(
  appointmentDate,    // 'YYYY-MM-DD'
  appointmentTime,    // 'HH:MM'
  clinicName,         // string
  appointmentId,      // optional string
  userSettings        // optional settings object
);

// Cancel appointment reminders
await notificationService.cancelAppointmentReminders(
  appointmentId,      // optional string
  appointmentDate,    // optional 'YYYY-MM-DD'
  appointmentTime     // optional 'HH:MM'
);

// Get appointment reminders
await notificationService.getAppointmentReminders(
  appointmentId       // optional string
);
```

### NotificationContext Methods

```javascript
const {
  scheduleAppointmentReminder,
  cancelAppointmentReminders,
  getAppointmentReminders,
  updateNotificationSettings,
  // ... other methods
} = useContext(NotificationContext);
```

## Troubleshooting

### Common Issues

1. **Notifications Not Appearing**
   - Check device notification permissions
   - Verify app notification settings are enabled
   - Ensure appointment is in the future

2. **Missing Reminders**
   - Check user preferences in NotificationSettingsScreen
   - Verify appointment reminders are enabled globally
   - Check if specific reminder types are disabled

3. **Expo Go Limitations**
   - Use development build for full push notification testing
   - Local notifications work fine for testing reminder logic

### Debug Tools

1. **NotificationDemo Screen**: Comprehensive testing interface
2. **Console Logs**: Detailed logging throughout the notification system
3. **Settings Screen**: Real-time feedback on notification status

## Future Enhancements

Potential improvements for the notification system:

1. **Custom Reminder Times**: Allow users to set custom reminder intervals
2. **Recurring Appointments**: Special handling for recurring dental visits
3. **Smart Notifications**: AI-powered reminders based on user behavior
4. **Rich Notifications**: Include appointment details, clinic maps, etc.
5. **Backend Integration**: Server-side notification scheduling for reliability

## Support

For issues or questions about the notification system:

1. Check the NotificationDemo screen for testing tools
2. Review console logs for detailed error information
3. Verify user permissions and settings
4. Test with different appointment times and scenarios