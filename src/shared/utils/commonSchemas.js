const { z } = require('zod');

// Schema Zod yang dipakai berulang di banyak modul
const idParam = z.object({
  id: z.coerce.number().int().positive(),
});

const tanggal = z.iso.date({ error: 'Format tanggal harus YYYY-MM-DD' });

const bulan = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Format bulan harus YYYY-MM');

const latitude = z.coerce.number().min(-90).max(90);
const longitude = z.coerce.number().min(-180).max(180);

// Filter periode untuk rekap: ?dari=YYYY-MM-DD&sampai=YYYY-MM-DD
const periodeQuery = z
  .object({
    dari: tanggal.optional(),
    sampai: tanggal.optional(),
  })
  .refine((q) => !q.dari || !q.sampai || q.dari <= q.sampai, {
    message: 'Tanggal "dari" tidak boleh setelah "sampai"',
    path: ['sampai'],
  });

module.exports = { idParam, tanggal, bulan, latitude, longitude, periodeQuery };
