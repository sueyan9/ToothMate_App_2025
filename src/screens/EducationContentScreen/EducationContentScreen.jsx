import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Context as EducationContext } from '../../context/EducationContext/EducationContext';
import styles from './styles';

const EducationContentScreen = ({ route }) => {
    
    const {state, getEducationContent, toggleFavourite} = useContext(EducationContext);
    const {educationData} = state;
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

    useEffect(() => {
        const loadData = async () => {
            await getEducationContent();
            await syncFavouritesFromStorage();
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

    if (!educationData.length) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Loading education content...</Text>
            </View>
        );
    }

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
            <View style={styles.modalContainer}>
                <TouchableOpacity onPress={handleBackFromContent} style={styles.closeButton}>
                    <MaterialIcons name="close" size={24} color="#875B51" />
                </TouchableOpacity>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.modalContent}>
                        <Image source={require('../../../assets/tooth_icon.png')} style={styles.modalImage} />
                        <Text style={styles.contentTitle}>{topic}</Text>
                        <Text style={styles.contentCategory}>{category}</Text>
                        
                        <View style={styles.contentDetails}>
                            {content && content.map((point, index) => (
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

    // Filter
    const filteredContent = selectedFilter === 'All'
        ? educationData
        : educationData.filter(item =>
            item.category === selectedFilter || item.recommended === selectedFilter
        );

    const searchedAndFilteredContent = filteredContent.filter(item =>
        item.topic.toLowerCase().includes(searchText.toLowerCase())
    );

    const searchFunction = (text) => setSearchText(text);
    const clearSearch = () => setSearchText('');

    const openContent = (content) => {
        // Pass the current filter so we can navigate back to it
        navigation.navigate('content', { 
            id: content._id,
            fromFilter: selectedFilter 
        });
    };

    return (
        <View style={styles.container}>
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
                    placeholder='Search Educational Readings...'
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
                            {searchText ? 'No results found for your search.' : 'No items in this category.'}
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
                                <Entypo name="heart" size={24} color={item.favourite === true ? "#C0C6CB" : "#FF6B6B"} style={styles.favourite}/>
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