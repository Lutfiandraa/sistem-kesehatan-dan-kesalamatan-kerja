# 🚀 Cara Menjalankan Server

## Quick Start

### 1. Pastikan Dependencies Terinstall
```bash
cd backend
npm install
```

### 2. Setup Environment File
File `.env` sudah dibuat dari `env.example`. Edit file `.env` dan isi:
- `DB_PASSWORD` = password PostgreSQL Anda
- `JWT_SECRET` = secret key untuk JWT (bisa random string)

### 3. Pastikan Database Sudah Dibuat
```sql
CREATE DATABASE keselamatan;
```

### 4. Jalankan Query SQL
Jalankan file `database_setup.sql` di database `keselamatan` untuk membuat tabel-tabel.

### 5. Start Server

**Development mode (dengan auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Atau langsung:**
```bash
node server.js
```

## ✅ Output yang Diharapkan

Saat server berhasil start, Anda akan melihat:
```
🔄 Testing database connection...
✅ Database connection test successful: [timestamp]
🚀 Server running on port 3000
📝 Environment: development
🌐 CORS enabled for: http://localhost:5173
📊 Database: keselamatan

✅ Ready to accept requests!
```

## 🧪 Test API

Setelah server running, test dengan:
```bash
# Health check
curl http://localhost:3000/health

# Atau buka di browser:
http://localhost:3000/health
```

## ⚠️ Troubleshooting

**Error: Cannot connect to database**
- Pastikan PostgreSQL service running
- Periksa password di `.env`
- Pastikan database `keselamatan` sudah dibuat
- Pastikan tabel sudah dibuat (jalankan `database_setup.sql`)

**Error: Port 3000 already in use**
- Ubah `PORT` di file `.env`
- Atau kill process yang menggunakan port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

## 📝 Catatan

- Server akan tetap start meskipun database belum connect (untuk development)
- Tapi API endpoints akan error jika database tidak connect
- Pastikan database sudah setup sebelum menggunakan API

