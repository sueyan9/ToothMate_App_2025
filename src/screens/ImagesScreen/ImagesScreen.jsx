// ImagesScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import AppointmentImage from '../../components/AppointmentImage'; // 按你的路径修改

// 页面层兜底，把 data:image/*;... 改成 data:image/png;...
const normalizeDataUrl = (s) => {
    if (typeof s !== 'string') return '';
    const t = s.trim();
    return t.startsWith('data:image/*;') ? t.replace(/^data:image\/\*;/, 'data:image/png;') : t;
};

export default function ImagesScreen({ route }) {
    const params = route?.params ?? {};

    // 兼容两种传参写法
    const images = useMemo(() => {
        const arr = Array.isArray(params.images)
            ? params.images
            : Array.isArray(params.imageIndex)
                ? params.imageIndex
                : [];
        return arr.map(normalizeDataUrl).filter(Boolean);
    }, [route?.params]);

    const initialIndex =
        typeof params.imageIndex === 'number' ? params.imageIndex : 0;

    const [index, setIndex] = useState(
        images.length && initialIndex >= 0 && initialIndex < images.length
            ? initialIndex
            : 0
    );

    const canPrev = index > 0;
    const canNext = index < images.length - 1;

    return (
        <View style={styles.container}>
            {images.length === 0 ? (
                <Text style={styles.empty}>没有可显示的图片</Text>
            ) : (
                <View style={styles.viewer}>
                    {/* AppointmentImage 里已处理 dataURL/纯 base64 两种情况 */}
                    <AppointmentImage base64={images[index]} style={styles.image} />
                    <Text style={styles.counter}>{index + 1} / {images.length}</Text>
                    <View style={styles.toolbar}>
                        <TouchableOpacity
                            onPress={() => canPrev && setIndex(i => i - 1)}
                            disabled={!canPrev}
                            style={[styles.btn, !canPrev && styles.btnDisabled]}
                        >
                            <Text style={styles.btnText}>上一张</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => canNext && setIndex(i => i + 1)}
                            disabled={!canNext}
                            style={[styles.btn, !canNext && styles.btnDisabled]}
                        >
                            <Text style={styles.btnText}>下一张</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
    viewer: { width: '100%', alignItems: 'center', justifyContent: 'center' },
    image: { width, height: height * 0.6 },
    counter: { color: '#fff', marginTop: 8 },
    toolbar: { flexDirection: 'row', gap: 12, marginTop: 12 },
    btn: { paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#fff', borderRadius: 6 },
    btnDisabled: { opacity: 0.5 },
    btnText: { color: '#000' },
    empty: { color: '#fff' },
});
