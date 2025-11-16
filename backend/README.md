# 🚀 SafetyKU Backend API

Backend API untuk aplikasi SafetyKU - Sistem Pelaporan Keselamatan dan Kesehatan Kerja menggunakan Node.js, Express.js, dan PostgreSQL.

## 📋 Prerequisites

- Node.js (v14 atau lebih tinggi)
- PostgreSQL (v12 atau lebih tinggi)
- npm atau yarn

## 🚀 Setup Instalasi

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database PostgreSQL

1. Buat database PostgreSQL dengan nama `keselamatan`:
```sql
CREATE DATABASE keselamatan;
```

2. Atau menggunakan psql command line:
```bash
createdb keselamatan
```

### 3. Buat Tabel-tabel Database

Jalankan file SQL yang sudah disediakan:

**Menggunakan psql:**
```bash
psql -U postgres -d keselamatan -f database_setup.sql
```

**Atau copy-paste isi file `database_setup.sql` ke pgAdmin atau PostgreSQL client lainnya**

File `database_setup.sql` berisi semua query yang dibutuhkan untuk membuat:
- Tabel `reports` - untuk menyimpan laporan pelaporan
- Tabel `materials` - untuk menyimpan materi safety talks  
- Tabel `users` - untuk autentikasi (opsional)
- Function dan Trigger untuk auto-update timestamp
- Indexes untuk performa query

### 4. Konfigurasi Environment Variables

1. Copy file `.env.example` menjadi `.env`:
```bash
cp env.example .env
```

2. Edit file `.env` dan sesuaikan dengan konfigurasi database Anda:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=keselamatan
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### 5. Start Server

**Development mode (dengan auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📁 Struktur Folder

```
backend/
├── config/              # Konfigurasi aplikasi
│   ├── config.js       # Konfigurasi utama
│   └── database.js     # Konfigurasi database PostgreSQL
├── controllers/         # Business logic controllers
│   ├── reportsController.js
│   └── materialsController.js
├── middleware/          # Express middleware
│   ├── auth.js
│   └── errorHandler.js
├── migrations/          # Database migrations
│   ├── 001_create_tables.sql
│   └── 002_create_reports_and_materials.sql
├── routes/             # API routes
│   ├── auth.js
│   ├── incidents.js
│   └── public.js
├── seeds/              # Database seeds
│   └── seedDatabase.js
├── uploads/            # Uploaded files (akan dibuat otomatis)
├── database_setup.sql  # SQL script untuk setup database
├── server.js           # Entry point aplikasi
└── package.json
```

## 🔌 API Endpoints

### Public Routes (`/api/public`)

#### Reports
- `GET /api/public/reports` - Get all reports
- `GET /api/public/reports/:id` - Get report by ID
- `POST /api/public/reports` - Create new report
- `PUT /api/public/reports/:id` - Update report (mainly status)
- `DELETE /api/public/reports/:id` - Delete report

#### Materials
- `GET /api/public/materials` - Get all materials
- `GET /api/public/materials/:id` - Get material by ID
- `POST /api/public/materials` - Create new material
- `PUT /api/public/materials/:id` - Update material
- `DELETE /api/public/materials/:id` - Delete material

### Health Check
- `GET /health` - Check server status

## 📊 Database Schema

### Table: `reports`
- `id` - Primary key (SERIAL)
- `title` - Judul laporan (VARCHAR 200)
- `description` - Deskripsi laporan (TEXT)
- `location` - Lokasi kejadian (VARCHAR 200)
- `incident_date` - Tanggal kejadian (TIMESTAMP)
- `severity` - Tingkat keparahan: 'ringan', 'sedang', 'berat'
- `status` - Status: 'belum_dicek', 'belum_ditangani', 'dalam_penangan', 'aman'
- `image` - URL/path gambar (VARCHAR 500, optional)
- `jenis_insiden` - Jenis insiden (VARCHAR 100)
- `created_at` - Timestamp pembuatan
- `updated_at` - Timestamp update (auto-update)

### Table: `materials`
- `id` - Primary key (SERIAL)
- `title` - Judul materi (VARCHAR 200)
- `category` - Kategori: 'Safety' atau 'Kesehatan'
- `description` - Caption/deskripsi (TEXT)
- `content` - Isi materi lengkap (TEXT)
- `created_at` - Timestamp pembuatan
- `updated_at` - Timestamp update (auto-update)

## 🔧 Scripts

- `npm start` - Start server (production)
- `npm run dev` - Start server dengan nodemon (development)
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database dengan dummy data

## 🛠️ Development

### Menambahkan Migration Baru

1. Buat file SQL di folder `migrations/` dengan format: `XXX_description.sql`
2. File akan otomatis dijalankan saat `npm run migrate`

### Menambahkan Controller Baru

1. Buat file di folder `controllers/`
2. Export fungsi-fungsi yang diperlukan
3. Import dan gunakan di routes

## 🔒 Security

- Menggunakan Helmet untuk security headers
- CORS dikonfigurasi untuk frontend
- JWT untuk authentication (jika diperlukan)
- Input validation menggunakan express-validator

## 📝 Notes

- Pastikan PostgreSQL service berjalan sebelum start server
- File upload akan disimpan di folder `uploads/` (akan dibuat otomatis)
- Logs akan muncul di console saat development mode
- Database name: `keselamatan`

## 🐛 Troubleshooting

**Error: Cannot connect to database**
- Pastikan PostgreSQL service berjalan
- Periksa kredensial di file `.env`
- Pastikan database `keselamatan` sudah dibuat
- Pastikan tabel-tabel sudah dibuat dengan menjalankan `database_setup.sql`

**Error: Port already in use**
- Ubah PORT di file `.env`
- Atau hentikan proses yang menggunakan port tersebut

**Migration errors**
- Pastikan semua migration sebelumnya sudah dijalankan
- Periksa syntax SQL di file migration

