const dashboardService = require('./dashboard.service');
const { ok } = require('../../shared/utils/response');

async function getRingkasan(req, res) {
  ok(res, await dashboardService.getRingkasan());
}

module.exports = { getRingkasan };
