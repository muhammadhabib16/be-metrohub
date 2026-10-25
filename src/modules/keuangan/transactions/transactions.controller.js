const transactionsService = require('./transactions.service');
const { ok, created } = require('../../../shared/utils/response');

async function list(req, res) {
  ok(res, await transactionsService.list(req.validated.query));
}

async function create(req, res) {
  created(res, await transactionsService.create(req.validated.body, req.user.id), 'Transaksi berhasil dicatat');
}

async function update(req, res) {
  ok(res, await transactionsService.update(req.validated.params.id, req.validated.body), 'Transaksi berhasil diubah');
}

// Konfirmasi hapus (KU-03) dilakukan di frontend
async function remove(req, res) {
  await transactionsService.remove(req.validated.params.id);
  ok(res, null, 'Transaksi berhasil dihapus');
}

module.exports = { list, create, update, remove };
