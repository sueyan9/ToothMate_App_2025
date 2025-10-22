import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Individual content view styles
  title: {
    fontSize: 30,
    paddingVertical: 10,
    marginBottom: '1%',
    textAlign: 'center',
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
    color: '#000',
  },
  contentStyle: {
    marginLeft: '1.5%',
    marginRight: '1.5%',
    fontSize: 22,
    paddingLeft: '3%',
    paddingRight: '1%',
    paddingVertical: '2.5%',
    backgroundColor: '#fff',
    marginBottom: '1%',
    borderWidth: 1,
    lineHeight: 28,
  },

  // Shared container
  container: {
    flex: 1,
    backgroundColor: '#E9F1F8',
    paddingHorizontal: 16,
    paddingTop: 52,
  },
  scrollContent: {
    flex: 1,
  },
  errorText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginTop: 100,
  },

  // Titles
  titleText: {
    fontSize: 24,
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center', // Changed from alignSelf: 'center'
    fontWeight: 'semi-bold',
  },

  // Filters (from old EducationScreen)
  filterContainer: {
    paddingBottom: 24,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  filterPill: {
    backgroundColor: 'none',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 2.5,
    borderColor: '#516287',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  activeFilter: {
    backgroundColor: '#EDDFD3',
    borderColor: '#875B51',
  },
  filterText: {
    color: '#333333',
    fontSize: 16,
  },
  activeFilterText: {
    color: '#333333',
    fontSize: 16,
  },

  // Content list
  contentList: {
    marginBottom: 68,
  },
  contentCard: {
    backgroundColor: '#FFFDF6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 5,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
    marginBottom: 16,
  },
  topCornerBackButton: {
    position: 'absolute',
    top: 130,
    left: 24,
    padding: 8,
    zIndex: 1,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDDFD3',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#875B51',
  },

  // Empty states
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },

  // Modal content (from old EducationScreen)
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFDF6',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginTop: 0,
    padding: 10,
    marginBottom: 10,
    color: '#333333',
  },
  modalContent: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 28,
    color: '#333333',
    marginBottom: 20,
    marginTop: 20,
    alignSelf: 'right',
  },
  contentCategory: {
    fontSize: 18,
    color: '#656B69',
    marginBottom: 25,
  },
  contentImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    marginLeft: 5,
  },
  contentDetails: {
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#516287',
    marginTop: 8,
    marginRight: 12,
  },
  detailText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },

  // Search
  searchContainer: {
    paddingHorizontal: 10,
    marginBottom: 16,
    marginTop: 24,
  },
  searchInput: {
    borderWidth: 2.5,
    borderColor: '#516287',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333333',
  },

  // Header (unique to content screen)
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 80, // status bar space
    justifyContent: 'center', // Add this to center the content
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  button: {
    backgroundColor: '#875B51',
    padding: 16,
    marginTop: 20,
    borderRadius: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 17,
    textAlign: 'center',
    color: '#FFFDF6',
    fontWeight: '600',
  },
  itemCountText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
    alignSelf: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
  },
  favourite: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  absoluteArrow: {
    position: 'absolute',
    right: 10,
    top: 16, // Position at the top instead of center
  },

  // Navigation Controls Styles
  navigationContainer: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  contentListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  contentListButtonText: {
    fontSize: 16,
    color: '#875B51',
    marginLeft: 8,
    fontWeight: '500',
  },
  prevNextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 95,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 100,
    justifyContent: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#F0F0F0',
    borderColor: '#D0D0D0',
  },
  navButtonText: {
    fontSize: 14,
    color: '#875B51',
    fontWeight: '500',
    marginHorizontal: 4,
  },
  navButtonTextDisabled: {
    color: '#CCC',
  },

  // Modal Styles
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  closeModalButton: {
    padding: 8,
  },
  modalContentList: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalContentItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  currentContentItem: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  modalItemContent: {
    flex: 1,
  },
  modalItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  currentContentItemText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  modalItemCategory: {
    fontSize: 12,
    color: '#666666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
});