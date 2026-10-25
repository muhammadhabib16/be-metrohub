// Semua "hari ini" dihitung dalam zona waktu kantor (WIB), bukan zona waktu server.
const ZONA_WAKTU = 'Asia/Jakarta';

const formatTanggal = new Intl.DateTimeFormat('en-CA', {
  timeZone: ZONA_WAKTU,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

// 'YYYY-MM-DD' untuk tanggal hari ini di WIB
function hariIni() {
  return formatTanggal.format(new Date());
}

// 'YYYY-MM' untuk bulan berjalan di WIB
function bulanIni() {
  return hariIni().slice(0, 7);
}

// Ubah 'YYYY-MM-DD' menjadi Date untuk kolom @db.Date
function keTanggalDb(tanggal) {
  return new Date(`${tanggal}T00:00:00.000Z`);
}

// Ubah Date dari kolom @db.Date menjadi 'YYYY-MM-DD'
function dariTanggalDb(date) {
  return date.toISOString().slice(0, 10);
}

// Rentang tanggal awal dan akhir bulan untuk 'YYYY-MM'
function rentangBulan(bulan) {
  const [tahun, nomorBulan] = bulan.split('-').map(Number);
  const awal = new Date(Date.UTC(tahun, nomorBulan - 1, 1));
  const akhir = new Date(Date.UTC(tahun, nomorBulan, 0));
  return { awal, akhir };
}

// Selisih hari antara dua tanggal 'YYYY-MM-DD' (b - a)
function selisihHari(a, b) {
  return Math.round((keTanggalDb(b) - keTanggalDb(a)) / 86_400_000);
}

module.exports = {
  ZONA_WAKTU,
  hariIni,
  bulanIni,
  keTanggalDb,
  dariTanggalDb,
  rentangBulan,
  selisihHari,
};
