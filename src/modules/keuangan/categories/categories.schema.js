const { z } = require('zod');
const { jenisTransaksi: jenis } = require('../keuangan.schema');

const listQuery = z.object({
  jenis: jenis.optional(),
  aktif: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
});

const createSchema = z.object({
  nama: z.string().trim().min(1, 'Nama kategori wajib diisi').max(100),
  jenis,
  aktif: z.boolean().default(true),
});

const updateSchema = z
  .object({
    nama: z.string().trim().min(1, 'Nama kategori wajib diisi').max(100),
    aktif: z.boolean(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Tidak ada data yang diubah');

module.exports = { listQuery, createSchema, updateSchema };
