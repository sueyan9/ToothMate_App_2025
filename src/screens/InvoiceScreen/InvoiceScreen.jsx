import React from 'react';
import { View, ScrollView, Text, Platform } from 'react-native';
import AppointmentPDF from '../../components/AppointmentPDF';
import styles from './styles';

const InvoiceScreen = ({ route }) => {
  // 获取传递的 pdf 参数
  const { pdf: base64pdf } = route.params || {}; // 如果没有传递 pdf 参数，默认值为 undefined

  // 处理没有传递 PDF 的情况
  if (!base64pdf) {
    return (
        <View style={styles.container}>
          <Text>No PDF available</Text>
        </View>
    );
  }

  return (
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={styles.container}>
          <AppointmentPDF base64={base64pdf} />
        </View>
      </ScrollView>
  );
};

// Header Options
InvoiceScreen.navigationOptions = () => {
  return {
    title: 'Invoice',
    headerTintColor: 'black',
    headerBackTitleVisible: false,
    safeAreaInsets: Platform.OS === 'ios' ? { top: 45 } : { top: 30 },
    headerStyle: {
      backgroundColor: '#78d0f5',
    },
    cardStyle: {
      backgroundColor: 'white',
    },
  };
};

export default InvoiceScreen;
