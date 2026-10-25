const router = require('./keuangan.routes');
const menus = require('./menus');
const { permissionList } = require('./permissions');
const { getRingkasanKeuangan } = require('./ringkasan');

module.exports = {
  key: 'keuangan',
  name: 'Manajemen Keuangan',
  basePath: '/keuangan',
  router,
  permissions: permissionList,
  menus,
  getRingkasan: getRingkasanKeuangan,
};
