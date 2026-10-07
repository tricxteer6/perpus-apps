# PustakaNusa

Sistem Informasi Perpustakaan Digital berbasis Express.js dan MySQL. Implementasi ini melengkapi prototipe front-end menjadi aplikasi dengan autentikasi peran, katalog, peminjaman, pengembalian dan denda, pengaduan, notifikasi, serta laporan transaksi.

## Prasyarat

- Node.js 20 atau lebih baru
- MySQL 8 atau lebih baru

## Menjalankan aplikasi

1. Salin konfigurasi lingkungan: `cp .env.example .env`, lalu isi kredensial MySQL pada `.env`.
2. Buat database dan data demo: `mysql -u root -p < database/schema.sql`.
3. Pasang dependensi: `pnpm install` atau `npm install`.
4. Jalankan: `pnpm start` atau `npm start`.
5. Buka `http://localhost:3000`.

Untuk pengembangan gunakan `pnpm dev`.

## Akun demo

| Peran | Identitas | Kata sandi |
|---|---|---|
| Pengguna | `alya.rahma@email.id` | `password` |
| Admin | `admin` | `password` |

Ganti seluruh kata sandi demo sebelum aplikasi digunakan di lingkungan nyata.

## Fitur

- Login JWT untuk anggota, admin, dan petugas.
- Katalog, pencarian, filter kategori, dan detail buku.
- Pengajuan peminjaman dengan batas tiga buku aktif, cek stok, lokasi/jadwal pengambilan, dan jatuh tempo otomatis 30 hari.
- Pengembalian oleh petugas, pembaruan stok, dan denda 10% harga buku untuk setiap kelipatan tujuh hari keterlambatan.
- Pengaduan anggota dan pembaruan status oleh petugas.
- Notifikasi transaksi peminjaman.
- Dasbor admin, penambahan buku, serta laporan transaksi.

Dokumentasi implementasi lengkap tersedia pada `docs/Dokumentasi_Implementasi_PustakaNusa.docx` dan versi Markdown-nya.
