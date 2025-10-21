import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from 'react';
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Context as EducationContext } from '../../context/EducationContext/EducationContext';
import { useTranslation } from '../../context/TranslationContext/useTranslation';
import styles from './styles';

const EducationContentScreen = ({ route }) => {
    
    const {state, getEducationContent, toggleFavourite, syncFavouritesFromStorage} = useContext(EducationContext);
    const { t } = useTranslation();
    const {educationData} = state;
    const [dataLoaded, setDataLoaded] = useState(false);
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

    // Enhanced content data with detailed information
    const DETAILED_CONTENT = {
        'Dental Hygiene': {
            whatIs: 'Dental hygiene is the practice of maintaining clean teeth and gums to prevent oral disease. It involves daily routines and professional care to keep your mouth healthy and fresh.',
            howImprove: [
                'Brush your teeth twice daily with fluoride toothpaste',
                'Floss between teeth at least once daily',
                'Use mouthwash to eliminate bacteria',
                'Limit sugary foods and acidic beverages',
                'Drink plenty of water throughout the day',
                'Replace your toothbrush every 3-4 months'
            ],
            benefits: 'Regular dental hygiene prevents cavities, gum disease, and bad breath while maintaining a bright smile and strong teeth.',
            facts: 'Did you know? Your saliva naturally helps fight bacteria and protect your teeth. Staying hydrated keeps your mouth\'s defense system strong!'
        },
        'Tooth Decay': {
            whatIs: 'Tooth decay, also known as dental caries or cavities, is the breakdown of tooth structure caused by acid produced by bacteria. It\'s one of the most common dental problems worldwide.',
            howImprove: [
                'Reduce sugar consumption and acidic food/drink intake',
                'Brush teeth properly after meals',
                'Use fluoride toothpaste for extra protection',
                'Rinse your mouth with water after eating',
                'Visit your dentist every 6 months for check-ups',
                'Consider dental sealants for vulnerable areas'
            ],
            benefits: 'Understanding decay helps you take preventative action, avoid painful treatments, and maintain healthy teeth for life.',
            facts: 'Fact: It takes only 20 seconds of acid exposure for bacteria to start attacking your enamel. Prevention is always better than cure!'
        },
        'Fluoride Treatment': {
            whatIs: 'Fluoride is a naturally occurring mineral that strengthens tooth enamel and makes teeth more resistant to decay. Professional fluoride treatments provide concentrated protection.',
            howImprove: [
                'Use fluoride toothpaste daily as part of your routine',
                'Drink fluoridated water when available',
                'Consider professional fluoride gel treatments annually',
                'Rinse with fluoride mouthwash after brushing',
                'Ensure children receive appropriate fluoride exposure',
                'Ask your dentist about fluoride supplements if needed'
            ],
            benefits: 'Fluoride reduces cavity formation by up to 25% in children and 15% in adults, and reverses early tooth decay.',
            facts: 'Pro Tip: Professional fluoride treatments are especially beneficial for people with dry mouth, exposed root surfaces, or high cavity risk.'
        },
        'Orthodontics': {
            whatIs: 'Orthodontics is the dental specialty focused on correcting misaligned teeth and jaws using braces, aligners, or other appliances. Proper alignment improves function and appearance.',
            howImprove: [
                'Consult an orthodontist for evaluation and treatment options',
                'Follow your orthodontist\'s instructions for brace care',
                'Maintain excellent oral hygiene during treatment',
                'Avoid hard, sticky, or crunchy foods that damage braces',
                'Wear retainers as prescribed after treatment completion',
                'Attend regular adjustment appointments'
            ],
            benefits: 'Correcting alignment prevents bite problems, reduces decay risk, improves chewing efficiency, and boosts confidence.',
            facts: 'Did you know? Modern clear aligners like Invisalign are nearly invisible and allow for easier cleaning compared to traditional braces!'
        },
        'Dental Implants': {
            whatIs: 'Dental implants are artificial tooth roots surgically placed into the jawbone to support replacement teeth. They\'re a durable solution for missing teeth.',
            howImprove: [
                'Maintain excellent oral hygiene around implants',
                'Brush and floss daily, including around the implant',
                'Use non-abrasive toothpaste to protect the surface',
                'Avoid smoking, which affects implant success',
                'Visit your dentist every 6 months for professional cleaning',
                'Consider protective mouthguards if you grind your teeth'
            ],
            benefits: 'Implants feel and function like natural teeth, preserve bone structure, don\'t damage adjacent teeth, and can last 20+ years.',
            facts: 'Fact: Implants have a success rate of over 95% when properly placed and maintained. They\'re one of the most advanced tooth replacement options!'
        }
    };

    // params
    const isFilterView = route.params?.selectedFilter;
    const contentId = route.params?.id;
    const selectedFilter = route.params?.selectedFilter;
    const fromFilter = route.params?.fromFilter; // Track which filter the user came from
    const quizCompleted = route.params?.quizCompleted || false;
    const quizScore = route.params?.quizScore || 0;
    const totalQuestions = route.params?.totalQuestions || 6;

    useEffect(() => {
        const loadData = async () => {
            await getEducationContent();
            setDataLoaded(true);
        };
        loadData();
    }, []);

    const favouritePress = async (itemID) => {
        try {
        
        const item = educationData.find(item => item._id === itemID || item.id === itemID);
        
        await toggleFavourite(itemID);
        }
        catch (err) {
            console.error('Error toggling favourite:', err);
        }
    };

    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const treatment = route?.params?.treatment;
        if (!treatment || !educationData.length) return;

        const topic = TREATMENT_TO_TOPIC[treatment] || 'Dental Hygiene';
        const matchedContent = educationData.find(item => item.topic === topic);

        if (matchedContent) {
            openContent(matchedContent);
        }
    }, [route?.params?.treatment, educationData]);

    if (!dataLoaded) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>{t('Loading education content...')}</Text>
            </View>
        );
    }

    // Individual content view
    const individualContent = contentId ? educationData.find(content => content._id === contentId) : null;
    if (!isFilterView && individualContent) {
        const { topic, content, category } = individualContent;

        // Enhanced modal with detailed content
        const detailedInfo = DETAILED_CONTENT[topic] || DETAILED_CONTENT['Dental Hygiene'];

        console.log('Individual content:', individualContent);
        console.log('Content type:', typeof content);
        console.log('Content value:', content);
        console.log('Is array?', Array.isArray(content));
        
        const handleBackFromContent = () => {
            if (fromFilter) {
                // Navigate back to the specific filter view
                navigation.navigate('content', { selectedFilter: fromFilter });
            } else {
                // Fallback to going back in navigation stack
                navigation.navigate('Education', {
                    screen: "Library"
                });
            }
        };

        return (
            <View style={styles.modalContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Hero Section with Icon and Close Button */}
                    <LinearGradient 
                        colors={['#516287', '#516287']} 
                        style={styles.heroSection}
                    >
                        <TouchableOpacity 
                            onPress={handleBackFromContent} 
                            style={styles.modalCloseButton}
                        >
                            <MaterialIcons name="close" size={28} color="#FFFFFF" />
                        </TouchableOpacity>
                        
                        <View style={styles.heroContent}>
                            <View style={styles.heroIconContainer}>
                                
                            </View>
                            <Text style={styles.heroTitle}>{topic}</Text>
                            <View style={styles.categoryBadgeHero}>
                                <Text style={styles.categoryBadgeText}>{category}</Text>
                            </View>
                        </View>
                    </LinearGradient>

                    <View style={styles.contentWrapper}>
                        {/* What Is Section */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeaderContainer}>
                                <View style={[styles.sectionIconCircle, {backgroundColor: '#FFE5D9'}]}>
                                    <MaterialIcons name="help-outline" size={20} color="#875B51" />
                                </View>
                                <Text style={styles.sectionHeader}>What is {topic}?</Text>
                            </View>
                            <Text style={styles.sectionDescription}>{detailedInfo.whatIs}</Text>
                        </View>

                        {/* How to Improve Section */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeaderContainer}>
                                <View style={[styles.sectionIconCircle, {backgroundColor: '#D9E9FF'}]}>
                                    <MaterialIcons name="trending-up" size={20} color="#516287" />
                                </View>
                                <Text style={styles.sectionHeader}>Tips</Text>
                            </View>
                            <View style={styles.tipsContainer}>
                                {detailedInfo.howImprove.map((tip, index) => (
                                    <View key={index} style={styles.tipItem}>
                                        <View style={styles.tipNumberContainer}>
                                            <Text style={styles.tipNumber}>{index + 1}</Text>
                                        </View>
                                        <Text style={styles.tipText}>{tip}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Benefits Card */}
                        <View style={styles.benefitsCard}>
                            <View style={styles.benefitsHeader}>
                                <Entypo name="star" size={22} color="#FFB84D" />
                                <Text style={styles.benefitsTitle}>Key Benefits</Text>
                            </View>
                            <Text style={styles.benefitsText}>{detailedInfo.benefits}</Text>
                        </View>

                        {/* Did You Know Card */}
                        <View style={styles.factCard}>
                            <View style={styles.factCardTop}>
                                <MaterialIcons name="lightbulb" size={20} color="#875B51" />
                                <Text style={styles.factCardTitle}>Did You Know?</Text>
                            </View>
                            <Text style={styles.factCardText}>{detailedInfo.facts}</Text>
                        </View>

                        {/* Save Button */}
                        <TouchableOpacity 
                            style={styles.saveButton}
                            onPress={() => favouritePress(individualContent._id || individualContent.id)}
                        >
                            <Entypo 
                                name="heart" 
                                size={20} 
                                color={individualContent.favourite === true ? "#FF6B6B" : "#FFFFFF"}
                                fill={individualContent.favourite === true ? "#FF6B6B" : "none"}
                            />
                            <Text style={styles.saveButtonText}>
                                {individualContent.favourite === true ? 'Saved to Favorites' : 'Save to Favorites'}
                            </Text>
                        </TouchableOpacity>

                        <View style={{ height: 30 }} />
                    </View>
                </ScrollView>
            </View>
        );
    }

    if (!isFilterView && !individualContent) {
        return (
            <LinearGradient colors={['#78d0f5', 'white', '#78d0f5']} style={styles.container} >
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
        const translatedTopic = (item.topic);
        return translatedTopic.toLowerCase().includes(searchText.toLowerCase());
    });

    const searchFunction = (text) => setSearchText(text);
    const clearSearch = () => setSearchText('');

    const openContent = (content) => {
        // Pass the current filter so we can navigate back to it
        navigation.navigate('content', { 
            id: content._id,
            fromFilter: selectedFilter,
            isModal: true
        });
    };

    // Show loading state while translations are being loaded
    // if (isTranslating && currentLanguage !== 'en') {
    //     return (
    //         <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} key={refreshKey}>
    //             <Text style={styles.loadingText}>Loading translations...</Text>
    //         </View>
    //     );
    // }

    return (
        <View style={styles.container} >
            {/* Back Arrow - Top Corner */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topCornerBackButton}>
                <MaterialIcons name="arrow-back" size={24} color="#875B51" />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.headerTextContainer}>
                    <Text style={[styles.titleText]}>{selectedFilter}</Text>
                    <Text style={[styles.itemCountText]}>
                        {searchedAndFilteredContent.length} {searchedAndFilteredContent.length !== 1 ? t('items') : t('item')}
                    </Text>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder={t('Search Educational Readings...')}
                    placeholderTextColor={'#C0CCD6'}
                    onPress={clearSearch}
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
                            <TouchableOpacity onPress={() => favouritePress(item._id || item.id)}>
                                <Entypo name="heart" size={24} color={item.favourite === true ? "#FF6B6B" : "#C0C6CB"} style={styles.favourite}/>
                            </TouchableOpacity>
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