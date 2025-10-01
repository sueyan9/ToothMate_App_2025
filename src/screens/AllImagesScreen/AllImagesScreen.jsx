import React from 'react';
import { View, FlatList, TouchableWithoutFeedback, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Buffer } from 'buffer';
import AppointmentImage from '../../components/AppointmentImage';
import styles from './styles';

global.Buffer = global.Buffer || Buffer.Buffer;

const AllImagesScreen = ({ route, navigation }) => {
    const { images } = route.params;

    const base64images = React.useMemo(() => {
        return images
            .map(image => Buffer.from(image.img.data.data).toString('base64'))
            .filter(Boolean);
    }, [images]);

    const renderItem = React.useCallback(
        ({ item, index }) => (
            <TouchableWithoutFeedback
                accessible={false}
                onPress={() =>
                    navigation.navigate('images', {
                        images: base64images,
                        imageIndex: index,
                    })
                }
            >
                <View key={index}>
                    <AppointmentImage base64={item} />
                </View>
            </TouchableWithoutFeedback>
        ),
        [base64images, navigation],
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#78d0f5', '#fff', '#78d0f5']} style={styles.container}>
                <FlatList
                    numColumns={1}
                    data={base64images}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderItem}
                />
            </LinearGradient>
        </View>
    );
};

AllImagesScreen.navigationOptions = () => ({
    title: 'All Images',
    headerTintColor: 'black',
    headerBackTitleVisible: false,
    safeAreaInsets: Platform.OS === 'ios' ? { top: 45 } : { top: 30 },
    headerStyle: {
        backgroundColor: '#78d0f5',
    },
    cardStyle: {
        backgroundColor: 'white',
    },
});

export default AllImagesScreen;
