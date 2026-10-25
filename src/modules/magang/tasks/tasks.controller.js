const tasksService = require('./tasks.service');
const { ok, created } = require('../../../shared/utils/response');

async function list(req, res) {
  ok(res, await tasksService.list(req.validated.query));
}

async function listSaya(req, res) {
  ok(res, await tasksService.listSaya(req.user.id));
}

async function create(req, res) {
  created(res, await tasksService.create(req.validated.body, req.user.id), 'Tugas berhasil dibuat');
}

async function update(req, res) {
  ok(res, await tasksService.update(req.validated.params.id, req.validated.body), 'Tugas berhasil diubah');
}

async function remove(req, res) {
  await tasksService.remove(req.validated.params.id);
  ok(res, null, 'Tugas berhasil dihapus');
}

async function updateProgress(req, res) {
  const data = await tasksService.updateProgress(req.validated.params.id, req.user.id, req.validated.body);
  ok(res, data, 'Progres tugas berhasil diperbarui');
}

module.exports = { list, listSaya, create, update, remove, updateProgress };
