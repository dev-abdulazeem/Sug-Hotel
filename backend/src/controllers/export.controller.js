const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const asyncHandler = require('../utils/asyncHandler');
const { getDailyFilePath, getDailyFiles } = require('../utils/dailyExportHelper');

// ─── Helpers ───────────────────────────────────────────────

const getAllReceptionistExports = () => {
  const exportsDir = path.join(__dirname, '../../exports');
  if (!fs.existsSync(exportsDir)) return [];

  const allFiles = [];
  const receptionistDirs = fs.readdirSync(exportsDir, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const dir of receptionistDirs) {
    const repId = dir.name;
    const repDir = path.join(exportsDir, repId);
    const files = fs.readdirSync(repDir)
      .filter(f => f.endsWith('_Exports.xlsx'))
      .map(f => ({
        name: f,
        receptionistId: repId,
        day: f.replace('_Exports.xlsx', ''),
        size: fs.statSync(path.join(repDir, f)).size,
        modifiedAt: fs.statSync(path.join(repDir, f)).mtime,
      }));
    allFiles.push(...files);
  }

  // Sort by modified date, newest first
  return allFiles.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));
};

// ─── Receptionist Routes ───────────────────────────────────

// Get my export files
const getExportFiles = asyncHandler(async (req, res) => {
  const files = getDailyFiles(req.user.id);
  res.json({ files });
});

// ─── Admin Routes ──────────────────────────────────────────

// Get ALL receptionists' export files
const getAllExportFiles = asyncHandler(async (req, res) => {
  const files = getAllReceptionistExports();
  res.json({ files });
});

// Admin: Read any receptionist's file
const readAnyExportFile = asyncHandler(async (req, res) => {
  const { receptionistId, filename } = req.params;
  const dir = path.join(__dirname, '../../exports', receptionistId);
  const filePath = path.join(dir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found.' });
  }

  const workbook = xlsx.readFile(filePath);
  const sheets = {};

  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    sheets[sheetName] = xlsx.utils.sheet_to_json(worksheet);
  });

  res.json({
    filename,
    receptionistId,
    day: filename.replace('_Exports.xlsx', ''),
    totalSheets: workbook.SheetNames.length,
    sheetNames: workbook.SheetNames,
    sheets,
  });
});

// Admin: Download any receptionist's file
const downloadAnyExportFile = asyncHandler(async (req, res) => {
  const { receptionistId, filename } = req.params;
  const filePath = path.join(__dirname, '../../exports', receptionistId, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found.' });
  }

  res.download(filePath, filename);
});

// ─── Shared Routes (both roles) ───────────────────────────

// Read my file (receptionist) — filename only
const readExportFile = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  const dir = path.join(__dirname, '../../exports', req.user.id);
  const filePath = path.join(dir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found.' });
  }

  const workbook = xlsx.readFile(filePath);
  const sheets = {};

  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    sheets[sheetName] = xlsx.utils.sheet_to_json(worksheet);
  });

  res.json({
    filename,
    day: filename.replace('_Exports.xlsx', ''),
    totalSheets: workbook.SheetNames.length,
    sheetNames: workbook.SheetNames,
    sheets,
  });
});

// Read a specific sheet from my file
const readExportSheet = asyncHandler(async (req, res) => {
  const { filename, sheetName } = req.params;
  const dir = path.join(__dirname, '../../exports', req.user.id);
  const filePath = path.join(dir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found.' });
  }

  const workbook = xlsx.readFile(filePath);
  
  if (!workbook.SheetNames.includes(sheetName)) {
    return res.status(404).json({ message: 'Sheet not found.' });
  }

  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);

  res.json({
    filename,
    sheetName,
    totalRows: data.length,
    columns: data.length > 0 ? Object.keys(data[0]) : [],
    data,
  });
});

// Download my file
const downloadExportFile = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  const dir = path.join(__dirname, '../../exports', req.user.id);
  const filePath = path.join(dir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found.' });
  }

  res.download(filePath, filename);
});

// Delete my file
const deleteExportFile = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  const dir = path.join(__dirname, '../../exports', req.user.id);
  const filePath = path.join(dir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found.' });
  }

  fs.unlinkSync(filePath);
  res.json({ message: 'File deleted.' });
});

module.exports = {
  getExportFiles,
  getAllExportFiles,
  readExportFile,
  readAnyExportFile,
  readExportSheet,
  downloadExportFile,
  downloadAnyExportFile,
  deleteExportFile,
};