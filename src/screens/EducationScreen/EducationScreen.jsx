import { Righteous_400Regular, useFonts } from '@expo-google-fonts/righteous';
import { MaterialIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Context } from '../../context/EducationContext/EducationContext';
import { useTranslation } from '../../context/TranslationContext/useTranslation';
import styles from './styles';

const EducationScreen = ({ navigation }) => {
    const { state } = useContext(Context);
    const { t, translateAndCache, currentLanguage } = useTranslation();
    
    const [fontsLoaded] = useFonts({
        Righteous_400Regular,
        Varela_400Regular,
    });

    // State to force re-render on language change
    const [refreshKey, setRefreshKey] = useState(0);

    // Define texts to translate
    const textsToTranslate = [
        'All',
        'Dentist Recommended Readings',
        'Whats Good for My Teeth',
        'Whats Bad for My Teeth',
        'Treatments',
        'Conditions',
        'Oral Care',
        'Dentist Recommended Readings'
    ];

    useEffect(() => {
        // Force re-render when language changes
        setRefreshKey(prev => prev + 1);
        
        // Translate texts when language changes
        if (currentLanguage !== 'en') {
            translateAndCache(textsToTranslate);
        }
    }, [currentLanguage]);

    const filters = [
        t('All'),
        t('Whats Good for My Teeth'),
        t('Whats Bad for My Teeth'),
        t('Treatments'),
        t('Conditions'),
        t('Oral Care'),
        t('Dentist Recommended Readings')
    ];

    // Calculate item count for each filter using context data
    const getFilterCount = (filter) => {
        if (filter === t('All')) {
            return state.length;
        }
        return state.filter(item => 
            item.category === filter || item.recommended === filter
        ).length;
    };

    const handleFilterPress = (filter) => {
        // Navigate to content page with the selected filter
        navigation.navigate('content', { 
            selectedFilter: filter
        });
    };

    const handleSpecialCardPress = (cardType) => {
        // Navigate to content page with special filter
        navigation.navigate('content', { 
            selectedFilter: cardType
        });
    };

    return (
        <View style={styles.container} key={refreshKey}>
            <Text testID="education-title" style={styles.titleText}>{t('ToothMate Library')}</Text>

            <ScrollView style={styles.contentList} showsVerticalScrollIndicator={false}>
                {/* Filter Category Cards */}
                {filters.map((filter) => (
                    <TouchableOpacity 
                        key={filter}
                        onPress={() => handleFilterPress(filter)}
                        style={styles.contentCard}
                        testID={`filter-card-${filter}`}
                    >
                        <View style={styles.cardContent}>
                            <Text style={styles.topicText}>{filter}</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={30} color="#875B51"/>
                        </View>
                        
                    </TouchableOpacity>
                ))}
                
            </ScrollView>
        </View>
    );
};

export default EducationScreen;