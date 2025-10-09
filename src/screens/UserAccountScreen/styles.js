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

  switchProfileText: {
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
    padding: 6,
    left: 3,
    top: 4,
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

  // Instagram-Style Profile Switch Modal Styles
  profileSwitchModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#C7C7CC',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 20,
  },

  currentAccountSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },

  currentAccountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },

  currentAccountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  currentAccountAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#3797F0',
  },

  currentAccountImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  currentAccountInitials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#516287',
  },

  currentAccountText: {
    flex: 1,
  },

  currentAccountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },

  currentAccountUsername: {
    fontSize: 14,
    color: '#8E8E93',
  },

  checkmarkContainer: {
    marginLeft: 12,
  },

  otherAccountsSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },

  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  accountAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  accountImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  accountText: {
    flex: 1,
  },

  accountName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },

  accountUsername: {
    fontSize: 14,
    color: '#8E8E93',
  },

  addAccountSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },

  addAccountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },

  addAccountIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#DBDBDB',
    borderStyle: 'dashed',
  },

  addAccountText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },

  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },

  bottomButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
  },

  bottomButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3797F0',
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
  labelWithLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  linkText: {
    fontSize: 14,
    color: '#516287',
    fontWeight: '400',
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
  errorText: {
    fontSize: 14,
    color: '#DC3545',
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
  
  // Clinic search list styles
  clinicsListContainer: {
    marginTop: 8,
    maxHeight: 200,
    minHeight: 80,
    borderWidth: 2,
    borderColor: '#516287',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clinicsList: {
    maxHeight: 85,
  },
  clinicListItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    minHeight: 60,
  },
  clinicListContent: {
    flex: 1,
  },
  clinicListCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#516287',
    marginBottom: 4,
  },
  clinicListName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  clinicListAddress: {
    fontSize: 12,
    color: '#666666',
  },
  noResultsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
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
  // Add to the bottom of styles.js
  accessCodeModalContent: {
    backgroundColor: '#FFFDF6',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '85%',
    justifyContent: 'flex-start',
  },

  accessCodeContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  accessCodeMessage: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
    lineHeight: 22,
  },

  // Ensure modal buttons never get covered by keyboard
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EDDFD3',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, // ⬅️ added keyboard-safe padding
  },

});