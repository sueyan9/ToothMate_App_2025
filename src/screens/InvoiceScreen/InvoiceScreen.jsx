import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import AppointmentPDF from '../../components/AppointmentPDF';
import styles from './styles';

export default function InvoiceScreen({ route }) {
    const { pdf, title } = route.params || {};

    if (!pdf) {
        return (
            <View style={styles.container}>
                <Text>No PDF available</Text>
            </View>
        );
    }

    const isHttp = typeof pdf === 'string' && /^https?:\/\//i.test(pdf);
    const isDataUrl = typeof pdf === 'string' && pdf.startsWith('data:application/pdf;base64,');

// If it's a data URL, take the base64 part after the comma;
    // if it's not http(s), treat it as a raw base64 string.
    const base64 = isHttp ? null : (isDataUrl ? (pdf.split(',')[1] || '') : pdf);

    return (
        <View style={{ flex: 1 }}>
            {/*  If you want a custom header title, enable headerShown for this screen in the Stack and set `title` */}
            {isHttp ? (
                <WebView source={{ uri: pdf }} style={{ flex: 1 }} />
            ) : (
                <ScrollView contentContainerStyle={{ flex: 1 }}>
                    <View style={styles.container}>
                        <AppointmentPDF base64={base64} />
                    </View>
                </ScrollView>
            )}
        </View>
    );
}
