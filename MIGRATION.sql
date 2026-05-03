-- ============================================
-- POSTGRESQL MIGRATION & SETUP SCRIPT
-- ============================================

-- 1. Create Users Table (Optional/Admin)
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

-- Insert fallback admin user
INSERT INTO users (username, email, password_hash, full_name, role, department, is_active)
VALUES ('admin', 'admin@k3.id', '$2b$10$fallbackhashnotimportantforthisbypass', 'Admin K3', 'admin', 'Safety', true)
ON CONFLICT (username) DO NOTHING;

-- 2. Create Incident Reports Table
CREATE TABLE IF NOT EXISTS incident_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    incident_type VARCHAR(50) DEFAULT 'unsafe_condition',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    incident_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    severity VARCHAR(20) DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved', 'closed')),
    resolution_notes TEXT,
    reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Incident Attachments Table
CREATE TABLE IF NOT EXISTS incident_attachments (
    id SERIAL PRIMARY KEY,
    incident_report_id INTEGER REFERENCES incident_reports(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Incident Comments Table
CREATE TABLE IF NOT EXISTS incident_comments (
    id SERIAL PRIMARY KEY,
    incident_report_id INTEGER REFERENCES incident_reports(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Activities Table (For Kegiatan)
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert fallback sample incidents to wow the user
INSERT INTO incident_reports (user_id, incident_type, title, description, location, severity, status) VALUES
(1, 'near_miss', 'Kabel Terkelupas di Area Kerja', 'Ditemukan kabel listrik terkelupas di lantai 2 gedung workshop.', 'Gedung Workshop Lantai 2', 'medium', 'pending'),
(1, 'injury', 'Luka Gores di Tangan Kanan', 'Karyawan terkena serpihan kaca saat membersihkan area.', 'Laboratorium', 'high', 'under_review'),
(1, 'property_damage', 'Pipa Air Bocor', 'Pipa air pecah di area produksi.', 'Area Produksi 1', 'low', 'resolved')
ON CONFLICT DO NOTHING;
