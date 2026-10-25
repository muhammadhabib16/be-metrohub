const { z } = require('zod');
const { tanggal } = require('../../../shared/utils/commonSchemas');

const statusKerja = z.enum(['ONSITE', 'REMOTE']);

const listQuery = z.object({
  q: z.string().trim().optional(),
  status_kerja: statusKerja.optional(),
  aktif: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
});

const periodeValid = (d) => !d.tanggal_mulai || !d.tanggal_selesai || d.tanggal_selesai >= d.tanggal_mulai;
const pesanPeriode = {
  message: 'Tanggal selesai tidak boleh sebelum tanggal mulai',
  path: ['tanggal_selesai'],
};

// MG-01: menambah anak magang sekaligus membuat akun login
const internFields = z.object({
  nama: z.string().trim().min(1).max(100),
  email: z.email().max(150),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  asal_kampus: z.string().trim().min(1).max(150),
  tanggal_mulai: tanggal,
  tanggal_selesai: tanggal,
  status_kerja: statusKerja.default('ONSITE'),
});

const createSchema = internFields.refine(periodeValid, pesanPeriode);

const updateSchema = internFields
  .omit({ password: true, status_kerja: true })
  .partial()
  .refine(periodeValid, pesanPeriode);

// MG-02, BR-06
const statusKerjaSchema = z.object({ status_kerja: statusKerja });

module.exports = { listQuery, createSchema, updateSchema, statusKerjaSchema };
