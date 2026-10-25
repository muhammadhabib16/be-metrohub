const env = require('../../config/env');

// NF-03: di production, akses HTTP dialihkan ke HTTPS.
// Bergantung pada header X-Forwarded-Proto dari proxy (app.set('trust proxy', 1)).
// Endpoint health dikecualikan agar healthcheck internal tetap bisa memakai HTTP.
function forceHttps(req, res, next) {
  if (env.NODE_ENV !== 'production' || req.secure || req.path === '/api/v1/health') {
    return next();
  }
  res.redirect(301, `https://${req.get('host')}${req.originalUrl}`);
}

module.exports = forceHttps;
