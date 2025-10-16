import { useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';


const WelcomeScreen = props => {
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollViewRef = useRef(null);
    const {width} = Dimensions.get('window');

    const textItems = [
        "See your complete mouth history - past treatments, current status, and upcoming appointments all in one place.",
        "Learn about oral health at your own pace with expert-backed articles and guides.",
        "Make dental care fun for kids with games, quizzes, and badges.",
        "Stay connected with your dental team and bridge the gap between visits."
    ];

    const carouselImages = [
        require('../../../assets/dental_chart.png'),
        require('../../../assets/education.png'),
        require('../../../assets/kids.png'),
        require('../../../assets/linked.png')
    ];

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);

        setCurrentIndex(index);
    };

    const handleDotPress = (index) => {
        setCurrentIndex(index);
        scrollViewRef.current?.scrollTo({
            x: index * width,
            animated: true,
        });
    };

    const handleNext = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < textItems.length) {
            handleDotPress(nextIndex);
        } else {
            handleDotPress(0);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.welcomeText}>Welcome To</Text>
                    <View style={styles.logoRow}>
                        <Image
                            source={require('../../../assets/tooth_icon_white.png')}
                            style={styles.toothIcon}
                        />
                    <Text style={styles.appName}>ToothMate</Text>
                </View>
            </View>

            <View style={styles.carouselContainer}>
                <Image
                    source={require('../../../assets/wavy_vector.png')}
                    style={styles.wavyBackground}
                />
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    scrollEventThrottle={16}
                    onScroll={handleScroll}
                    showsHorizontalScrollIndicator={false}
                    style={styles.carousel}
                >
                    {carouselImages.map((image, index) => (
                        <Image
                            key={index}
                            source={image}
                            style={[styles.carouselImage, { width }]}
                        />
                    ))}
                </ScrollView>
            </View>

            <Text style={styles.descriptionText}>
                {textItems[currentIndex]}
            </Text>

            <View style={styles.dotsContainer}>
                {textItems.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index && styles.activeDot,
                        ]}
                        onPress={() => handleDotPress(index)}
                    />
                ))}
            </View>

            <View style={styles.buttonContainer}>
            <TouchableOpacity style={{flex: 1}} onPress={() => navigation.navigate('loginFlow', { screen: 'Signup' })}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}} onPress={() => console.log("FIND A TM PRESSED")}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Find A <Text style={{color: '#516287'}}>ToothMate</Text></Text>
                </View>
            </TouchableOpacity>
            </View>
        </View>
    );
};

export default WelcomeScreen;