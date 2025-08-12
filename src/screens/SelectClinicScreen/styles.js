import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  inputContainerStyle: {
    height: 30,
    marginBottom: 0,
  },
  textStyle: {
    fontSize: 16,
  },
  labelStyle: {
    fontSize: 14,
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    alignSelf: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginHorizontal: '5%',
  },
  link: {
    color: 'blue',
  },
  dropdownContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  clinicTextStyle: {
    marginLeft: 10,
    fontSize: 17,
    color: 'black',
    fontWeight: 'bold',
    paddingTop: 10,
    alignSelf: 'center',
  },
  buttonContainer: {
    borderRadius: 20,
    borderColor: 'white',
    width: '90%',
    marginLeft: '5%',
  },
  button: {
    paddingVertical: 10,
    backgroundColor: '#f0F0F0',
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
  titleTextStyle: {
    fontSize: 50,
    alignSelf: 'center',
    fontFamily: 'Righteous_400Regular',
  },
  imageStyle: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  searchableDropdownTextStyle: {
    padding: 5,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  searchableDropdownItemStyle: {
    padding: 8,
    marginTop: 3,
    backgroundColor: 'white',
    borderColor: '#bbb',
    borderWidth: 3,
    borderRadius: 20,
  },
  searchableDropdownItemTextStyle: {
    color: '#222',
    marginLeft: 2,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
