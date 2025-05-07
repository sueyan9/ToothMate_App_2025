import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Modal, Pressable, Platform } from 'react-native';
import { CheckBox } from 'react-native-elements';
import SwitchToggle from 'react-native-switch-toggle';
import { LinearGradient } from 'expo-linear-gradient';
import dayjs from 'dayjs';
import ChartEntryList from '../../components/ChartEntryList';
import AdultDentalChart from '../../assets/adult_dental_chart.png';
import ChildDentalChart from '../../assets/child_dental_chart.png';
import styles from './styles';
import LoadingScreen from '../LoadingScreen';
import { useRoute } from '@react-navigation/native';

const DentalChartScreen = props => {
  const route = useRoute();
  const { appointments } = route.params;
  const allChartEntries = React.useMemo(() => new ChartEntryList(), []);
  const [chart, setChart] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [toothName, setToothName] = useState('');
  const [toothCodeArray, setToothCodeArray] = useState([]);
  const [hasWisdomTooth, setHasWisdomTooth] = useState(true);

  const toothTappedAlert = React.useCallback(
      (name, arr) => {
        setToothName(name);
        setToothCodeArray(arr);
        setModalVisible(!modalVisible);
      },
      [modalVisible],
  );

  const getAllDentalData = React.useCallback(() => {
    const convertDate = mongoDate => {
      const jsDate = new Date(mongoDate);
      return dayjs(jsDate).format('DD/MM/YYYY');
    };

    // for each appointment
    appointments.forEach(app => {
      // for each dental treatment in appointment
      if (app.dentalData) {
        app.dentalData.forEach(element => {
          // index number of tooth from dental data
          const index = parseInt(element.substring(3, 5), 10) - 1; // - 1 to align index starting at 0
          // converting code to full dental treatment name
          let code = '';
          switch (element.substring(5)) {
            case 'VNR':
              code = 'Veneer';
              break;
            case 'FIL':
              code = 'Filling';
              break;
            case 'BRK':
              code = 'Broken Tooth';
              break;
            case 'RTC':
              code = 'Root Canal';
              break;
            case 'EXT':
              code = 'Tooth Extraction';
              break;
            case 'CRW':
              code = 'Dental Crown';
              break;
            case 'BND':
              code = 'Dental Bonding';
              break;
            case 'SEA':
              code = 'Dental Sealant';
              break;
            default:
              // if not found, use dental code
              code = element.substring(5);
              break;
          }
          const codeDateString = `${code} ${convertDate(app.date)}`; // create dental treatment with treatment date
          allChartEntries.updateValue(index, codeDateString); // put dental treatment in array
        });
      }
    });
  }, [allChartEntries, appointments]);

  useEffect(() => {
    allChartEntries.initList(); // initialise checkbox's for dental chart
    getAllDentalData(); // grab, convert, and store dental data in checkbox's
    setChart(allChartEntries); // once data is all set, now store and display dental chart
  }, []);

  if (!chart) {
    return <LoadingScreen />;
  }

  return (
      <LinearGradient colors={['#78d0f5', 'white', '#78d0f5']} style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <View>
            <Text style={styles.headingFont}>Tap on any tooth to see your dental history!</Text>
          </View>
          <View style={styles.imageContainer}>
            {hasWisdomTooth ? (
                <Image style={styles.image} source={AdultDentalChart} />
            ) : (
                <Image style={styles.image} source={ChildDentalChart} />
            )}

            <View style={styles.centeredView}>
              <Modal // Pop-Up for when user taps on a tooth
                  animationType="slide"
                  transparent
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible);
                  }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    {/* Tooth Name Displayed */}
                    <Text style={styles.modalHeading}>{toothName}</Text>
                    {(() => {
                      let dentalTreatment = [];
                      // Storing every dental treatment on tooth in an array to display
                      dentalTreatment = toothCodeArray.map(treatment => (
                          <View key={treatment} style={styles.modalBox}>
                            <View style={styles.leftBox}>
                              <Text style={styles.modalText}>{treatment.substring(0, treatment.length - 10)}</Text>
                            </View>
                            <View style={styles.rightBox}>
                              <Text style={styles.modalDateText}>{treatment.substring(treatment.length - 10)}</Text>
                            </View>
                          </View>
                      ));
                      return dentalTreatment;
                    })()}

                    <Pressable onPress={() => setModalVisible(!modalVisible)} style={styles.button}>
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            </View>
            {(() => {
              // setting up checkbox's using information from each ChartInstance in the ChartEntryList
              let checkBox = [];
              checkBox = chart.allEntries.map(tooth => {
                if (!(!hasWisdomTooth && tooth.name.includes('Third Molar'))) {
                  return (
                      <CheckBox
                          key={tooth.id}
                          containerStyle={{
                            position: 'absolute',
                            top: tooth.top,
                            right: tooth.right,
                          }}
                          uncheckedIcon="circle-o"
                          uncheckedColor="#00ff0000"
                          onPress={() => toothTappedAlert(tooth.name, tooth.values)}
                      />
                  );
                }
                return null;
              });
              return checkBox;
            })()}
          </View>
          {/* Wisdom Tooth toggle button to switch between dental charts */}
          <View style={styles.toggle}>
            <Text style={styles.toggleText}>Wisdom Tooth</Text>
            <SwitchToggle
                switchOn={hasWisdomTooth}
                onPress={() => setHasWisdomTooth(!hasWisdomTooth)}
                circleColorOff="#9ad2d9"
                circleColorOn="#78d0f5"
                backgroundColorOn="#F0F0F0"
                backgroundColorOff="#F0F0F0"
            />
          </View>
        </ScrollView>
      </LinearGradient>
  );
};

// Header Options
DentalChartScreen.navigationOptions = () => {
  return {
    title: '',
    headerBackTitleVisible: false,
    headerTintColor: 'black',
    safeAreaInsets: Platform.OS === 'ios' ? { top: 45 } : { top: 30 },
    headerStyle: {
      backgroundColor: '#78d0f5',
      borderBottomWidth: 0,
      shadowOpacity: 0,
      elevation: 0,
    },
  };
};

export default DentalChartScreen;
