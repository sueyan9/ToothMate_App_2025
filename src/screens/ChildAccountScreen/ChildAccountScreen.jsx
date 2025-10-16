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
    'Switch Profiles',
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
    state: { details, clinic, selectedProfilePicture, childDetails },
    getUser,
    getDentalClinic,
    setProfilePicture,
  } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [showProfileSwitchModal, setShowProfileSwitchModal] = useState(false);
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
    return selectedProfilePicture;
  };

  const handleChangeProfilePicture = () => {
    setShowProfileModal(true);
  };

  // UPDATED: Save the profile picture for the active child profile
  const handleProfilePictureSelect = async (pictureIndex, userId) => {
    console.log('Updating profile picture - userId:', userId, 'pictureIndex:', pictureIndex);
     console.log('Current AsyncStorage id:', await AsyncStorage.getItem('id'));
     console.log('Current details id: ', details._id);

    setProfilePicture(pictureIndex, userId);
    setActiveProfilePictureIndex(pictureIndex);
    
    // Save to AsyncStorage so it persists
    try {
      await AsyncStorage.setItem('activeProfilePictureIndex', String(pictureIndex));
    } catch (error) {
      console.error('Error saving profile picture:', error);
    }
    
    setShowProfileModal(false);
  };

  // UPDATED: Handles profile switching logic with parental code check
  const handleSwitchProfiles = async () => {
    try {
      const storedCode = await AsyncStorage.getItem('profileSwitchCode');
      if (storedCode) {
        // If a parental control code exists, show the access code modal first
        setAccessCode('');
        setShowAccessCodeModal(true);
      } else {
        // No code set — show the profile switch modal directly
        setShowProfileSwitchModal(true);
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
        // If code is correct, show the profile switch modal
        setShowProfileSwitchModal(true);
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

  // ADDED: Instagram-style profile switching handler for all available accounts including parent
  const handleProfileSwitch = (accountId, accountType) => {
    if (accountId === 'current') {
      setShowProfileSwitchModal(false);
      return;
    }

    Alert.alert(
      'Switch Profile',
      'Are you sure you want to switch accounts?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Switch',
          onPress: async () => {
            setShowProfileSwitchModal(false);
            
            try {
              const currentId = await AsyncStorage.getItem('id');
              
              if (accountType === 'parent') {
                // Switching to parent account
                await AsyncStorage.setItem('id', accountId);
                await AsyncStorage.removeItem('parentId');
                await AsyncStorage.setItem('currentAccountType', 'parent');
                
                // Clear active profile information
                await AsyncStorage.removeItem('activeProfileId');
                await AsyncStorage.removeItem('activeProfileName');
                await AsyncStorage.removeItem('activeProfileUsername');
                await AsyncStorage.removeItem('activeProfilePictureIndex');
                
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'mainFlow' }],
                });
              } else {
                // Switching to another child account
                await AsyncStorage.setItem('parentId', currentId);
                await AsyncStorage.setItem('id', accountId);
                await AsyncStorage.setItem('currentAccountType', 'child');
                
                // Clear old active profile information
                await AsyncStorage.removeItem('activeProfileId');
                await AsyncStorage.removeItem('activeProfileName');
                await AsyncStorage.removeItem('activeProfileUsername');
                await AsyncStorage.removeItem('activeProfilePictureIndex');
                
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'childFlow' }],
                });
              }
            } catch (e) {
              console.error('Error switching accounts:', e);
            }
          }
        }
      ]
    );
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
            <Text style={styles.switchProfileText}>{t('Switch Profiles')}</Text>
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
                  onPress={() => {handleProfilePictureSelect(index, details._id), console.log("detailsss: ", details._id)}}
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

      {/* Instagram-Style Profile Switch Modal - UPDATED: Shows all accounts including parent */}
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
                      {details.email || 'child@email.com'}
                    </Text>
                  </View>
                </View>
                <View style={styles.checkmarkContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#3797F0" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Other Accounts Section - UPDATED: Shows parent account and all other child accounts */}
            <View style={styles.otherAccountsSection}>
              {/* ADDED: Parent Account Option */}
              <TouchableOpacity
                key="parent"
                style={styles.accountRow}
                onPress={async () => {
                  const parentId = await AsyncStorage.getItem('parentId');
                  if (parentId) {
                    handleProfileSwitch(parentId, 'parent');
                  } else {
                    Alert.alert('Error', 'Parent ID not found');
                  }
                }}
              >
                <View style={styles.accountInfo}>
                  <View style={styles.accountAvatar}>
                    <Ionicons name="shield-outline" size={32} color="#516287" />
                  </View>
                  <View style={styles.accountText}>
                    <Text style={styles.accountName}>
                      Parent Account
                    </Text>
                    <Text style={styles.accountUsername}>
                      Switch to parent
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* ADDED: Other Child Accounts */}
              {childDetails && childDetails.length > 0 ? (
                childDetails.map((child) => {
                  // Don't show current account in the list
                  if ((child._id || child.id) === details._id) return null;
                  
                  return (
                    <TouchableOpacity
                      key={child._id || child.id}
                      style={styles.accountRow}
                      onPress={() => handleProfileSwitch(child._id || child.id, 'child')}
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
                            </Text>
                          )}
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
                  );
                })
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ChildAccountScreen;