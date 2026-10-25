const { z } = require('zod');
const { latitude, longitude, periodeQuery } = require('../../../shared/utils/commonSchemas');

// Dikirim sebagai multipart/form-data bersama field "foto" (MG-03, MG-05).
// Koordinat berasal dari Geolocation API browser (BR-01, BR-02).
const lokasiSchema = z.object({ latitude, longitude });

// MG-09: rekap per anak magang dan per periode
const rekapQuery = periodeQuery.and(
  z.object({ intern_id: z.coerce.number().int().positive().optional() }),
);

// MG-10: koreksi absensi oleh admin, keterangan wajib
const koreksiSchema = z.object({
  jam_checkin: z.iso.datetime({ offset: true }).optional(),
  jam_checkout: z.iso.datetime({ offset: true }).nullable().optional(),
  keterangan_koreksi: z.string().trim().min(1, 'Keterangan koreksi wajib diisi'),
});

const fotoParam = z.object({
  filename: z.string().regex(/^[\w-]+\.(jpg|png|webp)$/, 'Nama file tidak valid'),
});

module.exports = { lokasiSchema, rekapQuery, periodeQuery, koreksiSchema, fotoParam };
