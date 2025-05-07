import React from 'react';
import { Text, ActivityIndicator, View, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ToothLogo from '../../assets/t_logo_crop2.png';
import styles from './styles';

const LoadingScreen = ({ showTooth }) => {
    const renderLogo = showTooth ? (
        <ImageBackground source={ToothLogo} style={styles.imageBackgroundStyle}>
            <View style={styles.activityIndicatorViewStyle}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        </ImageBackground>
    ) : (
        <View style={styles.activityIndicatorViewStyle}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );

    return (
        <LinearGradient colors={['#7ad0f5', 'white', '#7ad0f5']} style={styles.container}>
            <Text style={styles.header}>ToothMate</Text>
            {renderLogo}
        </LinearGradient>
    );
};

export default LoadingScreen;
