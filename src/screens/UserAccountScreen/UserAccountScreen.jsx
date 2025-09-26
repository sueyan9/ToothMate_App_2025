const tryInferName = (url) => {
    try {
        const u = new URL(url);
        const file = u.pathname.split('/').pop();
        return decodeURIComponent(file || 'document.pdf');
    } catch {
        return 'document.pdf';
    }
};
const normalizeDataUrl = (s) => {
    if (typeof s !== 'string') return '';
    const t = s.trim();
    return t.startsWith('data:image/*;') ? t.replace(/^data:image\/\*;/, 'data:image/png;') : t;
};
// fallback: get YYYY-MM-DD / YYYY_MM_DD from document name
const inferDateFromName = (name) => {
    if (!name) return null;
    const m = String(name).match(/(\d{4})[-_/](\d{2})[-_/](\d{2})/);
    if (!m) return null;
    return new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00`);
};

// use doc.when when there is no date
const formatDocWhen = (doc) => {
    const d = doc?.when ? new Date(doc.when) : inferDateFromName(doc?.name);
    if (!d || Number.isNaN(d.getTime())) return '';
    return d.toLocaleString('en-NZ', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
    Alert, Image, Modal, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, FlatList
} from 'react-native';
import axiosApi from '../../api/axios';
import {Context as AuthContext} from '../../context/AuthContext/AuthContext';
import {useTranslation} from '../../context/TranslationContext/useTranslation';
import {Context as UserContext} from '../../context/UserContext/UserContext';
import {
    fetchAssetsForAppointment,

} from '../../api/appointments';
import * as WebBrowser from 'expo-web-browser';
import styles from './styles';

// Import profile pictures
const profilePictures = [require('../../../assets/profile pictures/p0.png'), require('../../../assets/profile pictures/p1.png'), require('../../../assets/profile pictures/p2.png'), require('../../../assets/profile pictures/p3.png'), require('../../../assets/profile pictures/p4.png'), require('../../../assets/profile pictures/p5.png'), require('../../../assets/profile pictures/p6.png'), require('../../../assets/profile pictures/p7.png'), require('../../../assets/profile pictures/p8.png'),];

const UserAccountScreen = ({navigation}) => {
    // Translation hook
    const {t, translateAndCache, currentLanguage} = useTranslation();

    // State to force re-render on language change
    const [refreshKey, setRefreshKey] = useState(0);

    const [xrayImages, setXrayImages] = useState([]);    // base64[]
    const [pdfItems, setPdfItems] = useState([]);     // {source,value,name?,when?}[]

    // Define texts to translate
    const textsToTranslate = ['Account Settings', 'User Name', 'Change Profile Picture', 'Personal Information', 'First Name', 'Last Name', 'Date of Birth', 'Email', 'Address', 'Emergency Contact Name', 'Emergency Contact Phone', 'Medical Information', 'NHI Number', 'Dental Clinic', 'Clinic Address', 'Clinic Phone', 'Update Your Details', 'Change Clinic', 'Change Your Password', 'Disconnect From Parent', 'Sign Out', 'Not specified', 'None', 'Choose Profile Picture', 'Enter your email', 'Enter your address', 'Enter emergency contact name', 'Enter emergency contact phone', 'Email is available', 'Cancel', 'Submit', 'Confirm Changes', 'Are you sure you want to save these changes to your profile?', 'Discard Changes', 'Save Changes', 'Change Password', 'Current Password', 'New Password', 'Confirm New Password', 'Enter your current password', 'Enter your new password', 'Confirm your new password', 'Password meets all requirements', 'Passwords do not match', 'Passwords match', 'Confirm Password Change', 'Are you sure you want to change your password? You will need to use the new password for future logins.', 'Clinic Code', 'Enter clinic code', 'Valid clinic code', 'Confirm Clinic Change', 'Are you sure you want to change your clinic to:', 'Confirm Change', 'Your Clinic Request has been Accepted!', 'Close', 'Error', 'Please enter your email address.', 'Please enter a valid email address.', 'Email already exists. Please choose a different email.', 'Error validating email. Please try again.', 'Please wait for email validation to complete.', 'Are you sure you want to sign out?', 'Password must be at least 8 characters', 'Must contain at least one capital letter', 'Must contain at least one number', 'Must contain at least one special character', 'Please enter your current password.', 'Please enter a new password.', 'Password must be at least 8 characters long.', 'Password must contain at least one capital letter.', 'Password must contain at least one number.', 'Password must contain at least one special character.', 'New passwords do not match.', 'Please enter a clinic code.', 'Please enter a valid clinic code.', 'Invalid clinic code', 'Please enter a valid email address', 'Email already exists', 'Error validating email'];

    const {
        state: {details, clinic, canDisconnect, selectedProfilePicture},
        getUser,
        getDentalClinic,
        checkCanDisconnect,
        setProfilePicture,
        updateUser,
        changePassword,
        updateClinic
    } = useContext(UserContext);
    const {signout} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showPasswordConfirmModal, setShowPasswordConfirmModal] = useState(false);
    const [showClinicModal, setShowClinicModal] = useState(false);
    const [showClinicConfirmModal, setShowClinicConfirmModal] = useState(false);
    const [showClinicSuccessModal, setShowClinicSuccessModal] = useState(false);
    const [emailStatus, setEmailStatus] = useState(null); // null | 'valid' | 'invalid' | 'exists' | 'invalid_format'
    const [clinicCodeStatus, setClinicCodeStatus] = useState(null); // null | 'valid' | 'invalid'
    const [clinicInfo, setClinicInfo] = useState(null);
    const [clinicCode, setClinicCode] = useState('');
    const [formData, setFormData] = useState({
        email: '', address: '', emergencyContactName: '', emergencyContactPhone: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '', newPassword: '', confirmPassword: ''
    });

    // New: list of items with timestamp/appointment info for display here
    /** @type {Array<{dataUrl:string, when?:string, appointmentId?:string}>} */
    const [xrayItems, setXrayItems] = useState([]);

//Short date format (DD/MM)
    const formatShortDay = (iso) => {
        if (!iso) return '';
        try {
            return new Date(iso).toLocaleDateString('en-NZ', {day: '2-digit', month: '2-digit'});
        } catch {
            return '';
        }
    };

// Fetch all appointments for this user by NHI (using your existing /Appointments/:nhi API)
    async function fetchAppointmentsByNhi(nhi, {limit = 100, skip = 0} = {}) {
        const {data} = await axiosApi.get(`/Appointments/${String(nhi).toUpperCase()}`, {
            params: {limit, skip},
        });
        return data?.items ?? [];
    }

// Fetch images & PDFs for all appointments, then merge and sort by time (newest first)
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                // need NHI；getUser() traged in  useFocusEffect
                if (!details?.nhi) return;

                // 1) Fetch all appointments for this NHI
                const appts = await fetchAppointmentsByNhi(details.nhi, {limit: 200});

                // 2) Fetch assets for each appointment in parallel
                const assetsList = await Promise.all(appts.map((a) => fetchAssetsForAppointment(a._id)
                    .then((assets) => ({appt: a, assets}))
                    .catch(() => ({appt: a, assets: {imagesBase64: [], pdfUrls: []}}))));
                //run test
                console.log('[assets] appt count =', assetsList.length);
                assetsList.slice(0, 3).forEach(({appt, assets}, i) => {
                    // Debug: sample logs
                    console.log(`[assets] #${i}`, {
                        appt: appt?._id,
                        pdfUrls: Array.isArray(assets?.pdfUrls) ? assets.pdfUrls.length : 'N/A',
                        pdfItems: Array.isArray(assets?.pdfItems) ? assets.pdfItems.length : 'N/A',
                        imagesBase64: Array.isArray(assets?.imagesBase64) ? assets.imagesBase64.length : 'N/A',
                    });
                });
                // 3) Merge into: xrayItems (with time) + xrayImages (string[]) + pdfItems
                const mergedItems = [];
                const imagesStrList = [];
                const pdfs = [];


                for (const {appt, assets} of assetsList) {
                    const when = appt?.startAt || appt?.createdAt || null;
                    // Images
                    const imgs = Array.isArray(assets?.imagesBase64) ? assets.imagesBase64 : [];
                    imgs.forEach((s, idx) => {
                        // Normalize into a universally recognized data URL
                        const dataUrl = typeof s === 'string' && s.startsWith('data:') ? s.replace(/^data:image\/\*;/, 'data:image/png;') : `data:image/png;base64,${s}`;

                        mergedItems.push({
                            dataUrl,
                            when: when ? new Date(when).toISOString() : undefined,
                            appointmentId: appt?._id,
                            idx, // Keep index so  can dedupe later via id+idx if needed
                        });

                        imagesStrList.push(dataUrl);
                    });


                    // ===== PDFs  =====
                    const urls = Array.isArray(assets?.pdfUrls) ? assets.pdfUrls : [];
                    const base64s = Array.isArray(assets?.pdfBase64) ? assets.pdfBase64 : [];
                    const structured = Array.isArray(assets?.pdfItems) ? assets.pdfItems : [];
                    console.log('[PDF Items - structured]', structured);

                    //0) use structure
                    for (const it of structured) {
                        if (typeof it?.url === 'string' && it.url) {
                            pdfs.push({
                                source: 'url',
                                value: it.url,
                                when: it.when ? new Date(it.when).toISOString() : (when ? new Date(when).toISOString() : undefined),
                                name: it.name || tryInferName(it.url),
                                category: it.category,
                            });
                        }
                    }
                    // 1) URL
                    for (const u of urls) {
                        if (typeof u === 'string' && u) {
                            pdfs.push({
                                source: 'url',
                                value: u,
                                when: when ? new Date(when).toISOString() : undefined,
                                name: tryInferName(u),
                            });
                        }
                    }

                    // 2) base64 / dataUrl
                    for (const b of base64s) {
                        if (!b || typeof b !== 'string') continue;
                        if (b.startsWith('data:application/pdf;base64,')) {
                            pdfs.push({
                                source: 'dataUrl', value: b, when: when ? new Date(when).toISOString() : undefined,
                            });
                        } else {
                            pdfs.push({
                                source: 'base64', value: b, when: when ? new Date(when).toISOString() : undefined,
                            });
                        }
                    }
                    // ===== PDF ends =====
                }


                // Only sort (newest first), do not dedupe images
                const orderedItems = mergedItems.sort((a, b) => new Date(b.when || 0).getTime() - new Date(a.when || 0).getTime());
                const orderedImages = imagesStrList;

                // PDFs can still be deduped by (source|value)
                //const orderedPdfs = Array.from(new Map(pdfs.map(it => [`${it.source}|${it.value}`, it])).values()).sort((a, b) => new Date(b.when || 0).getTime() - new Date(a.when || 0).getTime());
                const byKey = new Map();
                for (const it of pdfs) {
                    const key = `${it.source}|${it.value}`;
                    const existed = byKey.get(key);
                    if (!existed) {
                        byKey.set(key, it);
                    } else if (!existed.category && it.category) {

                        byKey.set(key, it);
                    }
                }
                const orderedPdfs = Array.from(byKey.values())
                    .sort((a, b) => new Date(b.when || 0) - new Date(a.when || 0));
                setPdfItems(orderedPdfs);
                if (!cancelled) {
                    setXrayItems(orderedItems);
                    setXrayImages(orderedImages);
                    setPdfItems(orderedPdfs);
                }

            } catch (e) {
                console.error('load user images failed:', e);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [details?.nhi]); // Wait for NHI to be ready


    useEffect(() => {
        // Force re-render when language changes
        setRefreshKey(prev => prev + 1);

        // Translate texts when language changes
        if (currentLanguage !== 'en') {
            translateAndCache(textsToTranslate);
        }
    }, [currentLanguage]);

    useEffect(() => {
        let cancelled = false;

        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                await getUser();
                await getDentalClinic();
                await checkCanDisconnect();
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetchUserData();
        return () => { cancelled = true; };
    }, []);

    // Live email validation effect
    useEffect(() => {
        const checkEmail = async () => {
            if (formData.email.trim() === '') {
                setEmailStatus(null);
                return;
            }

            // First check if email format is valid
            if (!formData.email.includes('@') || !formData.email.includes('.')) {
                setEmailStatus('invalid_format');
                return;
            }

            // Check if email is the same as current user's email
            if (details.email && formData.email.trim().toLowerCase() === details.email.toLowerCase()) {
                setEmailStatus('valid');
                return;
            }

            try {
                const response = await axiosApi.get(`/checkEmail/${formData.email.trim().toLowerCase()}`);
                if (response.data.exists) {
                    setEmailStatus('exists');
                } else {
                    setEmailStatus('valid');
                }
            } catch (err) {
                setEmailStatus('invalid');
            }
        };

        checkEmail();
    }, [formData.email, details.email]);

    // Live clinic code validation effect
    useEffect(() => {
        const checkClinicCode = async () => {
            if (clinicCode.trim() === '') {
                setClinicInfo(null);
                setClinicCodeStatus(null);
                return;
            }

            try {
                const response = await axiosApi.get(`/checkClinicCode/${clinicCode.trim()}`);
                if (response.data.valid) {
                    setClinicInfo(response.data);
                    setClinicCodeStatus('valid');
                } else {
                    setClinicInfo(null);
                    setClinicCodeStatus('invalid');
                }
            } catch (err) {
                setClinicInfo(null);
                setClinicCodeStatus('invalid');
            }
        };

        checkClinicCode();
    }, [clinicCode]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-NZ', {
            day: '2-digit', month: '2-digit', year: 'numeric',
        });
    };

    const getInitials = (firstname, lastname) => {
        if (!firstname && !lastname) return 'U';
        const first = firstname ? firstname.charAt(0).toUpperCase() : '';
        const last = lastname ? lastname.charAt(0).toUpperCase() : '';
        return first + last;
    };

    // Helper function to get email input style based on validation status
    const getEmailInputStyle = () => {
        if (emailStatus === 'valid') {
            return [styles.textInput, styles.validInput];
        } else if (emailStatus === 'exists' || emailStatus === 'invalid_format' || emailStatus === 'invalid') {
            return [styles.textInput, styles.invalidInput];
        }
        return styles.textInput;
    };

    // Helper function to get email error message
    const getEmailErrorMessage = () => {
        switch (emailStatus) {
            case 'invalid_format':
                return t('Please enter a valid email address');
            case 'exists':
                return t('Email already exists');
            case 'invalid':
                return t('Error validating email');
            default:
                return null;
        }
    };

    // Helper function to get clinic code input style based on validation status
    const getClinicCodeInputStyle = () => {
        if (clinicCodeStatus === 'valid') {
            return [styles.textInput, styles.validInput];
        } else if (clinicCodeStatus === 'invalid') {
            return [styles.textInput, styles.invalidInput];
        }
        return styles.textInput;
    };

    // Helper function to get clinic code error message
    const getClinicCodeErrorMessage = () => {
        if (clinicCodeStatus === 'invalid') {
            return t('Invalid clinic code');
        }
        return null;
    };

    // Helper functions for password validation
    const getPasswordValidationErrors = (password) => {
        const errors = [];

        if (password.length > 0 && password.length < 8) {
            errors.push(t('Password must be at least 8 characters'));
        }

        if (password.length > 0 && password === password.toLowerCase()) {
            errors.push(t('Must contain at least one capital letter'));
        }

        if (password.length > 0 && !/\d/.test(password)) {
            errors.push(t('Must contain at least one number'));
        }

        if (password.length > 0 && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
            errors.push(t('Must contain at least one special character'));
        }

        return errors;
    };

    const isPasswordValid = (password) => {
        return password.length >= 8 && password !== password.toLowerCase() && /\d/.test(password) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    };

    const handleUpdateDetails = () => {
        // Initialize form with current user details
        setFormData({
            email: details.email || '',
            address: details.address || '',
            emergencyContactName: details.emergencyContactName || '',
            emergencyContactPhone: details.emergencyContactPhone || ''
        });
        setEmailStatus(null); // Reset email status
        setShowUpdateModal(true);
    };

    const handleUpdateSubmit = () => {
        // Validate email before proceeding
        if (formData.email.trim() === '') {
            Alert.alert(t('Error'), t('Please enter your email address.'));
            return;
        }

        if (emailStatus === 'invalid_format') {
            Alert.alert(t('Error'), t('Please enter a valid email address.'));
            return;
        }

        if (emailStatus === 'exists') {
            Alert.alert(t('Error'), t('Email already exists. Please choose a different email.'));
            return;
        }

        if (emailStatus === 'invalid') {
            Alert.alert(t('Error'), t('Error validating email. Please try again.'));
            return;
        }

        if (emailStatus !== 'valid' && emailStatus !== null) {
            Alert.alert(t('Error'), t('Please wait for email validation to complete.'));
            return;
        }

        setShowUpdateModal(false);
        setShowConfirmModal(true);
    };

    const handleUpdateCancel = () => {
        setShowUpdateModal(false);
        // Reset form data
        setFormData({
            email: details.email || '',
            address: details.address || '',
            emergencyContactName: details.emergencyContactName || '',
            emergencyContactPhone: details.emergencyContactPhone || ''
        });
    };

    const handleConfirmSave = async () => {
        setShowConfirmModal(false);

        console.log('Saving form data:', formData);

        try {
            const result = await updateUser(formData);
            console.log('Update result:', result);

            if (result.success) {
                Alert.alert('Success', 'Your details have been updated successfully.', [{text: 'OK'}]);
            } else {
                Alert.alert('Error', result.error || 'Failed to update details. Please try again.', [{text: 'OK'}]);
            }
        } catch (error) {
            console.error('Error in handleConfirmSave:', error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again.', [{text: 'OK'}]);
        }
    };

    const handleConfirmDiscard = () => {
        setShowConfirmModal(false);
        // Reset form data to original values
        setFormData({
            email: details.email || '',
            address: details.address || '',
            emergencyContactName: details.emergencyContactName || '',
            emergencyContactPhone: details.emergencyContactPhone || ''
        });
    };

    const handleChangeClinic = () => {
        setClinicCode('');
        setClinicInfo(null);
        setClinicCodeStatus(null);
        setShowClinicModal(true);
    };

    const handleChangePassword = () => {
        setPasswordData({
            currentPassword: '', newPassword: '', confirmPassword: ''
        });
        setShowPasswordModal(true);
    };

    const handlePasswordSubmit = () => {
        // Validate password fields
        if (passwordData.currentPassword.trim() === '') {
            Alert.alert(t('Error'), t('Please enter your current password.'));
            return;
        }

        if (passwordData.newPassword.trim() === '') {
            Alert.alert(t('Error'), t('Please enter a new password.'));
            return;
        }

        if (passwordData.newPassword.length < 8) {
            Alert.alert(t('Error'), t('Password must be at least 8 characters long.'));
            return;
        }

        if (passwordData.newPassword === passwordData.newPassword.toLowerCase()) {
            Alert.alert(t('Error'), t('Password must contain at least one capital letter.'));
            return;
        }

        if (!/\d/.test(passwordData.newPassword)) {
            Alert.alert(t('Error'), t('Password must contain at least one number.'));
            return;
        }

        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(passwordData.newPassword)) {
            Alert.alert(t('Error'), t('Password must contain at least one special character.'));
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Alert.alert(t('Error'), t('New passwords do not match.'));
            return;
        }

        setShowPasswordModal(false);
        setShowPasswordConfirmModal(true);
    };

    const handlePasswordCancel = () => {
        setShowPasswordModal(false);
        setPasswordData({
            currentPassword: '', newPassword: '', confirmPassword: ''
        });
    };

    const handlePasswordConfirmSave = async () => {
        setShowPasswordConfirmModal(false);

        try {
            const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);

            if (result.success) {
                Alert.alert('Success', 'Your password has been changed successfully.', [{text: 'OK'}]);
                // Reset password data
                setPasswordData({
                    currentPassword: '', newPassword: '', confirmPassword: ''
                });
            } else {
                Alert.alert('Error', result.error || 'Failed to change password. Please try again.', [{text: 'OK'}]);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred. Please try again.', [{text: 'OK'}]);
        }
    };

    const handlePasswordConfirmDiscard = () => {
        setShowPasswordConfirmModal(false);
        // Reset password data
        setPasswordData({
            currentPassword: '', newPassword: '', confirmPassword: ''
        });
    };

    const handleClinicSubmit = () => {
        // Validate clinic code before proceeding
        if (clinicCode.trim() === '') {
            Alert.alert(t('Error'), t('Please enter a clinic code.'));
            return;
        }

        if (clinicCodeStatus !== 'valid') {
            Alert.alert(t('Error'), t('Please enter a valid clinic code.'));
            return;
        }

        setShowClinicModal(false);
        setShowClinicConfirmModal(true);
    };

    const handleClinicCancel = () => {
        setShowClinicModal(false);
        setClinicCode('');
        setClinicInfo(null);
        setClinicCodeStatus(null);
    };

    const handleClinicConfirmSave = async () => {
        setShowClinicConfirmModal(false);

        try {
            const result = await updateClinic(clinicInfo.id);

            if (result.success) {
                setShowClinicSuccessModal(true);
                // Reset clinic data
                setClinicCode('');
                setClinicInfo(null);
                setClinicCodeStatus(null);
            } else {
                Alert.alert('Error', result.error || 'Failed to update clinic. Please try again.', [{text: 'OK'}]);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred. Please try again.', [{text: 'OK'}]);
        }
    };

    const handleClinicConfirmDiscard = () => {
        setShowClinicConfirmModal(false);
        // Reset clinic data
        setClinicCode('');
        setClinicInfo(null);
        setClinicCodeStatus(null);
    };

    const handleClinicSuccessClose = () => {
        setShowClinicSuccessModal(false);
    };

    const handleChangeProfilePicture = () => {
        setShowProfileModal(true);
    };

    const handleProfilePictureSelect = (pictureIndex) => {
        setProfilePicture(pictureIndex);
        setShowProfileModal(false);
        console.log(`Profile picture ${pictureIndex + 1} selected`);
    };
    const openPdf = async (url) => {
        try {
            await WebBrowser.openBrowserAsync(url);
        } catch (e) {
            Alert.alert('Error', 'Failed to open document.');
        }
    };


    const handleDisconnectFromParent = () => {
        navigation.navigate('DisconnectChild');
    };

    const handleSignOut = () => {
        Alert.alert(t('Sign Out'), t('Are you sure you want to sign out?'), [{
            text: t('Cancel'), style: 'cancel',
        }, {
            text: t('Sign Out'), style: 'destructive', onPress: () => signout(),
        },]);
    };

    if (isLoading) {
        return (<SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </SafeAreaView>);
    }


    const accDocs = pdfItems.filter(p => p.category === 'acc');
    const invoiceDocs = pdfItems.filter(p => !p.category || p.category === 'invoice');

    console.log('[ACC] accDocs:', accDocs);

    return (<SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{t('Account Settings')}</Text>
                </View>

                {/* Profile Picture Section */}
                <View style={styles.profilePictureContainer}>
                    <View style={styles.profilePicture}>
                        {selectedProfilePicture !== null ? (<Image
                                source={profilePictures[selectedProfilePicture]}
                                style={styles.profileImage}
                            />) : (<Text style={styles.profileInitials}>
                                {getInitials(details.firstname, details.lastname)}
                            </Text>)}
                    </View>
                    <Text style={styles.profileName}>
                        {details.firstname && details.lastname ? `${details.firstname} ${details.lastname}` : t('User Name')}
                    </Text>
                    <TouchableOpacity
                        style={styles.changeProfileButton}
                        onPress={handleChangeProfilePicture}
                    >
                        <Text style={styles.changeProfileText}>{t('Change Profile Picture')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Profile Information Cards */}
                <View style={styles.infoSection}>
                    {/* Personal Information Card */}
                    <View style={styles.infoCard}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="person-outline" size={24} color="#516287"/>
                            <Text style={styles.cardTitle}>{t('Personal Information')}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{t('First Name')}</Text>
                            <Text style={styles.infoValue}>
                                {details.firstname || t('Not specified')}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{t('Last Name')}</Text>
                            <Text style={styles.infoValue}>
                                {details.lastname || t('Not specified')}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{t('Date of Birth')}</Text>
                            <Text style={styles.infoValue}>
                                {formatDate(details.dob)}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{t('Email')}</Text>
                            <Text style={styles.infoValue}>
                                {details.email || t('Not specified')}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{t('Address')}</Text>
                            <Text style={styles.infoValue}>
                                {details.address || t('None')}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{t('Emergency Contact Name')}</Text>
                            <Text style={styles.infoValue}>
                                {details.emergencyContactName || t('None')}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{t('Emergency Contact Phone')}</Text>
                            <Text style={styles.infoValue}>
                                {details.emergencyContactPhone || t('None')}
                            </Text>
                        </View>

                    </View>


                    {/* Medical Information Card */}
                    <View style={styles.infoCard}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="medical-outline" size={24} color="#516287"/>
                            <Text style={styles.cardTitle}>{t('Medical Information')}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{t('NHI Number')}</Text>
                            <Text style={styles.infoValue}>
                                {details.nhi || t('Not specified')}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{t('Dental Clinic')}</Text>
                            <Text style={styles.infoValue}>
                                {clinic?.name || t('Not specified')}
                            </Text>
                        </View>

                        {clinic?.address && (<View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>{t('Clinic Address')}</Text>
                                <Text style={styles.infoValue}>
                                    {clinic.address}
                                </Text>
                            </View>)}

                        {clinic?.phone && (<View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>{t('Clinic Phone')}</Text>
                                <Text style={styles.infoValue}>
                                    {clinic.phone}
                                </Text>
                            </View>)}
                    </View>

                    {/* Account Actions Card */}
                    <View style={styles.infoCard}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="settings-outline" size={24} color="#516287"/>
                            <Text style={styles.cardTitle}>{t('Account Settings')}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleUpdateDetails}
                        >
                            <Ionicons name="pencil-outline" size={20} color="#516287"/>
                            <Text style={styles.actionButtonText}>{t('Update Your Details')}</Text>
                            <Ionicons name="chevron-forward" size={20} color="#516287"/>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleChangeClinic}
                        >
                            <Ionicons name="business-outline" size={20} color="#516287"/>
                            <Text style={styles.actionButtonText}>{t('Change Clinic')}</Text>
                            <Ionicons name="chevron-forward" size={20} color="#516287"/>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleChangePassword}
                        >
                            <Ionicons name="lock-closed-outline" size={20} color="#516287"/>
                            <Text style={styles.actionButtonText}>{t('Change Your Password')}</Text>
                            <Ionicons name="chevron-forward" size={20} color="#516287"/>
                        </TouchableOpacity>

                        {canDisconnect && (<TouchableOpacity
                                style={[styles.actionButton, styles.disconnectButton]}
                                onPress={handleDisconnectFromParent}
                            >
                                <Ionicons name="unlink-outline" size={20} color="#DC3545"/>
                                <Text style={[styles.actionButtonText, styles.disconnectText]}>
                                    {t('Disconnect From Parent')}
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color="#DC3545"/>
                            </TouchableOpacity>)}
                    </View>
                </View>
                {/* X-ray Images */}
                <View style={styles.infoCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="image-outline" size={24} color="#516287"/>
                        <Text style={styles.cardTitle}>{t('My X-ray Images')}</Text>
                    </View>

                    {Array.isArray(xrayItems) && xrayItems.length > 0 ? (<FlatList
                            horizontal
                            data={xrayItems.slice(0, 8)} // review  first  8  images
                            keyExtractor={(_, idx) => String(idx)}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{paddingVertical: 8, paddingRight: 4}}
                            renderItem={({item}) => (<View style={{marginRight: 12, position: 'relative'}}>
                                    <Image
                                        source={{uri: item.dataUrl}}
                                        style={styles.xrayThumb /*  width/height/borderRadius */}
                                        resizeMode="cover"
                                    />
                                    {/* right bottom corner：DD/MM */}
                                    {item.when ? (<View style={{
                                            position: 'absolute',
                                            right: 4,
                                            bottom: 4,
                                            paddingHorizontal: 6,
                                            paddingVertical: 2,
                                            borderRadius: 6,
                                            backgroundColor: 'rgba(0,0,0,0.55)'
                                        }}>
                                            <Text style={{color: '#fff', fontSize: 10}}>
                                                {formatShortDay(item.when)}
                                            </Text>
                                        </View>) : null}
                                </View>)}
                        />) : (<Text style={styles.infoValue}>{t('None')}</Text>)}

                    <TouchableOpacity
                        style={[styles.actionButton, {marginTop: 8}]}
                        onPress={() => {
                            const imgs = (Array.isArray(xrayItems) ? xrayItems : [])
                                .map(x => normalizeDataUrl(x?.dataUrl || ''))
                                .filter(Boolean);

                            if (!imgs.length) return; // Double guard

                            console.log('[UserAccount] navigate -> images', {
                                count: imgs.length, sample: imgs[0]?.slice(0, 60),
                            });

                            navigation.navigate('images', {
                                images: imgs, imageIndex: 0,
                            });
                        }}
                        disabled={!xrayItems?.length}
                    >
                        <Ionicons name="expand-outline" size={20} color="#516287"/>
                        <Text style={styles.actionButtonText}>{t('View All')}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#516287"/>
                    </TouchableOpacity>
                </View>

                {/* My Documents (Invoices / Referrals) */}
                <View style={styles.infoCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="document-text-outline" size={24} color="#516287"/>
                        <Text style={styles.cardTitle}>{t('My Documents')}</Text>
                    </View>

                    {invoiceDocs?.length ? (invoiceDocs.map((doc, idx) => {
                        const whenStr = formatDocWhen(doc);
                        const baseName =
                            doc.name && doc.name !== 'raw' ? doc.name : t('Invoice/Referral');

                        const niceTitle = whenStr ? `${baseName} · ${whenStr}` : baseName;

                            const pdfParam = doc.source === 'url' ? doc.value : (doc.source === 'dataUrl' ? doc.value
                                : `data:application/pdf;base64,${doc.value}`); // raw base64
                            const key = `inv-${doc.source}|${doc.value}`;
                            return (
                                <TouchableOpacity
                                    key={key}
                                    style={styles.actionButton}
                                    onPress={() => navigation.navigate('invoice', { pdf: pdfParam, title:  niceTitle})}
                                >
                                    <Ionicons name="document-outline" size={20} color="#516287" />
                                    <Text style={styles.actionButtonText}>{niceTitle}</Text>
                                    <Ionicons name="open-outline" size={20} color="#516287" />
                                </TouchableOpacity>
                            );
                        })
                    ) : (
                        <Text style={styles.infoValue}>{t('None')}</Text>)}


                </View>

                {/* ACC Documents */}
                <View style={styles.infoCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="shield-checkmark-outline" size={24} color="#516287"/>
                        <Text style={styles.cardTitle}>ACC Documents</Text>
                    </View>

                    {accDocs?.length ? (accDocs.map((doc, idx) => {
                        const whenStr = formatDocWhen(doc);
                        const baseName = doc.name || `ACC Document #${idx + 1}`;
                        const title = whenStr ? `${baseName} · ${whenStr}` : baseName;

                        const pdfParam = doc.source === 'url'
                            ? doc.value
                            : (doc.source === 'dataUrl' ? doc.value : `data:application/pdf;base64,${doc.value}`);
                        const key = `acc-${doc.source}|${doc.value}`;
                        return (
                            <TouchableOpacity
                                key={key}
                                style={styles.actionButton}
                                onPress={() => navigation.navigate('invoice', { pdf: pdfParam, title })}
                            >
                                <Ionicons name="document-outline" size={20} color="#516287"/>
                                <Text style={styles.actionButtonText}>{title}</Text>
                                <Ionicons name="open-outline" size={20} color="#516287"/>
                            </TouchableOpacity>
                        );
                    })) : (<Text style={styles.infoValue}>{t('None')}</Text>)}
                </View>


                {/* Sign Out Button */}
                <View style={styles.signOutSection}>
                    <TouchableOpacity
                        style={styles.signOutButton}
                        onPress={handleSignOut}
                    >
                        <Ionicons name="log-out-outline" size={24} color="#DC3545"/>
                        <Text style={styles.signOutText}>{t('Sign Out')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Profile Picture Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showProfileModal}
                onRequestClose={() => setShowProfileModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('Choose Profile Picture')}</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowProfileModal(false)}
                            >
                                <Ionicons name="close" size={24} color="#333333"/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.profileGrid}>
                            {profilePictures.map((picture, index) => (<TouchableOpacity
                                    key={index}
                                    style={[styles.profileOption, selectedProfilePicture === index && styles.selectedProfileOption]}
                                    onPress={() => handleProfilePictureSelect(index)}
                                >
                                    <Image source={picture} style={styles.profileOptionImage}/>
                                    {selectedProfilePicture === index && (<View style={styles.selectedOverlay}>
                                            <Ionicons name="checkmark-circle" size={24} color="#516287"/>
                                        </View>)}
                                </TouchableOpacity>))}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Update Details Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showUpdateModal}
                onRequestClose={handleUpdateCancel}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.updateModalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('Update Your Details')}</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={handleUpdateCancel}
                            >
                                <Ionicons name="close" size={24} color="#333333"/>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>{t('Email')}</Text>
                                <TextInput
                                    style={getEmailInputStyle()}
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({...formData, email: text})}
                                    placeholder={t('Enter your email')}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                {getEmailErrorMessage() && (
                                    <Text style={styles.errorText}>{getEmailErrorMessage()}</Text>)}
                                {emailStatus === 'valid' && formData.email.trim() !== '' && (
                                    <Text style={styles.successText}>✓ {t('Email is available')}</Text>)}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>{t('Address')}</Text>
                                <TextInput
                                    style={[styles.textInput, styles.multilineInput]}
                                    value={formData.address}
                                    onChangeText={(text) => setFormData({...formData, address: text})}
                                    placeholder={t('Enter your address')}
                                    multiline={true}
                                    numberOfLines={3}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>{t('Emergency Contact Name')}</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={formData.emergencyContactName}
                                    onChangeText={(text) => setFormData({...formData, emergencyContactName: text})}
                                    placeholder={t('Enter emergency contact name')}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>{t('Emergency Contact Phone')}</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={formData.emergencyContactPhone}
                                    onChangeText={(text) => setFormData({...formData, emergencyContactPhone: text})}
                                    placeholder={t('Enter emergency contact phone')}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </ScrollView>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={handleUpdateCancel}
                            >
                                <Text style={styles.cancelButtonText}>{t('Cancel')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={handleUpdateSubmit}
                            >
                                <Text style={styles.submitButtonText}>{t('Submit')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showConfirmModal}
                onRequestClose={() => setShowConfirmModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmModalContent}>
                        <View style={styles.confirmHeader}>
                            <Ionicons name="checkmark-circle-outline" size={48} color="#516287"/>
                            <Text style={styles.confirmTitle}>{t('Confirm Changes')}</Text>
                            <Text style={styles.confirmMessage}>
                                {t('Are you sure you want to save these changes to your profile?')}
                            </Text>
                        </View>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.discardButton]}
                                onPress={handleConfirmDiscard}
                            >
                                <Text style={styles.discardButtonText}>{t('Discard Changes')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleConfirmSave}
                            >
                                <Text style={styles.saveButtonText}>{t('Save Changes')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Change Password Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showPasswordModal}
                onRequestClose={handlePasswordCancel}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.updateModalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('Change Password')}</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={handlePasswordCancel}
                            >
                                <Ionicons name="close" size={24} color="#333333"/>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>{t('Current Password')}</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={passwordData.currentPassword}
                                    onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                                    placeholder={t('Enter your current password')}
                                    secureTextEntry={true}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>{t('New Password')}</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={passwordData.newPassword}
                                    onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                                    placeholder={t('Enter your new password')}
                                    secureTextEntry={true}
                                />
                                {getPasswordValidationErrors(passwordData.newPassword).map((error, index) => (
                                    <Text key={index} style={styles.errorText}>{error}</Text>))}
                                {passwordData.newPassword.length > 0 && isPasswordValid(passwordData.newPassword) && (
                                    <Text style={styles.successText}>✓ {t('Password meets all requirements')}</Text>)}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>{t('Confirm New Password')}</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={passwordData.confirmPassword}
                                    onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
                                    placeholder={t('Confirm your new password')}
                                    secureTextEntry={true}
                                />
                                {passwordData.confirmPassword.length > 0 && passwordData.newPassword !== passwordData.confirmPassword && (
                                    <Text style={styles.errorText}>{t('Passwords do not match')}</Text>)}
                                {passwordData.confirmPassword.length > 0 && passwordData.newPassword === passwordData.confirmPassword && isPasswordValid(passwordData.newPassword) && (
                                    <Text style={styles.successText}>✓ {t('Passwords match')}</Text>)}
                            </View>
                        </ScrollView>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={handlePasswordCancel}
                            >
                                <Text style={styles.cancelButtonText}>{t('Cancel')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={handlePasswordSubmit}
                            >
                                <Text style={styles.submitButtonText}>{t('Change Password')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Password Change Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showPasswordConfirmModal}
                onRequestClose={() => setShowPasswordConfirmModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmModalContent}>
                        <View style={styles.confirmHeader}>
                            <Ionicons name="lock-closed-outline" size={48} color="#516287"/>
                            <Text style={styles.confirmTitle}>{t('Confirm Password Change')}</Text>
                            <Text style={styles.confirmMessage}>
                                {t('Are you sure you want to change your password? You will need to use the new password for future logins.')}
                            </Text>
                        </View>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.discardButton]}
                                onPress={handlePasswordConfirmDiscard}
                            >
                                <Text style={styles.discardButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handlePasswordConfirmSave}
                            >
                                <Text style={styles.saveButtonText}>Change Password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Change Clinic Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showClinicModal}
                onRequestClose={handleClinicCancel}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.updateModalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('Change Clinic')}</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={handleClinicCancel}
                            >
                                <Ionicons name="close" size={24} color="#333333"/>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>{t('Clinic Code')}</Text>
                                <TextInput
                                    style={getClinicCodeInputStyle()}
                                    value={clinicCode}
                                    onChangeText={setClinicCode}
                                    placeholder={t('Enter clinic code')}
                                    autoCapitalize="characters"
                                />
                                {getClinicCodeErrorMessage() && (
                                    <Text style={styles.errorText}>{getClinicCodeErrorMessage()}</Text>)}
                                {clinicCodeStatus === 'valid' && clinicInfo && (
                                    <View style={styles.clinicInfoContainer}>
                                        <Text style={styles.successText}>✓ {t('Valid clinic code')}</Text>
                                        <Text style={styles.clinicInfoTitle}>{clinicInfo.name}</Text>
                                        {clinicInfo.address && (
                                            <Text style={styles.clinicInfoText}>{clinicInfo.address}</Text>)}
                                        {clinicInfo.phone && (
                                            <Text style={styles.clinicInfoText}>{clinicInfo.phone}</Text>)}
                                    </View>)}
                            </View>
                        </ScrollView>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={handleClinicCancel}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={handleClinicSubmit}
                            >
                                <Text style={styles.submitButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Clinic Change Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showClinicConfirmModal}
                onRequestClose={() => setShowClinicConfirmModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmModalContent}>
                        <View style={styles.confirmHeader}>
                            <Ionicons name="business-outline" size={48} color="#516287"/>
                            <Text style={styles.confirmTitle}>{t('Confirm Clinic Change')}</Text>
                            <Text style={styles.confirmMessage}>
                                {t('Are you sure you want to change your clinic to:')}
                            </Text>
                            {clinicInfo && (<View style={styles.clinicConfirmInfo}>
                                    <Text style={styles.clinicConfirmName}>{clinicInfo.name}</Text>
                                    {clinicInfo.address && (
                                        <Text style={styles.clinicConfirmText}>{clinicInfo.address}</Text>)}
                                </View>)}
                        </View>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.discardButton]}
                                onPress={handleClinicConfirmDiscard}
                            >
                                <Text style={styles.discardButtonText}>{t('Cancel')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleClinicConfirmSave}
                            >
                                <Text style={styles.saveButtonText}>{t('Confirm Change')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Clinic Change Success Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showClinicSuccessModal}
                onRequestClose={() => setShowClinicSuccessModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.successModalContent}>
                        <View style={styles.successHeader}>
                            <Image
                                source={require('../../../assets/confirm_toothmates.png')}
                                style={styles.successImage}
                                resizeMode="contain"
                            />
                            <Text style={styles.successTitle}>{t('Your Clinic Request has been Accepted!')}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.successCloseButton}
                            onPress={handleClinicSuccessClose}
                        >
                            <Text style={styles.successCloseText}>{t('Close')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>);
};

export default UserAccountScreen;
