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

// Nama role bawaan tahap 1
const ROLES = {
  ADMIN: 'Admin',
  ANAK_MAGANG: 'Anak Magang',
};

module.exports = { CORE, permissionList, ROLES };
