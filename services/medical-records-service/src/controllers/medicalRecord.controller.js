const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

/**
 * Get all medical records for a patient
 */
exports.getPatientRecords = async (req, res, next) => {
  const patientId = parseInt(req.params.patientId);
  
  try {
    const result = await req.db.query(
      'SELECT * FROM medical_records WHERE patient_id = $1 ORDER BY created_at DESC',
      [patientId]
    );
    
    return res.status(200).json(result.rows);
  } catch (err) {
    logger.error(`Error getting medical records for patient ${patientId}:`, err);
    next(err);
  }
};

/**
 * Get a specific medical record by ID
 */
exports.getRecordById = async (req, res, next) => {
  const recordId = parseInt(req.params.id);
  
  try {
    // Get the medical record
    const recordResult = await req.db.query(
      'SELECT * FROM medical_records WHERE id = $1',
      [recordId]
    );
    
    if (recordResult.rows.length === 0) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    const record = recordResult.rows[0];
    
    // Get any attachments for this record
    const attachmentsResult = await req.db.query(
      'SELECT id, filename, mime_type, created_at FROM attachments WHERE record_id = $1',
      [recordId]
    );
    
    record.attachments = attachmentsResult.rows;
    
    return res.status(200).json(record);
  } catch (err) {
    logger.error(`Error getting medical record ${recordId}:`, err);
    next(err);
  }
};

/**
 * Get medical records by type for a patient
 */
exports.getRecordsByType = async (req, res, next) => {
  const patientId = parseInt(req.params.patientId);
  const recordType = req.params.type;
  
  try {
    const result = await req.db.query(
      'SELECT * FROM medical_records WHERE patient_id = $1 AND record_type = $2 ORDER BY created_at DESC',
      [patientId, recordType]
    );
    
    return res.status(200).json(result.rows);
  } catch (err) {
    logger.error(`Error getting ${recordType} records for patient ${patientId}:`, err);
    next(err);
  }
};

/**
 * Get recent medical records for a patient
 */
exports.getRecentRecords = async (req, res, next) => {
  const patientId = parseInt(req.params.patientId);
  const limit = parseInt(req.query.limit) || 5;
  
  try {
    const result = await req.db.query(
      'SELECT * FROM medical_records WHERE patient_id = $1 ORDER BY created_at DESC LIMIT $2',
      [patientId, limit]
    );
    
    return res.status(200).json(result.rows);
  } catch (err) {
    logger.error(`Error getting recent records for patient ${patientId}:`, err);
    next(err);
  }
};

/**
 * Create a new medical record
 */
exports.createRecord = async (req, res, next) => {
  const { patientId, doctorId, recordType, title, description, notes } = req.body;
  
  try {
    const result = await req.db.query(
      `INSERT INTO medical_records 
       (patient_id, doctor_id, record_type, title, description, notes, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
       RETURNING *`,
      [patientId, doctorId, recordType, title, description, notes]
    );
    
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error('Error creating medical record:', err);
    next(err);
  }
};

/**
 * Update a medical record
 */
exports.updateRecord = async (req, res, next) => {
  const recordId = parseInt(req.params.id);
  const { title, description, notes } = req.body;
  
  try {
    const result = await req.db.query(
      `UPDATE medical_records 
       SET title = $1, description = $2, notes = $3, updated_at = NOW() 
       WHERE id = $4 
       RETURNING *`,
      [title, description, notes, recordId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    logger.error(`Error updating medical record ${recordId}:`, err);
    next(err);
  }
};

/**
 * Add an attachment to a medical record
 */
exports.addAttachment = async (req, res, next) => {
  const recordId = parseInt(req.params.id);
  
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  try {
    // Verify the medical record exists
    const recordResult = await req.db.query(
      'SELECT id FROM medical_records WHERE id = $1',
      [recordId]
    );
    
    if (recordResult.rows.length === 0) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    // Store file metadata in the database
    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;
    const fileId = uuidv4();
    const filePath = req.file.path || path.join(process.env.STORAGE_PATH, fileId);
    
    const result = await req.db.query(
      `INSERT INTO attachments 
       (record_id, filename, mime_type, file_path, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING id, filename, mime_type, created_at`,
      [recordId, fileName, mimeType, filePath]
    );
    
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error(`Error adding attachment to medical record ${recordId}:`, err);
    next(err);
  }
};

/**
 * Download an attachment
 */
exports.downloadAttachment = async (req, res, next) => {
  const recordId = parseInt(req.params.id);
  const attachmentId = parseInt(req.params.attachmentId);
  
  try {
    // Get attachment metadata
    const result = await req.db.query(
      'SELECT * FROM attachments WHERE id = $1 AND record_id = $2',
      [attachmentId, recordId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Attachment not found' });
    }
    
    const attachment = result.rows[0];
    
    // Serve the file
    if (process.env.STORAGE_LOCAL === 'true') {
      // For local file storage
      const filePath = attachment.file_path;
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found on server' });
      }
      
      res.setHeader('Content-Disposition', `attachment; filename=${attachment.filename}`);
      res.setHeader('Content-Type', attachment.mime_type);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      // For cloud storage (implementation would depend on the cloud provider)
      return res.status(501).json({ message: 'Cloud storage not implemented yet' });
    }
  } catch (err) {
    logger.error(`Error downloading attachment ${attachmentId} for record ${recordId}:`, err);
    next(err);
  }
};

/**
 * Delete a medical record
 */
exports.deleteRecord = async (req, res, next) => {
  const recordId = parseInt(req.params.id);
  
  try {
    // Get all attachments for this record
    const attachmentsResult = await req.db.query(
      'SELECT id, file_path FROM attachments WHERE record_id = $1',
      [recordId]
    );
    
    // Start a database transaction
    await req.db.query('BEGIN');
    
    // Delete all attachments first
    for (const attachment of attachmentsResult.rows) {
      // Delete the file if using local storage
      if (process.env.STORAGE_LOCAL === 'true' && attachment.file_path) {
        if (fs.existsSync(attachment.file_path)) {
          fs.unlinkSync(attachment.file_path);
        }
      }
      
      // Delete the attachment record
      await req.db.query('DELETE FROM attachments WHERE id = $1', [attachment.id]);
    }
    
    // Then delete the medical record
    const result = await req.db.query(
      'DELETE FROM medical_records WHERE id = $1 RETURNING id',
      [recordId]
    );
    
    if (result.rows.length === 0) {
      await req.db.query('ROLLBACK');
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    // Commit the transaction
    await req.db.query('COMMIT');
    
    return res.status(200).json({ message: 'Medical record deleted successfully' });
  } catch (err) {
    await req.db.query('ROLLBACK');
    logger.error(`Error deleting medical record ${recordId}:`, err);
    next(err);
  }
}; 