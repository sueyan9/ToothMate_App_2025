import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F1F8',
  },
  scrollView: {
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  appointmentsList: {
    flex: 1,
    marginBottom: 70,
  },
  appointmentCard: {
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
  appointmentInfo: {
    flex: 1,
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  dentistText: {
    fontSize: 14,
    color: '#666666',
  },
  typeTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDDFD3',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  typeText: {
    fontSize: 12,
    color: '#875B51',
  },
  noAppointments: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noAppointmentsText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    left: '50%',
    marginLeft: -28,
    bottom: 85,
    backgroundColor: '#00adf5',
    borderRadius: 28,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default styles;
