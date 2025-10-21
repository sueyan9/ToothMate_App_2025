import { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../context/TranslationContext/useTranslation';
import styles from './styles';

const LanguageSelector = () => {
  const { 
    changeLanguage, 
    getAvailableLanguages, 
    getCurrentLanguageDisplay,
    LANGUAGE_CODES 
  } = useTranslation();
  
  const [modalVisible, setModalVisible] = useState(false);

  const handleLanguageChange = async (languageName) => {
    const languageCode = LANGUAGE_CODES[languageName];
    await changeLanguage(languageCode);
    setModalVisible(false);
  };

  const getLanguageFlag = (language) => {
    const flags = {
      'English': '🇺🇸',
      'Spanish': '🇪🇸',
      'Chinese': '🇨🇳',
      'Dutch': '🇳🇱'
    };
    return flags[language] || '🌐';
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.languageButton} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.languageButtonText}>
          🌐 {getLanguageFlag(getCurrentLanguageDisplay())}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            
            {(getAvailableLanguages() || []).map((language) => (
              <TouchableOpacity
                key={language}
                style={[
                  styles.languageOption,
                  getCurrentLanguageDisplay() === language && styles.selectedLanguage
                ]}
                onPress={() => handleLanguageChange(language)}
              >
                <Text style={styles.languageFlag}>
                  {getLanguageFlag(language)}
                </Text>
                <Text style={[
                  styles.languageText,
                  getCurrentLanguageDisplay() === language && styles.selectedLanguageText
                ]}>
                  {language}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default LanguageSelector;
