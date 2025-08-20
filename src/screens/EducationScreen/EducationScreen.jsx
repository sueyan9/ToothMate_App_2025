import { Righteous_400Regular, useFonts } from '@expo-google-fonts/righteous';
import { VarelaRound_400Regular } from '@expo-google-fonts/varela-round';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LoadingScreen from '../LoadingScreen';
import styles from './styles';

const EducationScreen = ({ route }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedContent, setSelectedContent] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [fontsLoaded] = useFonts({
    Righteous_400Regular,
    VarelaRound_400Regular,
  });

  // Map treatment types from toothData.json to one of your 7 education topics
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

  // mock data until backend has been fixed
  const [educationData] = useState([
    { id: '1', topic: 'Dental Hygiene', category: 'Oral Care', recommended: null, details: [
        "Brush teeth twice daily with fluoride toothpaste",
        "Floss at least once per day",
        "Replace toothbrush every 3-4 months",
        "Visit dentist for regular check-ups",
        "Limit sugary and acidic foods/drinks"
      ], image: require('../../../assets/tooth_icon.png') },
    { id: '2', topic: 'Tooth Decay', category: 'Conditions', recommended: 'Dentist Recommended Readings', details: [
        "Brush teeth twice daily with fluoride toothpaste",
        "Floss at least once per day",
        "Replace toothbrush every 3-4 months",
        "Visit dentist for regular check-ups",
        "Limit sugary and acidic foods/drinks"
      ], image: null },
    { id: '3', topic: 'Fluoride Treatment', category: 'Treatments', recommended: null, details: [
        "Brush teeth twice daily with fluoride toothpaste",
        "Floss at least once per day",
        "Replace toothbrush every 3-4 months",
        "Visit dentist for regular check-ups",
        "Limit sugary and acidic foods/drinks"
      ], image: null },
    { id: '4', topic: 'Orthodontics', category: 'Treatments', recommended: null, details: [
        "Brush teeth twice daily with fluoride toothpaste",
        "Floss at least once per day",
        "Replace toothbrush every 3-4 months",
        "Visit dentist for regular check-ups",
        "Limit sugary and acidic foods/drinks"
      ], image: null },
    { id: '5', topic: 'Dental Implants', category: 'Treatments', recommended: 'Dentist Recommended Readings', details: [
        "Brush teeth twice daily with fluoride toothpaste",
        "Floss at least once per day",
        "Replace toothbrush every 3-4 months",
        "Visit dentist for regular check-ups",
        "Limit sugary and acidic foods/drinks"
      ], image: null },
    { id: '6', topic: 'Gum Disease', category: 'Conditions', recommended: 'Dentist Recommended Readings', details: [
        "Brush teeth twice daily with fluoride toothpaste",
        "Floss at least once per day",
        "Replace toothbrush every 3-4 months",
        "Visit dentist for regular check-ups",
        "Limit sugary and acidic foods/drinks"
      ], image: null },
    { id: '7', topic: 'Flossing Guide', category: 'Oral Care', recommended: 'Dentist Recommended Readings', details: [
        "Brush teeth twice daily with fluoride toothpaste",
        "Floss at least once per day",
        "Replace toothbrush every 3-4 months",
        "Visit dentist for regular check-ups",
        "Limit sugary and acidic foods/drinks"
      ], image: null },
  ]);

  const filters = [ 'All', 'Treatments', 'Conditions', 'Oral Care', 'Dentist Recommended Readings' ];

  const filteredContent = activeFilter === 'All'
    ? educationData
    : educationData.filter(item => item?.category === activeFilter || item?.recommended === activeFilter);

  const searchedAndFilteredContent = filteredContent.filter(item =>
    item.topic.toLowerCase().includes(searchText.toLowerCase())
  );

  // If navigation param exists, map treatment → topic and pre-filter
  useEffect(() => {
    const treatment = route?.params?.treatment;
    if (!treatment) return;

    const topic = TREATMENT_TO_TOPIC[treatment] || 'Dental Hygiene';
    const match = educationData.find(i => i.topic === topic);
    const category = match?.category || 'All';

    setActiveFilter(category);  
    setSearchText(topic);       
  }, [route?.params?.treatment, educationData]);

 
  useEffect(() => {
    const treatment = route?.params?.treatment;
    if (!treatment) return;
    if (selectedContent) return;

    if (searchedAndFilteredContent.length > 0) {
      setSelectedContent(searchedAndFilteredContent[0]);
    } else {
      const anyInFilter = filteredContent[0];
      if (anyInFilter) setSelectedContent(anyInFilter);
    }
  }, [searchedAndFilteredContent, filteredContent, selectedContent, route?.params?.treatment]);

  const searchFunction = (text) => setSearchText(text);
  const openContent = (content) => setSelectedContent(content);
  const closeContent = () => setSelectedContent(null);

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Text testID="education-title" style={styles.titleText}>Education Library</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder='Search Educational Readings...' round onChangeText={searchFunction}
          value={searchText}/>
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
            testID={`card-${item.id}`}
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
