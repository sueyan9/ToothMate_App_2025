import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  containerImage: {
    flex: 1,
    marginTop: '25%',
  },
  buttonViewStyle: {
    marginTop: 15,
    height: 70,
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-around',
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
  buttonTitle: {
    color: '#000',
    fontWeight: 'bold',
  },
});
