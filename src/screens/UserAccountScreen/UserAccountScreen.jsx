import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
    setProfilePicture
  } = useContext(UserContext);
  const { signout } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

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

  const handleUpdateDetails = () => {
    console.log('Update Details button pressed');
  };

  const handleChangeClinic = () => {
    console.log('Change Clinic button pressed');
  };

  const handleChangePassword = () => {
    console.log('Change Password button pressed');
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
    </SafeAreaView>
  );
};

export default UserAccountScreen;
