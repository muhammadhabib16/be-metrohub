require('dotenv').config({ quiet: true });
const { z } = require('zod');

// Semua konfigurasi diambil dari environment variable (Aturan Portabilitas PRD).
// Jangan memakai variabel berawalan RAILWAY_.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET minimal 32 karakter'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  UPLOAD_DIR: z.string().default('./uploads'),
  APP_URL: z.url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Environment variable tidak valid:');
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

module.exports = parsed.data;
