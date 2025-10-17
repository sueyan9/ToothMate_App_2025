// UserAccountScreen.js
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ADDED: for parental code + active profile tracking
import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {
  fetchAssetsForAppointment
} from '../../api/appointments';
import axiosApi from '../../api/axios';
import ResetButton from '../../components/ResetButton/index';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
import { Context as ClinicContext } from '../../context/ClinicContext/ClinicContext';
import { useTranslation } from '../../context/TranslationContext/useTranslation';
import { Context as UserContext } from '../../context/UserContext/UserContext';
import styles from './styles';
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
// Import profile pictures
const profilePictures = [
  require('../../../assets/profile pictures/p0.png'),
  require('../../../assets/profile pictures/p1.png'),
  require('../../../assets/profile pictures/p2.png'),
  require('../../../assets/profile pictures/p3.png'),
  require('../../../assets/profile pictures/p4.png'),
  require('../../../assets/profile pictures/p5.png'),
  require('../../../assets/profile pictures/p6.png'),
  require('../../../assets/profile pictures/p7.png'),
  require('../../../assets/profile pictures/p8.png'),
];
//Collapsible components
const Collapsible = ({
    title,
    icon = 'chevron-forward',
    count,
    defaultOpen = false,
    children,
  }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
      <View style={styles.infoCard}>
        <TouchableOpacity
            onPress={() => setOpen(o => !o)}
            style={[styles.cardHeader, { alignItems: 'center' }]}
            accessibilityRole="button"
            accessibilityLabel={`${title}, ${open ? 'collapse' : 'expand'}`}
        >
          <Ionicons name={icon} size={24} color="#516287" />
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={{ flex: 1 }} />
          {count !== undefined && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{count}</Text>
            </View>
          )}
          <Ionicons
              name={open ? 'chevron-up' : 'chevron-down'}
              size={22}
              color="#516287"
              style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>

        {open ? <View style={{ marginTop: 8 }}>{children}</View> : null}
      </View>
  );
};

const UserAccountScreen = ({ navigation }) => {
  // Translation hook
  const { t, translateAndCache, currentLanguage } = useTranslation();

  // State to force re-render on language change
  const [refreshKey, setRefreshKey] = useState(0);
  const [xrayImages, setXrayImages] = useState([]);    // base64[]
  const [pdfItems, setPdfItems] = useState([]);
  // Define texts to translate
  const textsToTranslate = [
    'Account Settings',
    'User Name',
    'Change Profile Picture',
    'Switch Profile',
    'Personal Information',
    'First Name',
    'Last Name',
    'Date of Birth',
    'Email',
    'Address',
    'Emergency Contact Name',
    'Emergency Contact Phone',
    'Medical Information',
    'Insurance Information',
    'Insurance Provider',
    'Insurance Number',
    'NHI Number',
    'Dental Clinic',
    'Clinic Address',
    'Clinic Phone',
    'Update Your Details',
    'Change Clinic',
    'Change Your Password',
    'Set Parental Control Code',
    'Change Parental Control Code',
    'Enter 4-digit parental control code',
    'Confirm Code',
    'Set Code',
    'Success',
    'Parental control code saved successfully!',
    'Error',
    'Codes do not match.',
    'Code must be 4 digits.',
    'Disconnect From Parent',
    'Sign Out',
    'Not specified',
    'None',
    'Choose Profile Picture',
    'Enter your email',
    'Enter your address',
    'Enter emergency contact name',
    'Enter emergency contact phone',
    'Email is available',
    'Cancel',
    'Submit',
    'Confirm Changes',
    'Are you sure you want to save these changes to your profile?',
    'Discard Changes',
    'Save Changes',
    'Change Password',
    'Current Password',
    'New Password',
    'Confirm New Password',
    'Enter your current password',
    'Enter your new password',
    'Confirm your new password',
    'Password meets all requirements',
    'Passwords do not match',
    'Passwords match',
    'Confirm Password Change',
    'Are you sure you want to change your password? You will need to use the new password for future logins.',
    'Clinic Code',
    'Enter clinic code',
    'Valid clinic code',
    'view all clinics',
    'Confirm Clinic Change',
    'Are you sure you want to change your clinic to:',
    'Confirm Change',
    'Your Clinic Request has been Accepted!',
    'Close',
    'Error',
    'Please enter your email address.',
    'Please enter a valid email address.',
    'Email already exists. Please choose a different email.',
    'Error validating email. Please try again.',
    'Please wait for email validation to complete.',
    'Are you sure you want to sign out?',
    'Password must be at least 8 characters',
    'Must contain at least one capital letter',
    'Must contain at least one number',
    'Must contain at least one special character',
    'Please enter your current password.',
    'Please enter a new password.',
    'Password must be at least 8 characters long.',
    'Password must contain at least one capital letter.',
    'Password must contain at least one number.',
    'Password must contain at least one special character.',
    'New passwords do not match.',
    'Please enter a clinic code.',
    'Please enter a valid clinic code.',
    'Invalid clinic code',
    'No clinics found matching',
    'Please enter a valid email address',
    'Email already exists',
    'Error validating email',
    'We value your privacy. With your permission, we may share your personal and medical information with the next dental clinic to ensure continuity of your care.',
    'Agree',
    'Disagree',
    'By agreeing, you consent to your personal and medical records being securely shared with the new clinic. This ensures that dental practitioners at the new clinic are informed of your past treatments and procedures, supporting continuity of your care.',
    'By disagreeing, you understand that the new clinic will not be provided with your personal or medical records. As a result, dental practitioners at the new clinic will not have knowledge of your past treatments or procedures.',
      'You are already registered with this clinic', 'Agree', 'Disagree', 'Confirm', 'We value your privacy. With your permission, we may share your personal and medical information with the next dental clinic to ensure continuity of your care.', 'By agreeing, you consent to your personal and medical records being securely shared with the new clinic. This ensures that dental practitioners at the new clinic are informed of your past treatments and procedures, supporting continuity of your care.', 'By disagreeing, you understand that the new clinic will not be provided with your personal or medical records. As a result, dental practitioners at the new clinic will not have knowledge of your past treatments or procedures.',


  ];

const {
    state: { details, childDetails, clinic, canDisconnect, selectedProfilePicture, currentAccountType },
    getUser,
    getChild,
    getDentalClinic,
    checkCanDisconnect,
    setProfilePicture,
    updateUser,
    changePassword,
    updateClinic,
    setCurrentAccount, // ADDED
  } = useContext(UserContext);

  const { signout } = useContext(AuthContext);
  const { state: clinicState, getAllClinics } = useContext(ClinicContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false); // For profile picture selection
  const [showProfileSwitchModal, setShowProfileSwitchModal] = useState(false); // For profile switching
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
  const [privacyConsent, setPrivacyConsent] = useState(null);
  const [shouldReopenClinicModal, setShouldReopenClinicModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
   // null | 'agree' | 'disagree'
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

  // ADDED: parental control code state
  const [isParentalCodeSet, setIsParentalCodeSet] = useState(false);
  const [showParentalModal, setShowParentalModal] = useState(false);
  const [parentalCode, setParentalCode] = useState('');
  const [confirmParentalCode, setConfirmParentalCode] = useState('');

  useEffect(() => {
    // Force re-render when language changes
    setRefreshKey(prev => prev + 1);
    // Translate texts when language changes
    if (currentLanguage !== 'en') {
      translateAndCache(textsToTranslate);
    }
    // ADDED: check existing parental code on language change/first mount
    (async () => {
      try {
        const code = await AsyncStorage.getItem('profileSwitchCode');
        setIsParentalCodeSet(!!code);
      } catch (e) {
        console.error('Error reading parental code from storage:', e);
      }
    })();
  }, [currentLanguage]);

    useEffect(() => {
        let cancelled = false;

        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                await getUser();
                await getChild();
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



  // Load clinics when clinic modal opens
  useEffect(() => {
    if (showClinicModal) {
      getAllClinics();
    }
  }, [showClinicModal]);

  // Reopen clinic modal when returning from LocationFinder
  useFocusEffect(
    React.useCallback(() => {
      if (shouldReopenClinicModal) {
        setShowClinicModal(true);
        setShouldReopenClinicModal(false);
      }
    }, [shouldReopenClinicModal])
  );

  // Filter clinics based on clinic code input (same logic as LocationFinder)
  const searchedAndFilteredClinics = (clinicState || []).filter(item => {
    if (clinicCode === '') return false; // Don't show anything when empty
    
    const searchLower = clinicCode.toLowerCase();
    // Only search by clinic code (not name/address like LocationFinder)
    return (item.code && item.code.toLowerCase().includes(searchLower));
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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
    return password.length >= 8 &&
           password !== password.toLowerCase() &&
           /\d/.test(password) &&
           /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
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
        Alert.alert(
          'Success',
          'Your details have been updated successfully.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          result.error || 'Failed to update details. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error in handleConfirmSave:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
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

  const handleSelectClinic = (selectedClinic) => {
    setClinicCode(selectedClinic.code);
    setClinicInfo(selectedClinic);
    // Determine clinic status
    if (clinic && clinic.code === selectedClinic.code) {
      setClinicCodeStatus('same-clinic');
    } else {
      setClinicCodeStatus('valid');
    }
  };

  const handleChangePassword = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordModal(true);
  };

  const handleNotificationSettings = () => {
    navigation.navigate('NotificationSettings');
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
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePasswordConfirmSave = async () => {
    setShowPasswordConfirmModal(false);
    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (result.success) {
        Alert.alert(
          'Success',
          'Your password has been changed successfully.',
          [{ text: 'OK' }]
        );
        // Reset password data
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        Alert.alert(
          'Error',
          result.error || 'Failed to change password. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePasswordConfirmDiscard = () => {
    setShowPasswordConfirmModal(false);
    // Reset password data
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleClinicSubmit = () => {
    // Validate clinic code before proceeding
    if (clinicCode.trim() === '') {
      Alert.alert(t('Error'), t('Please enter a clinic code.'));
      return;
    }
    
    // Find the clinic in the loaded clinics
    const selectedClinic = clinicState?.find(c => 
      c.code && c.code.toLowerCase() === clinicCode.trim().toLowerCase()
    );
    
    if (!selectedClinic) {
      Alert.alert(t('Error'), t('Please enter a valid clinic code.'));
      return;
    }
    
    // Check if it's the same clinic as current
    if (clinic && clinic.code === selectedClinic.code) {
      Alert.alert(t('Error'), t('You are already registered with this clinic'));
      return;
    }
    
    // Set clinic info and proceed
    setClinicInfo(selectedClinic);
    setClinicCodeStatus('valid');
    setShowClinicModal(false);
    setShowClinicConfirmModal(true);
  };

  const handleClinicCodeChange = (text) => {
    setClinicCode(text);
    // Clear validation states when user types new text
    if (clinicCodeStatus === 'valid' || clinicCodeStatus === 'same-clinic') {
      setClinicCodeStatus(null);
      setClinicInfo(null);
    }
  };

  const handleViewAllClinics = () => {
    // Close the current modal, set flag to reopen it when returning, and navigate to LocationFinder
    setShowClinicModal(false);
    setShouldReopenClinicModal(true);
    navigation.navigate('LocationFinder');
  };

  const handleClinicCancel = () => {
    setShowClinicModal(false);
    setClinicCode('');
    setClinicInfo(null);
    setClinicCodeStatus(null);
    setPrivacyConsent(null);
    setShouldReopenClinicModal(false);
  };

  const handleClinicConfirmSave = async () => {
    setShowClinicConfirmModal(false);
    try {
      // Use _id if id is not available (MongoDB typically uses _id)
      const clinicId = clinicInfo.id || clinicInfo._id;
      console.log('Updating clinic with ID:', clinicId, 'Full clinic info:', clinicInfo, 'Privacy consent:', privacyConsent);
      const result = await updateClinic(clinicId, privacyConsent);
      console.log('Update clinic result:', result);
      
      if (result.success) {
        setShowClinicSuccessModal(true);
        // Reset clinic data
        setClinicCode('');
        setClinicInfo(null);
        setClinicCodeStatus(null);
        setPrivacyConsent(null);
        
        // Refresh user data to show updated clinic
        await getUser();
        await getDentalClinic();
      } else {
        Alert.alert(
          'Error',
          result.error || 'Failed to update clinic. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error updating clinic:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleClinicConfirmDiscard = () => {
    setShowClinicConfirmModal(false);
    // Reset clinic data
    setClinicCode('');
    setClinicInfo(null);
    setClinicCodeStatus(null);
    setPrivacyConsent(null);
  };

  const handleClinicSuccessClose = () => {
    setShowClinicSuccessModal(false);
  };

  const handleChangeProfilePicture = () => {
    setShowProfileModal(true);
  };

  const handleSwitchProfiles = () => {
    setShowProfileSwitchModal(true);
  };

  const handleProfilePictureSelect = (pictureIndex) => {
    setProfilePicture(pictureIndex, details._id);
    setShowProfileModal(false);
    console.log(`Profile picture ${pictureIndex + 1} selected`);
  };

  // Instagram-style profile switching handler
  const handleProfileSwitch = (childId) => {
    if (childId === 'current') {
      setShowProfileSwitchModal(false);
      return;
    }
    
    const selectedChild = childDetails.find(c => (c._id || c.id) === childId);

    if (!selectedChild) {
      Alert.alert('Error', 'Child account not found');
      return;
    }
    
    Alert.alert(
      'Switch Profile',
      `Switch to ${selectedChild.firstname} ${selectedChild.lastname}'s account?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Switch',
          onPress: async () => {
            setShowProfileSwitchModal(false);
            
            // Update the current account in context
            await setCurrentAccount(childId, selectedChild);

            // Store active child profile meta
            try {
              const currentId = await AsyncStorage.getItem('id');
              if (currentId) {
                await AsyncStorage.setItem('parentId', currentId);
              }

              await AsyncStorage.setItem('id', childId);
              await AsyncStorage.setItem('activeProfileName', `${selectedChild.firstname} ${selectedChild.lastname}`);
              await AsyncStorage.setItem('activeProfileFirstName', `${selectedChild.firstname}`);
              await AsyncStorage.setItem('activeProfileUsername', selectedChild.email || selectedChild.nhi || '');
              await AsyncStorage.setItem('activeProfilePictureIndex', String(selectedChild.profile_picture ?? -1));
              await AsyncStorage.setItem('currentAccountType', 'child');
              // Ensure parentId is available for returning
              
            } catch (e) {
              console.error('Error saving active child profile to storage:', e);
            }
            
            // Navigate to child flow
            navigation.reset({
              index: 0,
              routes: [{ name: 'childFlow' }],
            });
          }
        }
      ]
    );
  };

  const handleDisconnectFromParent = () => {
    navigation.navigate('DisconnectChild');
  };

  const handleSignOut = () => {
    Alert.alert(
      t('Sign Out'),
      t('Are you sure you want to sign out?'),
      [
        {
          text: t('Cancel'),
          style: 'cancel',
        },
        {
          text: t('Sign Out'),
          style: 'destructive',
          onPress: () => signout(),
        },
      ]
    );
  };

  // ADDED: parental code handlers
  const handleSetParentalControlCode = async () => {
    try {
      const code = await AsyncStorage.getItem('profileSwitchCode');
      setIsParentalCodeSet(!!code);
    } catch (e) {
      console.error('Error reading parental code:', e);
    }
    setParentalCode('');
    setConfirmParentalCode('');
    setShowParentalModal(true);
  };

  const handleParentalCodeCancel = () => {
    setShowParentalModal(false);
    setParentalCode('');
    setConfirmParentalCode('');
  };

  const handleParentalCodeSave = async () => {
    if (!/^\d{4}$/.test(parentalCode) || !/^\d{4}$/.test(confirmParentalCode)) {
      Alert.alert(t('Error'), t('Code must be 4 digits.'));
      return;
    }
    if (parentalCode !== confirmParentalCode) {
      Alert.alert(t('Error'), t('Codes do not match.'));
      return;
    }
    try {
      await AsyncStorage.setItem('profileSwitchCode', parentalCode);
      setIsParentalCodeSet(true);
      setShowParentalModal(false);
      Alert.alert(t('Success'), t('Parental control code saved successfully!'));
    } catch (e) {
      console.error('Error saving parental code:', e);
      Alert.alert(t('Error'), 'Unable to save parental code.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }
    const accDocs = pdfItems.filter(p => p.category === 'acc');
    const invoiceDocs = pdfItems.filter(p => !p.category || p.category === 'invoice');
    const referralDocs = pdfItems.filter(p => p.category === 'referral');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('Account Settings')}</Text>
        </View>

        {/* Profile Picture Section */}
        <View style={styles.profilePictureContainer}>
          <View style={styles.profilePicture}>
            {selectedProfilePicture !== null ? (
              <Image
                source={profilePictures[selectedProfilePicture]}
                style={styles.profileImage}
              />
            ) : (
              <Text style={styles.profileInitials}>
                {getInitials(details.firstname, details.lastname)}
              </Text>
            )}
          </View>
          <Text style={styles.profileName}>
            {details.firstname && details.lastname
              ? `${details.firstname} ${details.lastname}`
              : t('User Name')}
          </Text>
          <TouchableOpacity
            style={styles.changeProfileButton}
            onPress={handleChangeProfilePicture}
          >
            <Text style={styles.changeProfileText}>{t('Change Profile Picture')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.changeProfileButton}
            onPress={handleSwitchProfiles}
          >
            <Ionicons name="swap-horizontal-outline" size={16} color="#516287" />
            <Text style={styles.switchProfileText}>{t('Switch Profile')}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Information Cards */}
        <View style={styles.infoSection}>
          {/* Personal Information Card */}
          <Collapsible
            title={t('Personal Information')}
            icon="person-outline"
            defaultOpen={false}
          >
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
                {details.emergency_name || t('None')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('Emergency Contact Phone')}</Text>
              <Text style={styles.infoValue}>
                {details.emergency_phone || t('None')}
              </Text>
            </View>
          </Collapsible>
          {/* Medical Information Card */}
          <Collapsible
            title={t('Medical Information')}
            icon="medical-outline"
            defaultOpen={false}
          >
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
            {clinic?.address && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('Clinic Address')}</Text>
                <Text style={styles.infoValue}>
                  {clinic.address}
                </Text>
              </View>
            )}
            {clinic?.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('Clinic Phone')}</Text>
                <Text style={styles.infoValue}>
                  {clinic.phone}
                </Text>
              </View>
            )}
            {details.allergy && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('Known Allergies')}</Text>
                <Text style={styles.infoValue}>
                  {details.allergy || 'None'}
                </Text>
              </View>
            )}
          </Collapsible>

          {/* Insurance Information Card */}
          <Collapsible
            title={t('Insurance Information')}
            icon="heart-half-outline"
            defaultOpen={false}
          >
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('Insurance Provider')}</Text>
              <Text style={styles.infoValue}>
                {details.insurance || t('Not specified')}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('Insurance Number')}</Text>
              <Text style={styles.infoValue}>
                {details.insurance_number || t('Not specified')}
              </Text>
            </View>
          </Collapsible>


          {/* Account Settings Card */}
          <Collapsible
            title={t('Account Settings')}
            icon="settings-outline"
            defaultOpen={false}
          >
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleUpdateDetails}
            >
              <Ionicons name="pencil-outline" size={20} color="#516287" />
              <Text style={styles.actionButtonText}>{t('Update Your Details')}</Text>
              <Ionicons name="chevron-forward" size={20} color="#516287" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleChangeClinic}
            >
              <Ionicons name="business-outline" size={20} color="#516287" />
              <Text style={styles.actionButtonText}>{t('Request Clinic Change')}</Text>
              <Ionicons name="chevron-forward" size={20} color="#516287" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleChangePassword}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#516287" />
              <Text style={styles.actionButtonText}>{t('Change Your Password')}</Text>
              <Ionicons name="chevron-forward" size={20} color="#516287" />
            </TouchableOpacity>

            {/* ADDED: Set / Change Parental Control Code */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSetParentalControlCode}
            >
              <Ionicons name="key-outline" size={20} color="#516287" />
              <Text style={styles.actionButtonText}>
                {isParentalCodeSet ? t('Change Parental Control Code') : t('Set Parental Control Code')}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#516287" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleNotificationSettings}
            >
              <Ionicons name="notifications-outline" size={20} color="#516287" />
              <Text style={styles.actionButtonText}>{t('Notification Settings')}</Text>
              <Ionicons name="chevron-forward" size={20} color="#516287" />
            </TouchableOpacity>

            {canDisconnect && (
              <TouchableOpacity
                style={[styles.actionButton, styles.disconnectButton]}
                onPress={handleDisconnectFromParent}
              >
                <Ionicons name="unlink-outline" size={20} color="#DC3545" />
                <Text style={[styles.actionButtonText, styles.disconnectText]}>
                  {t('Disconnect From Parent')}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#DC3545" />
              </TouchableOpacity>
            )}
          </Collapsible>
        </View>
          {/* X-ray Images */}
          <Collapsible
              title={t('My X-ray Images')}
              icon="image-outline"
              count={Array.isArray(xrayItems) ? xrayItems.length : 0}
              defaultOpen={false}
          >
              {Array.isArray(xrayItems) && xrayItems.length > 0 ? (
                  <>
                      <FlatList
                          horizontal
                          data={xrayItems.slice(0, 8)} // review first 8 images
                          keyExtractor={(_, idx) => String(idx)}
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ paddingVertical: 8, paddingRight: 4 }}
                          renderItem={({ item }) => (
                              <View style={{ marginRight: 12, position: 'relative' }}>
                                  <Image
                                      source={{ uri: item.dataUrl }}
                                      style={styles.xrayThumb /* width/height/borderRadius */}
                                      resizeMode="cover"
                                  />
                                  {/* right bottom corner：DD/MM */}
                                  {item.when ? (
                                      <View
                                          style={{
                                              position: 'absolute',
                                              right: 4,
                                              bottom: 4,
                                              paddingHorizontal: 6,
                                              paddingVertical: 2,
                                              borderRadius: 6,
                                              backgroundColor: 'rgba(0,0,0,0.55)',
                                          }}
                                      >
                                          <Text style={{ color: '#fff', fontSize: 10 }}>{formatShortDay(item.when)}</Text>
                                      </View>
                                  ) : null}
                              </View>
                          )}
                      />

                      <TouchableOpacity
                          style={[styles.actionButton, { marginTop: 8 }]}
                          onPress={() => {
                              const imgs = (Array.isArray(xrayItems) ? xrayItems : [])
                                  .map(x => normalizeDataUrl(x?.dataUrl || ''))
                                  .filter(Boolean);

                              if (!imgs.length) return; // Double guard

                              console.log('[UserAccount] navigate -> images', {
                                  count: imgs.length,
                                  sample: imgs[0]?.slice(0, 60),
                              });

                              navigation.navigate('images', {
                                  images: imgs,
                                  imageIndex: 0,
                              });
                          }}
                          disabled={!xrayItems?.length}
                      >
                          <Ionicons name="expand-outline" size={20} color="#516287" />
                          <Text style={styles.actionButtonText}>{t('View All')}</Text>
                          <Ionicons name="chevron-forward" size={20} color="#516287" />
                      </TouchableOpacity>
                  </>
              ) : (
                  <Text style={styles.infoValue}>{t('None')}</Text>
              )}
          </Collapsible>


          {/* My Documents (Invoices ) */}
          <Collapsible
              title={t('My Invoices')}
              icon="document-text-outline"
              count={invoiceDocs.length}
              defaultOpen={false}
          >
              {invoiceDocs.length ? (
                  invoiceDocs.map((doc, idx) => {
                      const whenStr = formatDocWhen(doc);
                      const baseName = doc.name && doc.name !== 'raw' ? doc.name : t('Invoice/Referral');
                      const niceTitle = whenStr ? `${baseName} · ${whenStr}` : baseName;
                      const pdfParam = doc.source === 'url'
                          ? doc.value
                          : (doc.source === 'dataUrl' ? doc.value : `data:application/pdf;base64,${doc.value}`);
                      const key = `inv-${doc.source}|${doc.value}`;

                      return (
                          <TouchableOpacity
                              key={key}
                              style={styles.actionButton}
                              onPress={() => navigation.navigate('invoice', { pdf: pdfParam, title: niceTitle })}
                          >
                              <Ionicons name="document-outline" size={20} color="#516287" />
                              <Text style={styles.actionButtonText}>{niceTitle}</Text>
                              <Ionicons name="open-outline" size={20} color="#516287" />
                          </TouchableOpacity>
                      );
                  })
              ) : (
                  <Text style={styles.infoValue}>{t('None')}</Text>
              )}
          </Collapsible>

          {/* ACC Documents */}
          <Collapsible
              title="My ACC Documents"
              icon="shield-checkmark-outline"
              count={accDocs.length}
              defaultOpen={false}
          >
              {accDocs.length ? (
                  accDocs.map((doc, idx) => {
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
                              <Ionicons name="document-outline" size={20} color="#516287" />
                              <Text style={styles.actionButtonText}>{title}</Text>
                              <Ionicons name="open-outline" size={20} color="#516287" />
                          </TouchableOpacity>
                      );
                  })
              ) : (
                  <Text style={styles.infoValue}>{t('None')}</Text>
              )}
          </Collapsible>
          {/* ReferralDocs */}
          <Collapsible
              title={t('My Referrals')}
              icon="send-outline"
              count={referralDocs.length}
              defaultOpen={false}
          >
              {referralDocs.length ? (
                  referralDocs.map((doc, idx) => {
                      const whenStr = formatDocWhen(doc);
                      const baseName = doc.name || `Referral #${idx + 1}`;
                      const title = whenStr ? `${baseName} · ${whenStr}` : baseName;
                      const pdfParam = doc.source === 'url'
                          ? doc.value
                          : (doc.source === 'dataUrl' ? doc.value : `data:application/pdf;base64,${doc.value}`);
                      const key = `ref-${doc.source}|${doc.value}`;

                      return (
                          <TouchableOpacity
                              key={key}
                              style={styles.actionButton}
                              onPress={() => navigation.navigate('invoice', { pdf: pdfParam, title })}
                          >
                              <Ionicons name="document-outline" size={20} color="#516287" />
                              <Text style={styles.actionButtonText}>{title}</Text>
                              <Ionicons name="open-outline" size={20} color="#516287" />
                          </TouchableOpacity>
                      );
                  })
              ) : (
                  <Text style={styles.infoValue}>{t('None')}</Text>
              )}
          </Collapsible>


          {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={24} color="#DC3545" />
            <Text style={styles.signOutText}>{t('Sign Out')}</Text>
          </TouchableOpacity>

          <ResetButton/>
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
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileGrid}>
              {profilePictures.map((picture, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.profileOption,
                    selectedProfilePicture === index && styles.selectedProfileOption
                  ]}
                  onPress={() => handleProfilePictureSelect(index)}
                >
                  <Image source={picture} style={styles.profileOptionImage} />
                  {selectedProfilePicture === index && (
                    <View style={styles.selectedOverlay}>
                      <Ionicons name="checkmark-circle" size={24} color="#516287" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Instagram-Style Profile Switch Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showProfileSwitchModal}
        onRequestClose={() => setShowProfileSwitchModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileSwitchModal}>
            {/* Modal Header with Close Button */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowProfileSwitchModal(false)}
              >
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            {/* Current Account Section */}
            <View style={styles.currentAccountSection}>
              <TouchableOpacity 
                style={styles.currentAccountRow}
                onPress={() => handleProfileSwitch('current')}
              >
                <View style={styles.currentAccountInfo}>
                  <View style={styles.currentAccountAvatar}>
                    {selectedProfilePicture !== null ? (
                      <Image 
                        source={profilePictures[selectedProfilePicture]} 
                        style={styles.currentAccountImage} 
                      />
                    ) : (
                      <Text style={styles.currentAccountInitials}>
                        {getInitials(details.firstname, details.lastname)}
                      </Text>
                    )}
                  </View>
                  <View style={styles.currentAccountText}>
                    <Text style={styles.currentAccountName}>
                      {details.firstname && details.lastname ? 
                        `${details.firstname} ${details.lastname}` : 
                        'Your Account'
                      }
                    </Text>
                    <Text style={styles.currentAccountUsername}>
                      {details.email || 'user@email.com'}
                    </Text>
                  </View>
                </View>
                <View style={styles.checkmarkContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#3797F0" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Other Accounts Section */}
            <View style={styles.otherAccountsSection}>
              {childDetails && childDetails.length > 0 ? (
                childDetails.map((child) => (
                  <TouchableOpacity
                  key={child._id || child.id}
                  style={styles.accountRow}
                  onPress={() => handleProfileSwitch(child._id || child.id)}
                >
                  <View style={styles.accountInfo}>
                    <View style={styles.accountAvatar}>
                      {child.profile_picture !== null && child.profile_picture !== undefined ? (
                        <Image 
                          source={profilePictures[child.profile_picture]} 
                          style={styles.accountImage} 
                        />
                      ) : (
                      <Text style={styles.accountInitials}>
                        {getInitials(child.firstname, child.lastname)}
                      </Text> )}
                  </View>
                  <View style={styles.accountText}>
                    <Text style={styles.accountName}>
                      {child.firstname && child.lastname 
                        ? `${child.firstname} ${child.lastname}` 
                        : 'Child Account'}
                    </Text>
                    <Text style={styles.accountUsername}>
                      {child.email || child.nhi || 'Child'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
                ))) : (
                  <View style={styles.noChildrenContainer}>
                    <Text style={styles.noChildrenText}>No child accounts linked</Text>
                  </View>
                )}
            </View>

            {/* Add Account Section */}
            <View style={styles.addAccountSection}>
              <TouchableOpacity 
                style={styles.addAccountRow}
                onPress={() => {
                  setShowProfileSwitchModal(false);
                  // Handle add account logic
                  Alert.alert('Add Account', 'Add account functionality would go here');
                }}
              >
                <View style={styles.addAccountIcon}>
                  <Ionicons name="add" size={24} color="#000" />
                </View>
                <Text style={styles.addAccountText}>Add account</Text>
              </TouchableOpacity>
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
                <Ionicons name="close" size={24} color="#333333" />
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
                  <Text style={styles.errorText}>{getEmailErrorMessage()}</Text>
                )}
                {emailStatus === 'valid' && formData.email.trim() !== '' && (
                  <Text style={styles.successText}>✓ {t('Email is available')}</Text>
                )}
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
              <Ionicons name="checkmark-circle-outline" size={48} color="#516287" />
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
                <Ionicons name="close" size={24} color="#333333" />
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
                  <Text key={index} style={styles.errorText}>{error}</Text>
                ))}
                {passwordData.newPassword.length > 0 && isPasswordValid(passwordData.newPassword) && (
                  <Text style={styles.successText}>✓ {t('Password meets all requirements')}</Text>
                )}
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
                  <Text style={styles.errorText}>{t('Passwords do not match')}</Text>
                )}
                {passwordData.confirmPassword.length > 0 && passwordData.newPassword === passwordData.confirmPassword && isPasswordValid(passwordData.newPassword) && (
                  <Text style={styles.successText}>✓ {t('Passwords match')}</Text>
                )}
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
              <Ionicons name="lock-closed-outline" size={48} color="#516287" />
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
              <Text style={styles.modalTitle}>{t('Request Clinic Change')}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleClinicCancel}
              >
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <View style={styles.labelWithLink}>
                  <Text style={styles.inputLabel}>{t('Clinic Code')}</Text>
                  <TouchableOpacity onPress={handleViewAllClinics}>
                    <Text style={styles.linkText}>({t('view all clinics')})</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.textInput}
                  value={clinicCode}
                  onChangeText={handleClinicCodeChange}
                  placeholder={t('Enter clinic code')}
                  autoCapitalize="characters"
                />
                
                {/* Filtered Clinics List */}
                {clinicCode.trim().length > 0 && (
                  <View style={styles.clinicsListContainer}>
                    <Text style={{padding: 8, fontSize: 12, color: '#666'}}>
                      Found {searchedAndFilteredClinics.length} clinics
                    </Text>
                    {searchedAndFilteredClinics.length > 0 ? (
                      <ScrollView 
                        style={styles.clinicsList} 
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                      >
                        {searchedAndFilteredClinics.map((clinic) => (
                          <TouchableOpacity
                            key={clinic._id || clinic.id}
                            style={styles.clinicListItem}
                            onPress={() => handleSelectClinic(clinic)}
                          >
                            <View style={styles.clinicListContent}>
                              <Text style={styles.clinicListCode}>{clinic.code}</Text>
                              <Text style={styles.clinicListName}>{clinic.name}</Text>
                              {clinic.address && (
                                <Text style={styles.clinicListAddress}>{clinic.address}</Text>
                              )}
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    ) : (
                      <View style={styles.noResultsContainer}>
                        <Text style={styles.noResultsText}>
                          {t('No clinics found matching')} "{clinicCode}"
                        </Text>
                      </View>
                    )}
                  </View>
                )}
                
                {clinicCodeStatus === 'valid' && clinicInfo && clinicCode.trim().length > 0 && (
                  <View style={styles.clinicInfoContainer}>
                    <Text style={styles.successText}>✓ {t('Valid clinic code')}</Text>
                    <Text style={styles.clinicInfoTitle}>{clinicInfo.name}</Text>
                    {clinicInfo.address && (
                      <Text style={styles.clinicInfoText}>{clinicInfo.address}</Text>
                    )}
                    {clinicInfo.phone && (
                      <Text style={styles.clinicInfoText}>{clinicInfo.phone}</Text>
                    )}
                  </View>
                )}
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
              <Ionicons name="business-outline" size={48} color="#516287" />
              <Text style={styles.confirmTitle}>{t('Confirm Clinic Request')}</Text>
              <Text style={styles.confirmMessage}>
                {t('Are you sure you want to request a clinic change to:')}
              </Text>
              {clinicInfo && (
                <View style={styles.clinicConfirmInfo}>
                  <Text style={styles.clinicConfirmName}>{clinicInfo.name}</Text>
                  {clinicInfo.address && (
                    <Text style={styles.clinicConfirmText}>{clinicInfo.address}</Text>
                  )}
                </View>
              )}
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
              <Text style={styles.successTitle}>{t('Your Clinic Request has been Sent!')}</Text>
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

      {/* ADDED: Parental Control Code Modal */}
<Modal
  animationType="slide"
  transparent={true}
  visible={showParentalModal}
  onRequestClose={handleParentalCodeCancel}
>
  <View style={styles.modalOverlay}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={styles.accessCodeModalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {isParentalCodeSet
              ? t('Change Parental Control Code')
              : t('Set Parental Control Code')}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleParentalCodeCancel}
          >
            <Ionicons name="close" size={24} color="#333333" />
          </TouchableOpacity>
        </View>

        <View style={styles.accessCodeContent}>
          <Ionicons name="key-outline" size={48} color="#516287" />
          <Text style={styles.accessCodeMessage}>
            {t('Enter 4-digit parental control code')}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('Set Code')}</Text>
            <TextInput
              style={styles.textInput}
              value={parentalCode}
              onChangeText={setParentalCode}
              placeholder="****"
              keyboardType="number-pad"
              secureTextEntry={true}
              maxLength={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {t('Confirm Code')}
            </Text>
            <TextInput
              style={styles.textInput}
              value={confirmParentalCode}
              onChangeText={setConfirmParentalCode}
              placeholder="****"
              keyboardType="number-pad"
              secureTextEntry={true}
              maxLength={4}
            />
          </View>
        </View>

        <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={handleParentalCodeCancel}
          >
            <Text style={styles.cancelButtonText}>{t('Cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.submitButton]}
            onPress={handleParentalCodeSave}
          >
            <Text style={styles.submitButtonText}>{t('Submit')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  </View>
</Modal>


    </SafeAreaView>
  );
};

export default UserAccountScreen;