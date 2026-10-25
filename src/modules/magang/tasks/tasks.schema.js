const { z } = require('zod');
const { tanggal } = require('../../../shared/utils/commonSchemas');

const statusTugas = z.enum(['BELUM_DIKERJAKAN', 'DIKERJAKAN', 'SELESAI']);

const listQuery = z.object({
  intern_id: z.coerce.number().int().positive().optional(),
  status: statusTugas.optional(),
  terlambat: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
});

// MG-06
const createSchema = z.object({
  intern_id: z.number().int().positive(),
  judul: z.string().trim().min(1).max(150),
  deskripsi: z.string().trim().min(1),
  tenggat: tanggal,
});

const updateSchema = createSchema
  .omit({ intern_id: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Tidak ada data yang diubah');

// MG-07
const progressSchema = z.object({
  status: statusTugas,
  catatan_progres: z.string().trim().max(5000).optional(),
});

module.exports = { listQuery, createSchema, updateSchema, progressSchema };
