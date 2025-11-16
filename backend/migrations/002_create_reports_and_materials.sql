-- Create reports table (simplified for public reporting)
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200),
    incident_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    severity VARCHAR(20) DEFAULT 'ringan' CHECK (severity IN ('ringan', 'sedang', 'berat')),
    status VARCHAR(20) DEFAULT 'belum_dicek' CHECK (status IN ('belum_dicek', 'belum_ditangani', 'dalam_penangan', 'aman')),
    image VARCHAR(500), -- URL or path to image (optional)
    jenis_insiden VARCHAR(100), -- Jenis insiden from form
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create materials table (for safety talks materials)
CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('Safety', 'Kesehatan')),
    description TEXT NOT NULL, -- This is the caption
    content TEXT NOT NULL, -- This is the full content
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_severity ON reports(severity);
CREATE INDEX IF NOT EXISTS idx_reports_incident_date ON reports(incident_date);
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category);
CREATE INDEX IF NOT EXISTS idx_materials_created_at ON materials(created_at);

-- Create trigger to automatically update updated_at for reports
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to automatically update updated_at for materials
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

