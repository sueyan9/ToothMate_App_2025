// LanguageSelector.test.jsx

// Mock the translation hook FIRST before any imports
jest.mock('../../context/TranslationContext/useTranslation', () => ({
  useTranslation: jest.fn(),
}));

// Mock React Native components 
jest.mock('react-native', () => ({
  StyleSheet: { 
    create: (styles) => styles,
    flatten: (style) => style || {},
  },
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  Modal: ({ children, visible }) => (visible ? children : null),
  Image: 'Image',
}));

// Mock the maori flag image required by the component
jest.mock('../../../assets/maori_flag.png', () => 1, { virtual: true });

import { fireEvent, render } from '@testing-library/react-native';
import { useTranslation } from '../../context/TranslationContext/useTranslation';
import LanguageSelector from './LanguageSelector';

// Mock styles (unchanged)
jest.mock('./styles', () => ({
  languageButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  languageButtonText: { fontSize: 16, textAlign: 'center' },
  modalContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', maxWidth: 300 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  languageOption: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', alignItems: 'center' },
  languageOptionText: { fontSize: 16 },
  selectedLanguage: { backgroundColor: '#e3f2fd' },
  closeButton: { marginTop: 15, padding: 10, backgroundColor: '#007AFF', borderRadius: 5 },
  closeButtonText: { color: 'white', textAlign: 'center', fontSize: 16 },
  languageFlag: { marginRight: 12, fontSize: 18 },
  languageText: { fontSize: 16 },
  selectedLanguageText: { fontWeight: 'bold' },
}));

describe('LanguageSelector Snapshot & Behavior Tests', () => {
  let mockTranslationHook;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTranslationHook = {
      t: (k) => k,
      changeLanguage: jest.fn(),
      getAvailableLanguages: jest.fn().mockReturnValue(['English', 'Spanish', 'Chinese', 'Dutch']),
      getCurrentLanguageDisplay: jest.fn().mockReturnValue('English'),
      LANGUAGE_CODES: {
        English: 'en',
        Spanish: 'es',
        Chinese: 'zh',
        Dutch: 'nl',
      },
    };

    useTranslation.mockReturnValue(mockTranslationHook);
  });

  describe('Closed Modal States', () => {
    it('should match snapshot with English selected', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('en-uk');
      const tree = render(<LanguageSelector />);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with Spanish selected', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('Spanish');
      const tree = render(<LanguageSelector />);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with Chinese selected', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('Chinese');
      const tree = render(<LanguageSelector />);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with Dutch selected', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('Dutch');
      const tree = render(<LanguageSelector />);
      expect(tree.toJSON()).toMatchSnapshot();
    });
  });
  
  describe('Open Modal States', () => {
    it('should match snapshot with modal open - English current', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('English');
      const screen = render(<LanguageSelector />);

      // English shows 🇬🇧 in your component
      fireEvent.press(screen.getByText('🌐 🇬🇧'));

      expect(screen.toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with limited language options', () => {
      mockTranslationHook.getAvailableLanguages.mockReturnValue(['English', 'Spanish']);
      const tree = render(<LanguageSelector />);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with single language option', () => {
      mockTranslationHook.getAvailableLanguages.mockReturnValue(['English']);
      const tree = render(<LanguageSelector />);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with empty language options', () => {
      mockTranslationHook.getAvailableLanguages.mockReturnValue([]);
      const tree = render(<LanguageSelector />);
      expect(tree.toJSON()).toMatchSnapshot();
    });
  });

  describe('Edge Cases', () => {
    it('should match snapshot when getCurrentLanguageDisplay returns null', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue(null);
      mockTranslationHook.getAvailableLanguages.mockReturnValue(['English', 'Spanish']);
      const tree = render(<LanguageSelector />);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should match snapshot when getCurrentLanguageDisplay returns undefined', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue(undefined);
      mockTranslationHook.getAvailableLanguages.mockReturnValue(['English', 'Spanish']);
      const tree = render(<LanguageSelector />);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should match snapshot when getAvailableLanguages returns null', () => {
      mockTranslationHook.getAvailableLanguages.mockReturnValue(null);
      const tree = render(<LanguageSelector />);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with very long language names', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('Very Long Language Name That Might Wrap');
      mockTranslationHook.getAvailableLanguages.mockReturnValue([
        'English',
        'Very Long Language Name That Might Wrap',
        'Another Extremely Long Language Name',
      ]);
      const tree = render(<LanguageSelector />);
      expect(tree.toJSON()).toMatchSnapshot();
    });
  });

  describe('Behavior w/ language codes', () => {
    it('selecting Spanish calls changeLanguage with its CODE (es)', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('English');
      mockTranslationHook.getAvailableLanguages.mockReturnValue(['English', 'Spanish', 'Chinese']);

      const { getByText } = render(<LanguageSelector />);

      // open modal
      fireEvent.press(getByText('🌐 🇬🇧'));
      // choose Spanish by display name
      fireEvent.press(getByText('Spanish'));

      expect(mockTranslationHook.changeLanguage).toHaveBeenCalledWith('es');
    });

    it('selecting Chinese calls changeLanguage with its CODE (zh)', () => {
      const { getByText, rerender, toJSON } = render(<LanguageSelector />);
      fireEvent.press(getByText('🌐 🇬🇧'));
      fireEvent.press(getByText('Chinese'));
      expect(mockTranslationHook.changeLanguage).toHaveBeenCalledWith('zh');

      // optional: snapshot after change
      rerender(<LanguageSelector />);
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Props Variations', () => {
    it('should match snapshot with custom LANGUAGE_CODES', () => {
      const customTranslationHook = {
        ...mockTranslationHook,
        LANGUAGE_CODES: {
          English: 'en-US',
          Spanish: 'es-ES',
          French: 'fr-FR',
          German: 'de-DE',
        },
        getAvailableLanguages: jest.fn().mockReturnValue(['English', 'Spanish', 'French', 'German']),
        getCurrentLanguageDisplay: jest.fn().mockReturnValue('French'),
      };
      useTranslation.mockReturnValue(customTranslationHook);

      const tree = render(<LanguageSelector />);
      expect(tree.toJSON()).toMatchSnapshot();
    });
  });
});
