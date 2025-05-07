import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  dateStyle: {
    fontSize: 18,
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  dobButton: {
    backgroundColor: '#f2f2f2',
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  dobText: {
    color: '#000000',
    paddingLeft: 0,
    textAlign: 'left',
  },
  inputContainerStyle: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#dedede',
    width: '95%',
    paddingLeft: 15,
    backgroundColor: '#ebebeb',
    marginLeft: '2.25%',
  },
  textStyle: {
    fontSize: 16,
  },
  labelStyle: {
    fontSize: 14,
    marginLeft: 18,
    color: 'black',
    marginBottom: 3,
    marginTop: 2,
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    marginLeft: 15,
  },
  link: {
    color: 'blue',
  },
  dropdownContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  clinicTextStyle: {
    marginLeft: 20,
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 10,
    backgroundColor: '#F0F0F0',
  },
  buttonContainer: {
    borderRadius: 20,
    borderColor: 'white',
    width: '90%',
    marginLeft: '5%',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  androidModalViewStyle: {
    width: '90%',
    marginLeft: '5%',
  },
  titleTextStyle: {
    fontSize: 50,
    alignSelf: 'center',
    fontFamily: 'Righteous_400Regular',
    marginBottom: '2%',
    marginTop: '5%',
  },
  activityIndicatorViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
