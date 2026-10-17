import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const TARGET_MEMBERS = 34;
const TARGET_STAFF = 5;
const TEST_PASSWORD = 'asdf1234';
const MEMBER_EMAIL_PATTERN = 'testing.pengguna%@pustakanusa.local';
const STAFF_EMAIL_PATTERN = 'testing.petugas%@pustakanusa.local';

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pustakanusa',
  connectionLimit: 2,
});

const memberNames = [
  'Aditya Pratama', 'Aisyah Putri', 'Akbar Ramadhan', 'Amanda Maharani',
  'Andi Saputra', 'Annisa Rahma', 'Bagus Setiawan', 'Bella Oktaviani',
  'Cahyo Nugroho', 'Citra Lestari', 'Daffa Alfarizi', 'Dewi Anggraini',
  'Dimas Kurniawan', 'Eka Wulandari', 'Farhan Maulana', 'Fira Nabila',
  'Galih Permana', 'Gita Savitri', 'Hafiz Prakoso', 'Indah Puspitasari',
  'Iqbal Fauzan', 'Kartika Sari', 'Lukman Hakim', 'Maya Safitri',
  'Naufal Rizky', 'Nisa Aulia', 'Putra Mahendra', 'Rani Kusuma',
  'Rizky Hidayat', 'Salsa Amalia', 'Taufik Hendra', 'Vina Melati',
  'Wahyu Firmansyah', 'Yasmin Zahra', 'Zaki Mubarak', 'Nadia Larasati',
];

const staffNames = ['Rina Pustakawan', 'Dedi Pranata', 'Mira Katalog', 'Fajar Layanan', 'Nanda Arsip'];

const bookSeed = [
  ['Sastra & Novel', 'Jejak di Ujung Senja', 'Arini Maheswari', 'Pena Nusantara', 2021, 328, '978-TST-0001', 89000, 30, 'Perjalanan menemukan rumah dan makna keluarga.'],
  ['Sastra & Novel', 'Hujan di Kota Lama', 'Raka Daniswara', 'Langit Kata', 2020, 284, '978-TST-0002', 82000, 28, 'Kisah persahabatan yang tumbuh di tengah perubahan kota.'],
  ['Sastra & Novel', 'Surat untuk Esok Hari', 'Nadira Aulia', 'Aksara Timur', 2022, 312, '978-TST-0003', 94000, 26, 'Kumpulan surat tentang harapan dan keberanian.'],
  ['Sastra & Novel', 'Pulang Sebelum Pagi', 'Bima Pradana', 'Pustaka Rasa', 2019, 296, '978-TST-0004', 79000, 24, 'Novel tentang pilihan, kehilangan, dan kesempatan kedua.'],
  ['Sejarah', 'Nusantara dalam Catatan', 'Rahmat Wiratama', 'Arsip Bangsa', 2018, 448, '978-TST-0005', 135000, 22, 'Pengantar sejarah sosial dan budaya Nusantara.'],
  ['Sejarah', 'Jalur Rempah Indonesia', 'Dian Paramita', 'Bumi Aksara', 2021, 376, '978-TST-0006', 128000, 25, 'Sejarah perdagangan rempah dan pengaruhnya bagi dunia.'],
  ['Sejarah', 'Kota dan Peradaban', 'Fauzan Hakim', 'Historia Press', 2020, 404, '978-TST-0007', 142000, 21, 'Perkembangan kota-kota penting sepanjang sejarah.'],
  ['Psikologi', 'Mengenal Diri Sendiri', 'Dr. Ratih Laras', 'Cakrawala Ilmu', 2023, 264, '978-TST-0008', 98000, 32, 'Panduan praktis memahami emosi dan pola pikir.'],
  ['Psikologi', 'Tenang di Tengah Tekanan', 'Dimas Wardana', 'Ruang Tumbuh', 2022, 288, '978-TST-0009', 102000, 29, 'Strategi menjaga ketenangan dalam kehidupan sehari-hari.'],
  ['Psikologi', 'Seni Berkomunikasi', 'Maya Andriani', 'Pikiran Terbuka', 2021, 304, '978-TST-0010', 105000, 27, 'Cara membangun komunikasi yang sehat dan efektif.'],
  ['Pengembangan Diri', 'Langkah Kecil Setiap Hari', 'Naufal Prasetyo', 'Tumbuh Bersama', 2023, 240, '978-TST-0011', 88000, 35, 'Membangun perubahan melalui kebiasaan kecil.'],
  ['Pengembangan Diri', 'Fokus Tanpa Batas', 'Kartika Dewi', 'Produktif Media', 2022, 272, '978-TST-0012', 99000, 33, 'Teknik mengelola perhatian dan prioritas.'],
  ['Pengembangan Diri', 'Berani Memulai', 'Andra Saputra', 'Inspirasi Kita', 2020, 256, '978-TST-0013', 86000, 31, 'Panduan mengubah ide menjadi tindakan nyata.'],
  ['Teknologi', 'Dasar Pemrograman Web', 'Rizal Kurnia', 'Kode Media', 2024, 420, '978-TST-0014', 155000, 40, 'Dasar HTML, CSS, JavaScript, dan pengembangan web modern.'],
  ['Teknologi', 'Basis Data untuk Pemula', 'Sinta Maharani', 'Kode Media', 2023, 388, '978-TST-0015', 148000, 38, 'Konsep basis data relasional dan latihan SQL.'],
  ['Teknologi', 'Membangun API Modern', 'Kevin Wijaya', 'Digital Press', 2024, 352, '978-TST-0016', 162000, 36, 'Perancangan dan pengujian REST API untuk aplikasi.'],
  ['Teknologi', 'Keamanan Aplikasi Web', 'Farhan Akbar', 'Digital Press', 2023, 368, '978-TST-0017', 175000, 25, 'Prinsip keamanan autentikasi, data, dan jaringan.'],
  ['Bisnis', 'Strategi Bisnis Sederhana', 'Yuni Kartika', 'Niaga Cerdas', 2021, 300, '978-TST-0018', 118000, 28, 'Menyusun strategi usaha yang terukur dan realistis.'],
  ['Bisnis', 'Keuangan untuk UMKM', 'Hendra Gunawan', 'Niaga Cerdas', 2022, 316, '978-TST-0019', 125000, 30, 'Dasar pencatatan dan pengelolaan keuangan usaha.'],
  ['Bisnis', 'Pemasaran Digital Praktis', 'Citra Permata', 'Market Lab', 2023, 280, '978-TST-0020', 115000, 34, 'Panduan kanal dan pengukuran pemasaran digital.'],
  ['Sains', 'Sains di Sekitar Kita', 'Dr. Budi Hartono', 'Cakrawala Ilmu', 2020, 336, '978-TST-0021', 108000, 24, 'Fenomena sains yang dekat dengan kehidupan sehari-hari.'],
  ['Sains', 'Mengenal Alam Semesta', 'Lina Kusumawati', 'Bintang Media', 2022, 360, '978-TST-0022', 132000, 23, 'Pengantar astronomi dengan bahasa yang mudah dipahami.'],
  ['Pendidikan', 'Belajar dengan Efektif', 'Rani Oktavia', 'Edu Pustaka', 2023, 248, '978-TST-0023', 92000, 35, 'Teknik belajar, mencatat, dan mengingat informasi.'],
  ['Pendidikan', 'Kelas yang Menyenangkan', 'Agus Setiawan', 'Edu Pustaka', 2021, 292, '978-TST-0024', 104000, 29, 'Inspirasi aktivitas pembelajaran yang aktif.'],
  ['Biografi', 'Cerita Para Perintis', 'Wahyu Adinata', 'Tokoh Kita', 2019, 384, '978-TST-0025', 122000, 22, 'Kisah tokoh-tokoh yang membangun perubahan.'],
  ['Biografi', 'Perempuan Pembawa Perubahan', 'Nisa Larasati', 'Tokoh Kita', 2022, 344, '978-TST-0026', 128000, 26, 'Profil perempuan inspiratif dari berbagai bidang.'],
  ['Anak', 'Petualangan Kiko di Hutan', 'Tia Ramadhani', 'Ceria Anak', 2023, 96, '978-TST-0027', 58000, 45, 'Cerita anak tentang persahabatan dan menjaga alam.'],
  ['Anak', 'Rahasia Pulau Pelangi', 'Doni Prakoso', 'Ceria Anak', 2022, 112, '978-TST-0028', 62000, 42, 'Petualangan seru memecahkan rahasia sebuah pulau.'],
  ['Kesehatan', 'Hidup Sehat Setiap Hari', 'dr. Fitri Ananda', 'Sehat Media', 2023, 276, '978-TST-0029', 110000, 30, 'Panduan kebiasaan sehat yang mudah diterapkan.'],
  ['Kesehatan', 'Tidur Berkualitas', 'dr. Arman Yusuf', 'Sehat Media', 2022, 232, '978-TST-0030', 96000, 28, 'Memahami pola tidur dan cara memperbaikinya.'],
  ['Kuliner', 'Dapur Nusantara', 'Dewi Purnamasari', 'Rasa Media', 2021, 248, '978-TST-0031', 118000, 32, 'Resep dan cerita kuliner dari berbagai daerah Indonesia.'],
  ['Kuliner', 'Bekal Praktis Sehari-hari', 'Rina Apriani', 'Rasa Media', 2023, 216, '978-TST-0032', 94000, 38, 'Ide bekal praktis, sehat, dan mudah dibuat.'],
  ['Kuliner', 'Kopi dari Hulu ke Hilir', 'Bayu Wicaksana', 'Seduh Press', 2022, 286, '978-TST-0033', 132000, 25, 'Mengenal perjalanan kopi dari kebun hingga cangkir.'],
  ['Agama', 'Hikmah dalam Keseharian', 'Ahmad Fauzi', 'Cahaya Ilmu', 2020, 304, '978-TST-0034', 87000, 34, 'Renungan tentang nilai kebaikan dalam kehidupan sehari-hari.'],
  ['Agama', 'Jalan Menuju Syukur', 'Nurul Hikmah', 'Cahaya Ilmu', 2022, 272, '978-TST-0035', 92000, 31, 'Catatan sederhana untuk membangun kebiasaan bersyukur.'],
  ['Politik', 'Memahami Demokrasi', 'Rendra Kusnadi', 'Wacana Publik', 2021, 364, '978-TST-0036', 138000, 24, 'Pengantar sistem demokrasi dan partisipasi warga.'],
  ['Politik', 'Kebijakan Publik untuk Semua', 'Tania Rahardjo', 'Wacana Publik', 2023, 392, '978-TST-0037', 149000, 22, 'Cara kebijakan publik dirancang dan memengaruhi masyarakat.'],
  ['Ekonomi', 'Ekonomi dalam Kehidupan', 'Surya Mahendra', 'Neraca Media', 2020, 336, '978-TST-0038', 126000, 28, 'Konsep ekonomi yang ditemui dalam keputusan sehari-hari.'],
  ['Ekonomi', 'Mengenal Investasi Dasar', 'Laras Widuri', 'Neraca Media', 2023, 292, '978-TST-0039', 134000, 30, 'Dasar risiko, tujuan, dan instrumen investasi.'],
  ['Komik', 'Petualangan Rimba Biru', 'Studio Langit', 'Panel Cerita', 2022, 168, '978-TST-0040', 75000, 44, 'Komik petualangan menjaga hutan dan satwa.'],
  ['Komik', 'Detektif Cilik: Misteri Museum', 'Ari Prabowo', 'Panel Cerita', 2023, 184, '978-TST-0041', 79000, 42, 'Misteri ringan yang diselesaikan oleh tiga sahabat.'],
  ['Komik', 'Penjaga Kota Cahaya', 'Nina Kusuma', 'Panel Cerita', 2021, 192, '978-TST-0042', 82000, 40, 'Kisah pahlawan muda melindungi kota futuristis.'],
  ['Seni', 'Dasar Menggambar', 'Wulan Permadi', 'Kanvas Media', 2022, 224, '978-TST-0043', 108000, 27, 'Latihan bentuk, perspektif, cahaya, dan komposisi.'],
  ['Seni', 'Mengenal Fotografi', 'Danu Prasetya', 'Kanvas Media', 2023, 256, '978-TST-0044', 124000, 26, 'Panduan komposisi dan pencahayaan untuk fotografer pemula.'],
  ['Seni', 'Musik dan Cerita', 'Sekar Ayuningtyas', 'Nada Pustaka', 2020, 276, '978-TST-0045', 112000, 24, 'Perjalanan musik dan cerita di balik berbagai genre.'],
  ['Hukum', 'Hukum untuk Masyarakat', 'Damar Adiwijaya', 'Adil Press', 2021, 408, '978-TST-0046', 156000, 22, 'Pengantar hak dan kewajiban hukum bagi masyarakat.'],
  ['Hukum', 'Etika Digital dan Privasi', 'Rizka Anindita', 'Adil Press', 2024, 344, '978-TST-0047', 164000, 28, 'Memahami privasi dan tanggung jawab di ruang digital.'],
  ['Lingkungan', 'Bumi yang Kita Jaga', 'Sari Wening', 'Hijau Media', 2022, 264, '978-TST-0048', 99000, 36, 'Langkah sederhana menjaga lingkungan dari rumah.'],
  ['Lingkungan', 'Kota Ramah Iklim', 'Yusuf Ramadhan', 'Hijau Media', 2023, 312, '978-TST-0049', 118000, 30, 'Gagasan membangun kota yang tangguh dan berkelanjutan.'],
  ['Perjalanan', 'Menyusuri Timur Indonesia', 'Galang Pranata', 'Jelajah Kata', 2021, 320, '978-TST-0050', 137000, 25, 'Catatan perjalanan tentang alam dan masyarakat Indonesia timur.'],
  ['Perjalanan', 'Kereta Terakhir ke Utara', 'Prita Laksmi', 'Jelajah Kata', 2020, 288, '978-TST-0051', 109000, 27, 'Kisah perjalanan lintas kota dengan kereta api.'],
  ['Bahasa', 'Bahasa Indonesia Akademik', 'Rini Handayani', 'Edu Pustaka', 2023, 356, '978-TST-0052', 128000, 35, 'Panduan menulis karya akademik secara jelas dan terstruktur.'],
  ['Bahasa', 'English for Daily Conversation', 'Melissa Hartono', 'Lingua Press', 2022, 296, '978-TST-0053', 116000, 38, 'Latihan percakapan bahasa Inggris untuk situasi sehari-hari.'],
  ['Bahasa', 'Mengenal Bahasa Jepang Dasar', 'Kenji Pratama', 'Lingua Press', 2024, 308, '978-TST-0054', 142000, 34, 'Pengenalan huruf, kosakata, dan percakapan bahasa Jepang.'],
];

const dateOffset = (days) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

async function main() {
  const connection = await pool.getConnection();
  try {
    const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);
    await connection.beginTransaction();

    // Hapus hanya data buatan seed sebelumnya agar perintah ini aman dijalankan ulang.
    const [oldTestMembers] = await connection.query('SELECT id FROM members WHERE email LIKE ?', [MEMBER_EMAIL_PATTERN]);
    const oldIds = oldTestMembers.map((row) => row.id);
    if (oldIds.length) {
      await connection.query('DELETE FROM fine_payments WHERE member_id IN (?)', [oldIds]);
      await connection.query('DELETE FROM complaints WHERE member_id IN (?)', [oldIds]);
      await connection.query('DELETE FROM loans WHERE member_id IN (?)', [oldIds]);
      await connection.query('DELETE FROM members WHERE id IN (?)', [oldIds]);
    }

    const [oldTestStaff] = await connection.query("SELECT id FROM staff WHERE role='petugas' AND email LIKE ?", [STAFF_EMAIL_PATTERN]);
    const oldStaffIds = oldTestStaff.map((row) => row.id);
    if (oldStaffIds.length) {
      await connection.query('UPDATE loans SET staff_id=NULL WHERE staff_id IN (?)', [oldStaffIds]);
      await connection.query('DELETE FROM staff WHERE id IN (?)', [oldStaffIds]);
    }

    const [[memberCount]] = await connection.query('SELECT COUNT(*) total FROM members');
    const [[staffCount]] = await connection.query("SELECT COUNT(*) total FROM staff WHERE role='petugas'");
    if (memberCount.total > TARGET_MEMBERS) throw new Error(`Pengguna non-testing sudah ${memberCount.total}; target ${TARGET_MEMBERS} tidak dapat dipenuhi tanpa menghapus data lama.`);
    if (staffCount.total > TARGET_STAFF) throw new Error(`Petugas non-testing sudah ${staffCount.total}; target ${TARGET_STAFF} tidak dapat dipenuhi tanpa menghapus data lama.`);

    const membersToCreate = TARGET_MEMBERS - Number(memberCount.total);
    const staffToCreate = TARGET_STAFF - Number(staffCount.total);
    for (let index = 0; index < membersToCreate; index += 1) {
      const number = String(index + 1).padStart(3, '0');
      const name = memberNames[index % memberNames.length];
      await connection.query(
        "INSERT INTO members(member_no,name,email,phone,address,password_hash,registration_status) VALUES (?,?,?,?,?,?,'disetujui')",
        [`TST-2026-${number}`, name, `testing.pengguna${number}@pustakanusa.local`, `0812${String(70000000 + index).padStart(8, '0')}`, `Jl. Data Testing No. ${index + 1}, Jakarta`, passwordHash],
      );
    }
    for (let index = 0; index < staffToCreate; index += 1) {
      const number = String(index + 1).padStart(2, '0');
      await connection.query(
        "INSERT INTO staff(name,username,email,password_hash,role) VALUES (?,?,?,?,'petugas')",
        [staffNames[index % staffNames.length], `testing.petugas${number}`, `testing.petugas${number}@pustakanusa.local`, passwordHash],
      );
    }

    // Password seragam untuk semua pengguna dan petugas; superadmin sengaja tidak diubah.
    await connection.query('UPDATE members SET password_hash=?', [passwordHash]);
    await connection.query("UPDATE staff SET password_hash=? WHERE role='petugas'", [passwordHash]);

    const categoryNames = [...new Set(bookSeed.map((book) => book[0]))];
    for (const name of categoryNames) {
      await connection.query('INSERT INTO categories(name,description) VALUES (?,?) ON DUPLICATE KEY UPDATE description=VALUES(description)', [name, `Koleksi ${name}`]);
    }
    const [categoryRows] = await connection.query('SELECT id,name FROM categories');
    const categoryIds = new Map(categoryRows.map((row) => [row.name, row.id]));

    const seededBooks = [];
    for (const [category, title, author, publisher, year, pages, isbn, price, baseStock, synopsis] of bookSeed) {
      const [[existing]] = await connection.query('SELECT id FROM books WHERE isbn=? LIMIT 1', [isbn]);
      let bookId = existing?.id;
      if (bookId) {
        await connection.query('UPDATE books SET category_id=?,title=?,author=?,publisher=?,published_year=?,pages=?,language=?,price=?,stock=?,synopsis=? WHERE id=?', [categoryIds.get(category), title, author, publisher, year, pages, 'Indonesia', price, baseStock, synopsis, bookId]);
      } else {
        const [result] = await connection.query('INSERT INTO books(category_id,title,author,publisher,published_year,pages,language,isbn,price,stock,synopsis) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [categoryIds.get(category), title, author, publisher, year, pages, 'Indonesia', isbn, price, baseStock, synopsis]);
        bookId = result.insertId;
      }
      seededBooks.push({ id: bookId, title, price, baseStock });
    }

    const [testMembers] = await connection.query('SELECT id,name FROM members WHERE email LIKE ? ORDER BY id', [MEMBER_EMAIL_PATTERN]);
    const [petugas] = await connection.query("SELECT id FROM staff WHERE role='petugas' ORDER BY id");
    if (!testMembers.length || !petugas.length) throw new Error('Akun testing gagal disiapkan.');

    const statuses = [
      ...Array(8).fill('menunggu'),
      ...Array(8).fill('siap_diambil'),
      ...Array(14).fill('dipinjam'),
      ...Array(10).fill('terlambat'),
      ...Array(24).fill('dikembalikan'),
      ...Array(6).fill('dibatalkan'),
    ];
    const loanRecords = [];
    for (let index = 0; index < statuses.length; index += 1) {
      const status = statuses[index];
      const member = testMembers[index % testMembers.length];
      const book = seededBooks[(index * 7) % seededBooks.length];
      const staff = petugas[index % petugas.length];
      let loanDate = dateOffset(-5 - (index % 18));
      let dueDate = dateOffset(10 + (index % 15));
      let returnedDate = null;
      let fineTotal = 0;
      if (status === 'terlambat') {
        loanDate = dateOffset(-45 - (index % 10));
        dueDate = dateOffset(-1 - (index % 14));
        fineTotal = 15000 + (index % 5) * 5000;
      } else if (status === 'dikembalikan') {
        loanDate = dateOffset(-80 - (index % 20));
        dueDate = dateOffset(-45 - (index % 10));
        returnedDate = dateOffset(-42 + (index % 8));
        fineTotal = index % 3 === 0 ? 10000 + (index % 4) * 5000 : 0;
      } else if (status === 'dibatalkan') {
        loanDate = dateOffset(-20 - (index % 8));
        dueDate = dateOffset(10);
      }
      const staffId = ['dipinjam', 'terlambat', 'dikembalikan', 'dibatalkan'].includes(status) ? staff.id : null;
      const pickupDate = ['menunggu', 'siap_diambil'].includes(status) ? dateOffset(1 + (index % 5)) : loanDate;
      const [loanResult] = await connection.query(
        'INSERT INTO loans(member_id,staff_id,loan_date,due_date,returned_date,status,pickup_location,pickup_date,pickup_time,fine_total) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [member.id, staffId, loanDate, dueDate, returnedDate, status, ['Perpustakaan Kota Jakarta Pusat', 'Perpustakaan Cabang Selatan', 'Perpustakaan Kampus'][index % 3], pickupDate, `${String(9 + (index % 7)).padStart(2, '0')}:00`, fineTotal],
      );
      await connection.query('INSERT INTO loan_items(loan_id,book_id,price_at_loan,fine) VALUES (?,?,?,?)', [loanResult.insertId, book.id, book.price, fineTotal]);
      loanRecords.push({ id: loanResult.insertId, memberId: member.id, bookId: book.id, bookTitle: book.title, status, dueDate, fineTotal });
    }

    const returnRequests = [
      ...loanRecords.filter((loan) => loan.status === 'dipinjam').slice(0, 5),
      ...loanRecords.filter((loan) => loan.status === 'terlambat').slice(0, 3),
    ];
    for (const loan of returnRequests) {
      await connection.query('INSERT INTO loan_return_requests(loan_id,member_id) VALUES (?,?)', [loan.id, loan.memberId]);
    }

    // Tagihan keterlambatan aktif dan riwayat denda peminjaman yang sudah dibayar.
    const overdueLoans = loanRecords.filter((loan) => loan.status === 'terlambat');
    for (let index = 0; index < overdueLoans.length; index += 1) {
      const loan = overdueLoans[index];
      await connection.query("INSERT INTO fine_payments(member_id,source_type,source_id,amount,due_date,status) VALUES (?,'loan',?,?,?,'menunggu')", [loan.memberId, loan.id, loan.fineTotal, dateOffset(2 + (index % 9))]);
    }
    const returnedWithFine = loanRecords.filter((loan) => loan.status === 'dikembalikan' && loan.fineTotal > 0);
    const methods = ['qris', 'va_bca', 'gopay', 'dana', 'ovo'];
    for (let index = 0; index < returnedWithFine.length; index += 1) {
      const loan = returnedWithFine[index];
      await connection.query("INSERT INTO fine_payments(member_id,source_type,source_id,amount,due_date,method,status,paid_at) VALUES (?,'loan',?,?,?,?, 'dibayar',?)", [loan.memberId, loan.id, loan.fineTotal, dateOffset(-35), methods[index % methods.length], `${dateOffset(-34 + index)} 10:30:00`]);
    }

    const complaintStatuses = [...Array(6).fill('baru'), ...Array(5).fill('diproses'), ...Array(10).fill('selesai'), ...Array(3).fill('ditolak')];
    const complaintTypes = ['Buku rusak', 'Buku hilang', 'Halaman hilang', 'Sampul robek'];
    for (let index = 0; index < complaintStatuses.length; index += 1) {
      const sourceLoan = loanRecords[(index * 5 + 20) % loanRecords.length];
      const status = complaintStatuses[index];
      const type = complaintTypes[index % complaintTypes.length];
      const hasFine = (status === 'diproses' && index % 2 === 0) || status === 'selesai';
      const fineAmount = hasFine ? 25000 + (index % 6) * 25000 : 0;
      const [complaintResult] = await connection.query('INSERT INTO complaints(member_id,book_id,type,description,status,fine_amount) VALUES (?,?,?,?,?,?)', [sourceLoan.memberId, sourceLoan.bookId, type, `Data testing: ${type.toLowerCase()} pada buku ${sourceLoan.bookTitle}. Mohon ditindaklanjuti petugas.`, status, fineAmount]);
      if (hasFine) {
        const paid = status === 'selesai' && index % 2 === 0;
        if (paid) {
          await connection.query("INSERT INTO fine_payments(member_id,source_type,source_id,amount,due_date,method,status,paid_at) VALUES (?,'complaint',?,?,?,?, 'dibayar',?)", [sourceLoan.memberId, complaintResult.insertId, fineAmount, dateOffset(-5), methods[index % methods.length], `${dateOffset(-4)} 14:00:00`]);
        } else {
          await connection.query("INSERT INTO fine_payments(member_id,source_type,source_id,amount,due_date,status) VALUES (?,'complaint',?,?,?,'menunggu')", [sourceLoan.memberId, complaintResult.insertId, fineAmount, dateOffset(3 + (index % 10))]);
        }
      }
    }

    for (let index = 0; index < testMembers.length; index += 1) {
      const member = testMembers[index];
      await connection.query('INSERT INTO notifications(member_id,message,type,is_read) VALUES (?,?,?,?)', [member.id, 'Selamat datang di data testing PustakaNusa.', 'info', index % 3 === 0]);
      await connection.query('INSERT INTO notifications(member_id,message,type,is_read) VALUES (?,?,?,?)', [member.id, `Pengingat: periksa status peminjaman dan denda akun testing Anda.`, 'peminjaman', index % 2 === 0]);
    }

    // Sinkronkan stok buku testing dengan jumlah eksemplar yang sedang dipinjam.
    for (const book of seededBooks) {
      const [[borrowed]] = await connection.query("SELECT COUNT(*) total FROM loan_items li JOIN loans l ON l.id=li.loan_id WHERE li.book_id=? AND l.status IN ('dipinjam','terlambat')", [book.id]);
      await connection.query('UPDATE books SET stock=? WHERE id=?', [Math.max(0, book.baseStock - Number(borrowed.total)), book.id]);
    }

    await connection.commit();

    const [[summary]] = await connection.query("SELECT (SELECT COUNT(*) FROM members) pengguna,(SELECT COUNT(*) FROM staff WHERE role='petugas') petugas,(SELECT COUNT(*) FROM books) buku,(SELECT COUNT(*) FROM loans) peminjaman,(SELECT COUNT(*) FROM complaints) pengaduan,(SELECT COUNT(*) FROM fine_payments) denda");
    console.table(summary);
    console.log('\nAkun testing siap digunakan:');
    console.log('- Pengguna baru: testing.pengguna001@pustakanusa.local');
    console.log('- Petugas baru: testing.petugas01@pustakanusa.local');
    console.log(`- Password semua pengguna dan petugas: ${TEST_PASSWORD}`);
    console.log('- Password superadmin tidak diubah.');
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(`Seed data testing gagal: ${error.message}`);
  process.exitCode = 1;
});
