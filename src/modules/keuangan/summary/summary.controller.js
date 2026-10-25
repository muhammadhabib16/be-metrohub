const summaryService = require('./summary.service');
const { ok } = require('../../../shared/utils/response');

async function getRingkasanBulan(req, res) {
  ok(res, await summaryService.getRingkasanBulan(req.validated.query.bulan));
}

module.exports = { getRingkasanBulan };
