const categoriesService = require('./categories.service');
const { ok, created } = require('../../../shared/utils/response');

async function list(req, res) {
  ok(res, await categoriesService.list(req.validated.query));
}

async function create(req, res) {
  created(res, await categoriesService.create(req.validated.body), 'Kategori berhasil ditambahkan');
}

async function update(req, res) {
  ok(res, await categoriesService.update(req.validated.params.id, req.validated.body), 'Kategori berhasil diubah');
}

async function remove(req, res) {
  await categoriesService.remove(req.validated.params.id);
  ok(res, null, 'Kategori berhasil dihapus');
}

module.exports = { list, create, update, remove };
