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

async function seedAdmin(roleAdmin) {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@metrohub.local';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin12345';
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
  const roles = await seedRoles();
  await seedAdmin(roles[ROLES.ADMIN]);
  await seedOfficeSettings();
  console.log('Seed selesai.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
