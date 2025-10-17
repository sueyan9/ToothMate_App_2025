import { WEB_DENTAL_CHART_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Text, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import axiosApi from "../../api/axios";
import { SafeAreaView } from 'react-native-safe-area-context';

const DentalChartScreen = () => {
  const webViewRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();

  const showWeb = route.params?.showWeb ?? true; // default: show webview
  const [parent, setParent] = useState(true); // Determines whether the user is a parent (default is true)
  const [res, setRes] = useState(null); // Stores the response from the isChild API
  const [selection, setSelection] = useState(null); // { toothId, toothName, treatment }
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('id');
        setUserId(userId);//key : save to state,webview can use it.

        const res = await axiosApi.get(`/isChild/${userId}`);
        
        setRes(res.data);
          // if (res.data.isChild != null){
          //    setParent(false)
          // }
          // parent=true => adult; parent=false => child
                setParent(!(res?.data?.isChild === true));

    }
      catch (error) {
        console.error('❌  Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

 // the native button can show without WebView
   useEffect(() => {
     const p = route.params?.selectedTooth;
       if (p?.treatment) {
           setSelection({
               toothId: p.toothId ?? null,
               toothName: p.toothName ?? null,
               treatment: p.treatment ?? null,
           });
       }
   }, [route.params?.selectedTooth]);

    const base = String(WEB_DENTAL_CHART_URL || '').replace(/\/+$/, '');
    if (!base) console.warn('[DC] WEB_DENTAL_CHART_URL is empty! Did @env load?');
    const url = `${base}/?parent=${parent ? 'true' : 'false'}${!parent ? '&hideBack=true' : ''}${userId ? `&userId=${encodeURIComponent(userId)}` : ''}`;
    useEffect(() => {
        if (!userId || !res) return;
        console.log('WebView URL =>', url);
        // Alert.alert('WebView URL', url);
    }, [userId, res, url]);

    // pick most recent treatment from an array of { date, type, notes }
               const getMostRecentTreatmentType = (arr = []) => {
                   if (!Array.isArray(arr) || arr.length === 0) return null;
                   if (typeof arr[0] === 'string') return arr[0]; // handle ['Filling', ...]
                   return [...arr].sort((a,b)=>new Date(b?.date||0)-new Date(a?.date||0))[0]?.type ?? null;
               };

               const handleWebMessage = useCallback((event) => {
                   try {
                       const data = JSON.parse(event?.nativeEvent?.data ?? '{}');

                       // From ToothInformation.handleViewEducation (web button):
                       if (data?.type === 'VIEW_EDUCATION') {
                           const treatmentType = getMostRecentTreatmentType(data?.treatments);
                           navigation.navigate('Education', {
                               screen: 'content',
                               params: {
                                   treatment: treatmentType,
                                   toothName: data?.toothName,
                                   selectedFilter: 'All'
                               }
                           });
                           return;
                       }

                       // From ToothInformation.handleViewAppointments (web button):
                       if (data?.type === 'VIEW_APPOINTMENTS') {
                           navigation.navigate('Bookings', { screen: 'clinic' });
                           return;
                       }

                       if (data?.type === 'TOOTH_SELECTED' && data?.payload) {
                           const { toothNumber, toothName, treatments, treatment } = data.payload;
                           const latest = treatment ?? getMostRecentTreatmentType(treatments);
                           setSelection({
                               toothId: toothNumber ?? null,
                               toothName: toothName ?? null,
                               treatment: latest ?? null,
                           });
                           return;
                       }
                   } catch {

                   }
               }, [navigation]);

               const openEducation = useCallback(() => {
                   if (!selection?.treatment) return;
                   navigation.navigate('Education', {
                       treatment: selection.treatment,
                       toothId: selection.toothId,
                       toothName: selection.toothName,
                   });
               }, [navigation, selection]);

               // Show loading indicator while waiting for user data

               if (!res || !userId) {
                   return (
                       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                           <ActivityIndicator size="large" />
                       </View>
                   );
               }

               return (
                   <View style={{ flex: 1 }}>
                       <SafeAreaView />
                       <WebView
                           ref={webViewRef}
                           source={{ uri: url }}
                           style={{ flex: 1 }}
                           originWhitelist={['*']}
                           javaScriptEnabled
                           domStorageEnabled
                           onLoadStart={(e) => console.log('[DC] WebView onLoadStart url =', e?.nativeEvent?.url)}
                           onLoadEnd={() => {
                               console.log('[DC] WebView onLoadEnd');
                               if (webViewRef.current && userId) {
                                   const payload = JSON.stringify({ type: 'setUserId', userId });
                                   webViewRef.current.injectJavaScript(`
                                  try {
                                    window.dispatchEvent(new MessageEvent('message', { data: ${JSON.stringify(payload)} }));
                                  } catch (e) {}
                                  true;
                                `);
                               }
                           }}
                           onError={(e) =>
                               console.error('[DC] WebView onError:', e.nativeEvent)}
                           onHttpError={(e) =>
                               console.error('[DC] WebView onHttpError:', e.nativeEvent)}
                           onMessage={handleWebMessage}
                       />

                   </View>
               );
};


export default DentalChartScreen;
