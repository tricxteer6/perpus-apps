# Dokumentasi Aplikasi PustakaNusa

## 1. Gambaran umum

PustakaNusa adalah sistem informasi perpustakaan berbasis web. Satu halaman login digunakan oleh seluruh akun. Sistem mengenali hak akses akun secara otomatis dan menampilkan menu berdasarkan perannya.

Aplikasi mendukung pencarian dan pengelolaan koleksi, peminjaman berbasis QR, pengembalian, pengaduan, denda, pembayaran, notifikasi, pengingat jatuh tempo, serta pengelolaan akun.

## 2. Teknologi dan arsitektur

| Bagian | Teknologi |
|---|---|
| Backend | Node.js dan Express.js |
| Database | MySQL |
| Frontend | HTML, CSS, dan JavaScript tanpa framework |
| Autentikasi | JSON Web Token (JWT) dan bcrypt |
| QR | `qrcode`, BarcodeDetector, dan ZXing Browser |
| Ikon | Remix Icon |

Struktur penting project:

```text
perpus-apps/
├── database/
│   ├── schema.sql
│   └── migrations/
├── public/
│   ├── app.js
│   ├── app.css
│   └── index.html
├── .env.example
├── server.js
├── package.json
└── DOKUMENTASI.md
```

Backend menyediakan REST API. Frontend merupakan single-page application dengan navigasi hash seperti `#/catalog`, `#/loans`, dan `#/admin-loans`.

## 3. Role dan hak akses

### Superadmin

Superadmin memiliki seluruh kemampuan operasional Petugas dan akses khusus untuk mengelola akun.

- Melihat dashboard dan statistik.
- CRUD koleksi buku.
- Memindai QR pengambilan dan menetapkan jatuh tempo.
- Memproses pengembalian, pengaduan, dan denda.
- Melihat serta menghapus data pembayaran denda.
- Menghubungi Pengguna melalui WhatsApp.
- CRUD akun Pengguna dan Petugas.
- Mengubah role akun sesuai batasan integritas data.

### Petugas

- Melihat dashboard dan statistik.
- CRUD koleksi buku.
- Memindai QR pengambilan.
- Menetapkan jatuh tempo peminjaman.
- Memproses pengembalian dan keterlambatan.
- Memproses pengaduan.
- Mengelola data pembayaran denda.

Petugas tidak dapat membuka menu **Kelola Akun**.

### Pengguna

- Melihat katalog dan detail buku.
- Mengajukan peminjaman.
- Melihat, mengunduh, dan menunjukkan QR pengambilan.
- Membatalkan peminjaman yang belum dipindai.
- Melihat peminjaman aktif dan riwayat.
- Membuat pengaduan.
- Melihat serta membayar denda.
- Menerima notifikasi dan pengingat.

## 4. Fitur aplikasi

### 4.1 Autentikasi dan sesi

- Seluruh role menggunakan satu formulir login berlabel **Email**.
- Role tidak dipilih saat login; sistem mengenalinya dari akun.
- Akun Pengguna masuk menggunakan email.
- Backend juga dapat mengenali staf melalui username, tetapi antarmuka tidak menampilkan informasi tersebut.
- Token sesi berlaku selama tujuh hari.
- Sesi disimpan di browser agar tetap aktif setelah halaman dimuat ulang.
- Jika token tidak berlaku, aplikasi membersihkan sesi dan kembali ke halaman login.
- Kata sandi disimpan sebagai hash bcrypt.

### 4.2 Pendaftaran

- Calon Pengguna dapat mengisi nama, email, telepon, alamat, dan kata sandi.
- Pendaftaran mandiri berstatus menunggu sampai disetujui.
- Superadmin dapat membuat akun aktif secara langsung melalui **Kelola Akun**.

### 4.3 Katalog dan koleksi buku

Katalog dapat dilihat publik. Pengunjung dapat mencari berdasarkan judul, penulis, atau ISBN, memfilter kategori, serta melihat detail, cover, sinopsis, dan stok buku.

Superadmin dan Petugas dapat mengelola kategori, judul, penulis, penerbit, tahun terbit, jumlah halaman, bahasa, ISBN, harga, stok, sinopsis, dan cover.

Cover mendukung JPG, PNG, dan WebP dengan ukuran maksimal 2 MB. Jika gambar belum tersedia, aplikasi menampilkan cover bawaan. Klik satu baris buku untuk membuka pilihan **Detail**, **Ubah**, dan **Hapus**. Detail buku juga menampilkan cover.

### 4.4 Peminjaman berbasis QR

Alur peminjaman:

1. Pengguna memilih buku yang stoknya tersedia.
2. Pengguna mengisi lokasi dan jadwal pengambilan.
3. Sistem membuat transaksi berstatus **QR menunggu dipindai**.
4. Pengguna membuka baris peminjaman lalu memilih **Detail**.
5. Modal detail menampilkan QR dan tombol unduh.
6. Pengguna menunjukkan QR kepada Petugas.
7. Petugas membuka **Peminjaman** lalu memilih **Pindai QR**.
8. Setelah QR terbaca, detail Pengguna dan buku tampil di bawah area pemindaian.
9. Petugas mengisi tanggal jatuh tempo dan menyelesaikan pengambilan.
10. Status berubah menjadi **Dipinjam** dan stok berkurang satu.

Ketentuan:

- Maksimal tiga transaksi aktif per Pengguna.
- QR berlaku selama dua hari.
- QR hanya dapat dipakai untuk transaksi yang masih menunggu pemindaian.
- Pengguna dapat membatalkan transaksi sebelum QR dipindai.
- Stok baru berkurang setelah buku diserahkan oleh Petugas.

Menu staf menampilkan **Daftar pengambilan buku** beserta statusnya. Tombol **Riwayat** mengganti tampilan data aktif dengan riwayat sehingga dua tabel tidak menumpuk.

### 4.5 Pemindaian QR

Petugas dapat menggunakan kamera atau menempelkan isi QR secara manual. Kamera memerlukan izin browser dan perangkat berkamera. Gunakan `localhost` saat pengembangan atau HTTPS pada deployment produksi.

Aplikasi mencoba pemindai bawaan browser dan menggunakan ZXing sebagai fallback. Input manual tetap tersedia jika kamera tidak dapat digunakan.

### 4.6 Pengembalian dan keterlambatan

- Petugas melihat daftar buku yang sedang dipinjam.
- Validasi pengembalian mengubah status menjadi **Dikembalikan** dan menambah stok satu.
- Data selesai dapat dibuka melalui **Riwayat**.
- Sistem memeriksa keterlambatan saat data diminta dan setiap enam jam.
- Transaksi lewat jatuh tempo berubah menjadi **Terlambat** dan memicu notifikasi.
- Petugas menentukan nominal denda keterlambatan dan jatuh tempo pembayarannya.

### 4.7 Pengaduan

Pengguna dapat membuat pengaduan untuk buku yang pernah dipinjam. Jenisnya meliputi Buku rusak, Buku hilang, Kendala peminjaman, Kendala pengembalian, dan Keluhan lainnya.

Pengguna dapat menyertakan sampai lima foto bukti dalam format JPG, PNG, atau WebP. Gambar otomatis diperkecil di browser sebelum dikirim agar unggahan dan penyimpanan lebih ringan. Foto ditampilkan pada riwayat Pengguna serta detail pengaduan staf.

Alurnya:

1. Pengguna memilih buku, jenis, dan menulis deskripsi.
2. Pengaduan masuk ke menu staf.
3. Staf mengklik baris untuk membuka detail dalam modal.
4. Staf memasukkan nominal denda dan jatuh tempo bila diperlukan.
5. Pengaduan selesai berpindah ke riwayat.
6. Tagihan muncul pada menu Denda Pengguna.
7. Pengguna menerima notifikasi.

Jika pengaduan **Buku hilang** selesai diproses, transaksi aktif terkait ditutup dan stok disesuaikan agar buku hilang tidak kembali dianggap tersedia.

Untuk pengaduan yang memiliki denda, foto bukti otomatis dihapus dari database tujuh hari setelah pembayaran berstatus Dibayar. Data teks pengaduan dan pembayaran tetap disimpan.

### 4.8 Denda dan pembayaran

Denda dapat berasal dari pengaduan atau keterlambatan. Petugas mengisi nominal dan jatuh tempo. Tagihan awal berstatus **Belum dibayar**.

Metode yang dapat dipilih Pengguna:

- Virtual Account BCA;
- QRIS;
- GoPay;
- DANA;
- OVO.

Setelah metode dipilih, aplikasi menampilkan petunjuk pembayaran. Pengguna menekan **Cek Pembayaran** untuk menyelesaikan simulasi. Status kemudian menjadi **Dibayar** serta mencatat metode dan waktu pembayaran.

> Integrasi payment gateway belum tersedia. Cek Pembayaran saat ini mensimulasikan pembayaran berhasil.

Menu **Pembayaran Denda** staf menampilkan detail tagihan, nominal, status, jatuh tempo, metode, dan waktu bayar. Staf juga dapat menghapus data atau menghubungi Pengguna melalui WhatsApp.

Dashboard staf menampilkan ringkasan metode pembayaran dalam diagram lingkaran dan persentase, bukan daftar riwayat.

### 4.9 Pengingat denda

- Pengingat dibuat saat jatuh tempo berjarak tiga hari atau kurang.
- Pesan yang sama dibuat maksimal sekali per hari.
- Pemeriksaan berjalan saat server menyala dan berulang setiap enam jam.
- Jika server berhenti, pemeriksaan terjadwal ikut berhenti.

### 4.10 Notifikasi

- Ikon lonceng berada di kanan atas.
- Badge menunjukkan jumlah notifikasi yang belum dibaca.
- Klik lonceng membuka panel dan klik di luar menutupnya.
- Satu atau seluruh notifikasi dapat ditandai sudah dibaca.
- Klik notifikasi membuka halaman terkait.
- Staf menerima notifikasi untuk pekerjaan baru yang perlu ditangani.

### 4.11 Kelola akun

Menu ini hanya tersedia bagi Superadmin.

- Menambahkan akun Pengguna atau Petugas.
- Melihat detail akun.
- Mengubah nama, email, telepon, alamat, dan role.
- Menghapus akun jika belum memiliki riwayat yang mengikat.
- Melihat status akun.

Klik baris akun untuk membuka **Detail akun**, **Ubah akun**, dan **Hapus akun**.

Batasan perubahan role:

- Pengguna dengan riwayat transaksi tidak dapat diubah menjadi Petugas.
- Petugas dengan riwayat transaksi tidak dapat diubah menjadi Pengguna.
- Superadmin tidak dapat menghapus akunnya sendiri.
- Sistem menjaga agar tetap ada minimal satu Superadmin.

### 4.12 Dashboard

Dashboard Pengguna menampilkan jumlah peminjaman aktif, total denda, notifikasi, dan deadline pengembalian. Dashboard staf menampilkan jumlah koleksi, anggota, peminjaman aktif, grafik status peminjaman, diagram metode pembayaran, dan pekerjaan yang perlu ditangani.

## 5. Cara pemakaian Pengguna

### Masuk

1. Buka aplikasi dan pilih **Masuk**.
2. Isi email dan kata sandi.
3. Tekan tombol masuk.
4. Sistem membuka dashboard sesuai role.

### Meminjam buku

1. Buka **Katalog**.
2. Cari buku dan pilih **Detail**.
3. Tekan **Ajukan peminjaman**.
4. Isi lokasi dan tanggal pengambilan lalu kirim.
5. Buka **Peminjaman** dan klik baris transaksi.
6. Pilih **Detail**, lalu unduh atau tunjukkan QR kepada Petugas.
7. Setelah QR dipindai dan jatuh tempo ditetapkan, status menjadi Dipinjam.

### Membatalkan peminjaman

1. Buka **Peminjaman**.
2. Klik transaksi berstatus QR menunggu dipindai.
3. Pilih **Batalkan peminjaman**.

Pembatalan tidak tersedia setelah QR dipindai.

### Membuat pengaduan

1. Buka **Pengaduan**.
2. Tambahkan pengaduan.
3. Pilih buku dan jenis masalah.
4. Isi deskripsi dengan jelas lalu kirim.
5. Tunggu Petugas memprosesnya.

### Membayar denda

1. Buka **Denda**.
2. Pilih tagihan belum dibayar.
3. Tekan **Pilih pembayaran**.
4. Pilih metode dan ikuti informasi yang tampil.
5. Tekan **Cek Pembayaran**.
6. Status berubah menjadi Dibayar.

### Membaca notifikasi

1. Tekan ikon lonceng.
2. Klik notifikasi untuk membuka halaman terkait.
3. Gunakan **Tandai semua dibaca** jika seluruhnya sudah diperiksa.

## 6. Cara pemakaian Petugas

### Mengelola buku

1. Buka **Koleksi**.
2. Tekan **Tambah buku**, isi data, unggah cover, lalu simpan.
3. Untuk perubahan, klik baris buku dan pilih **Ubah**.
4. Gunakan tombol **Kembali** di atas jika batal mengubah.

### Menyerahkan buku melalui QR

1. Buka **Peminjaman**.
2. Pastikan transaksi ada di **Daftar pengambilan buku**.
3. Tekan **Pindai QR**.
4. Izinkan kamera atau tempel isi QR manual.
5. Tekan **Tampilkan detail** jika menggunakan input manual.
6. Periksa Pengguna dan buku.
7. Isi jatuh tempo dan selesaikan pengambilan.

### Memproses pengembalian

1. Buka **Pengembalian**.
2. Klik data buku yang dikembalikan.
3. Periksa detail dan validasi pengembalian.
4. Untuk transaksi terlambat, input nominal dan jatuh tempo denda.
5. Gunakan **Riwayat** untuk data selesai.

### Memproses pengaduan

1. Buka **Pengaduan**.
2. Klik satu baris data.
3. Baca detail dalam modal.
4. Isi denda dan jatuh tempo bila diperlukan.
5. Simpan untuk menyelesaikan pengaduan dan mengirim tagihan.

### Memeriksa pembayaran

1. Buka **Pembayaran Denda**.
2. Klik data untuk melihat detail.
3. Periksa status dan metode.
4. Gunakan WhatsApp jika perlu menghubungi Pengguna.

## 7. Cara pemakaian Superadmin

Superadmin mengikuti seluruh panduan Petugas dan memiliki menu **Kelola Akun**.

### Menambah akun

1. Buka **Kelola Akun**.
2. Tekan **Tambah akun**.
3. Pilih role Pengguna atau Petugas.
4. Isi nama, email, dan kata sandi.
5. Untuk Pengguna, isi juga telepon dan alamat.
6. Simpan.

### Mengubah akun atau role

1. Klik baris akun.
2. Pilih **Ubah akun**.
3. Ubah data dan role yang diizinkan.
4. Simpan perubahan.

### Menghapus akun

1. Klik baris akun.
2. Pilih **Hapus akun**.
3. Konfirmasi penghapusan.

Akun dengan riwayat transaksi tidak dapat dihapus agar data tetap konsisten.

## 8. Instalasi dan konfigurasi

### Prasyarat

- Node.js 20 atau lebih baru.
- npm.
- MySQL 8 atau lebih baru.

### Instalasi

```bash
cp .env.example .env
npm install
mysql -u root -p < database/schema.sql
npm run dev
```

Buka `http://localhost:3000`. Untuk menjalankan tanpa Nodemon gunakan `node server.js`.

### Variabel lingkungan

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=pustakanusa
DB_USER=root
DB_PASSWORD=
JWT_SECRET=ganti-dengan-rahasia-yang-kuat-dan-acak
```

| Variabel | Fungsi |
|---|---|
| `PORT` | Port server aplikasi |
| `DB_HOST` | Alamat server MySQL |
| `DB_PORT` | Port MySQL |
| `DB_NAME` | Nama database |
| `DB_USER` | Pengguna database |
| `DB_PASSWORD` | Kata sandi database |
| `JWT_SECRET` | Kunci token login dan QR |

Jangan memasukkan `.env` ke Git. Gunakan `JWT_SECRET` acak dan panjang pada produksi.

### Pemeriksaan kode

```bash
npm run check
```

Perintah tersebut memeriksa sintaks `server.js` dan `public/app.js`.

## 9. Akun demo

Jika database dibuat dari `database/schema.sql`:

| Role | Email | Kata sandi |
|---|---|---|
| Superadmin | `admin@pustakanusa.local` | `password` |
| Petugas | `petugas@pustakanusa.local` | `password` |
| Pengguna | `alya.rahma@email.id` | `password` |

Segera ganti seluruh kata sandi demo sebelum deployment.

## 10. Status data

### Status peminjaman

| Status | Arti |
|---|---|
| `menunggu` | Status lama untuk pengajuan yang menunggu pemeriksaan |
| `siap_diambil` | QR tersedia dan menunggu dipindai Petugas |
| `dipinjam` | Buku sudah diserahkan kepada Pengguna |
| `terlambat` | Jatuh tempo pengembalian sudah lewat |
| `dikembalikan` | Transaksi telah selesai |
| `dibatalkan` | Peminjaman dibatalkan atau ditolak |

### Status pengaduan

| Status | Arti |
|---|---|
| `baru` | Belum diproses |
| `diproses` | Sedang ditangani |
| `selesai` | Penanganan selesai |

### Status pembayaran

| Status | Arti |
|---|---|
| `menunggu` | Belum dibayar |
| `dibayar` | Pembayaran sudah dicatat |

## 11. Ringkasan API

| Kelompok | Endpoint utama |
|---|---|
| Autentikasi | `/api/auth/login`, `/api/auth/register` |
| Katalog | `/api/categories`, `/api/books`, `/api/books/:id` |
| Peminjaman | `/api/loans`, `/api/loans/:id/pickup-qr`, `/api/loans/pickup/preview`, `/api/loans/pickup/scan` |
| Pengembalian | `/api/loans/:id/return`, `/api/loans/:id/fine` |
| Pengaduan | `/api/complaints` |
| Notifikasi | `/api/notifications`, `/api/admin/notifications` |
| Denda | `/api/member/fines`, `/api/admin/fine-payments` |
| Koleksi staf | `/api/admin/books` |
| Kelola akun | `/api/admin/accounts` |
| Dashboard | `/api/dashboard`, `/api/admin/summary`, `/api/admin/alerts` |

Endpoint privat membutuhkan `Authorization: Bearer <token>`.

## 12. Troubleshooting

### Tidak terhubung ke database

- Pastikan MySQL aktif.
- Periksa seluruh konfigurasi `DB_*` di `.env`.
- Pastikan schema sudah diimpor.

### Login gagal

- Periksa email dan kata sandi.
- Pastikan akun Pengguna sudah aktif/disetujui.
- Jika sesi berakhir, masuk kembali.

### Kamera tidak dapat dibuka

- Berikan izin kamera di browser.
- Pastikan kamera tidak sedang dipakai aplikasi lain.
- Gunakan Chrome atau browser modern.
- Gunakan `localhost` saat pengembangan atau HTTPS saat deployment.
- Gunakan input QR manual jika kamera tetap tidak tersedia.

### QR ditolak

- Pastikan QR berasal dari transaksi terkait.
- Pastikan transaksi belum dibatalkan atau dipindai.
- QR berlaku dua hari; buat transaksi baru jika kedaluwarsa.

### Cover gagal diunggah

- Gunakan JPG, PNG, atau WebP.
- Pastikan ukuran tidak lebih dari 2 MB.

### Pengingat tidak muncul

- Pastikan server terus berjalan.
- Pengingat diperiksa setiap enam jam.
- Pastikan jatuh tempo dan status tagihan benar.

## 13. Deployment dan keamanan

Sebelum produksi:

- ganti seluruh kata sandi demo;
- gunakan `JWT_SECRET` yang kuat;
- aktifkan HTTPS;
- gunakan akun MySQL dengan hak minimum;
- lakukan backup database;
- tambahkan rate limiting pada login;
- integrasikan payment gateway untuk pembayaran nyata;
- gunakan object storage bila cover bertambah banyak;
- gunakan scheduler eksternal jika pengingat harus tetap andal saat server restart.

## 14. Batasan versi saat ini

- Pembayaran masih simulasi dan belum terhubung ke bank atau dompet digital.
- WhatsApp dibuka melalui tautan, belum memakai WhatsApp Business API.
- Pengingat bergantung pada proses server yang berjalan.
- Cover disimpan sebagai data gambar di database sehingga kurang ideal untuk skala besar.
- Belum tersedia pemulihan kata sandi melalui email.
