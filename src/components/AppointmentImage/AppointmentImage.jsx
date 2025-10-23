import React from 'react';
import { Image } from 'react-native';
import styles from './styles';

const AppointmentImage = props => {
  const { base64 } = props;

  return <Image style={styles.imgStyle} source={{ uri: `data:image/png;base64,${base64}` }} />;
};

export default AppointmentImage;
