// src/screens/InvoiceScreen/InvoiceScreen.jsx
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

    // 如果是 dataUrl 就取逗号后的 base64；如果不是 http，就把它当作纯 base64
    const base64 = isHttp ? null : (isDataUrl ? (pdf.split(',')[1] || '') : pdf);

    return (
        <View style={{ flex: 1 }}>
            {/* 你如果想要自定义 header，可以把这个 Screen 在 Stack 里 headerShown: true 并设置 title */}
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
