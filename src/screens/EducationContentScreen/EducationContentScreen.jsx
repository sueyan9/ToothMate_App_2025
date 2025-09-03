import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../context/TranslationContext/useTranslation';
import styles from './styles';
import { useEffect, useState } from 'react';
import { Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';

const EducationContentScreen = ({ route }) => {
    const { t, translateAndCache, currentLanguage, isLoading } = useTranslation();
    const navigation = useNavigation();

    // State to force re-render on language change
    const [refreshKey, setRefreshKey] = useState(0);
    const [isTranslating, setIsTranslating] = useState(false);

    // Define texts to translate
    const textsToTranslate = [
        'Search Educational Readings...',
        'Content not found',
        'No results found for your search.',
        'No items in this category.',
        'Dental Hygiene',
        'Oral Care',
        'Tooth Decay',
        'Conditions',
        'Dentist Recommended Readings',
        'Fluoride Treatment',
        'Treatments',
        'Orthodontics',
        'Dental Implants',
        'Gum Disease',
        'Flossing Guide',
        'Brush teeth twice daily with fluoride toothpaste',
        'Floss at least once per day',
        'Replace toothbrush every 3-4 months',
        'Visit dentist for regular check-ups',
        'Limit sugary and acidic foods/drinks',
        "Tooth decay is the destruction of tooth enamel. It's caused by bacteria in your mouth that make acids when they break down sugar.",
        "Preventing tooth decay involves good oral hygiene and a healthy diet.",
        "Regular dental check-ups are essential for early detection and treatment.",
        "Fluoride treatments can help strengthen tooth enamel and make it more resistant to decay.",
        "Fluoride is a natural mineral that helps strengthen teeth and prevent cavities.",
        "Professional fluoride treatments are applied by a dentist or dental hygienist.",
        "They are quick, painless, and highly effective, especially for children and those at high risk of tooth decay.",
        "Orthodontics is a dental specialty focused on correcting misaligned teeth and jaws.",
        "Common treatments include braces, clear aligners, and retainers.",
        "Orthodontic treatment can improve not only the appearance of your smile but also your bite and overall oral health.",
        "Dental implants are a permanent solution for missing teeth. They are surgically placed in the jawbone.",
        "They act as a strong foundation for a replacement tooth that looks, feels, and functions like a natural tooth.",
        "Gum disease, also known as periodontal disease, is an infection of the tissues that hold your teeth in place.",
        "It is a major cause of tooth loss in adults.",
        "Symptoms include swollen, red, or bleeding gums. Good oral hygiene is key to prevention.",
        "Flossing removes plaque and food particles from between your teeth and under your gumline, where a toothbrush can't reach.",
        "It's recommended to floss at least once a day.",
        "There are different types of floss and flossing tools available; choose the one that works best for you."
    ];

    useEffect(() => {
        const loadTranslations = async () => {
            // Force re-render when language changes
            setRefreshKey(prev => prev + 1);
            
            // Translate texts when language changes
            if (currentLanguage !== 'en') {
                setIsTranslating(true);
                await translateAndCache(textsToTranslate);
                setIsTranslating(false);
            }
        };
        
        loadTranslations();
    }, [currentLanguage]);

    // Mock data until backend/context is ready - recalculated when language changes
    const educationData = [
        { _id: '1', topic: t('Dental Hygiene'), category: t('Oral Care'), recommended: null, content: 
            [
                t("Brush teeth twice daily with fluoride toothpaste"),
                t("Floss at least once per day"),
                t("Replace toothbrush every 3-4 months"),
                t("Visit dentist for regular check-ups"),
                t("Limit sugary and acidic foods/drinks")
            ]
        },
        { _id: '2', topic: t('Tooth Decay'), category: t('Conditions'), recommended: t('Dentist Recommended Readings'), content: 
            [
                t("Tooth decay is the destruction of tooth enamel. It's caused by bacteria in your mouth that make acids when they break down sugar."),
                t("Preventing tooth decay involves good oral hygiene and a healthy diet."),
                t("Regular dental check-ups are essential for early detection and treatment."),
                t("Fluoride treatments can help strengthen tooth enamel and make it more resistant to decay."),
            ]
        },
        { _id: '3', topic: t('Fluoride Treatment'), category: t('Treatments'), recommended: null, content: 
            [
                t("Fluoride is a natural mineral that helps strengthen teeth and prevent cavities."),
                t("Professional fluoride treatments are applied by a dentist or dental hygienist."),
                t("They are quick, painless, and highly effective, especially for children and those at high risk of tooth decay.")
            ]
        },
        { _id: '4', topic: t('Orthodontics'), category: t('Treatments'), recommended: null, content: 
            [
                t("Orthodontics is a dental specialty focused on correcting misaligned teeth and jaws."),
                t("Common treatments include braces, clear aligners, and retainers."),
                t("Orthodontic treatment can improve not only the appearance of your smile but also your bite and overall oral health.")
            ]
        },
        { _id: '5', topic: t('Dental Implants'), category: t('Treatments'), recommended: t('Dentist Recommended Readings'), content: 
            [
                t("Dental implants are a permanent solution for missing teeth. They are surgically placed in the jawbone."),
                t("They act as a strong foundation for a replacement tooth that looks, feels, and functions like a natural tooth.")
            ]
        },
        { _id: '6', topic: t('Gum Disease'), category: t('Conditions'), recommended: t('Dentist Recommended Readings'), content: 
            [
                t("Gum disease, also known as periodontal disease, is an infection of the tissues that hold your teeth in place."),
                t("It is a major cause of tooth loss in adults."),
                t("Symptoms include swollen, red, or bleeding gums. Good oral hygiene is key to prevention.")
            ]
        },
        { _id: '7', topic: t('Flossing Guide'), category: t('Oral Care'), recommended: t('Dentist Recommended Readings'), content: 
            [
                t("Flossing removes plaque and food particles from between your teeth and under your gumline, where a toothbrush can't reach."),
                t("It's recommended to floss at least once a day."),
                t("There are different types of floss and flossing tools available; choose the one that works best for you.")
            ]
        },
    ]);
    const navigation = useNavigation();
    
    const TREATMENT_TO_TOPIC = {
        Filling: 'Tooth Decay',              
        Cleaning: 'Dental Hygiene',          
        Checkup: 'Dental Hygiene',           
        'Root Canal': 'Tooth Decay',         
        'Crown Placement': 'Tooth Decay',    
        Extraction: 'Dental Implants',       
        'Fluoride Treatment': 'Fluoride Treatment',
        Orthodontics: 'Orthodontics',
    };
    // params
    const isFilterView = route.params?.selectedFilter;
    const contentId = route.params?.id;
    const selectedFilter = route.params?.selectedFilter;
    const fromFilter = route.params?.fromFilter; // Track which filter the user came from
    const quizCompleted = route.params?.quizCompleted || false;
    const quizScore = route.params?.quizScore || 0;
    const totalQuestions = route.params?.totalQuestions || 6;

    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const treatment = route?.params?.treatment;
        if (!treatment) return;

        const topic = TREATMENT_TO_TOPIC[treatment] || 'Dental Hygiene';
        const matchedContent = educationData.find(item => item.topic === topic);

        openContent(matchedContent);
    }, [route?.params?.treatment, educationData]);

    // Individual content view
    const individualContent = contentId ? educationData.find(content => content._id === contentId) : null;
    if (!isFilterView && individualContent) {
        const { topic, content, category } = individualContent;
        
        const handleBackFromContent = () => {
            if (fromFilter) {
                // Navigate back to the specific filter view
                navigation.navigate('content', { selectedFilter: fromFilter });
            } else {
                // Fallback to going back in navigation stack
                navigation.goBack();
            }
        };

        return (
            <View style={styles.modalContainer} key={refreshKey}>
                <TouchableOpacity onPress={handleBackFromContent} style={styles.closeButton}>
                    <MaterialIcons name="close" size={24} color="#875B51" />
                </TouchableOpacity>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.modalContent}>
                        <Image source={require('../../../assets/tooth_icon.png')} style={styles.modalImage} />
                        <Text style={styles.contentTitle}>{topic}</Text>
                        <Text style={styles.contentCategory}>{category}</Text>
                        
                        <View style={styles.contentDetails}>
                            {content.map((point, index) => (
                                <View key={index} style={styles.detailItem}>
                                    <View style={styles.bulletPoint} />
                                    <Text style={styles.detailText}>{point}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Show Take Quiz button only for Dental Hygiene topic */}
                        {topic === 'Dental Hygiene' && (
                            <TouchableOpacity 
                                style={[styles.button, quizCompleted && styles.completedButton]}
onPress={() =>
  navigation.replace('game', {
    contentId: contentId, // optional: pass current content ID
    fromFilter: selectedFilter,
  })
}

                            >
                                <Text style={styles.buttonText}>
                                    {quizCompleted ? `Try Again (${quizScore}/${totalQuestions})` : 'Take Quiz'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            </View>
        );
    }

    if (!isFilterView && !individualContent) {
        return (
            <LinearGradient colors={['#78d0f5', 'white', '#78d0f5']} style={styles.container} key={refreshKey}>
                <Text style={styles.errorText}>{t('Content not found')}</Text>
            </LinearGradient>
        );
    }

    // Filter
    const filteredContent = selectedFilter === 'All'
        ? educationData
        : educationData.filter(item =>
            item.category === selectedFilter || item.recommended === selectedFilter
        );

    const searchedAndFilteredContent = filteredContent.filter(item => {
        // Use the translated topic for search
        const translatedTopic = t(item.topic);
        return translatedTopic.toLowerCase().includes(searchText.toLowerCase());
    });

    const searchFunction = (text) => setSearchText(text);

    const openContent = (content) => {
        // Pass the current filter so we can navigate back to it
        navigation.navigate('content', { 
            id: content._id,
            fromFilter: selectedFilter 
        });
    };

    // Show loading state while translations are being loaded
    if (isTranslating && currentLanguage !== 'en') {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} key={refreshKey}>
                <Text style={styles.loadingText}>Loading translations...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container} key={refreshKey}>
            {/* Back Arrow - Top Corner */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topCornerBackButton}>
                <MaterialIcons name="arrow-back" size={24} color="#875B51" />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.headerTextContainer}>
                    <Text style={[styles.titleText, styles.centeredHeaderTitle]}>{selectedFilter}</Text>
                    <Text style={[styles.itemCountText, styles.centeredHeaderTitle]}>
                        {searchedAndFilteredContent.length} item{searchedAndFilteredContent.length !== 1 ? 's' : ''}
                    </Text>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder={t('Search Educational Readings...')}
                    onChangeText={searchFunction}
                    value={searchText}
                />
            </View>

            {/* List */}
            <ScrollView style={styles.contentList} showsVerticalScrollIndicator={false}>
                {searchedAndFilteredContent.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {searchText ? t('No results found for your search.') : t('No items in this category.')}
                        </Text>
                    </View>
                ) : (
                    searchedAndFilteredContent.map((item) => (
                        <TouchableOpacity
                            key={item._id}
                            onPress={() => openContent(item)}
                            style={styles.contentCard}
                        >
                            <View style={styles.absoluteArrow}>
                                <MaterialIcons name="keyboard-arrow-right" size={30} color="#875B51" />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.topicText}>{item.topic}</Text>
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
                    ))
                )}
            </ScrollView>
        </View>
    );
};

// Header Options
EducationContentScreen.navigationOptions = () => ({
    title: 'Education',
    headerTintColor: 'black',
    headerBackTitleVisible: false,
    safeAreaInsets: Platform.OS === 'ios' ? { top: 45 } : { top: 30 },
    headerStyle: { backgroundColor: '#78d0f5' },
    cardStyle: { backgroundColor: 'white' },
});

export default EducationContentScreen;