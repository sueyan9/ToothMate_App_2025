import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from './styles';

// Component for calling and texting
const Caller = props => {
  const { phone, email, url } = props;

  const phoneLink = `tel:${phone}`;
  const emailLink = `mailto:${email}`;

  const handlePhonePress = () => Linking.openURL(phoneLink);

  const handleEmailPress = () => Linking.openURL(emailLink);

  const handleBookingPress = async () => {
    if (Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  };

  return (
    <View style={styles.backgroundStyle}>
      {/* TouchableOpacity for Linking which opens phone calling application */}
      <TouchableOpacity onPress={handlePhonePress}>
        <View>
          <Ionicons name="call" style={styles.iconStyle} />
          <Text style={styles.textStyle}>Call</Text>
        </View>
      </TouchableOpacity>
      {/* TouchableOpacity for Linking which opens phone email application */}
      <TouchableOpacity onPress={handleEmailPress}>
        <View>
          <MaterialIcons name="email" style={styles.iconStyle} />
          <Text style={styles.textStyle}>Email</Text>
        </View>
      </TouchableOpacity>
      {/* TouchableOpacity for Linking which opens online booking system */}
      <TouchableOpacity onPress={handleBookingPress}>
        <View>
          <MaterialIcons name="book-online" style={styles.iconStyle} />
          <Text style={styles.textStyle}>Book Online</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Caller;
