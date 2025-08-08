import fsSync from 'fs';
import fs from 'fs/promises';
import multer from 'multer';
import path from 'path';
import xlsx from 'xlsx';
import { CustomError } from './errorHandler.js';

const UPLOAD_DIR = 'uploads/';

// Ensure upload directory exists
if (!fsSync.existsSync(UPLOAD_DIR)) {
  fsSync.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${file.fieldname}-${Date.now()}${ext}`;
    if (file.originalname.split(".")[1] != "xlsx") {
      return cb(new CustomError(400, 'Invalid file received. Only (.xlsx) types of files are allowed'), false);
    } 
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    cb(null, true);
  } else {
    cb(new CustomError(400, 'Invalid file received. Only (.xlsx) types of files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 }});

const excelDateToString = (serial) => {
  if (typeof serial !== 'number' || isNaN(serial)) return null;
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  const jsDate = new Date(excelEpoch.getTime() + serial * 86400 * 1000);
  if (isNaN(jsDate.getTime())) return null;

  const dd = String(jsDate.getUTCDate()).padStart(2, '0');
  const mm = String(jsDate.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = jsDate.getUTCFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

export const uploadAndParseXlsx = async (req, res, next) => {
  try {
    await new Promise((resolve, reject) => {
      upload.single('file')(req, res, (err) => {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return reject(new Error('File is too large. Max allowed size is 5 MB.'));
          }
          return reject(err);
        }
        if (!req.file) return reject(new Error('No file uploaded'));
        resolve();
      });
    });

    const filePath = req.file.path;

    // ✅ Check if file exists before doing anything
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    if (!fileExists) throw new Error('File not saved successfully');

    // ✅ Read and parse Excel
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: true });

    // Normalize data
    const parsedData = rawData.map((row) => ({
      date: excelDateToString(row.DATE) || "",
      meal: row.MEAL || "",
      price: row.PRICE || "",
    }));

    req.fileData = parsedData;

    // ✅ Schedule file deletion ONLY IF file exists
    setTimeout(async () => {
      await deleteFile(filePath);
    }, 1 * 10 * 1000);

    next();
  } catch (error) {
    console.error('Upload & parse error:', error.message);
    next(error);
  }
};

export const deleteFile = async (filePath) => {
  try {
    const stillExists = await fs.access(filePath).then(() => true).catch(() => false);
    if (stillExists) {
      await fs.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    }
  } catch (err) {
    console.error(`Failed to delete file: ${filePath}`, err.message);
  }
};