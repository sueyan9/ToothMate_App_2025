import { StyleSheet, Platform, Dimensions } from 'react-native';

export default StyleSheet.create({
  buttonContainer: {
    borderRadius: 20,
    width: '90%',
    marginLeft: '5%',
  },
  button: {
    paddingVertical: 10,
    backgroundColor: '#F0F0F0',
  },
  inputStyle: {
    paddingVertical: 8,
    padding: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  titleContainer: {
    color: 'black',
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 20,
    width: '80%',
    marginLeft: '10%',
    borderColor: '#dedede',
    paddingLeft: 13,
    backgroundColor: '#f8f8ff',
  },
  labelStyles: {
    marginLeft: '15%',
    color: 'black',
  },
  containerHeading: {
    alignSelf: 'center',
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black',
  },
  imageContainer: {
    width: 200,
    height: 200,
  },
  container: {
    flex: 1,
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    alignSelf: 'center',
    marginTop: '-5%',
    fontWeight: 'bold',
  },
  link: {
    color: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginTop: '2%',
  },
  activityIndicatorViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  titleTextStyle: {
    fontSize: 50,
    marginTop: '15%',
    marginBottom: '10%',
    alignSelf: 'center',
    fontFamily: 'Righteous_400Regular',
  },
  imageBackgroundStyle: {
    paddingTop: '20%',
    height: Platform.OS === 'ios' ? Dimensions.get('window').height * 0.6 : Dimensions.get('window').height * 0.7,
    width: Dimensions.get('window').width,
  },
  signinButtonTitleStyle: {
    color: '#000',
    fontWeight: 'bold',
  },
});
