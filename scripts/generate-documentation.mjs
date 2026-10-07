import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from 'docx';
import { writeFile } from 'node:fs/promises';

const body=[];
const heading=(text,level=HeadingLevel.HEADING_1)=>body.push(new Paragraph({text,heading:level}));
const para=text=>body.push(new Paragraph({children:[new TextRun(text)]}));
const bullets=items=>items.forEach(text=>body.push(new Paragraph({text,bullet:{level:0}})));
const table=(headers,rows)=>body.push(new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:[new TableRow({children:headers.map(x=>new TableCell({children:[new Paragraph({children:[new TextRun({text:x,bold:true})]})]}))}),...rows.map(row=>new TableRow({children:row.map(x=>new TableCell({children:[new Paragraph(String(x))]}))}))]}));

body.push(new Paragraph({text:'Dokumentasi Implementasi PustakaNusa',heading:HeadingLevel.TITLE}));
para('Dokumen teknis untuk implementasi Sistem Informasi Perpustakaan Digital berbasis Express.js dan MySQL.');
heading('Ringkasan');
para('PustakaNusa melengkapi prototipe antarmuka menjadi aplikasi web lokal dengan REST API Express, basis data MySQL, autentikasi peran, dan alur transaksi perpustakaan. Implementasi mengikuti dokumen analisis sistem serta menambahkan data katalog dan jadwal pengambilan yang dibutuhkan oleh antarmuka.');
heading('Arsitektur');
para('Browser memanggil REST API pada server Express. Server memverifikasi JWT, menerapkan aturan bisnis, dan menjalankan transaksi MySQL untuk perubahan stok dan peminjaman. Front-end ada pada folder public, API pada server.js, dan skema MySQL pada database/schema.sql.');
heading('Modul yang Diimplementasikan');
bullets(['Autentikasi JWT untuk anggota, admin, dan petugas.','Katalog, pencarian judul/penulis/ISBN, filter kategori, serta detail buku.','Pengajuan peminjaman dengan cek stok, jadwal/lokasi pengambilan, batas tiga buku aktif, dan jatuh tempo 30 hari.','Pengembalian oleh petugas, pembaruan stok, serta perhitungan denda.','Pengaduan anggota dan pembaruan status oleh petugas.','Notifikasi transaksi peminjaman, dasbor admin, penambahan buku, dan laporan transaksi.']);
heading('Aturan Bisnis');
bullets(['Anggota dapat memiliki maksimal tiga transaksi aktif.','Peminjaman hanya diproses bila stok buku tersedia.','Stok berkurang saat peminjaman diajukan dan bertambah saat pengembalian.','Denda = ceil(hari terlambat ÷ 7) × 10% × harga buku.','Status pengaduan: baru, diproses, selesai, atau ditolak.']);
heading('Basis Data');
para('Tabel inti: categories, books, members, staff, loans, loan_items, complaints, dan notifications. Tabel loan_items menyimpan harga buku saat transaksi untuk dasar denda historis. Tabel books mendukung penulis, penerbit, tahun terbit, halaman, bahasa, ISBN, harga, stok, dan sinopsis.');
heading('Endpoint Utama');
table(['Metode','Endpoint','Peran','Fungsi'],[['POST','/api/auth/login','Semua','Login dan JWT'],['GET','/api/books','Publik','Daftar dan pencarian buku'],['POST','/api/loans','Anggota','Pengajuan peminjaman'],['POST','/api/loans/:id/return','Admin/Petugas','Pengembalian dan denda'],['GET/POST','/api/complaints','Anggota','Pengaduan'],['PATCH','/api/complaints/:id','Admin/Petugas','Ubah status pengaduan'],['GET','/api/admin/reports/loans','Admin/Petugas','Laporan transaksi']]);
heading('Instalasi');
bullets(['Salin .env.example menjadi .env dan isi kredensial MySQL.','Jalankan mysql -u root -p < database/schema.sql.','Jalankan pnpm install atau npm install.','Jalankan pnpm start atau npm start.','Buka http://localhost:3000.']);
heading('Akun Demo');
table(['Peran','Identitas','Kata sandi'],[['Pengguna','alya.rahma@email.id','password'],['Admin','admin','password']]);
heading('Catatan Keamanan dan Pengembangan Lanjut');
para('Ganti kata sandi demo dan JWT_SECRET sebelum penggunaan nyata. Gunakan HTTPS, akun basis data berhak akses terbatas, dan validasi unggahan berkas. Tahap pengembangan berikutnya dapat mencakup CRUD lengkap seluruh entitas, ekspor PDF/Excel, perpanjangan pinjaman, serta pengiriman notifikasi terjadwal.');

const doc=new Document({sections:[{properties:{},children:body}]});
await writeFile('docs/Dokumentasi_Implementasi_PustakaNusa.docx',await Packer.toBuffer(doc));
