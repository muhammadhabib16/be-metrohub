const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { z } = require('zod');
const swaggerUi = require('swagger-ui-express');

const coreRouter = require('./core');
const modules = require('./modules');
const forceHttps = require('./shared/middlewares/forceHttps');
const notFound = require('./shared/middlewares/notFound');
const errorHandler = require('./shared/middlewares/errorHandler');
const openapi = require('./docs/openapi');

// Pesan error validasi bawaan Zod dalam Bahasa Indonesia
z.config(z.locales.id());

const app = express();

// Railway (dan reverse proxy di VPS) meneruskan request lewat proxy
app.set('trust proxy', 1);

app.use(forceHttps);
app.use(
  helmet({
    // blob: dibutuhkan untuk pratinjau foto kamera di frontend.
    // frame-src: peta embed Google Maps di halaman Lokasi Kantor.
    contentSecurityPolicy: {
      directives: {
        'img-src': ["'self'", 'data:', 'blob:'],
        'frame-src': ["'self'", 'https://maps.google.com', 'https://www.google.com'],
      },
    },
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const api = express.Router();

api.get('/health', (req, res) => res.json({ success: true, message: 'OK' }));
api.get('/docs.json', (req, res) => res.json(openapi));
api.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi, { customSiteTitle: 'MetroHub API Docs' }));
api.use(coreRouter);
for (const mod of modules) {
  api.use(mod.basePath, mod.router);
}
api.use(notFound);

app.use('/api/v1', api);

const publicDir = path.join(__dirname, '..', 'public');
const indexHtml = path.join(publicDir, 'index.html');

app.use(express.static(publicDir));
// Fallback SPA: semua route non-API diarahkan ke index.html agar React Router yang menangani
app.get('/{*splat}', (req, res, next) => {
  if (!fs.existsSync(indexHtml)) return next();
  res.sendFile(indexHtml);
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
