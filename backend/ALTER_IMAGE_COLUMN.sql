-- Alter image column to TEXT to support base64 images
-- Base64 images can be very long, VARCHAR(500) is not enough

ALTER TABLE reports 
ALTER COLUMN image TYPE TEXT;

-- Note: Run this SQL if you already created the table with VARCHAR(500)
-- If you haven't created the table yet, update database_setup.sql instead

