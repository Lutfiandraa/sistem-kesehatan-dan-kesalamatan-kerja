const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const materialsController = require('../controllers/materialsController');

// Reports endpoints
router.get('/reports', reportsController.getAllReports);
router.get('/reports/:id', reportsController.getReportById);
router.post('/reports', reportsController.createReport);
router.put('/reports/:id', reportsController.updateReport);
router.delete('/reports/:id', reportsController.deleteReport);

// Materials endpoints
router.get('/materials', materialsController.getAllMaterials);
router.get('/materials/:id', materialsController.getMaterialById);
router.post('/materials', materialsController.createMaterial);
router.put('/materials/:id', materialsController.updateMaterial);
router.delete('/materials/:id', materialsController.deleteMaterial);

module.exports = router;
