import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  caller: {
    marginLeft: '-1.5%',
    marginRight: '-1.5%',
    marginBottom: '4%',
  },
  titleTextStyle: {
    fontSize: 28,
    marginLeft: '1.5%',
    marginBottom: 5,
    alignSelf: 'center',
    fontFamily: 'Righteous_400Regular',
  },
  appointmentTextStyle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: '1.5%',
    marginBottom: 10,
  },
  topicStyle: {
    borderColor: 'grey',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 7,
  },
  topicText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 20,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  insideContainer: {
    marginLeft: '1.5%',
    marginRight: '1.5%',
  },
  buttonContainer: {
    borderRadius: 20,
    width: '90%',
    marginLeft: '5%',
  },
  button: {
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  activityIndicatorViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default styles;
