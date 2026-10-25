const fs = require('node:fs');
const multer = require('multer');
const { ZodError } = require('zod');
const { Prisma } = require('@prisma/client');
const { AppError } = require('../utils/AppError');

function petakanError(err) {
  if (err instanceof AppError) {
    return { status: err.statusCode, message: err.message, details: err.details };
  }
  if (err instanceof ZodError) {
    return {
      status: 400,
      message: 'Data yang dikirim tidak valid',
      details: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    };
  }
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'Ukuran foto maksimal 500 KB' : 'Upload foto gagal';
    return { status: err.code === 'LIMIT_FILE_SIZE' ? 413 : 400, message };
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') return { status: 409, message: 'Data sudah ada' };
    if (err.code === 'P2025') return { status: 404, message: 'Data tidak ditemukan' };
    if (err.code === 'P2003') return { status: 409, message: 'Data masih dipakai data lain' };
  }
  if (err.type === 'entity.parse.failed') {
    return { status: 400, message: 'Format JSON tidak valid' };
  }
  return null;
}

// Error handler terakhir. Express 5 meneruskan error dari handler async ke sini secara otomatis.
function errorHandler(err, req, res, next) {
  // Foto yang sudah terunggah dihapus kalau request gagal, agar tidak menumpuk.
  if (req.file?.path) fs.unlink(req.file.path, () => {});

  const hasil = petakanError(err);
  if (!hasil) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }

  res.status(hasil.status).json({
    success: false,
    message: hasil.message,
    ...(hasil.details && { details: hasil.details }),
  });
}

module.exports = errorHandler;
