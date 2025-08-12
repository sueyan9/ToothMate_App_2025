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
    backgroundColor: '#f7f7f7',
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
  link: {
    color: '#fff',
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'center',
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
  buttonContainer: {
    borderRadius: 20,
    width: '90%',
    marginLeft: '5%',
  },
  button: {
    paddingVertical: 10,
    backgroundColor: '#F0F0F0',
  },
  header: {
    color: '#2B510C',
    fontWeight: 'bold',
    fontSize: 30,
    padding: 2,
    justifyContent: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    alignSelf: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginHorizontal: '5%',
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
    alignSelf: 'center',
    fontFamily: 'Righteous_400Regular',
  },
  androidModalViewStyle: {
    width: '90%',
    marginLeft: '5%',
  },
  alreadyHaveAccountStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
});
