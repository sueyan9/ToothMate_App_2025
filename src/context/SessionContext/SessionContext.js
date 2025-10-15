import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { createContext, useEffect, useReducer, useRef } from 'react';
import { Alert, AppState } from 'react-native';

dayjs.extend(utc);
dayjs.extend(tz);

const SessionContext = createContext();

const SESSION_DURATION = 10000 * 60 * 1000; // 5 minutes in milliseconds
const WARNING_TIME = 100 * 60 * 1000; // Show warning 1 minute before expiry
const SESSION_KEY = '@session_start_time';

const sessionReducer = (state, action) => {
    switch (action.type) {
        case 'START_SESSION':
            return {
                ...state,
                sessionStartTime: action.payload,
                isSessionActive: true,
                showWarning: false
            };
        case 'END_SESSION':
            return {
                ...state,
                isSessionActive: false,
                sessionStartTime: null,
                showWarning: false
            };
        case 'SHOW_WARNING':
            return {
                ...state,
                showWarning: true
            };
        case 'EXTEND_SESSION':
            return {
                ...state,
                sessionStartTime: action.payload,
                showWarning: false
            };
        default:
            return state;
    }
};

const SessionProvider = ({ children, onSessionExpired }) => {
    const [state, dispatch] = useReducer(sessionReducer, {
        sessionStartTime: null,
        isSessionActive: false,
        showWarning: false
    });

    const timerRef = useRef(null);
    const warningTimerRef = useRef(null);
    const appStateRef = useRef(AppState.currentState);

    // Get user's timezone
    const getUserTimezone = () => {
        return dayjs.tz.guess(); // Automatically detects user's timezone
    };

    // Start new session
    const startSession = async () => {
        const now = dayjs().tz(getUserTimezone()).valueOf();
        await AsyncStorage.setItem(SESSION_KEY, now.toString());
        dispatch({ type: 'START_SESSION', payload: now });
        setupTimers(now);
    };

    // Check if session is still valid
    const checkSession = async () => {
        try {
            const sessionStart = await AsyncStorage.getItem(SESSION_KEY);
            if (!sessionStart) {
                return false;
            }

            const startTime = parseInt(sessionStart);
            const now = dayjs().tz(getUserTimezone()).valueOf();
            const elapsed = now - startTime;

            if (elapsed >= SESSION_DURATION) {
                await endSession();
                return false;
            }

            dispatch({ type: 'START_SESSION', payload: startTime });
            setupTimers(startTime);
            return true;
        } catch (error) {
            console.error('Error checking session:', error);
            return false;
        }
    };

    // Setup timers for warning and expiry
    const setupTimers = (startTime) => {
        clearTimers();

        const now = dayjs().tz(getUserTimezone()).valueOf();
        const elapsed = now - startTime;
        const remaining = SESSION_DURATION - elapsed;
        const warningRemaining = SESSION_DURATION - WARNING_TIME - elapsed;

        // Set warning timer (1 minute before expiry)
        if (warningRemaining > 0) {
            warningTimerRef.current = setTimeout(() => {
                dispatch({ type: 'SHOW_WARNING' });
                showWarningAlert();
            }, warningRemaining);
        }

        // Set expiry timer
        if (remaining > 0) {
            timerRef.current = setTimeout(() => {
                endSession();
            }, remaining);
        }
    };

    // Clear all timers
    const clearTimers = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (warningTimerRef.current) {
            clearTimeout(warningTimerRef.current);
            warningTimerRef.current = null;
        }
    };

    // Show warning alert
    const showWarningAlert = () => {
        Alert.alert(
            'Session Expiring Soon',
            'Your session will expire in 1 minute. Would you like to extend it?',
            [
                {
                    text: 'Log Out',
                    onPress: () => endSession(),
                    style: 'destructive'
                },
                {
                    text: 'Extend Session',
                    onPress: () => extendSession()
                }
            ]
        );
    };

    // Extend session
    const extendSession = async () => {
        const now = dayjs().tz(getUserTimezone()).valueOf();
        await AsyncStorage.setItem(SESSION_KEY, now.toString());
        dispatch({ type: 'EXTEND_SESSION', payload: now });
        setupTimers(now);
    };

    // End session
    const endSession = async () => {
        clearTimers();
        await AsyncStorage.removeItem(SESSION_KEY);
        dispatch({ type: 'END_SESSION' });
        
        Alert.alert(
            'Session Expired',
            'Your session has expired. Please log in again.',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        if (onSessionExpired) {
                            onSessionExpired();
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    // Get remaining time
    const getRemainingTime = () => {
        if (!state.sessionStartTime) return 0;
        const now = dayjs().tz(getUserTimezone()).valueOf();
        const elapsed = now - state.sessionStartTime;
        const remaining = SESSION_DURATION - elapsed;
        return Math.max(0, remaining);
    };

    // Handle app state changes (background/foreground)
    useEffect(() => {
        const subscription = AppState.addEventListener('change', async (nextAppState) => {
            if (
                appStateRef.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                // App came to foreground - check if session is still valid
                const isValid = await checkSession();
                if (!isValid && state.isSessionActive) {
                    endSession();
                }
            }
            appStateRef.current = nextAppState;
        });

        return () => {
            subscription?.remove();
        };
    }, [state.isSessionActive]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearTimers();
        };
    }, []);

    return (
        <SessionContext.Provider
            value={{
                state,
                startSession,
                endSession,
                extendSession,
                checkSession,
                getRemainingTime
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

export { SessionContext, SessionProvider };

