import { StyleSheet, Platform, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonContainer: {
    borderRadius: 20,
    width: '80%',
    marginBottom: 15,
    alignSelf: 'center',
  },
  button: {
    paddingVertical: 10,
    backgroundColor: '#F0F0F0',
  },
  titleContainer: {
    color: '#000',
    fontWeight: 'bold',
  },
  header: {
    alignSelf: 'center',
    fontSize: 50,
    fontFamily: 'Righteous_400Regular',
    color: 'black',
    marginBottom: '10%',
  },
  activityIndicatorViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  imageBackgroundStyle: {
    paddingTop: '15%',
    height: Platform.OS === 'ios' ? Dimensions.get('window').height * 0.6 : Dimensions.get('window').height * 0.7,
    width: Dimensions.get('window').width,
  },
  buttonViewStyle: {
    flex: 1,
    marginTop: '5%',
  },
});
