const modules = require('../../modules');
const coreMenus = require('../menus');

const GRUP_TERAKHIR = 'Pengaturan';

// Sidebar dibangun dari menu core + menu yang didaftarkan setiap modul,
// lalu disaring sesuai permission pengguna (CR-03).
// Urutan grup mengikuti urutan pendaftaran, kecuali "Pengaturan" selalu di paling bawah.
function getMenu(permissions) {
  const semuaMenu = [...coreMenus, ...modules.flatMap((m) => m.menus)];
  const grup = new Map();

  for (const menu of semuaMenu) {
    if (menu.permission && !permissions.includes(menu.permission)) continue;
    if (!grup.has(menu.group)) grup.set(menu.group, []);
    grup.get(menu.group).push({ label: menu.label, path: menu.path });
  }

  return [...grup]
    .map(([group, items]) => ({ group, items }))
    .sort((a, b) => (a.group === GRUP_TERAKHIR) - (b.group === GRUP_TERAKHIR));
}

module.exports = { getMenu };
