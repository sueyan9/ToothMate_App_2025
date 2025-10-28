import React, {useMemo, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, Dimensions, StyleSheet, Image, SafeAreaView} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
// Normalize any input to { uri: dataUrlOrHttp }
const toImageUri = (s) => {
  if (typeof s !== 'string') return null;
  const t = s.trim();
  if (!t) return null;
  if (t.startsWith('data:')) {
    // Replace data:image/*; with a specific png type to avoid issues with some implementations
    return {uri: t.startsWith('data:image/*;') ? t.replace(/^data:image\/\*;/, 'data:image/png;') : t};
  }
  if (/^https?:\/\//i.test(t)) return {uri: t};
  // Bare base64 -> wrap as data URL
  return {uri: `data:image/png;base64,${t}`};
};

export default function ImagesScreen({route}) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Hide bottom TabBar while on this screen; restore when leaving
  useFocusEffect(
      useCallback(() => {
        const parent = navigation.getParent();
        parent?.setOptions({tabBarStyle: {display: 'none'}});
        return () => parent?.setOptions({tabBarStyle: undefined});
      }, [navigation])
  );

  const params = route?.params ?? {};
  const images = useMemo(() => {
    const arr = Array.isArray(params.images) ? params.images : [];
    return arr.map(toImageUri).filter(Boolean);
  }, [route?.params]);

  const initialIndex = Number.isInteger(params.imageIndex) ? params.imageIndex : 0;
  const [index, setIndex] = useState(
      images.length && initialIndex >= 0 && initialIndex < images.length ? initialIndex : 0
  );

  const canPrev = index > 0;
  const canNext = index < images.length - 1;

  return (
      <SafeAreaView style={styles.container}>
        {images.length === 0 ? (
            <Text style={styles.empty}>No images to display</Text>
        ) : (
            <View style={styles.viewer}>
              <Image source={images[index]} style={styles.image} resizeMode="contain"/>

              {/*  Counter & toolbar use absolute positioning and respect bottom safe area  */}
              <Text style={[styles.counter, {bottom: insets.bottom + 84}]}>
                {index + 1} / {images.length}
              </Text>

              <View style={[styles.toolbar, {bottom: insets.bottom + 24}]}>
                <TouchableOpacity
                    onPress={() => canPrev && setIndex(i => i - 1)}
                    disabled={!canPrev}
                    style={[styles.btn, !canPrev && styles.btnDisabled]}
                >
                  <Text style={styles.btnText}>Pre</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => canNext && setIndex(i => i + 1)}
                    disabled={!canNext}
                    style={[styles.btn, !canNext && styles.btnDisabled]}
                >
                  <Text style={styles.btnText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
        )}
      </SafeAreaView>
  );
}

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  viewer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  image: {width, height: height * 0.7},
  counter: {position: 'absolute', alignSelf: 'center', color: '#fff'},
  toolbar: {position: 'absolute', alignSelf: 'center', flexDirection: 'row', gap: 12},
  btn: {paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff', borderRadius: 8},
  btnDisabled: {opacity: 0.4},
  btnText: {color: '#000', fontWeight: '600'},
  empty: {color: '#fff', textAlign: 'center'},
});