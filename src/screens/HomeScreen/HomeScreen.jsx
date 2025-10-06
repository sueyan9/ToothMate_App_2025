import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
import { useTranslation } from '../../context/TranslationContext/useTranslation';
import { Context as UserContext } from '../../context/UserContext/UserContext';
import styles from './styles';

const HomeScreen = () => {
    // Translation hook
    const { t, translateAndCache, currentLanguage } = useTranslation();

    // Define texts to translate
    const textsToTranslate = [
        'Loading ToothMate...',
        'Hello,',
        'User Name',
        'Your Next Appointment:',
        '22nd May at Dental Clinic',
        'Note from Dentist:',
        'Bring retainer!',
        'Next Oral Checkup Due:',
        'Latest Appointment Notes:',
        'Please have a look at Savacol and a water flosser.',
        'See My Mouth',
        'Sign Out',
        'Are you sure you want to sign out?',
        'Cancel'
    ];

    const profilePictures = [
        require('../../../assets/profile pictures/p0.png'),
        require('../../../assets/profile pictures/p1.png'),
        require('../../../assets/profile pictures/p2.png'),
        require('../../../assets/profile pictures/p3.png'),
        require('../../../assets/profile pictures/p4.png'),
        require('../../../assets/profile pictures/p5.png'),
        require('../../../assets/profile pictures/p6.png'),
        require('../../../assets/profile pictures/p7.png'),
        require('../../../assets/profile pictures/p8.png'),
    ];

    const navigation = useNavigation();

    const {
        signout,
    } = useContext(AuthContext);

    // Translate texts when language changes
    useEffect(() => {
        if (currentLanguage !== 'en') {
            translateAndCache(textsToTranslate);
        }
    }, [currentLanguage]);

    const handleSignOut = () => {
    Alert.alert(
        t('Sign Out'),
        t('Are you sure you want to sign out?'),
        [
        {
            text: t('Cancel'),
            style: 'cancel',
        },
        {
            text: t('Sign Out'),
            style: 'destructive',
            onPress: () => signout(),
        },
        ]
    );
    };

        const { 
        state: { details, selectedProfilePicture }, 
        getUser, 
        getDentalClinic, 
        checkCanDisconnect,
        getProfilePicture
        } = useContext(UserContext);

        const [isLoading, setIsLoading] = useState(true);

        useFocusEffect(
        React.useCallback(() => {
            const fetchUserData = async () => {
            setIsLoading(true);
            try {
                await getUser();
                await getDentalClinic();
                await checkCanDisconnect();
                await getProfilePicture();
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
            };
    
            fetchUserData();
        }, [])
        );

        if (isLoading) {
            return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>{t('Loading ToothMate...')}</Text>
                </View>
            </SafeAreaView>
            );
        }

        const getInitials = (firstname, lastname) => {
            if (!firstname && !lastname) return 'U';
            const first = firstname ? firstname.charAt(0).toUpperCase() : '';
            const last = lastname ? lastname.charAt(0).toUpperCase() : '';
            return first + last;
        };


    return (
        <View style={styles.container}>

            {/*remove later*/}
            <MaterialCommunityIcons name='home' size={24} onPress={() => navigation.navigate('SplashScreen')} style={{marginTop: 150, marginLeft: 40, position: 'absolute', zIndex: 1000}}/>

            <View style={styles.helloContainer}>
                <View style={styles.profileContainer}>
                    {selectedProfilePicture !== null ? (
                        <Image 
                        source={profilePictures[selectedProfilePicture]} 
                        style={styles.profile}
                        />
                    ) : (
                        <Text style={styles.profileInitials}>
                        {getInitials(details.firstname, details.lastname)}
                        </Text>
                    )}
                </View>
            <Text testID="home-title" style={styles.titleText}>{t('Hello,')}{'\n'}{details.firstname && details.lastname
            ? `${details.firstname} ${details.lastname}`
            : t('User Name')}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={true} alwaysBounceVertical={false} indicatorStyle="black">
            <View style={styles.updateContainer}>
                <View style={styles.updateBox}>
                    <Text style={styles.basicText}>{t('Your Next Appointment:')}</Text>
                    <View style={{flexDirection: 'row', alignItems:'center', marginTop: 16,}}>
                        <View style={styles.dateCircle}>
                            <Text style={styles.dateCircleText}>22</Text>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
                                <Text style={styles.appointmentText}>{t('22nd May at Dental Clinic')}</Text>
                            </TouchableOpacity>
                    </View>
                    <Text style={styles.noteText}>{t('Note from Dentist:')}{'\n'}{t('Bring retainer!')}</Text>
                </View>
            </View>

            <View style={styles.updateContainer}>
                <View style={styles.updateBox}>
                    <Text style={styles.basicText}>{t('Next Oral Checkup Due:')}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
                    <Text style={styles.checkupText}>Feb 2026</Text>
                    <Text style={styles.bookNowText}>Book Now</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.updateBox}>
                    <Text style={styles.basicText}>{t('Latest Appointment Notes:')}</Text>
                    <Text style={styles.noteText}>{t('Please have a look at Savacol and a water flosser.')}</Text>
                </View>
            </View>

            {/* dental chart card */}
            <View style={styles.updateContainer}>
                <View style={styles.updateBox}>
                    <Image source={require('../../../assets/mouthIcons.png')}
                        style={styles.mouthImage}/>
                    <TouchableOpacity onPress={() => navigation.navigate('DentalChart')}>
                        <View style={styles.mouthButton}>
                            <Text style={styles.boldText}>{t('See My Mouth')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* toothmate dentists card */}
            <View style={styles.updateContainer}>
                <View style={styles.updateBox}>
                    <Image source={require('../../../assets/map.png')}
                        style={styles.mouthImage}/>
                    <TouchableOpacity onPress={() => navigation.navigate('LocationFinder')}>
                        <View style={styles.mouthButton}>
                            <Text style={styles.boldText}>Toothmate Dentists</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
        </View>
    );
};

export default HomeScreen;