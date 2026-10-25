const { AppError } = require('../utils/AppError');

// Lolos jika pengguna punya salah satu permission yang diminta (NF-05).
// Pakai setelah authenticate. Contoh: authorize(MAGANG.KELOLA)
function authorize(...permissions) {
  return (req, res, next) => {
    const dimiliki = req.user?.permissions ?? [];
    if (!permissions.some((p) => dimiliki.includes(p))) {
      throw new AppError(403, 'Anda tidak memiliki akses ke fitur ini');
    }
    next();
  };
}

module.exports = authorize;
