import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';

const EducationContentScreen = ({ route }) => {
    // Mock data until backend/context is ready
    const [educationData] = useState([
        { _id: '1', topic: 'Dental Hygiene', category: 'Oral Care', recommended: null, content: 
            [
                "Brush teeth twice daily with fluoride toothpaste",
                "Floss at least once per day",
                "Replace toothbrush every 3-4 months",
                "Visit dentist for regular check-ups",
                "Limit sugary and acidic foods/drinks"
            ]
        },
        { _id: '2', topic: 'Tooth Decay', category: 'Conditions', recommended: 'Dentist Recommended Readings', content: 
            [
                "Tooth decay is the destruction of tooth enamel. It's caused by bacteria in your mouth that make acids when they break down sugar.",
                "Preventing tooth decay involves good oral hygiene and a healthy diet.",
                "Regular dental check-ups are essential for early detection and treatment.",
                "Fluoride treatments can help strengthen tooth enamel and make it more resistant to decay.",
            ]
        },
        { _id: '3', topic: 'Fluoride Treatment', category: 'Treatments', recommended: null, content: 
            [
                "Fluoride is a natural mineral that helps strengthen teeth and prevent cavities.",
                "Professional fluoride treatments are applied by a dentist or dental hygienist.",
                "They are quick, painless, and highly effective, especially for children and those at high risk of tooth decay."
            ]
        },
        { _id: '4', topic: 'Orthodontics', category: 'Treatments', recommended: null, content: 
            [
                "Orthodontics is a dental specialty focused on correcting misaligned teeth and jaws.",
                "Common treatments include braces, clear aligners, and retainers.",
                "Orthodontic treatment can improve not only the appearance of your smile but also your bite and overall oral health."
            ]
        },
        { _id: '5', topic: 'Dental Implants', category: 'Treatments', recommended: 'Dentist Recommended Readings', content: 
            [
                "Dental implants are a permanent solution for missing teeth. They are surgically placed in the jawbone.",
                "They act as a strong foundation for a replacement tooth that looks, feels, and functions like a natural tooth."
            ]
        },
        { _id: '6', topic: 'Gum Disease', category: 'Conditions', recommended: 'Dentist Recommended Readings', content: 
            [
                "Gum disease, also known as periodontal disease, is an infection of the tissues that hold your teeth in place.",
                "It is a major cause of tooth loss in adults.",
                "Symptoms include swollen, red, or bleeding gums. Good oral hygiene is key to prevention."
            ]
        },
        { _id: '7', topic: 'Flossing Guide', category: 'Oral Care', recommended: 'Dentist Recommended Readings', content: 
            [
                "Flossing removes plaque and food particles from between your teeth and under your gumline, where a toothbrush can't reach.",
                "It's recommended to floss at least once a day.",
                "There are different types of floss and flossing tools available; choose the one that works best for you."
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