import { StyleSheet, Platform, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    fontWeight: 'bold',
    color: 'black',
  },
  header: {
    fontSize: 50,
    marginTop: '15%',
    alignSelf: 'center',
    fontFamily: 'Righteous_400Regular',
  },
  button: {
    width: '80%',
    paddingVertical: 10,
    backgroundColor: '#F0F0F0', // #346185
    marginBottom: 15,
    alignSelf: 'center',
    borderRadius: 20,
    borderColor: '#000',
  },
  titleContainer: {
    color: '#000',
    fontWeight: 'bold',
  },
  signOutContainer: {
    borderRadius: 20,
    width: '80%',
    alignSelf: 'center',
  },
  signOutButton: {
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderColor: '#346185',
  },
  signOutTextStyle: {
    color: '#000',
    fontWeight: 'bold',
  },
  childButtonStyle: {
    paddingVertical: 10,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: 10,
    backgroundColor: '#F0F0F0',
    borderColor: '#346185',
  },
  childTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: '#000',
  },
  yourAccountStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: '#000',
    fontWeight: 'bold',
    marginBottom: '3%',
    marginTop: '6%',
  },
  imageBackgroundStyle: {
    paddingTop: '15%',
    height: Platform.OS === 'ios' ? Dimensions.get('window').height * 0.3 : Dimensions.get('window').height * 0.4,
    width: Dimensions.get('window').width * 0.6,
    alignSelf: 'center',
  },
  topButtonViewStyle: {
    flex: 1,
    marginTop: '2%',
    width: Dimensions.get('window').width,
    marginLeft: '-34%',
  },
});
