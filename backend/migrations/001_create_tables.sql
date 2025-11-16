-- Create users table
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

-- Create incident_reports table
CREATE TABLE IF NOT EXISTS incident_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_number VARCHAR(50) UNIQUE NOT NULL,
    incident_type VARCHAR(50) NOT NULL CHECK (incident_type IN ('near_miss', 'injury', 'property_damage', 'unsafe_condition', 'unsafe_behavior', 'other')),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    incident_date TIMESTAMP NOT NULL,
    severity VARCHAR(20) DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved', 'closed')),
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP,
    resolution_notes TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create incident_attachments table
CREATE TABLE IF NOT EXISTS incident_attachments (
    id SERIAL PRIMARY KEY,
    incident_report_id INTEGER NOT NULL REFERENCES incident_reports(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create incident_comments table
CREATE TABLE IF NOT EXISTS incident_comments (
    id SERIAL PRIMARY KEY,
    incident_report_id INTEGER NOT NULL REFERENCES incident_reports(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_incident_reports_user_id ON incident_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_incident_reports_status ON incident_reports(status);
CREATE INDEX IF NOT EXISTS idx_incident_reports_incident_date ON incident_reports(incident_date);
CREATE INDEX IF NOT EXISTS idx_incident_reports_incident_type ON incident_reports(incident_type);
CREATE INDEX IF NOT EXISTS idx_incident_attachments_incident_id ON incident_attachments(incident_report_id);
CREATE INDEX IF NOT EXISTS idx_incident_comments_incident_id ON incident_comments(incident_report_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incident_reports_updated_at BEFORE UPDATE ON incident_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incident_comments_updated_at BEFORE UPDATE ON incident_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate report number
CREATE OR REPLACE FUNCTION generate_report_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.report_number IS NULL OR NEW.report_number = '' THEN
        NEW.report_number := 'SAFETY-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEW.id::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-generate report number
CREATE TRIGGER generate_incident_report_number BEFORE INSERT ON incident_reports
    FOR EACH ROW EXECUTE FUNCTION generate_report_number();

