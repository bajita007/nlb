-- SUPER SIMPLE DATABASE SETUP
-- If redesign-admin-auth.sql fails, use this instead

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS respondents CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- Create admin_users table with dual password support
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password TEXT, -- Plain text
    password_hash TEXT, -- Hashed
    full_name TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create respondents table
CREATE TABLE respondents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    respondent_number TEXT NOT NULL,
    user_id TEXT NOT NULL,
    device_id TEXT NOT NULL,
    nama TEXT NOT NULL,
    tanggal_lahir DATE NOT NULL,
    alamat TEXT NOT NULL,
    nomor_telepon TEXT NOT NULL,
    nama_puskesmas TEXT NOT NULL,
    berat_badan TEXT NOT NULL,
    tinggi_badan TEXT NOT NULL,
    lila TEXT NOT NULL,
    pendidikan TEXT NOT NULL,
    pekerjaan TEXT NOT NULL,
    status_pernikahan TEXT NOT NULL,
    pekerjaan_suami TEXT NOT NULL,
    pendidikan_suami TEXT NOT NULL,
    riwayat_antidepresan TEXT NOT NULL,
    riwayat_keluarga_antidepresan TEXT NOT NULL,
    dukungan_suami TEXT NOT NULL,
    dukungan_keluarga TEXT NOT NULL,
    nama_anggota_keluarga TEXT,
    riwayat_masalah_kesehatan TEXT,
    masalah_kehamilan TEXT[] DEFAULT '{}',
    kuesioner INTEGER[] NOT NULL,
    total_score INTEGER NOT NULL,
    category TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    device_id TEXT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin users
INSERT INTO admin_users (username, password, password_hash, full_name, email, role) VALUES
('admin', 'admin123', '$2b$10$admin123hash', 'Administrator Penelitian', 'admin@research.local', 'admin'),
('researcher', 'research2025', '$2b$10$research2025hash', 'Fitriani Sukardi, SKM', 'fitriani@research.unhas.ac.id', 'researcher');

-- Create basic indexes
CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_respondents_nomor_telepon ON respondents(nomor_telepon);
CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id);

-- Show results
SELECT 'Setup completed!' as status;
SELECT username, full_name, role FROM admin_users;
