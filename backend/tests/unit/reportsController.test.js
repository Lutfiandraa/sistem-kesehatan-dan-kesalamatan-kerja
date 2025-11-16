const reportsController = require('../../controllers/reportsController');
const { query } = require('../../config/database');
const {
  createMockRequest,
  createMockResponse,
  generateMockReport,
  createMockQueryResult
} = require('../helpers/testHelpers');

// Mock database
jest.mock('../../config/database', () => ({
  query: jest.fn()
}));

describe('Reports Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReport', () => {
    it('should create a report successfully', async () => {
      const mockReport = generateMockReport();
      const mockRequest = createMockRequest({
        title: 'Test Report',
        description: 'Test Description',
        location: 'Test Location',
        incident_date: '2025-01-15',
        severity: 'ringan',
        jenis_insiden: 'Test Incident'
      });
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult([{
        ...mockReport,
        date: '15 January 2025'
      }]));

      await reportsController.createReport(mockRequest, mockResponse);

      expect(query).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(Number),
          title: 'Test Report',
          description: 'Test Description',
          date: expect.any(String),
          severity: expect.any(String),
          status: expect.any(String)
        })
      );
    });

    it('should return 400 if required fields are missing', async () => {
      const mockRequest = createMockRequest({
        title: 'Test Report'
        // Missing description, location, incident_date
      });
      const mockResponse = createMockResponse();

      await reportsController.createReport(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Title, description, location, and date are required'
      });
    });

    it('should handle date parsing with DD/MM/YYYY format', async () => {
      const mockReport = generateMockReport();
      const mockRequest = createMockRequest({
        title: 'Test Report',
        description: 'Test Description',
        location: 'Test Location',
        incident_date: '15/01/2025',
        severity: 'ringan'
      });
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult([{
        ...mockReport,
        date: '15 January 2025'
      }]));

      await reportsController.createReport(mockRequest, mockResponse);

      expect(query).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should determine severity from title if not provided', async () => {
      const mockReport = generateMockReport({ severity: 'berat' });
      const mockRequest = createMockRequest({
        title: 'Laporan Berat',
        description: 'Test Description',
        location: 'Test Location',
        incident_date: '2025-01-15'
      });
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult([{
        ...mockReport,
        date: '15 January 2025'
      }]));

      await reportsController.createReport(mockRequest, mockResponse);

      expect(query).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([
          expect.any(String), // title
          expect.any(String), // description
          expect.any(String), // location
          expect.any(Date),   // incident_date
          'berat',           // severity should be 'berat'
          expect.anything(),
          expect.anything()
        ])
      );
    });

    it('should return 400 for invalid date format', async () => {
      const mockRequest = createMockRequest({
        title: 'Test Report',
        description: 'Test Description',
        location: 'Test Location',
        incident_date: 'invalid-date'
      });
      const mockResponse = createMockResponse();

      await reportsController.createReport(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid date format'
      });
    });

    it('should handle image Base64 data', async () => {
      const mockReport = generateMockReport({ image: 'base64data' });
      const mockRequest = createMockRequest({
        title: 'Test Report',
        description: 'Test Description',
        location: 'Test Location',
        incident_date: '2025-01-15',
        image: 'base64imagedata'
      });
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult([{
        ...mockReport,
        date: '15 January 2025'
      }]));

      await reportsController.createReport(mockRequest, mockResponse);

      expect(query).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });

  describe('getAllReports', () => {
    it('should get all reports successfully', async () => {
      const mockReports = [
        generateMockReport({ id: 1 }),
        generateMockReport({ id: 2 })
      ];
      const mockRequest = createMockRequest();
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult(mockReports.map(r => ({
        ...r,
        date: '15 January 2025',
        status_db: r.status
      }))));

      await reportsController.getAllReports(mockRequest, mockResponse);

      expect(query).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String)
          })
        ])
      );
    });

    it('should handle database errors', async () => {
      const mockRequest = createMockRequest();
      const mockResponse = createMockResponse();

      query.mockRejectedValueOnce(new Error('Database error'));

      await reportsController.getAllReports(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.any(String)
        })
      );
    });
  });

  describe('getReportById', () => {
    it('should get a report by id successfully', async () => {
      const mockReport = generateMockReport();
      const mockRequest = createMockRequest({}, { id: '1' });
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult([{
        ...mockReport,
        date: '15 January 2025'
      }]));

      await reportsController.getReportById(mockRequest, mockResponse);

      expect(query).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          title: 'Test Report'
        })
      );
    });

    it('should return 404 if report not found', async () => {
      const mockRequest = createMockRequest({}, { id: '999' });
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult([]));

      await reportsController.getReportById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Report not found'
      });
    });
  });

  describe('updateReport', () => {
    it('should update a report successfully', async () => {
      const mockReport = generateMockReport();
      const mockRequest = createMockRequest({
        status: 'aman'
      }, { id: '1' });
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult([{
        ...mockReport,
        status: 'aman',
        date: '15 January 2025'
      }]));

      await reportsController.updateReport(mockRequest, mockResponse);

      expect(query).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Report updated successfully',
          data: expect.objectContaining({
            id: 1,
            status: expect.any(String)
          })
        })
      );
    });
  });

  describe('deleteReport', () => {
    it('should delete a report successfully', async () => {
      const mockRequest = createMockRequest({}, { id: '1' });
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult([{ id: 1 }]));

      await reportsController.deleteReport(mockRequest, mockResponse);

      expect(query).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Report deleted successfully'
      });
    });

    it('should return 404 if report not found', async () => {
      const mockRequest = createMockRequest({}, { id: '999' });
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult([]));

      await reportsController.deleteReport(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Report not found'
      });
    });
  });
});

