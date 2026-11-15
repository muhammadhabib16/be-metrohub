# Perbaikan backend kategori dan verifikasi temuan QA

Tanggal: 15 November 2026 (WIB).

Backend: branch `fix/ku-01-category-validation`, basis `61800cc`.
Lingkup hasil akhir: backend saja, sesuai arahan pengguna.

## Penyebab dan perubahan

Form kategori pada frontend yang terpasang mengirim `jenis: "pemasukan"` atau `"pengeluaran"`.
Schema backend semula hanya menerima `PEMASUKAN` dan `PENGELUARAN`, sehingga request ditolak
dengan HTTP 400 dan detail error pada field `jenis`. Payload yang sama telah direproduksi
terhadap schema lama dan schema hasil perbaikan.

- Backend menerima kedua format huruf tersebut dan menormalisasi jenis ke enum kapital sebelum
  mengakses Prisma. Aturan yang sama berlaku untuk kategori, transaksi, dan filter jenis.
  Nilai selain kedua jenis tersebut tetap ditolak.
- Status `aktif` pada kategori baru sekarang disimpan sesuai pilihan form; jika tidak dikirim,
  nilainya tetap `true`.
- Respons daftar, tambah, dan ubah kategori menyertakan `jumlah_transaksi`, yang dibutuhkan UI
  untuk menentukan apakah kategori dapat dihapus. Hitungan termasuk transaksi soft delete,
  sesuai proteksi riwayat pada backend.

Kontrak respons lama tetap tersedia. Tidak ada perubahan schema database atau migration baru.
Contoh request Postman dan dokumentasi OpenAPI/API ikut diperbarui.

## Hasil pengujian lokal

| Pemeriksaan | Hasil |
| --- | --- |
| `npm test` | 9/9 lulus, termasuk payload form, input tidak valid, dan kontrak OpenAPI |
| `npm run test:integration` | 19 skenario lulus; Node melaporkan 20 test termasuk parent |
| Koreksi absensi sesuai screenshot QA | HTTP 200; waktu WIB, detik check-in, keterangan, dan identitas admin benar |
| Akses seluruh endpoint keuangan sebagai anak magang | GET/POST/PATCH/DELETE kategori dan transaksi serta GET ringkasan mengembalikan HTTP 403 |
| Sintaks JS, JSON Postman, dan `git diff --check` | Lulus |

MySQL 8 berjalan sementara pada `127.0.0.1:3307` dengan database `metrohub_test_local`.
Migration yang sudah ada berhasil diterapkan pada database uji kosong. Database produksi tidak
dipakai untuk pengujian.

Pengujian mencakup kategori aktif/nonaktif, nama duplikat, filter jenis, perubahan nama pada
riwayat transaksi, proteksi penghapusan, jumlah penggunaan setelah soft delete, validasi nominal,
saldo berjalan, ringkasan bulanan, dashboard, dan penolakan akses anak magang.

Kegagalan koreksi absensi pada screenshot belum tereproduksi di backend lokal saat ini.
Ditambahkan regression test menggunakan absensi 13 November 2026, check-in 17:06:27 WIB,
dan koreksi check-out 19:00 WIB, dengan keterangan yang sama seperti screenshot. Backend
menyimpan check-out sebagai `2026-11-13T12:00:00.000Z`, mempertahankan detik check-in, dan
menyimpan keterangan serta nama admin. Perubahan keterangan saja tidak mengubah jam.
Jam terbalik, format waktu salah, keterangan kosong/tidak dikirim, dan akses anak magang
ditolak; request yang ditolak tidak mengubah data. Pengosongan checkout dengan `null` juga diuji.
Tidak ada perubahan kode produksi untuk koreksi absensi karena alur ini sudah lolos pengujian.

## Penggunaan dan batas verifikasi

Gunakan `be-metrohub-fix-keuangan.patch` untuk perubahan backend ini, atau gunakan checkout
backend pada branch di atas yang sudah memuat perubahan. File patch frontend dari pekerjaan
sebelumnya tidak termasuk lingkup hasil akhir ini. Backend tetap kompatibel dengan payload
kapital lama dan menerima payload kategori huruf kecil dari frontend yang terpasang.

Perubahan disiapkan pada branch perbaikan; belum digabung ke `main` atau dideploy.
Browser otomatis tidak tersedia dan kredensial admin web uji belum tersedia, sehingga tampilan
serta alur klik pada deployment Vercel belum diverifikasi. Akses HTTP langsung ke health dan
OpenAPI backend deployment mendapat HTTP 403, sehingga hasil lokal tidak membuktikan
kondisi deployment saat ini. Koleksi Postman diperbarui tetapi belum dijalankan melalui Postman/Newman
pada sesi ini; payload terkait telah diuji melalui HTTP dalam tes integrasi.

Temuan kamera dan warna notifikasi radius memerlukan perubahan di frontend. Backend sudah
menolak absensi on-site di luar radius; aturan ini diuji melalui HTTP. Fungsi JavaScript
`toggleCategoryStatus` yang tidak tersedia di frontend juga berada di luar lingkup backend:
backend telah menyediakan `PATCH /keuangan/categories/:id` dengan `{ "aktif": false }`.
