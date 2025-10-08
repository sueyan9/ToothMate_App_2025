import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F1F8',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#333333',
  },
  
  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  
  // Profile Picture Section
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  profileInitials: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#516287',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  
  // Information Section
  infoSection: {
    marginBottom: 0,
  },
  infoCard: {
    backgroundColor: '#FFFDF6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDDFD3',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 12,
  },
  
  // Information Rows
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#656B69',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '400',
    lineHeight: 22,
  },
  
  // Action Buttons
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
    fontWeight: '500',
  },
  disconnectButton: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FED7D7',
    marginTop: 8,
  },
  disconnectText: {
    color: '#DC3545',
  },
  
  // Sign Out Section
  signOutSection: {
    paddingBottom: 120,
    alignItems: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#DC3545',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC3545',
    marginLeft: 8,
  },

  // Profile Image
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  // Change Profile Button
  changeProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#516287',
    backgroundColor: 'transparent',
  },
  changeProfileText: {
    fontSize: 14,
    color: '#516287',
    marginLeft: 6,
    fontWeight: '500',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFDF6',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDDFD3',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    padding: 4,
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 16,
  },
  profileOption: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
  },
  selectedProfileOption: {
    borderColor: '#516287',
  },
  profileOptionImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(81, 98, 135, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  
  // Update Details Modal
  updateModalContent: {
    backgroundColor: '#FFFDF6',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '85%',
  },
  formContainer: {
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#EDDFD3',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EDDFD3',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  submitButton: {
    backgroundColor: '#516287',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Confirmation Modal
  confirmModalContent: {
    backgroundColor: '#FFFDF6',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  confirmHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 12,
    marginBottom: 8,
  },
  confirmMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  discardButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  discardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  saveButton: {
    backgroundColor: '#28A745',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Input validation styles
  validInput: {
    borderColor: '#28A745',
    borderWidth: 2,
  },
  invalidInput: {
    borderColor: '#DC3545',
    borderWidth: 2,
  },
  warningInput: {
    borderColor: '#FF8C00',
    borderWidth: 2,
  },
  errorText: {
    fontSize: 14,
    color: '#DC3545',
    marginTop: 4,
    marginLeft: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#FF8C00',
    marginTop: 4,
    marginLeft: 4,
  },
  successText: {
    fontSize: 14,
    color: '#28A745',
    marginTop: 4,
    marginLeft: 4,
  },
  
  // Clinic update specific styles
  clinicInfoContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F0F8F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#28A745',
  },
  clinicInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 4,
  },
  clinicInfoText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  warningClinicTitle: {
    color: '#FF8C00',
  },
  warningClinicText: {
    color: '#FF8C00',
  },
  clinicConfirmInfo: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  clinicConfirmName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  clinicConfirmText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
  },
  
  // Success modal styles
  successModalContent: {
    backgroundColor: '#FFFDF6',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28A745',
    textAlign: 'center',
    lineHeight: 26,
  },
  successCloseButton: {
    backgroundColor: '#516287',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  successCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Privacy Disclaimer Section
  privacyDisclaimerSection: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    width: '100%',
  },
  privacyDisclaimerText: {
    fontSize: 14,
    color: '#495057',
    textAlign: 'left',
    lineHeight: 20,
    marginBottom: 16,
  },
  privacyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  privacyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CED4DA',
    backgroundColor: '#FFFFFF',
    minWidth: 80,
    alignItems: 'center',
  },
  privacyButtonSelected: {
    backgroundColor: '#516287',
    borderColor: '#516287',
  },
  privacyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  privacyButtonTextSelected: {
    color: '#FFFFFF',
  },
  secondaryDisclaimerText: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'left',
    lineHeight: 16,
    fontStyle: 'italic',
    marginTop: 8,
  },
  
  // Disabled Button Styles
  disabledButton: {
    backgroundColor: '#E9ECEF',
    borderColor: '#CED4DA',
  },
  disabledButtonText: {
    color: '#6C757D',
  },
  //images display
  xrayThumb: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: '#EEF1F6',
  },
  //Collapsible
  badge: {
    minWidth: 24,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: '#ECEFF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  badgeText: {
    color: '#516287',
    fontSize: 12,
    fontWeight: '600',
  },
});
