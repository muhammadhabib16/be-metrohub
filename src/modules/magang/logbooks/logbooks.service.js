const prisma = require('../../../config/prisma');
const internsService = require('../interns/interns.service');
const { hariIni, keTanggalDb } = require('../../../shared/utils/date');
const { notImplemented } = require('../../../shared/utils/AppError');

async function getHariIni(userId) {
  // TODO MG-04: logbook hari ini milik pengguna (null jika belum ada)
  throw notImplemented('MG-04');
}

// MG-04: upsert berdasarkan (intern_id, tanggal hari ini)
async function simpanHariIni(userId, isi) {
  // TODO MG-04: tolak jika belum check-in hari ini,
  // dan tolak perubahan jika sudah check-out
  throw notImplemented('MG-04');
}

async function riwayatSaya(userId, periode) {
  // TODO MG-04
  throw notImplemented('MG-04');
}

// MG-09: semua logbook, filter intern_id dan periode
async function list(filter) {
  // TODO MG-09
  throw notImplemented('MG-09');
}

module.exports = { getHariIni, simpanHariIni, riwayatSaya, list };
