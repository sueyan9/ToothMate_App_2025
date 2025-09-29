import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Animated, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

const LearnTeethScreen = ({ navigation }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const topics = [
    {
      id: 'tooth-types',
      title: 'Types of Teeth',
      emoji: '🦷',
      color: '#FF9A9E',
      content: {
        title: 'Meet Your Tooth Family! 👨‍👩‍👧‍👦',
        facts: [
          { icon: '✂️', text: 'Incisors (front teeth) are like scissors - they cut food!' },
          { icon: '🗡️', text: 'Canines are pointed like fangs - they tear food apart!' },
          { icon: '🔨', text: 'Molars are flat and strong - they grind food like hammers!' },
          { icon: '👶', text: 'Baby teeth: You get 20 of them first!' },
          { icon: '👨', text: 'Adult teeth: 32 teeth when you grow up!' }
        ]
      }
    },
    {
      id: 'tooth-parts',
      title: 'Parts of a Tooth',
      emoji: '🏗️',
      color: '#A8EDEA',
      content: {
        title: 'Tooth Anatomy Adventure! 🔍',
        facts: [
          { icon: '👑', text: 'Crown: The white part you can see - like a tooth\'s hat!' },
          { icon: '🌱', text: 'Root: Hidden under your gums - like a tree\'s roots!' },
          { icon: '🛡️', text: 'Enamel: Super strong outer layer - stronger than bone!' },
          { icon: '🏠', text: 'Dentin: Yellow layer under enamel - your tooth\'s body!' },
          { icon: '💖', text: 'Pulp: The tooth\'s heart with nerves and blood!' }
        ]
      }
    },
    {
      id: 'good-foods',
      title: 'Tooth-Friendly Foods',
      emoji: '🥕',
      color: '#FBAB7E',
      content: {
        title: 'Super Foods for Super Teeth! 🦸‍♀️',
        facts: [
          { icon: '🥛', text: 'Milk & Cheese: Packed with calcium to make teeth strong!' },
          { icon: '🥕', text: 'Crunchy Veggies: Clean your teeth while you eat!' },
          { icon: '🍎', text: 'Apples: Nature\'s toothbrush - they scrub your teeth!' },
          { icon: '🐟', text: 'Fish: Full of vitamin D to help absorb calcium!' },
          { icon: '💧', text: 'Water: Washes away sugar and keeps your mouth clean!' }
        ]
      }
    },
    {
      id: 'bad-foods',
      title: 'Foods to Limit',
      emoji: '🍭',
      color: '#FF8A80',
      content: {
        title: 'Sugar Bugs Love These Foods! 🐛',
        facts: [
          { icon: '🍭', text: 'Candy: Sugar feeds cavity-causing bacteria!' },
          { icon: '🥤', text: 'Soda: Double trouble - sugar AND acid attack teeth!' },
          { icon: '🍪', text: 'Cookies: Sticky sweets cling to your teeth!' },
          { icon: '🍞', text: 'White bread: Turns into sugar in your mouth!' },
          { icon: '🍋', text: 'Citrus: Too much acid can weaken tooth enamel!' }
        ]
      }
    },
    {
      id: 'brushing-tips',
      title: 'How to Brush',
      emoji: '🪥',
      color: '#667eea',
      content: {
        title: 'Become a Brushing Champion! 🏆',
        facts: [
          { icon: '⏰', text: 'Brush for 2 minutes, twice a day!' },
          { icon: '🔄', text: 'Use gentle circular motions - no scrubbing!' },
          { icon: '🎯', text: 'Brush all surfaces: front, back, and chewing surfaces!' },
          { icon: '👅', text: 'Don\'t forget to brush your tongue!' },
          { icon: '🪥', text: 'Replace your toothbrush every 3 months!' }
        ]
      }
    },
    {
      id: 'fun-facts',
      title: 'Amazing Tooth Facts',
      emoji: '🤯',
      color: '#8ff7b0ff',
      content: {
        title: 'Mind-Blowing Tooth Facts! 🧠💥',
        facts: [
          { icon: '🦈', text: 'Sharks can grow 30,000 teeth in their lifetime!' },
          { icon: '🐘', text: 'Elephant teeth can weigh up to 9 pounds each!' },
          { icon: '💎', text: 'Tooth enamel is the hardest substance in your body!' },
          { icon: '👑', text: 'Your teeth are as unique as your fingerprints!' },
          { icon: '⚡', text: 'Ancient people used twigs as the first toothbrushes!' }
        ]
      }
    }
  ];

  const handleTopicPress = (topic) => {
    setSelectedTopic(topic);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleBackToTopics = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setSelectedTopic(null);
    });
  };

  if (selectedTopic) {
    return (
      <View style={[styles.container, { backgroundColor: selectedTopic.color }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToTopics}
          >
            <MaterialIcons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedTopic.title}</Text>
        </View>

        <Animated.ScrollView 
          style={[styles.contentContainer, { opacity: fadeAnim }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topicHeader}>
            <Text style={styles.topicEmoji}>{selectedTopic.emoji}</Text>
            <Text style={styles.topicTitle}>{selectedTopic.content.title}</Text>
          </View>

          <View style={styles.factsContainer}>
            {selectedTopic.content.facts.map((fact, index) => (
              <View key={index} style={styles.factCard}>
                <Text style={styles.factIcon}>{fact.icon}</Text>
                <Text style={styles.factText}>{fact.text}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.quizButton}
            onPress={() => {
              navigation.navigate('QuizAdventure', { topic: selectedTopic.id });
            }}
          >
            <MaterialIcons name="quiz" size={24} color="white" />
            <Text style={styles.quizButtonText}>Test Your Knowledge!</Text>
          </TouchableOpacity>
        </Animated.ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={28} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#2C3E50' }]}>Learn About Teeth</Text>
      </View>

      <ScrollView 
        style={styles.topicsContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Choose a Topic to Explore! 🚀</Text>
        
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={[styles.topicCard, { backgroundColor: topic.color }]}
            onPress={() => handleTopicPress(topic)}
          >
            <Text style={styles.topicCardEmoji}>{topic.emoji}</Text>
            <View style={styles.topicInfo}>
              <Text style={styles.topicCardTitle}>{topic.title}</Text>
              <MaterialIcons name="arrow-forward" size={24} color="white" />
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.encouragementSection}>
          <Text style={styles.encouragementTitle}>🌟 Keep Learning! 🌟</Text>
          <Text style={styles.encouragementText}>
            Every fact you learn helps you take better care of your teeth! 
            Knowledge is power for a healthy smile! 😁
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default LearnTeethScreen;
