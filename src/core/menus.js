const { CORE } = require('./permissions');

// Menu sidebar milik core. permission: null berarti tampil untuk semua pengguna yang login.
module.exports = [
  { group: 'Dashboard', label: 'Dashboard', path: '/dashboard', permission: CORE.DASHBOARD },
  { group: 'Pengaturan', label: 'Pengguna dan Role', path: '/pengaturan/pengguna', permission: CORE.PENGGUNA },
  { group: 'Pengaturan', label: 'Lokasi Kantor', path: '/pengaturan/lokasi', permission: CORE.LOKASI },
  { group: 'Pengaturan', label: 'Profil', path: '/profil', permission: null },
];
