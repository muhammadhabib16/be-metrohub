const prisma = require('../../../config/prisma');
const { bulanIni, rentangBulan } = require('../../../shared/utils/date');
const { notImplemented } = require('../../../shared/utils/AppError');

// KU-05: total pemasukan, total pengeluaran, saldo, dan rincian per kategori untuk satu bulan.
// Contoh query total ada di ../ringkasan.js; rincian per kategori pakai groupBy category_id.
async function getRingkasanBulan(bulan = bulanIni()) {
  // TODO KU-05
  throw notImplemented('KU-05');
}

module.exports = { getRingkasanBulan };
