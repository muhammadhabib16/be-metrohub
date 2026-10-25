// Registry modul. Menambah modul baru cukup dengan membuat foldernya
// lalu mendaftarkannya di sini; core dan modul lain tidak perlu diubah (NF-11).
//
// Setiap modul mengekspor:
//   key          - id modul, sama dengan awalan permission ('magang', 'keuangan')
//   name         - nama tampilan
//   basePath     - prefix route di bawah /api/v1
//   router       - Express Router milik modul
//   permissions  - [{ code, deskripsi }] untuk halaman hak akses
//   menus        - [{ group, label, path, permission }] untuk sidebar
//   getRingkasan - (opsional) async () => data kartu dashboard
module.exports = [
  require('./magang'),
  require('./keuangan'),
];
