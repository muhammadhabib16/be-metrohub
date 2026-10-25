const logbooksService = require('./logbooks.service');
const { ok } = require('../../../shared/utils/response');

async function getHariIni(req, res) {
  ok(res, await logbooksService.getHariIni(req.user.id));
}

async function simpanHariIni(req, res) {
  ok(res, await logbooksService.simpanHariIni(req.user.id, req.validated.body.isi), 'Logbook berhasil disimpan');
}

async function riwayatSaya(req, res) {
  ok(res, await logbooksService.riwayatSaya(req.user.id, req.validated.query));
}

async function list(req, res) {
  ok(res, await logbooksService.list(req.validated.query));
}

module.exports = { getHariIni, simpanHariIni, riwayatSaya, list };
