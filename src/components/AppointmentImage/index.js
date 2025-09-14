import React from 'react';
import { Image } from 'react-native';
import styles from './styles';
// 可选：如需运行时校验，安装 prop-types 并取消注释
// import PropTypes from 'prop-types';

const AppointmentImage = ({ base64, contentType = 'image/png', style }) => {
    if (!base64) return null;
    return (
        <Image
            style={[styles.imgStyle, style]}
            resizeMode="contain"
            source={{ uri: `data:${contentType};base64,${base64}` }}
        />
    );
};

// AppointmentImage.propTypes = {
//   base64: PropTypes.string,
//   contentType: PropTypes.string,
//   style: PropTypes.any,
// };

export default AppointmentImage;
