import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F1F8',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  titleText: {
    fontSize: 24,
    color: '#333333',
    marginTop: 96,
    marginBottom: 16,
    color: '#333333',
    marginTop: 96,
    marginBottom: 16,
    alignSelf: 'center',
  },
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
  contentList: {
    marginBottom: 68,
  },
  contentCard: {
    backgroundColor: '#FFFDF6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#333333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFDF6',
    padding: 20,
  },
  closeButton: {
      alignSelf: 'flex-end',
      marginTop: 52,
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
  }
});
