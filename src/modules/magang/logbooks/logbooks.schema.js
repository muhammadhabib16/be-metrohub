const { z } = require('zod');
const { periodeQuery } = require('../../../shared/utils/commonSchemas');

// MG-04: logbook tidak boleh kosong
const isiSchema = z.object({
  isi: z.string().trim().min(1, 'Logbook tidak boleh kosong'),
});

const listQuery = periodeQuery.and(
  z.object({ intern_id: z.coerce.number().int().positive().optional() }),
);

module.exports = { isiSchema, periodeQuery, listQuery };
