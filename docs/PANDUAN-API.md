# Panduan Mengakses API MetroHub

Untuk tim frontend dan QA. Berisi cara mengakses REST API backend MetroHub, cara login,
format data, dan contoh pemakaian setiap fitur.

Rincian lengkap setiap endpoint (parameter, body, respons, kode error) ada di **Swagger**.
Dokumen ini menjelaskan hal-hal yang tidak terlihat di Swagger: alur, aturan, dan contoh kode.

## 1. Alamat

| Lingkungan | Base URL API | Swagger |
|---|---|---|
| Lokal (backend dijalankan sendiri) | `http://localhost:3000/api/v1` | http://localhost:3000/api/v1/docs |
| Server | Disesuaikan dengan domain milik client (contoh: `https://metrohub.site/api/v1`) | https://metrohub.site/api/v1/docs |

Cek server hidup: `GET /api/v1/health` → `{ "success": true, "message": "OK" }`.

Akun admin bawaan (hasil seed) diminta ke tim backend. Akun anak magang dibuat admin lewat `POST /magang/interns`.

## 2. Mencoba API

**Swagger (paling cepat):** buka halaman Swagger, jalankan `POST /auth/login` dengan tombol *Try it out*.
Cookie login tersimpan otomatis di browser, jadi endpoint lain bisa langsung dicoba.
Semua endpoint pada daftar di bawah telah memiliki route backend; lihat Swagger untuk kontrak terbarunya.

**Postman:** import `docs/postman/metrohub.postman_collection.json`. Ubah variabel `baseUrl` sesuai lingkungan.
Koleksi ini bisa dijalankan berurutan dengan *Collection Runner*. Setiap request berisi contoh sukses dan gagal,
dan nama request diakhiri status yang diharapkan, misalnya `Check-in kedua kali (BR-04) [409]`.
Untuk request upload, atur *Working Directory* Postman ke folder `docs/postman` (file `foto-uji.jpg`).

## 3. Login dan sesi

Login memakai **cookie httpOnly** bernama `token` (JWT, berlaku 1 hari). Frontend **tidak perlu** menyimpan token di
`localStorage`. Cukup pastikan cookie ikut terkirim di setiap request.

```js
// Login
const res = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password }),
});
const { data } = await res.json(); // { id, nama, email, role }

// Siapa yang sedang login + daftar permission
const me = await fetch('/api/v1/auth/me', { credentials: 'include' }).then((r) => r.json());
// me.data = { id, nama, email, role, permissions: ['magang:absen'] }

// Logout
await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' });
```

Dengan axios, cukup atur sekali:

```js
import axios from 'axios';

export const api = axios.create({ baseURL: '/api/v1', withCredentials: true });
```

- **Pesan login gagal** sengaja tidak menyebut apakah email atau password yang salah (CR-01).
- **Akun nonaktif** tidak bisa login. Kalau akun dinonaktifkan saat sedang login, request berikutnya langsung mendapat 401.
- **Selain cookie**, header `Authorization: Bearer <token>` juga diterima. Ini hanya untuk alat uji, karena token
  tidak dikembalikan di body respons login. Frontend cukup memakai cookie.
- **Pencabutan sesi di server:** logout mencabut sesi token di database (`core_sessions`), sehingga token lama tidak
  dapat dipakai ulang meskipun masa berlakunya belum habis (NF-04).
- **Ubah password dan nonaktivasi:** `PATCH /auth/password` membutuhkan `password_lama` dan `password_baru`
  (minimal 8 karakter), menghapus cookie, serta mencabut seluruh sesi akun di semua perangkat sehingga pengguna harus
  login ulang. Nonaktivasi akun atau reset password oleh admin juga mencabut seluruh sesi terkait.

### Pengaturan development frontend (Vite)

Backend **tidak memasang CORS**, karena di production frontend dan API berada di domain yang sama.
Saat development, arahkan request `/api` lewat proxy Vite agar browser menganggapnya satu origin:

```js
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      // Pilih salah satu target:
      '/api': 'http://localhost:3000', // backend lokal
      // '/api': { target: 'https://metrohub.site', changeOrigin: true }, // backend di server
    },
  },
});
```

Di kode frontend, selalu pakai path relatif (`/api/v1/...`), jangan menulis domain backend.
Request langsung dari `http://localhost:5173` ke `https://metrohub.site` akan diblokir browser.
Pada frontend, target proxy dapat diatur lewat variabel lingkungan `API_PROXY_TARGET` (default `http://localhost:3000`).

## 4. Format respons

Semua endpoint JSON umumnya mengembalikan bentuk yang sama. Endpoint `health` merupakan pengecualian dan
mengembalikan `{ "success": true, "message": "OK" }` tanpa field `data`. File foto juga bukan JSON:

```json
{ "success": true, "message": "OK", "data": { } }
```

```json
{
  "success": false,
  "message": "Data yang dikirim tidak valid",
  "details": [{ "field": "email", "message": "Format email tidak valid" }]
}
```

`message` sudah dalam Bahasa Indonesia dan boleh langsung ditampilkan ke pengguna.
`details` hanya ada pada error validasi. Pakai `field` untuk menandai input yang salah di form.

| Status | Arti | Yang sebaiknya dilakukan frontend |
|---|---|---|
| 200 / 201 | Berhasil | Proses field `data` / tampilkan notifikasi berhasil |
| 400 | Validasi gagal atau aturan bisnis dilanggar | Tampilkan `message` (dan `details` per field) |
| 401 | Belum login, sesi habis, atau akun nonaktif | Arahkan ke halaman login |
| 403 | Tidak punya izin | Tampilkan halaman "tidak punya akses" |
| 404 | Data tidak ditemukan | Tampilkan pesan data tidak ditemukan atau arahkan kembali |
| 409 | Data duplikat atau masih dipakai data lain | Tampilkan `message` |
| 413 | Foto lebih dari 500 KB | Kompres ulang foto |
| 500 | Kesalahan server | Laporkan ke tim backend |

Contoh penanganan global dengan axios:

```js
api.interceptors.response.use(
  (res) => res.data, // langsung kembalikan { success, message, data }
  (err) => {
    if (err.response?.status === 401 && window.location.pathname !== '/login') window.location.href = '/login';
    return Promise.reject(err.response?.data ?? { message: 'Tidak dapat terhubung ke server' });
  },
);
```

## 5. Format data

| Jenis | Format | Contoh |
|---|---|---|
| Tanggal (`tanggal`, `tanggal_mulai`, `tenggat`, ...) | `YYYY-MM-DD` | `"2026-11-03"` |
| Waktu (`jam_checkin`, `created_at`, ...) | ISO 8601 dalam **UTC** | `"2026-11-03T01:15:00.000Z"` |
| Bulan (query `bulan`) | `YYYY-MM` | `"2026-11"` |
| Uang (`nominal`), koordinat | number | `1500000`, `-0.9145` |
| Boolean di query string | `true` / `false` | `?aktif=true` |

- **Tampilkan waktu dalam WIB:**
  ```js
  new Date(jam_checkin).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' });
  ```
- **"Hari ini"** selalu dihitung backend dalam WIB, jadi frontend tidak perlu mengirim tanggal untuk absensi dan logbook.
- **Nilai enum** dikirim dan diterima dalam huruf besar (khusus `jenis` keuangan juga menerima huruf kecil `pemasukan`/`pengeluaran` pada input dan dinormalisasi ke huruf besar di respons):

| Field | Nilai | Teks tampilan |
|---|---|---|
| `status_kerja` | `ONSITE`, `REMOTE` | On-site, Remote |
| `status` (tugas) | `BELUM_DIKERJAKAN`, `DIKERJAKAN`, `SELESAI` | Belum Dikerjakan, Dikerjakan, Selesai |
| `jenis` (keuangan) | `PEMASUKAN`, `PENGELUARAN` | Pemasukan, Pengeluaran |

## 6. Hak akses dan sidebar

Backend memeriksa **permission**, bukan nama role. Empat role pada sistem:

| Role | Permission |
|---|---|
| Owner / Admin | `core:dashboard`, `core:pengguna`, `core:lokasi`, `magang:kelola`, `keuangan:kelola`, `keuangan:lihat` |
| Finance | `keuangan:kelola`, `keuangan:lihat` |
| Operasional Magang | `magang:kelola` |
| Anak Magang | `magang:absen` |

**Sidebar** diambil dari `GET /menu`, yang sudah disaring sesuai permission pengguna. Jangan menulis daftar menu
secara manual di frontend (contoh isi field `data` untuk role Anak Magang):

```json
[
  { "group": "Dashboard", "items": [{ "label": "Dashboard Saya", "path": "/dashboard-saya" }] },
  { "group": "Manajemen Magang", "items": [
      { "label": "Absensi", "path": "/magang/absensi-saya" },
      { "label": "Logbook", "path": "/magang/logbook-saya" },
      { "label": "Tugas Saya", "path": "/magang/tugas-saya" }
    ] },
  { "group": "Pengaturan", "items": [{ "label": "Profil", "path": "/profil" }] }
]
```

Untuk menyembunyikan tombol tertentu, cek `permissions` dari `GET /auth/me`.
Menyembunyikan tombol hanya untuk tampilan: backend tetap menolak request tanpa izin dengan 403 (CR-03).

## 7. Daftar endpoint

Prefix semua path: `/api/v1`. Semua path berikut relatif terhadap prefix tersebut.

### Umum (semua pengguna yang login)

| Method | Path | Fungsi |
|---|---|---|
| `POST` | `/auth/login` | Login (publik) |
| `POST` | `/auth/logout` | Logout (publik) |
| `GET` | `/auth/me` | Data pengguna + permission |
| `GET` | `/menu` | Menu sidebar |
| `PATCH` | `/auth/password` | Ubah password sendiri |

### Admin: Core

| Method | Path | Permission | Fungsi |
|---|---|---|---|
| `GET` | `/dashboard` | core:dashboard | Kartu ringkasan tiap modul |
| `GET` | `/users?q=&role_id=&aktif=` | core:pengguna | Daftar pengguna |
| `POST` | `/users` | core:pengguna | Tambah pengguna |
| `GET` | `/users/:id` | core:pengguna | Detail pengguna |
| `PATCH` | `/users/:id` | core:pengguna | Ubah pengguna |
| `PATCH` | `/users/:id/status` | core:pengguna | Aktifkan / nonaktifkan |
| `GET` | `/roles` | core:pengguna | Daftar role |
| `GET` | `/roles/permissions` | core:pengguna | Semua permission per modul (untuk checkbox hak akses) |
| `GET` | `/roles/:id/permissions` | core:pengguna | Lihat hak akses role |
| `PUT` | `/roles/:id/permissions` | core:pengguna | Simpan hak akses role |
| `GET` | `/office-settings` | core:lokasi | Lihat lokasi dan radius kantor |
| `PUT` | `/office-settings` | core:lokasi | Ubah lokasi dan radius kantor |

### Admin: Magang (`magang:kelola`)

| Method | Path | Fungsi |
|---|---|---|
| `GET` | `/magang/interns?q=&status_kerja=&aktif=` | Daftar anak magang |
| `POST` | `/magang/interns` | Tambah anak magang + akun login |
| `GET` | `/magang/interns/:id` | Detail anak magang |
| `PATCH` | `/magang/interns/:id` | Ubah data anak magang |
| `PATCH` | `/magang/interns/:id/status-kerja` | Ubah on-site / remote |
| `GET` | `/magang/tasks?intern_id=&status=&terlambat=` | Daftar tugas |
| `POST` | `/magang/tasks` | Buat tugas |
| `PATCH` | `/magang/tasks/:id` | Ubah tugas |
| `DELETE` | `/magang/tasks/:id` | Hapus tugas |
| `GET` | `/magang/attendances/photos/:filename` | File foto absensi |
| `GET` | `/magang/attendances?intern_id=&dari=&sampai=` | Rekap absensi |
| `GET` | `/magang/logbooks?intern_id=&dari=&sampai=` | Rekap logbook |
| `PATCH` | `/magang/attendances/:id` | Koreksi absensi |

### Anak magang (`magang:absen`)

| Method | Path | Fungsi |
|---|---|---|
| `GET` | `/magang/interns/me` | Profil magang + `sisa_hari` |
| `GET` | `/magang/attendances/today` | Status absensi hari ini |
| `POST` | `/magang/attendances/checkin` | Check-in (multipart) |
| `POST` | `/magang/attendances/checkout` | Check-out (multipart) |
| `GET` | `/magang/logbooks/today` | Lihat logbook hari ini |
| `PUT` | `/magang/logbooks/today` | Isi / ubah logbook hari ini |
| `GET` | `/magang/logbooks/me?dari=&sampai=` | Riwayat logbook |
| `GET` | `/magang/tasks/me` | Tugas saya |
| `PATCH` | `/magang/tasks/:id/progress` | Perbarui status + catatan progres |
| `GET` | `/magang/attendances/me?dari=&sampai=` | Riwayat absensi saya |

### Admin: Keuangan

| Method | Path | Permission | Fungsi |
|---|---|---|---|
| `GET` | `/keuangan/categories?jenis=&aktif=` | keuangan:kelola | Daftar kategori |
| `POST` | `/keuangan/categories` | keuangan:kelola | Tambah kategori |
| `PATCH` | `/keuangan/categories/:id` | keuangan:kelola | Ubah / nonaktifkan kategori |
| `DELETE` | `/keuangan/categories/:id` | keuangan:kelola | Hapus kategori (jika belum dipakai) |
| `POST` | `/keuangan/transactions` | keuangan:kelola | Catat transaksi |
| `PATCH` | `/keuangan/transactions/:id` | keuangan:kelola | Ubah transaksi |
| `DELETE` | `/keuangan/transactions/:id` | keuangan:kelola | Hapus transaksi (soft delete) |
| `GET` | `/keuangan/transactions?bulan=&jenis=&category_id= atau ?dari=&sampai=` | keuangan:kelola | Tabel debit-kredit + saldo berjalan |
| `GET` | `/keuangan/summary?bulan=YYYY-MM` | keuangan:lihat | Ringkasan bulanan |

## 8. Alur absensi harian (anak magang)

Urutan wajib: **check-in → isi logbook → check-out**. Semua aturan dicek di backend.

### 8.1 Ambil status hari ini

Panggil `GET /magang/attendances/today` saat halaman absensi dibuka dan setelah setiap aksi.
Pakai field-nya untuk mengunci atau membuka tombol (contoh isi field `data`):

```json
{
  "tanggal": "2026-11-03",
  "status_kerja": "ONSITE",
  "dalam_masa_magang": true,
  "sudah_checkin": true,
  "logbook_tersimpan": false,
  "sudah_checkout": false,
  "bisa_checkin": false,
  "bisa_checkout": false,
  "absensi": { "jam_checkin": "2026-11-03T01:15:00.000Z", "...": "..." }
}
```

| Tombol / form | Aktif jika |
|---|---|
| Check-in | `bisa_checkin` |
| Logbook | `sudah_checkin && !sudah_checkout` |
| Check-out | `bisa_checkout` (sudah check-in, logbook tersimpan, belum check-out) |

Jika `dalam_masa_magang` bernilai `false`, tampilkan pesan bahwa masa magang belum dimulai atau sudah berakhir (BR-07).

### 8.2 Check-in / check-out

Kirim sebagai **`multipart/form-data`** dengan tiga field: `foto`, `latitude`, `longitude`.

```js
async function absen(jenis /* 'checkin' | 'checkout' */, fotoBlob) {
  const posisi = await new Promise((ok, gagal) =>
    navigator.geolocation.getCurrentPosition(ok, gagal, { enableHighAccuracy: true, timeout: 15000 }),
  );

  const form = new FormData();
  form.append('foto', fotoBlob, 'foto.jpg');
  form.append('latitude', posisi.coords.latitude);
  form.append('longitude', posisi.coords.longitude);

  // Jangan set header Content-Type sendiri; browser mengisi boundary multipart otomatis
  const res = await fetch(`/api/v1/magang/attendances/${jenis}`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  return res.json();
}
```

Ketentuan foto:
- **Sumber:** diambil dari kamera (`navigator.mediaDevices.getUserMedia`), bukan dari galeri (BR-03). Backend hanya bisa
  memastikan foto ada, jadi pembatasan kamera menjadi tugas frontend.
- **Format dan ukuran:** JPG, PNG, atau WEBP, **maksimal 500 KB** (NF-07). Kompres di browser sebelum upload, misalnya
  `canvas.toBlob(cb, 'image/jpeg', 0.7)` dengan lebar sekitar 640 px.
- **HTTPS:** kamera dan GPS hanya berjalan di HTTPS (atau `localhost`).

Kemungkinan respons:

| Status | Penyebab | Contoh `message` |
|---|---|---|
| 201 / 200 | Berhasil (201 check-in, 200 check-out) | `Check-in berhasil / Check-out berhasil` |
| 400 | Foto tidak ada | `Foto wajah wajib diambil` |
| 400 | On-site di luar radius (BR-01) | `Anda berada 250 meter dari kantor. Absensi on-site hanya bisa dalam radius 100 meter.` |
| 400 | Di luar masa magang (BR-07) | `Masa magang Anda sudah berakhir` |
| 400 | Check-out sebelum check-in / sebelum logbook (BR-05) | `Isi logbook hari ini sebelum check-out` |
| 409 | Sudah check-in / check-out hari ini (BR-04) | `Anda sudah check-in hari ini` |
| 413 | Foto > 500 KB | `Ukuran foto maksimal 500 KB` |

Anak magang **remote** boleh absen dari mana saja. Lokasi dan jaraknya ke kantor tetap dicatat (BR-02).

### 8.3 Logbook

```js
await api.put('/magang/logbooks/today', { isi: 'Membuat halaman login dan dashboard' });
```

- **Isi kosong** atau hanya spasi ditolak.
- **Hanya bisa diisi setelah check-in**; pengiriman sebelum check-in ditolak dengan status 400.
- **Bisa diubah berkali-kali** sampai check-out. Setelah check-out, perubahan ditolak (400).
- **`GET /magang/logbooks/today`** mengembalikan `data: null` jika logbook hari ini belum diisi.

## 9. Contoh per fitur

### Tambah anak magang (admin)

Sekaligus membuat akun login dengan role Anak Magang:

```http
POST /api/v1/magang/interns
Content-Type: application/json

{
  "nama": "Budi Santoso",
  "email": "budi@kampus.ac.id",
  "password": "rahasia123",
  "asal_kampus": "Universitas Andalas",
  "tanggal_mulai": "2026-11-03",
  "tanggal_selesai": "2026-12-31",
  "status_kerja": "ONSITE"
}
```

Respons `data` memuat `masa_magang_aktif`. `GET /magang/interns/me` juga memuat `sisa_hari` untuk halaman anak magang (MG-08).

### Tugas

```http
POST /api/v1/magang/tasks
{ "intern_id": 3, "judul": "Membuat ERD", "deskripsi": "ERD modul magang", "tenggat": "2026-11-10" }

PATCH /api/v1/magang/tasks/7/progress          (anak magang, hanya tugas miliknya)
{ "status": "DIKERJAKAN", "catatan_progres": "Sudah 50%" }
```

Setiap tugas memiliki field `terlambat` (`true` jika lewat tenggat dan belum `SELESAI`, BR-08).
Field ini dihitung backend, jadi frontend cukup menampilkan label "Terlambat" bila `terlambat === true`.

### Kategori dan transaksi

```http
POST /api/v1/keuangan/categories
{ "nama": "Penjualan Jasa", "jenis": "PEMASUKAN" }

POST /api/v1/keuangan/transactions
{ "tanggal": "2026-11-03", "jenis": "PEMASUKAN", "category_id": 1, "nominal": 1500000, "keterangan": "Proyek web" }
```

- **Dropdown kategori** di form transaksi: ambil dengan `GET /keuangan/categories?jenis=<jenis terpilih>&aktif=true`.
  Backend menolak kategori yang jenisnya berbeda atau sudah nonaktif.
- **Jenis** pada kategori, transaksi, dan filter menerima `PEMASUKAN`/`PENGELUARAN` maupun
  `pemasukan`/`pengeluaran`. Respons dan penyimpanan selalu memakai huruf kapital.
- **Status kategori baru** dapat dikirim sebagai `aktif: true` atau `aktif: false` (boolean).
  Jika tidak dikirim, kategori baru aktif secara default. Jenis kategori tidak dapat diubah;
  form edit cukup mengirim `nama` dan/atau `aktif`.
- **Jumlah penggunaan kategori** tersedia sebagai `jumlah_transaksi` pada respons daftar, tambah,
  dan ubah kategori. Nilai ini termasuk transaksi soft delete: hanya kategori dengan nilai 0
  yang boleh dihapus. Kategori dengan nilai lebih dari 0 dapat dinonaktifkan.
- **Nominal** harus lebih dari 0, maksimal 2 angka desimal.
- **Hapus transaksi** adalah soft delete: data tetap tersimpan sebagai riwayat, tapi tidak dihitung di saldo.
  Tampilkan dialog konfirmasi sebelum memanggil `DELETE` (KU-03).
- **Kategori yang sudah dipakai transaksi** tidak bisa dihapus (409). Tawarkan untuk menonaktifkannya dengan
  `PATCH /keuangan/categories/:id` dan body `{ "aktif": false }`.

### Hak akses role (admin)

1. Ambil semua permission dengan `GET /roles/permissions`, lalu tampilkan sebagai checkbox per modul.
2. Ambil permission yang sudah dimiliki role dengan `GET /roles/:id/permissions`, lalu centang yang sesuai.
3. Simpan dengan `PUT /roles/:id/permissions` dan body `{ "permissions": ["magang:absen", ...] }`.
   Isinya mengganti seluruh permission role tersebut.

### Foto absensi (admin)

`foto_checkin` dan `foto_checkout` berisi nama file. Tampilkan langsung dengan tag `<img>`:

```jsx
<img src={`/api/v1/magang/attendances/photos/${absensi.foto_checkin}`} alt="Foto check-in" />
```

Cookie admin ikut terkirim otomatis karena satu origin. Anak magang dan pengguna yang belum login tidak bisa membuka foto (NF-06).

### Ubah password

```http
PATCH /api/v1/auth/password
Content-Type: application/json
{ "password_lama": "rahasia123", "password_baru": "rahasiaBaru123" }
```

Password baru minimal 8 karakter. Setelah berhasil, cookie login dihapus dan seluruh sesi akun di semua perangkat dicabut sehingga pengguna perlu login kembali.

### Koreksi absensi (admin)

```http
PATCH /api/v1/magang/attendances/12
Content-Type: application/json
{
  "jam_checkin": "2026-11-13T08:05:00+07:00",
  "jam_checkout": "2026-11-13T17:00:00+07:00",
  "keterangan_koreksi": "Kendala jaringan saat check-out"
}
```

`keterangan_koreksi` wajib diisi. `jam_checkin` dan `jam_checkout` memakai format ISO 8601 dengan offset zona waktu (kirim `jam_checkout: null` untuk mengosongkan check-out). Respons menyertakan `nama_admin_koreksi` sebagai jejak audit (MG-10).

## 10. Masalah yang sering terjadi

| Gejala | Penyebab dan solusi |
|---|---|
| Selalu 401 padahal sudah login | Cookie tidak terkirim. Pastikan `credentials: 'include'` / `withCredentials: true` dan request lewat proxy Vite (satu origin). |
| Error CORS di console | Request langsung ke domain backend. Pakai path relatif `/api/v1/...` dan proxy Vite. |
| 400 "Data yang dikirim tidak valid" di check-in | Request dikirim sebagai JSON. Check-in/out wajib `FormData`, dan header `Content-Type` jangan diisi manual. |
| Kamera atau GPS tidak muncul di HP | Halaman dibuka lewat HTTP. Buka lewat domain HTTPS. |
| 413 saat check-in | Foto lebih dari 500 KB. Kompres sebelum upload. |
| Angka di field `role_id` / `intern_id` / `category_id` ditolak | Kirim sebagai number (`3`), bukan string (`"3"`). |
| Endpoint tidak ditemukan (404) | Pastikan prefix `/api/v1`, path, dan method sesuai dengan Swagger. |

Ada pertanyaan atau menemukan respons yang tidak sesuai dokumen? Hubungi tim backend
dengan menyertakan method, path, body request, dan respons yang diterima.
