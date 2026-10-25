const fs = require('node:fs');
const env = require('./config/env');
const prisma = require('./config/prisma');
const app = require('./app');

fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });

const server = app.listen(env.PORT, () => {
  console.log(`MetroHub API berjalan di port ${env.PORT} (${env.NODE_ENV})`);
});

async function shutdown(signal) {
  console.log(`${signal} diterima, mematikan server...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
