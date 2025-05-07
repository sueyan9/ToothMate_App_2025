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
  imageBackgroundStyle: {
    paddingTop: '15%',
    height: Platform.OS === 'ios' ? Dimensions.get('window').height * 0.3 : Dimensions.get('window').height * 0.4,
    width: Dimensions.get('window').width * 0.6,
    alignSelf: 'center',
  },
  activityIndicatorViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
