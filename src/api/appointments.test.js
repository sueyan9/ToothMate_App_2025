import * as appointments from './appointments';
import axiosApi from './axios';

// Mock the axios module
jest.mock('./axios', () => ({
  defaults: { baseURL: 'https://api.toothmate.com' },
  get: jest.fn(),
}));

// Mock fetch for testing PDF base64 functionality
global.fetch = jest.fn();

jest.mock('../api/appointments', () => {
  const originalModule = jest.requireActual('../api/appointments');
  return {
    ...originalModule,
    // Override the functions to include BASE_URL check
  };
});

describe('appointments API functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console.warn mock
    console.warn = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAppointmentsByNHI', () => {
    it('should fetch appointments by NHI with default params', async () => {
      const mockData = { appointments: [{ id: 1, nhi: 'ABC123' }] };
      axiosApi.get.mockResolvedValueOnce({ data: mockData });

      const result = await appointments.getAppointmentsByNHI('ABC123');

      expect(axiosApi.get).toHaveBeenCalledWith('/Appointments/ABC123', {
        params: { limit: 100 },
      });
      expect(result).toEqual(mockData);
    });

    it('should fetch appointments with custom params', async () => {
      const mockData = { appointments: [] };
      axiosApi.get.mockResolvedValueOnce({ data: mockData });

      await appointments.getAppointmentsByNHI('XYZ789', { limit: 50, offset: 10 });

      expect(axiosApi.get).toHaveBeenCalledWith('/Appointments/XYZ789', {
        params: { limit: 50, offset: 10 },
      });
    });

    it('should URL encode the NHI parameter', async () => {
      const mockData = { appointments: [] };
      axiosApi.get.mockResolvedValueOnce({ data: mockData });

      await appointments.getAppointmentsByNHI('ABC/123');

      expect(axiosApi.get).toHaveBeenCalledWith('/Appointments/ABC%2F123', {
        params: { limit: 100 },
      });
    });
  });

  describe('getAppointmentById', () => {
    it('should fetch a single appointment by ID', async () => {
      const mockAppointment = { id: 'apt123', patientName: 'John Doe' };
      axiosApi.get.mockResolvedValueOnce({ data: mockAppointment });

      const result = await appointments.getAppointmentById('apt123');

      expect(axiosApi.get).toHaveBeenCalledWith('/Appointments/byId/apt123');
      expect(result).toEqual(mockAppointment);
    });
  });

  describe('fetchAppointmentImages', () => {
    it('should return base64 strings from images array', async () => {
      const mockData = {
        images: [
          { base64: 'base64string1' },
          { data: 'base64string2' },
          { content: 'base64string3' },
        ],
      };
      axiosApi.get.mockResolvedValueOnce({ data: mockData });

      const result = await appointments.fetchAppointmentImages('apt123');

      expect(axiosApi.get).toHaveBeenCalledWith('/Appointments/apt123/images');
      expect(result).toEqual(['base64string1', 'base64string2', 'base64string3']);
    });

    it('should handle empty images array', async () => {
      const mockData = { images: [] };
      axiosApi.get.mockResolvedValueOnce({ data: mockData });

      const result = await appointments.fetchAppointmentImages('apt123');

      expect(result).toEqual([]);
    });

    it('should handle missing images property', async () => {
      const mockData = {};
      axiosApi.get.mockResolvedValueOnce({ data: mockData });

      const result = await appointments.fetchAppointmentImages('apt123');

      expect(result).toEqual([]);
    });

    it('should handle images with missing base64 fields', async () => {
      const mockData = {
        images: [
          { base64: 'validBase64' },
          {}, // Missing base64/data/content
          { other: 'field' }, // Wrong field name
        ],
      };
      axiosApi.get.mockResolvedValueOnce({ data: mockData });

      const result = await appointments.fetchAppointmentImages('apt123');

      expect(result).toEqual(['validBase64', '', '']);
    });
  });

  describe('buildAppointmentImageRawUrls', () => {
    it('should build correct URLs when count is provided', async () => {
      const result = await appointments.buildAppointmentImageRawUrls('apt123', 3);

      expect(result).toEqual([
        'https://api.toothmate.com/Appointments/apt123/images/0/raw',
        'https://api.toothmate.com/Appointments/apt123/images/1/raw',
        'https://api.toothmate.com/Appointments/apt123/images/2/raw',
      ]);
    });

    it('should fetch images and determine count when count not provided', async () => {
      const mockData = {
        images: [{ base64: 'img1' }, { base64: 'img2' }],
      };
      axiosApi.get.mockResolvedValueOnce({ data: mockData });

      const result = await appointments.buildAppointmentImageRawUrls('apt123');

      expect(axiosApi.get).toHaveBeenCalledWith('/Appointments/apt123/images');
      expect(result).toEqual([
        'https://api.toothmate.com/Appointments/apt123/images/0/raw',
        'https://api.toothmate.com/Appointments/apt123/images/1/raw',
      ]);
    });

    it('should throw error when BASE_URL is not set', async () => {
      // Store original baseURL
      const originalBaseURL = axiosApi.defaults.baseURL;
      
      // Mock axiosApi with no baseURL
      axiosApi.defaults.baseURL = '';

      await expect(
        appointments.buildAppointmentImageRawUrls('apt123', 2)
      ).rejects.toThrow('BASE_URL not set, cannot build image RAW links');
      
      // Restore original baseURL
      axiosApi.defaults.baseURL = originalBaseURL;
    });
  });

  describe('fetchAppointmentPDFCount', () => {
    it('should return PDF count from response', async () => {
      const mockData = { count: 5 };
      axiosApi.get.mockResolvedValueOnce({ data: mockData });

      const result = await appointments.fetchAppointmentPDFCount('apt123');

      expect(axiosApi.get).toHaveBeenCalledWith('/Appointments/apt123/pdfs');
      expect(result).toBe(5);
    });

    it('should return 0 when count is not provided', async () => {
      const mockData = {};
      axiosApi.get.mockResolvedValueOnce({ data: mockData });

      const result = await appointments.fetchAppointmentPDFCount('apt123');

      expect(result).toBe(0);
    });

    it('should return 0 when data is null', async () => {
      axiosApi.get.mockResolvedValueOnce({ data: null });

      const result = await appointments.fetchAppointmentPDFCount('apt123');

      expect(result).toBe(0);
    });
  });

  describe('buildAppointmentPdfRawUrls', () => {
    it('should build correct PDF URLs', () => {
      const result = appointments.buildAppointmentPdfRawUrls('apt123', 2);

      expect(result).toEqual([
        'https://api.toothmate.com/Appointments/apt123/pdfs/0/raw',
        'https://api.toothmate.com/Appointments/apt123/pdfs/1/raw',
      ]);
    });

    it('should handle zero count', () => {
      const result = appointments.buildAppointmentPdfRawUrls('apt123', 0);

      expect(result).toEqual([]);
    });

    it('should throw error when count is not a number', () => {
      expect(() => {
        appointments.buildAppointmentPdfRawUrls('apt123', 'invalid');
      }).toThrow('buildAppointmentPdfRawUrls requires count');
    });

    it('should throw error when BASE_URL is not set', () => {
      // Store original baseURL
      const originalBaseURL = axiosApi.defaults.baseURL;
      
      // Mock axiosApi with no baseURL
      axiosApi.defaults.baseURL = '';

      expect(() => {
        appointments.buildAppointmentPdfRawUrls('apt123', 2);
      }).toThrow('BASE_URL not set, cannot build PDF RAW links');
      
      // Restore original baseURL
      axiosApi.defaults.baseURL = originalBaseURL;
    });
  });

  describe('fetchAppointmentPDFBase64s', () => {
    beforeEach(() => {
      // Reset baseURL for these tests
      axiosApi.defaults.baseURL = 'https://api.toothmate.com';
    });

    it('should fetch and convert PDFs to base64', async () => {
      // Mock PDF count response
      axiosApi.get.mockResolvedValueOnce({ data: { count: 2 } });

      // Mock fetch responses for PDF files
      const mockArrayBuffer1 = new ArrayBuffer(8);
      const mockArrayBuffer2 = new ArrayBuffer(16);
      
      fetch
        .mockResolvedValueOnce({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockArrayBuffer1),
        })
        .mockResolvedValueOnce({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockArrayBuffer2),
        });

      const result = await appointments.fetchAppointmentPDFBase64s('apt123');

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.toothmate.com/Appointments/apt123/pdfs/0/raw'
      );
      expect(fetch).toHaveBeenCalledWith(
        'https://api.toothmate.com/Appointments/apt123/pdfs/1/raw'
      );
      expect(result).toHaveLength(2);
      expect(typeof result[0]).toBe('string');
      expect(typeof result[1]).toBe('string');
    });

    it('should skip failed PDF requests', async () => {
      // Mock PDF count response
      axiosApi.get.mockResolvedValueOnce({ data: { count: 2 } });

      // Mock fetch responses - one success, one failure
      const mockArrayBuffer = new ArrayBuffer(8);
      
      fetch
        .mockResolvedValueOnce({
          ok: true,
          arrayBuffer: () => Promise.resolve(mockArrayBuffer),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        });

      const result = await appointments.fetchAppointmentPDFBase64s('apt123');

      expect(result).toHaveLength(1); // Only successful PDF included
    });
  });

  describe('fetchAssetsForAppointment', () => {
    beforeEach(() => {
      // Reset baseURL for these tests
      axiosApi.defaults.baseURL = 'https://api.toothmate.com';
    });

    it('should return assets from backend /assets endpoint', async () => {
      const mockAssetsData = {
        imagesBase64: ['img1', 'img2'],
        pdfUrls: ['url1', 'url2'],
        pdfItems: [{ name: 'doc1.pdf' }],
        count: 2,
      };
      
      axiosApi.get.mockResolvedValueOnce({ data: mockAssetsData });

      const result = await appointments.fetchAssetsForAppointment('apt123');

      expect(axiosApi.get).toHaveBeenCalledWith('/Appointments/apt123/assets');
      expect(result).toEqual({
        imagesBase64: ['img1', 'img2'],
        pdfUrls: ['url1', 'url2'],
        pdfItems: [{ name: 'doc1.pdf' }],
        pdfCount: 2,
      });
    });

    it('should handle missing properties in assets response', async () => {
      const mockAssetsData = {
        imagesBase64: ['img1'],
        // Missing pdfUrls, pdfItems, count
      };
      
      axiosApi.get.mockResolvedValueOnce({ data: mockAssetsData });

      const result = await appointments.fetchAssetsForAppointment('apt123');

      expect(result).toEqual({
        imagesBase64: ['img1'],
        pdfUrls: [],
        pdfItems: [],
        pdfCount: 0,
      });
    });

    it('should fallback to legacy logic when assets endpoint fails', async () => {
      // Mock assets endpoint failure
      axiosApi.get
        .mockRejectedValueOnce(new Error('Assets endpoint not available'))
        // Mock successful legacy calls
        .mockResolvedValueOnce({ data: { images: [{ base64: 'legacyImg' }] } }) // images
        .mockResolvedValueOnce({ data: { count: 1 } }); // PDF count

      console.warn = jest.fn(); // Mock console.warn

      const result = await appointments.fetchAssetsForAppointment('apt123');

      expect(console.warn).toHaveBeenCalledWith(
        '[assets] fallback to legacy logic:',
        'apt123',
        'Assets endpoint not available'
      );
      expect(result).toEqual({
        imagesBase64: ['legacyImg'],
        pdfUrls: ['https://api.toothmate.com/Appointments/apt123/pdfs/0/raw'],
        pdfItems: [],
        pdfCount: 1,
      });
    });

    it('should handle empty data in assets response', async () => {
      axiosApi.get.mockResolvedValueOnce({ data: null });

      const result = await appointments.fetchAssetsForAppointment('apt123');

      expect(result).toEqual({
        imagesBase64: [],
        pdfUrls: [],
        pdfItems: [],
        pdfCount: 0,
      });
    });
  });
});