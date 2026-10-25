const prisma = require('../../../config/prisma');
const { keTanggalDb, rentangBulan } = require('../../../shared/utils/date');
const { notImplemented } = require('../../../shared/utils/AppError');

// KU-04: tabel debit-kredit dengan saldo berjalan, urut tanggal lalu id.
// Hanya transaksi dengan deleted_at = null (BR-09, BR-10).
// Saldo akhir harus sama dengan total pemasukan - total pengeluaran.
async function list(filter) {
  // TODO KU-04: jika filter dimulai di tengah, hitung saldo awal dari transaksi sebelum periode
  throw notImplemented('KU-04');
}

async function create(data, adminId) {
  // TODO KU-02: kategori harus aktif dan category.jenis === data.jenis; dibuat_oleh = adminId
  throw notImplemented('KU-02');
}

async function update(id, data) {
  // TODO KU-03: transaksi yang sudah dihapus tidak bisa diubah; cek ulang kecocokan jenis-kategori
  throw notImplemented('KU-03');
}

// KU-03 / BR-10: soft delete, isi deleted_at, jangan hapus baris
async function remove(id) {
  // TODO KU-03
  throw notImplemented('KU-03');
}

module.exports = { list, create, update, remove };
