# Setup Frontend - Panduan Lengkap

## Persyaratan
- Node.js (v16 atau lebih baru)
- npm atau yarn

## Langkah Setup

### 1. Install Dependencies
Buka PowerShell di folder `frontend` dan jalankan:
```powershell
npm install
```

### 2. Jalankan Development Server
```powershell
npm run dev
```

Server akan berjalan di `http://localhost:5174` dan browser akan otomatis terbuka.

### 3. Build untuk Production
```powershell
npm run build
```

File hasil build akan ada di folder `dist/`.

## Troubleshooting

### Error: 'vite' is not recognized
**Solusi:** Pastikan dependencies sudah diinstall dengan menjalankan `npm install` di folder `frontend`.

### Port sudah digunakan
Jika port 5174 sudah digunakan, edit `vite.config.js` dan ubah port:
```js
server: {
  port: 5175, // atau port lain yang tersedia
  open: true
}
```

### Assets tidak muncul
Pastikan file gambar ada di folder `frontend/public/`:
- `keselamatanlogo.png`
- `safetybackground.png`

## Struktur File

```
frontend/
├── public/                    # Static assets
│   ├── keselamatanlogo.png
│   └── safetybackground.png
├── src/
│   ├── components/           # Komponen UI
│   ├── pages/               # Halaman
│   ├── services/            # API services
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Catatan

- Backend API harus berjalan di `http://localhost:3000` untuk statistik berfungsi
- Pastikan backend sudah running sebelum mengakses halaman Home

