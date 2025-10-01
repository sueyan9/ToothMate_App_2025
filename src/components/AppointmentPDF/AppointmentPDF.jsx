import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import styles from './styles';

const AppointmentPDF = props => {
    const { base64 } = props;
    const [showError, setShowError] = useState(false);

    // open PDF file
    const openPDF = async () => {1
        if (base64) {
            const uri = `data:application/pdf;base64,${base64}`;
            try {
                await WebBrowser.openBrowserAsync(uri); // 使用 expo-web-browser 打开 PDF
            } catch (error) {
                setShowError(true);
                console.error('Error opening PDF: ', error);
            }
        } else {
            setShowError(true);
        }
    };

    return (
        <LinearGradient colors={['#78d0f5', 'white', '#78d0f5']} style={styles.container}>
            <View style={styles.container}>
                <Text style={styles.titleTextStyle}> ToothMate </Text>

                {base64 ? (
                    <Button
                        title="Open PDF"
                        onPress={openPDF}  // 点击按钮打开 PDF
                        containerStyle={styles.buttonContainer}
                    />
                ) : (
                    <Text>No PDF data available</Text>
                )}

                {showError && (
                    <Text style={{ color: 'red', textAlign: 'center' }}>Failed to load PDF</Text>
                )}

                <Button
                    title="Close"
                    onPress={() => console.log("Close PDF view")}
                    containerStyle={styles.buttonContainer}
                />
            </View>
        </LinearGradient>
    );
};

export default AppointmentPDF;
