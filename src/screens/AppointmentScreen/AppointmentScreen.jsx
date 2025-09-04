import { Buffer } from 'buffer';
import dayjs from 'dayjs';
import React from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import Spacer from '../../components/Spacer';
import styles from './styles';

global.Buffer = global.Buffer || Buffer.Buffer;

const AppointmentScreen = ({ route, navigation }) => {
  const appointment = route?.params?.appointment || {};
  const { images = [], pdfs = [], date, notes } = appointment;

  const base64images = React.useMemo(
      () => images.map(image => Buffer.from(image.img.data.data).toString('base64')),
      [images],
  );

  const base64pdf = React.useMemo(() => Buffer.from(pdfs[0]?.pdf?.data?.data || '').toString('base64'), [pdfs]);

  const displayDate = React.useMemo(() => {
    return dayjs(date).format('DD/MM/YYYY');
  }, [date]);

  return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.heading}>
            <Text style={styles.headingFont}>Appointment Date</Text>
          </View>
          <Text style={styles.title}>{displayDate}</Text>
          <Spacer />
          {pdfs.length > 0 && (
              <Button
                  buttonStyle={styles.button}
                  containerStyle={styles.buttonContainer}
                  titleStyle={styles.buttonText}
                  title="Invoice"
                  onPress={() => navigation.navigate('invoice', { pdf: base64pdf })}
              />
          )}
          <Spacer />
          {images.length > 0 && (
              <Button
                  buttonStyle={styles.button}
                  containerStyle={styles.buttonContainer}
                  titleStyle={styles.buttonText}
                  title="Images"
                  onPress={() => navigation.navigate('images', { images: base64images })}
              />
          )}
          <Spacer />
          <View style={styles.heading}>
            <Text style={styles.headingFont}>Dentist's Notes</Text>
          </View>
          <Text style={styles.title}>{notes}</Text>
        </View>
      </ScrollView>
  );
};

// Header Options
AppointmentScreen.navigationOptions = () => {
  return {
    title: 'Your Appointment',
    headerTintColor: 'black',
    headerBackTitleVisible: false,
    safeAreaInsets: Platform.OS === 'ios' ? { top: 45 } : { top: 30 },
    headerStyle: {
      backgroundColor: '#78d0f5',
      borderBottomWidth: 0,
      shadowOpacity: 0,
      elevation: 0,
    },
  };
};

export default AppointmentScreen;
