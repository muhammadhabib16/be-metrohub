const router = require('./magang.routes');
const menus = require('./menus');
const { permissionList } = require('./permissions');
const { getRingkasanMagang } = require('./ringkasan');

module.exports = {
  key: 'magang',
  name: 'Manajemen Magang',
  basePath: '/magang',
  router,
  permissions: permissionList,
  menus,
  getRingkasan: getRingkasanMagang,
};
