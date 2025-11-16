const materialsController = require('../../controllers/materialsController');
const { query } = require('../../config/database');
const {
  createMockRequest,
  createMockResponse,
  generateMockMaterial,
  createMockQueryResult
} = require('../helpers/testHelpers');

// Mock database
jest.mock('../../config/database', () => ({
  query: jest.fn()
}));

describe('Materials Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMaterial', () => {
    it('should create a material successfully', async () => {
      const mockMaterial = generateMockMaterial();
      const mockRequest = createMockRequest({
        title: 'Test Material',
        category: 'Safety',
        description: 'Test Description',
        content: 'Test Content'
      });
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult([mockMaterial]));

      await materialsController.createMaterial(mockRequest, mockResponse);

      expect(query).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Material created successfully',
          data: expect.objectContaining({
            id: expect.any(Number),
            title: 'Test Material'
          })
        })
      );
    });

    it('should return 400 if required fields are missing', async () => {
      const mockRequest = createMockRequest({
        title: 'Test Material'
        // Missing category, description, content
      });
      const mockResponse = createMockResponse();

      await materialsController.createMaterial(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'All fields are required'
      });
    });

    it('should return 400 for invalid category', async () => {
      const mockRequest = createMockRequest({
        title: 'Test Material',
        category: 'Invalid',
        description: 'Test Description',
        content: 'Test Content'
      });
      const mockResponse = createMockResponse();

      await materialsController.createMaterial(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Category must be Safety or Kesehatan'
      });
    });

    it('should accept Kesehatan category', async () => {
      const mockMaterial = generateMockMaterial({ category: 'Kesehatan' });
      const mockRequest = createMockRequest({
        title: 'Test Material',
        category: 'Kesehatan',
        description: 'Test Description',
        content: 'Test Content'
      });
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult([mockMaterial]));

      await materialsController.createMaterial(mockRequest, mockResponse);

      expect(query).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });

  describe('getAllMaterials', () => {
    it('should get all materials successfully', async () => {
      const mockMaterials = [
        generateMockMaterial({ id: 1 }),
        generateMockMaterial({ id: 2, category: 'Kesehatan' })
      ];
      const mockRequest = createMockRequest();
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult(mockMaterials));

      await materialsController.getAllMaterials(mockRequest, mockResponse);

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
  });

  describe('getMaterialById', () => {
    it('should get a material by id successfully', async () => {
      const mockMaterial = generateMockMaterial();
      const mockRequest = createMockRequest({}, { id: '1' });
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult([mockMaterial]));

      await materialsController.getMaterialById(mockRequest, mockResponse);

      expect(query).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          title: 'Test Material'
        })
      );
    });

    it('should return 404 if material not found', async () => {
      const mockRequest = createMockRequest({}, { id: '999' });
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult([]));

      await materialsController.getMaterialById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Material not found'
      });
    });
  });

  describe('updateMaterial', () => {
    it('should update a material successfully', async () => {
      const mockMaterial = generateMockMaterial({ title: 'Updated Title' });
      const mockRequest = createMockRequest({
        title: 'Updated Title'
      }, { id: '1' });
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult([mockMaterial]));

      await materialsController.updateMaterial(mockRequest, mockResponse);

      expect(query).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: 1,
            title: 'Updated Title'
          })
        })
      );
    });
  });

  describe('deleteMaterial', () => {
    it('should delete a material successfully', async () => {
      const mockRequest = createMockRequest({}, { id: '1' });
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult([{ id: 1 }]));

      await materialsController.deleteMaterial(mockRequest, mockResponse);

      expect(query).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Material deleted successfully'
      });
    });

    it('should return 404 if material not found', async () => {
      const mockRequest = createMockRequest({}, { id: '999' });
      const mockResponse = createMockResponse();

      query.mockResolvedValueOnce(createMockQueryResult([]));

      await materialsController.deleteMaterial(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Material not found'
      });
    });
  });
});

