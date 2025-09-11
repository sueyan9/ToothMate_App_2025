// __tests__/appointments.test.js
import axiosApi from '../../api/axios';

// Mock axios
jest.mock('../../api/axios');
const mockedAxios = axiosApi;

describe('Appointment Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

  // Test 1: GET Appointments - Success
    test('should fetch appointments successfully', async () => {
        const mockAppointments = [
        {
            _id: '1',
            startAt: '2024-12-15T09:00:00.000Z',
            purpose: 'Check-up',
            nhi: 'TEST123'
        }
        ];

        mockedAxios.get.mockResolvedValue({
        status: 200,
        data: mockAppointments
        });

        const response = await axiosApi.get('Appointments/TEST123', {
        params: { limit: 400 }
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveLength(1);
        expect(mockedAxios.get).toHaveBeenCalledWith('Appointments/TEST123', {
        params: { limit: 400 }
        });
    });

  // Test 2: GET Appointments - Error
    test('should handle fetch appointments error', async () => {
        mockedAxios.get.mockRejectedValue({
        response: { status: 404, data: { message: 'Not found' } }
        });

        try {
        await axiosApi.get('Appointments/INVALID_NHI', {
            params: { limit: 400 }
        });
        } catch (error) {
        expect(error.response.status).toBe(404);
        }
    });

  // Test 3: POST Appointment - Success
    test('should create appointment successfully', async () => {
        const appointmentData = {
        nhi: 'TEST123',
        purpose: 'Check-up',
        startLocal: '2024-12-15T09:00:00.000Z',
        endLocal: '2024-12-15T09:30:00.000Z',
        timezone: 'Pacific/Auckland',
        clinic: 'clinic1'
        };

        mockedAxios.post.mockResolvedValue({
        status: 201,
        data: { _id: 'new-appointment', ...appointmentData }
        });

        const response = await axiosApi.post('/Appointments', appointmentData);

        expect(response.status).toBe(201);
        expect(response.data._id).toBe('new-appointment');
        expect(mockedAxios.post).toHaveBeenCalledWith('/Appointments', appointmentData);
    });

  // Test 4: POST Appointment - Validation Error
    test('should handle appointment creation error', async () => {
        const invalidData = {
        nhi: 'TEST123',
        purpose: '', // Invalid - empty purpose
        clinic: 'clinic1'
        };

        mockedAxios.post.mockRejectedValue({
        response: { 
            status: 400, 
            data: { message: 'Purpose is required' } 
        }
        });

        try {
        await axiosApi.post('/Appointments', invalidData);
        } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.message).toBe('Purpose is required');
        }
    });

  // Test 5: GET Clinics - Success
    test('should fetch clinics successfully', async () => {
        const mockClinics = [
        { _id: 'clinic1', name: 'Test Dental Clinic' }
        ];

        mockedAxios.get.mockResolvedValue({
        status: 200,
        data: mockClinics
        });

        const response = await axiosApi.get('/getDentalClinics');

        expect(response.status).toBe(200);
        expect(response.data).toHaveLength(1);
        expect(response.data[0].name).toBe('Test Dental Clinic');
    });

  // Test 6: GET Clinics - Error
    test('should handle fetch clinics error', async () => {
        mockedAxios.get.mockRejectedValue({
        response: { status: 500, data: { message: 'Server error' } }
        });

        try {
        await axiosApi.get('/getDentalClinics');
        } catch (error) {
        expect(error.response.status).toBe(500);
        }
    });
});