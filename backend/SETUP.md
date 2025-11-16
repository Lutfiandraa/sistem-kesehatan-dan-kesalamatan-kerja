# 🚀 Quick Setup Guide - SafetyKU Backend

## Langkah-langkah Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup PostgreSQL Database

**Windows:**
```sql
-- Buka PostgreSQL Command Line atau pgAdmin
CREATE DATABASE safetyku_db;
```

**Linux/Mac:**
```bash
createdb safetyku_db
```

### 3. Konfigurasi Environment

Copy `env.example` menjadi `.env`:
```bash
cp env.example .env
```

Edit `.env` dan sesuaikan:
```env
DB_PASSWORD=password_postgres_anda
JWT_SECRET=ubah_dengan_secret_key_yang_aman
```

### 4. Run Migrations
```bash
npm run migrate
```

### 5. Start Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## ✅ Checklist Setup

- [ ] PostgreSQL terinstall dan running
- [ ] Database `safetyku_db` sudah dibuat
- [ ] File `.env` sudah dibuat dan dikonfigurasi
- [ ] Dependencies sudah diinstall (`npm install`)
- [ ] Migrations sudah dijalankan (`npm run migrate`)
- [ ] Server bisa start tanpa error

## 🔍 Test API

Setelah server running, test dengan:
```bash
# Health check
curl http://localhost:3000/health

# Get reports (akan kosong jika belum ada data)
curl http://localhost:3000/api/public/reports

# Get materials (akan kosong jika belum ada data)
curl http://localhost:3000/api/public/materials
```

## 📝 Catatan Penting

1. **Port**: Backend default port adalah `3000`, pastikan tidak conflict
2. **CORS**: Sudah dikonfigurasi untuk `http://localhost:5173` (Vite default)
3. **Database**: Pastikan PostgreSQL service berjalan sebelum start server

## 🐛 Troubleshooting

**Error: "Cannot connect to database"**
- Pastikan PostgreSQL service running
- Periksa kredensial di `.env`
- Pastikan database sudah dibuat

**Error: "Port 3000 already in use"**
- Ubah PORT di `.env`
- Atau kill process yang menggunakan port 3000

