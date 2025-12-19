# BAB I
PENDAHULUAN

## 1.1 Latar Belakang

Desa Adat di Bali merupakan entitas sosiokultural yang memegang peranan fundamental dalam melestarikan nilai-nilai kearifan lokal yang berlandaskan filosofi *Tri Hita Karana*. Sebagai kesatuan masyarakat hukum adat yang otonom, Desa Adat memiliki kewenangan penuh dalam mengatur tata kelola rumah tangganya (*parahyangan, pawongan,* dan *palemahan*), termasuk dalam aspek manajemen kependudukan dan pengelolaan keuangan. Dalam dinamika operasionalnya, stabilitas finansial desa sangat bergantung pada partisipasi aktif *krama* (warga) melalui iuran wajib yang dikenal dengan istilah *pesuan*, *paturunan*, atau *patinginan*. Dana yang terhimpun dari iuran ini merupakan pilar utama dalam pembiayaan ritual keagamaan (*Panca Yadnya*), revitalisasi infrastruktur *Pura Kahyangan Tiga*, serta penyelenggaraan kegiatan sosial kemasyarakatan.

Seiring dengan akselerasi perkembangan teknologi informasi di era Revolusi Industri 4.0, tuntutan akan modernisasi pelayanan publik semakin mendesak. Namun, realitas di lapangan menunjukkan adanya kesenjangan digital (*digital divide*) pada tata kelola administrasi Desa Adat. Mayoritas proses pencatatan demografi dan manajemen keuangan masih dijalankan menggunakan metode konvensional berbasis kertas atau pembukuan manual sederhana. Metode tradisional ini memunculkan berbagai inefisiensi dan risiko sistemik, antara lain: (1) Fragmentasi data kependudukan antar-Banjar yang menghambat validasi data secara *real-time*; (2) Tingginya potensi *human error* dalam rekapitulasi buku kas; (3) Risiko degradasi media penyimpanan fisik (arsip) akibat faktor usia atau bencana; serta (4) Rendahnya akuntabilitas dan transparansi publik, dimana *krama* tidak memiliki akses mandiri untuk memverifikasi riwayat pembayaran mereka.

Ketiadaan sistem terintegrasi ini berdampak pada lambatnya proses pengambilan keputusan strategis oleh *Prajuru* (pengurus) Desa Adat. Oleh karena itu, diperlukan sebuah terobosan inovatif berupa implementasi **Sistem Informasi Manajemen Iuran Krama Desa Berbasis Web**. Pengembangan sistem ini tidak sekadar bertujuan untuk digitalisasi administrasi semata, melainkan sebagai upaya strategis untuk mewujudkan tata kelola desa (*village governance*) yang transparan, akuntabel, dan responsif. Sistem ini dirancang dengan mengadopsi pendekatan teknologi web modern, mengintegrasikan basis data kependudukan relasional dengan modul keuangan yang komprehensif, guna memberikan solusi solutif atas permasalahan manajemen tradisional.

## 1.2 Tujuan Proyek

Pengembangan sistem ini diformulasikan dengan sejumlah tujuan strategis yang terukur, yaitu:

1.  **Modernisasi Manajemen Data Kependudukan (*Krama*)**
    Membangun arsitektur basis data terpusat (*centralized database*) yang mampu memetakan struktur demografis desa secara hierarkis (Desa, Banjar, Tempek, hingga Keluarga). Hal ini bertujuan untuk mengeliminasi redundansi data dan memastikan integritas data krama tamiu maupun krama wed.

2.  **Otomatisasi dan Akurasi Tata Kelola Keuangan**
    Menyediakan mekanisme digitalisasi siklus keuangan desa, mulai dari penerbitan tagihan (*invoicing*) otomatis, pencatatan transaksi *multi-channel*, hingga penyusunan laporan keuangan (*financial reporting*) yang akurat dan *auditable*. Tujuan ini difokuskan untuk meminimalisir kesalahan perhitungan manual dan mencegah kebocoran anggaran.

3.  **Peningkatan Transparansi dan Partisipasi Publik**
    Menghadirkan portal layanan mandiri (*self-service portal*) bagi *krama* yang memungkinkan transparansi informasi mengenai status kewajiban dan histori pembayaran. Transparansi ini diharapkan dapat meningkatkan kepercayaan publik (*public trust*) dan menstimulasi kesadaran warga dalam memenuhi kewajiban adatnya.

## 1.3 Ruang Lingkup Proyek

Guna memastikan pengembangan sistem yang terarah dan tepat guna, ruang lingkup proyek ini dibatasi pada aspek-aspek fungsional dan teknis sebagai berikut:

**A. Aspek Fungsionalitas Sistem (Functional Requirements)**

1.  **Modul Manajemen Pengguna & Hak Akses (*Role-Based Access Control*)**
    *   Implementasi hierarki akses pengguna yang ketat, mencakup: *Super Admin* (Prajuru Desa) dengan akses penuh, *Admin Banjar* (Kelian) dengan akses wilayah terbatas, dan *End-User* (Krama) dengan akses *read-only* data pribadi.

2.  **Modul Kependudukan Terintegrasi**
    *   Pengelolaan data induk (*Master Data Management*) untuk entitas Banjar, Keluarga (KK), dan Anggota Keluarga (*Resident*/Individu).
    *   Fitur mutasi data untuk mengakomodasi dinamika penduduk (kelahiran, kematian, pindah datang/keluar).

3.  **Modul Manajemen Keuangan & Iuran**
    *   Sistem *Billing* Cerdas: Pembuatan tagihan massal (*batch generation*) untuk iuran rutin bulanan dan insidental.
    *   Manajemen Transaksi: Pencatatan pembayaran tunai dan non-tunai dengan status *real-time*.
    *   *Audit Trail*: Fitur log aktivitas yang merekam setiap perubahan data keuangan demi keamanan dan penelusuran forensik digital.

4.  **Modul Pelaporan & Visualisasi Data**
    *   *Executive Dashboard*: Visualisasi data statistik kependudukan dan arus kas untuk mendukung *Decision Support System* (DSS) bagi pimpinan desa.
    *   Peta Digital (*GIS Mapping*): Integrasi peta interaktif menggunakan **Leaflet** untuk visualisasi sebaran domisili krama per Banjar.

**B. Aspek Teknis (Non-Functional Requirements)**

1.  **Arsitektur Perangkat Lunak**
    *   Sisi Klien (*Frontend*): Dibangun menggunakan **React** dengan **TypeScript** untuk menjamin performa tinggi, keamanan tipe data (*type safety*), dan antarmuka yang interaktif.
    *   Manajemen State: Menggunakan **Zustand** untuk pengelolaan state aplikasi yang efisien.
    *   *Styling*: Implementasi **Tailwind CSS** untuk desain sistem yang responsif dan konsisten.

2.  **Keamanan & Kinerja**
    *   Penerapan mekanisme autentikasi yang aman untuk melindungi data sensitif krama.
    *   Optimasi *build* menggunakan **Vite** untuk memastikan waktu muat (*load time*) aplikasi yang cepat di berbagai perangkat.
