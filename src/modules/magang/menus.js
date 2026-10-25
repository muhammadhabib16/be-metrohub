const { MAGANG } = require('./permissions');

const GROUP = 'Manajemen Magang';

module.exports = [
  // Anak magang
  { group: 'Dashboard', label: 'Dashboard Saya', path: '/dashboard-saya', permission: MAGANG.ABSEN },
  { group: GROUP, label: 'Absensi', path: '/magang/absensi-saya', permission: MAGANG.ABSEN },
  { group: GROUP, label: 'Logbook', path: '/magang/logbook-saya', permission: MAGANG.ABSEN },
  { group: GROUP, label: 'Tugas Saya', path: '/magang/tugas-saya', permission: MAGANG.ABSEN },

  // Admin
  { group: GROUP, label: 'Data Anak Magang', path: '/magang/anak-magang', permission: MAGANG.KELOLA },
  { group: GROUP, label: 'Absensi', path: '/magang/absensi', permission: MAGANG.KELOLA },
  { group: GROUP, label: 'Logbook', path: '/magang/logbook', permission: MAGANG.KELOLA },
  { group: GROUP, label: 'Penugasan', path: '/magang/penugasan', permission: MAGANG.KELOLA },
];
