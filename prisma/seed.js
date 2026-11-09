require('dotenv').config({ quiet: true });
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { ROLES, permissionList: corePermissions } = require('../src/core/permissions');
const { MAGANG, permissionList: magangPermissions } = require('../src/modules/magang/permissions');
const { permissionList: keuanganPermissions } = require('../src/modules/keuangan/permissions');

const prisma = new PrismaClient();

const semuaPermission = [...corePermissions, ...magangPermissions, ...keuanganPermissions].map((p) => p.code);

// Hak akses bawaan tahap 1 (lihat Matriks Hak Akses di PRD)
const HAK_AKSES = {
  [ROLES.ADMIN]: semuaPermission.filter((p) => p !== MAGANG.ABSEN),
  [ROLES.ANAK_MAGANG]: [MAGANG.ABSEN],
};

async function seedRoles() {
  const roles = {};
  for (const [nama, permissions] of Object.entries(HAK_AKSES)) {
    const role = await prisma.coreRole.upsert({ where: { nama }, create: { nama }, update: {} });
    await prisma.coreRolePermission.createMany({
      data: permissions.map((permission) => ({ role_id: role.id, permission })),
      skipDuplicates: true,
    });
    roles[nama] = role;
  }
  return roles;
}

// Kredensial admin pertama wajib dari environment, tidak ada nilai bawaan di kode.
// Dicek sebelum menyentuh database agar seed tidak berjalan setengah.
function bacaKredensialAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('SEED_ADMIN_EMAIL dan SEED_ADMIN_PASSWORD wajib diisi di .env sebelum menjalankan seed');
  }
  if (password.length < 8) {
    throw new Error('SEED_ADMIN_PASSWORD minimal 8 karakter');
  }
  return { email, password };
}

async function seedAdmin(roleAdmin, { email, password }) {
  await prisma.coreUser.upsert({
    where: { email },
    create: {
      nama: 'Administrator',
      email,
      password_hash: await bcrypt.hash(password, 10),
      role_id: roleAdmin.id,
    },
    update: {},
  });
  console.log(`Akun admin: ${email}`);
}

async function seedOfficeSettings() {
  // Koordinat placeholder. Titik kantor Metro Software masih pertanyaan terbuka di PRD,
  // ubah lewat menu Pengaturan > Lokasi Kantor (CR-05).
  await prisma.coreOfficeSetting.upsert({
    where: { id: 1 },
    create: { id: 1, latitude: 0, longitude: 0, radius_meter: 100 },
    update: {},
  });
}

async function main() {
  const kredensialAdmin = bacaKredensialAdmin();
  const roles = await seedRoles();
  await seedAdmin(roles[ROLES.ADMIN], kredensialAdmin);
  await seedOfficeSettings();
  console.log('Seed selesai.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
