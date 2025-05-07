import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';  // 保持使用线性渐变
import * as WebBrowser from 'expo-web-browser';  // 导入 WebBrowser
import styles from './styles';  // 样式文件保持不变

const AppointmentPDF = props => {
    const { base64 } = props;
    const [showError, setShowError] = useState(false);

    // 打开 PDF 文件
    const openPDF = async () => {
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
