import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  header: {
    alignSelf: 'center',
    fontSize: 50,
    fontFamily: 'Righteous_400Regular',
    color: 'black',
  },
  container: {
    flex: 1,
    marginHorizontal: 0,
    justifyContent: 'center',
  },
  buttonContainer: {
    borderRadius: 20,
    width: '90%',
    alignSelf: 'center',
    marginTop: '10%',
    marginBottom: '5%',
  },
  button: {
    paddingVertical: 10,
    backgroundColor: '#f54245',
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
