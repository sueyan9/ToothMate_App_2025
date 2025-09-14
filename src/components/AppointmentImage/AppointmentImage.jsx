import React from 'react';
import {Image} from 'react-native';
import styles from './styles';

const AppointmentImage = ({base64, contentType = 'image/png', style}) => {
    if (!base64) return null;

    let uri = typeof base64 === 'string' ? base64.trim() : '';
    if (!uri) return null;

    if (!uri.startsWith('data:')) {
        const ct = contentType && /^image\//.test(contentType) ? contentType : 'image/jpeg';
        uri = `data:${ct};base64,${uri}`;
    }
    return (
        <Image
            style={[styles.imgStyle, style]}
            resizeMode="contain"
            source={{uri: `data:${contentType};base64,${base64}`}}
        />
    );
};

export default AppointmentImage;
