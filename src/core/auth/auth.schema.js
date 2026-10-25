const { z } = require('zod');

const loginSchema = z.object({
  email: z.email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

const ubahPasswordSchema = z.object({
  password_lama: z.string().min(1),
  password_baru: z.string().min(8, 'Password baru minimal 8 karakter'),
});

module.exports = { loginSchema, ubahPasswordSchema };
