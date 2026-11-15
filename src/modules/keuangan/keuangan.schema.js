const { z } = require('zod');

// Form frontend memakai huruf kecil; Prisma tetap menyimpan enum huruf kapital.
const jenisTransaksi = z.enum(['PEMASUKAN', 'PENGELUARAN', 'pemasukan', 'pengeluaran'], {
  error: 'Jenis harus PEMASUKAN atau PENGELUARAN',
}).transform((value) => value.toUpperCase());

module.exports = { jenisTransaksi };
