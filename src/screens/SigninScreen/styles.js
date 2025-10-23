import { Dimensions, Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
  buttonContainer: {
    borderRadius: 20,
    width: '85%',
    marginLeft: '7.5%',
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: '#EDDFD3',
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: '#875B51',
  },
  secondaryButton: {
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: '#f7f7f7',
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: '#dedede',
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
    borderColor: '#dedede',
    width: '95%',
    paddingLeft: 15,
    backgroundColor: '#f7f7f7',
    marginLeft: '2.25%',
  },
  inputContainerStyle: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#dedede',
    width: '95%',
    paddingLeft: 15,
    marginBottom: 0,
    backgroundColor: '#f7f7f7',
    marginLeft: '2.25%',
  },
  textStyle: {
    fontSize: 16,
  },
  labelStyles: {
    fontSize: 14,
    marginLeft: 18,
    color: '#333333',
    marginBottom: 3,
    marginTop: 2,
  },
  labelStyle: {
    fontSize: 14,
    marginLeft: 18,
    color: '#333333',
    marginBottom: 3,
    marginTop: 2,
  },
  alreadyHaveAccountStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333333',
    textAlign: 'center',
  },
  forgotPasswordStyle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#875B51',
    textAlign: 'center',
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
    backgroundColor: '#E9F1F8',
  },
  icon: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '15%',
    aspectRatio: 1, // adjust this based on your logo's ratio (width/height)
    resizeMode: 'contain',
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    alignSelf: 'center',
    marginTop: '-5%',
    fontWeight: 'bold',
  },
  link: {
    color: '#875B51',
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  activityIndicatorViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  titleTextStyle: {
    fontSize: 50,
    alignSelf: 'center',
  },
  imageBackgroundStyle: {
    paddingTop: '20%',
    height: Platform.OS === 'ios' ? Dimensions.get('window').height * 0.6 : Dimensions.get('window').height * 0.7,
    width: Dimensions.get('window').width,
  },
  signinButtonTitleStyle: {
    color: '#333333',
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#333333',
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#333333',
    fontWeight: 'bold',
  },
  stageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 24,
    marginTop: 16,
  },
});