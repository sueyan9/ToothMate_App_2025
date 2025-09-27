import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Audio } from 'expo-av'; // Uncomment when you add audio files

const BrushingTimerScreen = ({ navigation }) => {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [sound, setSound] = useState();
  
  // Animation values
  const danceAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const bounceAnimation = useRef(new Animated.Value(0)).current;
  const sparkleAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            playCompletionSound();
            showCompletionAlert();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isActive && timeLeft !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive) {
      startDanceAnimation();
      playBrushingMusic();
    } else {
      stopDanceAnimation();
      stopMusic();
    }
  }, [isActive]);

  const startDanceAnimation = () => {
    const danceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(danceAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(danceAnimation, {
          toValue: -1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(danceAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    const scaleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnimation, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    const sparkleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    danceLoop.start();
    scaleLoop.start();
    rotateLoop.start();
    bounceLoop.start();
    sparkleLoop.start();
  };

  const stopDanceAnimation = () => {
    danceAnimation.stopAnimation();
    scaleAnimation.stopAnimation();
    rotateAnimation.stopAnimation();
    bounceAnimation.stopAnimation();
    sparkleAnimation.stopAnimation();
  };

  const playBrushingMusic = async () => {
    try {
      // You would need to add music files to your assets
      // const { sound } = await Audio.Sound.createAsync(
      //   require('../../assets/sounds/brushing-song.mp3')
      // );
      // setSound(sound);
      // await sound.playAsync();
      console.log('Music would play here');
    } catch (error) {
      console.log('Error playing music:', error);
    }
  };

  const playCompletionSound = async () => {
    try {
      // You would need to add sound files to your assets
      // const { sound } = await Audio.Sound.createAsync(
      //   require('../../assets/sounds/success.mp3')
      // );
      // await sound.playAsync();
      console.log('Success sound would play here');
    } catch (error) {
      console.log('Error playing completion sound:', error);
    }
  };

  const stopMusic = async () => {
    if (sound) {
      // await sound.stopAsync();
      // await sound.unloadAsync();
      setSound(null);
    }
  };

  const startTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTimeLeft(120);
    setIsActive(false);
  };

  const showCompletionAlert = () => {
    Alert.alert(
      '🎉 Great Job!',
      'You\'ve brushed your teeth for 2 minutes! Your teeth are sparkling clean! 🦷✨',
      [
        {
          text: 'Brush Again',
          onPress: resetTimer,
        },
        {
          text: 'Done',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const danceTranslateX = danceAnimation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-20, 0, 20],
  });

  const rotateZ = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const bounceTranslateY = bounceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const sparkleOpacity = sparkleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <LinearGradient
      colors={['#FF6B9D', '#FF8E8E']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Brushing Timer</Text>
      </View>

      {/* Dancing Tooth Animation */}
      <View style={styles.animationContainer}>
        {/* Sparkle effects */}
        <Animated.View style={[styles.sparkle, { opacity: sparkleOpacity, top: 50, left: 50 }]}>
          <Text style={styles.sparkleText}>✨</Text>
        </Animated.View>
        <Animated.View style={[styles.sparkle, { opacity: sparkleOpacity, bottom: 100, left: 40 }]}>
          <Text style={styles.sparkleText}>💫</Text>
        </Animated.View>
        <Animated.View style={[styles.sparkle, { opacity: sparkleOpacity, bottom: 60, right: 50 }]}>
          <Text style={styles.sparkleText}>✨</Text>
        </Animated.View>

        {/* Main Dancing Tooth */}
        <Animated.View
          style={[
            styles.toothContainer,
            {
              transform: [
                { translateX: danceTranslateX },
                { translateY: bounceTranslateY },
                { scale: scaleAnimation },
                { rotate: rotateZ },
              ],
            },
          ]}
        >
          <Text style={styles.toothEmoji}>🦷</Text>
          {isActive && (
            <View style={styles.toothFace}>
              <Text style={styles.toothEyes}>😊</Text>
            </View>
          )}
        </Animated.View>

        {/* Brushing encouragement text */}
        {isActive && (
          <Animated.View style={[styles.encouragementContainer, { opacity: sparkleOpacity }]}>
            <Text style={styles.encouragementText}>
              {timeLeft > 90 ? "Let's brush those front teeth! 🦷" :
               timeLeft > 60 ? "Don't forget the back teeth! 😁" :
               timeLeft > 30 ? "Almost done! Keep going! 💪" :
               "Final countdown! You're amazing! 🎉"}
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        <Text style={styles.timerLabel}>
          {timeLeft === 120 && !isActive ? "Ready to brush?" :
           timeLeft === 0 ? "Perfect! Great job!" :
           isActive ? "Keep brushing!" : "Paused"}
        </Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.controlButton, styles.startButton]}
          onPress={startTimer}
        >
          <MaterialIcons 
            name={isActive ? "pause" : "play-arrow"} 
            size={32} 
            color="white" 
          />
          <Text style={styles.buttonText}>
            {isActive ? "Pause" : timeLeft === 120 ? "Start" : "Resume"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, styles.resetButton]}
          onPress={resetTimer}
        >
          <MaterialIcons name="refresh" size={32} color="white" />
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Brushing Tips</Text>
        <Text style={styles.tipsText}>
          • Use gentle circular motions{'\n'}
          • Don't forget your tongue!{'\n'}
          • Brush twice a day for healthy teeth
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkleText: {
    fontSize: 24,
  },
  toothContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toothEmoji: {
    fontSize: 120,
    textAlign: 'center',
  },
  toothFace: {
    position: 'absolute',
    top: 40,
  },
  toothEyes: {
    fontSize: 24,
  },
  encouragementContainer: {
    position: 'absolute',
    bottom: -50,
    paddingHorizontal: 20,
  },
  encouragementText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  timerLabel: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  resetButton: {
    backgroundColor: '#FF5722',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tipsContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  tipsText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
});

export default BrushingTimerScreen;