import { useEffect, useState } from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../context/TranslationContext/useTranslation';
import styles from './styles';

const LanguageSelector = () => {
  const { 
    changeLanguage, 
    getAvailableLanguages, 
    getCurrentLanguageDisplay,
    LANGUAGE_CODES,
    t 
  } = useTranslation();
  
  const [modalVisible, setModalVisible] = useState(false);

  // Debug: Log when component mounts
  useEffect(() => {
    console.log('LanguageSelector mounted');
    console.log('Current language:', getCurrentLanguageDisplay());
    console.log('Available languages:', getAvailableLanguages());
  }, []);

  const handleLanguageChange = async (languageName) => {
    const languageCode = LANGUAGE_CODES[languageName];
    console.log('Changing language to:', languageName, languageCode);
    await changeLanguage(languageCode);
    setModalVisible(false);
  };

  const getLanguageFlag = (language) => {
    const flags = {
      'English': '🇬🇧',
      'Spanish': '🇪🇸',
      'Chinese': '🇨🇳',
      'Dutch': '🇳🇱',
    };
    return flags[language] || '🌐';
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.languageButton} 
        onPress={() => {
          console.log('Language selector button pressed');
          setModalVisible(true);
        }}
      >
        {getCurrentLanguageDisplay() !== 'Maori' && (
          <Text style={styles.languageButtonText}>
            🌐 {getLanguageFlag(getCurrentLanguageDisplay())}
          </Text>
        )}
        {getCurrentLanguageDisplay() === 'Maori' && (
          <View style={{flexDirection: 'row', gap: 6}}>
          <Text style={styles.languageButtonText}>
            🌐
          </Text>
          <Image
            source={require('../../../assets/maori_flag.png')}
            style={{width: 20, height: 20, resizeMode: 'contain', marginRight: 2}}/>
            </View>
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('Select Language')}</Text>
            
            {(getAvailableLanguages() || []).map((language) => (
              <TouchableOpacity
                key={language}
                style={[
                  styles.languageOption,
                  getCurrentLanguageDisplay() === language && styles.selectedLanguage
                ]}
                onPress={() => handleLanguageChange(language)}
              >

                {language !== 'Maori' && (
                  <Text style={styles.languageFlag}>
                    {getLanguageFlag(language)}
                  </Text>
                )}
                {language === 'Maori' && (
                  <Image
                    source={require('../../../assets/maori_flag.png')}
                    style={{width: 24, height: 24, resizeMode: 'contain', marginRight: 15, marginLeft: 3}}/>
                )}
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
              <Text style={styles.closeButtonText}>{t('Close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default LanguageSelector;
