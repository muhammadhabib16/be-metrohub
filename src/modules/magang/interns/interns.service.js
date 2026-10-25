const prisma = require('../../../config/prisma');
const usersService = require('../../../core/users/users.service');
const { AppError, notImplemented } = require('../../../shared/utils/AppError');

// Data magang milik pengguna yang sedang login. Dipakai fitur absensi, logbook, dan tugas.
async function getByUserId(userId) {
  const intern = await prisma.mgIntern.findUnique({ where: { user_id: userId } });
  if (!intern) throw new AppError(404, 'Data anak magang untuk akun ini tidak ditemukan');
  return intern;
}

async function list(filter) {
  // TODO MG-01: daftar anak magang + nama/email dari relasi user, filter q, status_kerja, aktif
  throw notImplemented('MG-01');
}

async function getById(id) {
  // TODO MG-01
  throw notImplemented('MG-01');
}

// MG-08: profil sendiri + sisa hari masa magang (pakai selisihHari dari shared/utils/date)
async function getProfilSaya(userId) {
  // TODO MG-08
  throw notImplemented('MG-08');
}

async function create(data) {
  // TODO MG-01: dalam satu prisma.$transaction:
  //   1. buat akun lewat usersService.create({ ..., role_id: role Anak Magang }, tx)
  //   2. buat mg_interns dengan user_id akun tersebut
  // Modul tidak menulis core_users langsung, selalu lewat usersService.
  throw notImplemented('MG-01');
}

async function update(id, data) {
  // TODO MG-01: nama/email diubah lewat usersService.update
  throw notImplemented('MG-01');
}

// MG-02 / BR-06: hanya admin (route sudah dibatasi permission magang:kelola)
async function setStatusKerja(id, statusKerja) {
  // TODO MG-02
  throw notImplemented('MG-02');
}

module.exports = { getByUserId, list, getById, getProfilSaya, create, update, setStatusKerja };
