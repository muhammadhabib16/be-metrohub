const prisma = require('../../../config/prisma');
const { notImplemented } = require('../../../shared/utils/AppError');

async function list(filter) {
  // TODO KU-01: filter jenis dan aktif
  throw notImplemented('KU-01');
}

async function create(data) {
  // TODO KU-01: (nama, jenis) unik -> P2002 sudah dipetakan ke 409
  throw notImplemented('KU-01');
}

// Jenis kategori sengaja tidak bisa diubah agar transaksi lama tetap konsisten
async function update(id, data) {
  // TODO KU-01
  throw notImplemented('KU-01');
}

async function remove(id) {
  // TODO KU-01: jika sudah dipakai transaksi (termasuk yang soft delete) tolak dengan 409
  // dan arahkan untuk menonaktifkan (aktif = false)
  throw notImplemented('KU-01');
}

module.exports = { list, create, update, remove };
