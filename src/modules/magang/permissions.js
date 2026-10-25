const MAGANG = {
  KELOLA: 'magang:kelola',
  ABSEN: 'magang:absen',
};

const permissionList = [
  {
    code: MAGANG.KELOLA,
    deskripsi: 'Mengelola anak magang, status kerja, penugasan, rekap, dan koreksi absensi',
  },
  {
    code: MAGANG.ABSEN,
    deskripsi: 'Check-in/check-out, mengisi logbook, dan memperbarui tugas sendiri',
  },
];

module.exports = { MAGANG, permissionList };
