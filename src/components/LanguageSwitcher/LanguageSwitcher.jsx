import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import styles from './styles';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'ko', name: '한국어' } // Add Korean
];

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const changeLanguage = async (lng) => {
    try {
      await i18n.changeLanguage(lng);
      setModalVisible(false);
      console.log('Language changed to:', lng);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => setModalVisible(true)} 
        style={styles.iconButton}
        testID="language-button"
      >
        <Ionicons name="globe" size={24} color="#333" />
        <Text style={styles.languageText}>{i18n.language.toUpperCase()}</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>{t('language')}</Text>
              {languages.map(lng => (
                <TouchableOpacity
                  key={lng.code}
                  style={[
                    styles.languageButton,
                    i18n.language === lng.code && styles.selectedLanguage
                  ]}
                  onPress={() => changeLanguage(lng.code)}
                >
                  <Text style={[
                    styles.languageText,
                    i18n.language === lng.code && styles.selectedLanguageText
                  ]}>
                    {lng.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeText}>{t('common:cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default LanguageSwitcher;