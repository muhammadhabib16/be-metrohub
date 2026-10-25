const { z } = require('zod');
const { bulan } = require('../../../shared/utils/commonSchemas');

// KU-05: ?bulan=YYYY-MM, default bulan berjalan (diisi di service)
const summaryQuery = z.object({
  bulan: bulan.optional(),
});

module.exports = { summaryQuery };
