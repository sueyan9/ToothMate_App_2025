import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import dayjs from 'dayjs';
import { Buffer } from 'buffer';
import { useTranslation } from 'react-i18next'; // Add this import
import Spacer from '../../components/Spacer';
import styles from './styles';

global.Buffer = global.Buffer || Buffer.Buffer;

const AppointmentScreen = ({ route, navigation }) => {
  const { images = [], pdfs = [], date, notes } = route.params.appointment || {};
  const { t } = useTranslation(); // Add useTranslation hook

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
            <Text style={styles.headingFont}>{t('appointment.dateHeading')}</Text>
          </View>
          <Text style={styles.title}>{displayDate}</Text>
          <Spacer />
          {pdfs.length > 0 && (
              <Button
                  buttonStyle={styles.button}
                  containerStyle={styles.buttonContainer}
                  titleStyle={styles.buttonText}
                  title={t('appointment.invoiceButton')}
                  onPress={() => navigation.navigate('invoice', { pdf: base64pdf })}
              />
          )}
          <Spacer />
          {images.length > 0 && (
              <Button
                  buttonStyle={styles.button}
                  containerStyle={styles.buttonContainer}
                  titleStyle={styles.buttonText}
                  title={t('appointment.imagesButton')}
                  onPress={() => navigation.navigate('images', { images: base64images })}
              />
          )}
          <Spacer />
          <View style={styles.heading}>
            <Text style={styles.headingFont}>{t('appointment.notesHeading')}</Text>
          </View>
          <Text style={styles.title}>{notes}</Text>
        </View>
      </ScrollView>
  );
};

// Remove the static navigationOptions as we're handling titles in App.jsx
export default AppointmentScreen;
