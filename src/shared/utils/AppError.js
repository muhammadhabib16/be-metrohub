class AppError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Dipakai di service yang belum dikerjakan, contoh: throw notImplemented('MG-03')
function notImplemented(kode) {
  return new AppError(501, `Belum diimplementasikan (${kode})`);
}

module.exports = { AppError, notImplemented };
