const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const prisma = require('../../config/prisma');
const { AppError, notImplemented } = require('../../shared/utils/AppError');

// CR-01: login dengan email dan password
async function login(email, password) {
  const user = await prisma.coreUser.findUnique({
    where: { email },
    include: { role: true },
  });

  const valid = user && user.aktif && (await bcrypt.compare(password, user.password_hash));
  // Pesan sengaja tidak menyebut bagian mana yang salah (CR-01)
  if (!valid) throw new AppError(401, 'Email atau password salah');

  const token = jwt.sign({}, env.JWT_SECRET, {
    subject: String(user.id),
    expiresIn: env.JWT_EXPIRES_IN,
  });

  return {
    token,
    user: { id: user.id, nama: user.nama, email: user.email, role: user.role.nama },
  };
}

async function ubahPassword(userId, { password_lama, password_baru }) {
  // TODO (halaman Profil): cek password_lama dengan bcrypt.compare,
  // lalu simpan bcrypt.hash(password_baru, 10) ke core_users.password_hash
  throw notImplemented('Profil - ubah password');
}

module.exports = { login, ubahPassword };
