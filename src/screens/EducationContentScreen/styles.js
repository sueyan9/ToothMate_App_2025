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
    paddingTop: 20,
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
    alignSelf: 'center',
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
    marginTop: 5,
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
    marginBottom: 24,
    alignSelf: 'center',
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
  },
  contentDetails: {
    marginBottom: 30,
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
    backgroundColor: 'none',
    borderWidth: 2.5,
    borderColor: '#516287',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },

  // Header (unique to content screen)
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60, // status bar space
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  itemCountText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  loadingText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
  },
});
