import { Righteous_400Regular, useFonts } from '@expo-google-fonts/righteous';
import { VarelaRound_400Regular } from '@expo-google-fonts/varela-round';
import { MaterialIcons } from '@expo/vector-icons';
import { useContext } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Context } from '../../context/EducationContext/EducationContext';
import styles from './styles';

const EducationScreen = ({ navigation }) => {
    const { state } = useContext(Context);
    
    const [fontsLoaded] = useFonts({
        Righteous_400Regular,
        VarelaRound_400Regular,
    });

    const filters = [
        'All', 
        'Whats Good for My Teeth', 
        'Whats Bad for My Teeth',
        'Treatments', 
        'Conditions', 
        'Oral Care', 
        'Dentist Recommended Readings'
    ];

    // Calculate item count for each filter using context data
    const getFilterCount = (filter) => {
        if (filter === 'All') {
            return state.length;
        }
        return state.filter(item => 
            item.category === filter || item.recommended === filter
        ).length;
    };

    const handleFilterPress = (filter) => {
        // Navigate to content page with the selected filter
        navigation.navigate('content', { 
            selectedFilter: filter
        });
    };

    const handleSpecialCardPress = (cardType) => {
        // Navigate to content page with special filter
        navigation.navigate('content', { 
            selectedFilter: cardType
        });
    };

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder='Search Educational Readings...' round onChangeText={searchFunction}
          value={searchText}/>
      </View>

    return (
        <View style={styles.container}>
            <Text testID="education-title" style={styles.titleText}>ToothMate Library</Text>

            <ScrollView style={styles.contentList} showsVerticalScrollIndicator={false}>
                {/* Filter Category Cards */}
                {filters.map((filter) => (
                    <TouchableOpacity 
                        key={filter}
                        onPress={() => handleFilterPress(filter)}
                        style={styles.contentCard}
                        testID={`filter-card-${filter}`}
                    >
                        <View style={styles.cardContent}>
                            <Text style={styles.topicText}>{filter}</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={30} color="#875B51"/>
                        </View>
                      
                    </TouchableOpacity>
                ))}

                {/* Special Cards */}
                
            </ScrollView>
        </View>
    );
};

export default EducationScreen;