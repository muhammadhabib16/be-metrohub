const { z } = require('zod');
const { latitude, longitude } = require('../../shared/utils/commonSchemas');

// CR-05: radius dalam meter
const updateSchema = z.object({
  latitude,
  longitude,
  radius_meter: z.number().int().positive().max(10_000),
});

module.exports = { updateSchema };
