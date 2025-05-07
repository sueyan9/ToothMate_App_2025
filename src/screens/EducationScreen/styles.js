import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  topicStyle: {
    borderColor: 'grey',
    borderRadius: 11,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 2,
    marginBottom: 1,
  },
  titleTextStyle: {
    fontSize: 50,
    marginTop: '15%',
    alignSelf: 'center',
    fontFamily: 'Righteous_400Regular',
  },
  subTitleTextStyle: {
    fontSize: 24,
    marginLeft: '1.5%',
    marginBottom: 20,
    marginTop: 20,
    alignSelf: 'center',
    fontFamily: 'VarelaRound_400Regular',
  },
  topicText: {
    flex: 1,
    fontSize: 25,
    alignSelf: 'flex-start',
    marginLeft: 15,
  },
  screenStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  activityIndicatorViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
