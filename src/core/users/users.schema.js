const { z } = require('zod');

const listQuery = z.object({
  q: z.string().trim().optional(),
  role_id: z.coerce.number().int().positive().optional(),
  aktif: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
});

const createSchema = z.object({
  nama: z.string().trim().min(1).max(100),
  email: z.email().max(150),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  role_id: z.number().int().positive(),
});

const updateSchema = createSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Tidak ada data yang diubah');

const statusSchema = z.object({
  aktif: z.boolean(),
});

module.exports = { listQuery, createSchema, updateSchema, statusSchema };
