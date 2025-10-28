import { WEB_DENTAL_CHART_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import axiosApi from "../../api/axios";
import styles from './styles';

const DentalChartScreen = () => {
    const webViewRef = useRef(null);
    const navigation = useNavigation();
    const route = useRoute();
    const [webLoading, setWebLoading] = useState(true);
    const showWeb = route.params?.showWeb ?? true; // default: show webview
    const [parent, setParent] = useState(true); // Determines whether the user is a parent (default is true)
    const [res, setRes] = useState(null); // Stores the response from the isChild API
    const [selection, setSelection] = useState(null); // { toothId, toothName, treatment }
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const id = await AsyncStorage.getItem('id');
                setUserId(id);
                if (!id) { setParent(true); return; }

                const endpoint = `/isChild/${id}`;
                console.log('[DC] call =>', (axiosApi.defaults?.baseURL || '') + endpoint);

                const resp = await axiosApi.get(endpoint);
                console.log('[DC] /isChild resp =', resp?.status, resp?.data);

                const name = await AsyncStorage.getItem('activeProfileFirstName');
                setUserName(name);

                const data = resp?.data ?? {};
                setRes(data);
                const hasIsChild = Object.prototype.hasOwnProperty.call(data, 'isChild');

                if (!hasIsChild) {
                    console.warn('[DC] /isChild missing isChild field, fallback to adult');
                    setParent(true); // default adult model
                    return;
                }

                const toBool = (v) => v === true || v === 'true' || v === 1 || v === '1';
                const isChildUser = toBool(data.isChild);
                setParent(!isChildUser);                   // parent=true / false
            } catch (e) {
                console.error('❌ fetch /isChild failed:', e?.message || e);
                setParent(true); // default adult model
            }
        };
        fetchUser();      // fetch it

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

    const isChild = !parent;
    const url = `${base}/?parent=${isChild ? 'false' : 'true'}&mode=${isChild ? 'child' : 'parent'}&hideBack=${isChild ? 'true' : 'false'}${userId ? `&userId=${encodeURIComponent(userId)}` : ''}`;
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
                        if (data?.child) {
                            navigation.navigate('ChildEducation', {
                                screen: 'Library',
                                params: { learn: true }
                            });
                            return;
                        }
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
                        {userName && (
                        <Text style={styles.chartTitle}>{userName}'s Mouth</Text>
                        )}
                    <SafeAreaView />
                    <WebView
                        ref={webViewRef}
                        source={{ uri: url }}
                        style={{ flex: 1 }}
                        originWhitelist={['*']}
                        javaScriptEnabled
                        domStorageEnabled
                        onLoadStart={() => {
                                     setWebLoading(true);
                                   }}
                        onLoadEnd={() => {
                            setWebLoading(false);
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
                        onError={(e) =>{
                            setWebLoading(false);
                    }}
                        onHttpError={(e) =>{
                            setWebLoading(false);
                           }}
                        onMessage={handleWebMessage}
                    />
                    {webLoading && (
                              <View
                                  pointerEvents="none"
                                  style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(234, 241, 247, 0.85)',
                                  }}
                                >
                                  <ActivityIndicator size="large" />
                                  <Text style={{ marginTop: 8 }}>Loading 3D model…</Text>

                              </View>
                             )}
                </View>
            );
};


export default DentalChartScreen;
