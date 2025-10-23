import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useReducer, useRef } from 'react';
import { Alert, AppState } from 'react-native';
import axiosApi from '../../api/axios'; // Add your axios instance import

    const AccessContext = createContext();

    const CHECK_INTERVAL = 10000; // Check backend every 3 seconds

    // Define the master admin NHI who controls access
    const MASTER_ADMIN_NHIS = ['ABY0987', 'CBD1234', 'ALA1481', 'LOL0987', 'JIM1234', 'POE4762', 'ABE8011', 'SWL8756', 'ESU9112', 'SCH1409']; // Change this to your actual admin NHI

    const accessReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ACCESS':
        return {
            ...state,
            hasAccess: action.payload.hasAccess,
            isMasterAdmin: action.payload.isMasterAdmin
        };
        case 'SET_LOADING':
        return {
            ...state,
            isLoading: action.payload
        };
        case 'SET_GRANTING_ACCESS':
        return {
            ...state,
            isGrantingAccess: action.payload
        };
        case 'SET_INITIALIZED':
        return {
            ...state,
            initialized: action.payload
        };
        case 'RESET':
        return {
            hasAccess: false,
            isMasterAdmin: false,
            isLoading: false,
            isGrantingAccess: false,
            initialized: false
        };
        default:
        return state;
    }
    };

    // Check if current user is the master admin
    const checkIfMasterAdmin = (nhi) => {
        return MASTER_ADMIN_NHIS.map(n => n.toUpperCase()).includes(nhi?.toUpperCase());
    };

    export const AccessProvider = ({ children, onAccessRevoked, navigation }) => {
    const [state, dispatch] = useReducer(accessReducer, {
        hasAccess: false,
        isMasterAdmin: false,
        isLoading: true,
        isGrantingAccess: false,
        initialized: false
    });

    const checkIntervalRef = useRef(null);
    const lastAccessStateRef = useRef(null);
    const currentUserIdRef = useRef(null);
    const hasShownAlertRef = useRef(false);

    const initializeForUser = async (userId) => {
        console.log('🎯 Explicitly initializing access checks for user:', userId);
        
        // Reset if different user
        if (currentUserIdRef.current && currentUserIdRef.current !== userId) {
        resetAccessState();
        }
        
        currentUserIdRef.current = userId;
        hasShownAlertRef.current = false;
        
        await checkAccessFromBackend();
        startChecking();
    };

    const resetAccessState = () => {
        console.log('🔄 Resetting access state for new user session');
        stopChecking();
        dispatch({ type: 'RESET' });
        lastAccessStateRef.current = null;
        currentUserIdRef.current = null;
        hasShownAlertRef.current = false;
    };

    const signOutAndRedirect = async () => {
        try {
        // Clear all auth data
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('id');
        await AsyncStorage.removeItem('parentId');
        await AsyncStorage.removeItem('activeProfileName');
        await AsyncStorage.removeItem('activeProfileFirstName');
        await AsyncStorage.removeItem('activeProfileUsername');
        await AsyncStorage.removeItem('activeProfilePictureIndex');
        await AsyncStorage.removeItem('currentAccountType');
        
        // Stop checking
        resetAccessState();
        
        if (navigation) {
            navigation.reset({
            index: 0,
            routes: [{ name: 'loginFlow' }],
            });
        }

        if (onAccessRevoked) {
            onAccessRevoked();
        }
        } catch (error) {
        console.error('Error during sign out:', error);
        }
    }

    // Check access from backend
    const checkAccessFromBackend = async () => {
        try {
        const id = await AsyncStorage.getItem('id');
        if (!id) return;

        if (currentUserIdRef.current && currentUserIdRef.current !== id) {
            console.log('👤 Different user detected, resetting state');
            resetAccessState();
            currentUserIdRef.current = id;
        } else if (!currentUserIdRef.current) {
            currentUserIdRef.current = id;
        }

        const response = await axiosApi.get(`/user/${id}`);
        const userDetails = response.data;

        const isMasterAdmin = checkIfMasterAdmin(userDetails.nhi);
        const hasAccess = isMasterAdmin || userDetails.restricted_access === true;

        console.log('Access check result:', { 
            nhi: userDetails.nhi, 
            isMasterAdmin, 
            hasAccess, 
            restricted_access: userDetails.restricted_access,
            previousAccess: lastAccessStateRef.current
        });

        const previousAccessState = lastAccessStateRef.current;

        // Only show alert if access state changed from true to false (for non-admin users)
        if (previousAccessState === true && hasAccess === false && !isMasterAdmin && !hasShownAlertRef.current) {
            Alert.alert(
            'Access Revoked',
            'Access has been revoked by the administrator.',
            [
                {
                text: 'OK',
                onPress: async () => {
                    await signOutAndRedirect();
                }
                }
            ],
            { cancelable: false }
            );
        }

        lastAccessStateRef.current = hasAccess;

        dispatch({
            type: 'SET_ACCESS',
            payload: { hasAccess, isMasterAdmin }
        });

        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_INITIALIZED', payload: true });

        return { hasAccess, isMasterAdmin };
        } catch (error) {
        console.error('Error checking access from backend:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
        return null;
        }
    };

    // Check access based on user details
    const checkUserAccess = async (userDetails) => {
        if (!userDetails) return false;

        const isMasterAdmin = checkIfMasterAdmin(userDetails.nhi);
        const hasAccess = isMasterAdmin || userDetails.restricted_access === true;

        hasShownAlertRef.current = false;
        lastAccessStateRef.current = hasAccess;

        dispatch({
        type: 'SET_ACCESS',
        payload: { hasAccess, isMasterAdmin }
        });

        dispatch({ type: 'SET_INITIALIZED', payload: true });

        return hasAccess;
    };

    // Grant access to all users (master admin only)
    const grantAccessToAll = async () => {
        if (!state.isMasterAdmin) {
        console.error('Only master admin can grant access');
        return { success: false, error: 'Unauthorized' };
        }

        dispatch({ type: 'SET_GRANTING_ACCESS', payload: true });
        
        try {
        const id = await AsyncStorage.getItem('id');
        const response = await axiosApi.post('/admin/grant-access', { 
            adminId: id 
        });

        Alert.alert('Success', 'Access has been granted to all users');
        return { success: true, data: response.data };
        } catch (error) {
        console.error('Error granting access:', error);
        Alert.alert('Error', error.response?.data?.error || 'Failed to grant access. Please try again.');
        return { success: false, error: error.message };
        } finally {
        dispatch({ type: 'SET_GRANTING_ACCESS', payload: false });
        }
    };

    // Revoke access from all users (master admin only)
    const revokeAccessFromAll = async () => {
        if (!state.isMasterAdmin) {
        console.error('Only master admin can revoke access');
        return { success: false, error: 'Unauthorized' };
        }

        dispatch({ type: 'SET_GRANTING_ACCESS', payload: true });
        
        try {
        const id = await AsyncStorage.getItem('id');
        const response = await axiosApi.post('/admin/revoke-access', { 
            adminId: id 
        });

        Alert.alert('Success', 'Access has been revoked from all users');
        return { success: true, data: response.data };
        } catch (error) {
        console.error('Error revoking access:', error);
        Alert.alert('Error', error.response?.data?.error || 'Failed to revoke access. Please try again.');
        return { success: false, error: error.message };
        } finally {
        dispatch({ type: 'SET_GRANTING_ACCESS', payload: false });
        }
    };

    // Start checking access status periodically
    const startChecking = () => {
        stopChecking();
    
        console.log('🔄 Starting access checking interval');
        checkIntervalRef.current = setInterval(async () => {
        const id = await AsyncStorage.getItem('id');
        if (id) { // Only check if user is logged in
            console.log('🔄 Interval check running for user:', id);
            await checkAccessFromBackend();
        } else {
            console.log('🚫 No user logged in, stopping checks');
            stopChecking(); // Stop if user logged out
        }
        }, CHECK_INTERVAL);
    };

    // Stop checking
    const stopChecking = () => {
        if (checkIntervalRef.current) {
        console.log('🛑 Stopping access checking interval');
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
        }
    };

    useEffect(() => {
        let checkUserInterval;

        const initialize = async () => {
        const id = await AsyncStorage.getItem('id');
        if (id) {
            console.log('🚀 Initializing access checks for logged-in user:', id);
            currentUserIdRef.current = id;
            await checkAccessFromBackend();
            startChecking();
        } else {
            console.log('👋 No user logged in on mount');
            dispatch({ type: 'SET_LOADING', payload: false });
        }
        };

        initialize();

        // Poll for user ID changes (in case user logs in)
        checkUserInterval = setInterval(async () => {
        const id = await AsyncStorage.getItem('id');
        
        // User just logged in (ID appeared)
        if (id && !currentUserIdRef.current) {
            console.log('✨ New user logged in, starting access checks:', id);
            currentUserIdRef.current = id;
            hasShownAlertRef.current = false;
            lastAccessStateRef.current = null;
            await checkAccessFromBackend();
            startChecking();
        }
        // User logged out (ID disappeared)
        else if (!id && currentUserIdRef.current) {
            console.log('👋 User logged out, stopping checks');
            resetAccessState();
        }
        // Different user logged in
        else if (id && currentUserIdRef.current && id !== currentUserIdRef.current) {
            console.log('🔄 Different user logged in:', id);
            resetAccessState();
            currentUserIdRef.current = id;
            hasShownAlertRef.current = false;
            lastAccessStateRef.current = null;
            await checkAccessFromBackend();
            startChecking();
        }
        }, 1000); // Check every 2 seconds for login state changes

        return () => {
        console.log('🧹 Cleaning up AccessProvider');
        stopChecking();
        if (checkUserInterval) {
            clearInterval(checkUserInterval);
        }
        };
    }, []);

    // Listen for app state changes
    useEffect(() => {
        const subscription = AppState.addEventListener('change', async (nextAppState) => {
        if (nextAppState === 'active') {
            const id = await AsyncStorage.getItem('id');
            if (id) {
            console.log('📱 App foregrounded, checking access for user:', id);
            await checkAccessFromBackend();
            }
        }
        });

        return () => {
        subscription?.remove();
        };
    }, []);

    return (
        <AccessContext.Provider
        value={{
            state,
            checkUserAccess,
            checkAccessFromBackend,
            grantAccessToAll,
            revokeAccessFromAll,
            startChecking,
            stopChecking,
            resetAccessState
        }}
        >
        {children}
        </AccessContext.Provider>
    );
    };

    export const Context = AccessContext;