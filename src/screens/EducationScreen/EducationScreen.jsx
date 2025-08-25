import { Righteous_400Regular, useFonts } from '@expo-google-fonts/righteous';
import { VarelaRound_400Regular } from '@expo-google-fonts/varela-round';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next'; // Add this import
import LoadingScreen from '../LoadingScreen';
import { useContext } from 'react';
import { Context } from '../../context/EducationContext/EducationContext';
import styles from './styles';

const EducationScreen = ({ navigation }) => {
    const { state } = useContext(Context);
    
    const [fontsLoaded] = useFonts({
        Righteous_400Regular,
        VarelaRound_400Regular,
    });
    
    // Add useTranslation hook
    const { t } = useTranslation();

    //mock data until backend has been fixed
    const [educationData] = useState([
        { id: '1', topic: t('education.topics.dentalHygiene'), category: t('filters.oralCare'), recommended: null, details: [
                t('education.details.brushTeeth'),
                t('education.details.flossDaily'),
                t('education.details.replaceToothbrush'),
                t('education.details.regularCheckups'),
                t('education.details.limitSugaryFoods')
            ], image: require('../../../assets/tooth_icon.png') },
        { id: '2', topic: t('education.topics.toothDecay'), category: t('filters.conditions'), recommended: t('filters.recommended'), details: [
                t('education.details.brushTeeth'),
                t('education.details.flossDaily'),
                t('education.details.replaceToothbrush'),
                t('education.details.regularCheckups'),
                t('education.details.limitSugaryFoods')
            ], image: null },
        { id: '3', topic: t('education.topics.fluorideTreatment'), category: t('filters.treatments'), recommended: null, details: [
                t('education.details.brushTeeth'),
                t('education.details.flossDaily'),
                t('education.details.replaceToothbrush'),
                t('education.details.regularCheckups'),
                t('education.details.limitSugaryFoods')
            ], image: null },
        { id: '4', topic: t('education.topics.orthodontics'), category: t('filters.treatments'), recommended: null, details: [
                t('education.details.brushTeeth'),
                t('education.details.flossDaily'),
                t('education.details.replaceToothbrush'),
                t('education.details.regularCheckups'),
                t('education.details.limitSugaryFoods')
            ], image: null },
        { id: '5', topic: t('education.topics.dentalImplants'), category: t('filters.treatments'), recommended: t('filters.recommended'), details: [
                t('education.details.brushTeeth'),
                t('education.details.flossDaily'),
                t('education.details.replaceToothbrush'),
                t('education.details.regularCheckups'),
                t('education.details.limitSugaryFoods')
            ], image: null },
        { id: '6', topic: t('education.topics.gumDisease'), category: t('filters.conditions'), recommended: t('filters.recommended'), details: [
                t('education.details.brushTeeth'),
                t('education.details.flossDaily'),
                t('education.details.replaceToothbrush'),
                t('education.details.regularCheckups'),
                t('education.details.limitSugaryFoods')
            ], image: null },
        { id: '7', topic: t('education.topics.flossingGuide'), category: t('filters.oralCare'), recommended: t('filters.recommended'), details: [
                t('education.details.brushTeeth'),
                t('education.details.flossDaily'),
                t('education.details.replaceToothbrush'),
                t('education.details.regularCheckups'),
                t('education.details.limitSugaryFoods')
            ], image: null },
    ]);

    // Use translated filters
    // Use translated filters
    const filters = [ 
        t('filters.all'), 
        t('filters.treatments'), 
        t('filters.conditions'), 
        t('filters.oralCare'), 
        t('filters.recommended') 
    ];

    const [activeFilter, setActiveFilter] = useState(filters[0]);
    const [searchText, setSearchText] = useState('');
    const [selectedContent, setSelectedContent] = useState(null);

    const filteredContent = activeFilter === t('filters.all') ? educationData : educationData.filter(item => item?.category === activeFilter || item?.recommended === activeFilter);

    const searchFunction = (text) => {
        setSearchText(text);
    }

    const searchedAndFilteredContent = filteredContent.filter(item => 
        item.topic.toLowerCase().includes(searchText.toLowerCase())
    );

    const openContent = (content) => {
        setSelectedContent(content);
    };

    const closeContent = () => {
        setSelectedContent(null);
    }

    if (!fontsLoaded) {
        return <LoadingScreen />;
    }

    return (
        <View style={styles.container}>
            <Text testID="education-title" style={styles.titleText}>{t('education.library')}</Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder={t('searchPlaceholder')} 
                    round 
                    onChangeText={searchFunction}
                    value={searchText}
                />
            </View>

            {/* filtering area */}
            <View style={{height: 45, marginBottom: 24}}>
                <ScrollView 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}>
                    {filters.map((filter) => (
                        <TouchableOpacity 
                            key={filter}
                            onPress={() => setActiveFilter(filter)} 
                            style={[styles.filterPill, activeFilter === filter && styles.activeFilter]}
                            testID={`filter-${filter}`}
                        >
                            <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>{filter}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* content */}
            <ScrollView style={styles.contentList}>
                {searchedAndFilteredContent.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        onPress={() => openContent(item)}
                        style={styles.contentCard}
                        testID={`filter-card-${item.topic}`}
                    >
                        <View style={styles.cardContent}>
                            <Text style={styles.topicText}>{item.topic}</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={30} color="#875B51"/>
                        </View>
                        <View style={styles.categoryTag}>
                            <Text style={styles.categoryText}>{item.category}</Text>
                        </View>

                        {item.recommended && (
                            <View style={styles.categoryTag}>
                                <Text style={styles.categoryText}>{item.recommended}</Text>
                            </View>
                        )}

                    </TouchableOpacity>
                ))}

                {/* Special Cards */}
                
            </ScrollView>
        </View>
    );
};
export default EducationScreen;