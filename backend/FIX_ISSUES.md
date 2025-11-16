# 🔧 Fix Common Issues

## 1. Password Authentication Failed

**Error:**
```
❌ Database connection test failed: password authentication failed for user "postgres"
```

**Solution:**
1. Buka file `.env` di folder `backend`
2. Edit baris `DB_PASSWORD=your_password_here`
3. Ganti `your_password_here` dengan password PostgreSQL Anda yang sebenarnya

**Contoh:**
```env
DB_PASSWORD=postgres123
```

**Catatan:** Jika Anda lupa password PostgreSQL:
- Windows: Buka pgAdmin dan reset password
- Atau buat user baru dengan password yang Anda ingat

---

## 2. Port Already in Use (EADDRINUSE)

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution 1: Kill Process yang Menggunakan Port 3000**

```bash
# Cari process ID yang menggunakan port 3000
netstat -ano | findstr :3000

# Kill process (ganti <PID> dengan angka yang muncul)
taskkill /PID <PID> /F
```

**Solution 2: Ubah Port di .env**

1. Buka file `.env`
2. Ubah `PORT=3000` menjadi port lain, misalnya:
```env
PORT=3001
```

3. Restart server

**Solution 3: Gunakan Port Lain untuk Development**

Edit `.env`:
```env
PORT=5000
```

Dan update frontend API baseURL jika perlu.

---

## 3. Database "keselamatan" Tidak Ada

**Error:**
```
❌ Database connection test failed: database "keselamatan" does not exist
```

**Solution:**

1. Buka pgAdmin atau psql
2. Buat database baru:
```sql
CREATE DATABASE keselamatan;
```

3. Atau ubah nama database di `.env`:
```env
DB_NAME=nama_database_yang_ada
```

---

## 4. Tabel Belum Dibuat

**Error saat menggunakan API:**
```
relation "reports" does not exist
```

**Solution:**

Jalankan query SQL dari file `database_setup.sql`:

1. Buka pgAdmin
2. Connect ke database `keselamatan`
3. Buka Query Tool
4. Copy semua isi file `database_setup.sql`
5. Paste dan jalankan (F5)

---

## 5. PostgreSQL Service Tidak Running

**Error:**
```
❌ Database connection test failed: connect ECONNREFUSED
```

**Solution:**

**Windows:**
1. Buka Services (Win + R, ketik `services.msc`)
2. Cari "postgresql"
3. Klik kanan → Start

**Atau menggunakan Command Prompt (as Administrator):**
```bash
net start postgresql-x64-XX
```
(Ganti XX dengan versi PostgreSQL Anda)

---

## ✅ Checklist Setup

Pastikan semua ini sudah benar:

- [ ] PostgreSQL service running
- [ ] Database `keselamatan` sudah dibuat
- [ ] File `.env` sudah dibuat dari `env.example`
- [ ] `DB_PASSWORD` di `.env` sudah diisi dengan password yang benar
- [ ] Query SQL `database_setup.sql` sudah dijalankan
- [ ] Port 3000 tidak digunakan oleh aplikasi lain
- [ ] Dependencies sudah diinstall (`npm install`)

---

## 🧪 Test Setup

Setelah fix semua issues, test dengan:

```bash
# 1. Test database connection
cd backend
node -e "require('./config/database').testConnection()"

# 2. Start server
npm run dev

# 3. Test API
curl http://localhost:3000/health
```

