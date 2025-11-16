const { query } = require('../config/database');

// Create new report
const createReport = async (req, res) => {
  try {
    const { title, description, location, incident_date, severity, jenis_insiden, image } = req.body;

    // Validation
    if (!title || !description || !location || !incident_date) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, location, and date are required'
      });
    }

    // Parse date (format: DD/MM/YYYY or YYYY-MM-DD)
    let parsedDate;
    if (incident_date.includes('/')) {
      const [day, month, year] = incident_date.split('/');
      parsedDate = new Date(`${year}-${month}-${day}`);
    } else {
      parsedDate = new Date(incident_date);
    }

    // Determine severity from title or use provided
    let reportSeverity = severity || 'ringan';
    const titleLower = title.toLowerCase();
    if (titleLower.includes('berat')) {
      reportSeverity = 'berat';
    } else if (titleLower.includes('ringan')) {
      reportSeverity = 'ringan';
    } else if (titleLower.includes('kecelakaan') || titleLower.includes('tunggal')) {
      reportSeverity = 'sedang';
    }

    // Log image size for debugging
    if (image) {
      console.log('Image Base64 length:', image.length);
      if (image.length > 10000000) { // 10MB in characters (approximate)
        console.warn('Warning: Image Base64 string is very large');
      }
    }

    // Validate parsedDate
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    // Prepare image data - ensure it's not too large
    let imageData = image || null;
    if (imageData && imageData.length > 10000000) { // ~10MB limit
      return res.status(400).json({
        success: false,
        message: 'Image too large. Maximum size is 10MB.'
      });
    }

    console.log('Attempting to insert report:', {
      title: title.substring(0, 50),
      location,
      incident_date: parsedDate,
      severity: reportSeverity,
      imageLength: imageData ? imageData.length : 0
    });

    const result = await query(
      `INSERT INTO reports (title, description, location, incident_date, severity, jenis_insiden, image, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'belum_dicek')
       RETURNING 
         id,
         title,
         TO_CHAR(incident_date, 'DD Month YYYY') as date,
         description,
         severity,
         status,
         image`,
      [title, description, location, parsedDate, reportSeverity, jenis_insiden || null, imageData]
    );

    if (!result || !result.rows || result.rows.length === 0) {
      throw new Error('Failed to create report - no data returned');
    }

    // Format image untuk frontend (tambahkan data URL prefix jika ada)
    let imageUrl = null;
    if (result.rows[0].image) {
      // Jika image sudah ada prefix data:image, gunakan langsung
      // Jika tidak, tambahkan prefix (asumsi JPEG, bisa disesuaikan)
      if (result.rows[0].image.startsWith('data:image')) {
        imageUrl = result.rows[0].image;
      } else {
        imageUrl = `data:image/jpeg;base64,${result.rows[0].image}`;
      }
    }

    // Return in format expected by frontend
    res.status(201).json({
      id: result.rows[0].id,
      title: result.rows[0].title,
      date: result.rows[0].date,
      description: result.rows[0].description,
      severity: result.rows[0].severity,
      status: mapStatusToFrontend(result.rows[0].status),
      image: imageUrl
    });
  } catch (error) {
    console.error('❌ Error creating report:', error);
    console.error('Error code:', error.code);
    console.error('Error detail:', error.detail);
    console.error('Error hint:', error.hint);
    console.error('Error stack:', error.stack);
    
    // Handle specific database errors
    let statusCode = 500;
    let errorMessage = 'Error creating report';
    
    if (error.code === '23505') { // Unique violation
      statusCode = 400;
      errorMessage = 'Report with this data already exists';
    } else if (error.code === '23502') { // Not null violation
      statusCode = 400;
      errorMessage = 'Required field is missing';
    } else if (error.code === '23503') { // Foreign key violation
      statusCode = 400;
      errorMessage = 'Invalid reference data';
    } else if (error.code === '42P01') { // Table does not exist
      statusCode = 500;
      errorMessage = 'Database table not found. Please run database migrations.';
    } else if (error.code === '22001' || error.message?.includes('value too long')) { // String data too long
      statusCode = 400;
      errorMessage = 'Image data too large. Please run: npm run fix-image-column to update database schema.';
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      statusCode = 503;
      errorMessage = 'Database connection failed. Please check database service.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

// Get all reports
const getAllReports = async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        id,
        title,
        TO_CHAR(incident_date, 'DD Month YYYY') as date,
        description,
        severity,
        status,
        image,
        created_at
      FROM reports 
      ORDER BY created_at DESC`
    );

    // Map status untuk sesuai dengan frontend
    const reports = result.rows.map(report => {
      // Format image untuk frontend
      let imageUrl = null;
      if (report.image) {
        if (report.image.startsWith('data:image')) {
          imageUrl = report.image;
        } else {
          imageUrl = `data:image/jpeg;base64,${report.image}`;
        }
      }

      return {
        id: report.id,
        title: report.title,
        date: report.date,
        description: report.description,
        severity: report.severity,
        status: mapStatusToFrontend(report.status),
        image: imageUrl,
        status_db: report.status // Keep original for updates
      };
    });

    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message
    });
  }
};

// Get report by ID
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT 
        id,
        title,
        TO_CHAR(incident_date, 'DD Month YYYY') as date,
        description,
        severity,
        status,
        image,
        location,
        jenis_insiden,
        created_at
      FROM reports 
      WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    const report = result.rows[0];
    res.json({
      ...report,
      status: mapStatusToFrontend(report.status)
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report',
      error: error.message
    });
  }
};

// Update report (mainly for status)
const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Map frontend status to database status
    const dbStatus = mapStatusToDatabase(status);

    const result = await query(
      `UPDATE reports 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [dbStatus, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      message: 'Report updated successfully',
      data: {
        ...result.rows[0],
        status: mapStatusToFrontend(result.rows[0].status)
      }
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating report',
      error: error.message
    });
  }
};

// Delete report
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM reports WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting report',
      error: error.message
    });
  }
};

// Helper function to map database status to frontend status
const mapStatusToFrontend = (dbStatus) => {
  const statusMap = {
    'belum_dicek': 'belum_dicek',
    'belum_ditangani': 'belum_ditangani',
    'dalam_penangan': 'dalam_penangan',
    'aman': 'aman',
    'pending': 'belum_dicek',
    'under_review': 'dalam_penangan',
    'resolved': 'aman',
    'closed': 'aman'
  };
  return statusMap[dbStatus] || 'belum_dicek';
};

// Helper function to map frontend status to database status
const mapStatusToDatabase = (frontendStatus) => {
  const statusMap = {
    'belum_dicek': 'belum_dicek',
    'belum_ditangani': 'belum_ditangani',
    'dalam_penangan': 'dalam_penangan',
    'aman': 'aman'
  };
  return statusMap[frontendStatus] || 'belum_dicek';
};

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport
};

