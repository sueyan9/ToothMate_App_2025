import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
import styles from './styles';

const HomeScreen = () => {

    const username = "Sarah Smith";

    const navigation = useNavigation();

    const {
        signout,
    } = useContext(AuthContext);


    return (
        <View style={styles.container}>
            {/*needs a confirmation thing for the signout*/}
            <MaterialCommunityIcons name="logout" size={32} color={'#333333'} style={styles.logout} onPress={signout}/>

            <View style={styles.helloContainer}>
            <Image source={{uri: 'https://coolbackgrounds.imgix.net/39sOStld2OCyNn3HmCpqco/21d339122a7cb417c83e6ebdc347ea5c/sea-edge-79ab30e2.png?w=3840&q=60&auto=format,compress'}}
            style={styles.profile}/>
            <Text testID="home-title" style={styles.titleText}>Hello, {'\n'}{username}</Text>
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