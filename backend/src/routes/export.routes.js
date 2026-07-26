const express = require('express');
const router = express.Router();
const {
  getExportFiles,
  getAllExportFiles,
  readExportFile,
  readAnyExportFile,
  readExportSheet,
  downloadExportFile,
  downloadAnyExportFile,
  deleteExportFile,
} = require('../controllers/export.controller');
const { authenticate, requireReceptionist, requireAdmin } = require('../middleware/auth.middleware');

// ─── Receptionist Routes ───────────────────────────────────

// My exports
router.get('/', authenticate, requireReceptionist, getExportFiles);
router.get('/:filename', authenticate, requireReceptionist, readExportFile);
router.get('/:filename/sheets/:sheetName', authenticate, requireReceptionist, readExportSheet);
router.get('/:filename/download', authenticate, requireReceptionist, downloadExportFile);
router.delete('/:filename', authenticate, requireReceptionist, deleteExportFile);


// ─── Admin Routes ──────────────────────────────────────────

// All receptionists' exports
router.get('/admin/all', authenticate, requireAdmin, getAllExportFiles);
router.get('/admin/:receptionistId/:filename', authenticate, requireAdmin, readAnyExportFile);
router.get('/admin/:receptionistId/:filename/download', authenticate, requireAdmin, downloadAnyExportFile);

module.exports = router;