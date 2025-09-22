
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';

const LocationFinder = ({ route }) => {
    
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [dataLoaded, setDataLoaded] = useState(true); // Set to true since we have no data to load
    
    // Empty data array for now - you can populate this later with dental clinic data
    const locationData = [];
    
    // Filter and search functionality (ready for when you add data)
    const filteredContent = locationData; // No filtering for now
    
    const searchedAndFilteredContent = filteredContent.filter(item => {
        // This will work when you add location data with name/address fields
        return searchText === '' || 
               (item.name && item.name.toLowerCase().includes(searchText.toLowerCase())) ||
               (item.address && item.address.toLowerCase().includes(searchText.toLowerCase()));
    });

    const searchFunction = (text) => setSearchText(text);
    const clearSearch = () => setSearchText('');

    if (!dataLoaded) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Loading locations...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Back Arrow - Top Corner */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topCornerBackButton}>
                <MaterialIcons name="arrow-back" size={24} color="#875B51" />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.headerTextContainer}>
                    <Text style={[styles.titleText]}>Toothmate Dentists</Text>
                    <Text style={[styles.itemCountText]}>
                        {searchedAndFilteredContent.length} location{searchedAndFilteredContent.length !== 1 ? 's' : ''}
                    </Text>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder='Search for dentists or locations...'
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
                            {searchText ? 'No dentists found for your search.' : 'No dentist locations available yet.'}
                        </Text>
                    </View>
                ) : (
                    // This section will be populated when you add location data
                    searchedAndFilteredContent.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {/* Handle location selection */}}
                            style={styles.contentCard}
                        >
                            <View style={styles.absoluteArrow}>
                                <MaterialIcons name="keyboard-arrow-right" size={30} color="#875B51" />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.topicText}>{item.name}</Text>
                                <Text style={styles.addressText}>{item.address}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

// Header Options
LocationFinder.navigationOptions = () => ({
    title: 'Location Finder',
    headerTintColor: 'black',
    headerBackTitleVisible: false,
    safeAreaInsets: Platform.OS === 'ios' ? { top: 45 } : { top: 30 },
    headerStyle: { backgroundColor: '#78d0f5' },
    cardStyle: { backgroundColor: 'white' },
});

export default LocationFinder;