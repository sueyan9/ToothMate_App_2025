import React, { useState , useLayoutEffect } from 'react';
import { View, ScrollView, Text, Dimensions, Platform , TouchableOpacity} from 'react-native';
import { Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import ImageZoom from 'react-native-image-pan-zoom';
import AppointmentImage from '../../components/AppointmentImage';
import styles from './styles';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const ImagesScreen = ({ route }) => {

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Images',
      headerShown: true,
      headerTransparent: true,          // 要不透明就改成 false
      headerBackTitleVisible: false,
      headerTintColor: '#333',          // 箭头颜色
      headerLeft: () => (
          <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 12, paddingVertical: 6 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
      ),
    });
  }, [navigation]);
  // read parameter from route.params
  const { imageIndex = 0, images = [] } = route.params || {};

  const [currentImageIndex, setCurrentImageIndex] = useState(imageIndex);

  const hasPreviousImage = currentImageIndex > 0;
  const hasNextImage = currentImageIndex < images.length - 1;

  const showNextImage = () => {
    if (hasNextImage) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const showPreviousImage = () => {
    if (hasPreviousImage) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const getButtons = () => {
    if (images.length > 1) {
      return (
          <View style={styles.buttonViewStyle}>
            <Button
                buttonStyle={styles.button}
                titleStyle={styles.buttonTitle}
                title="Previous"
                onPress={showPreviousImage}
                disabled={!hasPreviousImage}
            />
            <Button
                buttonStyle={styles.button}
                titleStyle={styles.buttonTitle}
                title="Next"
                onPress={showNextImage}
                disabled={!hasNextImage}
            />
          </View>
      );
    }
  };

  if (images.length === 0) {
    return (
        <LinearGradient colors={['#78d0f5', '#fff', '#78d0f5']} style={styles.container}>
          <Text>No images available</Text>
        </LinearGradient>
    );
  }

  const currentImage = images[currentImageIndex];

  return (
      <LinearGradient colors={['#78d0f5', '#fff', '#78d0f5']} style={styles.container}>
        <ScrollView>
          <View style={styles.containerImage}>
            <ImageZoom cropWidth={Dimensions.get('window').width} cropHeight={500} imageWidth={400} imageHeight={300}>
              <AppointmentImage base64={currentImage} />
            </ImageZoom>
            {getButtons()}
          </View>
        </ScrollView>
      </LinearGradient>
  );
};

// // Header Options
// ImagesScreen.navigationOptions = () => {
//   return {
//     title: 'Images',
//     headerTintColor: 'black',
//     headerBackTitleVisible: false,
//     safeAreaInsets: Platform.OS === 'ios' ? { top: 45 } : { top: 30 },
//     headerStyle: {
//       backgroundColor: '#78d0f5',
//     },
//     cardStyle: {
//       backgroundColor: 'white',
//     },
//   };
// };

export default ImagesScreen;
