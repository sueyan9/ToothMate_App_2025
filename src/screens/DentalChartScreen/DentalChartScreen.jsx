import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview'; // need npm install react-native-webview

const DentalChartScreen = () => (
    <View style={{ flex: 1 }}>
      {/* <Text style={styles.header}>3D Mouth Model</Text> */}
      <WebView
          source={{ uri: 'http://172.29.88.206:3001/' }} // H5 page url
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