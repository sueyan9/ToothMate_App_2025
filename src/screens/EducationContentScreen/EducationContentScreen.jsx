import React, { useContext } from 'react';
import { Text, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Context } from '../../context/EducationContext/EducationContext';
import styles from './styles';

const EducationContentScreen = ({ route, navigation }) => {
  const { state } = useContext(Context);

  const { id } = route.params;
  const educationContent = state.find(educationContent => educationContent._id === id);

  if (!educationContent) {
    return <Text style={styles.errorText}>Content not found</Text>;
  }

  const { topic, content } = educationContent;

  return (
      <LinearGradient colors={['#78d0f5', 'white', '#78d0f5']} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{topic}</Text>
          <Text style={styles.contentStyle}>{content}</Text>
        </ScrollView>
      </LinearGradient>
  );
};

// Header Options
EducationContentScreen.navigationOptions = () => {
  return {
    title: 'Education',
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

export default EducationContentScreen;
