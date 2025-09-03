import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import dayjs from 'dayjs';
import { Buffer } from 'buffer';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Spacer from '../../components/Spacer';
import styles from './styles';

global.Buffer = global.Buffer || Buffer.Buffer;
dayjs.extend(utc);
dayjs.extend(tz);

const NZ_TZ = 'Pacific/Auckland';

const AppointmentScreen = ({ route }) => {
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

  const base64pdf = React.useMemo(() => Buffer.from(pdfs[0]?.pdf?.data?.data || '').toString('base64'), [pdfs]);

  return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.heading}>
            <Text style={styles.headingFont}>Appointment Date</Text>
          </View>
          <Text style={styles.title}>{displayDate}</Text>
          <Text style={styles.subtitle}>{displayTime}</Text>
          <Spacer />

          <View style={styles.heading}>
            <Text style={styles.headingFont}>Dentist</Text>
          </View>
          <Text style={styles.title}>{dentist?.name || '-'}</Text>
          <Spacer />

          <View style={styles.heading}>
            <Text style={styles.headingFont}>Clinic</Text>
          </View>
          <Text style={styles.title}>{clinic?.name || '-'}</Text>
          <Text style={styles.subtitle}>{clinic?.location || '-'}</Text>
          {!!clinic?.phone && <Text style={styles.subtitle}>{clinic.phone}</Text>}
          <Spacer />

          <View style={styles.heading}>
            <Text style={styles.headingFont}>Purpose</Text>
          </View>
          <Text style={styles.title}>{purpose || '-'}</Text>
          <Spacer />

          <View style={styles.heading}>
            <Text style={styles.headingFont}>Notes</Text>
          </View>
          <Text style={styles.title}>{notes || '-'}</Text>
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
