const { PrismaClient } = require('@prisma/client');

// Satu instance PrismaClient untuk seluruh aplikasi.
const prisma = new PrismaClient();

module.exports = prisma;
