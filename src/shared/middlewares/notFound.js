const { AppError } = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError(404, `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`));
}

module.exports = notFound;
