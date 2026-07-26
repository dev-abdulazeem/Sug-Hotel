const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const getReceptionistDir = (receptionistId) => {
  const dir = path.join(__dirname, '../../exports', receptionistId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

const getDayName = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

const getDailyFilePath = (receptionistId) => {
  const dir = getReceptionistDir(receptionistId);
  const dayName = getDayName();
  return path.join(dir, `${dayName}_Exports.xlsx`);
};

/**
 * Append data to the daily Excel file
 * If sheet exists, rows are APPENDED. If not, sheet is created.
 * @param {string} receptionistId 
 * @param {string} sheetName - e.g. "Bookings", "Reservations"
 * @param {Array} data - array of objects (rows to add)
 */
const appendToDailyExport = (receptionistId, sheetName, data) => {
  const filePath = getDailyFilePath(receptionistId);
  let workbook;

  if (fs.existsSync(filePath)) {
    workbook = xlsx.readFile(filePath);
  } else {
    workbook = xlsx.utils.book_new();
  }

  let worksheet;
  let existingData = [];

  // If sheet already exists, read existing data and append new rows
  if (workbook.SheetNames.includes(sheetName)) {
    worksheet = workbook.Sheets[sheetName];
    existingData = xlsx.utils.sheet_to_json(worksheet);
    existingData.push(...data);
    worksheet = xlsx.utils.json_to_sheet(existingData);
  } else {
    // Create new sheet with the data
    worksheet = xlsx.utils.json_to_sheet(data);
  }

  // Update or add the sheet
  workbook.Sheets[sheetName] = worksheet;

  // Ensure sheet name is in the list (add if new, keep position if existing)
  if (!workbook.SheetNames.includes(sheetName)) {
    workbook.SheetNames.push(sheetName);
  }

  xlsx.writeFile(workbook, filePath);

  return {
    filePath,
    sheetName,
    day: getDayName(),
    totalRows: existingData.length || data.length,
  };
};

/**
 * Get all daily files for a receptionist
 */
const getDailyFiles = (receptionistId) => {
  const dir = getReceptionistDir(receptionistId);
  if (!fs.existsSync(dir)) return [];
  
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('_Exports.xlsx'))
    .map(f => ({
      name: f,
      day: f.replace('_Exports.xlsx', ''),
      size: fs.statSync(path.join(dir, f)).size,
      modifiedAt: fs.statSync(path.join(dir, f)).mtime,
    }));
};

module.exports = {
  getDailyFilePath,
  appendToDailyExport,
  getDailyFiles,
  getDayName,
};