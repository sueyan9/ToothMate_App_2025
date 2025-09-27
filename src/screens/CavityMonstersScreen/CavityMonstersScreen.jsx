import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CavityMonstersGame = ({ navigation }) => {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'paused', 'gameOver'
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [monsters, setMonsters] = useState([]);
  const [defenses, setDefenses] = useState([]);
  const [selectedDefense, setSelectedDefense] = useState(null);
  const [gameTime, setGameTime] = useState(0);
  
  // Animation values
  const [pulseAnim] = useState(new Animated.Value(1));

  const defenseTypes = [
    { id: 'toothbrush', name: 'Toothbrush', emoji: '🪥', cost: 50, damage: 30, range: 2, cooldown: 1000 },
    { id: 'floss', name: 'Floss', emoji: '🦷', cost: 75, damage: 20, range: 3, cooldown: 800 },
    { id: 'mouthwash', name: 'Mouthwash', emoji: '🧴', cost: 100, damage: 50, range: 1.5, cooldown: 1500 },
    { id: 'fluoride', name: 'Fluoride', emoji: '💎', cost: 150, damage: 80, range: 2.5, cooldown: 2000 }
  ];

  const monsterTypes = [
    { id: 'sugar-bug', name: 'Sugar Bug', emoji: '🐛', health: 30, speed: 1, points: 10 },
    { id: 'plaque-monster', name: 'Plaque Monster', emoji: '👾', health: 50, speed: 0.8, points: 20 },
    { id: 'cavity-king', name: 'Cavity King', emoji: '👹', health: 100, speed: 0.5, points: 50 },
    { id: 'tartar-titan', name: 'Tartar Titan', emoji: '🦴', health: 150, speed: 0.3, points: 75 }
  ];

  useEffect(() => {
    let gameLoop;
    if (gameState === 'playing') {
      gameLoop = setInterval(() => {
        setGameTime(prev => prev + 1);
        updateGame();
      }, 100);
    }
    return () => clearInterval(gameLoop);
  }, [gameState]);

  useEffect(() => {
    // Pulse animation for UI elements
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
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
    return () => pulse.stop();
  }, []);

  const updateGame = useCallback(() => {
    // Spawn monsters based on level and time
    if (Math.random() < 0.02 + (level * 0.005)) {
      spawnMonster();
    }

    // Update monster positions
    setMonsters(prevMonsters => 
      prevMonsters.map(monster => ({
        ...monster,
        x: monster.x + monster.speed,
      })).filter(monster => {
        if (monster.x >= 10) {
          // Monster reached the tooth!
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameState('gameOver');
            }
            return newLives;
          });
          return false;
        }
        return monster.health > 0;
      })
    );

    // Defense attacks
    setDefenses(prevDefenses => 
      prevDefenses.map(defense => {
        if (Date.now() - defense.lastAttack > defense.cooldown) {
          const nearbyMonster = findNearestMonster(defense);
          if (nearbyMonster) {
            attackMonster(nearbyMonster.id, defense.damage);
            return { ...defense, lastAttack: Date.now() };
          }
        }
        return defense;
      })
    );
  }, [level]);

  const spawnMonster = () => {
    const monsterType = monsterTypes[Math.floor(Math.random() * Math.min(monsterTypes.length, Math.floor(level / 2) + 1))];
    const newMonster = {
      id: Date.now() + Math.random(),
      ...monsterType,
      x: -1,
      y: Math.floor(Math.random() * 5) + 1,
      maxHealth: monsterType.health,
    };
    setMonsters(prev => [...prev, newMonster]);
  };

  const findNearestMonster = (defense) => {
    return monsters.find(monster => {
      const distance = Math.sqrt(
        Math.pow(monster.x - defense.x, 2) + Math.pow(monster.y - defense.y, 2)
      );
      return distance <= defense.range && monster.health > 0;
    });
  };

  const attackMonster = (monsterId, damage) => {
    setMonsters(prev => 
      prev.map(monster => {
        if (monster.id === monsterId) {
          const newHealth = monster.health - damage;
          if (newHealth <= 0) {
            setScore(prevScore => prevScore + monster.points);
            return null;
          }
          return { ...monster, health: newHealth };
        }
        return monster;
      }).filter(Boolean)
    );
  };

  const placeDefense = (x, y) => {
    if (!selectedDefense || score < selectedDefense.cost) return;

    const newDefense = {
      id: Date.now(),
      ...selectedDefense,
      x,
      y,
      lastAttack: 0,
    };

    setDefenses(prev => [...prev, newDefense]);
    setScore(prev => prev - selectedDefense.cost);
    setSelectedDefense(null);
  };

  const startGame = () => {
    setGameState('playing');
    setScore(100); // Starting money
    setLives(3);
    setLevel(1);
    setMonsters([]);
    setDefenses([]);
    setGameTime(0);
  };

  const pauseGame = () => {
    setGameState(gameState === 'paused' ? 'playing' : 'paused');
  };

  const resetGame = () => {
    setGameState('menu');
    setScore(0);
    setLives(3);
    setLevel(1);
    setMonsters([]);
    setDefenses([]);
    setSelectedDefense(null);
  };

  const renderGameGrid = () => {
    const grid = [];
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 10; x++) {
        const defense = defenses.find(d => d.x === x && d.y === y);
        const monster = monsters.find(m => Math.floor(m.x) === x && m.y === y);
        
        grid.push(
          <TouchableOpacity
            key={`${x}-${y}`}
            style={[
              styles.gridCell,
              selectedDefense && !defense && styles.highlightCell
            ]}
            onPress={() => placeDefense(x, y)}
            disabled={!!defense || !selectedDefense}
          >
            {defense && (
              <Text style={styles.defenseEmoji}>{defense.emoji}</Text>
            )}
            {monster && (
              <View style={styles.monsterContainer}>
                <Text style={styles.monsterEmoji}>{monster.emoji}</Text>
                <View style={styles.healthBar}>
                  <View 
                    style={[
                      styles.healthFill, 
                      { width: `${(monster.health / monster.maxHealth) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
            )}
            {x === 9 && (
              <Text style={styles.toothEmoji}>🦷</Text>
            )}
          </TouchableOpacity>
        );
      }
    }
    return grid;
  };

  if (gameState === 'menu') {
    return (
      <LinearGradient
        colors={['#A8E6CF', '#7FCDCD']}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cavity Monsters</Text>
        </View>

        <View style={styles.menuContainer}>
          <Animated.Text style={[styles.gameTitle, { transform: [{ scale: pulseAnim }] }]}>
            🦷 DEFEND YOUR TEETH! 🦷
          </Animated.Text>
          
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>How to Play:</Text>
            <Text style={styles.instructionText}>• Tap defenses to select them</Text>
            <Text style={styles.instructionText}>• Place defenses on the grid to stop monsters</Text>
            <Text style={styles.instructionText}>• Don't let monsters reach your tooth!</Text>
            <Text style={styles.instructionText}>• Earn points to buy stronger defenses</Text>
          </View>

          <View style={styles.defensePreview}>
            <Text style={styles.sectionTitle}>Your Defenses:</Text>
            <View style={styles.defenseGrid}>
              {defenseTypes.map(defense => (
                <View key={defense.id} style={styles.defensePreviewCard}>
                  <Text style={styles.defensePreviewEmoji}>{defense.emoji}</Text>
                  <Text style={styles.defensePreviewName}>{defense.name}</Text>
                  <Text style={styles.defensePreviewCost}>{defense.cost} pts</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.buttonGradient}
            >
              <MaterialIcons name="play-arrow" size={32} color="white" />
              <Text style={styles.startButtonText}>Start Battle!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <LinearGradient
        colors={['#FF8A80', '#FFCDD2']}
        style={styles.container}
      >
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>Game Over! 💀</Text>
          <Text style={styles.gameOverText}>
            The cavity monsters got through!{'\n'}
            Don't worry, every hero learns from defeat!
          </Text>
          
          <View style={styles.finalStats}>
            <Text style={styles.statText}>Final Score: {score}</Text>
            <Text style={styles.statText}>Level Reached: {level}</Text>
            <Text style={styles.statText}>Time Survived: {Math.floor(gameTime / 10)}s</Text>
          </View>

          <View style={styles.gameOverButtons}>
            <TouchableOpacity style={styles.retryButton} onPress={startGame}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={resetGame}>
              <Text style={styles.menuButtonText}>Main Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      {/* Game Header */}
      <View style={styles.gameHeader}>
        <TouchableOpacity style={styles.pauseButton} onPress={pauseGame}>
          <MaterialIcons 
            name={gameState === 'paused' ? 'play-arrow' : 'pause'} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
        
        <View style={styles.gameStats}>
          <Text style={styles.statText}>Score: {score}</Text>
          <Text style={styles.statText}>Lives: {'❤️'.repeat(lives)}</Text>
          <Text style={styles.statText}>Level: {level}</Text>
        </View>

        <TouchableOpacity style={styles.quitButton} onPress={resetGame}>
          <MaterialIcons name="home" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Defense Selection */}
      <View style={styles.defenseSelection}>
        {defenseTypes.map(defense => (
          <TouchableOpacity
            key={defense.id}
            style={[
              styles.defenseButton,
              selectedDefense?.id === defense.id && styles.selectedDefenseButton,
              score < defense.cost && styles.disabledDefenseButton
            ]}
            onPress={() => score >= defense.cost && setSelectedDefense(defense)}
            disabled={score < defense.cost}
          >
            <Text style={styles.defenseButtonEmoji}>{defense.emoji}</Text>
            <Text style={styles.defenseButtonCost}>{defense.cost}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Game Grid */}
      <View style={styles.gameGrid}>
        {gameState === 'paused' && (
          <View style={styles.pauseOverlay}>
            <Text style={styles.pauseText}>PAUSED</Text>
            <TouchableOpacity style={styles.resumeButton} onPress={pauseGame}>
              <Text style={styles.resumeButtonText}>Resume</Text>
            </TouchableOpacity>
          </View>
        )}
        {renderGameGrid()}
      </View>

      {/* Tips */}
      <View style={styles.tipsBar}>
        <Text style={styles.tipText}>
          💡 Tip: Place toothbrushes near the path, use mouthwash for heavy damage!
        </Text>
      </View>
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
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  gameTitle: {
    fontSize: 28,
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
    padding: 20,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 6,
  },
  defensePreview: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
    textAlign: 'center',
  },
  defenseGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  defensePreviewCard: {
    alignItems: 'center',
    flex: 1,
  },
  defensePreviewEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  defensePreviewName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  defensePreviewCost: {
    fontSize: 10,
    color: '#7F8C8D',
  },
  startButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  gameStats: {
    alignItems: 'center',
  },
  statText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: '#3498db',
    borderRadius: 20,
    padding: 8,
  },
  quitButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    padding: 8,
  },
  defenseSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#34495e',
  },
  defenseButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#2C3E50',
    minWidth: 60,
  },
  selectedDefenseButton: {
    backgroundColor: '#3498db',
    transform: [{ scale: 1.1 }],
  },
  disabledDefenseButton: {
    opacity: 0.5,
  },
  defenseButtonEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  defenseButtonCost: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  gameGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#95a5a6',
    position: 'relative',
  },
  gridCell: {
    width: '10%',
    aspectRatio: 1,
    borderWidth: 0.5,
    borderColor: '#7f8c8d',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  highlightCell: {
    backgroundColor: 'rgba(52, 152, 219, 0.3)',
  },
  defenseEmoji: {
    fontSize: 16,
  },
  monsterContainer: {
    alignItems: 'center',
  },
  monsterEmoji: {
    fontSize: 14,
  },
  healthBar: {
    width: 20,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
    marginTop: 1,
  },
  healthFill: {
    height: '100%',
    backgroundColor: '#e74c3c',
    borderRadius: 1,
  },
  toothEmoji: {
    fontSize: 12,
    position: 'absolute',
    right: 2,
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  pauseText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  resumeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsBar: {
    backgroundColor: '#f39c12',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tipText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default CavityMonstersGame;