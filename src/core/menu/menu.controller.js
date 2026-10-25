const menuService = require('./menu.service');
const { ok } = require('../../shared/utils/response');

async function getMenu(req, res) {
  ok(res, menuService.getMenu(req.user.permissions));
}

module.exports = { getMenu };
