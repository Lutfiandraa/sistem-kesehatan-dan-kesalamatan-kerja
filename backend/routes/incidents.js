const express = require('express');
const { body, validationResult, query: queryValidator } = require('express-validator');
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/incidents
// @desc    Get all incident reports (with filters)
// @access  Private
router.get('/', [
  queryValidator('page').optional().isInt({ min: 1 }),
  queryValidator('limit').optional().isInt({ min: 1, max: 100 }),
  queryValidator('status').optional().isIn(['pending', 'under_review', 'resolved', 'closed']),
  queryValidator('severity').optional().isIn(['low', 'medium', 'high', 'critical']),
  queryValidator('incident_type').optional(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;
    
    // If user is not admin/supervisor, only show their own reports
    if (req.user.role === 'user') {
      whereConditions.push(`ir.user_id = $${paramIndex}`);
      queryParams.push(req.user.id);
      paramIndex++;
    }
    
    // Add filters
    if (req.query.status) {
      whereConditions.push(`ir.status = $${paramIndex}`);
      queryParams.push(req.query.status);
      paramIndex++;
    }
    
    if (req.query.severity) {
      whereConditions.push(`ir.severity = $${paramIndex}`);
      queryParams.push(req.query.severity);
      paramIndex++;
    }
    
    if (req.query.incident_type) {
      whereConditions.push(`ir.incident_type = $${paramIndex}`);
      queryParams.push(req.query.incident_type);
      paramIndex++;
    }
    
    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';
    
    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM incident_reports ir ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);
    
    // Get incidents
    queryParams.push(limit, offset);
    const incidentsResult = await query(
      `SELECT 
        ir.*,
        u.full_name as reporter_name,
        u.email as reporter_email,
        r.full_name as reviewer_name
       FROM incident_reports ir
       LEFT JOIN users u ON ir.user_id = u.id
       LEFT JOIN users r ON ir.reviewed_by = r.id
       ${whereClause}
       ORDER BY ir.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      queryParams
    );
    
    res.json({
      success: true,
      data: {
        incidents: incidentsResult.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/incidents/:id
// @desc    Get single incident report
// @access  Private
router.get('/:id', async (req, res, next) => {
  try {
    const incidentId = parseInt(req.params.id);
    
    // Get incident
    const incidentResult = await query(
      `SELECT 
        ir.*,
        u.full_name as reporter_name,
        u.email as reporter_email,
        u.department as reporter_department,
        r.full_name as reviewer_name
       FROM incident_reports ir
       LEFT JOIN users u ON ir.user_id = u.id
       LEFT JOIN users r ON ir.reviewed_by = r.id
       WHERE ir.id = $1`,
      [incidentId]
    );
    
    if (incidentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Incident report not found'
      });
    }
    
    const incident = incidentResult.rows[0];
    
    // Check if user has permission to view this incident
    if (req.user.role === 'user' && incident.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Get attachments
    const attachmentsResult = await query(
      'SELECT * FROM incident_attachments WHERE incident_report_id = $1',
      [incidentId]
    );
    
    // Get comments
    const commentsResult = await query(
      `SELECT 
        ic.*,
        u.full_name as commenter_name
       FROM incident_comments ic
       LEFT JOIN users u ON ic.user_id = u.id
       WHERE ic.incident_report_id = $1
       ORDER BY ic.created_at ASC`,
      [incidentId]
    );
    
    res.json({
      success: true,
      data: {
        incident: {
          ...incident,
          attachments: attachmentsResult.rows,
          comments: commentsResult.rows
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/incidents
// @desc    Create new incident report
// @access  Private
router.post('/', [
  body('incident_type').isIn(['near_miss', 'injury', 'property_damage', 'unsafe_condition', 'unsafe_behavior', 'other']),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('incident_date').isISO8601().withMessage('Valid incident date is required'),
  body('severity').optional().isIn(['low', 'medium', 'high', 'critical']),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const {
      incident_type,
      title,
      description,
      location,
      incident_date,
      severity = 'low'
    } = req.body;
    
    // Create incident report
    const result = await query(
      `INSERT INTO incident_reports 
       (user_id, incident_type, title, description, location, incident_date, severity)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, incident_type, title, description, location, incident_date, severity]
    );
    
    res.status(201).json({
      success: true,
      message: 'Incident report created successfully',
      data: {
        incident: result.rows[0]
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/incidents/:id/status
// @desc    Update incident status (admin/supervisor only)
// @access  Private (Admin/Supervisor)
router.put('/:id/status', authorize('admin', 'supervisor'), [
  body('status').isIn(['pending', 'under_review', 'resolved', 'closed']),
  body('resolution_notes').optional().trim(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const incidentId = parseInt(req.params.id);
    const { status, resolution_notes } = req.body;
    
    // Check if incident exists
    const incidentResult = await query(
      'SELECT * FROM incident_reports WHERE id = $1',
      [incidentId]
    );
    
    if (incidentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Incident report not found'
      });
    }
    
    // Update status
    const updateFields = ['status = $1', 'reviewed_by = $2', 'reviewed_at = CURRENT_TIMESTAMP'];
    const updateParams = [status, req.user.id];
    let paramIndex = 3;
    
    if (resolution_notes) {
      updateFields.push(`resolution_notes = $${paramIndex}`);
      updateParams.push(resolution_notes);
      paramIndex++;
    }
    
    if (status === 'resolved' || status === 'closed') {
      updateFields.push('resolved_at = CURRENT_TIMESTAMP');
    }
    
    updateParams.push(incidentId);
    
    const result = await query(
      `UPDATE incident_reports 
       SET ${updateFields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      updateParams
    );
    
    res.json({
      success: true,
      message: 'Incident status updated successfully',
      data: {
        incident: result.rows[0]
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/incidents/:id/comments
// @desc    Add comment to incident
// @access  Private
router.post('/:id/comments', [
  body('comment').trim().notEmpty().withMessage('Comment is required'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const incidentId = parseInt(req.params.id);
    const { comment } = req.body;
    
    // Check if incident exists
    const incidentResult = await query(
      'SELECT * FROM incident_reports WHERE id = $1',
      [incidentId]
    );
    
    if (incidentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Incident report not found'
      });
    }
    
    // Check permission
    const incident = incidentResult.rows[0];
    if (req.user.role === 'user' && incident.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Add comment
    const result = await query(
      `INSERT INTO incident_comments (incident_report_id, user_id, comment)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [incidentId, req.user.id, comment]
    );
    
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comment: result.rows[0]
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

