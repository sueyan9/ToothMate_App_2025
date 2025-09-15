import React from 'react';
import { Image } from 'react-native';
import styles from './styles';

/**
 * Lightweight MIME sniffing from the first few base64 chars.
 * Helps choose a stable content-type when the caller passes raw base64.
 */
const sniffMime = (b64) => {
    if (!b64) return null;
    const s = b64.slice(0, 16); // 取前缀判断即可
    if (s.startsWith('iVBOR')) return 'image/png';
    if (s.startsWith('/9j/'))   return 'image/jpeg';
    if (s.startsWith('R0lGOD')) return 'image/gif';
    if (s.startsWith('UklGR'))  return 'image/webp'; // Android 支持 webp
    return null;
};

/**
 * Normalize any input into a valid data URI.
 * Accepts:
 *  - raw base64 (no header)
 *  - data URLs (e.g., data:image/*;base64,...)
 *  - optionally a preferred contentType from props
 */
const toDataUri = (input, contentTypeProp) => {
    let raw = typeof input === 'string' ? input.trim() : '';
    if (!raw) return '';

    // Use caller-provided contentType if it looks like an image/*
    const preferCT = /^image\//.test(contentTypeProp || '') ? contentTypeProp : undefined;

    // If it's already a data URL
    if (raw.startsWith('data:')) {
        // Replace data:image/*;base64, with a concrete type to avoid "*"
        if (/^data:image\/\*;base64,/i.test(raw)) {
            const ct = preferCT || 'image/png';
            raw = raw.replace(/^data:image\/\*;/i, `data:${ct};`);
        }
        // Remove whitespace within the base64 payload
        const i = raw.indexOf(',');
        if (i > -1) {
            const head = raw.slice(0, i + 1);
            const body = raw.slice(i + 1).replace(/\s+/g, '');
            return head + body;
        }
        return raw;
    }

    // Raw base64 string: strip whitespace, sniff MIME, and build a data URL
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
