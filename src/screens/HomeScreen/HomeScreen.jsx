import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LanguageSelector from '../../components/LanguageSelector';
import { Context as ApptContext } from '../../context/AppointmentContext/AppointmentContext';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
import { Context as NotificationContext } from '../../context/NotificationContext/NotificationContext';
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
        'Oral Health Quote Of The Day:',
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

    const quotes = [
        "Smile while you still have teeth!",
        "Bacteria don't take a vacation, and neither should oral hygeine!",
        "Oral health: where you won't get a plaque for good performance!",
        "Dentists make the world a better place, one smile at a time!",
        "Did you know that drinking milk helps to strengthen your teeth and build stronger enamel!",
        "Americans buy more than 14 million gallons of toothpaste every year.",
        "Coconuts are a natural anti-bacterial food and can help reduce the risk of developing gum disease and cavities.",
        "Approximately 75% of school children worldwide have active dental cavities.",
        "Kids miss 51 million school hours a year due to dental-related illnesses.",
        "Tooth enamel is the hardest substance in the human body.",
        "Chewing sugar-free gum can actually be good for your oral health. It helps to clean your mouth and fight off cavities.",
        "There are more bacteria in the human mouth than there are people on the Earth.",
        "The color of your toothpaste apparently matters. More people prefer blue toothpaste over red toothpaste.",
        "People prefer blue toothbrushes to red ones. The exact reason is unknown, but it could be because blue is often associated with cleanliness.",
        "A happy mouth is a happy body!",
    ]

    const getRandomQuote = () => {
        const randomQuote = Math.floor(Math.random() * 14) + 1;

        return quotes[randomQuote];
    }

    const navigation = useNavigation();

    const {
        signout,
    } = useContext(AuthContext);
    
    const { initializeNotifications } = useContext(NotificationContext);

    // Translate texts when language changes
    useEffect(() => {
        if (currentLanguage !== 'en') {
            translateAndCache(textsToTranslate);
        }
    }, [currentLanguage]);
    
    // Initialize notifications when component mounts
    useEffect(() => {
        initializeNotifications();
    }, []);

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
        state: { details, selectedProfilePicture, childDetails }, 
        getUser, 
        getDentalClinic, 
        checkCanDisconnect,
        getProfilePicture
        } = useContext(UserContext);

        const {
            state: { nextAppointment },
            getNextAppointment,
        } = useContext(ApptContext);

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

                if(details?.nhi) {
                    await getNextAppointment(details, childDetails);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
            };
    
            fetchUserData();
        }, [details?.nhi, childDetails?.length])
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

        const getAppointmentName = () => {
            if (!nextAppointment) return null;
    
            if (nextAppointment.nhi === details?.nhi) {
                return `${details?.firstname} ${details?.lastname}`;
            } else if (childDetails && childDetails.length > 0) {
                const child = childDetails.find(c => c.nhi === nextAppointment.nhi);
                if (child) {
                    return `${child.firstname} ${child.lastname}`;
                }
            }
            
            return null;
        };


    return (
        <View style={styles.container}>
            
            <View style={styles.headerRow}>
                <MaterialCommunityIcons name="logout" size={32} color={'#333333'} style={styles.logout} onPress={handleSignOut}/>
                <LanguageSelector />
            </View>

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
                    {nextAppointment !== null && (
                        <>
                    <View style={{flexDirection: 'row', alignItems:'center', marginTop: 16, marginBottom: 8}}>
                        <View style={styles.dateCircle}>
                            <Text style={styles.dateCircleText}>{new Date(nextAppointment.startAt).getDate()}</Text>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
                                <Text style={styles.appointmentText}>{new Date(nextAppointment.startAt).toLocaleDateString('en-NZ', {
                                    day: 'numeric', month: 'long'})} at {nextAppointment.clinic?.name || 'Dental Clinic'}</Text>
                                    <Text style={styles.appointmentText}>For {getAppointmentName()}</Text>
                            </TouchableOpacity>
                    </View>
                    {nextAppointment.notes && (
                    <Text style={styles.noteText}>{t('Note from Dentist:')}{'\n'}{nextAppointment.notes}</Text>
                    )}
                    </>
                    )}
                    {nextAppointment === null && (
                    <View style={{flexDirection: 'row', alignItems:'center', marginTop: 0,}}>
                        <TouchableOpacity>
                            <Text style={styles.noteText}>No upcoming bookings.</Text>
                        </TouchableOpacity>
                    </View>
                    )}
                                
                </View>
            </View>

            <View style={styles.updateContainer}>
                <View style={styles.updateBox}>
                    <Text style={styles.basicText}>{t('Next Oral Checkup Due:')}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Bookings', {
                        screen: 'clinic',
                        params: {
                            openModal: true,
                            date: new Date('2026-02-01')
                        }
                    })}>
                    <Text style={styles.noteText}>Feb 2026</Text>
                    <Text style={styles.bookNowText}>Book Now</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.updateBox, {flex: 1.6}]}>
                    <Text style={styles.basicText}>{t('Oral Health Quote Of The Day:')}</Text>
                    <Text style={styles.noteText}>{getRandomQuote()}</Text>
                </View>
            </View>

            <View style={styles.updateContainer}>
                <View style={styles.updateBox}>
                    <Image source={require('../../../assets/mouthIcons.png')}
                        style={styles.mouthImage}/>
                    <TouchableOpacity onPress={() => navigation.navigate('DentalChart')}>
                        <View style={styles.mouthButton}>
                            <Text style={styles.boldText}>{t('Look At My Mouth')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* toothmate dentists card
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
            </View> */}
            </ScrollView>
        </View>
    );
};

export default HomeScreen;