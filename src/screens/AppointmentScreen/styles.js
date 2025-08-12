import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  imageContainer: {
    width: Dimensions.get('screen').width,
    height: 400,
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  heading: {
    borderBottomWidth: 1,
    paddingBottom: 3,
  },
  title: {
    fontSize: 22,
    borderColor: 'black',
    paddingTop: 5,
  },
  headingFont: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  scroll: {
    marginTop: 15,
    marginBottom: 5,
  },
  buttonContainer: {
    borderRadius: 20,
    borderColor: 'white',
    width: '90%',
    marginLeft: '5%',
  },
  button: {
    paddingVertical: 10,
    backgroundColor: '#78d0f5',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
