import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LearnTeethScreen = ({ navigation }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const topics = [
    {
      id: 'tooth-types',
      title: 'Types of Teeth',
      emoji: '🦷',
      color: ['#FF9A9E', '#FECFEF'],
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
      color: ['#A8EDEA', '#FED6E3'],
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
      color: ['#FBAB7E', '#F7CE68'],
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
      color: ['#FF8A80', '#FFCDD2'],
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
      color: ['#667eea', '#764ba2'],
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
      color: ['#ffecd2', '#fcb69f'],
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
      <LinearGradient
        colors={selectedTopic.color}
        style={styles.container}
      >
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
              // Navigate to quiz about this topic
              navigation.navigate('QuizAdventure', { topic: selectedTopic.id });
            }}
          >
            <MaterialIcons name="quiz" size={24} color="white" />
            <Text style={styles.quizButtonText}>Test Your Knowledge!</Text>
          </TouchableOpacity>
        </Animated.ScrollView>
      </LinearGradient>
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
        
        {topics.map((topic, index) => (
          <TouchableOpacity
            key={topic.id}
            style={styles.topicCard}
            onPress={() => handleTopicPress(topic)}
          >
            <LinearGradient
              colors={topic.color}
              style={styles.topicGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.topicCardEmoji}>{topic.emoji}</Text>
              <View style={styles.topicInfo}>
                <Text style={styles.topicCardTitle}>{topic.title}</Text>
                <MaterialIcons name="arrow-forward" size={24} color="white" />
              </View>
            </LinearGradient>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  topicsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginVertical: 20,
  },
  topicCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  topicGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  topicCardEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  topicInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topicCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topicHeader: {
    alignItems: 'center',
    marginVertical: 30,
  },
  topicEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  topicTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  factsContainer: {
    marginBottom: 30,
  },
  factCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  factIcon: {
    fontSize: 24,
    marginRight: 16,
    minWidth: 32,
    textAlign: 'center',
  },
  factText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
  },
  quizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  quizButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  encouragementSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  encouragementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 12,
  },
  encouragementText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default LearnTeethScreen;