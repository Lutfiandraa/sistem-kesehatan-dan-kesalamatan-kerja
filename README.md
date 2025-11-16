# ALPK3 Indonesia Website

Website Keselamatan & Pelaporan Kerja untuk Asosiasi Lembaga Pelatihan Keselamatan dan Kesehatan Kerja (ALPK3) Indonesia. Dibangun dengan React.js (frontend) dan Node.js (backend).

## Fitur Website Publik

- ✅ Homepage dengan hero section dan fitur unggulan
- ✅ Profil organisasi dengan informasi pengurus berbagai periode
- ✅ Program Kerja dengan tabel kegiatan
- ✅ Galeri Kegiatan dengan foto-foto kegiatan
- ✅ Keanggotaan dengan halaman download, perundangan, dan pengecekan lisensi
- ✅ Halaman kontak dengan formulir
- ✅ Responsive design untuk mobile dan desktop
- ✅ Navigation dengan dropdown menu

## Fitur Aplikasi (SafetyKU)

- ✅ Autentikasi dan otorisasi pengguna (JWT)
- ✅ Manajemen laporan insiden
- ✅ Upload file/lampiran
- ✅ Komentar pada laporan
- ✅ Filter dan pencarian laporan
- ✅ Role-based access control (User, Supervisor, Admin)
- ✅ Database migrations
- ✅ Error handling yang komprehensif

## Persyaratan

- Node.js (v14 atau lebih baru)
- PostgreSQL (v12 atau lebih baru)
- npm atau yarn

## Instalasi

1. **Clone repository dan install dependencies:**
   ```bash
   npm install
   ```

2. **Setup database PostgreSQL:**
   - Buat database baru:
     ```sql
     CREATE DATABASE safetyku_db;
     ```

3. **Konfigurasi environment variables:**
   - Copy file `.env.example` menjadi `.env`
   - Edit file `.env` dan sesuaikan konfigurasi:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=safetyku_db
     DB_USER=postgres
     DB_PASSWORD=your_password
     JWT_SECRET=your_secret_key_here
     ```

4. **Jalankan migrations:**
   ```bash
   npm run migrate
   ```

5. **(Opsional) Seed database dengan data sample:**
   ```bash
   npm run seed
   ```

## Menjalankan Server

**Development mode (dengan auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server akan berjalan di `http://localhost:3000` (atau port yang dikonfigurasi di `.env`)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Incidents

- `GET /api/incidents` - Get all incidents (with filters)
- `GET /api/incidents/:id` - Get single incident
- `POST /api/incidents` - Create new incident report
- `PUT /api/incidents/:id/status` - Update incident status (admin/supervisor only)
- `POST /api/incidents/:id/comments` - Add comment to incident

### Public Content

- `GET /api/public/program-kerja` - Get all work programs
- `GET /api/public/kegiatan` - Get all activities
- `GET /api/public/kegiatan/:id` - Get single activity by ID

### Health Check

- `GET /health` - Check server status

## Database Schema

### Users
- id, username, email, password_hash, full_name, role, department, phone, is_active, timestamps

### Incident Reports
- id, user_id, report_number, incident_type, title, description, location, incident_date, severity, status, timestamps

### Incident Attachments
- id, incident_report_id, file_name, file_path, file_type, file_size, uploaded_at

### Incident Comments
- id, incident_report_id, user_id, comment, timestamps

## Default Credentials (setelah seed)

**Admin:**
- Email: `admin@safetyku.com`
- Password: `admin123`

**User:**
- Email: `user@safetyku.com`
- Password: `user123`

## Struktur Folder

```
├── config/          # Konfigurasi database dan aplikasi
├── middleware/      # Custom middleware (auth, error handling)
├── migrations/      # Database migration files
├── routes/          # API route handlers
│   ├── auth.js      # Authentication routes
│   ├── incidents.js # Incident report routes
│   └── public.js    # Public content routes
├── seeds/           # Database seed files
├── uploads/         # Uploaded files (created automatically)
├── frontend/        # React.js frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── PublicNavbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ...
│   │   ├── pages/       # Page components
│   │   │   ├── public/  # Public website pages
│   │   │   └── ...      # Private app pages
│   │   └── ...
│   └── ...
├── server.js        # Main server file
└── package.json     # Dependencies
```

## Menjalankan Frontend

Masuk ke folder frontend dan install dependencies:

```bash
cd frontend
npm install
```

Jalankan development server:

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173` (default Vite port)

## Routes Website

### Public Routes (Tidak memerlukan autentikasi)
- `/` - Homepage
- `/profil/:period?` - Profil organisasi (dengan submenu untuk berbagai periode)
- `/program-kerja` - Program kerja
- `/kegiatan` - Galeri kegiatan
- `/keanggotaan/:section?` - Keanggotaan (dengan submenu)
- `/kontak` - Halaman kontak

### Private Routes (Memerlukan autentikasi)
- `/app` - Splash screen aplikasi
- `/login` - Login page
- `/dashboard` - Dashboard
- `/report` - Laporan insiden
- `/history` - Riwayat laporan
- `/statistics` - Statistik

## Security Features

- Password hashing dengan bcrypt
- JWT token authentication
- Helmet.js untuk security headers
- CORS configuration
- Input validation dengan express-validator
- SQL injection protection dengan parameterized queries

## Development

Untuk development, gunakan `nodemon` yang sudah dikonfigurasi:
```bash
npm run dev
```

## License

ISC

