import { WEB_DENTAL_CHART_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import axiosApi from "../../api/axios";

const DentalChartScreen = () => {
    const webViewRef = useRef(null);
    const [parent, setParent] = useState(true); // Determines whether the user is a parent (default is true)
    const [res, setRes] = useState(null);// Stores the response from the isChild API

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = await AsyncStorage.getItem('id');
                console.log('userId is:', userId);

                const res = await axiosApi.get(`/isChild/${userId}`);

                setRes(res.data);
                if (res.data.isChild != null) {
                    setParent(false)// If the user is a child, update state
                }

            } catch (error) {
                console.error('❌  Failed to fetch user:', error);
            }
        };

        fetchUser();
    }, []);

    // Show loading indicator while waiting for user data
    if (!res) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // Construct WebView URL with user type as a query parameter
    const url = `${WEB_DENTAL_CHART_URL}?parent=${parent}`;

    return (
        <View style={{ flex: 1 }}>
            <WebView
                ref={webViewRef}
                source={{ uri: url }}
                style={{ flex: 1 }}
                originWhitelist={['*']}
                javaScriptEnabled
                domStorageEnabled
                onMessage={(event) => {
                    console.log('📩 Received from WebView:', event.nativeEvent.data);
                }}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});

export default DentalChartScreen;