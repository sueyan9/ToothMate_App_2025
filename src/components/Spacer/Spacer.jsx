import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const Spacer = props => {
  const { children } = props;

  return <View style={styles.spacer}>{children}</View>;
};

export default Spacer;
