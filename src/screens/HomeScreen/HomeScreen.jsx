import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
import { Context as UserContext } from '../../context/UserContext/UserContext';
import styles from './styles';

const HomeScreen = () => {

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

    const handleSignOut = () => {
    Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
        {
            text: 'Cancel',
            style: 'cancel',
        },
        {
            text: 'Sign Out',
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
                <Text style={styles.loadingText}>Loading profile...</Text>
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
            <MaterialCommunityIcons name="logout" size={32} color={'#333333'} style={styles.logout} onPress={handleSignOut}/>

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
            <Text testID="home-title" style={styles.titleText}>Hello, {'\n'}{details.firstname && details.lastname
            ? `${details.firstname} ${details.lastname}`
            : 'User Name'}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={true} alwaysBounceVertical={false} indicatorStyle="black">
            <View style={styles.updateContainer}>
                <View style={styles.updateBox}>
                    <Text style={styles.basicText}>Your Next Appointment:</Text>
                    <View style={{flexDirection: 'row', alignItems:'center', marginTop: 16,}}>
                        <View style={styles.dateCircle}>
                            <Text style={styles.dateCircleText}>22</Text>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
                                <Text style={styles.appointmentText}>22nd May at Dental Clinic</Text>
                            </TouchableOpacity>
                    </View>
                    <Text style={styles.noteText}>Note from Dentist:{'\n'}Bring retainer!</Text>
                </View>
            </View>

            <View style={styles.updateContainer}>
                <View style={styles.updateBox}>
                    <Text style={styles.basicText}>Next Oral Checkup Due:</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
                    <Text style={styles.checkupText}>Feb 2026</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.updateBox}>
                    <Text style={styles.basicText}>Latest Appointment Notes:</Text>
                    <Text style={styles.noteText}>Please have a look at Savacol and a water flosser.</Text>
                </View>
            </View>

            <View style={styles.updateContainer}>
                <View style={styles.updateBox}>
                    <Image source={require('../../../assets/mouthIcons.png')}
                        style={styles.mouthImage}/>
                    <TouchableOpacity onPress={() => navigation.navigate('DentalChart')}>
                        <View style={styles.mouthButton}>
                            <Text style={styles.basicText}>See My Mouth</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
        </View>
    );
};

export default HomeScreen;