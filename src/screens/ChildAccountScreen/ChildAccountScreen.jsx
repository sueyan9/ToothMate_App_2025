import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
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
import { useTranslation } from '../../context/TranslationContext/useTranslation';
import { Context as UserContext } from '../../context/UserContext/UserContext';
import styles from './styles';

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

const ChildAccountScreen = ({ navigation }) => {
  const { t, translateAndCache, currentLanguage } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0);

  const textsToTranslate = [
    'Account Settings',
    'Change Profile Picture',
    'Back to Parent Profile',
    'Personal Information',
    'First Name',
    'Last Name',
    'Date of Birth',
    'Medical Information',
    'NHI Number',
    'Dental Clinic',
    'Clinic Address',
    'Clinic Phone',
    'Not specified',
    'Choose Profile Picture',
    'Enter Access Code',
    'Access Code',
    'Enter the access code to switch profiles',
    'Cancel',
    'Submit',
    'Error',
    'Incorrect access code',
    'No access code set',
    'Please ask your parent to set an access code first.',
  ];

  const {
    state: { details, clinic, selectedProfilePicture },
    getUser,
    getDentalClinic,
    setProfilePicture,
  } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  
  // ADDED: State to hold the active child profile information
  const [activeProfileName, setActiveProfileName] = useState('');
  const [activeProfileUsername, setActiveProfileUsername] = useState('');
  const [activeProfilePictureIndex, setActiveProfilePictureIndex] = useState(null);

  useEffect(() => {
    setRefreshKey(prev => prev + 1);
    if (currentLanguage !== 'en') {
      translateAndCache(textsToTranslate);
    }
  }, [currentLanguage]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          // ADDED: Load the active child profile information from AsyncStorage
          const profileName = await AsyncStorage.getItem('activeProfileName');
          const profileUsername = await AsyncStorage.getItem('activeProfileUsername');
          const profilePictureIndex = await AsyncStorage.getItem('activeProfilePictureIndex');
          
          if (profileName) setActiveProfileName(profileName);
          if (profileUsername) setActiveProfileUsername(profileUsername);
          if (profilePictureIndex && profilePictureIndex !== '-1') {
            setActiveProfilePictureIndex(parseInt(profilePictureIndex));
          }

          await getUser();
          await getDentalClinic();
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }, [])
  );

  const formatDate = (dateString) => {
    if (!dateString) return t('Not specified');
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

  // UPDATED: Use active profile picture index if available
  const getDisplayProfilePicture = () => {
    if (activeProfilePictureIndex !== null && activeProfilePictureIndex >= 0) {
      return activeProfilePictureIndex;
    }
    return selectedProfilePicture;
  };

  const handleChangeProfilePicture = () => {
    setShowProfileModal(true);
  };

  // UPDATED: Save the profile picture for the active child profile
  const handleProfilePictureSelect = async (pictureIndex) => {
    setProfilePicture(pictureIndex);
    setActiveProfilePictureIndex(pictureIndex);
    
    // Save to AsyncStorage so it persists
    try {
      await AsyncStorage.setItem('activeProfilePictureIndex', String(pictureIndex));
    } catch (error) {
      console.error('Error saving profile picture:', error);
    }
    
    setShowProfileModal(false);
  };

  // UPDATED: Handles profile switching logic
  const handleSwitchProfiles = async () => {
    try {
      const storedCode = await AsyncStorage.getItem('profileSwitchCode');
      if (storedCode) {
        // If a parental control code exists, show the modal
        setAccessCode('');
        setShowAccessCodeModal(true);
      } else {
        // No code set — switch directly back to parent
        const parentId = await AsyncStorage.getItem('parentId');
        if (parentId) {
          await AsyncStorage.setItem('id', parentId);
          await AsyncStorage.removeItem('parentId');
          await AsyncStorage.setItem('currentAccountType', 'parent');
          
          // ADDED: Clear active profile information
          await AsyncStorage.removeItem('activeProfileId');
          await AsyncStorage.removeItem('activeProfileName');
          await AsyncStorage.removeItem('activeProfileUsername');
          await AsyncStorage.removeItem('activeProfilePictureIndex');
          
          navigation.reset({
            index: 0,
            routes: [{ name: 'mainFlow' }],
          });
        } else {
          console.error("Parent ID not found");
        }
      }
    } catch (error) {
      console.error('Error checking parental control code:', error);
    }
  };

  // Handle access code submission
  const handleAccessCodeSubmit = async () => {
    try {
      const storedCode = await AsyncStorage.getItem('profileSwitchCode');

      if (!storedCode) {
        Alert.alert(
          t('No access code set'),
          t('Please ask your parent to set an access code first.'),
          [{ text: 'OK' }]
        );
        setShowAccessCodeModal(false);
        return;
      }

      if (accessCode.trim() === storedCode) {
        setShowAccessCodeModal(false);

        const parentId = await AsyncStorage.getItem('parentId');
        if (parentId) {
          await AsyncStorage.setItem('id', parentId);
          await AsyncStorage.removeItem('parentId');
          await AsyncStorage.setItem('currentAccountType', 'parent');
          
          // ADDED: Clear active profile information
          await AsyncStorage.removeItem('activeProfileId');
          await AsyncStorage.removeItem('activeProfileName');
          await AsyncStorage.removeItem('activeProfileUsername');
          await AsyncStorage.removeItem('activeProfilePictureIndex');
          
          navigation.reset({
            index: 0,
            routes: [{ name: 'mainFlow' }],
          });
        } else {
          console.error("Parent ID not found");
        }
      } else {
        Alert.alert(
          t('Error'),
          t('Incorrect access code'),
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error checking access code:', error);
      Alert.alert(
        t('Error'),
        'An error occurred. Please try again.',
        [{ text: 'OK' }]
      );
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

  const displayProfilePicture = getDisplayProfilePicture();

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
            {displayProfilePicture !== null ? (
              <Image
                source={profilePictures[displayProfilePicture]}
                style={styles.profileImage}
              />
            ) : (
              <Text style={styles.profileInitials}>
                {getInitials(details.firstname, details.lastname)}
              </Text>
            )}
          </View>
          {/* UPDATED: Show active profile name if available, otherwise fallback to details */}
          <Text style={styles.profileName}>
            {activeProfileName || (details.firstname && details.lastname
              ? `${details.firstname} ${details.lastname}`
              : 'User Name')}
          </Text>
          {/* ADDED: Show username/email if available */}
          {activeProfileUsername && (
            <Text style={styles.profileUsername}>{activeProfileUsername}</Text>
          )}
          <TouchableOpacity
            style={styles.changeProfileButton}
            onPress={handleChangeProfilePicture}
          >
            <Text style={styles.changeProfileText}>{t('Change Profile Picture')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.switchProfileButton}
            onPress={handleSwitchProfiles}
          >
            <Ionicons name="swap-horizontal-outline" size={16} color="#516287" />
            <Text style={styles.switchProfileText}>{t('Back to Parent Profile')}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Information Cards */}
        <View style={styles.infoSection}>
          {/* Personal Information Card */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-outline" size={24} color="#516287" />
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
          </View>

          {/* Medical Information Card */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="medical-outline" size={24} color="#516287" />
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
          </View>
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
                    displayProfilePicture === index && styles.selectedProfileOption
                  ]}
                  onPress={() => handleProfilePictureSelect(index)}
                >
                  <Image source={picture} style={styles.profileOptionImage} />
                  {displayProfilePicture === index && (
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

      {/* Access Code Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showAccessCodeModal}
        onRequestClose={() => setShowAccessCodeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <View style={styles.accessCodeModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('Enter Access Code')}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowAccessCodeModal(false)}
                >
                  <Ionicons name="close" size={24} color="#333333" />
                </TouchableOpacity>
              </View>

              <View style={styles.accessCodeContent}>
                <Ionicons name="lock-closed-outline" size={48} color="#516287" />
                <Text style={styles.accessCodeMessage}>
                  {t('Enter the access code to switch profiles')}
                </Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('Access Code')}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={accessCode}
                    onChangeText={setAccessCode}
                    placeholder="****"
                    secureTextEntry={true}
                    keyboardType="number-pad"
                    maxLength={4}
                  />
                </View>
              </View>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowAccessCodeModal(false)}
                >
                  <Text style={styles.cancelButtonText}>{t('Cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleAccessCodeSubmit}
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

export default ChildAccountScreen;