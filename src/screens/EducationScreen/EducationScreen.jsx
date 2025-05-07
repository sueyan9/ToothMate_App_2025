import React, { useContext, useEffect } from 'react';
import { TouchableOpacity, View, Text, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { VarelaRound_400Regular } from '@expo-google-fonts/varela-round';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // 导入必要的 hooks
import { Context as EducationContext } from '../../context/EducationContext/EducationContext';
import styles from './styles';
import LoadingScreen from '../LoadingScreen';

const EducationScreen = () => {
    // 使用 hook 获取导航对象
    const navigation = useNavigation();

    const { state, getEducationRange } = useContext(EducationContext);

    const [fontsLoaded] = useFonts({
        Righteous_400Regular,
        VarelaRound_400Regular,
    });

    // 使用 useFocusEffect 替代 didFocus 事件监听器
    useFocusEffect(
        React.useCallback(() => {
            getEducationRange();
            // 返回清理函数（如有需要）
            return () => {};
        }, [getEducationRange])
    );

    // 初始加载数据
    useEffect(() => {
        getEducationRange();
    }, []);

    const renderEducationItem = React.useCallback(
        ({ item }) => {
            return (
                <TouchableOpacity onPress={() => navigation.navigate('content', { id: item._id })}>
                    <View style={styles.topicStyle}>
                        <Text style={styles.topicText}>{item.topic}</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={30} />
                    </View>
                </TouchableOpacity>
            );
        },
        [navigation],
    );

    if (!fontsLoaded) {
        return <LoadingScreen />;
    }

    return (
        <LinearGradient colors={['#78d0f5', 'white', '#78d0f5']} style={styles.screenStyle}>
            <View style={{ flex: 1, borderWidth: 1 }}>
                <Text style={styles.titleTextStyle}> ToothMate </Text>
                <Text style={styles.subTitleTextStyle}>Education Library</Text>
                {/* Handling empty data state */}
                {state && state.length > 0 ? (
                    <FlatList data={state} keyExtractor={(education) => education._id} renderItem={renderEducationItem} />
                ) : (
                    <Text style={styles.emptyText}>No education content available</Text>
                )}
            </View>
        </LinearGradient>
    );
};

// 删除 navigationOptions，在 App.js 中设置
// EducationScreen.navigationOptions = () => {
//   return {
//     headerShown: false,
//   };
// };

export default EducationScreen;
