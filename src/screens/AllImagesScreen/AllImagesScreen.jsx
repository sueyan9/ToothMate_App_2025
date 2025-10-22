import React, { useMemo, useCallback, useLayoutEffect } from 'react';
import { View, FlatList, TouchableWithoutFeedback, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Buffer } from 'buffer';
import AppointmentImage from '../../components/AppointmentImage';
import styles from './styles';

global.Buffer = global.Buffer || Buffer;

const ROW_HEIGHT = 300;

const AllImagesScreen = ({ route, navigation }) => {
    // Configure header (v6)
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'All Images',
            headerShown: true,
            headerTransparent: true, // change to false if you want solid color
            headerBackTitleVisible: false,
            headerTintColor: '#333',
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ paddingHorizontal: 12 }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
            ),
            // Optional: if you want a colored header bar instead of transparent
            // headerStyle: { backgroundColor: '#78d0f5' },
        });
    }, [navigation]);

    const { images = [], imageIndex = 0 } = route.params ?? {};

    // Normalize to data URLs
    const imagesDataUrl = useMemo(() => {
        return (Array.isArray(images) ? images : [])
            .map((s) => (typeof s === 'string' ? s.trim() : ''))
            .filter(Boolean)
            .map((s) => (s.startsWith('data:') ? s : `data:image/jpeg;base64,${s}`));
    }, [images]);

    const goToImage = useCallback(
        (index) => navigation.navigate('images', { images: imagesDataUrl, imageIndex: index }),
        [navigation, imagesDataUrl]
    );

    const renderItem = useCallback(
        ({ item, index }) => (
            <TouchableWithoutFeedback accessible={false} onPress={() => goToImage(index)}>
                <View style={{ height: ROW_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
                    {/* AppointmentImage should size itself to ~300h to match ROW_HEIGHT */}
                    <AppointmentImage base64={item} />
                </View>
            </TouchableWithoutFeedback>
        ),
        [goToImage]
    );

    // FlatList crashes if initialScrollIndex is set when list is empty
    const safeInitialIndex =
        imagesDataUrl.length > 0 && imageIndex > 0 && imageIndex < imagesDataUrl.length ? imageIndex : 0;

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#78d0f5', '#fff', '#78d0f5']} style={styles.container}>
                <FlatList
                    data={imagesDataUrl}
                    keyExtractor={(_, i) => String(i)}
                    renderItem={renderItem}
                    initialScrollIndex={safeInitialIndex}
                    getItemLayout={(_, i) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * i, index: i })}
                    contentContainerStyle={{ paddingVertical: 12 }}
                    ListEmptyComponent={
                        <View style={{ padding: 24 }}>
                            {/* Show something when no images */}
                        </View>
                    }
                    // Remove scroll indicators if you prefer a clean look
                    showsVerticalScrollIndicator={false}
                />
            </LinearGradient>
        </View>
    );
};

export default AllImagesScreen;
