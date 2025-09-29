import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from 'react';
import { Image, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Context as EducationContext } from '../../context/EducationContext/EducationContext';
import { useTranslation } from '../../context/TranslationContext/useTranslation';
import styles from './styles';

const EducationContentScreen = ({ route }) => {
    
    const {state, getEducationContent, toggleFavourite, syncFavouritesFromStorage} = useContext(EducationContext);
    const { t } = useTranslation();
    const {educationData} = state;
    const [dataLoaded, setDataLoaded] = useState(false);
    const [showContentListModal, setShowContentListModal] = useState(false);
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

    // Helper functions for content navigation
    const getFilteredContentForNavigation = () => {
        if (!fromFilter || !educationData.length) return [];
        
        return fromFilter === 'All'
            ? educationData
            : educationData.filter(item =>
                item.category === fromFilter || item.recommended === fromFilter
            );
    };

    const getCurrentContentIndex = () => {
        const filteredContent = getFilteredContentForNavigation();
        return filteredContent.findIndex(content => content._id === contentId);
    };

    const navigateToContent = (targetContent) => {
        navigation.replace('content', { 
            id: targetContent._id,
            fromFilter: fromFilter,
            isModal: true
        });
    };

    const navigateToNextContent = () => {
        const filteredContent = getFilteredContentForNavigation();
        const currentIndex = getCurrentContentIndex();
        
        if (currentIndex !== -1 && currentIndex < filteredContent.length - 1) {
            navigateToContent(filteredContent[currentIndex + 1]);
        }
    };

    const navigateToPreviousContent = () => {
        const filteredContent = getFilteredContentForNavigation();
        const currentIndex = getCurrentContentIndex();
        
        if (currentIndex > 0) {
            navigateToContent(filteredContent[currentIndex - 1]);
        }
    };

    // Individual content view
    const individualContent = contentId ? educationData.find(content => content._id === contentId) : null;
    if (!isFilterView && individualContent) {
        const { topic, content, category } = individualContent;

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
                navigation.goBack();
            }
        };

        return (
            <View style={styles.modalContainer} >
                <TouchableOpacity onPress={handleBackFromContent} style={styles.closeButton}>
                    <MaterialIcons name="close" size={24} color="#875B51" />
                </TouchableOpacity>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.modalContent}>
                        <Image source={require('../../../assets/tooth_icon.png')} style={styles.modalImage} />
                        <Text style={styles.contentTitle}>{topic}</Text>
                        <Text style={styles.contentCategory}>{category}</Text>
                        
                        <View style={styles.contentDetails}>
                            {console.log('Content loaded:', !!content)}
                            {console.log('Content length:', content?.length)}
                            {console.log('First item:', content?.[0])}
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
                                    {quizCompleted ? `${t('Try Again')} (${quizScore}/${totalQuestions})` : t('Take Quiz')}
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* Navigation Controls */}
                        {fromFilter && getFilteredContentForNavigation().length > 1 && (
                            <View style={styles.navigationContainer}>
                                {/* Content List Button */}
                                <TouchableOpacity 
                                    style={styles.contentListButton}
                                    onPress={() => setShowContentListModal(true)}
                                >
                                    <MaterialIcons name="list" size={20} color="#875B51" />
                                    <Text style={styles.contentListButtonText}>
                                        View All ({getFilteredContentForNavigation().length})
                                    </Text>
                                </TouchableOpacity>

                                {/* Previous/Next Buttons */}
                                <View style={styles.prevNextContainer}>
                                    <TouchableOpacity 
                                        style={[
                                            styles.navButton, 
                                            getCurrentContentIndex() === 0 && styles.navButtonDisabled
                                        ]}
                                        onPress={navigateToPreviousContent}
                                        disabled={getCurrentContentIndex() === 0}
                                    >
                                        <MaterialIcons 
                                            name="keyboard-arrow-left" 
                                            size={24} 
                                            color={getCurrentContentIndex() === 0 ? "#CCC" : "#875B51"} 
                                        />
                                        <Text style={[
                                            styles.navButtonText,
                                            getCurrentContentIndex() === 0 && styles.navButtonTextDisabled
                                        ]}>
                                            Previous
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                        style={[
                                            styles.navButton,
                                            getCurrentContentIndex() === getFilteredContentForNavigation().length - 1 && styles.navButtonDisabled
                                        ]}
                                        onPress={navigateToNextContent}
                                        disabled={getCurrentContentIndex() === getFilteredContentForNavigation().length - 1}
                                    >
                                        <Text style={[
                                            styles.navButtonText,
                                            getCurrentContentIndex() === getFilteredContentForNavigation().length - 1 && styles.navButtonTextDisabled
                                        ]}>
                                            Next
                                        </Text>
                                        <MaterialIcons 
                                            name="keyboard-arrow-right" 
                                            size={24} 
                                            color={getCurrentContentIndex() === getFilteredContentForNavigation().length - 1 ? "#CCC" : "#875B51"} 
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>

                {/* Content List Modal */}
                <Modal
                    visible={showContentListModal}
                    animationType="slide"
                    presentationStyle="pageSheet"
                    onRequestClose={() => setShowContentListModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{fromFilter}</Text>
                            <TouchableOpacity 
                                onPress={() => setShowContentListModal(false)}
                                style={styles.closeModalButton}
                            >
                                <MaterialIcons name="close" size={24} color="#875B51" />
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView style={styles.modalContentList}>
                            {getFilteredContentForNavigation().map((item, index) => (
                                <TouchableOpacity
                                    key={item._id}
                                    style={[
                                        styles.modalContentItem,
                                        item._id === contentId && styles.currentContentItem
                                    ]}
                                    onPress={() => {
                                        setShowContentListModal(false);
                                        if (item._id !== contentId) {
                                            navigateToContent(item);
                                        }
                                    }}
                                >
                                    <View style={styles.modalItemContent}>
                                        <Text style={[
                                            styles.modalItemTitle,
                                            item._id === contentId && styles.currentContentItemText
                                        ]}>
                                            {item.topic}
                                        </Text>
                                        <Text style={styles.modalItemCategory}>
                                            {item.category}
                                        </Text>
                                    </View>
                                    {item._id === contentId && (
                                        <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </Modal>
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