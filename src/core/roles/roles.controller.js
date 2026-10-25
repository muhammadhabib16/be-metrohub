const rolesService = require('./roles.service');
const { ok } = require('../../shared/utils/response');

async function list(req, res) {
  ok(res, await rolesService.list());
}

async function daftarPermission(req, res) {
  ok(res, rolesService.daftarPermission());
}

async function getPermissions(req, res) {
  ok(res, await rolesService.getPermissions(req.validated.params.id));
}

async function setPermissions(req, res) {
  const { id } = req.validated.params;
  ok(res, await rolesService.setPermissions(id, req.validated.body.permissions), 'Hak akses berhasil disimpan');
}

module.exports = { list, daftarPermission, getPermissions, setPermissions };
