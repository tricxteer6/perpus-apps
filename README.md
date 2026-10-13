# PustakaNusa

PustakaNusa adalah aplikasi manajemen perpustakaan berbasis web dengan tiga peran: **Superadmin**, **Petugas**, dan **Pengguna**. Aplikasi mencakup pengelolaan koleksi, peminjaman berbasis QR, pengembalian, pengaduan, denda, pembayaran, notifikasi, dan pengelolaan akun.

Dokumentasi fitur dan panduan penggunaan lengkap tersedia di [DOKUMENTASI.md](./DOKUMENTASI.md).

## Teknologi

- Node.js dan Express.js
- MySQL
- JavaScript, HTML, dan CSS
- JWT dan bcrypt
- QR Code dan ZXing
- Remix Icon

## Menjalankan aplikasi

Prasyarat: Node.js 20+ dan MySQL 8+.

```bash
cp .env.example .env
npm install
mysql -u root -p < database/schema.sql
npm run dev
```

Buka `http://localhost:3000`.

Untuk menjalankan tanpa pemantau perubahan gunakan `node server.js`. Pemeriksaan sintaks dapat dijalankan dengan `npm run check`.

## Konfigurasi

Isi `.env` sesuai database lokal dan ganti `JWT_SECRET` dengan nilai acak yang kuat. Jangan mengunggah `.env` ke repository.

## Akun demo

| Peran | Identitas | Kata sandi |
|---|---|---|
| Superadmin | `admin@pustakanusa.local` | `password` |
| Petugas | `petugas@pustakanusa.local` | `password` |
| Pengguna | `alya.rahma@email.id` | `password` |

Ganti seluruh kata sandi demo sebelum aplikasi digunakan di lingkungan nyata.
