const attendancesService = require('./attendances.service');
const { ok, created } = require('../../../shared/utils/response');

async function getHariIni(req, res) {
  ok(res, await attendancesService.getHariIni(req.user.id));
}

async function checkIn(req, res) {
  const data = await attendancesService.checkIn(req.user.id, req.validated.body, req.file);
  created(res, data, 'Check-in berhasil');
}

async function checkOut(req, res) {
  const data = await attendancesService.checkOut(req.user.id, req.validated.body, req.file);
  ok(res, data, 'Check-out berhasil');
}

async function riwayatSaya(req, res) {
  ok(res, await attendancesService.riwayatSaya(req.user.id, req.validated.query));
}

async function rekap(req, res) {
  ok(res, await attendancesService.rekap(req.validated.query));
}

async function koreksi(req, res) {
  const data = await attendancesService.koreksi(req.validated.params.id, req.validated.body, req.user.id);
  ok(res, data, 'Absensi berhasil dikoreksi');
}

async function getFoto(req, res) {
  const { root, filename } = attendancesService.pathFoto(req.validated.params.filename);
  res.sendFile(filename, { root, headers: { 'Cache-Control': 'private, max-age=3600' } });
}

module.exports = { getHariIni, checkIn, checkOut, riwayatSaya, rekap, koreksi, getFoto };
