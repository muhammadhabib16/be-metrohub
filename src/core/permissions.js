// Kode permission milik core. Disimpan di core_role_permissions.permission
const CORE = {
  DASHBOARD: 'core:dashboard',
  PENGGUNA: 'core:pengguna',
  LOKASI: 'core:lokasi',
};

const permissionList = [
  { code: CORE.DASHBOARD, deskripsi: 'Melihat dashboard ringkasan perusahaan' },
  { code: CORE.PENGGUNA, deskripsi: 'Mengelola pengguna, role, dan hak akses' },
  { code: CORE.LOKASI, deskripsi: 'Mengatur titik koordinat dan radius kantor' },
];

const ROLES = {
  ADMIN: 'Admin',
  ANAK_MAGANG: 'Anak Magang',
  FINANCE: 'Finance',
  OPERASIONAL_MAGANG: 'Operasional Magang',
};

module.exports = { CORE, permissionList, ROLES };
