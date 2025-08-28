import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axiosApi from '../../api/axios';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
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

const UserAccountScreen = ({ navigation }) => {
  const { 
    state: { details, clinic, canDisconnect, selectedProfilePicture }, 
    getUser, 
    getDentalClinic, 
    checkCanDisconnect,
    setProfilePicture,
    updateUser,
    changePassword
  } = useContext(UserContext);
  const { signout } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswordConfirmModal, setShowPasswordConfirmModal] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null); // null | 'valid' | 'invalid' | 'exists' | 'invalid_format'
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

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          await getUser();
          await getDentalClinic();
          await checkCanDisconnect();
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }, [])
  );

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
        return 'Please enter a valid email address';
      case 'exists':
        return 'Email already exists';
      case 'invalid':
        return 'Error validating email';
      default:
        return null;
    }
  };

  // Helper functions for password validation
  const getPasswordValidationErrors = (password) => {
    const errors = [];
    
    if (password.length > 0 && password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    
    if (password.length > 0 && password === password.toLowerCase()) {
      errors.push('Must contain at least one capital letter');
    }
    
    if (password.length > 0 && !/\d/.test(password)) {
      errors.push('Must contain at least one number');
    }
    
    if (password.length > 0 && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
      errors.push('Must contain at least one special character');
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
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    
    if (emailStatus === 'invalid_format') {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    
    if (emailStatus === 'exists') {
      Alert.alert('Error', 'Email already exists. Please choose a different email.');
      return;
    }
    
    if (emailStatus === 'invalid') {
      Alert.alert('Error', 'Error validating email. Please try again.');
      return;
    }
    
    if (emailStatus !== 'valid' && emailStatus !== null) {
      Alert.alert('Error', 'Please wait for email validation to complete.');
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
    console.log('Change Clinic button pressed');
  };

  const handleChangePassword = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = () => {
    // Validate password fields
    if (passwordData.currentPassword.trim() === '') {
      Alert.alert('Error', 'Please enter your current password.');
      return;
    }
    
    if (passwordData.newPassword.trim() === '') {
      Alert.alert('Error', 'Please enter a new password.');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }
    
    if (passwordData.newPassword === passwordData.newPassword.toLowerCase()) {
      Alert.alert('Error', 'Password must contain at least one capital letter.');
      return;
    }
    
    if (!/\d/.test(passwordData.newPassword)) {
      Alert.alert('Error', 'Password must contain at least one number.');
      return;
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(passwordData.newPassword)) {
      Alert.alert('Error', 'Password must contain at least one special character.');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
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

  const handleChangeProfilePicture = () => {
    setShowProfileModal(true);
  };

  const handleProfilePictureSelect = (pictureIndex) => {
    setProfilePicture(pictureIndex);
    setShowProfileModal(false);
    console.log(`Profile picture ${pictureIndex + 1} selected`);
  };

  const handleDisconnectFromParent = () => {
    navigation.navigate('DisconnectChild');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => signout(),
        },
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account Settings</Text>
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
              : 'User Name'}
          </Text>
          <TouchableOpacity 
            style={styles.changeProfileButton}
            onPress={handleChangeProfilePicture}
          >
            <Text style={styles.changeProfileText}>Change Profile Picture</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Information Cards */}
        <View style={styles.infoSection}>
          {/* Personal Information Card */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-outline" size={24} color="#516287" />
              <Text style={styles.cardTitle}>Personal Information</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>First Name</Text>
              <Text style={styles.infoValue}>
                {details.firstname || 'Not specified'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Name</Text>
              <Text style={styles.infoValue}>
                {details.lastname || 'Not specified'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>
                {formatDate(details.dob)}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>
                {details.email || 'Not specified'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>
                {details.address || 'None'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Emergency Contact Name</Text>
              <Text style={styles.infoValue}>
                {details.emergencyContactName || 'None'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Emergency Contact Phone</Text>
              <Text style={styles.infoValue}>
                {details.emergencyContactPhone || 'None'}
              </Text>
            </View>
            
          </View>

          

          {/* Medical Information Card */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="medical-outline" size={24} color="#516287" />
              <Text style={styles.cardTitle}>Medical Information</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>NHI Number</Text>
              <Text style={styles.infoValue}>
                {details.nhi || 'Not specified'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dental Clinic</Text>
              <Text style={styles.infoValue}>
                {clinic?.name || 'Not specified'}
              </Text>
            </View>
            
            {clinic?.address && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Clinic Address</Text>
                <Text style={styles.infoValue}>
                  {clinic.address}
                </Text>
              </View>
            )}
            
            {clinic?.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Clinic Phone</Text>
                <Text style={styles.infoValue}>
                  {clinic.phone}
                </Text>
              </View>
            )}
          </View>

          {/* Account Actions Card */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="settings-outline" size={24} color="#516287" />
              <Text style={styles.cardTitle}>Account Settings</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleUpdateDetails}
            >
              <Ionicons name="pencil-outline" size={20} color="#516287" />
              <Text style={styles.actionButtonText}>Update Your Details</Text>
              <Ionicons name="chevron-forward" size={20} color="#516287" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleChangeClinic}
            >
              <Ionicons name="business-outline" size={20} color="#516287" />
              <Text style={styles.actionButtonText}>Change Clinic</Text>
              <Ionicons name="chevron-forward" size={20} color="#516287" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleChangePassword}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#516287" />
              <Text style={styles.actionButtonText}>Change Your Password</Text>
              <Ionicons name="chevron-forward" size={20} color="#516287" />
            </TouchableOpacity>

            {canDisconnect && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.disconnectButton]}
                onPress={handleDisconnectFromParent}
              >
                <Ionicons name="unlink-outline" size={20} color="#DC3545" />
                <Text style={[styles.actionButtonText, styles.disconnectText]}>
                  Disconnect From Parent
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#DC3545" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <TouchableOpacity 
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={24} color="#DC3545" />
            <Text style={styles.signOutText}>Sign Out</Text>
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
              <Text style={styles.modalTitle}>Choose Profile Picture</Text>
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
              <Text style={styles.modalTitle}>Update Your Details</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleUpdateCancel}
              >
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={getEmailInputStyle()}
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {getEmailErrorMessage() && (
                  <Text style={styles.errorText}>{getEmailErrorMessage()}</Text>
                )}
                {emailStatus === 'valid' && formData.email.trim() !== '' && (
                  <Text style={styles.successText}>✓ Email is available</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={formData.address}
                  onChangeText={(text) => setFormData({...formData, address: text})}
                  placeholder="Enter your address"
                  multiline={true}
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Emergency Contact Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.emergencyContactName}
                  onChangeText={(text) => setFormData({...formData, emergencyContactName: text})}
                  placeholder="Enter emergency contact name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Emergency Contact Phone</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.emergencyContactPhone}
                  onChangeText={(text) => setFormData({...formData, emergencyContactPhone: text})}
                  placeholder="Enter emergency contact phone"
                  keyboardType="phone-pad"
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleUpdateCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleUpdateSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
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
              <Text style={styles.confirmTitle}>Confirm Changes</Text>
              <Text style={styles.confirmMessage}>
                Are you sure you want to save these changes to your profile?
              </Text>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.discardButton]}
                onPress={handleConfirmDiscard}
              >
                <Text style={styles.discardButtonText}>Discard Changes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleConfirmSave}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
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
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handlePasswordCancel}
              >
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <TextInput
                  style={styles.textInput}
                  value={passwordData.currentPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                  placeholder="Enter your current password"
                  secureTextEntry={true}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>New Password</Text>
                <TextInput
                  style={styles.textInput}
                  value={passwordData.newPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                  placeholder="Enter your new password"
                  secureTextEntry={true}
                />
                {getPasswordValidationErrors(passwordData.newPassword).map((error, index) => (
                  <Text key={index} style={styles.errorText}>{error}</Text>
                ))}
                {passwordData.newPassword.length > 0 && isPasswordValid(passwordData.newPassword) && (
                  <Text style={styles.successText}>✓ Password meets all requirements</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm New Password</Text>
                <TextInput
                  style={styles.textInput}
                  value={passwordData.confirmPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
                  placeholder="Confirm your new password"
                  secureTextEntry={true}
                />
                {passwordData.confirmPassword.length > 0 && passwordData.newPassword !== passwordData.confirmPassword && (
                  <Text style={styles.errorText}>Passwords do not match</Text>
                )}
                {passwordData.confirmPassword.length > 0 && passwordData.newPassword === passwordData.confirmPassword && isPasswordValid(passwordData.newPassword) && (
                  <Text style={styles.successText}>✓ Passwords match</Text>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handlePasswordCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={handlePasswordSubmit}
              >
                <Text style={styles.submitButtonText}>Change Password</Text>
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
              <Text style={styles.confirmTitle}>Confirm Password Change</Text>
              <Text style={styles.confirmMessage}>
                Are you sure you want to change your password? You will need to use the new password for future logins.
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
    </SafeAreaView>
  );
};

export default UserAccountScreen;
