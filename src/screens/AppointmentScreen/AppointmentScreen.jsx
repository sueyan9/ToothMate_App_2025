import { Buffer } from 'buffer';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useEffect, useMemo, useState } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import Spacer from '../../components/Spacer';
import { useTranslation } from '../../context/TranslationContext/useTranslation';
import styles from './styles';

global.Buffer = global.Buffer || Buffer.Buffer;

const NZ_TZ = 'Pacific/Auckland';

const AppointmentScreen = ({ route }) => {
  // Translation hook
  const { t, translateAndCache, currentLanguage } = useTranslation();
  
  // State to force re-render on language change
  const [refreshKey, setRefreshKey] = useState(0);

  // Define texts to translate
  const textsToTranslate = [
    'Appointment Date',
    'Dentist',
    'Clinic',
    'Purpose',
    'Notes',
    'Your Appointment'
  ];

  useEffect(() => {
    // Force re-render when language changes
    setRefreshKey(prev => prev + 1);
    
    // Translate texts when language changes
    if (currentLanguage !== 'en') {
      translateAndCache(textsToTranslate);
    }
  }, [currentLanguage]);

  const appt = route.params?.appointment || {};
  const {
    startAt,
    endAt,
    purpose,
    notes,
    dentist = {},
    clinic = {},
  } = appt;

  const displayDate = useMemo(
      () => (startAt ? dayjs(startAt).tz(NZ_TZ).format('DD/MM/YYYY') : '-'),
      [startAt]
  );

  const displayTime = useMemo(() => {
    if (!startAt || !endAt) return '-';
    const s = dayjs(startAt).tz(NZ_TZ).format('h:mm A');
    const e = dayjs(endAt).tz(NZ_TZ).format('h:mm A');
    return `${s} - ${e}`;
  }, [startAt, endAt]);

  return (
      <ScrollView key={refreshKey}>
        <View style={styles.container}>
          <View style={styles.heading}>
            <Text style={styles.headingFont}>{t('Appointment Date')}</Text>
          </View>
          <Text style={styles.title}>{displayDate}</Text>
          <Spacer />

          <View style={styles.heading}>
            <Text style={styles.headingFont}>{t('Dentist')}</Text>
          </View>
          <Text style={styles.title}>{dentist?.name || '-'}</Text>
          <Spacer />

          <View style={styles.heading}>
            <Text style={styles.headingFont}>{t('Clinic')}</Text>
          </View>
          <Text style={styles.title}>{clinic?.name || '-'}</Text>
          <Text style={styles.subtitle}>{clinic?.location || '-'}</Text>
          {!!clinic?.phone && <Text style={styles.subtitle}>{clinic.phone}</Text>}
          <Spacer />
          <View style={styles.heading}>
            <Text style={styles.headingFont}>{t("Dentist's Notes")}</Text>
          </View>
          <Text style={styles.title}>{notes}</Text>
        </View>
      </ScrollView>
  );
};

// Header Options
AppointmentScreen.navigationOptions = ({ t }) => {
  return {
    title: t ? t('Your Appointment') : 'Your Appointment',
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
