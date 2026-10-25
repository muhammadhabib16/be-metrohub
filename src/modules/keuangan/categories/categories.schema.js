const { z } = require('zod');

const jenis = z.enum(['PEMASUKAN', 'PENGELUARAN']);

const listQuery = z.object({
  jenis: jenis.optional(),
  aktif: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
});

// KU-01
const createSchema = z.object({
  nama: z.string().trim().min(1).max(100),
  jenis,
});

const updateSchema = z
  .object({
    nama: z.string().trim().min(1).max(100),
    aktif: z.boolean(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Tidak ada data yang diubah');

module.exports = { listQuery, createSchema, updateSchema };
