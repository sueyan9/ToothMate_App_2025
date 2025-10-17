import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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

    const tips = [
        "Brush twice daily for 2 minutes each time.",
        "Floss every day to remove plaque between teeth.",
        "Drink water instead of sugary drinks.",
        "Milk strengthens teeth and builds enamel.",
        "Sugar-free gum helps fight cavities.",
        "Visit your dentist every 6 months.",
        "Limit acidic foods and beverages.",
        "Replace your toothbrush every 3 months.",
        "Don't brush immediately after acidic drinks.",
        "Eat calcium-rich foods for strong teeth.",
        "Avoid smoking and tobacco products.",
        "Use fluoride toothpaste daily.",
        "Coconut oil has natural antibacterial properties.",
        "Rinse your mouth after meals.",
        "A healthy mouth is a healthy body!"
    ]

    const getRandomTip = () => {
        const randomTip = Math.floor(Math.random() * 14) + 1;

        return tips[randomTip];
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
        checkCanDisconnect
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
                                    <Text style={styles.appointmentTextName}>For {getAppointmentName()}</Text>
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
                <View style={[styles.updateBox, {flex: 1}]}>
                    <Text style={styles.basicText}>{t('Daily Oral Health Tip:')}</Text>
                    <Text style={styles.noteText}>{getRandomTip()}</Text>
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