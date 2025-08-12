import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  toggle: {
    flexDirection: 'row',
    borderColor: '#fff',
    borderRadius: 20,
    paddingRight: 10,
    paddingBottom: 10,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  toggleText: {
    fontSize: 18,
    alignSelf: 'center',
    padding: 10,
    paddingHorizontal: 25,
    marginTop: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: 390,
    height: 500,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  headingFont: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    paddingBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    overflow: 'hidden',
    borderRadius: 15,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    elevation: 2,
    backgroundColor: '#F194FF',
    marginTop: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalBox: {
    flexDirection: 'row',
    width: 220,
  },
  leftBox: {
    width: 140,
  },
  rightBox: {
    width: 80,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'left',
  },
  modalDateText: {
    marginBottom: 15,
    textAlign: 'right',
  },
  modalHeading: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  activityIndicatorViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
