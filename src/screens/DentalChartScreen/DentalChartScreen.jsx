import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview'; // need npm install react-native-webview

const DentalChartScreen = () => (
    <View style={{ flex: 1 }}>
      <WebView
          source={{ uri: 'https://00f5-156-62-117-28.ngrok-free.app' }} // H5 page url
          style={{ flex: 1 }}
      />
    </View>
);

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default DentalChartScreen;