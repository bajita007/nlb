-- COMPLETE DATABASE SETUP FOR MATERNAL HEALTH PWA
-- This script creates all necessary tables with the exact columns the code expects

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- DROP EXISTING TABLES (CLEAN SLATE)
-- =============================================
DROP TABLE IF EXISTS admin_login_logs CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS respondents CASCADE;

-- =============================================
-- CREATE ADMIN USERS TABLE
-- =============================================
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password TEXT, -- Plain text password for development
    password_hash TEXT, -- Hashed password (optional)
    full_name TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CREATE RESPONDENTS TABLE
-- =============================================
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

-- =============================================
-- CREATE NOTIFICATIONS TABLE
-- =============================================
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

-- =============================================
-- INSERT DEFAULT ADMIN USERS
-- =============================================
INSERT INTO admin_users (username, password, password_hash, full_name, email, role) VALUES
('admin', 'admin123', '$2b$10$admin123hash', 'Administrator Penelitian', 'admin@research.local', 'admin'),
('researcher', 'research2025', '$2b$10$research2025hash', 'Fitriani Sukardi, SKM', 'fitriani@research.unhas.ac.id', 'researcher');

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);
CREATE INDEX idx_respondents_nomor_telepon ON respondents(nomor_telepon);
CREATE INDEX idx_respondents_user_id ON respondents(user_id);
CREATE INDEX idx_respondents_submitted_at ON respondents(submitted_at);
CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX idx_notifications_sent_at ON notifications(sent_at);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Show created tables
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('admin_users', 'respondents', 'notifications')
ORDER BY tablename;

-- Show admin users
SELECT 
    username,
    full_name,
    email,
    role,
    is_active,
    CASE 
        WHEN password IS NOT NULL AND password_hash IS NOT NULL THEN 'both'
        WHEN password IS NOT NULL THEN 'plain'
        WHEN password_hash IS NOT NULL THEN 'hashed'
        ELSE 'none'
    END as password_type,
    created_at
FROM admin_users
ORDER BY created_at;

-- Show table row counts
SELECT 
    'admin_users' as table_name, COUNT(*) as row_count FROM admin_users
UNION ALL
SELECT 
    'respondents' as table_name, COUNT(*) as row_count FROM respondents
UNION ALL
SELECT 
    'notifications' as table_name, COUNT(*) as row_count FROM notifications;

-- Show admin_users table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'admin_users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE '✅ COMPLETE DATABASE SETUP SUCCESSFUL!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE '📊 Tables created: admin_users, respondents, notifications';
    RAISE NOTICE '👤 Admin users created:';
    RAISE NOTICE '   - admin / admin123 (Administrator)';
    RAISE NOTICE '   - researcher / research2025 (Researcher)';
    RAISE NOTICE '🔑 Password columns: password (plain), password_hash (hashed)';
    RAISE NOTICE '📈 Indexes created for performance';
    RAISE NOTICE '🚀 System ready for use!';
    RAISE NOTICE '==============================================';
END $$;
