const { KEUANGAN } = require('./permissions');

const GROUP = 'Manajemen Keuangan';

module.exports = [
  { group: GROUP, label: 'Transaksi', path: '/keuangan/transaksi', permission: KEUANGAN.KELOLA },
  { group: GROUP, label: 'Kategori', path: '/keuangan/kategori', permission: KEUANGAN.KELOLA },
  { group: GROUP, label: 'Ringkasan Keuangan', path: '/keuangan/ringkasan', permission: KEUANGAN.LIHAT },
];
