import { StyleSheet, Dimensions, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    fontWeight: 'bold',
    color: 'black',
  },
  header: {
    alignSelf: 'center',
    fontSize: 48,
    fontFamily: 'Righteous_400Regular',
    color: 'black',
    marginBottom: '10%',
    marginTop: '15%',
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
  backButton: {
    paddingVertical: 10,
    backgroundColor: '#F0f0f0',
    borderColor: '#000',
    borderRadius: 20,
    width: '80%',
    marginBottom: 30,
    alignSelf: 'center',
  },
  backTitleContainer: {
    color: '#000',
    fontWeight: 'bold',
  },
  imageBackgroundStyle: {
    paddingTop: '15%',
    height: Platform.OS === 'ios' ? Dimensions.get('window').height * 0.6 : Dimensions.get('window').height * 0.7,
    width: Dimensions.get('window').width,
  },
  activityIndicatorViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
