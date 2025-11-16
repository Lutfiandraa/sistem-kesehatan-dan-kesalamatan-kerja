-- ============================================
-- DATABASE SETUP SCRIPT
-- Database: keselamatan
-- ============================================

-- 1. Create function to update updated_at timestamp
-- (Harus dibuat dulu sebelum trigger)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- 2. CREATE TABLES
-- ============================================

-- Table: reports (untuk laporan pelaporan keselamatan)
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200),
    incident_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    severity VARCHAR(20) DEFAULT 'ringan' CHECK (severity IN ('ringan', 'sedang', 'berat')),
    status VARCHAR(20) DEFAULT 'belum_dicek' CHECK (status IN ('belum_dicek', 'belum_ditangani', 'dalam_penangan', 'aman')),
    image TEXT, -- Base64 image string or URL (optional)
    jenis_insiden VARCHAR(100), -- Jenis insiden from form
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: materials (untuk materi safety talks)
CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('Safety', 'Kesehatan')),
    description TEXT NOT NULL, -- This is the caption
    content TEXT NOT NULL, -- This is the full content
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: users (untuk autentikasi - opsional untuk fitur admin)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'supervisor')),
    department VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. CREATE INDEXES (untuk performa query)
-- ============================================

-- Indexes for reports table
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_severity ON reports(severity);
CREATE INDEX IF NOT EXISTS idx_reports_incident_date ON reports(incident_date);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);

-- Indexes for materials table
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category);
CREATE INDEX IF NOT EXISTS idx_materials_created_at ON materials(created_at);

-- Indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ============================================
-- 4. CREATE TRIGGERS (untuk auto-update updated_at)
-- ============================================

-- Trigger for reports table
CREATE TRIGGER update_reports_updated_at 
    BEFORE UPDATE ON reports
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for materials table
CREATE TRIGGER update_materials_updated_at 
    BEFORE UPDATE ON materials
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SELESAI!
-- ============================================
-- Setelah menjalankan script ini, tabel-tabel berikut sudah siap:
-- 1. reports - untuk menyimpan laporan pelaporan
-- 2. materials - untuk menyimpan materi safety talks
-- 3. users - untuk autentikasi (opsional)
-- ============================================

