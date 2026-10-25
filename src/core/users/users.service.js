const prisma = require('../../config/prisma');
const { notImplemented } = require('../../shared/utils/AppError');

// Service ini juga dipakai modul lain (misalnya Magang saat MG-01 membuat akun anak magang).
// Jangan pernah mengembalikan password_hash ke luar service.

async function list(filter) {
  // TODO CR-02: daftar pengguna + nama role, filter q (nama/email), role_id, aktif
  throw notImplemented('CR-02');
}

async function getById(id) {
  // TODO CR-02
  throw notImplemented('CR-02');
}

// Parameter tx opsional agar bisa dipanggil di dalam prisma.$transaction milik modul lain
async function create(data, tx = prisma) {
  // TODO CR-02: email unik (error P2002 sudah dipetakan ke 409 oleh errorHandler),
  // hash password dengan bcrypt sebelum disimpan (NF-04)
  throw notImplemented('CR-02');
}

async function update(id, data) {
  // TODO CR-02: jika password diisi, hash ulang
  throw notImplemented('CR-02');
}

async function setStatus(id, aktif) {
  // TODO CR-02: akun nonaktif tidak bisa login (sudah dicek di auth.service & authenticate)
  throw notImplemented('CR-02');
}

module.exports = { list, getById, create, update, setStatus };
