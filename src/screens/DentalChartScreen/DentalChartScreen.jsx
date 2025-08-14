import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import axiosApi from "../../api/axios";

const TREATMENT_TO_EDU_ID = {
    "Filling": "3",
    "Root Canal": "4",
    "Extraction": "2",
    "Crown Placement": "5",
    "Cleaning": "7",
    "Checkup": "1",
  };
  
const DentalChartScreen = () => {
    const webViewRef = useRef(null);
    const [parent, setParent] = useState(true);
    const [res, setRes] = useState(null);
    const [selectedTooth, setSelectedTooth] = useState(null); // tooth info from WebView
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = await AsyncStorage.getItem('id');
                console.log('userId is:', userId);

                const res = await axiosApi.get(`/isChild/${userId}`);
                setRes(res.data);

                if (res.data.isChild != null) {
                    setParent(false);
                }
            } catch (error) {
                console.error('❌ Failed to fetch user:', error);
            }
        };

        fetchUser();
    }, []);

    const handleMessage = (event) => {
        try {
          const data = JSON.parse(event.nativeEvent.data);
          console.log('📩 from WebView:', data);
    
          // ✅ Handle the web button press
          if (data.type === 'VIEW_EDUCATION' && Array.isArray(data.treatments)) {
            const first = data.treatments[0]; // pick first treatment for now
            const id = first ? TREATMENT_TO_EDU_ID[first.type] : undefined;
    
            if (id) {
              // Navigate INTO the Education stack -> 'content'
              navigation.navigate('Education', { screen: 'content', params: { id } });
            } else {
              navigation.navigate('Education'); // fallback: open library
            }
            return;
          }
        } catch (error) {
            console.error('❌ Failed to parse WebView message:', error);
        }
    };

    if (!res) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const url = `https://tooth-mate-app-2025.vercel.app/?parent=${parent}`;

    return (
        <View style={{ flex: 1 }}>
            <WebView
                ref={webViewRef}
                source={{ uri: url }}
                style={{ flex: 1 }}
                originWhitelist={['*']}
                javaScriptEnabled
                domStorageEnabled
                onMessage={handleMessage}
            />

            {/* Show the button only if treatments exist */}
            {selectedTooth?.treatments?.length > 0 && (
                <View style={styles.buttonContainer}>
                    <Button
                        title="View Education"
                        onPress={() =>
                            navigation.navigate('EducationContent', {
                                toothId: selectedTooth.toothId,
                                treatments: selectedTooth.treatments
                            })
                        }
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        padding: 10,
        backgroundColor: '#fff'
    }
});

export default DentalChartScreen;
