import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    alignSelf: 'center',
    fontSize: 50,
    fontFamily: 'Righteous_400Regular',
    color: 'black',
  },
  textStyle: {
    fontSize: 16,
  },
  inputStyle: {
    paddingVertical: 8,
    padding: 5,
    fontSize: 16,
    fontWeight: 'bold',
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
  errorMessage: {
    fontSize: 16,
    color: 'red',
    alignSelf: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginHorizontal: '5%',
  },
  buttonContainer: {
    borderRadius: 20,
    width: '90%',
    alignSelf: 'center',
    marginBottom: '5%',
  },
  button: {
    paddingVertical: 10,
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
  inputView: {
    marginTop: '25%',
  },
  imageBackgroundStyle: {
    flex: 1,
    marginTop: '5%',
  },
});
