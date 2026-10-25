const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const multer = require('multer');
const env = require('../../config/env');
const { AppError } = require('../utils/AppError');

const EKSTENSI = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
const UKURAN_MAKS = 500 * 1024; // NF-07: maksimal 500 KB per foto

// Membuat middleware upload satu foto (field "foto") ke UPLOAD_DIR/<subfolder>.
// Folder upload tidak disajikan sebagai static file (NF-06).
function uploadPhoto(subfolder) {
  const tujuan = path.join(env.UPLOAD_DIR, subfolder);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      fs.mkdirSync(tujuan, { recursive: true });
      cb(null, tujuan);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${crypto.randomUUID()}${EKSTENSI[file.mimetype]}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: UKURAN_MAKS, files: 1 },
    fileFilter: (req, file, cb) => {
      if (!EKSTENSI[file.mimetype]) {
        return cb(new AppError(400, 'Foto harus berformat JPG, PNG, atau WEBP'));
      }
      cb(null, true);
    },
  }).single('foto');
}

module.exports = uploadPhoto;
