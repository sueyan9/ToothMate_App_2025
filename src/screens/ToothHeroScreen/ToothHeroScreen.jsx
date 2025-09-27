import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ToothHeroScreen = ({ navigation }) => {
  const [completedMissions, setCompletedMissions] = useState(new Set());
  const [heroPoints, setHeroPoints] = useState(0);
  const [heroLevel, setHeroLevel] = useState(1);

  const missions = [
    {
      id: 'morning-brush',
      title: 'Morning Warrior',
      description: 'Brush your teeth this morning',
      points: 50,
      icon: '🌅',
      difficulty: 'easy',
      color: '#FFD93D'
    },
    {
      id: 'evening-brush',
      title: 'Night Guardian',
      description: 'Brush your teeth before bed',
      points: 50,
      icon: '🌙',
      difficulty: 'easy',
      color: '#667eea'
    },
    {
      id: 'floss-master',
      title: 'Floss Master',
      description: 'Use dental floss today',
      points: 75,
      icon: '🦷',
      difficulty: 'medium',
      color: '#4ECDC4'
    },
    {
      id: 'water-hero',
      title: 'Hydration Hero',
      description: 'Drink 6 glasses of water',
      points: 30,
      icon: '💧',
      difficulty: 'easy',
      color: '#74b9ff'
    },
    {
      id: 'sugar-fighter',
      title: 'Sugar Fighter',
      description: 'Avoid sugary snacks all day',
      points: 100,
      icon: '🛡️',
      difficulty: 'hard',
      color: '#fd79a8'
    },
    {
      id: 'veggie-champion',
      title: 'Veggie Champion',
      description: 'Eat 3 servings of vegetables',
      points: 60,
      icon: '🥕',
      difficulty: 'medium',
      color: '#55a3ff'
    },
    {
      id: 'mouthwash-master',
      title: 'Mouthwash Master',
      description: 'Use mouthwash after brushing',
      points: 40,
      icon: '🧴',
      difficulty: 'easy',
      color: '#a29bfe'
    },
    {
      id: 'healthy-snack',
      title: 'Smart Snacker',
      description: 'Choose a tooth-friendly snack',
      points: 35,
      icon: '🍎',
      difficulty: 'easy',
      color: '#fd6c6c'
    }
  ];

  const badges = [
    { level: 1, title: 'Tooth Apprentice', points: 0, emoji: '🦷' },
    { level: 2, title: 'Smile Cadet', points: 200, emoji: '😊' },
    { level: 3, title: 'Dental Warrior', points: 500, emoji: '⚔️' },
    { level: 4, title: 'Cavity Fighter', points: 800, emoji: '🛡️' },
    { level: 5, title: 'Tooth Hero', points: 1200, emoji: '🦸‍♂️' },
    { level: 6, title: 'Smile Legend', points: 1600, emoji: '👑' }
  ];

  useEffect(() => {
    // Calculate hero level based on points
    const currentBadge = badges.reverse().find(badge => heroPoints >= badge.points) || badges[0];
    setHeroLevel(currentBadge.level);
  }, [heroPoints]);

  const handleMissionComplete = (mission) => {
    Alert.alert(
      '🎉 Mission Complete!',
      `Congratulations! You've completed "${mission.title}" and earned ${mission.points} Hero Points!`,
      [
        {
          text: 'Awesome!',
          onPress: () => {
            setCompletedMissions(prev => new Set([...prev, mission.id]));
            setHeroPoints(prev => prev + mission.points);
          }
        }
      ]
    );
  };

  const getCurrentBadge = () => {
    return badges.reverse().find(badge => heroPoints >= badge.points) || badges[0];
  };

  const getNextBadge = () => {
    const currentBadge = getCurrentBadge();
    return badges.find(badge => badge.level === currentBadge.level + 1);
  };

  const getProgressToNextLevel = () => {
    const nextBadge = getNextBadge();
    if (!nextBadge) return 100;
    const currentBadge = getCurrentBadge();
    const progress = ((heroPoints - currentBadge.points) / (nextBadge.points - currentBadge.points)) * 100;
    return Math.min(progress, 100);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#2ecc71';
      case 'medium': return '#f39c12';
      case 'hard': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const currentBadge = getCurrentBadge();
  const nextBadge = getNextBadge();

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#97cfffff', '#97cfffff']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tooth Hero Challenge</Text>
      </LinearGradient>

      {/* Hero Status */}
      <View style={styles.heroStatus}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeEmoji}>{currentBadge.emoji}</Text>
          <Text style={styles.badgeTitle}>{currentBadge.title}</Text>
          <Text style={styles.heroPoints}>{heroPoints} Hero Points</Text>
        </View>

        {nextBadge && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Progress to {nextBadge.title}: {Math.round(getProgressToNextLevel())}%
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${getProgressToNextLevel()}%` }]} 
              />
            </View>
            <Text style={styles.nextBadgeText}>
              Need {nextBadge.points - heroPoints} more points
            </Text>
          </View>
        )}
      </View>

      {/* Daily Missions */}
      <ScrollView style={styles.missionsContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Today's Missions 🎯</Text>

        {missions.map((mission) => {
          const isCompleted = completedMissions.has(mission.id);
          
          return (
            <TouchableOpacity
              key={mission.id}
              style={[
                styles.missionCard,
                isCompleted && styles.completedMission
              ]}
              onPress={() => !isCompleted && handleMissionComplete(mission)}
              disabled={isCompleted}
            >
              <LinearGradient
                colors={isCompleted ? ['#2ecc71', '#27ae60'] : [mission.color, mission.color + '90']}
                style={styles.missionGradient}
              >
                <View style={styles.missionLeft}>
                  <Text style={styles.missionIcon}>{mission.icon}</Text>
                  <View style={styles.missionInfo}>
                    <Text style={styles.missionTitle}>{mission.title}</Text>
                    <Text style={styles.missionDescription}>{mission.description}</Text>
                    <View style={styles.missionFooter}>
                      <View style={[
                        styles.difficultyBadge,
                        { backgroundColor: getDifficultyColor(mission.difficulty) }
                      ]}>
                        <Text style={styles.difficultyText}>{mission.difficulty.toUpperCase()}</Text>
                      </View>
                      <Text style={styles.missionPoints}>+{mission.points} points</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.missionRight}>
                  {isCompleted ? (
                    <View style={styles.completedIcon}>
                      <MaterialIcons name="check-circle" size={32} color="white" />
                    </View>
                  ) : (
                    <View style={styles.actionButton}>
                      <MaterialIcons name="touch-app" size={24} color="white" />
                    </View>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}

        {/* Achievement Gallery */}
        <View style={styles.achievementSection}>
          <Text style={styles.sectionTitle}>Hero Badges 🏆</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {badges.reverse().map((badge) => {
              const isUnlocked = heroPoints >= badge.points;
              
              return (
                <View
                  key={badge.level}
                  style={[
                    styles.badgeCard,
                    isUnlocked ? styles.unlockedBadge : styles.lockedBadge
                  ]}
                >
                  <Text style={[
                    styles.badgeCardEmoji,
                    !isUnlocked && styles.lockedEmoji
                  ]}>
                    {badge.emoji}
                  </Text>
                  <Text style={[
                    styles.badgeCardTitle,
                    !isUnlocked && styles.lockedText
                  ]}>
                    {badge.title}
                  </Text>
                  <Text style={[
                    styles.badgeCardPoints,
                    !isUnlocked && styles.lockedText
                  ]}>
                    {badge.points} pts
                  </Text>
                  {badge.level === currentBadge.level && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentText}>CURRENT</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
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
    paddingVertical: 20,
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
  heroStatus: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeEmoji: {
    fontSize: 60,
    marginBottom: 8,
  },
  badgeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  heroPoints: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD93D',
  },
  nextBadgeText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  missionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
    textAlign: 'center',
  },
  missionCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  completedMission: {
    opacity: 0.8,
  },
  missionGradient: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  missionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  missionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  missionDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  missionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  missionPoints: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  missionRight: {
    marginLeft: 16,
  },
  completedIcon: {
    opacity: 1,
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 8,
  },
  achievementSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  badgeCard: {
    width: 100,
    height: 120,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unlockedBadge: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedBadge: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  badgeCardEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  lockedEmoji: {
    opacity: 0.3,
  },
  badgeCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeCardPoints: {
    fontSize: 10,
    color: '#7F8C8D',
  },
  lockedText: {
    color: '#BDC3C7',
  },
  currentBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFD93D',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  currentText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ToothHeroScreen;