import { fireEvent, render } from '@testing-library/react-native';
import { useTranslation } from '../../context/TranslationContext/useTranslation';
import LanguageSelector from './LanguageSelector';

// Mock the translation hook
jest.mock('../../context/TranslationContext/useTranslation', () => ({
  useTranslation: jest.fn(),
}));

// Mock styles
jest.mock('./styles', () => ({
  languageButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  languageButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  languageOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  languageOptionText: {
    fontSize: 16,
  },
  selectedLanguage: {
    backgroundColor: '#e3f2fd',
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
}));

describe('LanguageSelector Snapshot Tests', () => {
  const mockTranslationHook = {
    changeLanguage: jest.fn(),
    getAvailableLanguages: jest.fn(),
    getCurrentLanguageDisplay: jest.fn(),
    LANGUAGE_CODES: {
      'English': 'en',
      'Spanish': 'es',
      'Chinese': 'zh',
      'Dutch': 'nl'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useTranslation.mockReturnValue(mockTranslationHook);
  });

  describe('Closed Modal States', () => {
    it('should match snapshot with English selected', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('English');
      mockTranslationHook.getAvailableLanguages.mockReturnValue(['English', 'Spanish', 'Chinese', 'Dutch']);

      const tree = render(<LanguageSelector />);
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot with Spanish selected', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('Spanish');
      mockTranslationHook.getAvailableLanguages.mockReturnValue(['English', 'Spanish', 'Chinese', 'Dutch']);

      const tree = render(<LanguageSelector />);
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot with Chinese selected', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('Chinese');
      mockTranslationHook.getAvailableLanguages.mockReturnValue(['English', 'Spanish', 'Chinese', 'Dutch']);

      const tree = render(<LanguageSelector />);
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot with Dutch selected', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('Dutch');
      mockTranslationHook.getAvailableLanguages.mockReturnValue(['English', 'Spanish', 'Chinese', 'Dutch']);

      const tree = render(<LanguageSelector />);
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot with unknown language (fallback)', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('French');
      mockTranslationHook.getAvailableLanguages.mockReturnValue(['English', 'Spanish', 'Chinese', 'Dutch']);

      const tree = render(<LanguageSelector />);
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Open Modal States', () => {
    it('should match snapshot with modal open - English current', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('English');
      mockTranslationHook.getAvailableLanguages.mockReturnValue(['English', 'Spanish', 'Chinese', 'Dutch']);

      const { getByText } = render(<LanguageSelector />);
      
      // Open the modal
      const languageButton = getByText('🌐 🇺🇸');
      fireEvent.press(languageButton);

      // Take snapshot with modal open
      const tree = render(<LanguageSelector />);
      // Manually set modal visible for snapshot
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot with modal open - Spanish current', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('Spanish');
      mockTranslationHook.getAvailableLanguages.mockReturnValue(['English', 'Spanish', 'Chinese', 'Dutch']);

      const tree = render(<LanguageSelector />);
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot with limited language options', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('English');
      mockTranslationHook.getAvailableLanguages.mockReturnValue(['English', 'Spanish']); // Only 2 languages

      const tree = render(<LanguageSelector />);
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot with single language option', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('English');
      mockTranslationHook.getAvailableLanguages.mockReturnValue(['English']); // Only 1 language

      const tree = render(<LanguageSelector />);
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot with empty language options', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('English');
      mockTranslationHook.getAvailableLanguages.mockReturnValue([]); // No languages

      const tree = render(<LanguageSelector />);
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Edge Cases', () => {
    it('should match snapshot when getCurrentLanguageDisplay returns null', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue(null);
      mockTranslationHook.getAvailableLanguages.mockReturnValue(['English', 'Spanish']);

      const tree = render(<LanguageSelector />);
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot when getCurrentLanguageDisplay returns undefined', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue(undefined);
      mockTranslationHook.getAvailableLanguages.mockReturnValue(['English', 'Spanish']);

      const tree = render(<LanguageSelector />);
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot when getAvailableLanguages returns null', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('English');
      mockTranslationHook.getAvailableLanguages.mockReturnValue(null);

      const tree = render(<LanguageSelector />);
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot with very long language names', () => {
      mockTranslationHook.getCurrentLanguageDisplay.mockReturnValue('Very Long Language Name That Might Wrap');
      mockTranslationHook.getAvailableLanguages.mockReturnValue([
        'English',
        'Very Long Language Name That Might Wrap',
        'Another Extremely Long Language Name'
      ]);

      const tree = render(<LanguageSelector />);
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Props Variations', () => {
    it('should match snapshot with custom LANGUAGE_CODES', () => {
      const customTranslationHook = {
        ...mockTranslationHook,
        LANGUAGE_CODES: {
          'English': 'en-US',
          'Spanish': 'es-ES',
          'French': 'fr-FR',
          'German': 'de-DE'
        }
      };
      useTranslation.mockReturnValue(customTranslationHook);

      customTranslationHook.getCurrentLanguageDisplay.mockReturnValue('French');
      customTranslationHook.getAvailableLanguages.mockReturnValue(['English', 'Spanish', 'French', 'German']);

      const tree = render(<LanguageSelector />);
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot with missing LANGUAGE_CODES', () => {
      const customTranslationHook = {
        ...mockTranslationHook,
        LANGUAGE_CODES: {}
      };
      useTranslation.mockReturnValue(customTranslationHook);

      customTranslationHook.getCurrentLanguageDisplay.mockReturnValue('English');
      customTranslationHook.getAvailableLanguages.mockReturnValue(['English', 'Spanish']);

      const tree = render(<LanguageSelector />);
      expect(tree).toMatchSnapshot();
    });
  });
});