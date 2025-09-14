import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import * as WebBrowser from 'expo-web-browser';
import styles from './styles';

const AppointmentPDF = ({ base64, fileName = 'document.pdf' }) => {
    const [showError, setShowError] = useState(false);

    const openPDF = async () => {
        try {
            if (!base64) {
                setShowError(true);
                return;
            }
            const uri = `data:application/pdf;base64,${base64}`;
            await WebBrowser.openBrowserAsync(uri);
        } catch (e) {
            console.error('Error opening PDF:', e);
            setShowError(true);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ToothMate</Text>
            {base64 ? (
                <Button title="Open PDF" onPress={openPDF} />
            ) : (
                <Text>No PDF data available</Text>
            )}
            {showError && <Text style={styles.error}>Failed to load PDF</Text>}
        </View>
    );
};

export default AppointmentPDF;
