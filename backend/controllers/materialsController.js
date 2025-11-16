const { query } = require('../config/database');

// Get all materials
const getAllMaterials = async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        id,
        title,
        category,
        description,
        content,
        created_at,
        updated_at
      FROM materials 
      ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching materials',
      error: error.message
    });
  }
};

// Get material by ID
const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT 
        id,
        title,
        category,
        description,
        content,
        created_at,
        updated_at
      FROM materials 
      WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching material:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching material',
      error: error.message
    });
  }
};

// Create new material
const createMaterial = async (req, res) => {
  try {
    const { title, category, description, content } = req.body;

    // Validation
    if (!title || !category || !description || !content) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (!['Safety', 'Kesehatan'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Category must be Safety or Kesehatan'
      });
    }

    const result = await query(
      `INSERT INTO materials (title, category, description, content)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, category, description, content]
    );

    res.status(201).json({
      success: true,
      message: 'Material created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating material:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating material',
      error: error.message
    });
  }
};

// Update material
const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, content } = req.body;

    const result = await query(
      `UPDATE materials 
       SET title = $1, category = $2, description = $3, content = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [title, category, description, content, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    res.json({
      success: true,
      message: 'Material updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating material:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating material',
      error: error.message
    });
  }
};

// Delete material
const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM materials WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    res.json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting material',
      error: error.message
    });
  }
};

module.exports = {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial
};

