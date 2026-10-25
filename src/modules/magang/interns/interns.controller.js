const internsService = require('./interns.service');
const { ok, created } = require('../../../shared/utils/response');

async function list(req, res) {
  ok(res, await internsService.list(req.validated.query));
}

async function getById(req, res) {
  ok(res, await internsService.getById(req.validated.params.id));
}

async function getProfilSaya(req, res) {
  ok(res, await internsService.getProfilSaya(req.user.id));
}

async function create(req, res) {
  created(res, await internsService.create(req.validated.body), 'Anak magang berhasil ditambahkan');
}

async function update(req, res) {
  ok(res, await internsService.update(req.validated.params.id, req.validated.body), 'Data anak magang berhasil diubah');
}

async function setStatusKerja(req, res) {
  const { id } = req.validated.params;
  ok(res, await internsService.setStatusKerja(id, req.validated.body.status_kerja), 'Status kerja berhasil diubah');
}

module.exports = { list, getById, getProfilSaya, create, update, setStatusKerja };
