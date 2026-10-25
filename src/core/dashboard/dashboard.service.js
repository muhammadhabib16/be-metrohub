const modules = require('../../modules');

// CR-04: dashboard tidak menulis query ke tabel modul.
// Setiap modul menyediakan getRingkasan() sendiri, dan tiap modul tampil sebagai satu kartu.
async function getRingkasan() {
  const kartu = await Promise.all(
    modules
      .filter((m) => typeof m.getRingkasan === 'function')
      .map(async (m) => ({ modul: m.key, nama: m.name, data: await m.getRingkasan() })),
  );
  return { kartu };
}

module.exports = { getRingkasan };
