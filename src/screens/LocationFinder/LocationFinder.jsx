
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Context as ClinicContext } from '../../context/ClinicContext/ClinicContext';
import styles from './styles';

const LocationFinder = ({ route }) => {
    
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [dataLoaded, setDataLoaded] = useState(false);
    
    // Get clinic data from context
    const { state: clinicState, getAllClinics } = useContext(ClinicContext);
    const locationData = clinicState || [];
    
    // Load clinic data when component mounts
    useEffect(() => {
        const loadClinics = async () => {
            setDataLoaded(false);
            try {
                await getAllClinics();
                setDataLoaded(true);
            } catch (error) {
                console.error('Error loading clinics:', error);
                setDataLoaded(true);
            }
        };
        loadClinics();
    }, []);
    
    // Filter based on search text (searching by address)
    const searchedAndFilteredContent = locationData.filter(item => {
        if (searchText === '') return true;
        
        const searchLower = searchText.toLowerCase();
        return (
            (item.name && item.name.toLowerCase().includes(searchLower)) ||
            (item.address && item.address.toLowerCase().includes(searchLower)) ||
            (item.phone && item.phone.toLowerCase().includes(searchLower)) ||
            (item.email && item.email.toLowerCase().includes(searchLower))
        );
    });

    const searchFunction = (text) => setSearchText(text);
    const clearSearch = () => setSearchText('');

    const handleClinicPress = async (clinic) => {
        // You can add navigation to clinic details or other actions here
        console.log('Selected clinic:', clinic.code);
        await AsyncStorage.setItem('selectedClinicCode', clinic.code);
        navigation.goBack();
    };

    if (!dataLoaded) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Loading clinics...</Text>
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
                    // Display clinic data from database
                    searchedAndFilteredContent.map((item) => (
                        <TouchableOpacity
                            key={item._id || item.id}
                            onPress={() => handleClinicPress(item)}
                            style={styles.contentCard}
                        >
                            <View style={styles.absoluteArrow}>
                                <MaterialIcons name="keyboard-arrow-right" size={30} color="#875B51" />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.topicText}>{item.name}</Text>
                                <Text style={styles.addressText}>{item.address}</Text>
                                {item.phone && (
                                    <Text style={styles.contactText}>📞 {item.phone}</Text>
                                )}
                                {item.email && (
                                    <Text style={styles.contactText}>✉️ {item.email}</Text>
                                )}
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