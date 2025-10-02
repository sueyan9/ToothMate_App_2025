import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const CavityMonstersScreen = ({ navigation }) => {
  const [gameState, setGameState] = useState('menu');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [collectedItems, setCollectedItems] = useState([]);
  
  const [pulseAnim] = useState(new Animated.Value(1));
  const [playerAnim] = useState(new Animated.Value(0));

  const quizQuestions = [
    {
      id: 1,
      question: "How many times should you brush your teeth each day?",
      options: ["Once", "Twice", "Three times", "Never"],
      correct: 1,
      explanation: "You should brush twice a day - morning and night!"
    },
    {
      id: 2,
      question: "Which food is GOOD for your teeth?",
      options: ["Candy", "Soda", "Cheese", "Cookies"],
      correct: 2,
      explanation: "Cheese is rich in calcium which makes teeth strong!"
    },
    {
      id: 3,
      question: "How long should you brush your teeth?",
      options: ["30 seconds", "1 minute", "2 minutes", "5 minutes"],
      correct: 2,
      explanation: "Brush for 2 minutes to clean all your teeth properly!"
    },
    {
      id: 4,
      question: "What should you do after eating sugary snacks?",
      options: ["Take a nap", "Drink water", "Eat more candy", "Watch TV"],
      correct: 1,
      explanation: "Drinking water helps wash away sugar and bacteria!"
    },
    {
      id: 5,
      question: "Which tool helps clean between your teeth?",
      options: ["Toothbrush", "Floss", "Fork", "Pencil"],
      correct: 1,
      explanation: "Floss helps remove food and plaque between teeth!"
    }
  ];

  const mazeLayouts = {
    1: [
      [0, 2, 1, 0, 2, 1, 0, 2],
      [0, 1, 1, 0, 3, 1, 0, 0],
      [0, 1, 1, 0, 1, 0, 0, 0],
      [0, 1, 1, 4, 0, 0, 1, 0],
      [0, 0, 4, 0, 1, 1, 1, 0],
      [2, 3, 0, 1, 1, 0, 0, 0],
      [1, 3, 1, 1, 1, 0, 1, 1],
      [1, 1, 1, 2, 0, 0, 0, 5]
    ],
    2: [
      [0, 1, 0, 2, 1, 0, 3, 0],
      [0, 1, 0, 1, 0, 0, 1, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [1, 1, 4, 0, 1, 1, 0, 1],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 1, 1, 2, 0, 1, 3, 0],
      [0, 0, 0, 1, 0, 0, 1, 4],
      [2, 1, 0, 0, 0, 1, 0, 5]
    ]
  };

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    const playerAnimation = Animated.loop(
      Animated.timing(playerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    playerAnimation.start();

    return () => {
      pulse.stop();
      playerAnimation.stop();
    };
  }, []);

  const startGame = () => {
    setGameState('playing');
    setCurrentLevel(1);
    setPlayerPosition({ x: 0, y: 0 });
    setScore(0);
    setLives(3);
    setCollectedItems([]);
  };

  const movePlayer = (direction) => {
    const currentMaze = mazeLayouts[currentLevel];
    let newX = playerPosition.x;
    let newY = playerPosition.y;

    switch (direction) {
      case 'up':
        newY = Math.max(0, playerPosition.y - 1);
        break;
      case 'down':
        newY = Math.min(7, playerPosition.y + 1);
        break;
      case 'left':
        newX = Math.max(0, playerPosition.x - 1);
        break;
      case 'right':
        newX = Math.min(7, playerPosition.x + 1);
        break;
    }

    if (currentMaze[newY] && currentMaze[newY][newX] !== 1) {
      setPlayerPosition({ x: newX, y: newY });
      handleCellInteraction(currentMaze[newY][newX], newX, newY);
    }
  };

  const handleCellInteraction = (cellType, x, y) => {
    switch (cellType) {
      case 2:
        if (!collectedItems.includes(`${x}-${y}`)) {
          setCollectedItems(prev => [...prev, `${x}-${y}`]);
          setScore(prev => prev + 10);
          Alert.alert('🪥 Power-up!', 'You found a magic toothbrush! +10 points!');
        }
        break;
      case 3:
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameState('gameOver');
            Alert.alert('💀 Oh no!', 'The cavity monsters got you! Try again!');
          } else {
            Alert.alert('👾 Cavity Monster!', `A sugar bug attacked you! Lives left: ${newLives}`);
          }
          return newLives;
        });
        break;
      case 4:
        const randomQuiz = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
        setCurrentQuiz(randomQuiz);
        setGameState('quiz');
        break;
      case 5:
        if (currentLevel < 2) {
          Alert.alert('🎉 Level Complete!', 'Moving to next level!', [
            {
              text: 'Next Level',
              onPress: () => {
                setCurrentLevel(2);
                setPlayerPosition({ x: 0, y: 0 });
                setScore(prev => prev + 50);
              }
            }
          ]);
        } else {
          setGameState('victory');
          Alert.alert('🏆 Victory!', 'You defeated all the cavity monsters!');
        }
        break;
    }
  };

  const handleQuizAnswer = (selectedOption) => {
    if (selectedOption === currentQuiz.correct) {
      setScore(prev => prev + 20);
      Alert.alert('✅ Correct!', currentQuiz.explanation, [
        {
          text: 'Continue',
          onPress: () => {
            setCurrentQuiz(null);
            setGameState('playing');
          }
        }
      ]);
    } else {
      Alert.alert('❌ Try Again!', currentQuiz.explanation, [
        {
          text: 'Continue',
          onPress: () => {
            setCurrentQuiz(null);
            setGameState('playing');
          }
        }
      ]);
    }
  };

  const renderMazeCell = (cellType, x, y) => {
    const isPlayer = playerPosition.x === x && playerPosition.y === y;
    const isCollected = collectedItems.includes(`${x}-${y}`);
    
    let cellContent = '';
    let cellStyle = styles.pathCell;

    switch (cellType) {
      case 1:
        cellStyle = styles.wallCell;
        break;
      case 2:
        if (!isCollected) {
          cellContent = '🪥';
        }
        break;
      case 3:
        cellContent = '👾';
        break;
      case 4:
        cellContent = '❓';
        break;
      case 5:
        cellContent = '🏁';
        break;
      default:
        cellContent = '';
        break;
    }

    return (
      <View key={`${x}-${y}`} style={[styles.mazeCell, cellStyle]}>
        <Text style={styles.cellEmoji}>{cellContent}</Text>
        {isPlayer && (
          <Animated.View 
            style={[
              styles.player,
              {
                transform: [{
                  rotate: playerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })
                }]
              }
            ]}
          >
            <Text style={styles.playerEmoji}>🦷</Text>
          </Animated.View>
        )}
      </View>
    );
  };

  if (gameState === 'menu') {
    return (
      <LinearGradient colors={['#A8E6CF', '#7FCDCD']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.gameTitle}>Tooth Maze Adventure</Text>
          
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>How to Play:</Text>
            <Text style={styles.instructionText}>• Navigate through the maze as a brave tooth!</Text>
            <Text style={styles.instructionText}>• Collect magic toothbrushes for points</Text>
            <Text style={styles.instructionText}>• Answer dental questions at quiz spots</Text>
            <Text style={styles.instructionText}>• Avoid cavity monsters or lose lives</Text>
            <Text style={styles.instructionText}>• Reach the finish flag to win!</Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.buttonGradient}
            >
              <MaterialIcons name="play-arrow" size={32} color="white" />
              <Text style={styles.startButtonText}>Start Adventure!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  if (gameState === 'quiz') {
    return (
      <LinearGradient colors={['#FFD93D', '#FF9A56']} style={styles.container}>
        <View style={styles.quizContainer}>
          <Text style={styles.quizTitle}>Dental Knowledge Quiz! 🧠</Text>
          <Text style={styles.quizQuestion}>{currentQuiz?.question}</Text>
          
          <View style={styles.optionsContainer}>
            {currentQuiz?.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleQuizAnswer(index)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (gameState === 'victory') {
    return (
      <LinearGradient colors={['#FFD93D', '#FF9A56']} style={styles.container}>
        <View style={styles.victoryContainer}>
          <Text style={styles.victoryTitle}>🏆 VICTORY! 🏆</Text>
          <Text style={styles.victoryText}>
            You're a true Dental Hero! You navigated the maze, defeated the cavity monsters, and showed great dental knowledge!
          </Text>
          
          <View style={styles.finalStats}>
            <Text style={styles.statText}>Final Score: {score}</Text>
            <Text style={styles.statText}>Level Completed: {currentLevel}</Text>
            <Text style={styles.statText}>Items Collected: {collectedItems.length}</Text>
          </View>

          <View style={styles.gameOverButtons}>
            <TouchableOpacity style={styles.retryButton} onPress={startGame}>
              <Text style={styles.retryButtonText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={() => setGameState('menu')}>
              <Text style={styles.menuButtonText}>Main Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <LinearGradient colors={['#FF8A80', '#FFCDD2']} style={styles.container}>
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>Game Over! 💀</Text>
          <Text style={styles.gameOverText}>
            The cavity monsters got you this time! Don't worry, every hero learns from experience!
          </Text>
          
          <View style={styles.finalStats}>
            <Text style={styles.statText}>Final Score: {score}</Text>
            <Text style={styles.statText}>Level Reached: {currentLevel}</Text>
            <Text style={styles.statText}>Items Collected: {collectedItems.length}</Text>
          </View>

          <View style={styles.gameOverButtons}>
            <TouchableOpacity style={styles.retryButton} onPress={startGame}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={() => setGameState('menu')}>
              <Text style={styles.menuButtonText}>Main Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  const currentMaze = mazeLayouts[currentLevel];

  return (
    <View style={styles.container}>
      <View style={styles.gameHeader}>
        <TouchableOpacity style={styles.pauseButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="home" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.gameStats}>
          <Text style={styles.statText}>Score: {score}</Text>
          <Text style={styles.statText}>Lives: {'❤️'.repeat(lives)}</Text>
          <Text style={styles.statText}>Level: {currentLevel}</Text>
        </View>

        <View style={styles.placeholder} />
      </View>

      <View style={styles.mazeContainer}>
        <Text style={styles.levelTitle}>Level {currentLevel} - Find the Flag! 🏁</Text>
        <View style={styles.maze}>
          {currentMaze.map((row, y) =>
            row.map((cell, x) => renderMazeCell(cell, x, y))
          )}
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlButton} onPress={() => movePlayer('up')}>
            <MaterialIcons name="keyboard-arrow-up" size={32} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlButton} onPress={() => movePlayer('left')}>
            <MaterialIcons name="keyboard-arrow-left" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={() => movePlayer('down')}>
            <MaterialIcons name="keyboard-arrow-down" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={() => movePlayer('right')}>
            <MaterialIcons name="keyboard-arrow-right" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.legendContainer}>
        <Text style={styles.legendText}>🪥 = Points  👾 = Monster  ❓ = Quiz  🏁 = Finish</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  instructionsCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 30,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 15,
    color: '#2C3E50',
    marginBottom: 8,
    lineHeight: 20,
  },
  startButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    width: '100%',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
  },
  gameStats: {
    alignItems: 'center',
  },
  statText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  mazeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  maze: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width - 40,
    height: width - 40,
    borderWidth: 2,
    borderColor: '#2C3E50',
    borderRadius: 8,
  },
  mazeCell: {
    width: (width - 44) / 8,
    height: (width - 44) / 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pathCell: {
    backgroundColor: '#F8F9FA',
  },
  wallCell: {
    backgroundColor: '#34495e',
  },
  cellEmoji: {
    fontSize: 16,
  },
  player: {
    position: 'absolute',
    zIndex: 10,
  },
  playerEmoji: {
    fontSize: 20,
  },
  controlsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: '#3498db',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  legendContainer: {
    backgroundColor: '#ECF0F1',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  legendText: {
    fontSize: 12,
    color: '#2C3E50',
    textAlign: 'center',
    paddingBottom: 40,
    paddingTop: 10,
  },
  quizContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  quizTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  quizQuestion: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
    fontWeight: '600',
  },
  victoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  victoryTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  victoryText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  gameOverText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  finalStats: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  gameOverButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuButton: {
    backgroundColor: '#757575',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  menuButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CavityMonstersScreen;