import React, { useContext, useState, useEffect } from 'react';
import { Text, View, FlatList, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';
import { useNavigation, useFocusEffect } from '@react-navigation/native';  // 添加 useFocusEffect
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
import styles from './styles';
import ToothLogo from '../../assets/t_logo_crop2.png';
import LoadingScreen from '../LoadingScreen';

const AccountScreen = () => {
  const navigation = useNavigation();

  const {
    state: { children, errorMessage },
    signout,
    getChildAccounts,
  } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Righteous_400Regular,
  });

  // 使用 useFocusEffect 代替 useEffect + focus/blur 事件监听器
  useFocusEffect(
      React.useCallback(() => {
        const fetchData = async () => {
          setLoading(true);
          await getChildAccounts();
          setLoading(false);
        };

        fetchData();

        // 返回清理函数
        return () => {
          // 如果需要在组件失去焦点时执行某些操作，可以在这里添加
        };
      }, [])
  );

  const renderChildButton = child => (
      <Button
          title={child.item.firstname}
          buttonStyle={styles.childButtonStyle}
          titleStyle={styles.childTextStyle}
          onPress={async () => {
            await AsyncStorage.setItem('parentId', await AsyncStorage.getItem('id'));
            await AsyncStorage.setItem('id', child.item._id);
            navigation.navigate('childFlow'); // 确保 'childFlow' 在导航器中存在
          }}
      />
  );

  // Child Account Buttons that appear on Screen
  const childButtons = !errorMessage ? (
      <FlatList data={children} keyExtractor={child => child._id} renderItem={renderChildButton} />
  ) : null;

  if (loading || !fontsLoaded) {
    return <LoadingScreen showTooth />;
  }

  return (
      <LinearGradient colors={['#7ad0f5', 'white', '#7ad0f5']} style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>ToothMate</Text>
          <ImageBackground source={ToothLogo} style={styles.imageBackgroundStyle}>
            <View style={styles.topButtonViewStyle}>
              <Button
                  buttonStyle={styles.button}
                  title="Settings"
                  onPress={() => navigation.navigate('UserAccount')} // 确保 'UserAccount' 在导航器中存在
                  titleStyle={styles.titleContainer}
              />
              <Button
                  buttonStyle={styles.button}
                  title="Sign Up A Child/Elderly Account"
                  onPress={() => navigation.navigate('signUpChildFlow')} // 确保 'signUpChildFlow' 在导航器中存在
                  titleStyle={styles.titleContainer}
              />
            </View>
          </ImageBackground>
          <View style={{ flex: 3, borderBottomWidth: 3, marginTop: '0%' }}>
            {children && children.length > 0 ? <Text style={styles.yourAccountStyle}>Your Accounts</Text> : null}
            <View style={{ marginBottom: 10 }}>{childButtons}</View>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button
                buttonStyle={styles.signOutButton}
                containerStyle={styles.signOutContainer}
                title="Sign Out"
                onPress={signout}
                titleStyle={styles.signOutTextStyle}
            />
          </View>
        </View>
      </LinearGradient>
  );
};

export default AccountScreen;
