const officeSettingsService = require('./officeSettings.service');
const { ok } = require('../../shared/utils/response');

async function get(req, res) {
  ok(res, await officeSettingsService.get());
}

async function update(req, res) {
  ok(res, await officeSettingsService.update(req.validated.body), 'Lokasi kantor berhasil disimpan');
}

module.exports = { get, update };
