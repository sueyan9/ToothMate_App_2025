import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';
import { Context as UserContext } from '../../context/UserContext/UserContext';
import UserScreen from './UserScreen';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    getAllKeys: jest.fn(() => Promise.resolve([])),
    clear: jest.fn(() => Promise.resolve()),
  },
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback) => {
    // Immediately call the callback to simulate focus
    const cleanup = callback();
    return cleanup;
  },
  createNavigationContainerRef: () => ({
    isReady: () => true,
    navigate: jest.fn(),
  }),
}));

// Mock navigationRef
jest.mock('../../navigationRef', () => ({
  navigate: jest.fn(),
  navigationRef: {
    isReady: () => true,
    navigate: jest.fn(),
  },
}));

// Mock axios
jest.mock('../../api/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
  },
}));

// Mock external dependencies
jest.mock('react-native-keyboard-aware-scroll-view', () => ({
  KeyboardAwareScrollView: ({ children }) => children,
}));

jest.mock('react-native-elements', () => ({
  Input: ({ label, value, onChangeText, testID, ...props }) => {
    const React = require('react');
    const { TextInput, Text, View } = require('react-native');
    return React.createElement(View, {},
      React.createElement(Text, {}, label),
      React.createElement(TextInput, {
        value,
        onChangeText,
        testID: testID || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`,
        ...props
      })
    );
  },
  Button: ({ title, onPress, testID, ...props }) => {
    const React = require('react');
    const { TouchableOpacity, Text } = require('react-native');
    return React.createElement(TouchableOpacity, {
      onPress,
      testID: testID || `button-${title?.toLowerCase().replace(/\s+/g, '-')}`,
      ...props
    }, React.createElement(Text, {}, title));
  },
}));

jest.mock('react-native-modal-datetime-picker', () => {
  const React = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  return ({ isVisible, onConfirm, onCancel, testID }) => {
    if (!isVisible) return null;
    return React.createElement(View, {
      testID: testID || 'date-picker-modal'
    }, 
      React.createElement(TouchableOpacity, {
        onPress: () => onConfirm(new Date('1995-06-15')),
        testID: 'date-picker-confirm'
      }, React.createElement(Text, {}, 'Confirm')),
      React.createElement(TouchableOpacity, {
        onPress: onCancel,
        testID: 'date-picker-cancel'
      }, React.createElement(Text, {}, 'Cancel'))
    );
  };
});

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }) => children,
}));

jest.mock('../../components/Spacer', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ children }) => React.createElement(View, { testID: 'spacer' }, children);
});

jest.mock('../LoadingScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, { testID: 'loading-screen' }, 'Loading...');
});

// Mock the contexts
const mockUserState = {
  details: {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    mobile: '1234567890',
    dob: '1990-01-01'
  }
};

const mockAuthState = {
  errorMessage: null
};

const mockUpdateUser = jest.fn();

const MockUserProvider = ({ children, state = mockUserState }) => (
  <UserContext.Provider value={{ state }}>
    {children}
  </UserContext.Provider>
);

const MockAuthProvider = ({ children, state = mockAuthState, updateUser = mockUpdateUser }) => (
  <AuthContext.Provider value={{ state, updateUser }}>
    {children}
  </AuthContext.Provider>
);

const renderWithProviders = (component, userState = mockUserState, authState = mockAuthState) => {
  return render(
    <MockUserProvider state={userState}>
      <MockAuthProvider state={authState} updateUser={mockUpdateUser}>
        {component}
      </MockAuthProvider>
    </MockUserProvider>
  );
};

describe('UserScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with user data', () => {
    renderWithProviders(<UserScreen />);
    
    expect(screen.getByDisplayValue('John')).toBeTruthy();
    expect(screen.getByDisplayValue('Doe')).toBeTruthy();
    expect(screen.getByDisplayValue('john.doe@example.com')).toBeTruthy();
    expect(screen.getByDisplayValue('1234567890')).toBeTruthy();
    expect(screen.getByText('ToothMate')).toBeTruthy();
    expect(screen.getByText('Update Details')).toBeTruthy();
  });

  it('displays the correct date format', () => {
    renderWithProviders(<UserScreen />);
    
    // Should display date in DD/MM/YYYY format
    expect(screen.getByText('01/01/1990')).toBeTruthy();
  });

  it('updates first name when input changes', () => {
    renderWithProviders(<UserScreen />);
    
    const firstNameInput = screen.getByDisplayValue('John');
    fireEvent.changeText(firstNameInput, 'Jane');
    
    expect(screen.getByDisplayValue('Jane')).toBeTruthy();
  });

  it('updates last name when input changes', () => {
    renderWithProviders(<UserScreen />);
    
    const lastNameInput = screen.getByDisplayValue('Doe');
    fireEvent.changeText(lastNameInput, 'Smith');
    
    expect(screen.getByDisplayValue('Smith')).toBeTruthy();
  });

  it('updates email when input changes', () => {
    renderWithProviders(<UserScreen />);
    
    const emailInput = screen.getByDisplayValue('john.doe@example.com');
    fireEvent.changeText(emailInput, 'jane.smith@example.com');
    
    expect(screen.getByDisplayValue('jane.smith@example.com')).toBeTruthy();
  });

  it('updates mobile when input changes', () => {
    renderWithProviders(<UserScreen />);
    
    const mobileInput = screen.getByDisplayValue('1234567890');
    fireEvent.changeText(mobileInput, '0987654321');
    
    expect(screen.getByDisplayValue('0987654321')).toBeTruthy();
  });

  it('opens date picker when date is pressed', () => {
    renderWithProviders(<UserScreen />);
    
    const dateText = screen.getByText('01/01/1990');
    fireEvent.press(dateText);
    
    expect(screen.getByTestId('date-picker-modal')).toBeTruthy();
  });

  it('calls updateUser when Update Details button is pressed', async () => {
    renderWithProviders(<UserScreen />);
    
    const updateButton = screen.getByText('Update Details');
    fireEvent.press(updateButton);
    
    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        mobile: '1234567890',
        dob: new Date('1990-01-01')
      });
    });
  });

  it('calls updateUser with modified data when fields are changed', async () => {
    renderWithProviders(<UserScreen />);
    
    // Change first name
    const firstNameInput = screen.getByDisplayValue('John');
    fireEvent.changeText(firstNameInput, 'Jane');
    
    // Change email
    const emailInput = screen.getByDisplayValue('john.doe@example.com');
    fireEvent.changeText(emailInput, 'jane.doe@example.com');
    
    // Press update button
    const updateButton = screen.getByText('Update Details');
    fireEvent.press(updateButton);
    
    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'jane.doe@example.com',
        mobile: '1234567890',
        dob: new Date('1990-01-01')
      });
    });
  });

  it('displays error message when present', () => {
    const authStateWithError = {
      errorMessage: 'Update failed. Please try again.'
    };
    
    renderWithProviders(<UserScreen />, mockUserState, authStateWithError);
    
    expect(screen.getByText('Update failed. Please try again.')).toBeTruthy();
  });

  it('does not display error message when not present', () => {
    renderWithProviders(<UserScreen />);
    
    expect(screen.queryByTestId('error-message')).toBeFalsy();
  });

  it('handles empty user details gracefully', () => {
    const emptyUserState = {
      details: {
        firstname: '',
        lastname: '',
        email: '',
        mobile: '',
        dob: ''
      }
    };
    
    renderWithProviders(<UserScreen />, emptyUserState);
    
    expect(screen.getByText('ToothMate')).toBeTruthy();
    expect(screen.getByText('Update Details')).toBeTruthy();
  });

  it('console logs focus events', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    renderWithProviders(<UserScreen />);
    
    // The useFocusEffect should have triggered
    expect(consoleSpy).toHaveBeenCalledWith('UserScreen is focused');
    
    consoleSpy.mockRestore();
  });

  it('has correct input properties', () => {
    renderWithProviders(<UserScreen />);
    
    const emailInput = screen.getByDisplayValue('john.doe@example.com');
    const mobileInput = screen.getByDisplayValue('1234567890');
    
    // Check that inputs have correct keyboard types
    expect(emailInput.props.keyboardType).toBe('email-address');
    expect(mobileInput.props.keyboardType).toBe('phone-pad');
  });

  it('has correct input autocomplete properties', () => {
    renderWithProviders(<UserScreen />);
    
    const firstNameInput = screen.getByDisplayValue('John');
    const emailInput = screen.getByDisplayValue('john.doe@example.com');
    
    expect(firstNameInput.props.autoCapitalize).toBe('none');
    expect(firstNameInput.props.autoCorrect).toBe(false);
    expect(emailInput.props.autoCapitalize).toBe('none');
    expect(emailInput.props.autoCorrect).toBe(false);
  });
});