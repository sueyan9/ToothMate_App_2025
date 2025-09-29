import { Righteous_400Regular, useFonts } from '@expo-google-fonts/righteous';
import { VarelaRound_400Regular } from '@expo-google-fonts/varela-round';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from 'react';
import { Animated, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Context } from '../../context/EducationContext/EducationContext';
import { useTranslation } from '../../context/TranslationContext/useTranslation';
import styles from './styles';

const { width } = Dimensions.get('window');

const ChildEducationScreen = ({ navigation }) => {
    const { state } = useContext(Context);
    const { t, translateAndCache, currentLanguage } = useTranslation();
    
    const [fontsLoaded] = useFonts({
        Righteous_400Regular,
        VarelaRound_400Regular,
    });

    // Animation values
    const [toothBounce] = useState(new Animated.Value(0));
    const [starTwinkle] = useState(new Animated.Value(0));
    const [refreshKey, setRefreshKey] = useState(0);

    // Define texts to translate
    const textsToTranslate = [
        'ToothMate Fun Zone',
        'Brushing Timer',
        'Dance with your tooth buddy!',
        'Learn About Teeth',
        'Fun facts and tooth care',
        'Tooth Hero Challenge',
        'Complete daily missions',
        'ToothMaze Adventure',
        'Navigate mazes and answer questions!',
        'Show off your healthy smile',
        'Dental Quiz Adventure',
        'Test your tooth knowledge'
    ];

    useEffect(() => {
        setRefreshKey(prev => prev + 1);
        
        if (currentLanguage !== 'en') {
            translateAndCache(textsToTranslate);
        }

        // Start animations
        const toothAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(toothBounce, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(toothBounce, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );

        const starAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(starTwinkle, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(starTwinkle, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        );

        toothAnimation.start();
        starAnimation.start();

        return () => {
            toothAnimation.stop();
            starAnimation.stop();
        };
    }, [currentLanguage]);

    const gameCards = [
        {
            id: 'brushing-timer',
            title: t('Brushing Timer'),
            subtitle: t('Dance with your tooth buddy!'),
            icon: 'timer',
            color: ['#FF6B9D', '#FF8E8E'],
            screen: 'BrushingTimer',
            size: 'large'
            
        },
        {
            id: 'learn-teeth',
            title: t('Learn About Teeth'),
            subtitle: t('Fun facts and tooth care'),
            icon: 'school',
            color: ['#4ECDC4', '#44A08D'],
            screen: 'LearnTeeth',
            size: 'medium'
        },
        {
            id: 'tooth-hero',
            title: t('Tooth Hero Challenge'),
            subtitle: t('Complete daily missions'),
            icon: 'emoji-events',
            color: ['#FFD93D', '#FF9A56'],
            screen: 'ToothHero',
            size: 'medium'
        },
        {
            id: 'toothmaze-adventure',
            title: t('ToothMaze Adventure'),
            subtitle: t('Navigate mazes and answer questions!'),
            icon: 'extension',
            color: ['#7FCDCD', '#7FCDCD'],
            screen: 'ToothMazeAdventure',
            size: 'large'
        },
    ];

    const handleGamePress = (game) => {
        navigation.navigate(game.screen);
    };

    const toothTranslateY = toothBounce.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10],
    });

    const starOpacity = starTwinkle.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 1],
    });

    const renderGameCard = (game, index) => {
        const cardStyle = game.size === 'large' ? styles.largeCard : 
                         game.size === 'small' ? styles.smallCard : styles.mediumCard;
        
        return (
            <TouchableOpacity 
                key={game.id}
                onPress={() => handleGamePress(game)}
                style={cardStyle}
                testID={`game-card-${game.id}`}
            >
                <LinearGradient
                    colors={game.color}
                    style={styles.gradientCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.cardHeader}>
                        <MaterialIcons name={game.icon} size={32} color="white" />
                        {index === 0 && ( // Add tooth animation to first card
                            <Animated.View style={{ transform: [{ translateY: toothTranslateY }] }}>
                                <Text style={styles.toothEmoji}>🦷</Text>
                            </Animated.View>
                        )}
                    </View>
                    <View style={styles.cardTextColumn}>
                        <Text style={styles.gameTitle}>{game.title}</Text>
                        <Text style={styles.gameSubtitle}>{game.subtitle}</Text>
                    </View>
                    <View style={styles.playButton}>
                        <MaterialIcons name="play-arrow" size={24} color="white" />
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    const renderGameCards = () => {
        const cards = [];
        let i = 0;
        
        while (i < gameCards.length) {
            const game = gameCards[i];
            
            if (game.size === 'large') {
                cards.push(renderGameCard(game, i));
                i++;
            } else if (game.size === 'medium') {
                // Check if there's a next medium card to pair with
                const nextGame = gameCards[i + 1];
                if (nextGame && nextGame.size === 'medium') {
                    cards.push(
                        <View key={`row-${i}`} style={styles.mediumRow}>
                            {renderGameCard(game, i)}
                            {renderGameCard(nextGame, i + 1)}
                        </View>
                    );
                    i += 2;
                } else {
                    cards.push(renderGameCard(game, i));
                    i++;
                }
            } else if (game.size === 'small') {
                // Check if there's a next small card to pair with
                const nextGame = gameCards[i + 1];
                if (nextGame && nextGame.size === 'small') {
                    cards.push(
                        <View key={`row-${i}`} style={styles.smallRow}>
                            {renderGameCard(game, i)}
                            {renderGameCard(nextGame, i + 1)}
                        </View>
                    );
                    i += 2;
                } else {
                    cards.push(renderGameCard(game, i));
                    i++;
                }
            }
        }
        
        return cards;
    };

    return (
        <View style={styles.container} key={refreshKey}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.titleText}>{t('ToothMate Fun Zone')}</Text>
            </View>

            <ScrollView 
                style={styles.contentList} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Daily Progress Section */}
                <View style={styles.progressSection}>
                    <Text style={styles.progressTitle}>Today's Progress</Text>
                    <View style={styles.progressCards}>
                        <View style={styles.progressCard}>
                            <Text style={styles.progressEmoji}>🪥</Text>
                            <Text style={styles.progressLabel}>Brushed Today</Text>
                            <Text style={styles.progressValue}>2/2</Text>
                        </View>
                        <View style={styles.progressCard}>
                            <Text style={styles.progressEmoji}>⭐</Text>
                            <Text style={styles.progressLabel}>Points Earned</Text>
                            <Text style={styles.progressValue}>250</Text>
                        </View>
                        <View style={styles.progressCard}>
                            <Text style={styles.progressEmoji}>🏆</Text>
                            <Text style={styles.progressLabel}>Streak Days</Text>
                            <Text style={styles.progressValue}>7</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.gamesGrid}>
                    {renderGameCards()}
                </View>
            </ScrollView>
        </View>
    );
};

export default ChildEducationScreen;