const prisma = require('../../config/prisma');
const { AppError } = require('../../shared/utils/AppError');

const SETTING_ID = 1; // core_office_settings hanya berisi satu baris

// Dipakai juga oleh modul Magang untuk validasi radius absensi (BR-01)
async function get() {
  const setting = await prisma.coreOfficeSetting.findUnique({ where: { id: SETTING_ID } });
  if (!setting) throw new AppError(404, 'Lokasi kantor belum diatur');
  return {
    latitude: Number(setting.latitude),
    longitude: Number(setting.longitude),
    radius_meter: setting.radius_meter,
  };
}

// CR-05: perubahan berlaku untuk absensi berikutnya
async function update(data) {
  await prisma.coreOfficeSetting.upsert({
    where: { id: SETTING_ID },
    create: { id: SETTING_ID, ...data },
    update: data,
  });
  return get();
}

module.exports = { get, update };
