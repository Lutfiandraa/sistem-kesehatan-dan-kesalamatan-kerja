# SafetyKU Frontend

Frontend client untuk sistem pelaporan keselamatan dan kesehatan kerja.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5174`

## Build untuk Production

```bash
npm run build
```

## Struktur Folder

```
frontend/
├── public/              # Static assets (images, dll)
│   ├── keselamatanlogo.png
│   └── safetybackground.png
├── src/
│   ├── components/      # Komponen reusable
│   │   ├── Footer.jsx
│   │   ├── PublicLayout.jsx
│   │   └── PublicNavbar.jsx
│   ├── pages/          # Halaman aplikasi
│   │   └── Home.jsx
│   ├── services/       # API services
│   │   └── api.js
│   ├── App.jsx         # Root component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Fitur

- Home page dengan hero section dan statistik
- Responsive design dengan Tailwind CSS
- Integrasi dengan backend API

## Teknologi

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios

