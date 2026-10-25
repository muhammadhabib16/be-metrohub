const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const prisma = require('../../config/prisma');
const { AppError } = require('../utils/AppError');

// Token dibaca dari cookie httpOnly "token", atau header Authorization: Bearer <token>
function ambilToken(req) {
  if (req.cookies?.token) return req.cookies.token;
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);
  return null;
}

// Memastikan request berasal dari pengguna yang login dan akunnya masih aktif.
// User dan permission dibaca ulang dari database setiap request, sehingga
// akun yang dinonaktifkan (CR-02) atau hak akses yang diubah (CR-03) langsung berlaku.
async function authenticate(req, res, next) {
  const token = ambilToken(req);
  if (!token) throw new AppError(401, 'Silakan login terlebih dahulu');

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw new AppError(401, 'Sesi tidak valid atau sudah berakhir');
  }

  const user = await prisma.coreUser.findUnique({
    where: { id: Number(payload.sub) },
    include: { role: { include: { permissions: true } } },
  });

  if (!user || !user.aktif) throw new AppError(401, 'Sesi tidak valid atau sudah berakhir');

  req.user = {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role.nama,
    permissions: user.role.permissions.map((p) => p.permission),
  };
  next();
}

module.exports = authenticate;
