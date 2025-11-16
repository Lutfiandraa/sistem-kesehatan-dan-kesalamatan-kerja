# Fix Image Column - Panduan Perbaikan

## Masalah
Error: `value too long for type character varying(500)`

Kolom `image` di database masih bertipe `VARCHAR(500)` yang tidak cukup untuk menyimpan Base64 image string.

## Solusi

### Cara 1: Menggunakan Script (Recommended)
```bash
cd backend
npm run fix-image-column
```

### Cara 2: Manual SQL
Jalankan SQL berikut di PostgreSQL:
```sql
ALTER TABLE reports 
ALTER COLUMN image TYPE TEXT;
```

### Cara 3: Menggunakan psql
```bash
psql -U postgres -d keselamatan -f ALTER_IMAGE_COLUMN.sql
```

## Verifikasi
Setelah menjalankan script, verifikasi dengan:
```sql
SELECT data_type 
FROM information_schema.columns 
WHERE table_name = 'reports' AND column_name = 'image';
```

Harus menampilkan: `text`

## Catatan
- Script ini aman untuk dijalankan berulang kali
- Tidak akan menghapus data yang sudah ada
- Hanya mengubah tipe kolom dari VARCHAR ke TEXT

