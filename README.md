# 📄 CV Studio - ATS Pro & Fully Customizable Resume Builder

Sebuah aplikasi web modern untuk membuat dan mengkustomisasi CV/Resume profesional secara mendalam (**pixel-perfect, high ATS score, dan freely customizable**). Dibuat dengan **React + TypeScript + Tailwind CSS + Vite**.

Dilengkapi layout standar ATS profesional (*single-page optimized*), dengan data contoh profil siap pakai yang mudah disesuaikan.

---

## 🚀 Fitur Utama

### 1. 🎛️ Konfigurasi Desain Sangat Detail (*Customize Freely*)
* **🔒 Force 1-Page Layout (Kunci 1 Halaman Penuh)**:
  - Fitur kunci 1 halaman yang secara matematis menghitung rasio konten dan menskalakannya agar **semua konten yang Anda masukkan dipaksa masuk ke dalam tepat 1 halaman**. Tidak akan pernah tumpah ke halaman 2.
  - Tombol **"Auto-Tune Spacing"** untuk mengoptimalkan margin dan ukuran teks secara natural.
* **📏 Kebebasan Penuh Ukuran Kertas (Custom Paper Dimensions)**:
  - **Preset Populer**: A4 (210 × 297 mm), US Letter (215.9 × 279.4 mm), **F4 / Folio Indonesia (215 × 330 mm)**, dan US Legal (215.9 × 355.6 mm).
  - **Custom Dimensions**: Bebas mengatur angka Lebar (mm) dan Tinggi (mm) kertas sesuai kebutuhan khusus.
* **4 Pilihan Template Desain**:
  - **ATS Classic**: Desain standar ATS dengan garis pembatas horizontal bersih dan tipografi elegan.
  - **Modern Minimal**: Desain kontemporer dengan badge rounded dan aksen visual modern.
  - **Executive**: Desain formal dengan hierarki serif dan garis pembatas ganda.
  - **Tech Compact**: Desain khusus software engineer / developer dengan gaya monospace dan chip teknologi.
* **Typography Controls**:
  - Pilihan font: **Inter** (Clean Modern), **EB Garamond** (Academic Serif), **Merriweather** (Editorial Serif), **Roboto** (Geometric Sans), **JetBrains Mono** (Tech Monospace).
  - Slider ukuran font dasar (8.0pt – 12pt).
  - Slider ukuran nama header (16pt – 28pt).
  - Slider ukuran judul seksi (10pt – 15pt).
  - Slider tinggi baris (*Line Height* 1.15 – 1.65).
* **Spacing & Margin Fleksibel**:
  - Slider margin atas/bawah & kiri/kanan (6mm – 24mm).
  - Slider jarak antar seksi / *Section Gap* (1.0mm – 8mm).
  - Slider jarak antar pekerjaan / *Item Gap* (0.8mm – 6mm).
  - Slider jarak antar poin / *Bullet Gap* (0.4mm – 4mm).
* **Styling Header & Garis Seksi**:
  - Alignment header: *Centered*, *Left Aligned*, atau *Split*.
  - Pilihan gaya pembatas: *Underline Full-Width*, *Left Accent Bar*, *Pill Badge*, *Double Line*, atau *Minimal*.
  - Ketebalan garis pembatas (0.5px – 3px).
  - Bentuk bullet: *Solid Disc (•)*, *Hyphen (-)*, *Square (▪)*, atau *Circle (○)*.
  - Toggle UPPERCASE untuk nama & heading.
* **Pilihan Warna & Custom Hex**:
  - Preset warna elegan: *ATS Black, Dark Slate, Executive Navy, Forest Emerald, Deep Burgundy, Modern Indigo, Teal Blue*.
  - Color picker untuk warna custom sesuka hati.

---

### 2. 📝 Editor Konten Lengkap
Fitur lengkap untuk menyusun resume profesional:
* **Personal Info**: Nama, gelar pekerjaan, email, telepon, domisili/lokasi, LinkedIn, website/portfolio, GitHub, dan deskripsi ringkas (*Professional Summary*).
* **Education**: Nama kampus, jurusan/gelar, lokasi, periode studi, IPK/GPA, dan catatan prestasi.
* **Experiences**: Organisasi / perusahaan, posisi/jabatan, lokasi, periode kerja, dan poin-poin kontribusi (*bullet points*) yang bisa ditambah/diedit/dihapus secara dinamis.
* **Projects**: Nama proyek, tech stack, link repo/website, konteks/subtitle, dan poin-poin pencapaian teknis.
* **Skills**: Kategori keahlian dinamis (misal: *Programming & Frameworks, Tools & Systems, Additional*, dsb.) dengan fitur *Quick Add Suggestions*.
* **Achievements**: Daftar kejuaraan/prestasi dengan tahun dan penyelenggara.
* **Custom Sections**: Kemampuan membuat seksi bebas baru (misal: *Certifications, Licenses, Volunteering, Publications, Languages*).

---

### 3. 🔄 Reorder & Visibility Seksi
* Urutkan seksi manapun ke atas/bawah dengan tombol panah.
* Sembunyikan (*hide/show*) seksi atau entri tertentu tanpa harus menghapus datanya.
* Ubah nama judul seksi kapan saja (contoh: ubah "Experiences" menjadi "Work Experience").

---

### 4. 📤 Export, Backup & ATS Analyzer
* **Print / Save as PDF (Native Vector)**: Menghasilkan PDF berbasis vector `@media print` murni dengan dimensi tepat sesuai kertas yang dipilih (A4, F4, Letter, atau Custom). Teks 100% tajam, tidak pecah, tanpa background gelap yang bocor, dan header profile tidak akan pernah terpotong.
* **Download PDF Direct (Instant File)**: Menggunakan engine rendering yang diisolasi di container putih bersih unscaled, menghasilkan file `.pdf` siap kirim yang pas dengan rasio kertas tanpa melebar ke samping.
* **JSON Backup & Restore**: Simpan data CV dan konfigurasi styling Anda ke file `.json` lokal untuk di-restore kapan saja.
* **LocalStorage Autosave**: Perubahan yang Anda ketik tersimpan otomatis di browser sehingga tidak akan hilang saat me-refresh halaman.
* **ATS Readiness Analyzer**: Skor kelengkapan ATS otomatis (0 - 100) dan checklist kelengkapan resume.

---

## 💻 Cara Menjalankan Project

1. Clone repositori & install dependencies:
   ```bash
   git clone https://github.com/Ax3lrod/cv-generator.git
   cd cv-generator
   npm install
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

3. Buka browser di [http://localhost:5173](http://localhost:5173).

4. Untuk build production:
   ```bash
   npm run build
   ```
