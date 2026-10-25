const path = require('node:path');
const env = require('../../../config/env');
const prisma = require('../../../config/prisma');
const internsService = require('../interns/interns.service');
const officeSettingsService = require('../../../core/office-settings/officeSettings.service');
const { hitungJarakMeter } = require('../../../shared/utils/geo');
const { hariIni, keTanggalDb } = require('../../../shared/utils/date');
const { notImplemented } = require('../../../shared/utils/AppError');

const FOTO_DIR = 'attendances'; // subfolder di dalam UPLOAD_DIR
const FOTO_ROOT = path.resolve(env.UPLOAD_DIR, FOTO_DIR);

// Status absensi hari ini untuk mengunci/membuka tombol di frontend:
// sudah check-in? logbook tersimpan? sudah check-out?
async function getHariIni(userId) {
  // TODO MG-03/MG-05
  throw notImplemented('MG-03');
}

// MG-03. foto = req.file dari multer (nama file yang disimpan ke DB: foto.filename)
async function checkIn(userId, { latitude, longitude }, foto) {
  // TODO MG-03, aturan di backend (bukan hanya di tampilan):
  //   - foto wajib ada (BR-03)
  //   - tanggal_selesai magang belum lewat (BR-07)
  //   - belum ada absensi hari ini untuk intern ini (BR-04, unique intern_id+tanggal)
  //   - ONSITE: jarak = hitungJarakMeter(lokasi, kantor) <= radius_meter (BR-01),
  //     jika ditolak sertakan jarak ke kantor di pesan error
  //   - REMOTE: lokasi tetap dicatat (BR-02)
  //   - simpan jarak_checkin_meter
  throw notImplemented('MG-03');
}

// MG-05
async function checkOut(userId, { latitude, longitude }, foto) {
  // TODO MG-05: sudah check-in, belum check-out (BR-04),
  // logbook hari ini sudah tersimpan (BR-05), radius sama dengan check-in (BR-01)
  throw notImplemented('MG-05');
}

async function riwayatSaya(userId, periode) {
  // TODO MG-09 (versi anak magang)
  throw notImplemented('MG-09');
}

// MG-09: jam, foto, lokasi; hari tanpa check-out ditandai (jam_checkout null & tanggal < hari ini)
async function rekap(filter) {
  // TODO MG-09
  throw notImplemented('MG-09');
}

// MG-10: simpan keterangan_koreksi dan dikoreksi_oleh = adminId
async function koreksi(id, data, adminId) {
  // TODO MG-10
  throw notImplemented('MG-10');
}

// NF-06: foto hanya bisa diakses lewat endpoint admin ini, bukan static file
function pathFoto(filename) {
  return { root: FOTO_ROOT, filename };
}

module.exports = { FOTO_DIR, getHariIni, checkIn, checkOut, riwayatSaya, rekap, koreksi, pathFoto };
