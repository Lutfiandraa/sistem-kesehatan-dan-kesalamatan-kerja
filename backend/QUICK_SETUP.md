# ⚡ Quick Setup Guide

## Langkah Cepat Setup Backend

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Buat Database PostgreSQL
```sql
CREATE DATABASE keselamatan;
```

### 3. Buat Tabel-tabel Database

Jalankan file `database_setup.sql` di database `keselamatan`:

**Cara 1: Menggunakan psql**
```bash
psql -U postgres -d keselamatan -f database_setup.sql
```

**Cara 2: Copy-paste ke pgAdmin**
- Buka pgAdmin
- Connect ke database `keselamatan`
- Buka Query Tool
- Copy semua isi file `database_setup.sql`
- Paste dan jalankan (F5)

### 4. Setup Environment
```bash
cp env.example .env
```

Edit file `.env` dan isi:
- `DB_PASSWORD` = password PostgreSQL Anda
- `JWT_SECRET` = secret key untuk JWT (bisa random string)

### 5. Start Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## ✅ Checklist

- [ ] Database `keselamatan` sudah dibuat
- [ ] File `database_setup.sql` sudah dijalankan
- [ ] File `.env` sudah dibuat dan dikonfigurasi
- [ ] Dependencies sudah diinstall (`npm install`)
- [ ] Server bisa start tanpa error

## 🧪 Test API

Setelah server running, test dengan:
```bash
# Health check
curl http://localhost:3000/health

# Get reports (akan kosong jika belum ada data)
curl http://localhost:3000/api/public/reports

# Get materials (akan kosong jika belum ada data)
curl http://localhost:3000/api/public/materials
```

## 📝 Catatan

- **Database name**: `keselamatan`
- **Port**: `3000` (bisa diubah di `.env`)
- **CORS**: Sudah dikonfigurasi untuk `http://localhost:5173`

## 🐛 Troubleshooting

**Error: Cannot connect to database**
- Pastikan PostgreSQL service running
- Periksa password di `.env`
- Pastikan database `keselamatan` sudah dibuat
- Pastikan tabel sudah dibuat (jalankan `database_setup.sql`)

**Error: Port 3000 already in use**
- Ubah `PORT` di file `.env`
- Atau kill process yang menggunakan port 3000

