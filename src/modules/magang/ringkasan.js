const prisma = require('../../config/prisma');
const { hariIni, keTanggalDb } = require('../../shared/utils/date');

// Dipanggil dashboard core (CR-04). Hanya membaca tabel milik modul Magang
// (dan core_users, karena modul boleh bergantung pada core).
async function getRingkasanMagang() {
  const hari = keTanggalDb(hariIni());
  const anakMagangAktif = await prisma.mgIntern.count({
    where: {
      tanggal_mulai: { lte: hari },
      tanggal_selesai: { gte: hari },
      user: { aktif: true },
    },
  });
  return { anak_magang_aktif: anakMagangAktif };
}

module.exports = { getRingkasanMagang };
