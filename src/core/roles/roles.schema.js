const { z } = require('zod');

const setPermissionsSchema = z.object({
  permissions: z.array(z.string().min(1).max(60)),
});

module.exports = { setPermissionsSchema };
