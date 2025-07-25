import { Righteous_400Regular, useFonts } from '@expo-google-fonts/righteous';
import { VarelaRound_400Regular } from '@expo-google-fonts/varela-round';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LoadingScreen from '../LoadingScreen';
import styles from './styles';

const EducationScreen = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedContent, setSelectedContent] = useState(null);
    const [fontsLoaded] = useFonts({
        Righteous_400Regular,
        VarelaRound_400Regular,
    });

        //mock data until backend has been fixed
    const [educationData] = useState([
        { id: '1', topic: 'Dental Hygiene', category: 'Oral Care', details: [
                "Brush teeth twice daily with fluoride toothpaste",
                "Floss at least once per day",
                "Replace toothbrush every 3-4 months",
                "Visit dentist for regular check-ups",
                "Limit sugary and acidic foods/drinks"
            ], image: require('../../../assets/tooth_icon.png') },
        { id: '2', topic: 'Tooth Decay', category: 'Conditions', details: [
                "Brush teeth twice daily with fluoride toothpaste",
                "Floss at least once per day",
                "Replace toothbrush every 3-4 months",
                "Visit dentist for regular check-ups",
                "Limit sugary and acidic foods/drinks"
            ], image: null },
        { id: '3', topic: 'Fluoride Treatment', category: 'Treatments', details: [
                "Brush teeth twice daily with fluoride toothpaste",
                "Floss at least once per day",
                "Replace toothbrush every 3-4 months",
                "Visit dentist for regular check-ups",
                "Limit sugary and acidic foods/drinks"
            ], image: null },
        { id: '4', topic: 'Orthodontics', category: 'Treatments', details: [
                "Brush teeth twice daily with fluoride toothpaste",
                "Floss at least once per day",
                "Replace toothbrush every 3-4 months",
                "Visit dentist for regular check-ups",
                "Limit sugary and acidic foods/drinks"
            ], image: null },
        { id: '5', topic: 'Dental Implants', category: 'Treatments', details: [
                "Brush teeth twice daily with fluoride toothpaste",
                "Floss at least once per day",
                "Replace toothbrush every 3-4 months",
                "Visit dentist for regular check-ups",
                "Limit sugary and acidic foods/drinks"
            ], image: null },
        { id: '6', topic: 'Gum Disease', category: 'Conditions', details: [
                "Brush teeth twice daily with fluoride toothpaste",
                "Floss at least once per day",
                "Replace toothbrush every 3-4 months",
                "Visit dentist for regular check-ups",
                "Limit sugary and acidic foods/drinks"
            ], image: null },
        { id: '7', topic: 'Flossing Guide', category: 'Oral Care', details: [
                "Brush teeth twice daily with fluoride toothpaste",
                "Floss at least once per day",
                "Replace toothbrush every 3-4 months",
                "Visit dentist for regular check-ups",
                "Limit sugary and acidic foods/drinks"
            ], image: null },
    ]);

    const filters = [ 'All', 'Treatments', 'Conditions', 'Oral Care' ];

    const filteredContent = activeFilter === 'All' ? educationData : educationData.filter(item => item?.category === activeFilter);

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
                <Text testID="education-title" style={styles.titleText}>Education Library</Text>

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
                <ScrollView style={styles.contentContainer}>
                {filteredContent.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        onPress={() => openContent(item)}
                        style={styles.contentCard}
                        testID={`card-${item.id}`}
                    >
                        <View style={styles.cardContent}>
                            <Text style={styles.topicText}>{item.topic}</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={30} color="#875B51"/>
                        </View>
                        <View style={styles.categoryTag}>
                            <Text style={styles.categoryText}>{item.category}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Content Detail Modal */}
            <Modal
                visible={!!selectedContent}
                animationType="fade"
                transparent={false}
                testID="content-modal"
            >
                {selectedContent && (
                    <View style={styles.modalContainer}>
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={closeContent}
                            testID="close-modal-btn"
                        >
                            <MaterialIcons name="close" size={28} color="#333333"/>
                        </TouchableOpacity>
                        
                        <ScrollView style={styles.modalContent}>
                            {/* only adds image if image is available in the data */}
                            {selectedContent.image && (
                                <Image source={selectedContent.image} style={styles.contentImage} />
                            )}
                            
                            <Text style={styles.contentTitle}>{selectedContent.topic}</Text>
                            <Text style={styles.contentCategory}>{selectedContent.category}</Text>
                            
                            <View style={styles.contentDetails}>
                                {selectedContent.details.map((detail, index) => (
                                    <View key={index} style={styles.detailItem}>
                                        <View style={styles.bulletPoint} />
                                        <Text style={styles.detailText}>{detail}</Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                )}
            </Modal>
            </View>
    );
};

export default EducationScreen;
