const prisma = require('../../config/prisma');
const modules = require('../../modules');
const { permissionList: corePermissions } = require('../permissions');
const { notImplemented } = require('../../shared/utils/AppError');

async function list() {
  // TODO CR-03: daftar role beserta jumlah pengguna
  throw notImplemented('CR-03');
}

// Semua permission yang tersedia = milik core + yang didaftarkan setiap modul
function daftarPermission() {
  return [
    { modul: 'core', permissions: corePermissions },
    ...modules.map((m) => ({ modul: m.key, permissions: m.permissions })),
  ];
}

async function getPermissions(roleId) {
  // TODO CR-03: ambil core_role_permissions milik role
  throw notImplemented('CR-03');
}

async function setPermissions(roleId, permissions) {
  // TODO CR-03: tolak kode yang tidak ada di daftarPermission(),
  // lalu ganti isi core_role_permissions dalam satu prisma.$transaction
  throw notImplemented('CR-03');
}

module.exports = { list, daftarPermission, getPermissions, setPermissions };
