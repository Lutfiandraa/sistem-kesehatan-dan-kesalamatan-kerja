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

// Activities endpoints
const { query } = require('../config/database');

router.get('/activities', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM activities ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
});

router.post('/activities', async (req, res, next) => {
  try {
    const { title, category, description } = req.body;
    const result = await query(
      'INSERT INTO activities (title, category, description) VALUES ($1, $2, $3) RETURNING *',
      [title, category, description]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.delete('/activities/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM activities WHERE id = $1', [id]);
    res.json({ success: true, message: 'Activity deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
