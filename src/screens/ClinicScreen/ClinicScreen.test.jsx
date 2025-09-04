import { useFocusEffect } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import axiosApi from '../../api/axios';
import { Context as UserContext } from '../../context/UserContext/UserContext';
import ClinicScreen from '../ClinicScreen';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({ useFocusEffect: jest.fn() }));
jest.mock('../../api/axios', () => ({ get: jest.fn(), post: jest.fn() }));
jest.mock('react-native-calendars', () => ({ Calendar: () => null }));
jest.mock('@expo/vector-icons', () => ({ 
  MaterialIcons: ({ name }) => <div testID={`icon-${name}`} />
}));
jest.mock('@react-native-community/datetimepicker', () => () => null);

jest.spyOn(Alert, 'alert');

const mockContext = {
  state: { details: { nhi: 'ABC1234' }, clinic: { _id: 'clinic123' } },
  getUser: jest.fn(),
  getDentalClinic: jest.fn(),
};

const mockAppointments = [
  { _id: 'appt1', startAt: '2023-08-15T09:00:00Z', clinic: 'clinic123', purpose: 'Check-up' }
];

describe('ClinicScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFocusEffect.mockImplementation(cb => cb());
  });

  const renderComponent = () => render(
    <UserContext.Provider value={mockContext}>
      <ClinicScreen navigation={{}} route={{}} />
    </UserContext.Provider>
  );

  describe('Loading Appointments', () => {
    it('loads appointments on mount', async () => {
      axiosApi.get.mockResolvedValue({ data: mockAppointments });

      renderComponent();

      await waitFor(() => {
        expect(axiosApi.get).toHaveBeenCalledWith('Appointments/ABC1234', { params: { limit: 400 } });
      });
    });

    it('handles loading errors', async () => {
      axiosApi.get.mockRejectedValue(new Error('Network error'));
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      renderComponent();

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Load appointments failed:', 'Network error');
      });
      
      consoleSpy.mockRestore();
    });

    it('fetches clinic details when needed', async () => {
      axiosApi.get
        .mockResolvedValueOnce({ data: mockAppointments })
        .mockResolvedValueOnce({ data: [{ _id: 'clinic123', name: 'Test Clinic' }] });

      renderComponent();

      await waitFor(() => {
        expect(axiosApi.get).toHaveBeenCalledWith('/getDentalClinics', { params: { ids: 'clinic123' } });
      });
    });
  });

  describe('Adding Appointments', () => {
    beforeEach(() => {
      axiosApi.get.mockResolvedValue({ data: [] });
    });

    it('creates appointment successfully', async () => {
      axiosApi.post.mockResolvedValue({ status: 201 });
      const { getByTestId, getByText, getByPlaceholderText } = renderComponent();

      fireEvent.press(getByTestId('icon-add'));
      fireEvent.changeText(getByPlaceholderText('Enter appointment purpose'), 'Check-up');
      fireEvent.press(getByText('Submit'));

      await waitFor(() => {
        expect(axiosApi.post).toHaveBeenCalledWith('/Appointments', expect.objectContaining({
          nhi: 'ABC1234',
          purpose: 'Check-up',
          clinic: 'clinic123',
        }));
        expect(Alert.alert).toHaveBeenCalledWith('Success', 'Appointment added successfully.');
      });
    });

    it('validates required fields', async () => {
      const { getByTestId, getByText } = renderComponent();

      fireEvent.press(getByTestId('icon-add'));
      fireEvent.press(getByText('Submit'));

      expect(Alert.alert).toHaveBeenCalledWith('Validation Error', 'Purpose is required.');
    });

    it('normalizes purpose values', async () => {
      axiosApi.post.mockResolvedValue({ status: 201 });
      const { getByTestId, getByText, getByPlaceholderText } = renderComponent();

      fireEvent.press(getByTestId('icon-add'));
      fireEvent.changeText(getByPlaceholderText('Enter appointment purpose'), 'checkup');
      fireEvent.press(getByText('Submit'));

      await waitFor(() => {
        expect(axiosApi.post).toHaveBeenCalledWith('/Appointments', expect.objectContaining({
          purpose: 'Check-up',
        }));
      });
    });

    it('handles creation errors', async () => {
      axiosApi.post.mockRejectedValue({ response: { data: { message: 'Server error' } } });
      const { getByTestId, getByText, getByPlaceholderText } = renderComponent();

      fireEvent.press(getByTestId('icon-add'));
      fireEvent.changeText(getByPlaceholderText('Enter appointment purpose'), 'Check-up');
      fireEvent.press(getByText('Submit'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Server error');
      });
    });
  });
});