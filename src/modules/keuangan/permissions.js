const KEUANGAN = {
  KELOLA: 'keuangan:kelola',
  LIHAT: 'keuangan:lihat',
};

const permissionList = [
  { code: KEUANGAN.KELOLA, deskripsi: 'Mengelola kategori dan transaksi keuangan' },
  { code: KEUANGAN.LIHAT, deskripsi: 'Melihat ringkasan keuangan' },
];

module.exports = { KEUANGAN, permissionList };
