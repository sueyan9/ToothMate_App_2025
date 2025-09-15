// AppointmentImage.js
import React from 'react';
import { Image } from 'react-native';
import styles from './styles';

// 简单嗅探 base64 头，尽量推断图片类型
const sniffMime = (b64) => {
    if (!b64) return null;
    const s = b64.slice(0, 16); // 取前缀判断即可
    if (s.startsWith('iVBOR')) return 'image/png';
    if (s.startsWith('/9j/'))   return 'image/jpeg';
    if (s.startsWith('R0lGOD')) return 'image/gif';
    if (s.startsWith('UklGR'))  return 'image/webp'; // Android 支持 webp
    return null;
};

// 统一把传入的 base64 / dataURL 规范化为可用的 dataURL
const toDataUri = (input, contentTypeProp) => {
    let raw = typeof input === 'string' ? input.trim() : '';
    if (!raw) return '';

    // 允许调用方给一个优先使用的 contentType
    const preferCT = /^image\//.test(contentTypeProp || '') ? contentTypeProp : undefined;

    // 已经是 dataURL 的情况
    if (raw.startsWith('data:')) {
        // 把 data:image/*;base64, 改为具体类型
        if (/^data:image\/\*;base64,/i.test(raw)) {
            const ct = preferCT || 'image/png';
            raw = raw.replace(/^data:image\/\*;/i, `data:${ct};`);
        }
        // 去掉逗号后的 base64 里可能的空白换行
        const i = raw.indexOf(',');
        if (i > -1) {
            const head = raw.slice(0, i + 1);
            const body = raw.slice(i + 1).replace(/\s+/g, '');
            return head + body;
        }
        return raw;
    }

    // 纯 base64：去空白、嗅探 MIME、拼 dataURL
    const clean = raw.replace(/\s+/g, '');
    const sniffed = sniffMime(clean);
    const ct = preferCT || sniffed || 'image/png';
    return `data:${ct};base64,${clean}`;
};

const AppointmentImage = ({ base64}) => {
    // const uri = toDataUri(base64, contentType);
    // if (!uri) return null;

    return (
        <Image
            style={[styles.imgStyle, style]}
            resizeMode="contain"
            source={{ base64 }}
        />
    );
};

export default AppointmentImage;
