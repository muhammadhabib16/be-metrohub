# Deploy MetroHub di Homeserver

Satu container aplikasi (API + frontend React yang sudah di-build) dan satu container MySQL 8, dijalankan dengan
`docker-compose.prod.yml`. Image aplikasi sama dengan yang dipakai di Railway (Aturan Portabilitas PRD); yang berbeda hanya
environment variable dan cara HTTPS disediakan.

```
Internet ──HTTPS──▶ Reverse proxy / Cloudflare Tunnel ──HTTP──▶ 127.0.0.1:3000 (metrohub-app) ──▶ mysql:3306 (internal)
```

## Syarat penting

- **HTTPS wajib.** Kamera (MediaDevices) dan GPS (Geolocation) hanya berjalan di HTTPS, dan cookie login diberi flag
  `secure` di production. Akses lewat `http://IP-LAN:3000` tidak akan bisa login maupun absen. Selalu akses lewat domain.
- **Satu lapis proxy.** Aplikasi memakai `trust proxy = 1` dan membaca `X-Forwarded-Proto` untuk redirect HTTPS (NF-03).
  Proxy harus mengirim header itu (Caddy, Nginx Proxy Manager, Traefik, dan cloudflared melakukannya otomatis).
- **Jangan port-forward 3000 atau 3306.** Port 3000 hanya terbuka di `127.0.0.1`, MySQL tidak terbuka sama sekali.
- Arsitektur x86_64 maupun ARM64 (misalnya Raspberry Pi 4/5 64-bit) didukung oleh image `node:22-slim` dan `mysql:8.0`.

## 1. Siapkan file di homeserver

Salin folder `be-metrohub` (atau clone repo) ke server. Di mesin yang ada folder `fe-metrohub`, build frontend ke folder
`public/` backend:

```sh
cd fe-metrohub
npm ci
npm run build:be        # hasil build masuk ke ../be-metrohub/public
```

Lalu buat file environment:

```sh
cd be-metrohub
cp .env.production.example .env.production
chmod 600 .env.production
```

Isi semua nilai `GANTI_...`. Password MySQL di `MYSQL_PASSWORD` dan di `DATABASE_URL` harus sama.

## 2. Jalankan

```sh
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps        # tunggu app & mysql berstatus healthy
curl http://127.0.0.1:3000/api/v1/health
```

Migration (`prisma migrate deploy`) otomatis dijalankan setiap container app start.

## 3. Seed admin pertama (sekali saja)

```sh
docker compose -f docker-compose.prod.yml exec app npm run db:seed
```

Login dengan `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`, segera ganti password lewat menu Profil, lalu buka
**Pengaturan → Lokasi Kantor** dan isi koordinat serta radius kantor yang sebenarnya (nilai seed `0,0` hanya placeholder).

## 4. HTTPS (pilih salah satu)

**A. Cloudflare Tunnel** (disarankan untuk koneksi rumahan: tidak perlu IP publik atau port-forward, aman di balik CGNAT)

1. Domain dikelola di Cloudflare. Di dashboard Zero Trust → Networks → Tunnels, buat tunnel dan pasang `cloudflared` di server.
2. Tambah Public Hostname `metrohub.domainmu.com` → Service `http://127.0.0.1:3000`.

**B. Caddy** (butuh IP publik/DDNS dan port 80 & 443 diteruskan ke server)

```caddyfile
metrohub.domainmu.com {
    reverse_proxy 127.0.0.1:3000
}
```

Caddy mengurus sertifikat Let's Encrypt otomatis. Jika memakai Nginx, set `proxy_set_header X-Forwarded-Proto $scheme;`
dan `client_max_body_size 2m;`.

Samakan `APP_URL` di `.env.production` dengan domain ini.

## 5. Backup harian (NF-10)

Backup ditulis ke folder `be-metrohub/backups/` di host. Tambahkan ke crontab host (`crontab -e`), sesuaikan path:

```cron
CRON_TZ=Asia/Jakarta
15 1 * * * cd /opt/metrohub/be-metrohub && docker compose -f docker-compose.prod.yml exec -T app node scripts/backup.cjs >> backups/backup.log 2>&1
```

Uji sekali secara manual dan coba restore ke database kosong sebelum mengandalkannya
(client dump di image adalah paket `default-mysql-client` Debian):

```sh
docker compose -f docker-compose.prod.yml exec -T app node scripts/backup.cjs
ls -lh backups/
```

Homeserver rawan mati listrik atau disk rusak, jadi **salin backup ke luar server** (cloud storage, NAS lain, atau
`rclone`/`rsync` terjadwal). Foto absensi ada di volume `uploads`. Cadangkan juga jika diperlukan:

```sh
docker run --rm -v be-metrohub_uploads:/data -v "$PWD/backups":/out alpine tar czf /out/uploads-$(date +%F).tar.gz -C /data .
```

(Nama volume mengikuti nama folder project; cek dengan `docker volume ls`.)

## 6. Update versi

```sh
git pull                                  # atau salin source terbaru
(cd ../fe-metrohub && npm ci && npm run build:be)
docker compose -f docker-compose.prod.yml up -d --build
```

Data database dan foto tetap ada karena disimpan di volume.

## Perintah berguna

| Keperluan | Perintah |
|---|---|
| Log aplikasi | `docker compose -f docker-compose.prod.yml logs -f app` |
| Restart | `docker compose -f docker-compose.prod.yml restart app` |
| Stop semua | `docker compose -f docker-compose.prod.yml down` (volume **tidak** terhapus; jangan pakai `-v`) |
| Masuk MySQL | `docker compose -f docker-compose.prod.yml exec mysql mysql -umetrohub -p metrohub` |

## Checklist sebelum dipakai

- [ ] Domain terbuka via HTTPS, gembok valid, `http://` dialihkan ke `https://`
- [ ] Login admin berhasil, password seed sudah diganti
- [ ] Koordinat & radius kantor sudah diisi
- [ ] Absensi dari HP (Chrome Android & Safari iOS): kamera dan GPS terbaca, check-in berhasil
- [ ] Foto absensi tidak bisa dibuka tanpa login admin (NF-06)
- [ ] Backup manual berhasil dan sudah diuji restore; cron aktif; salinan ke luar server terjadwal
- [ ] Server memakai `restart: unless-stopped` dan Docker otomatis start saat boot (`systemctl enable docker`)
